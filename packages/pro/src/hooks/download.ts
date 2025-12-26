import { useClient, useI18n } from '@duxweb/dvha-core'
import dayjs from 'dayjs'
import mime from 'mime'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

export interface IDownloadProgress {
  loaded: number
  total?: number
  percent?: number
  speed?: number
  speedText?: string
  remainingTime?: number
}

export function useDownload() {
  const { t } = useI18n()
  const client = useClient()
  const loading = ref(false)
  const progress = ref<IDownloadProgress>({
    loaded: 0,
    total: 0,
    percent: 0,
    speed: 0,
    speedText: '0 B/s',
    remainingTime: 0,
  })
  const message = useMessage()

  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond === 0)
      return '0 B/s'
    const units = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(1024))
    return `${(bytesPerSecond / 1024 ** i).toFixed(1)} ${units[i]}`
  }

  const blob = (blobData: Blob, filename?: string) => {
    // blob 下载
    const url = window.URL || window.webkitURL
    const href = url.createObjectURL(blobData)
    const a = document.createElement('a')
    a.href = href
    a.download = filename || ''
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    url.revokeObjectURL(href)
  }

  const url = (urlString: string, filename?: string) => {
    const a = document.createElement('a')
    a.href = urlString
    a.download = filename || ''
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const image = (urlString: string) => {
    fetch(urlString).then((res) => {
      res.blob().then((e) => {
        blob(e)
      })
    }).catch((e) => {
      message.error(e.error || (t('hooks.download.failed') as string))
    })
  }

  const base64 = (base64String: string, filename: string) => {
    // base64下载
    const byteCharacters = atob(base64String.split(',')[1])
    const byteNumbers = Array.from({ length: byteCharacters.length })
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers as any)
    const e = new Blob([byteArray], { type: 'application/octet-stream' })

    blob(e, filename)
  }

  const file = (
    path: string,
    params?: Record<string, any>,
    contentType?: string,
    filename?: string,
    onProgress?: (progress: IDownloadProgress) => void,
  ) => {
    loading.value = true

    // 重置进度
    progress.value = {
      loaded: 0,
      total: 0,
      percent: 0,
      speed: 0,
      speedText: '0 B/s',
      remainingTime: 0,
    }

    const startTime = Date.now()

    client.request({
      path,
      method: 'GET',
      query: params,
      meta: {
        responseType: 'blob',
      },
      onDownloadProgress: (progressData) => {
        const currentTime = Date.now()
        const elapsedTimeMs = currentTime - startTime
        const elapsedTimeSeconds = elapsedTimeMs / 1000

        const speed = elapsedTimeSeconds > 0 ? progressData.loaded / elapsedTimeSeconds : 0
        const remainingBytes = (progressData.total || 0) - progressData.loaded
        const remainingTime = speed > 0 ? remainingBytes / speed : 0

        const progressInfo: IDownloadProgress = {
          loaded: progressData.loaded,
          total: progressData.total,
          percent: progressData.percent || 0,
          speed: Math.round(speed),
          speedText: formatSpeed(speed),
          remainingTime: Math.round(remainingTime),
        }

        progress.value = progressInfo
        onProgress?.(progressInfo)
      },
    }).then((e) => {
      const headers = e.headers || e.raw?.headers || {}
      const type = contentType || headers['content-type'] || headers['Content-Type']
      const contentDisposition = headers['content-disposition'] || headers['Content-Disposition']

      if (!filename) {
        filename = dayjs().format('YYYY-MM-DD-HH:mm:ss')
        if (type) {
          const pureType = type.split(';')[0]?.trim()
          const ext = pureType ? mime.getExtension(pureType) : undefined
          if (ext)
            filename = `${filename}.${ext}`
        }
      }

      if (contentDisposition) {
        const matches = /filename=["']?([^"']+)/.exec(contentDisposition)
        if (matches && matches?.length > 1) {
          filename = decodeURIComponent(matches[1])
        }
      }

      const blobData = e.data instanceof Blob ? e.data : new Blob([e.data], { type: type || 'application/octet-stream' })
      blob(blobData, filename)

      // 下载完成时设置进度为100%
      const finalProgress: IDownloadProgress = {
        loaded: progress.value.total || progress.value.loaded,
        total: progress.value.total || progress.value.loaded,
        percent: 100,
        speed: 0,
        speedText: formatSpeed(0),
        remainingTime: 0,
      }
      progress.value = finalProgress
      onProgress?.(finalProgress)
    }).catch((e) => {
      message.error(e.error || e.message || (t('hooks.download.failed') as string))
    }).finally(() => {
      loading.value = false
    })
  }

  return {
    file,
    url,
    blob,
    base64,
    loading,
    progress,
    image,
  }
}
