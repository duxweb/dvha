import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'
import { DuxModalPage } from '../../modal'
import { DuxCodeEditor } from '../../code'

const DuxFormEditorJson = defineComponent({
  name: 'DuxFormEditorJson',
  props: {
    value: {
      type: String,
      default: [],
    },
    onChange: Function,
    desc: String,
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: '',
      shouldEmit: (v) => {
        props.onChange?.(v)
        return true
      },
    })
    return () => (
      <DuxModalPage>
        <div class="flex flex-col gap-4">
          {props.desc && <div class="px-4 py-3 border border-primary-5 bg-primary/10 rounded-sm text-primary text-sm">{props.desc}</div>}
          <DuxCodeEditor v-model:value={data.value} />
        </div>
      </DuxModalPage>
    )
  },
})
export default DuxFormEditorJson
