import { defineComponent } from 'vue'
import DuxFileManage from './manager'

export default defineComponent({
  name: 'DuxFileManageLazy',
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () => <DuxFileManage {...attrs}>{slots}</DuxFileManage>
  },
})
