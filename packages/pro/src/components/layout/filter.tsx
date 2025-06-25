import { defineComponent, inject } from 'vue'

export const DuxTableFilter = defineComponent({
  name: 'DuxTableFilter',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {

    const filter = inject('dux.filter', {
      showLabel: false,
      labelPlacement: 'left',
    })

    return () => (
      <div class={[
        'flex gap-2 gap-2 flex-nowrap',
        filter.labelPlacement === 'left' ? 'flex-row items-center' : 'flex-col',
      ]}>
        {filter.showLabel && props.label && <div class="text-sm text-default whitespace-nowrap">{props.label}</div>}
        <div class="flex-1 min-w-60">
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
