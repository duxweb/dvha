import type { I18nOptions } from 'vue-i18n'
import type { I18nProvider } from '../types'
import { createI18n } from 'vue-i18n'

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
      const result = i18n.global.t(key, options)
      if (result === key && defaultMessage) {
        return defaultMessage
      }
      return result
    },
    changeLocale: (lang: string, _options?: any): Promise<any> => {
      return new Promise((resolve) => {
        i18n.global.locale.value = lang
        resolve(lang)
      })
    },
    loadLocale: (lang: string, file: Record<string, unknown>) => {
      return new Promise((resolve) => {
        i18n.global.setLocaleMessage(lang, file)
        resolve(lang)
      })
    },
    mergeLocale: (lang: string, messages: Record<string, unknown>) => {
      i18n.global.mergeLocaleMessage(lang, messages)
    },
    getLocale: () => {
      return i18n.global.locale.value
    },
    getLocales: () => {
      return i18n.global.availableLocales.map(locale => locale)
    },
  }
}
