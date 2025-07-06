import type { Ref } from 'vue'
import { useI18n, useTheme } from '@duxweb/dvha-core'
import { setLocale } from '@vee-validate/i18n'
import { hex2hsl } from 'colorizr'
import { registerTheme } from 'echarts'

import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import python from 'highlight.js/lib/languages/python'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import { darkTheme, dateEnUS, dateZhCN, enUS, lightTheme, NConfigProvider, NDialogProvider, NMessageProvider, NModalProvider, NNotificationProvider, useLoadingBar, zhCN } from 'naive-ui'
import { computed, defineComponent, inject, onBeforeMount, onMounted, watch } from 'vue'
import { generateRainbowFromColor, getTheme } from '../../config'
import { themeOverrides } from '../../theme'

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

    hljs.registerLanguage('javascript', javascript)
    hljs.registerLanguage('typescript', typescript)
    hljs.registerLanguage('css', css)
    hljs.registerLanguage('xml', xml)
    hljs.registerLanguage('json', json)
    hljs.registerLanguage('markdown', markdown)
    hljs.registerLanguage('bash', bash)
    hljs.registerLanguage('shell', shell)
    hljs.registerLanguage('sql', sql)
    hljs.registerLanguage('java', java)
    hljs.registerLanguage('php', php)
    hljs.registerLanguage('go', go)
    hljs.registerLanguage('python', python)

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
      <NConfigProvider hljs={hljs} locale={locale.value} dateLocale={dateLocale.value} theme={isDark.value ? darkTheme : lightTheme} themeOverrides={isDark.value ? darkThemeOverrides.value : lightThemeOverrides.value}>
        <NModalProvider>
          <NDialogProvider>
            <NNotificationProvider>
              <NMessageProvider>
                {slots.default?.()}
              </NMessageProvider>
            </NNotificationProvider>
          </NDialogProvider>
        </NModalProvider>
      </NConfigProvider>
    )
  },
})
