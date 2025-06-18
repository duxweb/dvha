import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export interface I18nStoreState {
  lang: Ref<string>
  isInit: () => boolean
  setLocale: (value: string) => void
  getLocale: () => string
}

/**
 * use i18n store
 * @param manageName manage name
 * @returns i18n store
 */
export function useI18nStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const i18nStore = createI18nStore(manageName)
  return i18nStore()
}

/**
 * create manage store
 * @param manageName manage name
 * @returns manage store
 */
function createI18nStore(manageName: string) {
  return defineStore<string, I18nStoreState>(`i18n-${manageName}`, () => {
    const lang = ref<string>('')

    const init = ref<boolean>(false)

    const isInit = () => {
      const value = init.value
      init.value = true
      return value
    }

    const setLocale = (value: string) => {
      lang.value = value
    }

    const getLocale = () => {
      return lang.value
    }

    return {
      lang,
      isInit,
      setLocale,
      getLocale,
    }
  }, {
    persist: {
      pick: ['lang'],
    },
  })
}
