import type { Edge, Node } from '@vue-flow/core'
import type { VNode } from 'vue'

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
  // 输出字段定义
  outputFields?: FlowNodeField[]
  // 输入字段定义
  inputFields?: FlowNodeField[]
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
