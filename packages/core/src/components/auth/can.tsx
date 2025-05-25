import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { useCan } from '../../hooks'

export const DuxCan = defineComponent({
  name: 'DuxCan',
  props: {
    name: { type: String, required: true },
    params: { type: Object as PropType<any> },
  },
  setup(props, { slots }) {
    const can = useCan()
    return () => can(props.name, props.params) ? slots.default?.() : (slots.fallback?.() || null)
  },
})
