import type { JsonSchemaData } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import { useJsonSchema } from '@duxweb/dvha-core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { NButton, NForm } from 'naive-ui'
import { defineComponent, h, reactive, ref } from 'vue'

export default defineComponent({
  name: 'DuxDialog',
  props: {
    title: String,
    content: String,
    type: String as PropType<'confirm' | 'success' | 'error' | 'prompt' | 'node'>,
    formSchema: Array as PropType<JsonSchemaData>,
    onClose: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
    onConfirm: {
      type: Function as PropType<() => void>,
      default: () => {},
    },
    render: Function,
  },
  setup(props) {
    const data = reactive({
      title: props?.title,
      content: props?.content,
      button: 'default',
    })

    if (props.type === 'confirm') {
      data.title = data.title || 'Confirm'
      data.content = data.content || 'Are you sure you want to confirm?'
      data.button = 'primary'
    }

    if (props.type === 'success') {
      data.title = data.title || 'Success'
      data.content = data.content || 'Success'
      data.button = 'success'
    }

    if (props.type === 'error') {
      data.title = data.title || 'Error'
      data.content = data.content || 'Error'
      data.button = 'error'
    }

    if (props.type === 'prompt') {
      data.title = data.title || 'Prompt'
      data.button = 'primary'
    }

    const { render } = useJsonSchema({
      data: props.formSchema || [],
    })

    const confirmButtonRef = ref<InstanceType<typeof NButton>>()

    const dialogRef = ref<HTMLElement>()
    useFocusTrap(dialogRef, {
      immediate: true,
      escapeDeactivates: false,
      returnFocusOnDeactivate: true,
      initialFocus: () => confirmButtonRef.value?.$el,
    })

    return () => (
      <div
        class="flex justify-center items-center size-full"
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={dialogRef}
          class="w-400px rounded border border-muted max-w-full shadow-lg shadow-gray-950/10 bg-white/80 dark:shadow-gray-950/80  dark:bg-gray-900/70 backdrop-blur"
        >
          {props.type !== 'node'
            ? (
                <div class="p-6 pb-2 flex gap-4">
                  <div>
                    {(props.type === 'confirm' || props.type === 'prompt') && (
                      <div class="bg-primary bg-opacity-10 text-primary rounded-full p-2">
                        <div class="i-tabler:info-circle size-5"></div>
                      </div>
                    )}
                    {props.type === 'success' && (
                      <div class="bg-success bg-opacity-10 text-success rounded-full p-2">
                        <div class="i-tabler:check size-5"></div>
                      </div>
                    )}
                    {props.type === 'error' && (
                      <div class="bg-error bg-opacity-10 text-error rounded-full p-2">
                        <div class="i-tabler:alert-triangle size-5"></div>
                      </div>
                    )}
                  </div>
                  <div class="flex flex-1 flex-col gap-2">
                    <div class="text-base font-bold">{data.title}</div>
                    {props.type === 'prompt'
                      ? (
                          <NForm labelAlign="left" showLabel={false} showFeedback={false} class="py-2">
                            {h(render)}
                          </NForm>
                        )
                      : (
                          <div class="text-sm text-gray-500">{data.content}</div>
                        )}
                  </div>
                </div>
              )
            : (
                <div class="p-4 flex flex-col gap-4">
                  <div class="text-base font-bold">{data.title}</div>
                  {props.render?.()}
                </div>
              )}
          <div class="px-4  pb-4 flex justify-end gap-2">
            {(props.type === 'confirm' || props.type === 'prompt') && (
              <NButton
                tertiary
                aria-label="取消"
                type={data.button as any}
                onClick={() => {
                  props.onClose?.()
                }}
              >
                取消
              </NButton>
            )}
            <NButton
              ref={confirmButtonRef}
              aria-label="确定"
              type={data.button as any}
              onClick={() => {
                props.onConfirm?.()
              }}
            >
              确定
            </NButton>
          </div>
        </div>
      </div>
    )
  },
})
