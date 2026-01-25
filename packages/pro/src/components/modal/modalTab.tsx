import type { PropType, Ref } from 'vue'
import { NButton, NTabs } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ModalTab',
  props: {
    draggable: {
      type: Boolean,
      default: false,
    },
    defaultTab: {
      type: String,
      default: '0',
    },
    handle: {
      // `DuxModal` passes `draggableClass` (string). Keep backward compatibility with ref usage.
      type: [String, Object] as PropType<string | Ref<HTMLElement>>,
      default: '',
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col">
        <NTabs
          type="line"
          defaultValue={props.defaultTab}
          class="app-modal-tabs"
          size="large"
          style={{
            '--n-pane-padding-right': '16px',
            '--n-pane-padding-left': '16px',
          }}
        >
          {{
            default: () => slots.default?.(),
            prefix: () => {
              if (!props.draggable) {
                return null
              }
              const isRef = typeof props.handle === 'object' && props.handle !== null
              return (
                <div
                  class={[
                    'pl-4 cursor-move flex items-center',
                    !isRef && props.handle,
                  ]}
                  ref={isRef ? props.handle as any : undefined}
                >
                  <div class="i-tabler:grid-dots size-4" />
                </div>
              )
            },
            suffix: () => (
              <div class="pr-4 flex items-center">
                <NButton text onClick={props.onClose} aria-label="close">
                  {{
                    icon: () => <div class="i-tabler:x size-4" />,
                  }}
                </NButton>
              </div>
            ),
          }}
        </NTabs>
        {slots.footer?.() && (
          <div class="flex justify-end gap-2 p-3 rounded-b border-t border-muted bg-muted dark:bg-gray-800/50">
            {slots.footer?.()}
          </div>
        )}
      </div>
    )
  },
})
