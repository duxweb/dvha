import { NScrollbar } from 'naive-ui'
import { defineComponent } from 'vue'

export const DuxDrawerPage = defineComponent({
  name: 'DuxDrawerPage',
  props: {
  },
  setup(_props, { slots }) {
    return () => (
      <div class="flex-1 min-h-1 flex flex-col">
        <div class="flex-1 min-h-1">
          <NScrollbar>
            {slots.default?.()}
          </NScrollbar>
        </div>
        <div class="flex-none border-t border-gray-3 p-4 flex justify-end gap-2">
          {slots.action?.()}
        </div>
      </div>
    )
  },
})
