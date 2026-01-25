import type { TransferOption, TransferProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useList } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NAvatar, NSpin, NTransfer } from 'naive-ui'
import { defineComponent, ref, toRef, watch } from 'vue'

export type TransferFieldResolver = string | ((row: Record<string, any>) => string)

export interface DuxTransferProps extends TransferProps {
  path: string
  params?: Record<string, any>
  value?: Array<string | number>
  labelField?: TransferFieldResolver
  valueField?: string
  imageField?: string
  descField?: TransferFieldResolver
}

export const DuxTransfer = defineComponent<DuxTransferProps>({
  name: 'DuxTransfer',
  props: {
    path: String,
    params: {
      type: Object,
    },
    labelField: {
      type: [String, Function] as PropType<TransferFieldResolver>,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'id',
    },
    imageField: {
      type: String,
    },
    descField: {
      type: [String, Function] as PropType<TransferFieldResolver>,
    },
  },
  extends: NTransfer,
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue || [],
    })

    const path = toRef(props, 'path', '')
    const params = toRef(props, 'params', {})

    const options = ref<TransferOption[]>([])

    const { data, isLoading } = useList({
      path: path.value,
      filters: params.value,
    })

    const resolveField = (row: Record<string, any>, field: TransferFieldResolver | undefined, fallback: string) => {
      if (typeof field === 'function') {
        return field(row) || ''
      }
      const key = field || fallback
      return row[key] ?? ''
    }

    const resolveList = (res: any) => {
      if (Array.isArray(res?.data)) {
        return res.data
      }
      if (Array.isArray(res?.data?.list)) {
        return res.data.list
      }
      if (Array.isArray(res?.data?.data)) {
        return res.data.data
      }
      if (Array.isArray(res?.list)) {
        return res.list
      }
      if (Array.isArray(res?.value?.data)) {
        return res.value.data
      }
      return []
    }

    watch(data, (res) => {
      const list = resolveList(res)
      options.value = list.map((row: Record<string, any>) => {
        const item: Record<string, any> = {
          label: resolveField(row, props.labelField, 'name'),
          value: row[props.valueField || 'id'],
          raw: row,
        }
        if (props.descField) {
          item.desc = resolveField(row, props.descField, 'desc')
        }
        return item
      })
    }, {
      immediate: true,
    })

    const renderLabel = ({ option }: { option: Record<string, any> }) => {
      if (props.imageField || props.descField) {
        return (
          <div style={{
            padding: '0 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          >
            {props.imageField && (
              <NAvatar round src={option?.raw[props.imageField]} size={32} />
            )}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            >
              <div>{option?.label}</div>
              {props.descField && <div style={{ opacity: 0.6 }}>{option?.desc}</div>}
            </div>
          </div>
        )
      }
      else {
        return option?.label
      }
    }

    return () => (
      <div class="w-full">
        <NSpin show={isLoading.value}>
          <NTransfer
            {...props}
            v-model:value={model.value}
            options={options.value}
            renderSourceLabel={renderLabel}
            renderTargetLabel={renderLabel}
          />
        </NSpin>
      </div>
    )
  },
})
