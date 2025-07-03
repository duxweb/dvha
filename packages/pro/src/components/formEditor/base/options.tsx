import type { PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { NDynamicInput, NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import { DuxModalPage } from '../../modal'

interface OptionItem {
  label: string
  value: string
}

const DuxFormEditorOptions = defineComponent({
  name: 'DuxFormEditorOptions',
  props: {
    value: {
      type: Array,
      default: [],
    },
    onChange: Function,
    options: Array as PropType<OptionItem[]>,
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: [],
      shouldEmit: (v) => {
        props.onChange?.(v)
        return true
      },
    })
    return () => (
      <DuxModalPage>
        <NDynamicInput
          v-model:value={data.value}
          onCreate={() => {
            return {
              label: '',
              value: undefined,
            }
          }}
        >
          {{
            default: ({ value }) => (
              <div class="grid grid-cols-2 gap-2">
                {props.options?.map((item, index) => <NInput key={index} v-model:value={value[item.value]} />)}
              </div>
            ),
          }}
        </NDynamicInput>
      </DuxModalPage>
    )
  },
})
export default DuxFormEditorOptions
