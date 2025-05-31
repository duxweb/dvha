import type { UseColorModeOptions } from '@vueuse/core'
import type { ITheme } from '../types'
import { useColorMode, useCycleList } from '@vueuse/core'
import { computed, watchEffect } from 'vue'
import { useManage } from './manage'

export function useTheme(options?: UseColorModeOptions) {
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
        logo: manage.config?.theme?.darkLogo,
        banner: manage.config?.theme?.darkBanner,
      }
    }
    return {
      logo: manage.config?.theme?.logo,
      banner: manage.config?.theme?.banner,
    }
  })

  return {
    toggle: next,
    mode: state,
    isDark,
    theme,
  }
}
