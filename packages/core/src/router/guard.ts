import type { NavigationGuardWithThis } from 'vue-router'
import { useManage } from '../hooks'
import { useAuthStore } from '../stores'

/**
 * Auth guard
 * @param path
 */
export function authGuard(path?: string): NavigationGuardWithThis<any> {
  return function (to, _from, next) {
    const manageName = to.meta.manageName as string
    const authStore = useAuthStore()
    const isLogin = authStore.isLogin(manageName)
    const { getRoutePath } = useManage(manageName)
    if (isLogin) {
      return next()
    }
    return next({ path: getRoutePath(path || '/login') })
  }
}
