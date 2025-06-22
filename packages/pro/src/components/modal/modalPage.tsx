import type { PropType } from 'vue'
import { NButton } from 'naive-ui'
import { defineComponent, nextTick, ref, watch } from 'vue'

export default defineComponent({
  name: 'DuxModalPage',
  props: {
    title: {
      type: String,
      default: '',
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    handle: {
      type: String,
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  },
  setup(props, { slots }) {
    const closeRef = ref()

    watch(closeRef, (val) => {
      if (val) {
        nextTick(() => {
          val.$el?.focus?.()
        })
      }
    })

    return () => (
      <div class="flex flex-col gap-2">
        <div
          class={[
            'px-4 py-3 border-b border-muted rounded-t flex justify-between items-center  bg-white dark:bg-gray-800/50',
            props.draggable && 'cursor-move',
            props.handle,
          ]}
        >
          <div class="text-base font-bold">{props.title}</div>
          <div class="flex justify-end gap-2">
            <NButton text onClick={props.onClose} aria-label="close" ref={closeRef}>
              {{
                icon: () => <div class="i-tabler:x" />,
              }}
            </NButton>
          </div>
        </div>
        <div class="px-4 py-2">
          {slots.default?.()}
        </div>
        {slots.footer?.() && (
          <div class="flex justify-end gap-2 p-3 rounded-b border-t border-muted bg-muted dark:bg-gray-800/50">
            {slots.footer?.()}
          </div>
        )}
      </div>
    )
  },
})
