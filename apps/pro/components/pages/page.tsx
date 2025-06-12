import { useI18n, useTabStore } from '@duxweb/dvha-core'
import { useNaiveTab } from '@duxweb/dvha-naiveui'
import { NButton, NTab, NTabs } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { useUI } from '../../hooks/ui'

export default defineComponent({
  name: ' ',
  setup(_, { slots }) {
    const i18n = useI18n()
    const { props: tabsProps, tabs } = useNaiveTab()
    const tab = useTabStore()
    const { menuCollapsed, setMenuCollapsed, menuMobileCollapsed, setMenuMobileCollapsed } = useUI()

    const tabsRef = ref<InstanceType<typeof NTabs>>()

    return () => (
      <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex justify-between items-center h-15 px-3 ">
          <div class="flex gap-2 items-center">
            <NButton class="hidden lg:block" text onClick={() => setMenuCollapsed(!menuCollapsed.value)}>
              {menuCollapsed.value ? <div class="i-tabler:layout-sidebar-left-expand size-6" /> : <div class="i-tabler:layout-sidebar-left-collapse size-6" />}
            </NButton>
            <NButton class="block lg:hidden" text onClick={() => setMenuMobileCollapsed(!menuMobileCollapsed.value)}>
              <div class="i-tabler:menu-2 size-6" />
            </NButton>
            <div class="text-default text-base">
              { i18n.t('overview') }
            </div>
          </div>
          <div class="flex items-center gap-2">
            {slots.actions?.()}
          </div>
        </div>

        <div class="flex-1 min-h-0 flex flex-col">
          <div class="mx-2">
            <NTabs
              size="small"
              type="card"
              class="app-page-tabs"
              {...tabsProps.value}
            >
              {{
                default: () => tabs.map(tab => (
                  <NTab key={tab.path} name={tab.path || ''} closable={!tab.meta?.lock}>
                    { tab.label }
                  </NTab>
                )),
                suffix: () => <div class="i-tabler:chevron-right size-4" />,
              }}
            </NTabs>
          </div>

          <div class="border border-muted rounded flex-1 min-h-0 overflow-y-auto app-page-body m-2">
            {slots.default?.()}
          </div>
        </div>
      </div>
    )
  },
})
