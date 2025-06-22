import { useVModel } from '@vueuse/core'
import { NSelect } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { useLevel } from '../../hooks'

export const DuxLevel = defineComponent({
  name: 'DuxLevel',
  props: {
    value: {
      type: Array as () => string[],
      default: () => [],
    },
    path: {
      type: String,
      default: 'area',
    },
    maxLevel: {
      type: Number,
      default: 4,
    },
    nameField: {
      type: String,
      default: 'name',
    },
    labelField: {
      type: String,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'value',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const value = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: [],
    })

    const { regions, onChange, isLoading } = useLevel({
      value,
      path: props.path,
      nameField: props.nameField,
      maxLevel: props.maxLevel,
      labelField: props.labelField,
      valueField: props.valueField,
    })

    const handleChange = (selectedValue: string, index: number) => {
      onChange(selectedValue, index)
    }

    // 根据maxLevel创建对应数量的选择器
    const selectors = computed(() => {
      return Array.from({ length: props.maxLevel }, (_, index) => {
        const options = regions.value[index] || []
        return {
          index,
          options,
          value: value.value[index] || null,
        }
      })
    })

    return () => (
      <div class={[
        'grid grid-cols-1 gap-2',
        `lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]`,
      ]}
      >
        {selectors.value.map(selector => (
          <NSelect
            key={selector.index}
            value={selector.value}
            options={selector.options}
            clearable
            loading={isLoading.value}
            onUpdateValue={(val: string) => handleChange(val, selector.index)}
          />
        ))}
      </div>
    )
  },
})
