import type { MenuOption } from 'naive-ui'
import { DuxLogoIcon, useI18n, useManage, useMenu } from '@duxweb/dvha-core'
import { cloneDeep } from 'lodash-es'
import { NMenu, NScrollbar, NTag } from 'naive-ui'
import { computed, defineComponent, h, onMounted, Transition } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { DuxMenuAvatar, DuxMenuDark, DuxMenuNotice } from '.'
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
    const router = useRouter()

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
      <div class="flex h-screen gap-2 pr-2">

        <div class="bg-primary-950 dark:bg-gray-900 w-18 text-inverted z-1 border-r dark:border-muted">
          <div class="h-full flex-none flex flex-col">
            <div class="py-4 px-2 hidden lg:flex justify-center items-center">
              <div class="bg-white dark:bg-primary-950 rounded-full p-2 shadow group-hover:shadow-lg">
                {config.theme?.appLogo ? <img class="size-4" src={config.theme?.appLogo} /> : <DuxLogoIcon highlight="fill-primary" class="size-4" />}
              </div>
            </div>

            <div class="flex-1 min-h-0">
              <NScrollbar>
                <div class="flex flex-col px-2 gap-2">
                  {mainOptions.value.map((item, index) => (
                    <div
                      key={index}
                      class={[
                        'flex flex-col gap-1 justify-center items-center py-1.5 cursor-pointer rounded transition-all',
                        item.key === appActive.value ? 'bg-primary/50 text-primary-200' : 'text-white/60 hover:text-white',
                      ]}
                      onClick={() => {
                        appActive.value = item.key as string
                        if (item?.path) {
                          router.push(item.path)
                        }
                      }}
                    >
                      <div>{item.icon?.()}</div>
                      <div class="text-xs">{typeof item.label === 'function' ? item.label?.() : item.label}</div>
                    </div>
                  ))}
                </div>
                {/* <NMenu
                  inverted
                  options={mainOptions.value}
                  value={appActive.value as any}
                  collapsed={true}
                  collapsedWidth={64}
                  collapsedIconSize={22}
                  onUpdateValue={(key: string) => appActive.value = key}
                /> */}
              </NScrollbar>
            </div>
            <div class="flex-none hidden lg:flex flex-col items-center gap-2 p-2">
              {config.notice?.status && <DuxMenuNotice collapsed={true} />}
              <DuxMenuDark />
              <DuxMenuAvatar collapsed={true} />
            </div>
          </div>
        </div>
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
            <div>
              <div class="w-160px overflow-hidden flex flex-col h-full">
                <div class="py-2 flex-none">

                  <div class="rounded-md relative py-2 px-3 bg-white dark:bg-elevated shadow-xs hover:shadow flex items-center gap-2 cursor-pointer transition-all" onClick={() => setCmdVisible(true)}>
                    <div class="i-tabler:search size-4 icon-gradient"></div>
                    <div class="text-muted text-sm flex-1">
                      { t('common.search') }
                    </div>
                    <div class="flex items-center gap-1 absolute right-2.5">
                      <NTag size="small" bordered={false} type="primary">⌘</NTag>
                      <NTag size="small" bordered={false} type="primary">K</NTag>
                    </div>
                  </div>

                </div>

                <div class="flex-1 min-h-0">
                  <NScrollbar>
                    <NMenu

                      rootIndent={20}
                      indent={15}
                      class="app-menu"
                      options={subOptions.value}
                      value={subActive.value as any}
                      collapsed={false}
                      onUpdateValue={(key: string) => subActive.value = key}
                    />
                  </NScrollbar>
                </div>
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  },
})
