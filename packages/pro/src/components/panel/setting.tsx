import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { DuxCard } from '../card'

export const DuxPanelCard = defineComponent({
  name: 'DuxPanelCard',
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    padding: {
      type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col gap-4">
        <div class="flex items-center">
          <div class="flex-1 flex flex-col">
            <div class="text-base">
              {props.title}
            </div>
            {props.description && (
              <div class="text-sm text-muted">
                {props.description}
              </div>
            )}
          </div>
          <div class="flex-none flex items-center">
            {slots.actions?.()}
          </div>
        </div>

        <DuxCard size={props.padding} bordered shadow={false}>
          {slots.default?.()}
        </DuxCard>
      </div>
    )
  },
})
