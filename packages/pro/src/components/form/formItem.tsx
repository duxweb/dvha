import type { RuleExpression } from 'vee-validate'
import type { PropType, VNode } from 'vue'
import { watchThrottled } from '@vueuse/core'
import { useField } from 'vee-validate'
import { computed, defineComponent, inject, toRef, watch } from 'vue'

export const DuxFormItem = defineComponent({
  name: 'DuxFormItem',
  props: {
    label: String,
    description: [String, Object] as PropType<string | VNode>,
    path: String,
    labelPlacement: {
      type: String as PropType<'left' | 'top' | 'setting'>,
    },
    labelWidth: {
      type: Number,
    },
    rule: [String, Object] as PropType<RuleExpression<any>>,
    message: [String, Object] as PropType<string | Record<string, string>>,
  },
  setup(props, { slots }) {
    const message = toRef(props.message)

    const { errorMessage, value, setErrors, validate } = useField(props.path || '', props.rule || {}, {
      label: props.label,
    })

    const isRequired = computed(() => {
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
      labelPlacement: 'left',
      labelWidth: 70,
      divider: false,
    })

    const labelPlacement = computed(() => {
      return props.labelPlacement || form.labelPlacement
    })

    const labelWidth = computed(() => {
      let width: string | number = props.labelWidth || form.labelWidth || 70
      if (typeof width === 'number') {
        width = `${width}px`
      }
      return labelPlacement.value === 'top' || labelPlacement.value === 'setting' ? 'auto' : width
    })

    return () => (
      <div class={[
        'flex flex-col ',
        labelPlacement.value !== 'top' ? 'md:flex-row gap-2' : 'gap-1',
        form.divider && 'pb-4',
        labelPlacement.value === 'setting' ? 'md:justify-between md:items-start md:gap-4' : '',
      ]}
      >
        <div
          class={[
            labelPlacement.value !== 'top' && labelPlacement.value !== 'setting' ? 'mt-1.5' : '',
          ]}
          style={{ width: labelWidth.value }}
        >
          <div class="flex flex-col">
            <div>
              <span class="relative flex items-center gap-1">
                {props.label}
                {isRequired.value && <span class="text-error font-mono text-xs">*</span>}
              </span>
            </div>
            {props.description && typeof props.description === 'string' && (
              <div class="text-sm text-muted">
                {props.description}
              </div>
            )}
          </div>
        </div>
        <div class={[
          'flex flex-col gap-1',
          labelPlacement.value !== 'left' ? 'md:mt-1' : '',
          labelPlacement.value === 'setting' ? 'flex-none' : 'flex-1',
        ]}
        >
          <div>
            {slots?.default?.()}
          </div>
          {props.description && typeof props.description !== 'string' && (
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
