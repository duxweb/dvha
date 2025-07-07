import type { IDataProviderResponse, IS3SignData } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import { useI18n, useUpload } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import clsx from 'clsx'
import { NButton, NImage, NProgress, useMessage } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useImagePreview, useModal } from '../../hooks'
import { useUploadConfig } from './config'

export const DuxImageUpload = defineComponent({
  name: 'DuxImageUpload',
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
    const image = useImagePreview()
    const { t } = useI18n()

    const styles = {
      container: 'flex gap-2',
      imageItem: 'size-80px rounded border border-muted relative group draggable flex items-center',
      imageOverlay: 'z-1 size-full inset-0 absolute flex items-center justify-center bg-default/80 transition-all opacity-0 group-hover:opacity-100 rounded',
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
      accept: 'image/*',
      method: method.value,
      onError: (error) => {
        message.error(error.message || t('components.upload.error') as string)
      },
      driver: driver.value,
    })

    watch(upload.dataFiles, (v) => {
      const files = props.multiple ? v?.map(file => file.url as string) : v?.[0]?.url as string
      model.value = files
      props.onUpdateValue?.(files)
    })

    const uploadProgress = computed(() => {
      return upload.progress.value.totalPercent
    })

    const isUploading = computed(() => {
      return upload.isUploading.value
    })

    const handleFileChange = async () => {
      upload.open()
    }

    const isMax = computed(() => {
      return props.multiple ? props.maxNum && upload.uploadFiles.value.length >= props.maxNum : true
    })

    const previewList = computed(() => {
      return upload.dataFiles.value?.map(file => file.url as string)
    })

    const modal = useModal()

    const once = ref(false)
    watch(model, (v) => {
      if (!v || !v?.length || once.value) {
        return
      }
      once.value = true
      const urls = typeof v === 'string' ? [v] : Array.isArray(v) ? v : []
      upload.addDataFiles(urls.map(url => ({ url })))
    }, {
      immediate: true,
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
            const url = file.url || URL.createObjectURL(file.file as File)
            return (
              <div
                key={index}
                class={clsx(styles.imageItem)}
              >
                <NImage
                  class="z-0 rounded"
                  objectFit="scale-down"
                  width={78}
                  height={78}
                  previewDisabled
                  src={url}
                />
                <div class={styles.imageOverlay}>
                  {file.status === 'success' && (
                    <NButton
                      quaternary
                      circle
                      size="small"
                      renderIcon={() => <div class="n-icon i-tabler:eye"></div>}
                      onClick={() => image.show(previewList.value, index)}
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
                        type: 'image',
                        multiple: props.multiple,
                        uploadParams: {
                          path: uploadPath.value,
                          accept: 'image/*',
                          maxNum: props.maxNum,
                          maxSize: props.maxSize,
                          method: method.value,
                        },
                      },
                    }).then((value: Record<string, any>[]) => {
                      upload.addDataFiles(value)
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
                        <div class="i-tabler:photo size-6"></div>
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
