import type { AiMessage } from 'aieditor'
import type { PropType } from 'vue'
import { useGetAuth, useI18n, useManage, useTheme, useUpload } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { useMessage } from 'naive-ui'
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'

export const DuxAiEditor = defineComponent({
  name: 'DuxAiEditor',
  props: {
    value: String,
    defaultValue: String,
    uploadPath: String,
    uploadHeaders: Object as PropType<Record<string, any>>,
    aiPath: String,
    height: {
      type: String,
      default: '500px',
    },
    onUpdateValue: Function as PropType<(value: string) => void>,
  },
  setup(props, { emit }) {
    const divRef = ref()
    let aiEditor: AiEditor | null = null
    let internalUpdate = false

    const theme = useTheme()
    const { config } = useManage()
    const auth = useGetAuth()
    const { t } = useI18n()
    const message = useMessage()

    const initialContent = (props.value ?? props.defaultValue ?? '') as string

    const model = useVModel(props, 'value', emit, {
      passive: true,
    })

    const uploadPath = computed(() => {
      return props.uploadPath || config.apiPath?.upload || 'upload'
    })

    const upload = useUpload({
      path: uploadPath.value,
      autoUpload: false,
    })

    watch(model, (value) => {
      if (!aiEditor || internalUpdate) {
        return
      }
      aiEditor.setContent((value as string) || '')
    }, { immediate: true, flush: 'post' })

    const editorUpload = (file: File): Promise<Record<string, any>> => {
      return new Promise((resolve, reject) => {
        upload.addFiles([file], 'file').then(() => {
          upload.trigger().then((res) => {
            res.forEach((item) => {
              const data = item?.data?.data
              resolve({
                errorCode: 0,
                data: {
                  src: data?.url,
                  alt: item?.filename,
                },
              })
            })
          }).catch((error) => {
            message.error(error.message)
            reject(error)
          }).finally(() => {
            upload.clearFiles()
          })
        })
      })
    }

    onMounted(() => {
      aiEditor = new AiEditor({
        theme: theme.isDark.value ? 'dark' : 'light',
        element: divRef.value as Element,
        placeholder: t('components.editor.placeholder'),
        content: initialContent,
        onBlur: (ed) => {
          internalUpdate = true;
          model.value = ed.getHtml()
          internalUpdate = false;
        },
        image: {
          uploadUrl: uploadPath.value,
          uploadHeaders: props.uploadHeaders || {},
          uploader: editorUpload,
        },
        video: {
          uploadUrl: uploadPath.value,
          uploadHeaders: props.uploadHeaders || {},
          uploader: editorUpload,
        },
        attachment: {
          uploadUrl: uploadPath.value,
          uploadHeaders: props.uploadHeaders || {},
          uploader: editorUpload,
        },
        ai: {
          models: {
            custom: {
              url: props.aiPath || config.apiPath?.ai || 'ai',
              headers: () => {
                return {
                  'Content-Type': 'application/json',
                  'Authorization': auth.token,
                }
              },
              wrapPayload: (message: string) => {
                return JSON.stringify({ prompt: message })
              },
              parseMessage: (message: string): AiMessage => {
                const data = JSON.parse(message)
                return {
                  role: 'assistant',
                  content: data.message,
                  index: data.number,
                  status: data.status,
                }
              },
              protocol: 'sse',
            },
          },
        },
      })
      if (model.value != null) {
        aiEditor.setContent((model.value as string) || '')
      }
    })

    onUnmounted(() => {
      aiEditor?.destroy()
    })

    watch(theme.isDark, (value) => {
      if (!divRef.value) {
        return
      }
      divRef.value.classList.remove('aie-theme-dark', 'aie-theme-light')
      divRef.value.classList.add(value ? 'aie-theme-dark' : 'aie-theme-light')
    }, { immediate: true })

    return () => (
      <div ref={divRef} style={`height: ${props.height}; width:100%`} />
    )
  },
})
