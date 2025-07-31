// 组件
export { FlowNodeCard, FlowSetting, FlowToolbar } from './components'

// 主组件
export { DuxFlowEditor } from './flowEditor'

// 节点组件和配置
export {
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


// 工具函数
export { useNodeDataFlow, FIELD_TYPE_OPTIONS, getFieldTypeOptions } from './utils/nodeDataUtils'

// 类型定义
export type {
  FlowData,
  FlowEdge,
  FlowEditorConfig,
  FlowNode,
  FlowNodeCategory,
  FlowNodeData,
  FlowNodeField,
  FlowNodeMeta,
  FlowNodeRegistry,
} from './types'
