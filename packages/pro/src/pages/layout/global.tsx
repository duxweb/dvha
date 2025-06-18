import type { Ref } from 'vue'
import { useI18n, useTheme } from '@duxweb/dvha-core'
import { setLocale } from '@vee-validate/i18n'
import { darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, NConfigProvider, NMessageProvider, NNotificationProvider, useLoadingBar, zhCN } from 'naive-ui'
import { computed, defineComponent, inject, onBeforeMount, onMounted, watch } from 'vue'
import { themeOverrides } from '../../theme'

export const DuxGlobalLayout = defineComponent({
  name: 'DuxGlobalLayout',
  setup(_, { slots }) {
    const { isDark, cssInit } = useTheme()
    const pageLoading = inject<Ref<boolean>>('pageLoading')

    const loadingBar = useLoadingBar()

    const { lightTheme: lightThemeOverrides, darkTheme: darkThemeOverrides } = themeOverrides()

    onBeforeMount(() => {
      cssInit()
    })

    const { getLocale } = useI18n()

    const locale = computed(() => {
      const lang = getLocale()
      if (lang === 'zh-CN') {
        return zhCN
      }
      return enUS
    })

    const dateLocale = computed(() => {
      const lang = getLocale()
      if (lang === 'zh-CN') {
        return dateZhCN
      }
      return dateEnUS
    })

    watch(
      getLocale,
      (locale) => {
        setLocale(locale as string)
      },
      { immediate: true },
    )

    onMounted(async () => {
      setTimeout(() => {
        loadingBar.finish()
        pageLoading!.value = false
      }, 500)
    })

    return () => (
      <NConfigProvider locale={locale.value} dateLocale={dateLocale.value} theme={isDark.value ? darkTheme : lightTheme} themeOverrides={isDark.value ? darkThemeOverrides.value : lightThemeOverrides.value}>
        <NNotificationProvider>
          <NMessageProvider>
            {slots.default?.()}
          </NMessageProvider>
        </NNotificationProvider>
      </NConfigProvider>
    )
  },
})
