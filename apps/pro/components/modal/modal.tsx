import type { PropType } from 'vue'
import { useDraggable, useElementSize, useWindowSize } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.mjs'
import { NCard, NSpin } from 'naive-ui'
import { defineAsyncComponent, defineComponent, ref, Suspense, watch } from 'vue'

export const DuxModal = defineComponent({
  name: 'DuxModal',
  props: {
    title: {
      type: String,
      default: '',
    },
    component: {
      type: Function as PropType<() => any>,
    },
    componentProps: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    width: {
      type: Number,
      default: 500,
    },
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
    onConfirm: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const Page = defineAsyncComponent(props.component as () => Promise<any>)

    const el = ref<HTMLElement>()
    const handle = ref<HTMLElement>()
    const card = ref<HTMLElement>()

    const { width: windowWidth, height: windowHeight } = useWindowSize()
    const { width, height } = useElementSize(card)

    const { style, x, y } = useDraggable(el, {
      initialValue: {
        x: -1000,
        y: -1000,
      },
      preventDefault: true,
      handle,
      disabled: !props.draggable,
    })

    watch([width, height], ([w, h]) => {
      x.value = Math.max(0, (windowWidth.value - w) / 2)
      y.value = Math.max(0, (windowHeight.value - h) / 2)
    })

    const dialogRef = ref<HTMLElement>()
    useFocusTrap(dialogRef, {
      immediate: true,
      escapeDeactivates: false,
      returnFocusOnDeactivate: true,
    })

    return () => (
      <div
        class={`fixed inset-0 overflow-auto flex items-center justify-center p-4 ${props.draggable ? 'pointer-events-none' : ''}`}
        style="align-items: safe center;"
      >
        <div
          ref={el}
          style={style.value}
          class={props.draggable ? 'fixed pointer-events-auto' : 'w-full max-w-none flex justify-center'}
        >
          <NCard
            ref={card}
            contentClass="p-0!"
            bordered={false}
            size="small"
            role="dialog"
            aria-modal="true"
            class="border border-muted max-w-full shadow-lg shadow-gray-950/10 bg-white/80 dark:shadow-gray-950/80  dark:bg-gray-900/90 backdrop-blur"
            style={{
              width: `${props.width}px`,
            }}
          >
            <Suspense>
              {{
                default: () => <Page {...props.componentProps} ref={dialogRef} handle={handle} draggable={props.draggable} onClose={props.onClose} onConfirm={props.onConfirm} />,
                fallback: () => (
                  <NSpin show>
                    <div class="h-100"></div>
                  </NSpin>
                ),
              }}
            </Suspense>
          </NCard>
        </div>
      </div>
    )
  },
})

export default DuxModal
