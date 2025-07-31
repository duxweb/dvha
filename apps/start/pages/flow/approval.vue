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
import { DuxFlowEditor, getStartNodeRegistry, getProcessNodeRegistry, getEndNodeRegistry } from '@duxweb/dvha-pro'
import { computed, ref } from 'vue'

// 审批流程数据
const flowData = ref<FlowData>({
  nodes: [
    {
      id: '1',
      type: 'start',
      position: { x: 50, y: 150 },
      data: {
        label: '提交申请',
        description: '用户提交审批申请',
        icon: 'i-tabler:player-play',
      },
    },
    {
      id: '2',
      type: 'process',
      position: { x: 350, y: 150 },
      data: {
        label: '部门审批',
        description: '部门主管审批',
        icon: 'i-tabler:user-check',
      },
    },
    {
      id: '3',
      type: 'process',
      position: { x: 650, y: 150 },
      data: {
        label: '财务审批',
        description: '财务部门审批',
        icon: 'i-tabler:coin',
      },
    },
    {
      id: '4',
      type: 'end',
      position: { x: 950, y: 150 },
      data: {
        label: '审批完成',
        description: '审批流程结束',
        icon: 'i-tabler:player-stop',
      },
    },
    {
      id: '5',
      type: 'end',
      position: { x: 500, y: 350 },
      data: {
        label: '审批拒绝',
        description: '申请被拒绝',
        icon: 'i-tabler:x',
      },
    },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', data: { type: 'success' } },
    { id: 'e2-3', source: '2', target: '3', data: { type: 'success' } },
    { id: 'e3-4', source: '3', target: '4', data: { type: 'success' } },
    { id: 'e2-5', source: '2', target: '5', data: { type: 'error' } },
    { id: 'e3-5', source: '3', target: '5', data: { type: 'error' } },
  ],
})

// 自定义节点
const customNodes = computed(() => ({
  'start': getStartNodeRegistry(),
  'process': getProcessNodeRegistry(),
  'end': getEndNodeRegistry(),
}))

// 节点分类
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