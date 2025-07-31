import type { FlowNodeRegistry, FlowNodeField } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { useVueFlow } from '@vue-flow/core'

// 获取节点间数据传递的工具函数
export const useNodeDataFlow = () => {
  const { findNode, getEdges } = useVueFlow()

  /**
   * 获取指定节点的上游节点输出字段
   * @param nodeId 节点ID
   * @param nodeRegistries 节点注册信息
   * @returns 上游节点的输出字段列表
   */
  const getUpstreamFields = (nodeId: string, nodeRegistries: Record<string, FlowNodeRegistry>) => {
    // 直接使用getEdges获取所有边，然后过滤出目标为当前节点的边
    const allEdges = getEdges.value
    const incomingEdges = allEdges.filter(edge => edge.target === nodeId)
    
    
    const fields: Array<{
      label: string
      value: string
      type: string
      nodeId: string
      nodeName: string
    }> = []

    for (const edge of incomingEdges) {
      const sourceNode = findNode(edge.source)
      if (!sourceNode) continue

      const registry = nodeRegistries[sourceNode.type!]
      if (!registry) continue

      // 根据节点类型决定提供哪些字段
      const nodeType = registry.meta.nodeType || registry.meta.category

      if (nodeType === 'start') {
        // 开始节点：提供输入字段（data.config.fields）
        if (sourceNode.data?.config?.fields && Array.isArray(sourceNode.data.config.fields)) {
          fields.push(...sourceNode.data.config.fields.map((field: any) => ({
            label: `${sourceNode.data.label}: ${field.label || field.name}`,
            value: `${edge.source}.${field.name}`,
            type: field.type || 'text',
            nodeId: edge.source,
            nodeName: sourceNode.data.label || sourceNode.type!
          })))
        }
      } else {
        // 过程节点：提供输出字段（registry.outputFields）
        if (registry.outputFields) {
          fields.push(...registry.outputFields.map(field => ({
            label: `${sourceNode.data.label}: ${field.label || field.name}`,
            value: `${edge.source}.${field.name}`,
            type: field.type,
            nodeId: edge.source,
            nodeName: sourceNode.data.label || sourceNode.type!
          })))
        }
      }
    }

    return fields
  }

  /**
   * 获取指定节点的输出字段
   * @param nodeId 节点ID
   * @param nodeRegistries 节点注册信息
   * @returns 节点的输出字段列表
   */
  const getNodeOutputFields = (nodeId: string, nodeRegistries: Record<string, FlowNodeRegistry>) => {
    const node = findNode(nodeId)
    if (!node) return []

    const registry = nodeRegistries[node.type!]
    if (!registry) return []

    const fields: FlowNodeField[] = []

    // 处理动态字段
    if (node.data?.config?.fields && Array.isArray(node.data.config.fields)) {
      fields.push(...node.data.config.fields.map((field: any) => ({
        name: field.name,
        type: field.type || 'text',
        label: field.label || field.name,
        description: field.description,
        required: field.required
      })))
    }

    // 处理固定输出字段
    if (registry.outputFields) {
      fields.push(...registry.outputFields)
    }

    return fields
  }

  /**
   * 解析字段引用（如 "nodeId.fieldName"）
   * @param fieldRef 字段引用
   * @returns 解析结果
   */
  const parseFieldReference = (fieldRef: string) => {
    const parts = fieldRef.split('.')
    if (parts.length !== 2) {
      return null
    }
    
    return {
      nodeId: parts[0],
      fieldName: parts[1]
    }
  }

  /**
   * 验证字段引用是否有效
   * @param fieldRef 字段引用
   * @param nodeRegistries 节点注册信息
   * @returns 是否有效
   */
  const validateFieldReference = (fieldRef: string, nodeRegistries: Record<string, FlowNodeRegistry>) => {
    const parsed = parseFieldReference(fieldRef)
    if (!parsed) return false

    const node = findNode(parsed.nodeId)
    if (!node) return false

    const outputFields = getNodeOutputFields(parsed.nodeId, nodeRegistries)
    return outputFields.some(field => field.name === parsed.fieldName)
  }

  /**
   * 获取节点的所有可用输入字段选项（用于下拉选择）
   * @param nodeId 节点ID
   * @param nodeRegistries 节点注册信息
   * @returns 字段选项列表
   */
  const getInputFieldOptions = (nodeId: string, nodeRegistries: Record<string, FlowNodeRegistry>) => {
    return getUpstreamFields(nodeId, nodeRegistries).map(field => ({
      label: field.label,
      value: field.value,
      type: field.type
    }))
  }

  return {
    getUpstreamFields,
    getNodeOutputFields,
    parseFieldReference,
    validateFieldReference,
    getInputFieldOptions
  }
}

// 字段类型映射
export const getFieldTypeOptions = () => {
  const { t } = useI18n()
  return [
    { label: t('components.flowEditor.fieldTypes.text') || '', value: 'text' },
    { label: t('components.flowEditor.fieldTypes.number') || '', value: 'number' },
    { label: t('components.flowEditor.fieldTypes.boolean') || '', value: 'boolean' },
    { label: t('components.flowEditor.fieldTypes.date') || '', value: 'date' },
    { label: t('components.flowEditor.fieldTypes.array') || '', value: 'array' },
    { label: t('components.flowEditor.fieldTypes.object') || '', value: 'object' },
  ] as const
}

// 保留原有的常量导出以兼容现有代码
export const FIELD_TYPE_OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Date', value: 'date' },
  { label: 'Array', value: 'array' },
  { label: 'Object', value: 'object' },
] as const