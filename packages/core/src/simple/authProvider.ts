import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores'
import type { IAuthActionResponse, IAuthCheckResponse, IAuthErrorResponse, IAuthLoginResponse, IAuthLogoutResponse, IAuthProvider } from '../types'
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
      return await axios.post(manage.getApiUrl(props?.apiPath?.login, props?.dataProviderName), params).then((res) => {
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
    check: async (_params?: any, manage?: IManageHook): Promise<IAuthCheckResponse> => {
      return await axios.get(manage?.getApiUrl(props?.apiPath?.check, props?.dataProviderName) || '').then((res: any) => {
        return {
          success: true,
          message: res?.data?.message,
          data: res?.data?.data as IUserState,
        }
      }).catch((error) => {
        return {
          success: false,
          message: error?.response?.data?.message || error?.message,
        }
      })
    },
    onError: async (error?: any): Promise<IAuthErrorResponse> => {
      if (error.status === 403) {
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
      return await axios.post(manage?.getApiUrl(props?.apiPath?.register, props?.dataProviderName) || '', params).then((res: any) => {
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
      return await axios.post(manage?.getApiUrl(props?.apiPath?.forgotPassword, props?.dataProviderName) || '', params).then((res: any) => {
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
      return await axios.post(manage?.getApiUrl(props?.apiPath?.updatePassword, props?.dataProviderName) || '', params).then((res: any) => {
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
  }
}
