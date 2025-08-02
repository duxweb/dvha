import { NDrawer } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../hooks'
import { DuxMenuMain } from './menuMain'

export const DuxMobileMenu = defineComponent({
  name: 'DuxMobileMenu',
  props: {
  },
  setup(_props) {
    const { menuMobileCollapsed } = useUI()
    return () => (
      <NDrawer show={menuMobileCollapsed.value} onUpdateShow={v => menuMobileCollapsed.value = v} width={200} placement="left">
         <div
              class={[
                'flex-none transition-all',
              ]}
            >
        <DuxMenuMain collapsed={false} mobile={true} />

      </div>
      </NDrawer>
    )
  },
})
