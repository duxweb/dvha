import type { ButtonProps } from 'naive-ui'
import type { PropType } from 'vue'
import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import { useUI } from '../../../hooks/ui'

export default defineComponent({
  name: 'DuxMenuButton',
  props: {
    iconSize: {
      type: String,
      default: '32px',
    },
    size: {
      type: String as PropType<ButtonProps['size']>,
      default: 'large',
    },
    class: {
      type: String,
      default: '',
    },
  },
  extends: NButton,
  setup(props, { slots }) {
    const { menuCollapsed, menuMobileCollapsed } = useUI()
    return () => (
      <NButton
        {...props}
        block
        size={props.size}
        style={{
          '--n-icon-size': props.iconSize,
        }}
        class={[
          'justify-start px-1.5 app-menu-button',
          props.class,
        ]}
      >
        {{
          icon: () => slots.icon?.(),
          default: () => (
            <div class={[
              'overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap text-left w-full',
              menuCollapsed.value && !menuMobileCollapsed.value ? 'w-0' : 'w-auto',
            ]}
            >
              {slots.default?.()}
            </div>
          ),
        }}
      </NButton>
    )
  },
})
