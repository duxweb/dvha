import axios from 'axios'
import { IAuthProvider, IAuthLoginResponse, IAuthCheckResponse, IAuthLogoutResponse, IAuthErrorResponse, IAuthActionResponse } from '../types'
import { IUserState } from '../stores'
import { IManageHook } from '../hooks'

export const simpleAuthProvider: IAuthProvider = {
  login: async (params: any, manage: IManageHook): Promise<IAuthLoginResponse> => {
    return await axios.post(manage.getApiUrl('/login'), params).then((res) => {
      return {
        success: true,
        message: res?.data?.message,
        redirectTo: '/',
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
    return await axios.get(manage?.getApiUrl('/check') || '').then((res: any) => {
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
        redirectTo: '/login',
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
      redirectTo: '/login',
    }
  },
  register: async (params: any, manage?: IManageHook): Promise<IAuthLoginResponse> => {
    return await axios.post(manage?.getApiUrl('/auth/register') || '', params).then((res: any) => {
      return {
        success: true,
        message: res?.data?.message,
        redirectTo: '/',
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
    return await axios.post(manage?.getApiUrl('/auth/forgot-password') || '', params).then((res: any) => {
      return {
        success: true,
        message: res?.data?.message,
        redirectTo: '/login',
      }
    }).catch((error) => {
      return {
        success: false,
        message: error?.response?.data?.message || error?.message,
      }
    })
  },
  updatePassword: async (params: any, manage?: IManageHook): Promise<IAuthActionResponse> => {
    return await axios.post(manage?.getApiUrl('/auth/update-password') || '', params).then((res: any) => {
      return {
        success: true,
        message: res?.data?.message,
        redirectTo: '/login',
      }
    }).catch((error) => {
      return {
        success: false,
        message: error?.response?.data?.message || error?.message,
      }
    })
  },
}
