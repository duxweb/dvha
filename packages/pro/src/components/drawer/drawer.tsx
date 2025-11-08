import type { AsyncComponentLoader, Component, PropType } from 'vue'
import { useDisclosure } from '@overlastic/vue'
import { NDrawer, NSpin } from 'naive-ui'
import { defineAsyncComponent, defineComponent, Suspense } from 'vue'

export default defineComponent({
  name: 'DuxDrawer',
  props: {
    title: String,
    width: [Number, String],
    maxWidth: [Number],
    placement: {
      type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
      default: 'right',
    },
    component: {
      type: [Function, Object] as PropType<AsyncComponentLoader<any> | Component>,
      required: true,
    },
    componentProps: Object,
  },
  setup(props) {
    const { visible, confirm, cancel, vanish } = useDisclosure({
      duration: 1000,
    })

    const params = props?.componentProps || {}
    params.title = props.title
    params.onConfirm = confirm
    params.onClose = cancel

    const Page = typeof props.component === 'function'
      ? defineAsyncComponent(props.component as AsyncComponentLoader<any>)
      : props.component as Component

    return () => (
      <NDrawer
        closeOnEsc={false}
        maskClosable={false}
        minWidth={200}
        maxWidth={props?.maxWidth || 800}
        defaultWidth={props?.width || 400}
        resizable={true}
        placement={props.placement}
        show={visible.value}
        onUpdateShow={() => confirm()}
        onAfterLeave={() => {
          vanish()
        }}
        onEsc={() => {
          cancel()
        }}
        autoFocus={false}
      >
        <div class="h-full">
          <Suspense>
            {{
              default: () => <Page {...params} />,
              fallback: () => (
                <NSpin show class="h-full">
                  <div class="flex-1 min-h-1"></div>
                </NSpin>
              ),
            }}
          </Suspense>

        </div>
      </NDrawer>
    )
  },
})
