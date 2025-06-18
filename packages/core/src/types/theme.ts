import type { ThemeConfig } from '../hooks'
import type { ThemeState } from '../stores'

// 主题配置
export interface IConfigTheme {
  logo?: string
  darkLogo?: string
  banner?: string
  darkBanner?: string
  config?: ThemeConfig
  defaultTheme?: ThemeState
}

export interface ITheme {
  logo?: string
  banner?: string
}
