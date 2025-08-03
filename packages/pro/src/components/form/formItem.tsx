import type { RuleExpression } from 'vee-validate'
import type { PropType, VNode } from 'vue'
import { watchThrottled } from '@vueuse/core'
import { NTooltip } from 'naive-ui'
import { useField } from 'vee-validate'
import { computed, defineComponent, inject, ref, toRef, watch } from 'vue'

export const DuxFormItem = defineComponent({
  name: 'DuxFormItem',
  props: {
    label: String,
    description: [String, Object] as PropType<string | VNode>,
    tooltip: String,
    path: String,
    labelPlacement: {
      type: String as PropType<'left' | 'top' | 'setting' | 'page'>,
    },
    labelAlign: {
      type: String as PropType<'left' | 'right'>,
    },
    labelWidth: {
      type: Number,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rule: [String, Object] as PropType<RuleExpression<any>>,
    message: [String, Object] as PropType<string | Record<string, string>>,
  },
  setup(props, { slots }) {
    const message = toRef(props.message)
    const rule = computed(() => {
      if (typeof props.rule === 'object') {
        return {
          ...props.rule,
          required: !!props.required,
        }
      }
      if (typeof props.rule === 'string') {
        return props.rule?.includes('required') ? props.rule : (props.rule ? `${props.rule}|required` : 'required')
      }
      return props.rule
    })
    const { errorMessage, value, setErrors, validate } = useField(props.path || '', rule.value || {}, {
      label: props.label,
    })

    const isRequired = computed(() => {
      if (props.required)
        return true

      if (!props.rule)
        return false

      if (typeof props.rule === 'string') {
        return props.rule.includes('required')
      }

      if (typeof props.rule === 'object') {
        return 'required' in props.rule
      }
      return false
    })

    const error = computed(() => {
      return errorMessage.value && (message.value || errorMessage.value)
    })

    watch(error, (newError) => {
      if (newError) {
        setErrors(newError as string)
      }
    }, { immediate: true })

    watchThrottled(value, (v) => {
      if (!v) {
        return
      }
      validate()
    }, { throttle: 300, deep: true })

    const form = inject('dux.form', {
      labelPlacement: ref('left'),
      labelAlign: ref('left'),
      labelWidth: ref(70),
      divider: ref(false),
    })

    const labelPlacement = computed(() => {
      return props.labelPlacement || form.labelPlacement.value
    })

    const labelWidth = computed(() => {
      let width: string | number = props.labelWidth || form.labelWidth.value || 70
      if (typeof width === 'number') {
        width = `${width}px`
      }
      return labelPlacement.value !== 'left' ? 'auto' : width
    })

    const divider = computed(() => {
      return form.divider.value || labelPlacement.value === 'page'
    })

    return () => (
      <div class={[
        labelPlacement.value !== 'top' ? 'md:flex-row gap-2 lg:items-start' : 'gap-1',
        divider.value ? 'py-6' : '',
        labelPlacement.value === 'setting' ? 'md:justify-between md:items-start md:gap-4' : '',
        labelPlacement.value === 'page' ? 'grid grid-cols-1 lg:grid-cols-4 px-4' : 'flex flex-col',
      ]}
      >
        {props.label && (
          <div
            class={[
              labelPlacement.value === 'left' ? 'flex lg:items-center lg:pt-1.5' : 'md:mb-1',
              labelPlacement.value === 'left' && form.labelAlign.value === 'right' ? 'justify-end' : '',
            ]}
            style={{ width: labelWidth.value }}
          >
            <div class="flex flex-col">
              <div>
                <span class="relative flex items-center gap-1">
                  {props.label}
                  {props.tooltip && (
                    <NTooltip trigger="hover">
                      {{
                        trigger: () => <div class="i-tabler:help size-4 text-muted"></div>,
                        default: () => props.tooltip,
                      }}
                    </NTooltip>
                  )}
                  {isRequired.value && <span class="text-error font-mono text-xs">*</span>}
                </span>
              </div>
              {props.description && (labelPlacement.value === 'setting' || labelPlacement.value === 'page') && (
                <div class="text-sm text-muted">
                  {props.description}
                </div>
              )}
            </div>
          </div>
        )}
        <div class={[
          'flex flex-col gap-1',
          labelPlacement.value === 'setting' ? 'flex-none md:w-40%' : 'flex-1',
          labelPlacement.value === 'page' ? 'col-span-3' : '',
        ]}
        >
          <div class={labelPlacement.value === 'setting' ? 'flex-1 lg:flex lg:justify-end' : ''}>
            {slots?.default?.()}
          </div>
          {props.description && (labelPlacement.value === 'left' || labelPlacement.value === 'top') && (
            <div class="text-sm text-muted">
              {props.description}
            </div>
          )}

          {error.value && (
            <div class="text-error">
              {error.value}
            </div>
          )}
        </div>
      </div>
    )
  },
})
