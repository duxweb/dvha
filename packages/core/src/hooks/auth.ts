import type { IAuthActionResponse, IAuthCheckResponse, IAuthErrorResponse, IAuthLoginResponse, IAuthLogoutResponse, IDataProviderError } from '../types'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
export function useLogin({ onSuccess, onError }: IAuthLoginParams) {
  const manage = useManage()
  const authStore = useAuthStore()
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
      onSuccess?.(result)
      authStore.login(result.data)
      router.push(manage.getRoutePath(result.redirectTo || '/'))
      return
    }
    onError?.(result)
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
export function useLogout({ onSuccess, onError }: IAuthLogoutParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.logout(params, manage)
    if (result?.success) {
      onSuccess?.(result)
      authStore.logout()
      router.push(manage.getRoutePath(result.redirectTo || '/login'))
      return
    }
    onError?.(result)
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
export function useCheck({ onSuccess, onError }: IAuthCheckParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.check(params, manage)
    if (result?.success) {
      onSuccess?.(result)
      if (!result?.data) {
        throw new Error('Check response data is undefined')
      }
      authStore.update(result.data)
      return
    }
    onError?.(result)
    if (result?.logout) {
      router.push(manage.getRoutePath(result.redirectTo || '/login'))
    }
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
export function useRegister({ onSuccess, onError }: IAuthLoginParams) {
  const manage = useManage()
  const authStore = useAuthStore()
  const router = useRouter()
  const mutate = async (data: Record<string, any>) => {
    const result = await manage.config.authProvider?.register?.(data, manage)
    if (result?.success) {
      onSuccess?.(result)
      if (!result?.data) {
        throw new Error('Register response data is undefined')
      }
      authStore.login(result.data)
      router.push(manage.getRoutePath(result.redirectTo || ''))
      return
    }
    onError?.(result)
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
export function useForgotPassword({ onSuccess, onError }: IAuthActionParams) {
  const manage = useManage()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.forgotPassword?.(params, manage)
    if (result?.success) {
      onSuccess?.(result)
      if (result.redirectTo) {
        router.push(manage.getRoutePath(result.redirectTo))
      }
      return
    }
    onError?.(result)
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
export function useUpdatePassword({ onSuccess, onError }: IAuthActionParams) {
  const manage = useManage()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.config.authProvider?.updatePassword?.(params, manage)
    if (result?.success) {
      onSuccess?.(result)
      if (result.redirectTo) {
        router.push(manage.getRoutePath(result.redirectTo))
      }
      return
    }
    onError?.(result)
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

  const mutate = async (error: IDataProviderError) => {
    const result = await manage.authProvider?.onError(error)
    onCallback?.(result)
    if (result?.logout) {
      router.push(getRoutePath(result.redirectTo || '/login'))
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
