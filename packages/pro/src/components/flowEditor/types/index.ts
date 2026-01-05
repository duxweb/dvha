import type { Edge, Node, NodeProps } from '@vue-flow/core'
import type { VNode, VNodeChild } from 'vue'

// 节点数据类型
export interface FlowNodeData {
  label: string
  description?: string
  icon?: string
  color?: string
  // 表单配置数据
  config?: Record<string, any>
}

// 节点元信息
export interface FlowNodeMeta {
  name: string
  label: string
  description?: string
  category: 'start' | 'process' | 'end' | 'custom'
  // 节点类型，所有节点必须属于这三种基本类型之一
  nodeType: 'start' | 'process' | 'end'
  icon: string
  color?: string
  // 自定义样式配置
  style?: {
    // 图标背景色 class (主色)
    iconBgClass?: string
  }
  // 默认配置
  defaultConfig?: Record<string, any>
}

// 流程节点类型
export type FlowNode = Node<FlowNodeData>

// 流程边类型
export type FlowEdge = Edge

// 字段类型定义
export interface FlowNodeField {
  name: string
  type: 'text' | 'number' | 'boolean' | 'date' | 'array' | 'object'
  label?: string
  description?: string
  required?: boolean
}

export interface FlowFieldConfigItem {
  name: string
  type: string
  content: string
  description?: string
  label?: string
  required?: boolean
}

export interface FlowFieldConfigValue {
  mode: 'text' | 'json' | 'code'
  text?: string
  items: FlowFieldConfigItem[]
  code?: string
}

export interface FlowKVItem {
  name: string
  value: string
}

export interface FlowDynamicFieldPreviewContext {
  value: any
  field: FlowDynamicFieldDefinition
  data: FlowNodeData
  nodeProps: NodeProps<FlowNodeData>
}

export interface FlowDynamicFieldPreviewOptions {
  label?: string
  type?: 'text' | 'tags'
  emptyText?: string
  tagType?: 'default' | 'info' | 'success' | 'warning' | 'error'
  maxTagCount?: number
  formatter?: (context: FlowDynamicFieldPreviewContext) => VNodeChild
  render?: (context: FlowDynamicFieldPreviewContext) => VNodeChild
}

export type FlowDynamicFieldPreview = boolean | FlowDynamicFieldPreviewOptions

export interface FlowDynamicFieldRenderContext {
  value: any
  field: FlowDynamicFieldDefinition
  data: FlowNodeData
  update: (value: any) => void
}

export type FlowDynamicFieldComponent = 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'switch'
  | 'color'
  | 'json'
  | 'field-config'
  | 'kv-input'
  | 'dux-select'
  | 'note'

export interface FlowDynamicFieldDefinition {
  name: string
  label?: string
  description?: string
  placeholder?: string
  required?: boolean
  defaultValue?: any
  component?: FlowDynamicFieldComponent
  options?: Array<{ label: string, value: any }>
  rows?: number
  preview?: FlowDynamicFieldPreview
  hideInPreview?: boolean
  render?: (context: FlowDynamicFieldRenderContext) => VNodeChild
  componentProps?: Record<string, any>
}

export interface FlowDynamicPreviewRenderContext {
  nodeProps: NodeProps<FlowNodeData>
  settingFields: FlowDynamicFieldDefinition[]
}

export interface FlowDynamicNodeDefinition {
  type?: string
  label?: string
  description?: string
  category?: FlowNodeMeta['category']
  nodeType?: FlowNodeMeta['nodeType']
  icon?: string
  color?: string
  style?: FlowNodeMeta['style']
  defaultConfig?: Record<string, any>
  settingFields?: FlowDynamicFieldDefinition[]
  allowLabelEdit?: boolean
  allowDescriptionEdit?: boolean
  allowNodeIdEdit?: boolean
  renderPreview?: (context: FlowDynamicPreviewRenderContext) => VNodeChild
  settingComponent?: any
  component?: any
  multiInput?: boolean
  multiOutput?: boolean
}

// 节点注册信息
export interface FlowNodeRegistry {
  meta: FlowNodeMeta
  // 节点组件
  component: any
  // 配置组件
  settingComponent?: any
  // 是否允许多个输入
  multiInput?: boolean
  // 是否允许多个输出
  multiOutput?: boolean
}

// 流程编辑器配置
export interface FlowEditorConfig {
  // 是否只读
  readonly?: boolean
  // 是否显示网格
  showGrid?: boolean
  // 是否显示控制栏
  showControls?: boolean
  // 自定义工具栏
  toolbar?: VNode | (() => VNode)
}

// 流程数据
export interface FlowData {
  nodes: FlowNode[]
  edges: FlowEdge[]
  viewport?: {
    x: number
    y: number
    zoom: number
  }
  globalSettings?: Record<string, any>
}

// 节点分类
export interface FlowNodeCategory {
  key: string
  label: string
  icon: string
  order?: number
}
