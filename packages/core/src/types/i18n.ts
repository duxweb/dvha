/**
 * 国际化提供者
 * 为全局或管理端提供自定义国际化服务
 */
export interface I18nProvider {
  t: (key: string, options?: any, defaultMessage?: string) => string
  changeLocale: (lang: string, options?: any) => Promise<any>
  loadLocale: (lang: string, files: Record<string, unknown>) => Promise<any>
  getLocale: () => string
}
