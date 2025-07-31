import type { NodeProps } from '@vue-flow/core'
import type { FlowNodeData, FlowNodeRegistry } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { Position } from '@vue-flow/core'
import { useVModel } from '@vueuse/core'
import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import { DuxFormItem } from '../../form'
import { FlowNodeCard } from '../components/nodeCard'

// 结束节点组件
export function EndNode(props: NodeProps<FlowNodeData>) {
  const handleClick = (_event: MouseEvent) => {
    // 结束节点点击处理
  }

  const handleDoubleClick = (_event: MouseEvent) => {
    // 结束节点双击处理
  }

  return (
    <FlowNodeCard
      nodeProps={props}
      showSourceHandle={false}
      color="danger"
      handlePosition={{
        target: Position.Left,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  )
}

// 结束节点设置组件
export const EndNodeSetting = defineComponent({
  name: 'EndNodeSetting',
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

// 获取结束节点配置
export function getEndNodeRegistry(): FlowNodeRegistry {
  const { t } = useI18n()
  return {
    meta: {
      name: 'end',
      label: t('components.flowEditor.nodes.end.label') || '',
      description: t('components.flowEditor.nodes.end.description') || '',
      category: 'end',
      nodeType: 'end',
      icon: 'i-tabler:player-stop',
      color: 'danger',
      style: {
        iconBgClass: 'bg-red',
      },
    },
    component: EndNode,
    settingComponent: EndNodeSetting,
    multiInput: true,
    multiOutput: false,
  }
}
