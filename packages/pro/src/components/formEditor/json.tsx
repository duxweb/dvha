import { defineComponent } from 'vue'
import { DuxCodeEditor } from '../code'
import { DuxModalPage } from '../modal'

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => (
      <DuxModalPage>
        <DuxCodeEditor value={JSON.stringify(props.value, null, 2)} readonly />
      </DuxModalPage>
    )
  },
})
