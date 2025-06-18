import type { PropType } from 'vue'
import { defineComponent, provide } from 'vue'

export const DuxFormLayout = defineComponent({
  name: 'DuxFormLayout',
  props: {
    labelPlacement: {
      type: String as PropType<'left' | 'top' | 'setting'>,
      default: 'left',
    },
    labelWidth: {
      type: Number,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    divider: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    provide('dux.form', {
      labelPlacement: props.labelPlacement,
      labelWidth: props.labelWidth,
      divider: props.divider,
    })

    return () => (
      <div class={[
        'flex gap-4',
        props.divider && 'divide-y divide-muted',
        props.inline ? 'flex-row' : 'flex-col',
      ]}
      >
        {slots?.default?.()}
      </div>
    )
  },
})
