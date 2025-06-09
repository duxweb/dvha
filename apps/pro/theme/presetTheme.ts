import type { Preset, Rule } from 'unocss'
import { themeColor, themePreset } from '@duxweb/dvha-core'

export function presetTheme(): Preset {
  const { colors, rules } = themePreset(themeColor)

  return {
    name: 'preset-theme',
    theme: {
      colors,
    },
    rules: rules as Rule<object>[],
  }
}
