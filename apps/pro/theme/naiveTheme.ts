import type { GlobalThemeOverrides } from 'naive-ui'
import { useTheme } from '@duxweb/dvha-core'
import { hex2rgb } from 'colorizr'
import { merge } from 'lodash-es'
import { computed } from 'vue'

export function themeOverrides() {
  const { getSceneColor, getSemanticColor } = useTheme()

  const color2rgb = (color: string) => {
    const rgb = hex2rgb(color)
    return `${rgb.r}, ${rgb.g},${rgb.b}`
  }

  const commonTheme = computed<GlobalThemeOverrides>(() => ({
    common: {
      // UI 色彩变量 - 主题色
      primaryColor: getSceneColor('primary'),
      primaryColorHover: getSceneColor('primary', 'hover'),
      primaryColorPressed: getSceneColor('primary', 'pressed'),
      primaryColorSuppl: getSceneColor('primary'),

      // UI 色彩变量 - 信息色
      infoColor: getSceneColor('info'),
      infoColorHover: getSceneColor('info', 'hover'),
      infoColorPressed: getSceneColor('info', 'pressed'),
      infoColorSuppl: getSceneColor('info'),

      // UI 色彩变量 - 成功色
      successColor: getSceneColor('success'),
      successColorHover: getSceneColor('success', 'hover'),
      successColorPressed: getSceneColor('success', 'pressed'),
      successColorSuppl: getSceneColor('success'),

      // UI 色彩变量 - 警告色
      warningColor: getSceneColor('warning'),
      warningColorHover: getSceneColor('warning', 'hover'),
      warningColorPressed: getSceneColor('warning', 'pressed'),
      warningColorSuppl: getSceneColor('warning'),

      // UI 色彩变量 - 错误色
      errorColor: getSceneColor('error'),
      errorColorHover: getSceneColor('error', 'hover'),
      errorColorPressed: getSceneColor('error', 'pressed'),
      errorColorSuppl: getSceneColor('error'),

      // UI 文字色彩 - 使用语义颜色
      textColorBase: getSemanticColor('text', 'base'),
      textColor1: getSemanticColor('text', 'muted'),
      textColor2: getSemanticColor('text', 'toned'),
      textColor3: getSemanticColor('text', 'highlighted'),
      textColorDisabled: getSemanticColor('text', 'dimmed'),

      // UI 背景色彩 - 使用语义颜色
      bodyColor: getSemanticColor('bg', 'base'),
      cardColor: getSemanticColor('bg', 'muted'),
      modalColor: getSemanticColor('bg', 'muted'),
      popoverColor: `rgba(${color2rgb(getSemanticColor('bg', 'muted'))}, 0.6)`,
      tableColor: getSemanticColor('bg', 'muted'),
      inputColor: 'transparent',
      actionColor: getSemanticColor('bg', 'muted'),
      hoverColor: getSemanticColor('bg', 'accented'),

      // UI 边框色彩 - 使用语义颜色
      borderColor: getSemanticColor('border', 'accented'),
      dividerColor: getSemanticColor('border', 'muted'),

      // 占位符和图标色彩
      placeholderColor: getSemanticColor('text', 'muted'),
      iconColor: getSemanticColor('text', 'muted'),

      borderRadius: 'var(--radius-md)',
      borderRadiusSmall: 'var(--radius-sm)',

      // boxShadow1: `var(--un-inset-shadow), var(--un-inset-ring-shadow), var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)`,
      // boxShadow2: `var(--un-inset-shadow), var(--un-inset-ring-shadow), var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)`,
      // boxShadow3: `var(--un-inset-shadow), var(--un-inset-ring-shadow), var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)`,

    },

    Menu: {
      itemIconColorCollapsed: getSemanticColor('text', 'accented'),
    },

    DataTable: {
      borderColor: getSemanticColor('border', 'muted'),
      thColor: getSemanticColor('bg', 'elevated'),
      tdColor: getSemanticColor('bg', 'muted'),
      tdColorHover: getSemanticColor('bg', 'elevated'),
    },

    Input: {
      border: '1px solid rgb(var(--ui-border-accented))',
    },

    Select: {
      peers: {
        InternalSelection: {
          border: '1px solid rgb(var(--ui-border-accented))',
        },
      },
    },

    Button: {

    },

    Tabs: {
      colorSegment: `rgba(${color2rgb(getSemanticColor('bg', 'elevated'))})`,
      tabBorderColor: getSemanticColor('border', 'muted'),
      tabColorSegment: getSceneColor('primary'),
      tabTextColorSegment: getSemanticColor('text', 'toned'),
      tabTextColorActiveSegment: getSemanticColor('text', 'inverted'),
      tabTextColorHoverSegment: getSemanticColor('text', 'muted'),
    },

  }))

  const lightTheme = computed<GlobalThemeOverrides>(() => {
    return merge(commonTheme.value, {

    })
  })

  const darkTheme = computed<GlobalThemeOverrides>(() => {
    return merge(commonTheme.value, {

    })
  })

  return {
    lightTheme,
    darkTheme,
  }
}
