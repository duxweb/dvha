import type { PropType } from 'vue'
import type { UseActionItem } from '../hooks/table/types'
import { NScrollbar } from 'naive-ui'
import { defineComponent } from 'vue'

export const DuxPage = defineComponent({
  name: 'DuxPage',
  props: {
    padding: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Array as PropType<UseActionItem[]>,
      default: () => [],
    },
    card: {
      type: Boolean,
      default: true,
    },
    scrollbar: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () => {
      const cardClass = props.card ? 'bg-default dark:bg-muted rounded-md shadow-xs lg:dark:border lg:dark:border-muted' : ''
      const paddingClass = props.card && props.padding ? 'p-3' : ''
      const scrollClass = !props.scrollbar ? 'h-full' : ''

      const content = (
        <div class="h-full">
          {props.scrollbar
            ? (
                <NScrollbar
                  class={cardClass}
                  contentClass={`${paddingClass} ${scrollClass}`}
                >
                  {slots.default?.()}
                </NScrollbar>
              )
            : (
                <div class={`${cardClass} ${paddingClass} ${scrollClass}`}>
                  {slots.default?.()}
                </div>
              )}
        </div>
      )

      return content
    }
  },
})
