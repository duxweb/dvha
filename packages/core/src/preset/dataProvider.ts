import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores'
import type { IDataProvider, IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from '../types'
import axios from 'axios'
import { trimStart } from 'lodash-es'

export interface ISimpleDataProviderProps {
  apiUrl: string
}

export function simpleDataProvider(props: ISimpleDataProviderProps): IDataProvider {
  const apiUrl = (path?: string): string => {
    return path ? `${props.apiUrl}/${trimStart(path || '', '/')}` : props.apiUrl
  }

  return {

    apiUrl,

    getList: (options: IDataProviderListOptions, _manage?: IManageHook, auth?: IUserState) => {
      const params: Record<string, any> = {}

      if (options.pagination && typeof options.pagination === 'object') {
        params.page = options.pagination.page
        params.limit = options.pagination.limit
        params.pageSize = options.pagination.pageSize
      }

      return axios.get(apiUrl(options.path) || '', {
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
    create: (options: IDataProviderCreateOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.post(apiUrl(options.path) || '', options.data, {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return res.data
      })
    },
    update: (options: IDataProviderUpdateOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.put(apiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', options.data, {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return res.data
      })
    },
    deleteOne: (options: IDataProviderDeleteOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.delete(apiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return res.data
      })
    },
    getOne: (options: IDataProviderGetOneOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.get(apiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return res.data
      })
    },
    getMany: (options: IDataProviderGetManyOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.get(apiUrl(options.path) || '', {
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
    createMany: (options: IDataProviderCreateManyOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.post(apiUrl(options.path) || '', options.data, {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return res.data
      })
    },
    updateMany: (options: IDataProviderUpdateManyOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.put(apiUrl(options.path) || '', {
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
    deleteMany: (options: IDataProviderDeleteManyOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.delete(apiUrl(options.path) || '', {
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
    custom: (options: IDataProviderCustomOptions, _manage?: IManageHook, auth?: IUserState) => {
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
        url: apiUrl(options.path || ''),
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
}
