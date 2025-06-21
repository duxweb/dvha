import { defineComponent } from 'vue'
import { useUI } from '../../hooks'

export default defineComponent({
  name: 'DuxMenuButton',
  props: {
    class: {
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
    inverted: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const { menuCollapsed, menuMobileCollapsed } = useUI()
    return () => (
      <div
        onClick={() => {
          props.onClick?.()
        }}
        class={[
          'flex items-center gap-1 justify-center py-1 px-2 cursor-pointer gap-2',
          props.class,
          menuCollapsed.value && !menuMobileCollapsed.value ? 'group' : 'hover:shadow-xs hover:bg-default flex-1 w-full',
          props.inverted ? 'transition-all duration-300 bg-inverted/5 rounded-full hover:bg-default hover:shadow-xs' : ' rounded-md',
        ]}
      >
        {slots.icon?.()}
        {props.collapsed === false && (!menuCollapsed.value && !menuMobileCollapsed.value) && (
          <div class={[
            'overflow-hidden ease-in-out whitespace-nowrap text-left min-w-0 flex-1',
            props.inverted ? 'text-default' : '',
          ]}
          >
            {slots.default?.()}
          </div>
        )}
      </div>
    )
  },
})
