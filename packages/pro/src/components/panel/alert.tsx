import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'

export const DuxPanelAlert = defineComponent({
  name: 'DuxPanelAlert',
  props: {
    type: {
      type: String as PropType<'default' | 'error' | 'warning' | 'info' | 'success'>,
      default: 'default',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const typeClass = computed(() => {
      switch (props.type) {
        case 'error':
          return 'to-error/20'
        case 'warning':
          return 'to-warning/20'
        case 'info':
          return 'to-info/20'
        case 'success':
          return 'to-success/20'
        default:
          return 'to-gray/20'
      }
    })

    return () => (
      <div class={`relative flex rounded-lg ring ring-muted bg-linear-to-br from-transparent ${typeClass.value}`}>
        <div class="relative flex flex-col flex-1 lg:grid gap-x-8 gap-y-4 p-4 sm:p-6">
          <div class="flex flex-col flex-1 items-start">
            <div class="flex-1">
              <div class="text-base text-pretty text-highlighted">
                {slots.title?.() || props.title}
              </div>
              <div class="text-sm text-pretty text-muted mt-1">
                {slots.description?.() || props.description}
              </div>
            </div>
            {slots.actions && (
              <div class="pt-4 mt-auto">
                {slots.actions?.()}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  },
})
