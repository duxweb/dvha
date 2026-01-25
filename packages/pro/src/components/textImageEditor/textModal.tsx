import type { PropType } from 'vue'
import { NButton } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'
import { DuxAiEditor } from '../editor'
import { DuxModalPage } from '../modal'

export default defineComponent({
  name: 'DuxTextImageEditorTextModal',
  props: {
    title: {
      type: String,
      default: '',
    },
    handle: String,
    value: {
      type: String,
      default: '',
    },
    editorType: {
      type: String as PropType<'richtext' | 'markdown'>,
      default: 'richtext',
    },
    aiPath: String,
    uploadPath: String,
    uploadHeaders: Object as PropType<Record<string, any>>,
    fileManager: {
      type: Boolean,
      default: true,
    },
    fileManagerType: {
      type: String,
      default: 'all',
    },
    height: {
      type: String,
      default: '500px',
    },
    onConfirm: Function as PropType<(value: string) => void>,
    onClose: Function as PropType<() => void>,
  },
  setup(props) {
    const content = ref(props.value || '')

    watch(() => props.value, (v) => {
      content.value = v || ''
    })

    return () => (
      <DuxModalPage title={props.title} handle={props.handle} onClose={props.onClose}>
        {{
          default: () => (
            <DuxAiEditor
              v-model:value={content.value}
              editorType={props.editorType}
              aiPath={props.aiPath}
              uploadPath={props.uploadPath}
              uploadHeaders={props.uploadHeaders}
              fileManager={props.fileManager}
              fileManagerType={props.fileManagerType as any}
              height={props.height}
            />
          ),
          footer: () => (
            <>
              <NButton onClick={props.onClose}>取消</NButton>
              <NButton
                type="primary"
                onClick={() => {
                  props.onConfirm?.(content.value || '')
                }}
              >
                保存
              </NButton>
            </>
          ),
        }}
      </DuxModalPage>
    )
  },
})
