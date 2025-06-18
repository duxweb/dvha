import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export interface IUserState {
  token?: string
  id?: number
  info?: Record<string, any>
  permission?: any
}

export interface AuthStoreState {
  data: Ref<IUserState | undefined>
  getUser: () => IUserState
  login: (params: IUserState) => void
  isLogin: () => boolean
  logout: () => void
  update: (params: IUserState) => void
  updateKey: (key: string, value: any) => void
}

/**
 * use auth store
 * @param manageName manage name
 * @returns auth store
 */
export function useAuthStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const authStore = createAuthStore(manageName)
  return authStore()
}

/**
 * create auth store
 * @param manageName manage name
 * @returns auth store
 */
function createAuthStore(manageName: string) {
  return defineStore<string, AuthStoreState>(`auths-${manageName}`, () => {
    const data = ref<IUserState>()

    const isLogin = (): boolean => {
      return !!data.value?.token
    }

    const getUser = (): IUserState => {
      return data.value || {}
    }

    const login = (params: IUserState) => {
      data.value = {
        token: params?.token,
        id: params?.id,
        info: params?.info,
        permission: params?.permission,
      }
    }

    const update = (params: IUserState) => {
      data.value = {
        token: params?.token,
        id: params?.id,
        info: params?.info,
        permission: params?.permission,
      }
    }

    const updateKey = (key: string, value: any) => {
      data.value = {
        ...data.value,
        [key]: value,
      }
    }

    const logout = () => {
      data.value = undefined
    }

    return {
      data,
      getUser,
      login,
      isLogin,
      logout,
      update,
      updateKey,
    }
  }, {
    persist: true,
  })
}
