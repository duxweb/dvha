import { defineConfig, presetIcons, presetWind3 } from 'unocss'
import icons from '@iconify-json/tabler/icons.json'

const generateSafeList = () => {
  return Object.keys(icons.icons).flatMap((item) => {
    return `i-tabler:${item}`
  })
};

const safeList = generateSafeList()

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons({
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
      },
    }),
  ],
  safelist: safeList,
})
