import { defineComponent } from 'vue'

export const DuxGrid = defineComponent({
  name: 'DuxGrid',
  props: {
    cols: {
      type: Number,
      default: 2,
    },
    spac: {
      type: Number,
      default: 2,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class={`w-full grid md:grid-cols-${props?.cols || 2} grid-cols-1 gap-${props?.spac || 2}`}>
        {slots.default?.()}
      </div>
    )
  },
})
