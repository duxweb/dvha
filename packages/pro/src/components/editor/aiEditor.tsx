import type { AiMessage } from 'aieditor'
import type { PropType } from 'vue'
import { useGetAuth, useI18n, useManage, useTheme, useUpload } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { AiEditor } from 'aieditor'
import { useMessage } from 'naive-ui'
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useModal } from '../../hooks'
import { useUploadConfig } from '../upload/config'

export const DuxAiEditor = defineComponent({
  name: 'DuxAiEditor',
  props: {
    value: String,
    defaultValue: String,
    uploadPath: String,
    uploadHeaders: Object as PropType<Record<string, any>>,
    editorType: {
      type: String as PropType<'richtext' | 'markdown'>,
      default: 'richtext',
    },
    aiPath: String,
    fileManager: {
      type: Boolean,
      default: true,
    },
    fileManagerType: {
      type: String as PropType<'all' | 'image' | 'media' | 'docs' | string>,
      default: 'all',
    },
    height: {
      type: String,
      default: '500px',
    },
  },
  setup(props, { emit, expose }) {
    const divRef = ref<HTMLElement>()
    let aiEditor: AiEditor | null = null
    let isUpdatingFromInternal = false

    const theme = useTheme()
    const { config } = useManage()
    const auth = useGetAuth()
    const { t } = useI18n()
    const message = useMessage()
    const modal = useModal()

    const model = useVModel(props, 'value', emit, { passive: true })

    const uploadPath = computed(() => {
      return props.uploadPath || config.apiPath?.upload || 'upload'
    })

    const upload = useUpload({
      path: uploadPath.value,
      autoUpload: false,
    })

    const { managePath, method } = useUploadConfig()

    const updateContent = () => {
      if (!aiEditor || isUpdatingFromInternal) return

      const content = model.value || ''
      if (props.editorType === 'markdown') {
        aiEditor.setMarkdownContent(content)
      } else {
        aiEditor.setContent(content)
      }
    }

    const handleEditorChange = () => {
      if (!aiEditor) return

      isUpdatingFromInternal = true
      const content = props.editorType === 'markdown' 
        ? aiEditor.getMarkdown() 
        : aiEditor.getHtml()
      
      model.value = content
      
      nextTick(() => {
        isUpdatingFromInternal = false
      })
    }

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

    const inferFileType = (item?: Record<string, any>): 'image' | 'video' | 'attachment' => {
      const mime = String(item?.filetype || '')
      const url: string = String(item?.url || '')
      if (/^image\//i.test(mime) || /\.(?:png|jpe?g|gif|bmp|webp|svg)$/i.test(url)) {
        return 'image'
      }
      if (/^video\//i.test(mime) || /\.(?:mp4|webm|ogg|mov|m4v)$/i.test(url)) {
        return 'video'
      }
      return 'attachment'
    }

    const createEditor = () => {
      if (!divRef.value) return

      const initialContent = props.value || props.defaultValue || ''

      aiEditor = new AiEditor({
        element: divRef.value,
        theme: theme.isDark.value ? 'dark' : 'light',
        placeholder: t('components.editor.placeholder'),
        content: initialContent,
        contentIsMarkdown: props.editorType === 'markdown',
        
        onChange: handleEditorChange,
        onBlur: handleEditorChange,
        
        image: {
          uploadUrl: uploadPath.value,
          uploadHeaders: props.uploadHeaders || {},
          uploader: editorUpload,
          defaultSize: 'auto' as any,
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
              headers: () => ({
                'Content-Type': 'application/json',
                'Authorization': auth.token,
              }),
              wrapPayload: (message: string) => JSON.stringify({ prompt: message }),
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
        toolbarKeys: [
          'undo', 'redo', 'brush', 'eraser', 'divider',
          'heading', 'font-family', 'font-size', 'divider',
          'bold', 'italic', 'underline', 'strike', 'link', 'code',
          'subscript', 'superscript', 'hr', 'todo', 'emoji', 'divider',
          'highlight', 'font-color', 'divider',
          'align', 'line-height', 'divider',
          'bullet-list', 'ordered-list', 'indent-decrease', 'indent-increase', 'break', 'divider',
          ...(props.fileManager
            ? [{
                id: 'dux-file-manager-image',
                tip: t('components.upload.fileManager'),
                icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.08697 9H20.9134C21.4657 9 21.9134 9.44772 21.9134 10C21.9134 10.0277 21.9122 10.0554 21.9099 10.083L21.0766 20.083C21.0334 20.6013 20.6001 21 20.08 21H3.9203C3.40021 21 2.96695 20.6013 2.92376 20.083L2.09042 10.083C2.04456 9.53267 2.45355 9.04932 3.00392 9.00345C3.03155 9.00115 3.05925 9 3.08697 9ZM4.84044 19H19.1599L19.8266 11H4.17377L4.84044 19ZM13.4144 5H20.0002C20.5525 5 21.0002 5.44772 21.0002 6V7H3.00017V4C3.00017 3.44772 3.44789 3 4.00017 3H11.4144L13.4144 5Z"></path></svg>',
                onClick: (_event: MouseEvent, ed: AiEditor) => {
                  modal
                    .show({
                      title: t('components.uploadManage.title') || t('components.upload.fileManager'),
                      width: '800px',
                      component: () => import('../upload/manager'),
                      componentProps: {
                        path: managePath.value,
                        type: props.fileManagerType || 'all',
                        multiple: true,
                        uploadParams: {
                          path: uploadPath.value,
                          accept: '*/*',
                          method: method.value,
                        },
                      },
                    })
                    .then((value: Record<string, any>[]) => {
                      value?.forEach?.(item => {
                        const kind = inferFileType(item)
                        const alt = item?.filename || ''
                        if (kind === 'image') {
                          ed.insert({
                            type: 'image',
                            attrs: {
                              src: item.url,
                              alt,
                              width: 'auto',
                            },
                          })
                        } else if (kind === 'video') {
                          ed.insert({
                            type: 'video',
                            attrs: {
                              src: item.url,
                              controls: 'true',
                              width: 350,
                            },
                          })
                        } else {
                          const filename = item?.filename || item?.name || 'file'
                          if (props.editorType === 'markdown') {
                            ed.insertMarkdown(`[${filename}](${item.url})`)
                          } else {
                            ed.insert(`<a href="${item.url}" target="_blank">${filename}</a>`)
                          }
                        }
                      })
                    })
                },
              }]
            : []),
          'image', 'video', 'attachment', 'quote', 'container',
          'code-block', 'table', 'divider',
          'printer', 'fullscreen', 'ai',
        ],
      })
    }

    const destroyEditor = () => {
      if (aiEditor) {
        aiEditor.destroy()
        aiEditor = null
      }
    }

    watch(() => props.value, updateContent)
    
    watch(() => theme.isDark.value, (isDark) => {
      if (divRef.value) {
        divRef.value.classList.toggle('aie-theme-dark', isDark)
        divRef.value.classList.toggle('aie-theme-light', !isDark)
      }
    }, { immediate: true })

    expose({
      get aiEditor() {
        return aiEditor
      },
    })

    onMounted(() => {
      nextTick(() => {
        createEditor()
      })
    })

    onUnmounted(() => {
      destroyEditor()
    })

    return () => (
      <div 
        ref={divRef} 
        style={{ 
          height: props.height, 
          width: '100%' 
        }} 
      />
    )
  },
})
