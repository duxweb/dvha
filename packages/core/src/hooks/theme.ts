import { BasicColorSchema, useColorMode, UseColorModeOptions, useCycleList } from '@vueuse/core'
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useManage } from './manage'
import { ITheme } from '../types'

// 扩散效果配置接口
export interface RippleOptions {
  duration?: number
  easing?: string
}

export const useTheme = (options?: UseColorModeOptions) => {
  const colorMode = useColorMode(options)
  const manage = useManage()

  const { state, next } = useCycleList(['dark', 'light', 'auto'] as const, {
    initialValue: colorMode,
  })

  watchEffect(() => colorMode.value = state.value)

  const isDark = computed(() => {
    const { system, store } = colorMode
    if (state.value === 'auto') {
      return system.value === 'dark'
    }
    return store.value === 'dark'
  })

  const theme = computed<ITheme>(() => {
    if (isDark.value) {
      return {
        logo: manage.config.theme?.darkLogo,
        banner: manage.config.theme?.darkBanner,
      }
    }
    return {
      logo: manage.config.theme?.logo,
      banner: manage.config.theme?.banner,
    }
  })

  return {
    toggle: next,
    mode: state,
    isDark,
    theme,
  }
}
