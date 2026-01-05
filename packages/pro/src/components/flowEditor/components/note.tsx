import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const FlowNote = defineComponent({
  name: 'FlowNote',
  props: {
    content: {
      type: [String, Array, Object] as PropType<any>,
      default: '',
    },
    colorClass: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const renderContent = () => {
      if (slots.default) {
        return slots.default()
      }
      if (typeof props.content === 'string') {
        return props.content
      }
      if (Array.isArray(props.content) || typeof props.content === 'object') {
        try {
          return JSON.stringify(props.content, null, 2)
        }
        catch {
          return ''
        }
      }
      return props.content
    }

    return () => (
      <div class={['rounded-md border border-primary/60 bg-primary/10 text-primary p-4', props.colorClass]}>
        {renderContent()}
      </div>
    )
  },
})
