import { useExtendOverlay } from '@overlastic/vue'
import { onKeyStroke } from '@vueuse/core'
import { defineAsyncComponent, defineComponent, nextTick, onMounted, ref, Transition } from 'vue'

export const DuxOverlay = defineComponent({
  name: 'DuxOverlay',
  props: {
    component: Function,
    componentProps: Object,
    mask: {
      type: Boolean,
      default: true,
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 300,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
  },
  setup(props) {
    const { visible, resolve, reject } = useExtendOverlay({
      duration: props.duration,
    })

    const params = props?.componentProps || {}
    params.onConfirm = resolve
    params.onClose = reject

    const Modal = defineAsyncComponent(props.component as () => Promise<any>)

    const handleMaskClick = () => {
      if (props.maskClosable) {
        reject()
      }
    }

    const el = ref<HTMLElement>()

    onMounted(() => {
      nextTick(() => {
        if (document.activeElement && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      })
    })

    onKeyStroke(['Escape'], () => {
      reject()
    })

    return () => (
      <div
        class={`fixed inset-0 ${!props.mask ? 'pointer-events-none' : ''}`}
        style={{
          zIndex: props.zIndex,
        }}
      >
        <Transition
          enterActiveClass="transition-opacity"
          enterFromClass="opacity-0"
          enterToClass="opacity-100"
          leaveActiveClass="transition-opacity"
          leaveFromClass="opacity-100"
          leaveToClass="opacity-0"
        >
          {visible.value && props.mask && (
            <div
              class="fixed inset-0 bg-black bg-opacity-50 overflow-auto"
              style={{
                transitionDuration: `${props.duration}ms`,
              }}
              onClick={handleMaskClick}
              aria-hidden="true"
            >
            </div>
          )}
        </Transition>

        <Transition
          enterActiveClass="transition-all duration-150"
          enterFromClass="opacity-0 scale-90"
          enterToClass="opacity-100 scale-100"
          leaveActiveClass="transition-all duration-150"
          leaveFromClass="opacity-100 scale-100"
          leaveToClass="opacity-0 scale-90"
        >
          {visible.value && (
            <Modal ref={el} {...params} />
          )}
        </Transition>
      </div>
    )
  },
})
