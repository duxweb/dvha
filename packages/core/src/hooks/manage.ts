import type { Ref } from 'vue'
import type { IManage } from '../types'
import { trimStart } from 'lodash-es'
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import { useManageStore } from '../stores'

export interface IManageHook {
  config: IManage
  getRoutePath: (path?: string) => string
  getApiUrl: (path?: string, dataProviderName?: string) => string
  getPath: () => string
}

/**
 * Manage
 * get manage config
 * @param name Manage name
 * @returns Manage
 */
export function useManage(name?: string): IManageHook {
  const manageRef = inject<Ref<string>>('dux.manage')
  if (!name) {
    name = manageRef?.value
  }
  if (!name) {
    throw new Error('manage name is not defined')
  }

  const { config: manage } = useManageStore(name)

  const getRoutePath = (path?: string) => {
    return `${manage?.routePrefix}/${trimStart(path || '', '/')}`
  }

  const getApiUrl = (path?: string, dataProviderName?: string) => {
    const dataProvider = manage?.dataProvider?.[dataProviderName || 'default']
    return dataProvider?.apiUrl?.(path) || ''
  }

  const route = useRoute()
  const getPath = () => {
    const fullPath = route.path
    const prefix = manage?.routePrefix || ''
    return trimStart(fullPath.replace(prefix, ''), '/')
  }

  return {
    config: manage as IManage,
    getRoutePath,
    getApiUrl,
    getPath,
  }
}
