import { inject } from 'vue'
import { useConfig } from './config'

/**
 * Manage
 * get manage config
 * @param name Manage name
 * @returns Manage
 */
export function useManage(name?: string) {
  const config = useConfig()
  if (!name) {
    name = inject<string>('dux.manage')
  }
  if (!name) {
    throw new Error('manage name is not defined')
  }
  const manage = config.manages?.find(manage => manage.name === name)
  if (!manage) {
    throw new Error(`manage ${name} is not defined`)
  }

  manage.title = `${manage.title} - ${config.title}`
  manage.copyright = manage.copyright || config.copyright
  manage.description = manage.description || config.description

  manage.routes = [...(config?.routes || []), ...(manage?.routes || [])]
  manage.theme = { ...config?.theme, ...manage?.theme }

  manage.authProvider = manage?.authProvider || config.authProvider
  manage.dataProvider = manage?.dataProvider || config.dataProvider

  manage.apiUrl = config?.apiUrl ? `${config.apiUrl}/${manage.apiUrl}` : manage.apiUrl

  const getRoutePath = (path: string) => {
    return `${manage.routePrefix}${path.startsWith('/') ? '' : '/'}${path}`
  }

  const getApiUrl = (path: string) => {
    return `${manage.apiUrl}${path.startsWith('/') ? '' : '/'}${path}`
  }

  return {
    config: manage,
    getRoutePath,
    getApiUrl,
  }
}
