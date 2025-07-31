import type { FlowNodeRegistry } from '../types'
import {
  EndNode,
  EndNodeSetting,
  getEndNodeRegistry,
} from './endNode'
import {
  getProcessNodeRegistry,
  ProcessNode,
  ProcessNodeSetting,
} from './processNode'
import {
  getStartNodeRegistry,
  StartNode,
  StartNodeSetting,
} from './startNode'

// 默认节点注册表 - 空对象，外部自行注册节点
export const defaultNodes: Record<string, FlowNodeRegistry> = {}

// 导出所有节点组件
export {
  EndNode,
  ProcessNode,
  StartNode,
}

// 导出所有设置组件
export {
  EndNodeSetting,
  ProcessNodeSetting,
  StartNodeSetting,
}

// 导出配置函数
export {
  getEndNodeRegistry,
  getProcessNodeRegistry,
  getStartNodeRegistry,
}
