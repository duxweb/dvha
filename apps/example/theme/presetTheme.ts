import type { Preset, Rule } from 'unocss'
import { themeColor } from '@duxweb/dvha-core'
import { themePreset } from './theme'

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
