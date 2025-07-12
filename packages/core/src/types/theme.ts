import type { ThemeConfig } from '../hooks'
import type { ThemeState } from '../stores'

// 主题配置
export interface IConfigTheme {
  logo?: string
  darkLogo?: string
  appLogo?: string
  appDarkLogo?: string
  banner?: string
  darkBanner?: string
  config?: ThemeConfig
  defaultTheme?: ThemeState
  [key: string]: any
}

export interface ITheme {
  logo?: string
  appLogo?: string
  banner?: string
}
