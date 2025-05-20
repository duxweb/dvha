import { useIsLogin, useManage } from '@/hooks'
import type { NavigationGuardWithThis } from 'vue-router'

/**
 * Auth guard
 * @param path
 * @returns
 */
export function authGuard(path?: string): NavigationGuardWithThis<any> {
  return function(_to, _from, next) {
    const isLogin = useIsLogin()
    const { getRoutePath } = useManage()
    if (isLogin) {
      return next()
    }
    return next({ path: getRoutePath(path || '/login') })
  }
}
