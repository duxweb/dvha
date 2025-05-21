import { defineComponent, provide } from 'vue'
import { useRoute } from 'vue-router'

export const DuxAppProvider = defineComponent({
  name: 'DuxAppProvider',
  props: {
  },
  setup(_props, { slots }) {
    const route = useRoute()
    provide('dux.manage', route.meta.manageName)
    return () => (
      <>
        {slots.default?.()}
      </>
    )
  },
})
