import { useMenu, useRouteStore, useTheme } from '@duxweb/dvha-core'
import { useMagicKeys, watchThrottled } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import { NButton, NTag } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { Command } from 'vue-command-palette'
import { useRouter } from 'vue-router'
import { useUI } from '../../../hooks/ui'

export interface DuxMenuCmdItem {
  icon: string
  label: string
  onSelect: () => void
  keyName?: string
}

export const DuxMenuCmd = defineComponent({
  name: 'DuxMenuCmd',
  setup() {
    const { cmdVisible, setCmdVisible } = useUI()
    const keys = useMagicKeys()
    const CmdK = keys['Meta+K']
    const current = ref<string>()
    const list = ref<Record<string, any>[]>([])
    const router = useRouter()
    const routeStore = useRouteStore()
    const { setMode } = useTheme()
    const searchValue = ref('')

    const inputRef = ref<HTMLInputElement>()

    const handleSelect = (name?: string) => {
      const menu = routeStore.routes.filter(item => item.parent === name)
      current.value = name
      list.value = menu
    }

    const handleOpen = () => {
      setCmdVisible(true)
    }

    const handleClose = () => {
      setCmdVisible(false)
    }

    const handleSearch = (value: string) => {
      if (value) {
        list.value = [
          ...cloneDeep(routeStore.routes).filter((item) => {
            return item.label?.includes(value)
          }),
        ]
      }
      else {
        list.value = routeStore.routes.filter(item => !item.parent)
      }
    }

    watch(cmdVisible, (v) => {
      if (v) {
        list.value = routeStore.routes.filter(item => !item.parent)
      }
      else {
        list.value = routeStore.routes.filter(item => !item.parent)
      }
    })

    watchThrottled(
      searchValue,
      () => { handleSearch(searchValue.value) },
      { throttle: 500 },
    )

    const handleBack = () => {
      const parent = routeStore.routes.find(item => item.name === current.value)
      handleSelect(parent?.parent)
    }

    watch(CmdK, (v) => {
      if (v) {
        handleOpen()
      }
    })

    watch(keys.Escape, (v) => {
      if (v) {
        setCmdVisible(false)
      }
    })

    watch(keys.Backspace, (v) => {
      if (v && searchValue.value === '' && current.value) {
        handleBack()
      }
    })

    watch(inputRef, (v) => {
      if (v) {
        v.focus()
      }
    })

    const menuList = computed(() => {
      return list.value.filter(item => item.hidden === undefined || item.hidden === false)
    })

    const MenuItem = (props: DuxMenuCmdItem) => {
      return (
        <Command.Item onSelect={props?.onSelect}>
          <div class="flex items-center justify-between flex-1">
            <div class="flex items-center gap-2">
              <div class={['size-4', props?.icon]}></div>
              <div>{props?.label}</div>
            </div>
            <div>
              {props?.keyName && <NTag size="small">{props?.keyName}</NTag>}
            </div>
          </div>
        </Command.Item>
      )
    }

    return () => (
      <Command.Dialog visible={cmdVisible.value} theme="command-palette">
        {{
          header: () => (
            <div class="relative">
              <input
                ref={inputRef}
                placeholder="请输入关键词搜索..."
                onInput={(e) => {
                  searchValue.value = (e.target as HTMLInputElement).value
                }}
                class="w-full h-12 text-base/5 rounded-md border-0 placeholder:text-dimmed outline-0 px-2.5 py-1.5 text-sm gap-1.5 text-highlighted bg-transparent ps-10 pe-10"
              />
              <span class="absolute inset-y-0 start-0 flex items-center ps-3">
                <div class="i-tabler:search shrink-0 text-dimmed size-5" aria-hidden="true"></div>
              </span>
              <span class="absolute inset-y-0 end-0 flex items-center gap-2 pe-3">
                <NTag size="small">Esc</NTag>
                <NButton quaternary circle size="small" onClick={() => setCmdVisible(false)}>
                  {{
                    icon: () => <div class="i-tabler:x size-5" aria-hidden="true"></div>,
                  }}
                </NButton>
              </span>
            </div>
          ),
          body: () => (
            <>
              {menuList.value.length === 0 && searchValue.value && (
                <div class="flex items-center justify-center h-20 border-t border-muted">
                  暂无搜索结果
                </div>
              )}
              {menuList.value.length > 0 && (
                <Command.List>
                  <Command.Group heading="菜单">
                    {menuList.value?.map((item, key: number) => (
                      <Command.Item
                        key={key}
                        onSelect={() => {
                          if (!item.path) {
                            handleSelect(item.name)
                          }
                          else {
                            router.push(item.path)
                            handleClose()
                          }
                        }}
                      >
                        <div class={!item.path ? 'i-tabler:folder' : 'i-tabler:link'}></div>
                        {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                  <Command.Separator />

                  {!current.value
                    ? (
                        <Command.Group heading="主题">
                          <MenuItem
                            icon="i-tabler:moon"
                            label="暗色模式"
                            onSelect={() => {
                              setMode('dark')
                            }}
                          />
                          <MenuItem
                            icon="i-tabler:sun"
                            label="亮色模式"
                            onSelect={() => {
                              setMode('light')
                            }}
                          />
                        </Command.Group>
                      )
                    : (
                        <MenuItem icon="i-tabler:arrow-left" label="返回" onSelect={handleBack} keyName="Backspace" />
                      )}

                </Command.List>
              )}
            </>
          ),
        }}
      </Command.Dialog>
    )
  },
})
