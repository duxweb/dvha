import type { FlowNodeRegistry } from '@duxweb/dvha-pro'
import { DuxFormItem, DuxFormLayout, useNodeDataFlow, FlowNodeCard } from '@duxweb/dvha-pro'
import { defineComponent, ref, computed, markRaw } from 'vue'
import { NCard, NText, NInput, NSelect, NInputNumber, NTag } from 'naive-ui'

// 知识库选项
const knowledgeBaseOptions = [
  { label: '全部知识库', value: 'all' },
  { label: '产品知识库', value: 'product' },
  { label: '技术文档库', value: 'tech' },
  { label: 'FAQ知识库', value: 'faq' },
]

// 知识库搜索节点组件
export const KnowledgeSearchNode = defineComponent({
  name: 'KnowledgeSearchNode',
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
          type: 'knowledgeSearch'
        }}
        showTargetHandle={true}
        showSourceHandle={true}
        v-slots={{
          default: () => (
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">知识库:</span>
                <NTag size="tiny" type="warning">
                  {knowledgeBaseOptions.find(kb => kb.value === nodeData.value?.config?.knowledgeBase)?.label || '未配置'}
                </NTag>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-muted-foreground">输出:</span>
                <div class="flex flex-wrap gap-1">
                  <NTag size="tiny" type="info">documents</NTag>
                  <NTag size="tiny" type="info">total</NTag>
                </div>
              </div>
              <div class="text-xs text-muted-foreground">
                检索数量: {nodeData.value?.config?.searchCount || 5}
              </div>
            </div>
          )
        }}
      />
    )
  }
})

// 知识库搜索节点配置面板
export const KnowledgeSearchNodeConfig = defineComponent({
  name: 'KnowledgeSearchNodeConfig',
  props: ['modelValue', 'nodeId', 'nodeRegistries'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { getInputFieldOptions } = useNodeDataFlow()
    
    const nodeData = ref({
      ...props.modelValue,
      config: {
        knowledgeBase: 'all',
        searchField: '',
        searchCount: 5,
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

        <DuxFormItem label="知识库选择">
          <NSelect
            v-model:value={nodeData.value.config.knowledgeBase}
            options={knowledgeBaseOptions}
            onUpdateValue={updateData}
          />
        </DuxFormItem>

        <DuxFormItem label="检索字段">
          <NSelect
            v-model:value={nodeData.value.config.searchField}
            options={upstreamFields.value}
            placeholder="选择检索使用的字段"
            onUpdateValue={updateData}
          />
          {upstreamFields.value.length === 0 && (
            <NText depth="3" style="font-size: 12px;">
              请先连接上游节点
            </NText>
          )}
        </DuxFormItem>

        <DuxFormItem label="检索数量">
          <NInputNumber
            v-model:value={nodeData.value.config.searchCount}
            min={1}
            max={20}
            onUpdateValue={updateData}
          />
        </DuxFormItem>

        <DuxFormItem label="输出字段说明">
          <NCard size="small">
            <div class="text-sm space-y-1">
              <div><strong>documents:</strong> 匹配的文档列表</div>
              <div><strong>scores:</strong> 相关度分数数组</div>
              <div><strong>total:</strong> 总匹配数量</div>
              <div><strong>query:</strong> 检索查询内容</div>
            </div>
          </NCard>
        </DuxFormItem>
      </DuxFormLayout>
    )
  }
})

// 知识库搜索节点注册信息
export const getKnowledgeSearchNodeRegistry = (): FlowNodeRegistry => ({
  meta: {
    name: 'knowledgeSearch',
    label: '知识库搜索',
    description: '搜索知识库获取相关信息',
    category: 'process',
    nodeType: 'process',
    icon: 'i-tabler:database-search',
    style: {
      iconBgClass: 'bg-green-500'
    },
    defaultConfig: {
      outputFields: [
        { name: 'documents', type: 'array', label: '匹配文档' },
        { name: 'scores', type: 'array', label: '相关度分数' },
        { name: 'total', type: 'number', label: '总数量' },
        { name: 'query', type: 'text', label: '查询内容' },
      ],
    },
  },
  component: markRaw(KnowledgeSearchNode),
  settingComponent: markRaw(KnowledgeSearchNodeConfig),
})
