import { sfcLoader } from '@duxweb/dvha-core'
import { NSpin } from 'naive-ui'
import { defineAsyncComponent, defineComponent, Suspense } from 'vue'
import { DuxModalPage } from '../../components'

export default defineComponent({
  name: 'DuxRemoteMenuModal',
  props: {
    loader: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    handle: {
      type: String,
      default: '',
    },
    onClose: {
      type: Function,
      default: null,
    },
    onConfirm: {
      type: Function,
      default: null,
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const Page: any = defineAsyncComponent({
      loader: sfcLoader(props.loader),
    })

    return () => (
      <DuxModalPage
        title={props.title}
        draggable={props.draggable}
        handle={props.handle}
        onClose={props.onClose as any}
      >
        <Suspense>
          {{
            default: () => (
              <Page
                {...props.componentProps}
                onClose={props.onClose}
                onConfirm={props.onConfirm}
              />
            ),
            fallback: () => (
              <NSpin show>
                <div class="h-100"></div>
              </NSpin>
            ),
          }}
        </Suspense>
      </DuxModalPage>
    )
  },
})
