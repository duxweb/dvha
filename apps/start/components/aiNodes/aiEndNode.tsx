import type { FlowNodeRegistry } from '@duxweb/dvha-pro'
import { DuxFormItem, DuxFormLayout, useNodeDataFlow, FlowNodeCard } from '@duxweb/dvha-pro'
import { defineComponent, ref, computed, markRaw } from 'vue'
import { NText, NCard, NInput, NSelect, NTag } from 'naive-ui'

// AI结束节点组件
export const AiEndNode = defineComponent({
  name: 'AiEndNode',
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
          type: 'aiEnd'
        }}
        showTargetHandle={true}
        showSourceHandle={false}
        v-slots={{
          default: () => (
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">输出字段:</span>
                <NTag size="tiny" type="error">
                  {nodeData.value?.config?.outputField?.split('.')[1] || '未选择'}
                </NTag>
              </div>
              <div class="text-xs text-muted-foreground">
                <div>模板: {nodeData.value?.config?.outputTemplate ? '已配置' : '未配置'}</div>
              </div>
            </div>
          )
        }}
      />
    )
  }
})

// AI结束节点配置面板
export const AiEndNodeConfig = defineComponent({
  name: 'AiEndNodeConfig',
  props: ['modelValue', 'nodeId', 'nodeRegistries'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { getInputFieldOptions } = useNodeDataFlow()
    
    const nodeData = ref({
      ...props.modelValue,
      config: {
        outputField: '',
        outputTemplate: '处理结果: {{response}}',
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

    // 获取可用的变量（用于模板）
    const getAvailableVariables = () => {
      return upstreamFields.value.map(field => {
        const fieldName = field.value.split('.')[1]
        return {
          name: fieldName,
          syntax: `{{${fieldName}}}`,
          description: field.label
        }
      })
    }

    const availableVariables = computed(() => getAvailableVariables())

    // 插入变量到模板
    const insertVariable = (varName: string) => {
      const template = nodeData.value.config.outputTemplate || ''
      const cursorPos = template.length
      const newTemplate = template.slice(0, cursorPos) + `{{${varName}}}` + template.slice(cursorPos)
      nodeData.value.config.outputTemplate = newTemplate
      updateData()
    }

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

        <DuxFormItem label="主要输出字段">
          <NSelect
            v-model:value={nodeData.value.config.outputField}
            options={upstreamFields.value}
            placeholder="选择主要输出字段"
            onUpdateValue={updateData}
          />
          {upstreamFields.value.length === 0 && (
            <NText depth="3" style="font-size: 12px;">
              请先连接上游节点
            </NText>
          )}
        </DuxFormItem>

        <DuxFormItem label="输出模板">
          <NInput
            v-model:value={nodeData.value.config.outputTemplate}
            type="textarea"
            placeholder="请输入输出模板，使用 {{变量名}} 格式引用字段"
            rows={4}
            onUpdateValue={updateData}
          />
        </DuxFormItem>

        {availableVariables.value.length > 0 && (
          <DuxFormItem label="可用变量">
            <NCard size="small">
              <div class="space-y-2">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  点击变量名插入到模板中：
                </div>
                <div class="flex flex-wrap gap-2">
                  {availableVariables.value.map((variable, index) => (
                    <span
                      key={index}
                      class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                      onClick={() => insertVariable(variable.name)}
                    >
                      {variable.syntax}
                    </span>
                  ))}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <div><strong>示例模板：</strong></div>
                  <div>用户问题：{'{{'} input {'}}'}  </div>
                  <div>AI回复：{'{{'} response {'}}'}  </div>
                  <div>处理时间：{'{{'} timestamp {'}}'}  </div>
                </div>
              </div>
            </NCard>
          </DuxFormItem>
        )}
      </DuxFormLayout>
    )
  }
})

// AI结束节点注册信息
export const getAiEndNodeRegistry = (): FlowNodeRegistry => ({
  meta: {
    name: 'aiEnd',
    label: 'AI结束',
    description: '输出AI处理的最终结果',
    category: 'end',
    nodeType: 'end',
    icon: 'i-tabler:flag-3',
    style: {
      iconBgClass: 'bg-red-500'
    }
  },
  component: markRaw(AiEndNode),
  settingComponent: markRaw(AiEndNodeConfig)
})