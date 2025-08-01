import type { UseTableProps } from '@duxweb/dvha-naiveui'
import type { NotificationReactive } from 'naive-ui'
import { useI18n } from '@duxweb/dvha-core'
import { useNaiveTable } from '@duxweb/dvha-naiveui'
import { NProgress, useMessage, useNotification } from 'naive-ui'
import { ref } from 'vue'

export function useTable(props: UseTableProps) {
  const { t } = useI18n()
  const message = useMessage()
  const notification = useNotification()
  const nRef = ref<NotificationReactive | null>(null)

  const result = useNaiveTable({
    ...props,
    // 传递导出回调
    onExportSuccess: (data) => {
      nRef.value?.destroy()
      nRef.value = null
      notification.success({
        title: t('hooks.table.exportSuccess'),
        content: t('hooks.table.exportSuccessContent', { count: data?.data?.length || 0 }),
        duration: 6000,
      })
    },
    onExportProgress: (v) => {
      if (!nRef.value && v) {
        nRef.value = notification.create({
          title: t('hooks.table.exportProgress'),
          content: () => t('hooks.table.exportProgressContent', { page: v.page || 1 }),
          avatar: () => (
            <NProgress class="size-10 text-sm" type="circle" percentage={50}>
              <div class="text-xs">
                {v.page || 1}
              </div>
            </NProgress>
          ),
          onClose: () => {
            nRef.value = null
          },
        })
      }
    },
    onExportError: (error) => {
      nRef.value?.destroy()
      nRef.value = null
      message.error(t('hooks.table.exportFailedContent', { error: error?.message || t('common.unknownError') }) as string)
    },
    // 传递导入回调
    onImportSuccess: (progress) => {
      nRef.value?.destroy()
      nRef.value = null
      notification.success({
        title: t('hooks.table.importSuccess'),
        content: t('hooks.table.importSuccessContent', { count: progress?.processedItems || 0 }),
        duration: 6000,
      })
    },
    onImportProgress: (v) => {
      if (!nRef.value) {
        nRef.value = notification.create({
          title: t('hooks.table.importProgress'),
          content: () => t('hooks.table.importProgressContent', { processed: v?.processedItems || 0, total: v?.totalItems || 0 }),
          avatar: () => (
            <NProgress class="size-10 text-sm" type="circle" percentage={v?.percentage || 0}>
              <div class="text-xs">
                {v?.percentage || 0}
                %
              </div>
            </NProgress>
          ),
          onClose: () => {
            nRef.value = null
          },
        })
      }
    },
    onImportError: (error) => {
      nRef.value?.destroy()
      nRef.value = null
      message.error(t('hooks.table.importFailedContent', { error: error?.message || t('common.unknownError') }) as string)
    },
    onBatchSuccess: (data) => {
      message.success(data?.message || t('common.success') || '')
    },
    onBatchError: (error) => {
      message.error(error?.message || t('common.error') || '')
    },
  })

  return result
}
