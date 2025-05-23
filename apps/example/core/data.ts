import type { IDataProvider, IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions, IManageHook, IUserState } from '@dux-vue/core'
import axios from 'axios'

export const dataProvider: IDataProvider = {

  getList: (options: IDataProviderListOptions, manage?: IManageHook, auth?: IUserState) => {
    const params: Record<string, any> = {}

    if (options.pagination && typeof options.pagination === 'object') {
      params.page = options.pagination.page
      params.limit = options.pagination.limit
      params.pageSize = options.pagination.pageSize
    }

    return axios.get(manage?.getApiUrl(options.path) || '', {
      params: {
        ...params,
        ...options.filters,
        ...options.sorters,
      },
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  create: (options: IDataProviderCreateOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.post(manage?.getApiUrl(options.path) || '', options.data, {
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  update: (options: IDataProviderUpdateOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.put(manage?.getApiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', options.data, {
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  deleteOne: (options: IDataProviderDeleteOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.delete(manage?.getApiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', {
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  getOne: (options: IDataProviderGetOneOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.get(manage?.getApiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', {
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  getMany: (options: IDataProviderGetManyOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.get(manage?.getApiUrl(options.path) || '', {
      params: {
        ids: options.ids,
      },
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  createMany: (options: IDataProviderCreateManyOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.post(manage?.getApiUrl(options.path) || '', options.data, {
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  updateMany: (options: IDataProviderUpdateManyOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.put(manage?.getApiUrl(options.path) || '', {
      ids: options.ids,
      data: options.data,
    }, {
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  deleteMany: (options: IDataProviderDeleteManyOptions, manage?: IManageHook, auth?: IUserState) => {
    return axios.delete(manage?.getApiUrl(options.path) || '', {
      params: {
        ids: options.ids,
      },
      headers: {
        Authorization: auth?.token,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
  custom: (options: IDataProviderCustomOptions, manage?: IManageHook, auth?: IUserState) => {
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
      url: manage?.getApiUrl(options.path || ''),
      method: options.method || 'GET',
      data: options.payload,
      params,
      headers: {
        Authorization: auth?.token,
        ...options.headers,
      },
      ...options.meta,
    }).then((res) => {
      return res.data
    })
  },
}
