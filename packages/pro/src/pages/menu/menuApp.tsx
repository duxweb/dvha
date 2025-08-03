import type { MenuOption } from 'naive-ui'
import { DuxLogoIcon, useI18n, useManage, useMenu } from '@duxweb/dvha-core'
import { cloneDeep } from 'lodash-es'
import { NMenu, NScrollbar, NTag } from 'naive-ui'
import { computed, defineComponent, h, onMounted, Transition } from 'vue'
import { RouterLink } from 'vue-router'
import { DuxMenuAvatar, DuxMenuButton, DuxMenuDark, DuxMenuNotice } from '.'
import { DuxCard } from '../../components'
import { useUI } from '../../hooks'

export const DuxMenuApp = defineComponent({
  name: 'DuxMenuApp',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { setCmdVisible, setMenuCollapsed } = useUI()
    const { config } = useManage()
    const { t } = useI18n()

    const { mainMenu, subMenu, appActive, subActive, isSubMenu } = useMenu({
      doubleMenu: true,
    })

    onMounted(() => {
      setMenuCollapsed(false)
    })

    const renderMenu = (menu): MenuOption[] => {
      const data = menu.map((item) => {
        const items = {
          ...item,
          key: item.name,
          icon: item?.icon
            ? () => {
                return h('div', {
                  class: `${item.icon} size-5`,
                })
              }
            : undefined,
          labelName: item.label,
          label: () => {
            return item.path
              ? h(
                  RouterLink,
                  {
                    to: {
                      path: item.path,
                    },
                  },
                  { default: () => item.label },
                )
              : item.label
          },
        }

        if (items.children && items.children.length > 0) {
          items.children = renderMenu(items.children)
        }
        return items
      })

      return data
    }

    const mainOptions = computed((): MenuOption[] => {
      return renderMenu(cloneDeep(mainMenu.value))
    })

    const subOptions = computed((): MenuOption[] => {
      const data = renderMenu(cloneDeep(subMenu.value))
      return data
    })

    return () => (
      <div class="flex h-screen gap-2  pl-2 pr-4 py-2">

        <DuxCard class="bg-primary-950 w-16 text-inverted z-1">
          <div class="h-full flex-none flex flex-col">
            <div class="py-4 px-2 hidden lg:flex justify-center items-center">
              <div class="bg-white dark:bg-primary-950 rounded-full p-2 shadow group-hover:shadow-lg">
                {config.theme?.appLogo ? <img class="size-4" src={config.theme?.appLogo} /> : <DuxLogoIcon highlight="fill-primary" class="size-4" />}
              </div>
            </div>

            <div class="flex-1 min-h-0">
              <NScrollbar>
                <NMenu
                  inverted
                  options={mainOptions.value}
                  value={appActive.value as any}
                  collapsed={true}
                  collapsedWidth={64}
                  collapsedIconSize={22}
                  onUpdateValue={(key: string) => appActive.value = key}
                />
              </NScrollbar>
            </div>
            <div class="flex-none hidden lg:flex flex-col items-center gap-2 p-2">
              {config.notice?.status && <DuxMenuNotice collapsed={true} />}
              <DuxMenuDark />
              <DuxMenuAvatar collapsed={true} />
            </div>
          </div>
        </DuxCard>
        <Transition
          name="submenu-slide"
          enterActiveClass="transition-all duration-150 ease-out"
          enterFromClass="opacity-0 translate-x-[-50%]"
          enterToClass="opacity-100 translate-x-0"
          leaveActiveClass="transition-all duration-150 ease-in"
          leaveFromClass="opacity-100 translate-x-0"
          leaveToClass="opacity-0 translate-x-[-50%]"
        >
          {isSubMenu.value && (
            <DuxCard>
              <div class="w-160px overflow-hidden flex flex-col h-full">
                <div class="p-2  flex-none">
                  <DuxMenuButton collapsed={false} class="rounded relative py-1.5 px-3 bg-inverted/5" onClick={() => setCmdVisible(true)}>
                    {{
                      icon: () => <div class="i-tabler:search size-4 icon-gradient"></div>,
                      default: () => (
                        <div class="text-muted text-sm">
                          { t('common.search') }
                          <div class="flex items-center gap-1 absolute right-2.5 top-1.3">
                            <NTag size="small" bordered={false} type="primary">⌘</NTag>
                            <NTag size="small" bordered={false} type="primary">K</NTag>
                          </div>
                        </div>
                      ),
                    }}
                  </DuxMenuButton>
                </div>

                <div class="flex-1 min-h-0">
                  <NScrollbar>
                    <NMenu
                      rootIndent={20}
                      indent={15}
                      options={subOptions.value}
                      value={subActive.value as any}
                      collapsed={false}
                      onUpdateValue={(key: string) => subActive.value = key}
                    />
                  </NScrollbar>
                </div>
              </div>
            </DuxCard>
          )}
        </Transition>
      </div>
    )
  },
})
