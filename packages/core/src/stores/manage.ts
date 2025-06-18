import type { Ref } from 'vue'
import type { IConfig, IDataProvider, IManage } from '../types'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { inject, markRaw, ref } from 'vue'

export interface ManageStoreState {
  config: Ref<IManage | undefined>
  isInit: () => boolean
  setConfig: (manageConfig: IManage, globalConfig: IConfig) => void
  getConfig: () => IManage | undefined
}

/**
 * 判断是否为 Record<string, IDataProvider> 类型
 * @param value 要判断的值
 * @returns 是否为记录类型
 */
function isDataProviderRecord(value: IDataProvider | Record<string, IDataProvider> | undefined): value is Record<string, IDataProvider> {
  return value !== null
    && value !== undefined
    && typeof value === 'object'
    && !Array.isArray(value)
    && typeof (value as any).getList !== 'function'
}

/**
 * use manage store
 * @param manageName manage name
 * @returns manage store
 */
export function useManageStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const manageStore = createManageStore(manageName)
  return manageStore()
}

/**
 * create manage store
 * @param manageName manage name
 * @returns manage store
 */
function createManageStore(manageName: string) {
  return defineStore<string, ManageStoreState>(`manages-${manageName}`, () => {
    const config = ref<IManage>()
    const isInitConfig = ref<boolean>(false)

    const isInit = () => {
      const init = isInitConfig.value
      isInitConfig.value = true
      return init
    }

    const setConfig = (manageConfig: IManage, globalConfig: IConfig) => {
      const manage = cloneDeep(manageConfig)

      const title: string[] = []
      if (manage.title) {
        title.push(manage.title)
      }
      if (globalConfig.title) {
        title.push(globalConfig.title)
      }
      manage.title = title.join(' - ')

      manage.copyright = manage.copyright || globalConfig.copyright
      manage.description = manage.description || globalConfig.description

      manage.theme = { ...globalConfig?.theme, ...manage?.theme }

      const dataProvider: Record<string, IDataProvider> = {}

      if (globalConfig?.dataProvider) {
        if (isDataProviderRecord(globalConfig.dataProvider)) {
          Object.keys(globalConfig.dataProvider).forEach((key) => {
            dataProvider[key] = globalConfig.dataProvider![key]
          })
        }
        else {
          dataProvider.default = globalConfig.dataProvider
        }
      }

      if (manage?.dataProvider) {
        if (isDataProviderRecord(manage.dataProvider)) {
          Object.keys(manage.dataProvider).forEach((key) => {
            dataProvider[key] = manage.dataProvider![key]
          })
        }
        else {
          dataProvider.default = manage.dataProvider
        }
      }

      manage.authProvider = globalConfig?.authProvider || manage?.authProvider
      manage.dataProvider = dataProvider
      manage.i18nProvider = globalConfig?.i18nProvider || manage?.i18nProvider

      manage.layoutComponent = {
        ...globalConfig.layoutComponent,
        ...manage.layoutComponent,
      }

      const components = {
        ...globalConfig.components,
        ...manage.components,
      }

      if (components) {
        Object.keys(components).forEach((key) => {
          if (components[key]) {
            components[key] = markRaw(components[key])
          }
        })
      }

      manage.components = components

      manage.remote = {
        ...globalConfig.remote,
        ...manage.remote,
      }

      config.value = manage
    }

    const getConfig = () => {
      return config.value
    }

    return {
      config,
      isInit,
      setConfig,
      getConfig,
    }
  })
}
