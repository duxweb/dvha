import type { PropType } from 'vue'
import { NButton, NTabs } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DrawerTab',
  props: {
    defaultTab: {
      type: String,
      default: '0',
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="h-full flex flex-col drawer-page">
        <NTabs
          type="line"
          defaultValue={props.defaultTab}
          class="app-modal-tabs flex-1 min-h-0"
          size="large"
          style={{
            '--n-pane-padding-right': '16px',
            '--n-pane-padding-left': '16px',
          }}
        >
          {{
            default: () => slots.default?.(),
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
        {slots.footer && (
          <div class="flex justify-end gap-2 p-3 rounded-b border-t border-muted bg-muted dark:bg-gray-800/50">
            {slots.footer?.()}
          </div>
        )}
      </div>
    )
  },
})
