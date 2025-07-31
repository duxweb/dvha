import type { NodeProps } from '@vue-flow/core'
import type { FlowNodeData, FlowNodeRegistry } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { Position } from '@vue-flow/core'
import { useVModel } from '@vueuse/core'
import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import { DuxFormItem } from '../../form'
import { FlowNodeCard } from '../components/nodeCard'

// 基础处理节点组件
export const ProcessNode = (props: NodeProps<FlowNodeData>) => {
  const handleClick = (_event: MouseEvent) => {
    // 处理节点点击处理
  }

  const handleDoubleClick = (_event: MouseEvent) => {
    // 处理节点双击处理
  }

  return (
    <FlowNodeCard
      nodeProps={props}
      handlePosition={{
        source: Position.Right,
        target: Position.Left,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  )
}

// 处理节点设置组件
export const ProcessNodeSetting = defineComponent({
  name: 'ProcessNodeSetting',
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const data = useVModel(props, 'modelValue', emit)

    return () => (
      <div class="space-y-4">
        <DuxFormItem label={t('components.flowEditor.label') || ''}>
          <NInput v-model:value={data.value.label} />
        </DuxFormItem>
        <DuxFormItem label={t('components.flowEditor.description') || ''}>
          <NInput
            v-model:value={data.value.description}
            type="textarea"
            rows={3}
            placeholder={t('components.flowEditor.descriptionPlaceholder') || ''}
          />
        </DuxFormItem>
      </div>
    )
  },
})

// 获取基础处理节点配置
export function getProcessNodeRegistry(): FlowNodeRegistry {
  const { t } = useI18n()
  return {
    meta: {
      name: 'process',
      label: t('components.flowEditor.processNode.label') || '',
      description: t('components.flowEditor.processNode.description') || '',
      category: 'process',
      nodeType: 'process',
      icon: 'i-tabler:box',
      color: 'primary',
      style: {
        iconBgClass: 'bg-blue',
      },
    },
    component: ProcessNode,
    settingComponent: ProcessNodeSetting,
    multiInput: true,
    multiOutput: true,
  }
}
