import type { FlowNodeRegistry } from '@duxweb/dvha-pro'
import { DuxFormItem, DuxFormLayout, FlowNodeCard } from '@duxweb/dvha-pro'
import { defineComponent, ref, computed, markRaw } from 'vue'
import { NDynamicInput, NSelect, NInput, NSwitch, NTag } from 'naive-ui'

// 字段类型选项
const fieldTypes = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: '日期', value: 'date' },
]

// AI开始节点组件
export const AiStartNode = defineComponent({
  name: 'AiStartNode',
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
          type: 'aiStart'
        }}
        showTargetHandle={false}
        showSourceHandle={true}
        v-slots={{
          default: () => (
            <div class="space-y-2">
              <div class="text-xs text-muted-foreground">输出字段:</div>
              <div class="flex flex-wrap gap-1">
                {nodeData.value?.config?.fields?.length ? 
                  nodeData.value.config.fields.map((field, index) => (
                    <NTag key={index} size="tiny" type="info">
                      {field.name}
                    </NTag>
                  )) : 
                  <NTag size="tiny" type="default">未配置</NTag>
                }
              </div>
            </div>
          )
        }}
      />
    )
  }
})

// AI开始节点配置面板
export const AiStartNodeConfig = defineComponent({
  name: 'AiStartNodeConfig',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const nodeData = ref({
      ...props.modelValue,
      config: {
        fields: [{ name: 'input', type: 'text', required: true, label: '用户输入' }],
        ...props.modelValue?.config
      }
    })

    const updateData = () => {
      emit('update:modelValue', nodeData.value)
    }

    const addField = () => {
      nodeData.value.fields.push({
        name: `field_${Date.now()}`,
        type: 'text', 
        required: false,
        label: '新字段'
      })
      updateData()
    }

    const removeField = (index: number) => {
      nodeData.value.fields.splice(index, 1)
      updateData()
    }

    return () => (
      <DuxFormLayout labelPlacement='top' class="space-y-4">
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

        <DuxFormItem label="输入字段配置">
          <NDynamicInput
            v-model:value={nodeData.value.config.fields}
            onUpdateValue={updateData}
            preset="pair"
            keyPlaceholder="字段名"
            valuePlaceholder="显示标签"
            onCreate={() => ({ name: '', label: '', type: 'text', required: false })}
            v-slots={{
              default: ({ value, index }) => (
                <div class="space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <NInput
                      v-model:value={value.name}
                      placeholder="字段名"
                      onUpdateValue={updateData}
                    />
                    <NInput
                      v-model:value={value.label}
                      placeholder="显示标签"
                      onUpdateValue={updateData}
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <NSelect
                      v-model:value={value.type}
                      options={fieldTypes}
                      placeholder="字段类型"
                      onUpdateValue={updateData}
                    />
                    <div class="flex items-center gap-2">
                      <span class="text-sm">必填:</span>
                      <NSwitch
                        v-model:value={value.required}
                        onUpdateValue={updateData}
                      />
                    </div>
                  </div>
                </div>
              )
            }}
          />
        </DuxFormItem>
      </DuxFormLayout>
    )
  }
})

// AI开始节点注册信息
export const getAiStartNodeRegistry = (): FlowNodeRegistry => ({
  meta: {
    name: 'aiStart',
    label: 'AI开始',
    description: '配置AI流程的输入字段',
    category: 'start',
    nodeType: 'start',
    icon: 'i-tabler:play',
    style: {
      iconBgClass: 'bg-blue-500'
    }
  },
  component: markRaw(AiStartNode),
  settingComponent: markRaw(AiStartNodeConfig),
  // 开始节点不需要定义outputFields，因为它的输出字段是动态的（基于config.fields）
  // 但我们可以提供inputFields来标识这是一个输入节点
  inputFields: []
})