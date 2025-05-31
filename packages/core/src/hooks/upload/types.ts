import type { IDataProviderCustomOptions, IDataProviderResponse } from '../../types'

export interface IUploadDriver {
  upload(file: File, options: IUploadDriverOptions): Promise<IDataProviderResponse>
}

export interface IUploadDriverOptions extends Omit<IDataProviderCustomOptions, 'onUploadProgress' | 'onDownloadProgress'> {
  method?: 'POST' | 'PUT'
  signal?: AbortSignal
  onUploadProgress?: (progressData: {
    loaded: number
    total?: number
    percent?: number
  }) => void
  params?: Record<string, string>
}