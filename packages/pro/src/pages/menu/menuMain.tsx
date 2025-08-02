import { DuxLogoIcon, useI18n, useManage } from '@duxweb/dvha-core'
import { useNaiveMenu } from '@duxweb/dvha-naiveui'
import { NMenu, NScrollbar, NTag } from 'naive-ui'
import { defineComponent } from 'vue'
import { DuxMenuAvatar, DuxMenuButton } from '.'
import { useUI } from '../../hooks'

export const DuxMenuMain = defineComponent({
  name: 'DuxMenuMain',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { options, active } = useNaiveMenu({})
    const { menuCollapsed, setCmdVisible, menuMobileCollapsed, setMenuCollapsed } = useUI()
    const { config } = useManage()
    const { t } = useI18n()

    return () => (
      <div class={[
        'flex flex-col h-screen px-1',

      ]}
      >
        <div class="h-13 px-2 hidden lg:flex justify-center items-center">

          <DuxMenuButton
            onClick={() => setMenuCollapsed(!menuCollapsed.value)}
            collapsed={props.collapsed}
          >
            {{
              icon: () => (
                <div class="bg-white dark:bg-primary-950 rounded-full p-2 shadow group-hover:shadow-lg">
                  {config.theme?.appLogo ? <img class="size-4" src={config.theme?.appLogo} /> : <DuxLogoIcon highlight="fill-primary" class="size-4" />}
                </div>
              ),
              default: () => (
                <div>
                  {config.title}
                </div>
              ),
            }}
          </DuxMenuButton>

        </div>

        <div class="px-2 py-1 hidden lg:block">
          <DuxMenuButton
            collapsed={props.collapsed}
            class="relative py-1.5 px-3 rounded-full bg-inverted/5 hover:bg-default hover:shadow-sm  transition-all"
            onClick={() => setCmdVisible(true)}
          >
            {{
              icon: () => <div class="i-tabler:search size-4 icon-gradient"></div>,
              default: () => (
                <div class="text-muted text-sm">
                  { t('common.search') }
                  {!menuCollapsed.value && (
                    <div class="flex items-center gap-1 absolute right-2.5 top-1.3">
                      <NTag size="small" bordered={false} type="primary">⌘</NTag>
                      <NTag size="small" bordered={false} type="primary">K</NTag>
                    </div>
                  )}
                </div>
              ),
            }}
          </DuxMenuButton>

        </div>
        <div class={[
          'flex-1 min-h-0',
          menuMobileCollapsed.value ? 'border-t border-muted' : '',
        ]}
        >
          <NScrollbar>
            <NMenu
              class="app-menu"
              options={options.value}
              value={active.value as any}
              collapsed={menuCollapsed.value && !menuMobileCollapsed.value}
              indent={20}
              collapsedWidth={60}
              collapsedIconSize={20}

            />
          </NScrollbar>
        </div>

        <div class="flex-none hidden lg:flex flex-col items-center gap-2 p-2 border-t border-muted/50">
          <DuxMenuAvatar btnClass={menuCollapsed.value ? 'relative rounded-md hover:bg-default hover:shadow-sm  transition-all' : ''} collapsed={props.collapsed} />
        </div>
      </div>
    )
  },
})
