import type { NodeProps } from '@vue-flow/core'
import type { FlowNodeData, FlowNodeRegistry } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { Position } from '@vue-flow/core'
import { useVModel } from '@vueuse/core'
import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import { DuxFormItem } from '../../form'
import { FlowNodeCard } from '../components/nodeCard'

// 开始节点组件
export function StartNode(props: NodeProps<FlowNodeData>) {
  const handleClick = (_event: MouseEvent) => {
    // 开始节点点击处理
  }

  const handleDoubleClick = (_event: MouseEvent) => {
    // 开始节点双击处理
  }

  return (
    <FlowNodeCard
      nodeProps={props}
      showTargetHandle={false}
      color="success"
      handlePosition={{
        source: Position.Right,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  )
}

// 开始节点设置组件
export const StartNodeSetting = defineComponent({
  name: 'StartNodeSetting',
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

// 获取开始节点配置
export function getStartNodeRegistry(): FlowNodeRegistry {
  const { t } = useI18n()
  return {
    meta: {
      name: 'start',
      label: t('components.flowEditor.startNode.label') || '',
      description: t('components.flowEditor.startNode.description') || '',
      category: 'start',
      nodeType: 'start',
      icon: 'i-tabler:player-play',
      color: 'success',
      style: {
        iconBgClass: 'bg-emerald',
      },
    },
    component: StartNode,
    settingComponent: StartNodeSetting,
    multiInput: false,
    multiOutput: true,
  }
}
