import { defineStore } from 'pinia'
import { ThemeColorName, ThemeColorType } from '../hooks'
import { inject, ref } from 'vue'
import { Ref } from 'vue'

export interface ThemeState {
  primary: ThemeColorName
  info: ThemeColorName
  success: ThemeColorName
  warning: ThemeColorName
  error: ThemeColorName
  gray: ThemeColorName
}

const defaultTheme: ThemeState = {
  primary: 'blue',
  info: 'cyan',
  success: 'green',
  warning: 'amber',
  error: 'red',
  gray: 'gray',
}

export function useThemeStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const themeStore = createThemeStore(manageName)
  return themeStore()
}

function createThemeStore(manageName: string) {
  return defineStore(`theme-${manageName}`, () => {
  const theme = ref<ThemeState>(defaultTheme)

  // 主题模式存储
  const mode = ref<'light' | 'dark' | 'auto'>('auto')

  // CSS初始化状态标志
  const cssInit = ref(false)

  // 标记CSS已初始化
  function setCssInit() {
    cssInit.value = true
  }

  // 设置主题模式
  function setMode(newMode: 'light' | 'dark' | 'auto') {
    mode.value = newMode
  }

  // 设置单个颜色类型
  function setThemeColor(type: ThemeColorType, colorName: ThemeColorName) {
    theme.value[type] = colorName
  }

  // 批量设置颜色
  function setThemeColors(colors: Partial<ThemeState>) {
    Object.assign(theme.value, colors)
  }

  // 重置为默认主题
  function resetTheme() {
    theme.value = { ...defaultTheme }
  }

  // 获取当前主题
  function getTheme() {
    return theme.value
  }

  return {
    mode,
    setMode,
    theme,
    cssInit,
    setCssInit,
    setThemeColor,
    setThemeColors,
    resetTheme,
    getTheme,
  }
  }, {
    persist: {
      pick: ['theme', 'mode'],
    },
  })
}
