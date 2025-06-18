import { defineComponent } from 'vue'

export const DuxTableFilter = defineComponent({
  name: 'DuxTableFilter',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex gap-2 gap-2 flex-nowrap items-center">
        {props.label && <div class="text-sm text-default whitespace-nowrap">{props.label}</div>}
        <div class="flex-1 lg:flex-none min-w-20">
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
