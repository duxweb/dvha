import { defineComponent, PropType, provide } from 'vue'

export const DuxFilterLayout = defineComponent({
  name: 'DuxFilterLayout',
  props: {
    showLabel: {
      type: Boolean,
      default: false,
    },
    labelPlacement: {
      type: String as PropType<'left' | 'top'>,
      default: 'left',
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {

    provide('dux.filter', {
      showLabel: props.showLabel,
      labelPlacement: props.labelPlacement,
    })

    return () => (
      <div class={[
        'flex flex-col gap-2',
        props.horizontal ? 'flex-row' : 'flex-col',
      ]}>
        {slots.default?.()}
      </div>
    )
  },
})
