import { OverlaysProvider } from '@overlastic/vue'
import { defineComponent } from 'vue'
import { useUI } from '../hooks'
import { DuxGlobalLayout } from './layout/global'
import { DuxLayoutPage } from './layout/page'
import { DuxMenuCmd, DuxMenuMain } from './menu'
import { DuxMobileMenu } from './menu/mobile'

export const DuxAuthLayout = defineComponent({
  name: 'DuxAuthLayout',
  setup() {
    const { menuCollapsed } = useUI()

    return () => (
      <DuxGlobalLayout>
        <OverlaysProvider>
          <div class="h-screen w-screen flex relative">
            <div
              class={[
                'flex-none transition-all',
                'hidden lg:block app-menu',
                menuCollapsed.value ? 'w-120px' : 'w-200px',
              ]}
            >
              <DuxMenuMain />
            </div>
            <DuxLayoutPage />
          </div>
          <DuxMenuCmd />
          <DuxMobileMenu />
        </OverlaysProvider>
      </DuxGlobalLayout>
    )
  },
})
