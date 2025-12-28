import { useClient, useI18n } from '@duxweb/dvha-core'
import dayjs from 'dayjs'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const MIME_EXTENSION_MAP: Record<string, string> = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.ms-excel': 'xls',
  'text/csv': 'csv',
  'application/pdf': 'pdf',
  'application/json': 'json',
  'text/plain': 'txt',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'application/zip': 'zip',
  'application/octet-stream': 'bin',
}

const resolveExtension = (contentType?: string): string | undefined => {
  if (!contentType)
    return undefined
  const normalized = contentType.split(';')[0]?.trim().toLowerCase()
  if (!normalized)
    return undefined
  if (MIME_EXTENSION_MAP[normalized])
    return MIME_EXTENSION_MAP[normalized]
  const segments = normalized.split('/')
  if (segments.length > 1) {
    const suffix = segments[1].replace(/\s|\+/g, '')
    if (suffix)
      return suffix
  }
  return undefined
}

const extractFilename = (headerValue?: string): string | undefined => {
  if (!headerValue)
    return undefined
  const decoded = headerValue.trim()

  const filenameStar = decoded.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i)
  if (filenameStar?.[1]) {
    try {
      return decodeURIComponent(filenameStar[1].trim().replace(/["']/g, ''))
    } catch (error) {
      console.warn('[download] Failed to decode filename* header', error)
      return filenameStar[1].trim().replace(/["']/g, '')
    }
  }

  const filenameMatch = decoded.match(/filename\s*=\s*["']?([^"';]+)/i)
  if (filenameMatch?.[1]) {
    try {
      return decodeURIComponent(filenameMatch[1].trim())
    } catch (error) {
      console.warn('[download] Failed to decode filename header', error)
      return filenameMatch[1].trim()
    }
  }

  return undefined
}

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
    const objectUrl = window.URL || window.webkitURL
    const href = objectUrl.createObjectURL(blobData)
    const link = document.createElement('a')
    link.href = href
    if (filename)
      link.download = filename
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    objectUrl.revokeObjectURL(href)
  }

  const url = (urlString: string, filename?: string) => {
    const link = document.createElement('a')
    link.href = urlString
    if (filename)
      link.download = filename
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        responseType: 'arraybuffer',
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
      const headers = (e.headers || e.raw?.headers || {}) as Record<string, string>
      const readHeader = (key: string) => {
        if (!key)
          return undefined
        const lowerKey = key.toLowerCase()
        const upperKey = key.toUpperCase()
        return headers[key] ?? headers[lowerKey] ?? headers[upperKey]
      }
      const resolvedType = contentType || readHeader('content-type') || 'application/octet-stream'
      const dispositionFilename = extractFilename(readHeader('content-disposition'))

      let resolvedFilename = filename || dispositionFilename
      if (!resolvedFilename) {
        const fallbackExt = resolveExtension(resolvedType)
        const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss')
        resolvedFilename = fallbackExt ? `${timestamp}.${fallbackExt}` : timestamp
      }

      const responseData = (e.raw?.data ?? e.data ?? e) as Blob | ArrayBuffer | string
      const blobData = responseData instanceof Blob
        ? responseData
        : new Blob([responseData], { type: resolvedType || 'application/octet-stream' })
      blob(blobData, resolvedFilename)

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
