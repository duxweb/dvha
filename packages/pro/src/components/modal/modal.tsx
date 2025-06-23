import type { ModalProps } from 'naive-ui'
import type { AsyncComponentLoader, Component, PropType } from 'vue'
import { useExtendOverlay } from '@overlastic/vue'
import { NModal, NSpin } from 'naive-ui'
import { defineAsyncComponent, defineComponent, Suspense } from 'vue'

export const DuxModal = defineComponent({
  name: 'DuxModal',
  props: {
    title: {
      type: String,
    },
    component: {
      type: [Function, Object] as PropType<AsyncComponentLoader<any> | Component>,
    },
    componentProps: Object,
    width: {
      type: [Number, String],
      default: 500,
    },
    modalProps: {
      type: Object as PropType<ModalProps>,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { visible, resolve, reject, vanish } = useExtendOverlay({
      duration: 1000,
    })

    const params = props?.componentProps || {}
    params.onConfirm = resolve
    params.onClose = reject

    const Page = typeof props.component === 'function'
      ? defineAsyncComponent(props.component as AsyncComponentLoader<any>)
      : props.component as Component

    return () => (
      <NModal
        displayDirective="show"
        show={visible.value}
        onAfterLeave={() => {
          vanish()
        }}
        onClose={() => {
          reject()
        }}
        onEsc={() => {
          reject()
        }}
        draggable={props.draggable}
        class="bg-white rounded dark:shadow-gray-950/80  dark:bg-gray-800/60 backdrop-blur"
        role="dialog"
        aria-modal="true"
        {...props.modalProps}
        autoFocus={false}
      >
        {{
          default: ({ draggableClass }) => (
            <div
              class={[
                'max-w-full shadow-lg',
              ]}
              style={{
                width: typeof props.width === 'number' ? `${props.width}px` : props.width,
              }}
            >
              <Suspense>
                {{
                  default: () => <Page {...params} title={props.title} handle={draggableClass} />,
                  fallback: () => (
                    <NSpin show>
                      <div class="h-100"></div>
                    </NSpin>
                  ),
                }}
              </Suspense>
            </div>
          ),
        }}
      </NModal>
    )
  },
})

export default DuxModal
