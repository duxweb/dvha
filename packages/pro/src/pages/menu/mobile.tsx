import { NDrawer } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../hooks'
import { DuxMenuMain } from './main'

export const DuxMobileMenu = defineComponent({
  name: 'DuxMobileMenu',
  props: {
  },
  setup(_props) {
    const { menuMobileCollapsed } = useUI()
    return () => (
      <NDrawer show={menuMobileCollapsed.value} onUpdateShow={v => menuMobileCollapsed.value = v} width={250} placement="left">
        <DuxMenuMain collapsed={false} />
      </NDrawer>
    )
  },
})
