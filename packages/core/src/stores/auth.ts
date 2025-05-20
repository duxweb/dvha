import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface IUserState {
  token?: string
  id?: number
  info?: Record<string, any>
  permission?: Record<string, boolean>
}

export const useAuthStore = defineStore('auth', () => {
  const data = ref<Record<string, IUserState | undefined>>({})

  const isLogin = (manageName: string): boolean => {
    return !!data.value[manageName]
  }

  const getUser = (manageName: string): IUserState => {
    return data.value[manageName] || {}
  }

  const login = (manageName: string, params: IUserState) => {
    data.value = {
      ...data.value,
      [manageName]: {
        token: params.token,
        id: params.id,
        info: params.info,
        permission: params.permission,
      },
    }
  }

  const update = (manageName: string, params: IUserState) => {
    data.value = {
      ...data.value,
      [manageName]: {
        token: params.token,
        id: params.id,
        info: params.info,
        permission: params.permission,
      },
    }
  }

  const updateKey = (manageName: string, key: string, value: any) => {
    data.value = {
      ...data.value,
      [manageName]: {
        ...data.value[manageName],
        [key]: value,
      },
    }
  }

  const logout = (manageName: string) => {
    const newData = { ...data.value }
    delete newData[manageName]
    data.value = newData
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
