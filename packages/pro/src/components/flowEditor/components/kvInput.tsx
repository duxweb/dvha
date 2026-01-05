import type { PropType } from 'vue'
import type { FlowKVItem } from '../types'
import { NDynamicInput, NInput } from 'naive-ui'
import { computed, defineComponent } from 'vue'

function createItem(): FlowKVItem {
  return { name: '', value: '' }
}

export const FlowKVInput = defineComponent({
  name: 'FlowKVInput',
  props: {
    modelValue: {
      type: Array as PropType<FlowKVItem[] | null>,
      default: () => [],
    },
    value: {
      type: Array as PropType<FlowKVItem[] | null>,
      default: () => null,
    },
    namePlaceholder: {
      type: String,
      default: '键',
    },
    valuePlaceholder: {
      type: String,
      default: '值',
    },
  },
  emits: ['update:modelValue', 'update:value'],
  setup(props, { emit }) {
    const items = computed<FlowKVItem[]>({
      get: () => {
        if (Array.isArray(props.value)) {
          return props.value
        }
        if (Array.isArray(props.modelValue)) {
          return props.modelValue
        }
        return []
      },
      set: (val) => {
        emit('update:value', val)
        emit('update:modelValue', val)
      },
    })

    const handleUpdate = (val: FlowKVItem[]) => {
      items.value = val
    }

    return () => (
      <NDynamicInput
        value={items.value}
        onUpdateValue={handleUpdate}
        onCreate={createItem}
      >
        {{
          default: ({ value }: { value: FlowKVItem }) => (
            <div class="flex gap-2">
              <NInput
                value={value.name}
                placeholder={props.namePlaceholder}
                onUpdateValue={(val) => {
                  value.name = val || ''
                }}
              />
              <NInput
                value={value.value}
                placeholder={props.valuePlaceholder}
                onUpdateValue={(val) => {
                  value.value = val || ''
                }}
              />
            </div>
          ),
        }}
      </NDynamicInput>
    )
  },
})
