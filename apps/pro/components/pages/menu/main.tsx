import { DuxLogoIcon } from '@duxweb/dvha-core'
import { useNaiveMenu } from '@duxweb/dvha-naiveui'
import { NMenu, NTag } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../../hooks/ui'
import { DuxMenuAvatar, DuxMenuButton } from './'

export const DuxMenuMain = defineComponent({
  name: 'DuxMenuMain',
  setup() {
    const { options, active } = useNaiveMenu({})
    const { menuCollapsed, setCmdVisible, menuMobileCollapsed } = useUI()

    return () => (
      <div class="flex flex-col h-screen">
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

        <div class="px-2 py-2.5 hidden lg:block">
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
          'flex-1 min-h-0',
          menuMobileCollapsed.value ? 'border-t border-muted' : '',
        ]}
        >
          <NMenu options={options.value} value={active.value as any} collapsed={menuCollapsed.value && !menuMobileCollapsed.value} indent={20} collapsed-width={60} collapsed-icon-size={20} />
        </div>

        <div class="flex-none flex flex-col items-center gap-2 border-t border-muted p-2">
          <DuxMenuAvatar />
        </div>
      </div>
    )
  },
})
