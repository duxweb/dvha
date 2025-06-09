import { useI18n } from '@duxweb/dvha-core'
import { useNaiveTab } from '@duxweb/dvha-naiveui'
import { NButton, NTab, NTabs } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../hooks/ui'

export default defineComponent({
  name: 'DuxPage',
  setup(_, { slots }) {
    const i18n = useI18n()
    const { props: tabsProps, tabs } = useNaiveTab()
    const { menuCollapsed, setMenuCollapsed } = useUI()

    return () => (
      <div class="flex-1 w-auto flex flex-col">
        <div class="flex justify-between items-center border-b-1 border-muted h-15 px-3">
          <div class="flex gap-2 items-center">
            <NButton text onClick={() => setMenuCollapsed(!menuCollapsed.value)}>
              {menuCollapsed.value ? <div class="i-tabler:layout-sidebar-left-expand size-6" /> : <div class="i-tabler:layout-sidebar-left-collapse size-6" />}
            </NButton>
            <div class="text-default text-base">
              { i18n.t('overview') }
            </div>
          </div>
          <div class="flex items-center gap-2">
            {slots.actions?.()}
          </div>
        </div>

        <div class="px-3 py-3 border-b border-muted">
          <NTabs
            size="small"
            type="card"
            class="layout-tabs"
            tab-style="min-width: 80px;"
            {...tabsProps.value}
          >
            {tabs.map(tab => (
              <NTab key={tab.path} name={tab.path || ''} closable={!tab.meta?.lock}>
                { tab.label }
              </NTab>
            ))}
          </NTabs>
        </div>

        <div class="flex-1 h-auto overflow-y-auto">
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
