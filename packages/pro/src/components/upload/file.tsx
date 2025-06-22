import type { PropType } from 'vue'
import { useI18n, useUpload } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { useDropZone } from '@vueuse/core'
import mime from 'mime'
import { NButton, NDataTable, NProgress, useMessage } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { DuxMedia } from '../media'

const typeMap: Record<string, string> = {
  'image/*': 'JPG, PNG, GIF, BMP, WEBP',
  'video/*': 'MP4, AVI, MOV, WMV, FLV',
  'audio/*': 'MP3, WAV, AAC, FLAC',
  'text/*': 'TXT, CSV, JSON, XML',
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
}

const styles = {
  container: 'flex flex-col gap-2',
  dropZone: {
    base: 'flex items-center justify-center p-6 rounded bg-muted border border-dashed transition-all cursor-pointer group',
    active: 'border-primary bg-primary/5',
    hover: 'border-accented hover:bg-primary/5 hover:border-primary',
  },
  content: 'flex flex-col items-center gap-1',
  icon: {
    wrapper: 'size-10 flex items-center justify-center rounded-full border border-dashed border-accented group-hover:border-primary transition-all cursor-pointer',
    icon: 'i-tabler:device-desktop-up size-5',
  },
  text: {
    title: 'mt-3 text-base font-medium',
    desc: 'text-sm text-muted text-center',
    highlight: 'text-primary font-medium',
  },
  table: {
    empty: 'flex items-center justify-center h-full text-muted',
    actions: 'flex gap-2',
  },
}

export const DuxFileUpload = defineComponent({
  name: 'DuxFileUpload',
  props: {
    path: { type: String, default: 'upload' },
    maxNum: Number,
    multiple: Boolean,
    maxSize: Number,
    accept: String,
    value: [String, Array<string>],
    defaultValue: [String, Array<string>],
    onUpdateValue: Function as PropType<(value?: string | string[]) => void>,
  },
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      deep: true,
      defaultValue: props.defaultValue,
    })

    const message = useMessage()
    const { t } = useI18n()
    const dropZoneRef = ref<HTMLDivElement>()

    const maxSize = computed(() => props.maxSize || 5)

    const upload = useUpload({
      path: props.path,
      multiple: props.multiple,
      maxFileCount: props.maxNum,
      maxFileSize: maxSize.value * 1024 * 1024,
      autoUpload: true,
      accept: props.accept,
      onError: error => message.error(error.message || t('components.upload.error') as string),
    })

    const { isOverDropZone } = useDropZone(dropZoneRef, {
      onDrop: (files) => {
        if (files && files.length > 0) {
          upload.addFiles(Array.from(files), 'file')
        }
      },
    })

    watch(upload.dataFiles, (v) => {
      const files = props.multiple ? v?.map(file => file.url as string) : v?.[0]?.url as string
      model.value = files
      props.onUpdateValue?.(files)
    })

    const supportedExtensions = computed(() => {
      if (!props.accept)
        return ''
      return props.accept
        .split(',')
        .map((mimeType) => {
          const trimmed = mimeType.trim()
          if (typeMap[trimmed])
            return typeMap[trimmed]
          if (trimmed.includes('*')) {
            const base = trimmed.split('/')[0]
            return typeMap[trimmed] || `${base.toUpperCase()}文件`
          }
          const ext = mime.getExtension(trimmed)
          return ext ? ext.toUpperCase() : trimmed
        })
        .filter(Boolean)
        .join(', ')
    })

    const statusName = computed(() => ({
      pending: <div class="text-info">{t('components.upload.status.pending')}</div>,
      uploading: <div class="text-info">{t('components.upload.status.uploading')}</div>,
      success: <div class="text-success">{t('components.upload.status.success')}</div>,
      error: <div class="text-error">{t('components.upload.status.error')}</div>,
    }))

    const dropZoneClass = computed(() => [
      styles.dropZone.base,
      isOverDropZone.value ? styles.dropZone.active : styles.dropZone.hover,
    ])

    const tableClass = computed(() => [
      upload.uploadFiles.value.length === 0 && 'border-b border-muted',
    ])

    return () => (
      <div class={styles.container}>
        <div ref={dropZoneRef} class={dropZoneClass.value} onClick={() => upload.open()}>
          <div class={styles.content}>
            <div class={styles.icon.wrapper}>
              <div class={styles.icon.icon}></div>
            </div>
            <div class={styles.text.title}>{t('components.upload.desc')}</div>
            <div class={styles.text.desc}>
              {isOverDropZone.value
                ? (
                    <span class={styles.text.highlight}>{t('components.upload.dropHere')}</span>
                  )
                : (
                    <>
                      {supportedExtensions.value
                        ? t('components.upload.supportFormats', { formats: supportedExtensions.value })
                        : t('components.upload.allFormats')}
                      ,
                      {' '}
                      {t('components.upload.maxSize', { size: maxSize.value })}
                    </>
                  )}
            </div>
          </div>
        </div>

        <NDataTable
          bordered={false}
          class={tableClass.value}
          columns={[
            {
              key: 'filename',
              title: t('components.upload.file.name'),
              minWidth: 200,
              render: row => <DuxMedia title={row.filename} desc={row.filetype} />,
            },
            {
              key: 'filesizeText',
              title: t('components.upload.file.size'),
              width: 120,
            },
            {
              key: 'status',
              title: t('components.upload.file.status'),
              width: 120,
              render: row => row.status === 'uploading'
                ? (
                    <NProgress
                      type="line"
                      style={{ width: '24px', height: '24px' }}
                      color="rgb(var(--ui-color-primary))"
                      indicator-placement="inside"
                      percentage={row.progress?.percent}
                      showIndicator={false}
                      height={14}
                    />
                  )
                : statusName.value[row.status],
            },
            {
              key: 'actions',
              title: t('components.upload.actions'),
              width: 120,
              render: row => (
                <div class={styles.table.actions}>
                  <NButton
                    type="warning"
                    size="small"
                    text
                    disabled={['success', 'error', 'cancelled'].includes(row.status)}
                    onClick={() => upload.cancelFiles([row.id])}
                  >
                    {t('components.upload.cancel')}
                  </NButton>
                  <NButton
                    type="error"
                    size="small"
                    text
                    onClick={() => upload.removeFiles([row.id])}
                  >
                    {t('components.upload.delete')}
                  </NButton>
                </div>
              ),
            },
          ]}
          data={upload.uploadFiles.value}
        >
          {{
            empty: () => (
              <div class={styles.table.empty}>
                {t('components.upload.empty')}
              </div>
            ),
          }}
        </NDataTable>
      </div>
    )
  },
})
