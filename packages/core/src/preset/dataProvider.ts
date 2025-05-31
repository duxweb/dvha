import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores'
import type { IDataProvider, IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderError, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderResponse, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from '../types'
import axios from 'axios'
import { trimStart } from 'lodash-es'

export interface ISimpleDataProviderProps {
  apiUrl: string
  successCallback?: (res: any) => IDataProviderResponse
  errorCallback?: (err: any) => IDataProviderError
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
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
      })
    },
    create: (options: IDataProviderCreateOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.post(apiUrl(options.path) || '', options.data, {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
      })
    },
    update: (options: IDataProviderUpdateOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.put(apiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', options.data, {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
      })
    },
    deleteOne: (options: IDataProviderDeleteOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.delete(apiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
      })
    },
    getOne: (options: IDataProviderGetOneOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.get(apiUrl(options.id ? `${options.path}/${options.id}` : options.path) || '', {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
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
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
      })
    },
    createMany: (options: IDataProviderCreateManyOptions, _manage?: IManageHook, auth?: IUserState) => {
      return axios.post(apiUrl(options.path) || '', options.data, {
        headers: {
          Authorization: auth?.token,
        },
        ...options.meta,
      }).then((res) => {
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
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
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
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
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
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
        signal: options.signal,
        headers: {
          Authorization: auth?.token,
          ...options.headers,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          options.onUploadProgress?.({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percent,
          })
        },
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          options.onDownloadProgress?.({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percent,
          })
        },
        ...options.meta,
      }).then((res) => {
        return props.successCallback ? props.successCallback(res) : handleResponse(res)
      }).catch((err) => {
        throw props.errorCallback ? props.errorCallback(err) : handleError(err)
      })
    },
  }
}

function handleResponse(res: any): IDataProviderResponse {
  return {
    message: res.data?.message,
    data: res.data?.data,
    meta: res.data?.meta,
    raw: res.data,
  }
}

function handleError(err: any): IDataProviderError {
  return {
    message: err.response?.data?.message || err?.message,
    data: err.response?.data?.data,
    meta: err.response?.data?.meta,
    status: err.response?.data?.code || err.response?.status || 500,
    raw: err.response?.data,
  }
}
