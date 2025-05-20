/**
 * 数据提供者
 * 为全局或管理端提供自定义数据源处理服务
 */
export interface IDataProvider {

  // 获取列表
  getList: (options: IDataProviderListOptions) => Promise<IDataProviderResponse>
  // 创建数据
  create: (options: IDataProviderCreateOptions) => Promise<IDataProviderResponse>
  // 更新数据
  update: (options: IDataProviderUpdateOptions) => Promise<IDataProviderResponse>
  // 删除单个数据
  deleteOne: (options: IDataProviderDeleteOptions) => Promise<IDataProviderResponse>
  // 获取单个数据
  getOne: (options: IDataProviderGetOneOptions) => Promise<IDataProviderResponse>
  // 获取多个数据
  getMany: (options: IDataProviderGetManyOptions) => Promise<IDataProviderResponse>
  // 创建多个数据
  createMany: (options: IDataProviderCreateManyOptions) => Promise<IDataProviderResponse>
  // 更新多个数据
  updateMany: (options: IDataProviderUpdateManyOptions) => Promise<IDataProviderResponse>
  // 删除多个数据
  deleteMany: (options: IDataProviderDeleteManyOptions) => Promise<IDataProviderResponse>
  // 自定义请求
  custom: (options: IDataProviderCustomOptions) => Promise<IDataProviderResponse>
}

export interface IDataProviderResponse {
  message?: string
  data?: any
  meta?: Record<string, any>
  [key: string]: any
}

export interface IDataProviderListOptions {
  path: string
  pagination?: {
    page: number
    limit: number
    pageSize: number
  } | boolean
  sorters?: Record<string, 'asc' | 'desc'>
  filters?: Record<string, any>
  meta?: Record<string, any>
}

export interface IDataProviderCreateOptions {
  path?: string
  data: any
  meta?: Record<string, any>
}

export interface IDataProviderUpdateOptions extends IDataProviderCreateOptions {
  id: string | number
}

export interface IDataProviderGetOneOptions {
  path: string
  id: string | number
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
  id: string | number
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
}
