import { DuxLogoIcon, DuxTabRouterView, useTheme } from '@duxweb/dvha-core'
import { useNaiveMenu } from '@duxweb/dvha-naiveui'
import { OverlaysProvider } from '@overlastic/vue'
import { darkTheme, lightTheme, NConfigProvider, NMenu, NMessageProvider, NNotificationProvider, NTag } from 'naive-ui'
import { defineComponent, onBeforeMount } from 'vue'
import { useUI } from '../../hooks/ui'
import { themeOverrides } from '../../theme'
import { DuxMenuAvatar, DuxMenuButton } from './menu'
import { DuxMenuCmd } from './menu/cmd'

export default defineComponent({
  name: 'DuxLayout',
  setup() {
    const { options, active } = useNaiveMenu({})
    const { menuCollapsed, setCmdVisible } = useUI()
    const { isDark, cssInit } = useTheme()

    const { lightTheme: lightThemeOverrides, darkTheme: darkThemeOverrides } = themeOverrides()

    // function renderIcon(icon: string) {
    //   return h(NIcon, null, { default: () => h('div', { class: `${icon} size-4` }) })
    // }

    // const toolsOptions: MenuOption[] = [
    //   {
    //     label: '设置',
    //     key: 'setting',
    //     icon: () => renderIcon('i-tabler:settings'),
    //   },

    //   {
    //     label: '语言',
    //     key: 'locale',
    //     icon: () => renderIcon('i-tabler:language'),
    //     children: [
    //       {
    //         group: 'locale',
    //         label: '中文',
    //         key: 'zh-CN',
    //       },
    //       {
    //         group: 'locale',
    //         label: 'English',
    //         key: 'en-US',
    //       },
    //     ],
    //   },
    // ]

    onBeforeMount(() => {
      cssInit()
    })

    return () => (
      <NConfigProvider theme={isDark ? darkTheme : lightTheme} themeOverrides={isDark ? darkThemeOverrides.value : lightThemeOverrides.value}>
        <NNotificationProvider>
          <NMessageProvider>
            <OverlaysProvider>
              <div class="h-screen w-screen flex">
                <div class={[
                  'bg-gray-100 dark:bg-gray-800/20 rounded flex flex-col gap-1 flex-none border-r border-muted transition-all ',
                  menuCollapsed.value ? 'w-60px' : 'w-200px',
                ]}
                >

                  <div class="flex items-center h-15 px-2">

                    <DuxMenuButton quaternary>
                      {{
                        icon: () => (
                          <div class="bg-default rounded-full p-2">
                            <DuxLogoIcon highlight="fill-primary" class="size-4" />
                          </div>
                        ),
                        default: () => (
                          <div>
                            DvhaPro
                          </div>
                        ),
                      }}
                    </DuxMenuButton>

                  </div>

                  <div class="px-2 py-2.5">
                    <DuxMenuButton iconSize="22px" ghost={!menuCollapsed.value} text={menuCollapsed.value} size="medium" class="px-3" onClick={() => setCmdVisible(true)}>
                      {{
                        icon: () => menuCollapsed.value ? <div class="bg-elevated rounded-full p-2"><div class="i-tabler:search size-4"></div></div> : <div class="i-tabler:search size-4"></div>,
                        default: () => (
                          <div class="flex justify-between items-center">
                            <div>Search</div>
                            <div class="flex items-center gap-1">
                              <NTag size="small">⌘</NTag>
                              <NTag size="small">K</NTag>
                            </div>
                          </div>
                        ),
                      }}
                    </DuxMenuButton>
                  </div>
                  <div class={[
                    'flex-1 ',
                  ]}
                  >
                    <NMenu options={options.value} value={active.value as any} collapsed={menuCollapsed.value} indent={20} collapsed-width={60} collapsed-icon-size={20} />
                  </div>

                  <div class="flex-none flex flex-col items-center gap-2 border-t border-muted p-2">
                    <DuxMenuAvatar />
                  </div>
                </div>

                <DuxTabRouterView />
              </div>
              <DuxMenuCmd />
            </OverlaysProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NConfigProvider>
    )
  },
})
