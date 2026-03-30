import { defineComponent } from 'vue'
import DuxSelectModal from './selectModal'

export default defineComponent({
  name: 'DuxSelectModalLazy',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () => <DuxSelectModal {...attrs}>{slots}</DuxSelectModal>
  },
})
