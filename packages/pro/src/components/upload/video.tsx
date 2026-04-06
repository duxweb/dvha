import type { IDataProviderResponse, IS3SignData } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import { useI18n, useUpload } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import clsx from 'clsx'
import { NButton, NProgress, useMessage } from 'naive-ui'
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useDialog, useModal } from '../../hooks'
import { useUploadConfig } from './config'

const DuxVideoThumb = defineComponent({
  name: 'DuxVideoThumb',
  props: {
    src: String,
  },
  setup(props) {
    const elRef = ref<HTMLElement>()
    const thumbUrl = ref<string>()
    let observer: IntersectionObserver | undefined

    const generateThumb = async () => {
      if (!props.src || thumbUrl.value)
        return

      const video = document.createElement('video')
      video.muted = true
      video.playsInline = true
      video.preload = 'metadata'
      // If CORS is not allowed, canvas extraction will fail; we fall back to icon.
      video.crossOrigin = 'anonymous'
      video.src = props.src

      const wait = (event: keyof HTMLMediaElementEventMap) => new Promise<void>((resolve, reject) => {
        function onResolve() {
          cleanup()
          resolve()
        }
        function onReject() {
          cleanup()
          reject(new Error('video load failed'))
        }
        function cleanup() {
          video.removeEventListener(event, onResolve)
          video.removeEventListener('error', onReject)
        }
        video.addEventListener(event, onResolve, { once: true })
        video.addEventListener('error', onReject, { once: true })
      })

      try {
        await wait('loadedmetadata')

        // Seek to a small offset to increase chance of getting a keyframe.
        // Some formats don't like non-zero seek before data is available; fall back to 0.
        const target = Number.isFinite(video.duration) && video.duration > 1 ? 0.1 : 0
        try {
          video.currentTime = target
        }
        catch {
          video.currentTime = 0
        }

        await wait('seeked')

        const w = video.videoWidth || 160
        const h = video.videoHeight || 90
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx)
          return
        ctx.drawImage(video, 0, 0, w, h)
        thumbUrl.value = canvas.toDataURL('image/jpeg', 0.75)
      }
      catch {
        // ignore
      }
      finally {
        video.removeAttribute('src')
        video.load()
      }
    }

    onMounted(() => {
      if (!elRef.value)
        return
      observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          generateThumb().finally(() => {
            observer?.disconnect()
            observer = undefined
          })
        }
      }, { rootMargin: '200px' })
      observer.observe(elRef.value)
    })

    onUnmounted(() => {
      observer?.disconnect()
      observer = undefined
    })

    return () => (
      <div ref={elRef} class="size-12 flex items-center justify-center">
        {thumbUrl.value
          ? <img src={thumbUrl.value} class="size-12 rounded object-cover" />
          : <div class="i-tabler:video size-6 text-muted" />}
      </div>
    )
  },
})

export const DuxVideoUpload = defineComponent({
  name: 'DuxVideoUpload',
  props: {
    path: {
      type: String,
      default: 'upload',
    },
    signPath: {
      type: String,
      default: '',
    },
    signCallback: Function as PropType<(response: IDataProviderResponse) => IS3SignData>,
    managePath: {
      type: String,
      default: '',
    },
    driver: {
      type: String as PropType<'local' | 's3'>,
    },
    maxNum: Number,
    maxSize: {
      type: Number,
      default: 0,
    },
    multiple: Boolean,
    manager: Boolean,
    value: [String, Array<string>],
    defaultValue: [String, Array<string>],
    onUpdateValue: Function as PropType<(value?: string | string[]) => void>,
    method: String as PropType<'POST' | 'PUT'>,
  },
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      deep: true,
      defaultValue: props.defaultValue,
    })

    const message = useMessage()
    const dialog = useDialog()
    const modal = useModal()
    const { t } = useI18n()

    const styles = {
      container: 'flex gap-2',
      item: 'size-80px rounded border border-muted relative group draggable flex items-center justify-center bg-default',
      overlay: 'z-1 size-full inset-0 absolute flex items-center justify-center bg-default/80 transition-all opacity-0 group-hover:opacity-100 rounded gap-1',
      uploadArea: 'relative size-80px text-sm rounded flex flex-col border border-dashed bg-elevated border-muted dark:border-accented hover:bg-accented/50 hover:border-accented dark:hover:bg-accented/50 dark:hover:border-accented cursor-pointer',
      uploadContent: 'flex-1 flex flex-col justify-center items-center gap-1 relative',
      progressContainer: 'size-80px flex items-center justify-center rounded',
      progressBar: 'absolute left-2 right-2 bottom-2',
    }

    const maxSize = computed(() => props.maxSize)

    const { uploadPath, managePath, driver, method } = useUploadConfig({
      driver: props?.driver,
      signPath: props?.signPath,
      signCallback: props?.signCallback,
      uploadPath: props?.path,
      managePath: props?.managePath,
      method: props?.method,
    })

    const upload = useUpload({
      path: uploadPath.value,
      multiple: props.multiple,
      maxFileCount: props.maxNum,
      maxFileSize: maxSize.value * 1024 * 1024,
      autoUpload: true,
      accept: 'video/*',
      params: props.manager ? { manager: 'true' } : undefined,
      method: method.value,
      onError: (error) => {
        message.error(error.message || t('components.upload.error') as string)
      },
      driver: driver.value,
    })

    // Keep object URLs stable per upload file (prevents new URL per render and enables caching).
    const objectUrls = ref(new Map<string, string>())
    const getFileUrl = (file: any) => {
      if (file.url)
        return file.url as string
      const existing = objectUrls.value.get(file.id)
      if (existing)
        return existing
      const created = URL.createObjectURL(file.file as File)
      objectUrls.value.set(file.id, created)
      return created
    }

    watch(upload.uploadFiles, (files) => {
      const alive = new Set((files || []).map((f: any) => f.id))
      for (const [id, url] of objectUrls.value.entries()) {
        if (!alive.has(id)) {
          URL.revokeObjectURL(url)
          objectUrls.value.delete(id)
        }
      }
    }, { deep: true })

    // If backend rejects the upload, don't keep an errored item in the list.
    watch(upload.uploadFiles, (files) => {
      const toRemove = (files || []).filter((f: any) => f?.status === 'error')
      if (toRemove.length) {
        upload.removeFiles(toRemove.map((f: any) => f.id))
      }
    }, { deep: true })

    watch(upload.dataFiles, (v) => {
      const files = props.multiple ? v?.map(file => file.url as string) : v?.[0]?.url as string
      model.value = files
      props.onUpdateValue?.(files)
    })

    const uploadProgress = computed(() => {
      return upload.progress.value.totalPercent
    })

    const isUploading = computed(() => {
      return upload.isUploading.value || upload.uploadFiles.value.some((f: any) => f?.status === 'uploading')
    })

    const handleFileChange = async () => {
      upload.open()
    }

    const isMax = computed(() => {
      return props.multiple ? props.maxNum && upload.uploadFiles.value.length >= props.maxNum : true
    })

    const previewVideo = (url?: string) => {
      if (!url)
        return
      dialog.node({
        title: t('components.button.preview'),
        render: () => (
          <div class="flex items-center justify-center">
            <video class="w-120 max-w-full" controls>
              <source src={url} />
            </video>
          </div>
        ),
      })
    }

    const pickManagerVideos = (value: Record<string, any>[] | undefined) => {
      const items = (value || []).filter((v) => {
        const mime = String(v?.filetype || '')
        const url = String(v?.url || '')
        return /^video\//i.test(mime) || /\.(?:mp4|webm|ogg|mov|m4v)$/i.test(url)
      })
      return items
    }

    watch(model, (v) => {
      if (!v || !(Array.isArray(v) ? v.length : String(v).length))
        return
      const urls = typeof v === 'string' ? [v] : Array.isArray(v) ? v : []
      const existing = (upload.dataFiles.value || []).map(f => f.url).filter(Boolean)
      const toAdd = urls.filter(url => !existing.includes(url))
      if (toAdd.length)
        upload.addDataFiles(toAdd.map(url => ({ url })))
    })

    return () => (
      <div>
        <VueDraggable
          modelValue={upload.uploadFiles.value}
          v-model={upload.uploadFiles.value}
          class={styles.container}
          draggable=".draggable"
        >
          {upload.uploadFiles.value?.map((file, index) => {
            const url = getFileUrl(file)
            return (
              <div
                key={index}
                class={clsx(styles.item)}
              >
                <DuxVideoThumb src={url} />
                <div class={styles.overlay}>
                  {file.status === 'success' && (
                    <NButton
                      quaternary
                      circle
                      size="small"
                      renderIcon={() => <div class="n-icon i-tabler:eye"></div>}
                      onClick={() => previewVideo(url)}
                    />
                  )}
                  <NButton
                    quaternary
                    circle
                    size="small"
                    renderIcon={() => <div class="n-icon i-tabler:trash"></div>}
                    onClick={() => {
                      upload.removeFiles([file.id])
                    }}
                  />
                </div>
              </div>
            )
          })}

          {(upload.uploadFiles.value.length === 0 || !isMax.value) && (
            <div
              class={styles.uploadArea}
              onClick={() => {
                handleFileChange()
              }}
            >
              {props.manager && (
                <div
                  class=" py-1 text-xs bg-muted border-b border-dashed border-accented flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    modal.show({
                      title: t('components.upload.title'),
                      width: '800px',
                      component: () => import('./manager'),
                      componentProps: {
                        path: managePath.value,
                        type: 'media',
                        multiple: props.multiple,
                        uploadParams: {
                          path: uploadPath.value,
                          accept: 'video/*',
                          maxNum: props.maxNum,
                          maxSize: props.maxSize,
                          method: method.value,
                        },
                      },
                    }).then((value: Record<string, any>[]) => {
                      const items = pickManagerVideos(value)
                      upload.addDataFiles(items)
                    })
                  }}
                >
                  <div class="i-tabler:folder size-4"></div>
                </div>
              )}

              <div class={styles.uploadContent}>
                {isUploading.value
                  ? (
                      <div class={styles.progressContainer}>
                        <div class={styles.progressBar}>
                          <NProgress
                            type="line"
                            percentage={uploadProgress.value}
                            showIndicator={false}
                            height={4}
                          />
                        </div>
                      </div>
                    )
                  : (
                      <div class="i-tabler:plus size-4"></div>
                    )}
              </div>
            </div>
          )}
        </VueDraggable>
      </div>
    )
  },
})
