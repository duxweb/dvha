import type { PropType } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'

export const DuxSelectUpload = defineComponent({
  name: 'DuxSelectUpload',
  props: {
    maxNum: Number,
    multiple: Boolean,
    value: [String, Array, Object],
    onUpdateValue: Function as PropType<(value?: string | File | File[]) => void>,
    accept: {
      type: String,
      default: '*',
    },
  },
  setup(props, { emit }) {
    const selectedFiles = ref<File[]>([])
    const model = useVModel(props, 'value', emit)
    const { t } = useI18n()

    const displayText = computed(() => {
      const count = selectedFiles.value.length
      if (count === 0) {
        return t('components.upload.selectUpload.clickOrDrag')
      }
      return props.multiple ? t('components.upload.selectUpload.selectedFiles', { count }) : selectedFiles.value[0]?.name || ''
    })

    function handleFileChange(event: Event) {
      const files = Array.from((event.target as HTMLInputElement).files || [])

      if (props.multiple) {
        const newFiles = props.maxNum ? files.slice(0, props.maxNum) : files
        selectedFiles.value = newFiles
        model.value = newFiles
        props.onUpdateValue?.(newFiles)
      }
      else {
        const file = files[0]
        selectedFiles.value = file ? [file] : []
        model.value = file || undefined
        props.onUpdateValue?.(file)
      }
    }

    return () => (
      <div class="relative border border-dashed border-muted rounded p-8 text-center hover:border-primary transition-colors duration-200 bg-muted hover:bg-elevated">
        <input
          type="file"
          multiple={props.multiple}
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept={props.accept}
        />
        <div class="flex flex-col items-center gap-3">
          <svg class="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div>
            <p class="text-lg font-medium text-default">
              {displayText.value}
            </p>
            <p class="text-sm text-muted mt-1">
              {props.multiple ? t('components.upload.selectUpload.multipleSupport') : (props.accept !== '*' ? t('components.upload.selectUpload.acceptDesc', { accept: props.accept }) : t('components.upload.selectUpload.defaultDesc'))}
              {props.maxNum && (
                <span class="ml-2 text-warning">
                  (
                  {t('components.upload.selectUpload.maxFiles', { max: props.maxNum })}
                  )
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    )
  },
})
