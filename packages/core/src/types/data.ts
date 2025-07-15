import type { MaybeRef } from 'vue'
import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores'

/**
 * 数据提供者
 * 为全局或管理端提供自定义数据源处理服务
 */
export interface IDataProvider {

  // 获取接口地址
  apiUrl?: (path?: string, basePath?: string) => string

  // 获取列表
  getList: (options: IDataProviderListOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 创建数据
  create: (options: IDataProviderCreateOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 更新数据
  update: (options: IDataProviderUpdateOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 删除单个数据
  deleteOne: (options: IDataProviderDeleteOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 获取单个数据
  getOne: (options: IDataProviderGetOneOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 获取多个数据
  getMany: (options: IDataProviderGetManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 创建多个数据
  createMany: (options: IDataProviderCreateManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 更新多个数据
  updateMany: (options: IDataProviderUpdateManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 删除多个数据
  deleteMany: (options: IDataProviderDeleteManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 自定义请求
  custom: (options: IDataProviderCustomOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  // 获取数据总数
  getTotal: (options: IDataProviderResponse) => number
}

export interface IDataProviderResponse {
  message?: string
  data?: any
  meta?: Record<string, any>
  raw?: any
  [key: string]: any
}

export interface IDataProviderError {
  status?: number
  message?: string
  data?: any
  meta?: Record<string, any>
  raw?: any
  [key: string]: any
}

export interface IDataProviderPagination {
  page?: number
  pageSize?: number
  pageCount?: number
  total?: number
}

export interface IDataProviderListOptions {
  path: string
  pagination?: IDataProviderPagination | boolean
  sorters?: MaybeRef<Record<string, 'asc' | 'desc'>>
  filters?: MaybeRef<Record<string, any>>
  meta?: Record<string, any>
}

export interface IDataProviderCreateOptions {
  path?: string
  data?: any
  meta?: Record<string, any>
}

export interface IDataProviderUpdateOptions extends IDataProviderCreateOptions {
  id?: string | number
}

export interface IDataProviderGetOneOptions {
  path: string
  id?: string | number
  meta?: Record<string, any>
}

export interface IDataProviderGetManyOptions {
  path: string
  ids: string[] | number[]
  meta?: Record<string, any>
}

export interface IDataProviderCreateManyOptions {
  path?: string
  data?: any[]
  meta?: Record<string, any>
}

export interface IDataProviderUpdateManyOptions {
  path?: string
  data?: any
  meta?: Record<string, any>
  ids: string[] | number[]
}

export interface IDataProviderDeleteManyOptions {
  path?: string
  meta?: Record<string, any>
  ids: string[] | number[]
}

export interface IDataProviderDeleteOptions {
  path?: string
  meta?: Record<string, any>
  id?: string | number
}

export interface IDataProviderProgress {
  loaded: number
  total?: number
  percent?: number
}

export interface IDataProviderCustomOptions {
  path?: string
  method?: string
  sorters?: Record<string, 'asc' | 'desc'>
  filters?: Record<string, any>
  query?: Record<string, any>
  headers?: Record<string, string>
  meta?: Record<string, any>
  payload?: any
  signal?: AbortSignal
  onUploadProgress?: (progress: IDataProviderProgress) => void
  onDownloadProgress?: (progress: IDataProviderProgress) => void
}
