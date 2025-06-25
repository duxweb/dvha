import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores'
import type { IAuthActionResponse, IAuthCheckResponse, IAuthErrorResponse, IAuthLoginResponse, IAuthLogoutResponse, IAuthProvider, IDataProviderError } from '../types'
import axios from 'axios'

export interface ISimpleAuthProviderProps {
  apiPath?: {
    login?: string
    check?: string
    logout?: string
    register?: string
    forgotPassword?: string
    updatePassword?: string
  }
  routePath?: {
    login?: string
    index?: string
  }
  dataProviderName?: string
}

export function simpleAuthProvider(props?: ISimpleAuthProviderProps): IAuthProvider {
  return {
    login: async (params: any, manage: IManageHook): Promise<IAuthLoginResponse> => {
      return await axios.post(manage.getApiUrl(props?.apiPath?.login || '/login', props?.dataProviderName), params).then((res) => {
        return {
          success: true,
          message: res?.data?.message,
          redirectTo: props?.routePath?.index || '/',
          data: res?.data?.data as IUserState,
        }
      }).catch((error) => {
        return {
          success: false,
          message: error?.response?.data?.message || error?.message,
        }
      })
    },
    check: async (_params?: any, manage?: IManageHook, auth?: IUserState): Promise<IAuthCheckResponse> => {
      return await axios.get(manage?.getApiUrl(props?.apiPath?.check || '/check', props?.dataProviderName) || '', {
        headers: {
          Authorization: auth?.token || '',
        },
      }).then((res: any) => {
        return {
          success: true,
          logout: false,
          message: res?.data?.message,
          data: res?.data?.data as IUserState,
        }
      }).catch((error) => {
        return {
          success: false,
          logout: true,
          message: error?.response?.data?.message || error?.message,
        }
      })
    },
    onError: async (error?: IDataProviderError): Promise<IAuthErrorResponse> => {
      if (error?.status === 401) {
        return {
          logout: true,
          redirectTo: props?.routePath?.login || '/login',
          error,
        }
      }

      return {
        logout: false,
        error,
      }
    },
    logout: async (): Promise<IAuthLogoutResponse> => {
      return {
        success: true,
        redirectTo: props?.routePath?.login || '/login',
      }
    },
    register: async (params: any, manage?: IManageHook): Promise<IAuthLoginResponse> => {
      return await axios.post(manage?.getApiUrl(props?.apiPath?.register || '/register', props?.dataProviderName) || '', params).then((res: any) => {
        return {
          success: true,
          message: res?.data?.message,
          redirectTo: props?.routePath?.index || '/',
          data: res?.data?.data as IUserState,
        }
      }).catch((error) => {
        return {
          success: false,
          message: error?.response?.data?.message || error?.message,
        }
      })
    },
    forgotPassword: async (params: any, manage?: IManageHook): Promise<IAuthActionResponse> => {
      return await axios.post(manage?.getApiUrl(props?.apiPath?.forgotPassword || '/forgot-password', props?.dataProviderName) || '', params).then((res: any) => {
        return {
          success: true,
          message: res?.data?.message,
          redirectTo: props?.routePath?.login || '/login',
        }
      }).catch((error) => {
        return {
          success: false,
          message: error?.response?.data?.message || error?.message,
        }
      })
    },
    updatePassword: async (params: any, manage?: IManageHook): Promise<IAuthActionResponse> => {
      return await axios.post(manage?.getApiUrl(props?.apiPath?.updatePassword || '/update-password', props?.dataProviderName) || '', params).then((res: any) => {
        return {
          success: true,
          message: res?.data?.message,
          redirectTo: props?.routePath?.login || '/login',
        }
      }).catch((error) => {
        return {
          success: false,
          message: error?.response?.data?.message || error?.message,
        }
      })
    },
    can: (name: string, _params?: any, _manage?: IManageHook, auth?: IUserState): boolean => {
      if (!auth?.permission || (Array.isArray(auth?.permission) && auth?.permission?.length === 0) || (typeof auth?.permission === 'object' && Object.keys(auth?.permission).length === 0)) {
        return true
      }

      if (Array.isArray(auth?.permission) && !auth?.permission?.includes(name)) {
        return false
      }

      if (typeof auth?.permission === 'object' && auth?.permission[name] === false) {
        return false
      }

      return true
    },
  }
}
