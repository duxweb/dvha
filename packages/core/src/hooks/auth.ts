import type { IAuthActionResponse, IAuthCheckResponse, IAuthErrorResponse, IAuthLoginResponse, IAuthLogoutResponse, IDataProviderError } from '../types'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRouteStore } from '../stores'
import { useAuthStore } from '../stores/auth'
import { useManage } from './manage'

/**
 * Auth login params
 */
export interface IAuthLoginParams {
  onSuccess?: (data?: IAuthLoginResponse) => void
  onError?: (error?: IAuthLoginResponse) => void
}

/**
 * Auth logout params
 */
export interface IAuthLogoutParams {
  onSuccess?: (data?: IAuthLogoutResponse) => void
  onError?: (error?: IAuthLogoutResponse) => void
}

/**
 * Auth check params
 */
export interface IAuthCheckParams {
  onSuccess?: (data?: IAuthCheckResponse) => void
  onError?: (error?: IAuthCheckResponse) => void
}

/**
 * Auth action params
 */
export interface IAuthActionParams {
  onSuccess?: (data?: IAuthActionResponse) => void
  onError?: (error?: IAuthActionResponse) => void
}

/**
 * Login
 * login to manage
 * @param onSuccess Login success callback
 * @param onError Login error callback
 * @returns Login method
 */
export function useLogin(props?: IAuthLoginParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const routeStore = useRouteStore()
  const router = useRouter()
  const loading = ref(false)

  const mutate = async (data: Record<string, any>) => {
    loading.value = true
    const result = await manage.config.authProvider?.login(data, manage)
    loading.value = false
    if (result?.success) {
      if (!result?.data) {
        throw new Error('Login response data is undefined')
      }
      routeStore.resetRouteInit()
      props?.onSuccess?.(result)
      authStore.login(result.data)
      router.push(manage.getRoutePath(result.redirectTo || '/'))
      return
    }
    props?.onError?.(result)
  }

  return {
    mutate,
    isLoading: loading,
  }
}

/**
 * Logout
 * logout from manage
 * @param onSuccess Logout success callback
 * @param onError Logout error callback
 * @returns Logout method
 */
export function useLogout(props?: IAuthLogoutParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.logout(params, manage)
    if (result?.success) {
      props?.onSuccess?.(result)
      authStore.logout()
      await router.replace(manage.getRoutePath(result.redirectTo || '/login'))
      setTimeout(() => {
        window.location.reload()
      }, 100)
      return
    }
    props?.onError?.(result)
  }

  return {
    mutate,
  }
}

/**
 * Check
 * check auth
 * @param onSuccess Check success callback
 * @param onError Check error callback
 * @returns Check method
 */
export function useCheck(props?: IAuthCheckParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const { mutate: handleError } = useError()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.check?.(params, manage, authStore.getUser())
    if (result?.success) {
      props?.onSuccess?.(result)
      if (!result?.data) {
        throw new Error('Check response data is undefined')
      }
      authStore.update(result.data)
      return
    }

    props?.onError?.(result)
    if (!result?.logout) {
      return
    }

    // Handle logout
    handleError({
      status: 401,
      message: result.message || 'Unauthorized',
    })
  }

  return {
    mutate,
  }
}

/**
 * Register
 * register to manage
 * @param onSuccess Register success callback
 * @param onError Register error callback
 * @returns Register method
 */
export function useRegister(props?: IAuthLoginParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const router = useRouter()
  const mutate = async (data: Record<string, any>) => {
    const result = await manage.config.authProvider?.register?.(data, manage)
    if (result?.success) {
      props?.onSuccess?.(result)
      if (!result?.data) {
        throw new Error('Register response data is undefined')
      }
      authStore.login(result.data)
      router.push(manage.getRoutePath(result.redirectTo || '/'))
      return
    }
    props?.onError?.(result)
  }
  return {
    mutate,
  }
}

/**
 * Forgot password
 * @param onSuccess Forgot password success callback
 * @param onError Forgot password error callback
 * @returns Forgot password method
 */
export function useForgotPassword(props?: IAuthActionParams) {
  const manage = useManage()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.forgotPassword?.(params, manage)
    if (result?.success) {
      props?.onSuccess?.(result)
      if (result.redirectTo) {
        router.push(manage.getRoutePath(result.redirectTo || '/'))
      }
      return
    }
    props?.onError?.(result)
  }

  return {
    mutate,
  }
}

/**
 * Update password
 * @param onSuccess Update password success callback
 * @param onError Update password error callback
 * @returns Update password method
 */
export function useUpdatePassword(props?: IAuthActionParams) {
  const manage = useManage()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.updatePassword?.(params, manage)
    if (result?.success) {
      props?.onSuccess?.(result)
      if (result.redirectTo) {
        router.push(manage.getRoutePath(result.redirectTo || '/'))
      }
      return
    }
    props?.onError?.(result)
  }

  return {
    mutate,
  }
}

/**
 * Error
 * handle auth error
 * @param onCallback Error callback
 * @returns Error method
 */
export function useError(onCallback?: (data?: IAuthErrorResponse) => void) {
  const { config: manage, getRoutePath } = useManage()
  const router = useRouter()
  const authStore = useAuthStore(manage.name)
  const routeStore = useRouteStore(manage.name)

  const mutate = async (error?: IDataProviderError) => {
    const result = await manage.authProvider?.onError(error)
    onCallback?.(result)

    if (result?.logout) {
      await authStore.logout()
      await routeStore.resetRouteInit()
      await router.replace(getRoutePath(result.redirectTo || '/login'))
      setTimeout(() => {
        // window.location.reload()
      }, 100)
    }
  }
  return {
    mutate,
  }
}

/**
 * Get auth
 * get auth info
 * @returns Auth info
 */
export function useGetAuth(manageName?: string) {
  const authStore = useAuthStore(manageName)
  const user = authStore.getUser()
  return user
}

/**
 * Is login
 * check if user is login
 * @returns Is login
 */
export function useIsLogin(manageName?: string) {
  const authStore = useAuthStore(manageName)
  return authStore.isLogin()
}

/**
 * Can
 * check if user can access the route
 * @param manageName Manage name
 * @returns Can method
 */
export function useCan(manageName?: string) {
  const manage = useManage(manageName)
  const authStore = useAuthStore(manageName)
  const user = authStore.getUser()

  const can = (name: string, params?: any) => {
    if (manage.config.authProvider?.can) {
      return manage.config.authProvider.can(name, params, manage, user)
    }
    return true
  }

  return can
}
