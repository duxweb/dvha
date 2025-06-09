import type { GlobalThemeOverrides } from 'naive-ui'
import { useTheme } from '@duxweb/dvha-core'
import { merge } from 'lodash-es'
import { computed } from 'vue'

export function themeOverrides() {
  const { getSceneColor, getSemanticColor } = useTheme()

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
      textColor1: getSemanticColor('text', 'highlighted'),
      textColor2: getSemanticColor('text', 'toned'),
      textColor3: getSemanticColor('text', 'muted'),
      textColorDisabled: getSemanticColor('text', 'dimmed'),

      // UI 背景色彩 - 使用语义颜色
      bodyColor: getSemanticColor('bg', 'base'),
      cardColor: getSemanticColor('bg', 'elevated'),
      modalColor: getSemanticColor('bg', 'elevated'),
      popoverColor: getSemanticColor('bg', 'elevated'),
      tableColor: getSemanticColor('bg', 'muted'),
      inputColor: getSemanticColor('bg', 'muted'),
      actionColor: getSemanticColor('bg', 'muted'),
      hoverColor: getSemanticColor('bg', 'accented'),

      // UI 边框色彩 - 使用语义颜色
      borderColor: getSemanticColor('border', 'accented'),
      dividerColor: getSemanticColor('border', 'accented'),

      // 占位符和图标色彩
      placeholderColor: getSemanticColor('text', 'muted'),
      iconColor: getSemanticColor('text', 'muted'),

      borderRadius: '0.25rem',
      borderRadiusSmall: '0.2rem',

    },
    DataTable: {
      borderColor: getSemanticColor('border', 'muted'),
      tdColor: getSemanticColor('bg', 'muted'),
      thColor: getSemanticColor('bg', 'elevated'),
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
