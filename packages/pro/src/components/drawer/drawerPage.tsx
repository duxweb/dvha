import type { PropType } from 'vue'
import { NButton, NScrollbar } from 'naive-ui'
import { defineComponent, nextTick, ref, watch } from 'vue'

export const DuxDrawerPage = defineComponent({
  name: 'DuxDrawerPage',
  props: {
    title: String,
    onClose: Function as PropType<() => void>,
    onConfirm: Function as PropType<() => void>,
    scrollbar: {
      type: Boolean,
      default: true,
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
      <div class="h-full flex flex-col">
        <div class="flex justify-between items-center p-2 border-b border-default">
          <div class="text-base">{props?.title}</div>
          <div class="flex items-center gap-2">
            {slots.header?.()}
            <NButton quaternary ref={closeRef} size="small" color="default" class="!px-1 h-6" onClick={() => props.onClose?.()}>
              <div class="i-tabler:x w-5 h-5"></div>
            </NButton>
          </div>
        </div>
        <div class="flex-1 min-h-1">
          {props.scrollbar ? <NScrollbar>{slots.default?.()}</NScrollbar> : slots.default?.()}
        </div>
        {slots.footer && (
          <div class="flex-none border-t border-muted p-4 flex justify-end gap-2">
            {slots.footer?.({
              onClose: props.onClose,
              onConfirm: props.onConfirm,
            })}
          </div>
        )}
      </div>
    )
  },
})
