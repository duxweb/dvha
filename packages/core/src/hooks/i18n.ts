import { useI18nStore } from '../stores'
import { useManage } from './manage'

export function useI18n() {
  const i18nStore = useI18nStore()
  const manage = useManage()

  const t = (key: string, options?: any, defaultMessage?: string) => {
    return manage.config?.i18nProvider?.t(key, options, defaultMessage)
  }

  const changeLocale = (lang: string) => {
    i18nStore.setLocale(lang)
    return manage.config?.i18nProvider?.changeLocale(lang)
  }

  const getLocale = () => {
    return manage.config?.i18nProvider?.getLocale()
  }

  const loadLocale = (lang: string, messages: Record<string, unknown>) => {
    return manage.config?.i18nProvider?.loadLocale(lang, messages)
  }

  const mergeLocale = (lang: string, messages: Record<string, unknown>) => {
    return manage.config?.i18nProvider?.mergeLocale(lang, messages)
  }

  return {
    t,
    changeLocale,
    getLocale,
    loadLocale,
    mergeLocale,
  }
}
