import type { AsyncComponentLoader, PropType } from 'vue'
import { useExtendOverlay } from '@overlastic/vue'
import { NButton, NDrawer, NSpin } from 'naive-ui'
import { defineAsyncComponent, defineComponent, Suspense } from 'vue'

export default defineComponent({
  name: 'DuxDrawer',
  props: {
    title: String,
    width: [Number, String],
    component: {
      type: Function as PropType<AsyncComponentLoader<any>>,
      required: true,
    },
    componentProps: Object,
  },
  setup(props) {
    const { visible, resolve, reject, vanish } = useExtendOverlay({
      duration: 1000,
    })

    const params = props?.componentProps || {}
    params.onConfirm = resolve
    params.onClose = reject

    const Page = defineAsyncComponent(props.component)

    return () => (
      <NDrawer
        closeOnEsc={false}
        maskClosable={false}
        minWidth={400}
        defaultWidth={props?.width || 400}
        resizable={true}
        show={visible.value}
        onUpdateShow={() => resolve()}
        onAfterLeave={() => {
          vanish()
        }}
        class=""
      >
        <div class="h-full flex flex-col">
          <div class="flex justify-between items-center px-4 py-3 border-b border-gray-2 dark:border-gray-3">
            <div class="text-base">{props?.title}</div>
            <div>
              <NButton quaternary size="small" color="default" class="!px-1 h-6" onClick={() => reject()}>
                <div class="i-tabler:x w-5 h-5"></div>
              </NButton>
            </div>
          </div>
          <Suspense>
            {{
              default: () => <Page {...params} onSuccess={resolve} onClose={reject} />,
              fallback: () => (
                <NSpin show>
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
