import type { IDataProvider, IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from '@dux-vue/core'
import { useManage } from '@dux-vue/core'
import axios from 'axios'

export const dataProvider: IDataProvider = {

  getList: (options: IDataProviderListOptions) => {
    const { getApiUrl } = useManage()

    const params: Record<string, any> = {}

    if (options.pagination && typeof options.pagination === 'object') {
      params.page = options.pagination.page
      params.limit = options.pagination.limit
      params.pageSize = options.pagination.pageSize
    }

    return axios.get(getApiUrl(options.path), {
      params: {
        ...params,
        ...options.filters,
        ...options.sorters,
      },
      ...options.meta,
    })
  },
  create: (options: IDataProviderCreateOptions) => {
    const { getApiUrl } = useManage()
    return axios.post(getApiUrl(options.path || ''), options.data, {
      ...options.meta,
    })
  },
  update: (options: IDataProviderUpdateOptions) => {
    const { getApiUrl } = useManage()
    return axios.put(getApiUrl(options.id ? `${options.path}/${options.id}` : options.path || ''), options.data, {
      ...options.meta,
    })
  },
  deleteOne: (options: IDataProviderDeleteOptions) => {
    const { getApiUrl } = useManage()
    return axios.delete(getApiUrl(options.id ? `${options.path}/${options.id}` : options.path || ''), {
      ...options.meta,
    })
  },
  getOne: (options: IDataProviderGetOneOptions) => {
    const { getApiUrl } = useManage()
    return axios.get(getApiUrl(options.id ? `${options.path}/${options.id}` : options.path || ''), {
      ...options.meta,
    })
  },
  getMany: (options: IDataProviderGetManyOptions) => {
    const { getApiUrl } = useManage()
    return axios.get(getApiUrl(options.path), {
      params: {
        ids: options.ids,
      },
      ...options.meta,
    })
  },
  createMany: (options: IDataProviderCreateManyOptions) => {
    const { getApiUrl } = useManage()
    return axios.post(getApiUrl(options.path || ''), options.data, {
      ...options.meta,
    })
  },
  updateMany: (options: IDataProviderUpdateManyOptions) => {
    const { getApiUrl } = useManage()
    return axios.put(getApiUrl(options.path || ''), {
      ids: options.ids,
      data: options.data,
    }, {
      ...options.meta,
    })
  },
  deleteMany: (options: IDataProviderDeleteManyOptions) => {
    const { getApiUrl } = useManage()
    return axios.delete(getApiUrl(options.path || ''), {
      params: {
        ids: options.ids,
      },
      ...options.meta,
    })
  },
  custom: (options: IDataProviderCustomOptions) => {
    const { getApiUrl } = useManage()

    let params: Record<string, any> = {
      ...options.query,
    }

    if (options.sorters && typeof options.sorters === 'object') {
      params = {
        ...params,
        ...options.sorters,
      }
    }

    if (options.filters && typeof options.filters === 'object') {
      params = {
        ...params,
        ...options.filters,
      }
    }

    return axios.request({
      url: getApiUrl(options.path || ''),
      method: options.method || 'GET',
      data: options.payload,
      params,
      headers: options.headers,
      ...options.meta,
    })
  },
}
