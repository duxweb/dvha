import { NScrollbar } from 'naive-ui'
import { defineComponent } from 'vue'

export const Panel = defineComponent({
  name: 'Panel',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col h-full">
        <div class="font-medium p-3 border-b border-default">
          {props.title}
        </div>
        <div class=" flex-1 min-h-0">
          <NScrollbar>
            <div class="p-3 flex flex-col gap-2">
              {slots.default?.()}
            </div>
          </NScrollbar>
        </div>
        <div class="border-t border-default p-3 flex flex-col gap-2">
          {slots.footer?.()}
        </div>
      </div>
    )
  },
})
