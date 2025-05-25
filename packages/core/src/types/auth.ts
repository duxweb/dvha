import type { IManageHook } from '../hooks'
import type { IUserState } from '../stores/auth'

/**
 * 认证提供者
 * 为全局或管理端提供自定义认证服务
 */
export interface IAuthProvider {

  login: (params: any, manage: IManageHook) => Promise<IAuthLoginResponse>
  check: (params?: any, manage?: IManageHook) => Promise<IAuthCheckResponse>
  logout: (params?: any, manage?: IManageHook) => Promise<IAuthLogoutResponse>

  register: (params: any, manage?: IManageHook) => Promise<IAuthLoginResponse>
  forgotPassword: (params: any, manage?: IManageHook) => Promise<IAuthActionResponse>
  updatePassword: (params: any, manage?: IManageHook) => Promise<IAuthActionResponse>

  can?: (name: string, params?: any, manage?: IManageHook, auth?: IUserState) => boolean

  onError: (error?: any) => Promise<IAuthErrorResponse>
}

export interface IAuthActionResponse {
  success: boolean
  message?: string
  redirectTo?: string
  [key: string]: unknown
}

export interface IAuthLoginResponse extends IAuthActionResponse {
  data?: IUserState
}

export interface IAuthCheckResponse extends IAuthActionResponse {
  data?: IUserState
  logout?: boolean
}

export interface IAuthLogoutResponse extends IAuthActionResponse {
  logout?: boolean
}

export interface IAuthErrorResponse {
  logout?: boolean
  redirectTo?: string
  error?: any
}
