import type { IManage } from '../types'
import { cloneDeep, trim, trimStart } from 'lodash-es'
import { useConfig } from './config'
import { inject, Ref } from 'vue'

export interface IManageHook {
  config: IManage
  getRoutePath: (path?: string) => string
  getApiUrl: (path?: string) => string
}

/**
 * Manage
 * get manage config
 * @param name Manage name
 * @returns Manage
 */
export function useManage(name?: string): IManageHook {
  const config = useConfig()
  const manageRef = inject<Ref<string>>('dux.manage')
  if (!name) {
    name = manageRef?.value
  }
  if (!name) {
    throw new Error('manage name is not defined')
  }

  const manage = cloneDeep(config.manages?.find(manage => manage.name === name))
  if (!manage) {
    throw new Error(`manage ${name} is not defined`)
  }

  const title: string[] = []
  if (manage.title) {
    title.push(manage.title)
  }
  if (config.title) {
    title.push(config.title)
  }
  manage.title = title.join(' - ')

  manage.copyright = manage.copyright || config.copyright
  manage.description = manage.description || config.description

  manage.theme = { ...config?.theme, ...manage?.theme }

  manage.authProvider = manage?.authProvider || config.authProvider
  manage.dataProvider = manage?.dataProvider || config.dataProvider

  manage.layoutComponent = {
    ...config.layoutComponent,
    ...manage.layoutComponent,
  }

  manage.apiUrl = config?.apiUrl ? `${config.apiUrl}/${trim(manage.apiUrl, '/')}` : manage.apiUrl
  manage.apiUrl = trim(manage.apiUrl, '/')

  const getRoutePath = (path?: string) => {
    return `${manage.routePrefix}/${trimStart(path || '', '/')}`
  }

  const getApiUrl = (path?: string) => {
    return `${manage.apiUrl}/${trimStart(path || '', '/')}`
  }

  return {
    config: manage,
    getRoutePath,
    getApiUrl,
  }
}
