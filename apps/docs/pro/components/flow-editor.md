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
}
```

## 数据流传递

FlowEditor 支持节点间的数据流传递，通过 `useNodeDataFlow` hook 可以获取节点间的数据关系：

## 配置式节点（推荐）

为避免为每个节点手动创建 Vue 组件，FlowEditor 提供 `createDynamicFlowNodes` 与 `FlowFieldConfig` 等辅助工具，支持通过 JSON/对象配置出整套节点、面板和预览。

### 快速开始

```ts
import {
  DuxFlowEditor,
  createDynamicFlowNodes,
  type FlowFieldConfigValue,
} from '@duxweb/dvha-pro'

const aiNodes = createDynamicFlowNodes([
  {
    type: 'aiTask',
    label: 'AI 节点',
    icon: 'i-tabler:brain',
    color: 'primary',
    category: 'ai',
    nodeType: 'process',
    defaultConfig: {
      temperature: 0.7,
      content: {
        mode: 'text',
        text: '请根据以下信息回答：{{input.question}}',
      } as FlowFieldConfigValue,
      outputFields: [
        { name: 'content', label: '回复内容', type: 'text' },
        { name: 'usage', label: 'Token 统计', type: 'object' },
      ],
    },
    settingFields: [
      { name: 'provider', label: '供应商', component: 'select', options: providerOptions },
      { name: 'model', label: '模型', component: 'text' },
      {
        name: 'content',
        label: '输入内容配置',
        component: 'field-config',
        componentProps: {
          textPlaceholder: '支持 {{input.xxx}} / {{节点ID.outputKey}}',
        },
        preview: {
          type: 'text',
          formatter: ({ value }) => value?.text || '-',
        },
      },
      {
        name: 'headers',
        label: '自定义 Header',
        component: 'kv-input',
        preview: { type: 'tags', label: 'Headers' },
      },
    ],
  },
])
```

然后将 `aiNodes` 传入 `DuxFlowEditor` 的 `custom-nodes` 即可。每条 `settingFields` 描述会自动渲染配置面板表单，同时在节点卡片上生成预览（可通过 `preview` 或 `renderPreview` 自定义）。

> 提示：如果需要给下游节点提供可引用的字段，可在 `defaultConfig.outputFields` 中声明，流程运行时会同步到 `node.data.config.outputFields`，`useNodeDataFlow` 会自动识别这些字段。

### 动态字段 API

| 属性 | 说明 |
|------|------|
| `type` | 节点类型（唯一），等同于 Vue Flow Node type |
| `label` | 节点标题 |
| `color` | 可使用 `primary/success/...` 控制节点主色 |
| `settingFields` | 设置表单字段，支持 `component` (`text/textarea/select/number/switch/color/json/field-config/kv-input/dux-select/note`) 或 `render` 自定义，额外属性可通过 `componentProps` 传递 |
| `allowLabelEdit` / `allowDescriptionEdit` | 控制是否在面板中允许修改节点名称/描述 |
| `allowNodeIdEdit` | 是否允许在侧边设置里直接修改节点 ID（会同步更新相关连线） |
| `renderPreview` | 完全自定义节点卡片内容 |

> 内置 `component` 字符串包括 `field-config`（多模态输入配置）、`kv-input`（键值对输入）、`dux-select`（基于 `DuxSelect` 的远程下拉，支持 `path`、`params` 等 props）、`note`（说明块）。当然也可以通过 `render` 注入自定义表单。

> 动态节点默认允许在设置面板里修改“节点 ID”，以便生成可读的引用 key；如需禁用，可在定义里设置 `allowNodeIdEdit: false`。

### 表单辅助组件

| 组件 | 说明 |
|------|------|
| `FlowFieldConfig` | 多模态内容编辑器，支持文本/JSON/代码模式切换，提供图中所示的字段列表交互 |
| `FlowKVInput` | 键值对输入，基于 `NDynamicInput` 实现 |
| `FlowNote` | 说明块 |

> `FlowFieldConfig` 在不同模式下会写入不同字段：`text`（纯文本）与 `items`（JSON 列表）为结构化数据，`code` 则只是原始 JSON 字符串，不会与 `items` 互相转换，如需解析请在业务侧自行处理。

上述组件都支持 `v-model`，可直接在 `settingFields` 的 `render` 或自定义节点设置里引用。

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
- **其它节点**: 提供 `data.config.outputFields`（或 `defaultConfig.outputFields`）里声明的字段
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
