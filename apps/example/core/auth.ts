import type { IAuthActionResponse, IAuthCheckResponse, IAuthErrorResponse, IAuthLoginResponse, IAuthLogoutResponse, IAuthProvider, IUserState } from '@dux-vue/core'
import { useCustom, useCustomMutation } from '@dux-vue/core'

export const authProvider: IAuthProvider = {
  login: async (params: any): Promise<IAuthLoginResponse> => {
    const { mutate, isSuccess, error, data } = await useCustomMutation({
      path: '/auth/login',
      method: 'POST',
    })

    await mutate({
      payload: params,
    })

    return {
      success: isSuccess,
      message: error?.message,
      redirectTo: '/',
      data: data?.data as IUserState,
    }
  },
  check: async (_params?: any): Promise<IAuthCheckResponse> => {
    const { data } = await useCustom({
      path: '/auth/check',
    })

    return {
      success: true,
      message: data?.message,
      data: data?.data as IUserState,
    }
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
  logout: async (_params?: any): Promise<IAuthLogoutResponse> => {
    return {
      success: true,
      redirectTo: '/login',
    }
  },
  register: async (params: any): Promise<IAuthLoginResponse> => {
    const { mutate, isSuccess, data } = await useCustomMutation({
      path: '/auth/register',
      method: 'POST',
    })

    await mutate({
      payload: params,
    })

    return {
      success: isSuccess,
      message: data?.message,
      redirectTo: '/login',
      data: data?.data as IUserState,
    }
  },
  forgotPassword: async (params: any): Promise<IAuthActionResponse> => {
    const { mutate, isSuccess, data } = await useCustomMutation({
      path: '/auth/forgot-password',
      method: 'POST',
    })

    await mutate({
      payload: params,
    })

    return {
      success: isSuccess,
      message: data?.message,
      redirectTo: '/login',
    }
  },
  updatePassword: async (params: any): Promise<IAuthActionResponse> => {
    const { mutate, isSuccess, data } = await useCustomMutation({
      path: '/auth/update-password',
      method: 'POST',
    })

    await mutate({
      payload: params,
    })

    return {
      success: isSuccess,
      message: data?.message,
      redirectTo: '/login',
    }
  },
}
