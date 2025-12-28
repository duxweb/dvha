import type { PropType } from 'vue'
import type { DuxCheckOption } from './checkboxTag'
import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'

function optionClasses(checked: boolean, disabled: boolean) {
  return [
    'inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-sm transition-colors duration-150 cursor-pointer select-none',
    checked
      ? 'text-primary  bg-primary/15'
      : 'text-default  bg-transparent  hover:text-primary',
    disabled && 'opacity-50 cursor-not-allowed',
  ]
}

export const DuxRadioTag = defineComponent({
  name: 'DuxRadioTag',
  props: {
    options: {
      type: Array as PropType<DuxCheckOption[]>,
      default: () => [],
    },
    value: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onUpdateValue: {
      type: Function as PropType<(value: string | number | undefined) => void>,
      default: undefined,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      defaultValue: props.defaultValue,
    })

    const select = (option: DuxCheckOption) => {
      const nextValue = model.value === option.value ? undefined : option.value
      model.value = nextValue
      props.onUpdateValue?.(nextValue)
      emit('change', nextValue)
    }

    const isChecked = (option: DuxCheckOption) => model.value === option.value

    return () => (
      <div class="flex flex-wrap gap-2">
        {props.options.map((option) => {
          const disabled = props.disabled || option.disabled || false
          const checked = isChecked(option)
          return (
            <div
              key={option.value}
              class={optionClasses(checked, disabled)}
              onClick={() => !disabled && select(option)}
            >
              {option.label}
            </div>
          )
        })}
      </div>
    )
  },
})
