import { themeColor, themePreset } from '@duxweb/dvha-core'
import type { Preset, Rule } from 'unocss'

export function presetTheme(): Preset {
  const { colors, rules } = themePreset(themeColor)

  return {
    name: 'preset-theme',
    theme: {
      colors: colors,
    },
    rules: rules as Rule<object>[],
  }
}
