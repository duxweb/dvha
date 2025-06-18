import type { UserConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons/browser'
import presetTypography from '@unocss/preset-typography'
import { presetWind4 } from 'unocss/preset-wind4'

import { presetTheme } from '../theme'

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
