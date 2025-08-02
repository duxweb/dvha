import { defineComponent } from 'vue'
import { useUI } from '../../hooks'

export default defineComponent({
  name: 'DuxMenuButton',
  props: {
    class: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: '',
    },
    onClick: {
      type: Function,
      default: () => {},
    },
    collapsed: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const { menuCollapsed } = useUI()
    return () => (
      <div
        onClick={() => {
          props.onClick?.()
        }}
        class={[
          'flex items-center gap-1 justify-center py-1 px-2 cursor-pointer gap-2 flex-1 w-full',
          props.class,
        ]}
      >
        {slots.icon?.()}
        {props.collapsed === false && (!menuCollapsed.value) && (
          <div class={[
            'overflow-hidden ease-in-out whitespace-nowrap text-left min-w-0 flex-1',
            props.labelClass,
          ]}
          >
            {slots.default?.()}
          </div>
        )}
      </div>
    )
  },
})
