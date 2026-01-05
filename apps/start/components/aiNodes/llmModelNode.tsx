import type { FlowNodeRegistry } from '@duxweb/dvha-pro'
import { DuxFormItem, DuxFormLayout, useNodeDataFlow, FlowNodeCard } from '@duxweb/dvha-pro'
import { defineComponent, ref, computed, markRaw } from 'vue'
import { NDynamicInput, NText, NSelect, NInput, NTag } from 'naive-ui'

// LLM模型选项
const llmModelOptions = [
  { label: 'GPT-4', value: 'gpt-4' },
  { label: 'GPT-3.5-turbo', value: 'gpt-3.5-turbo' },
  { label: 'Claude-3', value: 'claude-3' },
  { label: '通义千问', value: 'qwen' },
  { label: '文心一言', value: 'ernie' },
]

// LLM模型节点组件
export const LlmModelNode = defineComponent({
  name: 'LlmModelNode',
  props: ['data', 'id', 'selected'],
  setup(props) {
    // 创建响应式的数据引用，确保组件能正确响应数据变化
    const nodeData = computed(() => props.data)
    
    return () => (
      <FlowNodeCard
        nodeProps={{
          data: props.data,
          id: props.id,
          selected: props.selected,
          type: 'llmModel'
        }}
        showTargetHandle={true}
        showSourceHandle={true}
        v-slots={{
          default: () => (
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">模型:</span>
                <NTag size="tiny" type="success">
                  {llmModelOptions.find(m => m.value === nodeData.value?.config?.model)?.label || '未配置'}
                </NTag>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">输入:</span>
                <div class="flex flex-wrap gap-1">
                  {nodeData.value?.config?.inputMapping?.length ? 
                    nodeData.value.config.inputMapping.map((mapping, index) => (
                      <NTag key={index} size="tiny" type="info">
                        {mapping.name}
                      </NTag>
                    )) : 
                    <NTag size="tiny" type="default">未配置</NTag>
                  }
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">输出:</span>
                <NTag size="tiny" type="info">response</NTag>
              </div>
            </div>
          )
        }}
      />
    )
  }
})

// LLM模型节点配置面板
export const LlmModelNodeConfig = defineComponent({
  name: 'LlmModelNodeConfig',
  props: ['modelValue', 'nodeId', 'nodeRegistries'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { getInputFieldOptions } = useNodeDataFlow()
    
    const nodeData = ref({
      ...props.modelValue,
      config: {
        model: 'gpt-4',
        inputMapping: [],
        systemPrompt: '你是一个有用的AI助手。',
        ...props.modelValue?.config
      }
    })

    const updateData = () => {
      emit('update:modelValue', nodeData.value)
    }

    // 获取上游字段选项
    const upstreamFields = computed(() => {
      if (!props.nodeId || !props.nodeRegistries) return []
      return getInputFieldOptions(props.nodeId, props.nodeRegistries)
    })


    return () => (
      <DuxFormLayout labelPlacement='top'>
        <DuxFormItem label="标签">
          <NInput
            v-model:value={nodeData.value.label}
            onUpdateValue={updateData}
          />
        </DuxFormItem>
        
        <DuxFormItem label="描述">
          <NInput
            v-model:value={nodeData.value.description}
            placeholder="请输入节点描述"
            onUpdateValue={updateData}
          />
        </DuxFormItem>

        <DuxFormItem label="LLM模型">
          <NSelect
            v-model:value={nodeData.value.config.model}
            options={llmModelOptions}
            onUpdateValue={updateData}
          />
        </DuxFormItem>

        <DuxFormItem label="系统提示词">
          <NInput
            v-model:value={nodeData.value.config.systemPrompt}
            type="textarea"
            placeholder="请输入系统提示词"
            onUpdateValue={updateData}
          />
        </DuxFormItem>

        <DuxFormItem label="输入字段映射">
          <NDynamicInput
            v-model:value={nodeData.value.config.inputMapping}
            onUpdateValue={updateData}
            onCreate={() => ({ name: '', sourceField: '', description: '' })}
            v-slots={{
              default: ({ value }) => (
                <div class="space-y-2">
                  <NInput
                    v-model:value={value.name}
                    placeholder="字段名称，如: user_query, context"
                    onUpdateValue={updateData}
                  />
                  <NSelect
                    v-model:value={value.sourceField}
                    options={upstreamFields.value}
                    placeholder="选择上游节点的输出字段"
                    filterable
                    onUpdateValue={updateData}
                  />
                  <NInput
                    v-model:value={value.description}
                    placeholder="字段描述"
                    onUpdateValue={updateData}
                  />
                </div>
              )
            }}
          />
          
          {upstreamFields.value.length === 0 && (
            <NText depth="3" style="font-size: 12px;">
              请先连接上游节点以选择输入字段
            </NText>
          )}
        </DuxFormItem>
      </DuxFormLayout>
    )
  }
})

// LLM模型节点注册信息
export const getLlmModelNodeRegistry = (): FlowNodeRegistry => ({
  meta: {
    name: 'llmModel',
    label: 'LLM模型',
    description: '使用大语言模型处理输入',
    category: 'process',
    nodeType: 'process',
    icon: 'i-tabler:brain',
    style: {
      iconBgClass: 'bg-purple-500'
    },
    defaultConfig: {
      outputFields: [
        { name: 'response', type: 'text', label: 'AI回复内容' },
        { name: 'tokens', type: 'number', label: '消耗Token数' },
        { name: 'model', type: 'text', label: '使用的模型' },
        { name: 'timestamp', type: 'date', label: '处理时间' }
      ]
    }
  },
  component: markRaw(LlmModelNode),
  settingComponent: markRaw(LlmModelNodeConfig),
})
