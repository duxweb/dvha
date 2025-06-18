import { themeColor, themePreset } from '@duxweb/dvha-core'

export function presetTheme() {
  const preset = themePreset(themeColor)

  return {
    name: preset.name,
    theme: preset.theme,
    rules: preset.rules,
  }
}
