import type { PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { defineComponent } from 'vue'

export interface CardSelectOption {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
  icon?: string
  iconColor?: string
}

export const DuxSelectCard = defineComponent({
  name: 'DuxSelectCard',
  props: {
    options: {
      type: Array as PropType<CardSelectOption[]>,
      default: () => [],
    },
    value: {
      type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    minWidth: {
      type: String,
      default: '150px',
    },
    maxWidth: {
      type: String,
      default: '200px',
    },
    onUpdateValue: {
      type: Function as PropType<(value: string | number | (string | number)[]) => void>,
      default: undefined,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue,
    })

    const handleSelect = (value: string | number) => {
      if (props.disabled)
        return

      if (props.multiple) {
        const currentValue = Array.isArray(model.value) ? model.value : []
        model.value = currentValue.includes(value)
          ? currentValue.filter(v => v !== value)
          : [...currentValue, value]
      }
      else {
        model.value = value
      }

      props.onUpdateValue?.(model.value)
      emit('update:value', model.value)
    }

    const isSelected = (value: string | number) => {
      if (props.multiple) {
        return Array.isArray(model.value) && model.value.includes(value)
      }
      return model.value === value
    }

    const gridClasses = [
      'grid gap-4',
      'grid-cols-2',
      `lg:grid-cols-[repeat(auto-fill,minmax(${props.minWidth},${props.maxWidth}))]`,
    ]

    return () => (
      <div class={gridClasses}>
        {props.options.map(option => (
          <div
            key={option.value}
            class={[
              'relative cursor-pointer border rounded p-2.5 transition-all duration-200 hover:border-primary',
              {
                'border-primary bg-primary/5': isSelected(option.value),
                'border-muted': !isSelected(option.value),
                'opacity-50 cursor-not-allowed': option.disabled || props.disabled,
              },
            ]}
            onClick={() => !option.disabled && handleSelect(option.value)}
          >
            {isSelected(option.value) && (
              <div class="absolute top-2 right-2 size-4 bg-primary rounded-full flex items-center justify-center">
                <svg class="size-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            )}

            <div class={[
              'flex gap-3 px-2 items-center',
              {
                'flex-col items-center text-center': !option.icon,
                'flex-row items-start text-left': option.icon,
              },
            ]}
            >
              {option.icon && (
                <div class={[
                  'flex items-center justify-center p-3 rounded-lg',
                  `bg-${option.iconColor || 'primary'}/10`,
                  `text-${option.iconColor || 'primary'}`,
                ]}
                >
                  <div class={`${option.icon} size-4`}></div>
                </div>
              )}

              <div class="flex flex-col flex-1 gap-1">
                <div class={[
                  'text-sm font-medium',
                  {
                    'text-primary': isSelected(option.value),
                    'text-default': !isSelected(option.value),
                  },
                ]}
                >
                  {option.label}
                </div>
                {option.description && (
                  <div class={[
                    'text-xs',
                    {
                      'text-primary/80': isSelected(option.value),
                      'text-muted': !isSelected(option.value),
                    },
                  ]}
                  >
                    {option.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
})
