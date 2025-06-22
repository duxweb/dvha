import type { IDataProviderResponse } from '../../types'
import type { IUploadDriver, IUploadDriverOptions } from './types'
import { useClient } from '../data'

export function createLocalUploadDriver(): IUploadDriver {
  const client = useClient()
  return {
    upload(file: File, options: IUploadDriverOptions): Promise<IDataProviderResponse> {
      const query: Record<string, any> = options.query || {}
      let payload: File | FormData | null = null

      if (options.method === 'PUT') {
        Object.entries(options.params || {}).forEach(([key, value]) => {
          query[key] = value
        })
        payload = file
      }
      else {
        const formData = new FormData()
        formData.append('file', file)
        Object.entries(options.params || {}).forEach(([key, value]) => {
          formData.append(key, value)
        })
        payload = formData
      }

      return client.request({
        ...options,
        query,
        method: options.method || 'POST',
        payload,
        signal: options.signal,
        onUploadProgress: options.onUploadProgress,
      })
    },
  }
}
