<template>
  <div class="h-full">
    <DuxFlowEditor
      v-model="flowData"
      :custom-nodes="customNodes"
      :categories="categories"
      :config="editorConfig"
    />
  </div>
</template>

<script setup lang="ts">
import type { FlowData, FlowNodeCategory } from '@duxweb/dvha-pro'
import { DuxFlowEditor } from '@duxweb/dvha-pro'
import { computed, ref } from 'vue'
import { 
  getAiStartNodeRegistry, 
  getKnowledgeSearchNodeRegistry, 
  getLlmModelNodeRegistry, 
  getAiEndNodeRegistry 
} from '../../components/aiNodes'

// AI Agent 流程数据
const flowData = ref<FlowData>({
  nodes: [
    {
      id: '1',
      type: 'aiStart',
      position: { x: 100, y: 150 },
      data: {
        label: '用户输入',
        description: '接收用户问题',
        icon: 'i-tabler:play',
        config: {
          fields: [
            { name: 'question', type: 'text', required: true, label: '用户问题' },
            { name: 'context', type: 'text', required: false, label: '上下文' }
          ]
        }
      },
    },
    {
      id: '2',
      type: 'knowledgeSearch',
      position: { x: 450, y: 150 },
      data: {
        label: '知识检索',
        description: '搜索相关知识',
        icon: 'i-tabler:database-search',
        config: {
          knowledgeBase: 'all',
          searchField: '1.question',
          searchCount: 5
        }
      },
    },
    {
      id: '3',
      type: 'llmModel',
      position: { x: 800, y: 150 },
      data: {
        label: 'AI分析',
        description: 'LLM处理和生成回复',
        icon: 'i-tabler:brain',
        config: {
          model: 'gpt-4',
          systemPrompt: '你是一个专业的AI助手，请根据用户问题和检索到的知识库内容，提供准确和有帮助的回答。',
          inputMapping: [
            { name: 'user_query', sourceField: '1.question', description: '用户的问题' },
            { name: 'knowledge_context', sourceField: '2.documents', description: '检索到的相关文档' }
          ]
        }
      },
    },
    {
      id: '4',
      type: 'aiEnd',
      position: { x: 1150, y: 150 },
      data: {
        label: '输出结果',
        description: '格式化输出',
        icon: 'i-tabler:flag-3',
        config: {
          outputField: '3.response',
          outputTemplate: '基于知识库检索，AI回复如下：\n\n{{response}}\n\n参考文档数量：{{total}}'
        }
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', data: { type: 'success' } },
    { id: 'e2-3', source: '2', target: '3', data: { type: 'success' } },
    { id: 'e3-4', source: '3', target: '4', data: { type: 'success' } },
  ],
})

// 自定义AI节点
const customNodes = computed(() => ({
  'aiStart': getAiStartNodeRegistry(),
  'knowledgeSearch': getKnowledgeSearchNodeRegistry(),
  'llmModel': getLlmModelNodeRegistry(),
  'aiEnd': getAiEndNodeRegistry(),
}))

// AI节点分类
const categories: FlowNodeCategory[] = [
  {
    key: 'start',
    label: '开始',
    icon: 'i-tabler:player-play',
    order: 1,
  },
  {
    key: 'process',
    label: '处理',
    icon: 'i-tabler:box',
    order: 2,
  },
  {
    key: 'end',
    label: '结束',
    icon: 'i-tabler:player-stop',
    order: 3,
  },
]

// 编辑器配置
const editorConfig = {
  readonly: false,
  showGrid: true,
  showControls: true,
}
</script>