import { defineConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons/browser'
import presetTypography from '@unocss/preset-typography'
import { presetWind4 } from 'unocss/preset-wind4'
import { themeColor } from '../core/src/config/color.ts'
import { themePreset } from '../core/src/utils/theme.ts'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
        theme: true,
      },
    }),
    presetIcons({
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
      },
    }) as any,
    presetTypography(),
    (() => {
      const preset = themePreset(themeColor)
      return {
        name: preset.name,
        theme: preset.theme,
        rules: preset.rules,
      }
    })(),
  ],
  content: {
    pipeline: {
      include: ['src/**/*.ts', 'src/**/*.tsx'],
    },
  },
})
