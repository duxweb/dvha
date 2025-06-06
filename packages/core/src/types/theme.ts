import type { ThemeConfig } from '../hooks'

// 主题配置
export interface IConfigTheme {
  logo?: string
  darkLogo?: string
  banner?: string
  darkBanner?: string
  config?: ThemeConfig
}

export interface ITheme {
  logo?: string
  banner?: string
}
