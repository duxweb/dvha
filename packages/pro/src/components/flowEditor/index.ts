// 组件
export { FlowFieldConfig, FlowKVInput, FlowNote, FlowNodeCard, FlowSetting, FlowToolbar } from './components'

// 主组件
export { DuxFlowEditor } from './flowEditor'

// 节点组件和配置
export {
  createDynamicFlowNode,
  createDynamicFlowNodes,
  defaultNodes,
  EndNode,
  EndNodeSetting,
  getEndNodeRegistry,
  getProcessNodeRegistry,
  getStartNodeRegistry,
  ProcessNode,
  ProcessNodeSetting,
  StartNode,
  StartNodeSetting,
} from './nodes'

// 类型定义
export type {
  FlowData,
  FlowDynamicFieldDefinition,
  FlowDynamicFieldPreview,
  FlowDynamicFieldPreviewContext,
  FlowDynamicFieldRenderContext,
  FlowDynamicNodeDefinition,
  FlowDynamicPreviewRenderContext,
  FlowEdge,
  FlowEditorConfig,
  FlowFieldConfigItem,
  FlowFieldConfigValue,
  FlowKVItem,
  FlowNode,
  FlowNodeCategory,
  FlowNodeData,
  FlowNodeField,
  FlowNodeMeta,
  FlowNodeRegistry,
} from './types'

// 工具函数
export { FIELD_TYPE_OPTIONS, getFieldTypeOptions, useNodeDataFlow } from './utils/nodeDataUtils'
