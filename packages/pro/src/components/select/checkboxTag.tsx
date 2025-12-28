import type { PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'

export interface DuxCheckOption {
  label: string
  value: string | number
  disabled?: boolean
}

function optionClasses(checked: boolean, disabled: boolean) {
  return [
    'inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-sm transition-colors duration-150 cursor-pointer select-none',
    checked
      ? 'text-primary bg-primary/15'
      : 'text-default  bg-transparent hover:text-primary',
    disabled && 'opacity-50 cursor-not-allowed',
  ]
}

export const DuxCheckboxTag = defineComponent({
  name: 'DuxCheckboxTag',
  props: {
    options: {
      type: Array as PropType<DuxCheckOption[]>,
      default: () => [],
    },
    value: {
      type: Array as PropType<(string | number)[]>,
      default: undefined,
    },
    defaultValue: {
      type: Array as PropType<(string | number)[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onUpdateValue: {
      type: Function as PropType<(value: (string | number)[]) => void>,
      default: undefined,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      defaultValue: props.defaultValue,
    })

    const getCurrent = () => Array.isArray(model.value) ? [...model.value] : []

    const toggle = (option: DuxCheckOption) => {
      const current = getCurrent()
      const exists = current.includes(option.value)
      const nextValue = exists
        ? current.filter(item => item !== option.value)
        : [...current, option.value]
      model.value = nextValue
      props.onUpdateValue?.(nextValue)
      emit('change', nextValue)
    }

    const isChecked = (option: DuxCheckOption) => {
      return Array.isArray(model.value) && model.value.includes(option.value)
    }

    return () => (
      <div class="flex flex-wrap gap-2">
        {props.options.map((option) => {
          const disabled = props.disabled || option.disabled || false
          const checked = isChecked(option)
          return (
            <div
              key={option.value}
              class={optionClasses(checked, disabled)}
              onClick={() => !disabled && toggle(option)}
            >
              {option.label}
            </div>
          )
        })}
      </div>
    )
  },
})
