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
      primaryColor: getSceneColor('primary'),
      primaryColorHover: getSceneColor('primary', 'hover'),
      primaryColorPressed: getSceneColor('primary', 'pressed'),
      primaryColorSuppl: getSceneColor('primary'),

      infoColor: getSceneColor('info'),
      infoColorHover: getSceneColor('info', 'hover'),
      infoColorPressed: getSceneColor('info', 'pressed'),
      infoColorSuppl: getSceneColor('info'),

      successColor: getSceneColor('success'),
      successColorHover: getSceneColor('success', 'hover'),
      successColorPressed: getSceneColor('success', 'pressed'),
      successColorSuppl: getSceneColor('success'),

      warningColor: getSceneColor('warning'),
      warningColorHover: getSceneColor('warning', 'hover'),
      warningColorPressed: getSceneColor('warning', 'pressed'),
      warningColorSuppl: getSceneColor('warning'),

      errorColor: getSceneColor('error'),
      errorColorHover: getSceneColor('error', 'hover'),
      errorColorPressed: getSceneColor('error', 'pressed'),
      errorColorSuppl: getSceneColor('error'),

      // textColorBase: getSemanticColor('text', 'base'),
      // textColor1: getSemanticColor('text', 'highlighted'),
      // textColor2: getSemanticColor('text', 'toned'),
      // textColor3: getSemanticColor('text', 'muted'),
      // textColorDisabled: getSemanticColor('text', 'dimmed'),

      // tableColor: getSemanticColor('bg', 'muted'),
      // actionColor: getSemanticColor('bg', 'muted'),
      // hoverColor: getSemanticColor('bg', 'muted'),

      // dividerColor: getSemanticColor('border', 'muted'),
      // borderColor: getSemanticColor('border', 'muted'),

      // placeholderColor: getSemanticColor('text', 'muted'),
      iconColor: getSemanticColor('text', 'muted'),

      borderRadius: 'var(--radius-sm)',
      borderRadiusSmall: 'var(--radius-xs)',

    },

    Menu: {
      itemIconColorCollapsed: getSemanticColor('text', 'accented'),
    },

    DataTable: {
      borderColor: getSemanticColor('border', 'muted'),
      thColor: getSemanticColor('bg', 'elevated'),
      tdColorHover: getSemanticColor('bg', 'elevated'),
      thTextColor: getSemanticColor('text', 'base'),
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
      tabTextColorCard: getSemanticColor('text', 'toned'),
      colorSegment: `rgba(${color2rgb(getSemanticColor('bg', 'elevated'))})`,
      tabBorderColor: getSemanticColor('border', 'muted'),
      tabColorSegment: getSceneColor('primary'),
      tabTextColorSegment: getSemanticColor('text', 'toned'),
      tabTextColorActiveSegment: getSemanticColor('text', 'inverted'),
      tabTextColorHoverSegment: getSemanticColor('text', 'muted'),
    },

    Card: {

    },

  }))

  const lightTheme = computed<GlobalThemeOverrides>(() => {
    return merge(commonTheme.value, {
      common: {
        cardColor: getSemanticColor('bg', 'base'),
        modalColor: getSemanticColor('bg', 'base'),
        dividerColor: getSemanticColor('border', 'muted'),
        borderColor: getSemanticColor('border', 'muted'),
        popoverColor: `rgba(${color2rgb(getSemanticColor('bg', 'muted'))}, 0.95)`,
      },
      DataTable: {
        tdColor: getSemanticColor('bg', 'base'),
      },
    })
  })

  const darkTheme = computed<GlobalThemeOverrides>(() => {
    return merge(commonTheme.value, {
      common: {
        cardColor: getSemanticColor('bg', 'muted'),
        modalColor: getSemanticColor('bg', 'muted'),
        dividerColor: getSemanticColor('border', 'muted'),
        borderColor: getSemanticColor('border', 'muted'),
        popoverColor: `rgba(${color2rgb(getSemanticColor('bg', 'elevated'))}, 0.95)`,
      },
      DataTable: {
        tdColor: getSemanticColor('bg', 'muted'),
      },
    })
  })

  return {
    lightTheme,
    darkTheme,
  }
}
