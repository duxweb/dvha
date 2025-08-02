import { useI18n, useTheme } from '@duxweb/dvha-core'
import { NButton, NTooltip } from 'naive-ui'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'DuxMenuDark',
  setup() {
    const { t } = useI18n()
    const { mode, setMode } = useTheme()

    const themeConfig = computed(() => {
      const configs = {
        auto: {
          icon: 'i-tabler:device-desktop',
          label: t('components.menu.followSystem', 'Follow System'),
          nextMode: 'light' as const,
        },
        light: {
          icon: 'i-tabler:sun',
          label: t('components.menu.lightMode', 'Light'),
          nextMode: 'dark' as const,
        },
        dark: {
          icon: 'i-tabler:moon',
          label: t('components.menu.darkMode', 'Dark'),
          nextMode: 'auto' as const,
        },
      }
      return configs[mode.value] || configs.auto
    })

    const handleToggleTheme = () => {
      setMode(themeConfig.value.nextMode)
    }

    return () => (
      <NTooltip trigger="hover" placement="right"> 
        {{
          default: () => themeConfig.value.label,
          trigger: () => (
            <NButton quaternary onClick={handleToggleTheme}>
              {{
                icon: () => (
                  <div class="transition-all text-muted p-2 hover:text-white">
                    <div class={`${themeConfig.value.icon} size-5`} />
                  </div>
                ),
              }}
            </NButton>
          ),
        }}
      </NTooltip>
    )
  },
})