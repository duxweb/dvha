import type { PropType, Ref } from 'vue'
import { NButton } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ModalPage',
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
      type: Object as PropType<Ref<HTMLElement>>,
      default: () => ref<HTMLElement>(),
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col gap-2">
        <div
          class={[
            'px-4 py-3 border-b border-muted flex justify-between items-center  bg-gray-200/20 dark:bg-gray-800/50',
            props.draggable && 'cursor-move',
          ]}
          ref={props.handle}
        >
          <div class="text-base font-bold">{props.title}</div>
          <div class="flex justify-end gap-2">
            <NButton text onClick={props.onClose} aria-label="close">
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
          <div class="flex justify-end gap-2 p-3 border-t border-muted bg-gray-200/20 dark:bg-gray-800/50">
            {slots.footer?.()}
          </div>
        )}
      </div>
    )
  },
})
