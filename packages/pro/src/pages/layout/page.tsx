import { DuxTabRouterView, useManage } from '@duxweb/dvha-core'
import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../hooks'
import { DuxMenuAvatar } from '../menu'
import { DuxPageTab } from './tab'

export const DuxLayoutPage = defineComponent({
  name: 'DuxLayoutPage',
  props: {
  },
  setup() {
    const { menuMobileCollapsed, setMenuMobileCollapsed } = useUI()

    const { config } = useManage()
    return () => (
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center lg:h-13">
          <div class="flex lg:hidden justify-between items-center px-2 py-2 bg-default dark:bg-muted shadow-xs relative">
            <NButton text onClick={() => setMenuMobileCollapsed(!menuMobileCollapsed.value)}>
              <div class="i-tabler:menu-2 size-6" />
            </NButton>
            <div class="w-full absolute inset-0 flex items-center justify-center text-base pointer-events-none">
              {config.title}
            </div>
            <div>
              <DuxMenuAvatar collapsed={true} />
            </div>
          </div>

          <div class="flex-1 py-2">
            <DuxPageTab />
          </div>
        </div>

        <div class="flex-1 min-h-0  mr-2 ml-2 mb-2 lg:ml-0">
          <DuxTabRouterView />
        </div>
      </div>
    )
  },
})
