import type { IMenu } from '@duxweb/dvha-core'
import type { DropdownOption } from 'naive-ui'
import { useI18n, useTabStore } from '@duxweb/dvha-core'
import { useNaiveTab } from '@duxweb/dvha-naiveui'
import { NDropdown, NTab, NTabs } from 'naive-ui'
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

export const DuxPageTab = defineComponent({
  name: 'DuxPageTab',
  setup(_props) {
    const { tabsProps, tabs } = useNaiveTab()
    const tabsRef = ref<InstanceType<typeof NTabs>>()
    const tab = useTabStore()
    const router = useRouter()
    const { t } = useI18n()

    const menu = reactive({
      x: 0,
      y: 0,
      visible: false,
    })

    const currentTab = ref<IMenu>()

    const handleContextMenu = (e: MouseEvent, tag: IMenu) => {
      e.preventDefault()
      menu.visible = false
      nextTick().then(() => {
        menu.visible = true
        menu.x = e.clientX
        menu.y = e.clientY
        currentTab.value = tag
      })
    }

    const handleClickoutside = () => {
      menu.visible = false
    }

    const menuOptions: DropdownOption[] = [
      {
        label: t('components.tab.lock'),
        key: 'lock',
      },
      {
        label: t('components.tab.closeOther'),
        key: 'closeOther',
      },
      {
        label: t('components.tab.closeLeft'),
        key: 'closeLeft',
      },
      {
        label: t('components.tab.closeRight'),
        key: 'closeRight',
      },
    ]

    const handleSelect = (key: string) => {
      menu.visible = false

      switch (key) {
        case 'lock':
          tab.lockTab(currentTab.value?.path || '')
          break
        case 'closeOther':
          tab.delOther(currentTab.value?.path || '', () => {
            router.push(currentTab.value?.path || '')
          })
          break
        case 'closeLeft':
          tab.delLeft(currentTab.value?.path || '', () => {
            router.push(currentTab.value?.path || '')
          })
          break
        case 'closeRight':
          tab.delRight(currentTab.value?.path || '', () => {
            router.push(currentTab.value?.path || '')
          })
          break
        default:
          break
      }
    }

    return () => (
      <>
        <NTabs
          ref={tabsRef}
          type="card"
          class="app-page-tabs"
          barWidth={100}
          {...tabsProps.value}
        >
          {{
            default: () => tabs?.value?.map(tab => (
              <NTab key={tab.path} name={tab.path || ''} class="shadow-xs my-2">
                <div class="flex items-center gap-2 py-2 px-3" onContextmenu={e => handleContextMenu(e, tab)}>
                  <div class="flex-1">
                    {tab.label}
                  </div>
                  <div class="flex items-center flex-none">
                    {tab.meta?.lock
                      ? <div class="i-tabler:pinned size-4" />
                      : (

                          <div onClick={() => tabsProps.value?.onClose?.(tab.path)} class="text-muted hover:text-primary cursor-pointer">
                            <div class="i-tabler:x size-4" />
                          </div>
                        )}
                  </div>
                </div>
              </NTab>
            )),
          }}

        </NTabs>

        <NDropdown
          trigger="manual"
          x={menu.x}
          y={menu.y}
          show={menu.visible}
          onClickoutside={handleClickoutside}
          options={menuOptions}
          onSelect={handleSelect}
        >
        </NDropdown>
      </>
    )
  },
})
