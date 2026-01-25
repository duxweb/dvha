import type { IDataProviderResponse } from '../../types'
import type { IUploadDriver, IUploadDriverOptions } from './types'
import axios from 'axios'
import { useClient } from '../data'

export interface IS3SignData {
  uploadUrl: string
  url: string
  params?: Record<string, string>
}

export function createS3UploadDriver(config: {
  signPath: string
  signCallback?: (response: IDataProviderResponse) => IS3SignData
  [key: string]: any
}): IUploadDriver {
  const client = useClient()

  return {
    async upload(file: File, options: IUploadDriverOptions): Promise<IDataProviderResponse> {
      const signResponse = await client.request({
        method: 'GET',
        path: config.signPath,
        query: {
          name: file.name,
          size: file.size,
          mime: file.type,
          ...options.params,
        },
        signal: options.signal,
        onUploadProgress: options.onUploadProgress,
      })

      const signData = config.signCallback?.(signResponse) || {
        uploadUrl: signResponse.data?.uploadUrl,
        url: signResponse.data?.url,
        params: signResponse.data?.params,
      }

      if (!signData.uploadUrl) {
        throw new Error('Upload URL is required')
      }

      if (!signData.url) {
        throw new Error('File URL is required')
      }

      const method = options.method || 'POST'
      let uploadPayload: File | FormData | null = null
      const headers = options.headers || {}

      if (method === 'PUT') {
        uploadPayload = file
        headers['Content-Type'] = file.type || 'application/octet-stream'
      }
      else {
        const formData = new FormData()
        if (signData.params) {
          Object.entries(signData.params).forEach(([key, value]) => {
            formData.append(key, String(value))
          })
        }
        formData.append('file', file)

        uploadPayload = formData
      }

      const uploadResponse = await axios.request({
        method,
        url: signData.uploadUrl,
        data: uploadPayload,
        signal: options.signal,
        headers,
        onUploadProgress: (progressEvent) => {
          if (options.onUploadProgress && progressEvent.total) {
            const percent = Math.max(0, Math.min(100, Math.round((progressEvent.loaded * 100) / progressEvent.total)))
            options.onUploadProgress({
              loaded: Math.min(progressEvent.loaded, progressEvent.total),
              total: progressEvent.total,
              percent,
            })
          }
        },
      })

      if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
        throw new Error(`S3 upload failed: ${uploadResponse.statusText}`)
      }

      await client.request({
        method: 'PUT',
        path: config.signPath,
        payload: {
          url: signData.url,
          filename: file.name,
          size: file.size,
          mime: file.type,
        },
        signal: options.signal,
      })

      return {
        data: {
          url: signData.url,
          filename: file.name,
          size: file.size,
          mime: file.type,
        },
        message: 'upload successful',
      }
    },
  }
}
