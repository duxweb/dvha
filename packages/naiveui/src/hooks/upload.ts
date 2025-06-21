import type { IUseUploadProps } from '@duxweb/dvha-core'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { useUpload } from '@duxweb/dvha-core'
import { watch } from 'vue'

export function useNaiveUpload(props?: IUseUploadProps) {
  const upload = useUpload(props)

  const activeRequests = new Map<string, {
    onFinish?: () => void
    onError?: () => void
    onProgress?: (event: { percent: number }) => void
  }>()

  watch(
    () => upload.uploadFiles.value,
    (files) => {
      files.forEach((file) => {
        const callbacks = activeRequests.get(file.id)
        if (!callbacks)
          return

        if (file.status === 'uploading' && file.progress && callbacks.onProgress) {
          callbacks.onProgress({
            percent: file.progress.percent || 0,
          })
        }
        else if (file.status === 'success') {
          callbacks.onFinish?.()
          activeRequests.delete(file.id)
        }
        else if (file.status === 'error') {
          callbacks.onError?.()
          activeRequests.delete(file.id)
        }
      })
    },
    { deep: true },
  )

  const request = (options: UploadCustomRequestOptions) => {
    const { file, onFinish, onError, onProgress } = options

    const nativeFile = file.file
    if (!nativeFile) {
      onError?.()
      return
    }

    upload.addFiles([nativeFile], 'file').then(() => {
      const uploadFile = upload.uploadFiles.value.find(f => f.file === nativeFile)
      if (!uploadFile) {
        onError?.()
        return
      }

      activeRequests.set(uploadFile.id, {
        onFinish,
        onError,
        onProgress,
      })

      upload.trigger().catch(() => {
        activeRequests.delete(uploadFile.id)
        onError?.()
      })
    }).catch(() => {
      onError?.()
    })
  }

  return {
    ...upload,
    request,
  }
}
