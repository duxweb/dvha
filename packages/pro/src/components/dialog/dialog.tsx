import type { JsonSchemaData } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import { useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { useExtendOverlay } from '@overlastic/vue'
import { NButton, NForm, NModal } from 'naive-ui'
import { defineComponent, h, reactive, ref } from 'vue'

export default defineComponent({
  name: 'DuxDialog',
  props: {
    title: String,
    content: String,
    type: String as PropType<'confirm' | 'success' | 'error' | 'prompt' | 'node'>,
    formSchema: Array as PropType<JsonSchemaData>,
    defaultValue: Object as PropType<Record<string, any>>,
    render: Function,
  },
  setup(props) {
    const { t } = useI18n()
    const { visible, resolve, reject, vanish } = useExtendOverlay({
      duration: 1000,
    })

    const data = reactive({
      title: props?.title,
      content: props?.content,
      button: 'default',
    })

    if (props.type === 'confirm') {
      data.title = data.title || t('components.dialog.confirm.title')
      data.content = data.content || t('components.dialog.confirm.content')
      data.button = 'primary'
    }

    if (props.type === 'success') {
      data.title = data.title || t('components.dialog.success.title')
      data.content = data.content || t('components.dialog.success.content')
      data.button = 'success'
    }

    if (props.type === 'error') {
      data.title = data.title || t('components.dialog.error.title')
      data.content = data.content || t('components.dialog.error.content')
      data.button = 'error'
    }

    if (props.type === 'prompt') {
      data.title = data.title || t('components.dialog.prompt.title')
      data.button = 'primary'
    }

    const form = ref<Record<string, any>>({
      ...props.defaultValue,
    })

    const { render } = useJsonSchema({
      data: props.formSchema || [],
      context: {
        form: form.value,
      },
    })

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
        role="dialog"
        aria-modal="true"
        draggable={true}
      >
        {{
          default: ({ draggableClass }) => (
            <div
              class={[
                'w-400px rounded border border-muted max-w-full shadow-lg shadow-gray-950/10 bg-white/70 dark:shadow-gray-950/80  dark:bg-gray-900/70 backdrop-blur',

              ]}
            >
              {props.type !== 'node'
                ? (
                    <div class={[
                      'p-6 pb-2 flex gap-4',
                      draggableClass,
                    ]}
                    >
                      <div>
                        {(props.type === 'confirm' || props.type === 'prompt') && (
                          <div class="bg-warning bg-opacity-10 text-warning rounded-full p-2">
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
                    aria-label={t('components.button.cancel')}
                    type={data.button as any}
                    onClick={() => {
                      reject()
                    }}
                  >
                    {t('components.button.cancel')}
                  </NButton>
                )}
                <NButton
                  aria-label={t('components.button.confirm')}
                  type={data.button as any}
                  onClick={() => {
                    resolve(form.value)
                  }}
                >
                  {t('components.button.confirm')}
                </NButton>
              </div>
            </div>
          ),
        }}
      </NModal>
    )
  },
})
