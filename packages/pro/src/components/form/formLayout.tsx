import type { PropType } from 'vue'
import { defineComponent, provide, toRef } from 'vue'

export const DuxFormLayout = defineComponent({
  name: 'DuxFormLayout',
  props: {
    labelPlacement: {
      type: String as PropType<'left' | 'top' | 'setting' | 'page'>,
      default: 'left',
    },
    labelAlign: {
      type: String as PropType<'left' | 'right'>,
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
      labelPlacement: toRef(props, 'labelPlacement'),
      labelAlign: toRef(props, 'labelAlign'),
      labelWidth: toRef(props, 'labelWidth'),
      divider: toRef(props, 'divider'),
    })

    return () => (
      <div class={[
        'flex ',
        (props.divider || props.labelPlacement === 'page') ? ' divide-y divide-default dark:divide-gray-800' : '',
        props.inline ? 'flex-row' : 'flex-col',
        props.labelPlacement === 'page' || props.labelPlacement === 'setting' ? 'container mx-auto' : 'gap-4',
      ]}
      >
        {slots?.default?.()}
      </div>
    )
  },
})
