import { NDrawer } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../hooks'
import { DuxMenuMain } from './menu'

export const DuxMobileMenu = defineComponent({
  name: 'DuxMobileMenu',
  props: {
  },
  setup(props, { slots }) {
    const { menuMobileCollapsed } = useUI()
    return () => (
      <NDrawer show={menuMobileCollapsed.value} onUpdateShow={v => menuMobileCollapsed.value = v} width={250} placement="left">
        <DuxMenuMain />
      </NDrawer>
    )
  },
})
