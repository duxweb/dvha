import { useManage } from '@duxweb/dvha-core'
import { OverlaysProvider } from '@overlastic/vue'
import { defineComponent } from 'vue'
import { useUI } from '../hooks'
import { DuxGlobalLayout } from './layout/global'
import { DuxLayoutPage } from './layout/page'
import { DuxMenuApp, DuxMenuCmd, DuxMenuMain } from './menu'
import { DuxMobileMenu } from './menu/mobile'

export const DuxAuthLayout = defineComponent({
  name: 'DuxAuthLayout',
  setup() {
    const { menuCollapsed } = useUI()

    const manage = useManage()

    return () => (
      <DuxGlobalLayout>
        <OverlaysProvider>
          <div class="h-screen w-screen flex relative">
            {/* 菜单布局 */}
            {manage.config.theme?.layout === 'menu' && (
              <div
                class={[
                  'flex-none transition-all',
                  'hidden lg:block',
                  menuCollapsed.value ? 'w-120px' : 'w-200px',
                ]}
              >
                <DuxMenuMain />
              </div>
            )}
            {/* 应用布局 */}
            {(!manage.config.theme?.layout || manage.config.theme?.layout === 'app') && (
              <div
                class={[
                  'flex-none transition-all',
                  'hidden lg:block',
                ]}
              >
                <DuxMenuApp />
              </div>
            )}
            <DuxLayoutPage />
          </div>
          <DuxMenuCmd />
          <DuxMobileMenu />
        </OverlaysProvider>
      </DuxGlobalLayout>
    )
  },
})
