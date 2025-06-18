import type { UserConfig } from 'unocss'
import { presetIcons, presetTypography, presetWind4 } from 'unocss'
import { presetTheme } from '../theme'
// 直接导入 CSS 文件

export function config(build?: boolean) {
  const config: UserConfig = {
    presets: [
      presetWind4({
        preflights: {
          reset: build,
          theme: build,
        },
      }),
      presetIcons({
        collections: {
          tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
        },
      }),
      presetTypography(),
      presetTheme(),
    ],

  }

  if (!build) {
    config.preflights = [
      {
        getCSS: () => import('../theme/uno.css?raw').then(i => i.default),
      },
    ]
  }

  return config
}
