import type { Ref } from 'vue'
import { useI18n, useTheme } from '@duxweb/dvha-core'
import { setLocale } from '@vee-validate/i18n'
import { hex2hsl } from 'colorizr'
import { registerTheme } from 'echarts'
import { darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, NConfigProvider, NMessageProvider, NModalProvider, NNotificationProvider, useLoadingBar, zhCN } from 'naive-ui'
import { computed, defineComponent, inject, onBeforeMount, onMounted, watch } from 'vue'
import { generateRainbowFromColor, getTheme } from '../../config'
import { themeOverrides } from '../../theme'
import 'echarts'

export const DuxGlobalLayout = defineComponent({
  name: 'DuxGlobalLayout',
  setup(_, { slots }) {
    const { isDark, cssInit, getSceneColor } = useTheme()
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

    watch(isDark, (v) => {
      const primaryColor = getSceneColor('primary')
      const hsl = hex2hsl(primaryColor)
      const rainbowColors = generateRainbowFromColor(hsl, 10)
      const theme = getTheme(rainbowColors, v)
      registerTheme('default', theme)
    }, { immediate: true })

    return () => (
      <NConfigProvider locale={locale.value} dateLocale={dateLocale.value} theme={isDark.value ? darkTheme : lightTheme} themeOverrides={isDark.value ? darkThemeOverrides.value : lightThemeOverrides.value}>
        <NModalProvider>
          <NNotificationProvider>
            <NMessageProvider>
              {slots.default?.()}
            </NMessageProvider>
          </NNotificationProvider>
        </NModalProvider>
      </NConfigProvider>
    )
  },
})
