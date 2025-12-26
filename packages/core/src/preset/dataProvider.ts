import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores'
import type { IDataProvider, IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderError, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderResponse, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from '../types'
import axios from 'axios'
import { trim } from 'lodash-es'

export interface ISimpleDataProviderProps {
  apiUrl: string
  successCallback?: (res: any) => IDataProviderResponse
  errorCallback?: (err: any) => IDataProviderError
  getTotal?: (options: IDataProviderResponse) => number
}

// 检查对象是否包含File类型
function hasFileInObject(obj: any): boolean {
  return Object.values(obj).some((value) => {
    if (value instanceof File)
      return true
    if (Array.isArray(value))
      return value.some(item => item instanceof File)
    if (value && typeof value === 'object')
      return hasFileInObject(value)
    return false
  })
}

// 将包含File的对象转换为FormData
function convertToFormData(data: any): FormData {
  const formData = new FormData()

  const append = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fieldName = prefix ? `${prefix}[${key}]` : key

      if (value instanceof File) {
        formData.append(fieldName, value)
      }
      else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${fieldName}[${index}]`, item)
          }
          else if (item != null) {
            formData.append(`${fieldName}[${index}]`, String(item))
          }
        })
      }
      else if (value && typeof value === 'object') {
        append(value, fieldName)
      }
      else if (value != null) {
        formData.append(fieldName, String(value))
      }
    })
  }

  append(data)
  return formData
}

export function simpleDataProvider(props: ISimpleDataProviderProps): IDataProvider {
  const apiUrl = (path?: string, basePath?: string): string => {
    const prefixUrl = `${trim(props.apiUrl, '/')}${basePath ? `/${trim(basePath, '/')}` : ''}`
    return path ? `${prefixUrl}/${trim(path || '', '/')}` : prefixUrl
  }

  return {
    apiUrl,
    getList: (options: IDataProviderListOptions, manage?: IManageHook, auth?: IUserState) => {
      const params: Record<string, any> = {}

      if (options.pagination && typeof options.pagination === 'object') {
        params.page = options.pagination.page
        params.pageSize = options.pagination.pageSize
      }

      return axios.get(apiUrl(options.path, manage?.config.apiBasePath) || '', {
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
    create: (options: IDataProviderCreateOptions, manage?: IManageHook, auth?: IUserState) => {
      // 检查并转换包含File的数据
      let requestData = options.data
      if (options.data && typeof options.data === 'object' && !Array.isArray(options.data) && !(options.data instanceof FormData)) {
        if (hasFileInObject(options.data)) {
          requestData = convertToFormData(options.data)
        }
      }

      return axios.post(apiUrl(options.path, manage?.config.apiBasePath) || '', requestData, {
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
    update: (options: IDataProviderUpdateOptions, manage?: IManageHook, auth?: IUserState) => {
      let requestData = options.data
      if (options.data && typeof options.data === 'object' && !Array.isArray(options.data) && !(options.data instanceof FormData)) {
        if (hasFileInObject(options.data)) {
          requestData = convertToFormData(options.data)
        }
      }

      return axios.put(apiUrl(options.id ? `${options.path}/${options.id}` : options.path, manage?.config.apiBasePath) || '', requestData, {
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
    deleteOne: (options: IDataProviderDeleteOptions, manage?: IManageHook, auth?: IUserState) => {
      return axios.delete(apiUrl(options.id ? `${options.path}/${options.id}` : options.path, manage?.config.apiBasePath) || '', {
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
    getOne: (options: IDataProviderGetOneOptions, manage?: IManageHook, auth?: IUserState) => {
      return axios.get(apiUrl(options.id ? `${options.path}/${options.id}` : options.path, manage?.config.apiBasePath) || '', {
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
    getMany: (options: IDataProviderGetManyOptions, manage?: IManageHook, auth?: IUserState) => {
      return axios.get(apiUrl(options.path, manage?.config.apiBasePath) || '', {
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
    createMany: (options: IDataProviderCreateManyOptions, manage?: IManageHook, auth?: IUserState) => {
      return axios.post(apiUrl(options.path, manage?.config.apiBasePath) || '', options.data, {
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
    updateMany: (options: IDataProviderUpdateManyOptions, manage?: IManageHook, auth?: IUserState) => {
      return axios.put(apiUrl(options.path, manage?.config.apiBasePath) || '', {
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
    deleteMany: (options: IDataProviderDeleteManyOptions, manage?: IManageHook, auth?: IUserState) => {
      return axios.delete(apiUrl(options.path, manage?.config.apiBasePath) || '', {
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
        url: apiUrl(options.path, manage?.config.apiBasePath) || '',
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
    getTotal: (options: IDataProviderResponse) => {
      return props.getTotal ? props.getTotal(options) : options.meta?.total || 0
    },
  }
}

function handleResponse(res: any): IDataProviderResponse {
  const normalizedData = typeof res.data?.data === 'undefined' ? res.data : res.data?.data

  return {
    message: res.data?.message,
    data: normalizedData,
    meta: res.data?.meta,
    raw: res.data,
    headers: res.headers,
    status: res.status,
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
