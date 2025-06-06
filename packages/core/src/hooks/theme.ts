import type { ITheme } from '../types'
import { useColorMode, useCycleList, useStyleTag } from '@vueuse/core'
import { computed, readonly, watch, watchEffect } from 'vue'
import { useManage } from './manage'
import { useThemeStore } from '../stores'
import { themeColor } from './themeColor'
import { storeToRefs } from 'pinia'
import { hex2rgb, formatCSS } from 'colorizr'


// 色彩类型定义
export type ThemeColorType = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'gray'
export type ThemeColorName = string
export type ThemeColorShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950'

// 场景类型定义 - 更精确的类型
export type ThemeSceneType = 'default' | 'hover' | 'pressed' | 'focus' | 'disabled'

// 色彩场景配置
export interface ThemeColorSceneConfig {
  default: string  // 默认色阶，对应 --ui-primary 不带后缀的变量
  hover: string
  pressed: string
  focus: string
  disabled: string
}

// 色彩场景组配置
export interface ThemeColorSceneGroupConfig {
  default: ThemeColorSceneConfig
  overrides?: Partial<Record<ThemeColorType, Partial<ThemeColorSceneConfig>>>
}

// 语义变量配置
export interface ThemeColorSemanticConfig {
  text: {
    dimmed: string
    muted: string
    toned: string
    base: string
    highlighted: string
    inverted: string
  }
  bg: {
    base: string
    muted: string
    elevated: string
    accented: string
    inverted: string
  }
  border: {
    base: string
    muted: string
    accented: string
    inverted: string
  }
}

// 主题配置
export interface ThemeConfig {
  colors: Record<string, Record<string, string>>
  colorTypes: ThemeColorType[]
  colorShades: ThemeColorShade[]
  colorScenes: {
    light: ThemeColorSceneGroupConfig
    dark: ThemeColorSceneGroupConfig
  }
  colorSemantic: {
    light: ThemeColorSemanticConfig
    dark: ThemeColorSemanticConfig
  }
  colorBase?: {
    white: string
    black: string
  }
}

export function useTheme() {
  const themeStore = useThemeStore()

  const { mode } = storeToRefs(themeStore)
  const colorMode = useColorMode({
    storageRef: mode,
  })
  const manage = useManage()

  const { state, next } = useCycleList(['dark', 'light', 'auto'] as const, {
    initialValue: colorMode.store.value,
  })

  watchEffect(() => {
    colorMode.value = state.value
  })

  const isDark = computed(() => {
    const { system, store } = colorMode
    if (store.value === 'auto') {
      return system.value === 'dark'
    }
    return store.value === 'dark'
  })

  const resources = computed<ITheme>(() => {
    if (isDark.value) {
      return {
        logo: manage.config?.theme?.darkLogo,
        banner: manage.config?.theme?.darkBanner,
      }
    }
    return {
      logo: manage.config?.theme?.logo,
      banner: manage.config?.theme?.banner,
    }
  })


  const defaultConfig: ThemeConfig = {
    colors: themeColor,
    // 色彩类型
    colorTypes: ['primary', 'info', 'success', 'warning', 'error', 'gray'],
    // 色彩色阶
    colorShades: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    // 色彩场景
    colorScenes: {
      light: {
        default: { default: '500', hover: '600', pressed: '700', focus: '500', disabled: '300' },
      },
      dark: {
        default: { default: '500', hover: '400', pressed: '300', focus: '500', disabled: '600' },
      },
    },
    // 语义颜色
    colorSemantic: {
      light: {
        text: { dimmed: '400', muted: '500', toned: '600', base: '700', highlighted: '900', inverted: 'white' },
        bg: { base: 'white', muted: '50', elevated: '100', accented: '200', inverted: '900' },
        border: { base: '200', muted: '200', accented: '300', inverted: '900' },
      },
      dark: {
        text: { dimmed: '600', muted: '500', toned: '400', base: '300', highlighted: '100', inverted: 'black' },
        bg: { base: '950', muted: '900', elevated: '800', accented: '700', inverted: '100' },
        border: { base: '800', muted: '800', accented: '700', inverted: '100' },
      },
    },
    colorBase: { white: '#ffffff', black: '#000000' },
  }


  // 合并配置
  const finalConfig = { ...defaultConfig, ...manage.config?.theme?.config }
  const { colorShades, colorTypes } = finalConfig


  // 使用store中的色彩映射
  const colorMapping = computed(() => themeStore.theme)


  // 获取所有可用的色彩名称
  const colors = computed(() => Object.keys(finalConfig.colors) as ThemeColorName[])

  // 色彩场景
  const colorScenes: ThemeSceneType[] = ['default', 'hover', 'pressed', 'focus', 'disabled']

  // 获取当前主题配置的辅助函数
  function getCurrentThemeConfig() {
    return isDark.value ? finalConfig.colorScenes.dark : finalConfig.colorScenes.light
  }

  // 专门获取色阶编号
  function getColorLevel(type: ThemeColorType, scene: ThemeSceneType): ThemeColorShade {
    const currentSceneGroup = getCurrentThemeConfig()
    const defaultScenes = currentSceneGroup.default

    // 如果指定了颜色类型，尝试获取特定配置
    if (currentSceneGroup.overrides?.[type]) {
      const typeSpecificScenes = currentSceneGroup.overrides[type]
      const sceneValue = typeSpecificScenes?.[scene]
      if (sceneValue) {
        return sceneValue as ThemeColorShade
      }
    }

    // 使用默认配置
    return (defaultScenes[scene] || '500') as ThemeColorShade
  }

  // 专门获取最终颜色值
  function getColorValue(type: ThemeColorType, level: ThemeColorShade): string {
    const mappedColor = colorMapping.value[type]
    return finalConfig.colors[mappedColor]?.[level] || ''
  }

  // 根据主题模式获取通用颜色值
  function getSemanticValue(category: keyof ThemeColorSemanticConfig, key: string, grayColor: string): string {
    const currentSemantic = isDark.value ? finalConfig.colorSemantic.dark : finalConfig.colorSemantic.light
    const value = currentSemantic[category][key as keyof typeof currentSemantic[typeof category]]

    if (value === 'white' || value === 'black') {
      return `var(--color-${value})`
    }
    return `var(--base-color-${grayColor}-${value})`
  }

  // 生成CSS变量字符串
  function generateCSSVariables(): string {
    const baseVars: string[] = []
    Object.entries(finalConfig.colors).forEach(([colorName, shades]) => {
      if (typeof shades === 'object') {
        Object.entries(shades).forEach(([shade, value]) => {
          try {
            const rgb = hex2rgb(value)
            const rgbaValue = formatCSS(rgb, { format: 'rgb' })
            baseVars.push(`--base-color-${colorName}-${shade}: ${rgbaValue};`)
          } catch (error) {
            baseVars.push(`--base-color-${colorName}-${shade}: ${value};`)
          }
        })
      }
    })

    //生成场景变量
    const uiVars: string[] = []
    colorTypes.forEach((type) => {
      const mappedColor = colorMapping.value[type]
      colorShades.forEach((shade) => {
        uiVars.push(`--ui-color-${type}-${shade}: var(--base-color-${mappedColor}-${shade});`)
      })

      colorScenes.forEach((scene) => {
        const sceneLevel = getColorLevel(type, scene)
        if (scene === 'default') {
          uiVars.push(`--ui-color-${type}: var(--base-color-${mappedColor}-${sceneLevel});`)
        } else {
          uiVars.push(`--ui-color-${type}-${scene}: var(--base-color-${mappedColor}-${sceneLevel});`)
        }
      })
    })

    // 生成公共变量
    const grayColor = colorMapping.value.gray
    const colorBase: string[] = [
      `--color-white: ${finalConfig.colorBase?.white || '#ffffff'};`,
      `--color-black: ${finalConfig.colorBase?.black || '#000000'};`,

      `--ui-text-dimmed: ${getSemanticValue('text', 'dimmed', grayColor)};`,
      `--ui-text-muted: ${getSemanticValue('text', 'muted', grayColor)};`,
      `--ui-text-toned: ${getSemanticValue('text', 'toned', grayColor)};`,
      `--ui-text: ${getSemanticValue('text', 'base', grayColor)};`,
      `--ui-text-highlighted: ${getSemanticValue('text', 'highlighted', grayColor)};`,
      `--ui-text-inverted: ${getSemanticValue('text', 'inverted', grayColor)};`,

      `--ui-bg: ${getSemanticValue('bg', 'base', grayColor)};`,
      `--ui-bg-muted: ${getSemanticValue('bg', 'muted', grayColor)};`,
      `--ui-bg-elevated: ${getSemanticValue('bg', 'elevated', grayColor)};`,
      `--ui-bg-accented: ${getSemanticValue('bg', 'accented', grayColor)};`,
      `--ui-bg-inverted: ${getSemanticValue('bg', 'inverted', grayColor)};`,

      `--ui-border: ${getSemanticValue('border', 'base', grayColor)};`,
      `--ui-border-muted: ${getSemanticValue('border', 'muted', grayColor)};`,
      `--ui-border-accented: ${getSemanticValue('border', 'accented', grayColor)};`,
      `--ui-border-inverted: ${getSemanticValue('border', 'inverted', grayColor)};`,
    ]

    return `:root {\n  ${baseVars.join('\n  ')}\n  ${uiVars.join('\n  ')}\n  ${colorBase.join('\n  ')}\n}`
  }

  const { css } = useStyleTag(generateCSSVariables(), { id: 'theme-variables' })

  // 初始化CSS变量引用
  function cssInit() {
    if (themeStore.cssInit) {
      return
    }
    themeStore.setCssInit()
    css.value = generateCSSVariables()
  }

  watch([colorMapping, isDark], () => {
    if (!themeStore.cssInit) {
      return
    }
    css.value = generateCSSVariables()
  }, { deep: true, immediate: false })

  // 设置单个颜色
  function setColor(type: ThemeColorType, colorName: ThemeColorName) {
    if (colors.value.includes(colorName)) {
      themeStore.setThemeColor(type, colorName)
    }
    else {
      console.warn(`Color "${colorName}" is not available`)
    }
  }

  // 设置多个颜色
  function setColors(mappings: Partial<Record<ThemeColorType, ThemeColorName>>) {
    themeStore.setThemeColors(mappings)
  }

  // 重置为默认色彩
  function cssReset() {
    themeStore.resetTheme()
  }

  // 获取阶梯颜色值
  function getShadeColor(type: ThemeColorType, shade: ThemeColorShade): string {
    return getColorValue(type, shade)
  }

  // 获取场景颜色值
  function getSceneColor(type: ThemeColorType, scene?: ThemeSceneType): string {
    if (!scene) {
      scene = 'default'
    }

    const level = getColorLevel(type, scene)
    return getColorValue(type, level)
  }

  // 获取公共颜色值
  function getSemanticColor(category: keyof ThemeColorSemanticConfig, key: string): string {
    const grayColor = colorMapping.value.gray
    const currentSemantic = isDark.value ? finalConfig.colorSemantic.dark : finalConfig.colorSemantic.light
    const value = currentSemantic[category][key as keyof typeof currentSemantic[typeof category]]

    if (value === 'white') {
      return finalConfig.colorBase?.white || '#ffffff'
    }
    if (value === 'black') {
      return finalConfig.colorBase?.black || '#000000'
    }

    return finalConfig.colors[grayColor]?.[value] || ''
  }



  return {
    toggle: next,
    mode: state,
    isDark,

    resources,
    config: readonly(finalConfig),
    colorMapping: readonly(colorMapping),
    colors,
    colorShades,
    colorTypes,
    colorScenes,

    cssInit,
    cssReset,

    setColor,
    setColors,

    getSceneColor,
    getShadeColor,
    getSemanticColor,

  }
}
