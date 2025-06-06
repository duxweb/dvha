import icons from '@iconify-json/tabler/icons.json'
import { defineConfig, presetIcons, presetWind3 } from 'unocss'
import { presetTheme } from './theme/presetTheme'

function generateSafeList() {
  return Object.keys(icons.icons).flatMap((item) => {
    return `i-tabler:${item}`
  })
}

const safeList = generateSafeList()

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
      },
    }),
    presetTheme(),
  ],
  safelist: safeList,
})
