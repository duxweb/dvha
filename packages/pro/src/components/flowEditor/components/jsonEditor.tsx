import { NButton, useMessage } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { DuxCodeEditor } from '../../code'
import { DuxModalPage } from '../../modal'

export interface JsonEditorProps {
  data: any
  onConfirm?: (data: any) => void
}

const FlowJsonEditor = defineComponent({
  name: 'FlowJsonEditor',
  props: {
    data: {
      type: Object,
      required: true,
    },
    onConfirm: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const message = useMessage()
    const { t } = useI18n()
    const jsonText = ref(JSON.stringify(props.data, null, 2))

    const handleCopy = () => {
      navigator.clipboard.writeText(jsonText.value)
      message.success(t('components.flowEditor.jsonEditor.copiedToClipboard') || '')
    }

    const handleApply = () => {
      try {
        const data = JSON.parse(jsonText.value)
        if (props.onConfirm) {
          props.onConfirm(data)
        }
        message.success(t('components.flowEditor.jsonEditor.dataApplied') || '')
        emit('close')
      }
      catch (error) {
        message.error(t('components.flowEditor.jsonEditor.jsonFormatError') || '')
      }
    }

    return () => (
      <DuxModalPage>
        {{
          default: () => <div>
            <DuxCodeEditor v-model:value={jsonText.value} />
          </div>,
          footer: () => <>
            <NButton onClick={handleCopy}>
              复制数据
            </NButton>
            <NButton onClick={handleApply} type="primary">
              应用数据
            </NButton>
          </>
        }}
      </DuxModalPage>
    )
  },
})

export default FlowJsonEditor
