import { useDisclosure } from '@overlastic/vue'
import { defineAsyncComponent, defineComponent, Transition } from 'vue'

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
    const { visible, confirm, cancel } = useDisclosure({
      duration: props.duration,
    })

    const params = props?.componentProps || {}
    params.onConfirm = confirm
    params.onClose = cancel

    const Modal = defineAsyncComponent(props.component as () => Promise<any>)

    const handleMaskClick = () => {
      if (props.maskClosable) {
        cancel()
      }
    }
    return () => (
      <div
        class="fixed inset-0 flex items-center justify-center overflow-auto"
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
              class="fixed inset-0 bg-black bg-opacity-30"
              style={{
                transitionDuration: `${props.duration}ms`,
              }}
              onClick={handleMaskClick}
            >
            </div>
          )}
        </Transition>

        <Transition
          enterActiveClass="transition-all"
          enterFromClass="opacity-0 scale-95"
          enterToClass="opacity-100 scale-100"
          leaveActiveClass="transition-all"
          leaveFromClass="opacity-100 scale-100"
          leaveToClass="opacity-0 scale-95"
        >
          {visible.value && (
            <Modal {...params} />
          )}
        </Transition>
      </div>
    )
  },
})
