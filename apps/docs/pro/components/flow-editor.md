# FlowEditor 流程设计器

FlowEditor 是一个基于 Vue Flow 的可视化流程设计组件，支持拖拽式节点编辑、连线操作和实时配置，广泛应用于工作流设计、审批流程配置和 AI Agent 流程搭建等场景。

## 基础用法

```vue
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

<script setup>
import { DuxFlowEditor, getStartNodeRegistry, getProcessNodeRegistry, getEndNodeRegistry } from '@duxweb/dvha-pro'
import { ref, computed } from 'vue'

// 流程数据
const flowData = ref({
  nodes: [
    {
      id: '1',
      type: 'start',
      position: { x: 50, y: 150 },
      data: {
        label: '开始',
        description: '流程开始',
        icon: 'i-tabler:player-play',
      },
    }
  ],
  edges: []
})

// 自定义节点
const customNodes = computed(() => ({
  'start': getStartNodeRegistry(),
  'process': getProcessNodeRegistry(),
  'end': getEndNodeRegistry(),
}))

// 节点分类
const categories = [
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
```

## API 文档

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 流程数据，支持 v-model | `FlowData` | - |
| customNodes | 自定义节点注册表 | `Record<string, FlowNodeRegistry>` | `{}` |
| categories | 节点分类配置 | `FlowNodeCategory[]` | `[]` |
| config | 编辑器配置 | `FlowEditorConfig` | `{}` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 流程数据更新 | `(value: FlowData) => void` |
| node-click | 节点点击事件 | `(node: FlowNode) => void` |
| edge-click | 连线点击事件 | `(edge: FlowEdge) => void` |

### 类型定义

```typescript
interface FlowData {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

interface FlowNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: FlowNodeData
}

interface FlowNodeData {
  label: string
  description?: string
  icon?: string
  config?: Record<string, any>
}

interface FlowEdge {
  id: string
  source: string
  target: string
  data?: Record<string, any>
}

interface FlowNodeCategory {
  key: string
  label: string
  icon?: string
  order?: number
}

interface FlowEditorConfig {
  readonly?: boolean
  showGrid?: boolean
  showControls?: boolean
  showMinimap?: boolean
}
```

## 节点系统

### 内置节点类型

FlowEditor 提供了三种基础节点类型：

#### 开始节点 (Start Node)
- **用途**: 流程的起始点
- **特征**: 无输入连接点，有输出连接点
- **配置**: 支持定义输入字段，这些字段将传递给下游节点

#### 处理节点 (Process Node)  
- **用途**: 流程中的处理步骤
- **特征**: 有输入和输出连接点
- **配置**: 支持配置处理逻辑，定义输出字段

#### 结束节点 (End Node)
- **用途**: 流程的终点
- **特征**: 有输入连接点，无输出连接点
- **配置**: 接收上游数据，可配置结果处理

### 自定义节点

可以通过注册系统添加自定义节点：

```typescript
import { FlowNodeRegistry } from '@duxweb/dvha-pro'

const customNodeRegistry: FlowNodeRegistry = {
  component: MyCustomNode,
  settingComponent: MyCustomNodeSetting,
  meta: {
    category: 'custom',
    nodeType: 'process',
    title: '自定义节点',
    description: '这是一个自定义节点',
    icon: 'i-tabler:puzzle',
  },
  inputFields: [
    {
      name: 'input',
      type: 'text',
      label: '输入数据',
      required: true
    }
  ],
  outputFields: [
    {
      name: 'output',
      type: 'text', 
      label: '输出结果'
    }
  ]
}
```

## 数据流传递

FlowEditor 支持节点间的数据流传递，通过 `useNodeDataFlow` hook 可以获取节点间的数据关系：

```typescript
import { useNodeDataFlow } from '@duxweb/dvha-pro'

const { getUpstreamFields, getInputFieldOptions } = useNodeDataFlow()

// 获取指定节点的上游字段
const upstreamFields = getUpstreamFields(nodeId, nodeRegistries)

// 获取可用的输入字段选项（用于下拉选择）
const inputOptions = getInputFieldOptions(nodeId, nodeRegistries)
```

### 字段引用规则

- **开始节点**: 提供 `data.config.fields` 中定义的输入字段
- **处理节点**: 提供 `registry.outputFields` 中定义的输出字段
- **字段引用格式**: `nodeId.fieldName`

## 应用场景

### 审批流程设计器

```vue
<template>
  <DuxFlowEditor
    v-model="approvalFlow"
    :custom-nodes="approvalNodes"
    :categories="approvalCategories"
  />
</template>

<script setup>
// 审批流程专用节点
const approvalNodes = computed(() => ({
  'start': getStartNodeRegistry(),
  'approval': getApprovalNodeRegistry(),
  'condition': getConditionNodeRegistry(),
  'end': getEndNodeRegistry(),
}))

const approvalCategories = [
  { key: 'start', label: '开始', icon: 'i-tabler:player-play' },
  { key: 'approval', label: '审批', icon: 'i-tabler:user-check' },
  { key: 'condition', label: '条件', icon: 'i-tabler:git-branch' },
  { key: 'end', label: '结束', icon: 'i-tabler:player-stop' },
]
</script>
```

### AI Agent 流程设计器

```vue
<template>
  <DuxFlowEditor
    v-model="agentFlow"
    :custom-nodes="aiNodes"
    :categories="aiCategories"
  />
</template>

<script setup>
// AI 专用节点
const aiNodes = computed(() => ({
  'start': getStartNodeRegistry(),
  'llm': getLLMNodeRegistry(),
  'knowledge': getKnowledgeNodeRegistry(),
  'code': getCodeNodeRegistry(),
  'end': getEndNodeRegistry(),
}))

const aiCategories = [
  { key: 'start', label: '开始', icon: 'i-tabler:player-play' },
  { key: 'llm', label: 'LLM', icon: 'i-tabler:brain' },
  { key: 'knowledge', label: '知识库', icon: 'i-tabler:book' },
  { key: 'code', label: '代码', icon: 'i-tabler:code' },
  { key: 'end', label: '结束', icon: 'i-tabler:player-stop' },
]
</script>
```

## 样式定制

FlowEditor 支持通过 CSS 变量进行样式定制：

```css
.flow-editor {
  --flow-node-bg: #ffffff;
  --flow-node-border: #e5e7eb;
  --flow-node-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --flow-edge-color: #6b7280;
  --flow-edge-width: 2px;
  --flow-grid-color: #f3f4f6;
  --flow-grid-size: 20px;
}
```

## 最佳实践

### 节点设计原则

1. **单一职责**: 每个节点只负责一个明确的功能
2. **数据清晰**: 明确定义输入和输出字段的类型和结构  
3. **错误处理**: 节点应该妥善处理异常情况
4. **用户友好**: 提供清晰的标题、描述和图标

### 流程设计规范

1. **起点唯一**: 每个流程只应有一个开始节点
2. **终点明确**: 流程应有明确的结束条件
3. **避免循环**: 谨慎设计可能导致无限循环的流程
4. **数据验证**: 在关键节点进行数据有效性检查

### 性能优化

1. **节点懒加载**: 大型流程可考虑节点的懒加载
2. **数据缓存**: 合理使用缓存避免重复计算
3. **连接优化**: 避免过多的交叉连线影响视觉效果
4. **内存管理**: 及时清理不再使用的节点和连线

## 国际化支持

FlowEditor 内置了国际化支持，所有文本都通过语言包进行管理：

```typescript
// 中文语言包示例
{
  "components": {
    "flowEditor": {
      "toolbar": {
        "zoomIn": "放大",
        "zoomOut": "缩小", 
        "fitView": "适应视图",
        "reset": "重置"
      },
      "nodes": {
        "start": "开始节点",
        "process": "处理节点", 
        "end": "结束节点"
      }
    }
  }
}
```

FlowEditor 为构建复杂的可视化流程提供了强大而灵活的基础，通过合理的节点设计和数据流管理，可以满足各种业务场景的需求。