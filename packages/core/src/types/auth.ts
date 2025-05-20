import type { IUserState } from '@/stores/auth'

/**
 * 认证提供者
 * 为全局或管理端提供自定义认证服务
 */
export interface IAuthProvider {
  login: (params: any) => IAuthLoginResponse
  check: (params?: any) => IAuthCheckResponse
  logout: (params?: any) => IAuthLogoutResponse
  onError: (params?: any) => IAuthErrorResponse

  register: (params: any) => IAuthLoginResponse
  forgotPassword: (params: any) => IAuthActionResponse
  updatePassword: (params: any) => IAuthActionResponse
}

export interface IAuthActionResponse {
  success: boolean
  message: string
  redirectTo?: string
  [key: string]: unknown
}

export interface IAuthLoginResponse extends IAuthActionResponse {
  data: IUserState
}

export interface IAuthCheckResponse extends IAuthActionResponse {
  data: IUserState
  logout?: boolean
}

export interface IAuthLogoutResponse extends IAuthActionResponse {
  logout?: boolean
}

export interface IAuthErrorResponse {
  logout?: boolean
  redirectTo?: string
  error: any
}
