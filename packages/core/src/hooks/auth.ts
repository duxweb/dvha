import type { IAuthActionResponse, IAuthCheckResponse, IAuthErrorResponse, IAuthLoginResponse, IAuthLogoutResponse } from '../types'
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
  const { config: manage, getRoutePath } = useManage()
  const authStore = useAuthStore()
  const router = useRouter()
  const mutate = async (data: Record<string, any>) => {
    const result = await manage.authProvider?.login(data)
    if (result?.success) {
      onSuccess?.(result)
      authStore.login(manage.name, result.data)
      router.push(getRoutePath(result.redirectTo || '/'))
      return
    }
    onError?.(result)
  }

  return {
    mutate,
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
  const { config: manage, getRoutePath } = useManage()
  const authStore = useAuthStore()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.authProvider?.logout(params)
    if (result?.success) {
      onSuccess?.(result)
      authStore.logout(manage.name)
      router.push(getRoutePath(result.redirectTo || '/login'))
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
  const { config: manage, getRoutePath } = useManage()
  const authStore = useAuthStore()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.authProvider?.check(params)
    if (result?.success) {
      onSuccess?.(result)
      authStore.update(manage.name, result.data)
      return
    }
    onError?.(result)
    if (result?.logout) {
      router.push(getRoutePath(result.redirectTo || '/login'))
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
  const { config: manage, getRoutePath } = useManage()
  const authStore = useAuthStore()
  const router = useRouter()
  const mutate = async (data: Record<string, any>) => {
    const result = await manage.authProvider?.register(data)
    if (result?.success) {
      onSuccess?.(result)
      authStore.login(manage.name, result.data)
      router.push(getRoutePath(result.redirectTo || ''))
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
  const { config: manage, getRoutePath } = useManage()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.authProvider?.forgotPassword(params)
    if (result?.success) {
      onSuccess?.(result)
      if (result.redirectTo) {
        router.push(getRoutePath(result.redirectTo))
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
  const { config: manage, getRoutePath } = useManage()
  const router = useRouter()

  const mutate = async (params?: any) => {
    const result = await manage.authProvider?.updatePassword(params)
    if (result?.success) {
      onSuccess?.(result)
      if (result.redirectTo) {
        router.push(getRoutePath(result.redirectTo))
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

  const mutate = async (error: any) => {
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
 * Get info
 * get user info
 * @returns User info
 */
export function useGetInfo(manageName?: string) {
  const { config: manage } = useManage(manageName)
  const authStore = useAuthStore()
  const user = authStore.getUser(manage.name)
  return user.info
}

/**
 * Get permissions
 * get user permissions
 * @returns User permissions
 */
export function useGetPermissions(manageName?: string) {
  const { config: manage } = useManage(manageName)
  const authStore = useAuthStore()
  const user = authStore.getUser(manage.name)
  return user.permission
}

/**
 * Get ID
 * get user id
 * @returns User id
 */
export function useGetID(manageName?: string) {
  const { config: manage } = useManage(manageName)
  const authStore = useAuthStore()
  const user = authStore.getUser(manage.name)
  return user.id
}

/**
 * Is login
 * check if user is login
 * @returns Is login
 */
export function useIsLogin(manageName?: string) {
  const { config: manage } = useManage(manageName)
  const authStore = useAuthStore()
  return authStore.isLogin(manage.name)
}
