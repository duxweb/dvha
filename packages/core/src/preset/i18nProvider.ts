import type { I18nOptions } from 'petite-vue-i18n'
import type { I18nProvider } from '../types'
import { createI18n } from 'petite-vue-i18n'

export function i18nProvider(props?: I18nOptions): I18nProvider {
  const i18n = createI18n({
    legacy: false,
    locale: props?.locale,
    fallbackLocale: props?.fallbackLocale,
    messages: props?.messages,
    missingWarn: false,
    fallbackWarn: false,
  })

  return {
    t: (key: string, options?: any, defaultMessage?: string): string => {
      try {
        const result = i18n.global.t(key, options)
        if (result === key && defaultMessage) {
          return defaultMessage
        }
        return result
      }
      catch {
        return defaultMessage || key
      }
    },
    changeLocale: (lang: string, _options?: any): Promise<any> => {
      return new Promise((resolve) => {
        i18n.global.locale.value = lang
        resolve(lang)
      })
    },
    loadLocale: (lang: string, file: any) => {
      return new Promise((resolve) => {
        i18n.global.setLocaleMessage(lang, file)
        resolve(lang)
      })
    },
    getLocale: () => {
      return i18n.global.locale.value
    },
  }
}
