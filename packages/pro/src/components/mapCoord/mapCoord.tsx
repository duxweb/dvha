import type { PropType } from 'vue'
import { useI18n, useManage } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NInput, useMessage } from 'naive-ui'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'

type CoordValue = [number, number] // [lat, lng]

declare global {
  interface Window {
    T?: any
  }
}

let tiandituLoader: Promise<any> | undefined

function loadTianditu(tk: string) {
  if (window.T) {
    return Promise.resolve(window.T)
  }
  if (tiandituLoader) {
    return tiandituLoader
  }
  tiandituLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${encodeURIComponent(tk)}`
    script.onload = () => {
      if (window.T) {
        resolve(window.T)
      }
      else {
        reject(new Error('Tianditu API load failed'))
      }
    }
    script.onerror = () => reject(new Error('Tianditu API load failed'))
    document.head.appendChild(script)
  })
  return tiandituLoader
}

async function tdtGeocode(tk: string, keyword: string) {
  // Doc: http://lbs.tianditu.gov.cn/api/geocoder.html
  const ds = encodeURIComponent(JSON.stringify({ keyWord: keyword }))
  const url = `https://api.tianditu.gov.cn/geocoder?ds=${ds}&tk=${encodeURIComponent(tk)}`
  const res = await fetch(url)
  return res.json()
}

async function tdtReverseGeocode(tk: string, lng: number, lat: number) {
  const postStr = encodeURIComponent(JSON.stringify({ lon: lng, lat, ver: 1 }))
  const url = `https://api.tianditu.gov.cn/geocoder?postStr=${postStr}&type=geocode&tk=${encodeURIComponent(tk)}`
  const res = await fetch(url)
  return res.json()
}

export const DuxMapCoord = defineComponent({
  name: 'DuxMapCoord',
  props: {
    /**
     * 天地图密钥（可选）
     * - 优先使用 props.tk
     * - 否则读取 useManage().config.map.tiandituTk
     */
    tk: String,

    value: Array as PropType<CoordValue | number[] | undefined>,
    defaultValue: Array as PropType<CoordValue | number[] | undefined>,
    onUpdateValue: Function as PropType<(value?: CoordValue) => void>,

    address: String,
    defaultAddress: String,
    onUpdateAddress: Function as PropType<(value?: string) => void>,

    area: Array as PropType<string[] | undefined>,
    defaultArea: Array as PropType<string[] | undefined>,
    onUpdateArea: Function as PropType<(value?: string[]) => void>,

    height: {
      type: String,
      default: '360px',
    },
    zoom: {
      type: Number,
      default: 15,
    },
    /**
     * 是否显示地图默认控件（缩放、比例尺等）
     */
    controls: {
      type: Boolean,
      default: true,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    autoSearch: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const { config } = useManage()
    const message = useMessage()

    const tk = computed(() => {
      return props.tk || (config as any)?.map?.tiandituTk || ''
    })

    const coord = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue,
      deep: true,
    })
    const address = useVModel(props, 'address', emit, {
      passive: true,
      defaultValue: props.defaultAddress,
    })
    const area = useVModel(props, 'area', emit, {
      passive: true,
      defaultValue: props.defaultArea,
      deep: true,
    })

    const containerRef = ref<HTMLElement | null>(null)
    const mapReady = ref(false)
    const TRef = ref<any>()
    const mapRef = ref<any>()
    const markerRef = ref<any>()

    const marker = computed(() => {
      const v = coord.value as any
      if (!Array.isArray(v) || v.length < 2)
        return
      const lat = Number(v[0])
      const lng = Number(v[1])
      if (!Number.isFinite(lat) || !Number.isFinite(lng))
        return
      return { lat, lng }
    })

    const queryText = computed(() => {
      const prefix = Array.isArray(area.value) ? area.value.filter(Boolean).join('') : ''
      const addr = String(address.value || '')
      return `${prefix}${addr}`.trim()
    })

    const searching = ref(false)
    const skipNextAutoSearch = ref(false)

    async function setMarker(lat: number, lng: number) {
      await ensureMap()
      const T = TRef.value
      const map = mapRef.value
      if (!T || !map)
        return
      const point = new T.LngLat(lng, lat)
      if (markerRef.value) {
        markerRef.value.setLngLat(point)
      }
      else {
        markerRef.value = new T.Marker(point)
        map.addOverLay(markerRef.value)
      }
      map.panTo(point)
    }

    async function updateAddressByPoint(lat: number, lng: number) {
      if (!tk.value)
        return
      try {
        const res: any = await tdtReverseGeocode(tk.value, lng, lat)
        let nextAddr = String(res?.result?.formatted_address || res?.result?.address || '')
        // 只回写详细地址（尽量去掉省市区前缀）
        const prefix = Array.isArray(area.value) ? area.value.filter(Boolean).join('') : ''
        if (prefix && nextAddr.startsWith(prefix)) {
          nextAddr = nextAddr.slice(prefix.length).trim()
        }
        // 天地图常见字段：result.addressComponent.address（不含省市区）
        const detail = String(res?.result?.addressComponent?.address || '').trim()
        if (detail) {
          nextAddr = detail
        }
        if (nextAddr && !String(address.value || '').trim()) {
          // 避免反向地理编码写入 address 后又触发一次正向地理编码
          skipNextAutoSearch.value = true
          address.value = nextAddr
          props.onUpdateAddress?.(nextAddr)
        }
      }
      catch {
        // ignore
      }
    }

    const ensureMap = async () => {
      if (mapReady.value || !containerRef.value)
        return
      if (!tk.value) {
        message.error('tiandituTk 未配置')
        return
      }

      const T = await loadTianditu(tk.value)
      TRef.value = T

      const map = new T.Map(containerRef.value)
      mapRef.value = map
      // Default center (Beijing)
      map.centerAndZoom(new T.LngLat(116.404, 39.915), props.zoom)
      map.enableScrollWheelZoom()

      if (props.controls) {
        // 控件名称在天地图不同版本可能不同，这里做容错判断
        try {
          const ZoomControl = T?.Control?.Zoom || T?.Control?.ZoomControl
          if (ZoomControl) {
            map.addControl(new ZoomControl())
          }
          const ScaleControl = T?.Control?.Scale || T?.Control?.ScaleControl
          if (ScaleControl) {
            map.addControl(new ScaleControl())
          }
        }
        catch {
          // ignore
        }
      }

      map.addEventListener('click', async (e: any) => {
        const lng = Number(e?.lnglat?.lng)
        const lat = Number(e?.lnglat?.lat)
        if (!Number.isFinite(lat) || !Number.isFinite(lng))
          return
        const next: CoordValue = [lat, lng]
        coord.value = next as any
        props.onUpdateValue?.(next)
        await setMarker(lat, lng)
        await updateAddressByPoint(lat, lng)
      })

      mapReady.value = true
      await nextTick()
      // If initial coord exists, render marker.
      if (marker.value) {
        await setMarker(marker.value.lat, marker.value.lng)
        map.panTo(new T.LngLat(marker.value.lng, marker.value.lat))
      }
    }

    const doSearch = async () => {
      if (!tk.value) {
        message.error('tiandituTk 未配置')
        return
      }
      const q = queryText.value
      if (!q) {
        message.warning(t('common.keyword') || '请输入关键字')
        return
      }
      searching.value = true
      try {
        const res: any = await tdtGeocode(tk.value, q)
        const loc = res?.location || res?.result?.location
        const lng = Number(loc?.lon ?? loc?.lng)
        const lat = Number(loc?.lat)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          message.error(t('common.error') || '操作失败')
          return
        }
        const next: CoordValue = [lat, lng]
        coord.value = next as any
        props.onUpdateValue?.(next)
        await setMarker(lat, lng)
      }
      catch (e: any) {
        message.error(e?.message || (t('common.error') || '操作失败'))
      }
      finally {
        searching.value = false
      }
    }

    // debounce auto search
    let timer: any
    watch([queryText, () => props.autoSearch], ([_q, auto]) => {
      if (!auto)
        return
      if (skipNextAutoSearch.value) {
        skipNextAutoSearch.value = false
        return
      }
      // address 为空时不搜索，保持上次坐标
      if (!String(address.value || '').trim())
        return
      clearTimeout(timer)
      timer = setTimeout(() => {
        doSearch()
      }, 400)
    })

    watch(marker, (m) => {
      if (m) {
        setMarker(m.lat, m.lng)
      }
    })

    onMounted(() => {
      ensureMap().catch((e) => {
        message.error(e?.message || '地图加载失败')
      })
    })

    return () => (
      <div class="flex flex-col gap-3">
        {props.showSearch && (
          <div class="flex gap-2 items-center">
            <NInput
              value={address.value}
              onUpdateValue={(v) => {
                address.value = v
                props.onUpdateAddress?.(v)
              }}
              placeholder={t('common.keyword') || '请输入关键字'}
              clearable
            />
            <NButton type="primary" ghost loading={searching.value} onClick={doSearch}>
              {t('common.search') || '搜索'}
            </NButton>
          </div>
        )}

        <div class="w-full rounded border border-muted overflow-hidden">
          <div ref={containerRef} class="w-full" style={{ height: props.height }} />
          {!mapReady.value && (
            <div class="p-4 text-sm text-muted">
              {t('common.loading') || '加载中...'}
            </div>
          )}
        </div>
      </div>
    )
  },
})
