import type { Ref } from 'vue'
import type { JsonAdaptorOptions, JsonSchemaNode } from './json/index'
import { computed, defineComponent, h, isRef, unref } from 'vue'
import { defaultAdaptors } from './json/index'
import { injectContext } from './json/utils/contextManager'

type JsonSchemaData = JsonSchemaNode[] | Ref<JsonSchemaNode[]>

export interface UseJsonSchemaProps extends JsonAdaptorOptions {
  data: JsonSchemaData
  components?: Record<string, any>
  context?: Record<string, any> | Ref<Record<string, any>>
}

/**
 * JSON Schema 渲染器
 */
export function useJsonSchema(props: UseJsonSchemaProps) {
  const adaptors = props.adaptors || defaultAdaptors
  const components = props.components || {}
  const data = computed(() => isRef(props.data) ? props.data.value : props.data)

  function getGlobalContext(): Record<string, any> {
    const ctx = isRef(props.context) ? props.context.value : props.context
    return ctx || {}
  }

  /**
   * 处理节点属性，解包响应式数据
   */
  function processProps(nodeProps: Record<string, any>): Record<string, any> {
    const processedProps: Record<string, any> = {}

    Object.entries(nodeProps).forEach(([key, value]) => {
      if (key === '_context')
        return

      const isModelProp = key === 'modelValue' || key.startsWith('modelValue')
        || (key !== 'value' && (key.includes('model') || key.includes('Model')))

      processedProps[key] = isModelProp && isRef(value) ? unref(value) : value
    })

    return processedProps
  }

  /**
   * 处理插槽内容
   */
  function processSlotContent(slotContent: any, slotProps: any, context: Record<string, any>): any {
    if (typeof slotContent === 'string')
      return slotContent
    if (typeof slotContent === 'function')
      return processSlotContent(slotContent(slotProps), slotProps, context)
    if (Array.isArray(slotContent))
      return slotContent.flatMap(item => processSlotContent(item, slotProps, context)).filter(Boolean)
    if (slotContent?.tag)
      return processNode(slotContent, true, context)
    return slotContent
  }

  /**
   * 处理子元素
   */
  function processChildren(children: any, isSlotContent: boolean, context: Record<string, any>): any {
    if (!children)
      return undefined
    if (typeof children === 'string')
      return children
    if (Array.isArray(children)) {
      return children.flatMap((child) => {
        if (typeof child === 'string')
          return child
        return processNode(child, isSlotContent, context)
      }).filter(Boolean)
    }
    return processNode(children, isSlotContent, context)
  }

  /**
   * 处理单个节点
   */
  function processNode(schema: JsonSchemaNode, isSlotContent = false, parentContext: Record<string, any> = {}): any {
    const { tag, attrs = {}, children, slots } = schema

    const mergedContext = { ...getGlobalContext(), ...parentContext }

    let nodeProps = { ...attrs }
    if (Object.keys(mergedContext).length > 0) {
      nodeProps = { ...nodeProps, ...injectContext({}, mergedContext) }
    }

    for (const adaptor of adaptors) {
      const result = adaptor.process(schema, nodeProps)
      if (!result)
        continue

      nodeProps = result.props
      if (result.skip)
        return null
      if (result.nodes) {
        return result.nodes.map((node) => {
          const nodeContext = node.attrs?._context || {}
          return processNode(node, isSlotContent, { ...mergedContext, ...nodeContext })
        }).filter(Boolean)
      }
    }

    const resolvedTag = typeof tag === 'string' && components[tag] ? components[tag] : tag
    const isVueComponent = typeof resolvedTag !== 'string'
    const processedProps = processProps(nodeProps)

    if (slots && isVueComponent && !isSlotContent) {
      const slotFunctions: Record<string, any> = {}
      Object.entries(slots).forEach(([slotName, slotContent]) => {
        slotFunctions[slotName] = (slotProps: any = {}) => processSlotContent(slotContent, slotProps, mergedContext)
      })
      return h(resolvedTag, processedProps, slotFunctions)
    }

    const processedChildren = processChildren(children, isSlotContent, mergedContext)

    if (isVueComponent && processedChildren !== undefined) {
      return h(resolvedTag, processedProps, { default: () => processedChildren })
    }

    return h(resolvedTag, processedProps, processedChildren)
  }

  const render = defineComponent({
    name: 'JsonSchemaRenderer',
    render() {
      return data.value?.map(node => processNode(node)).filter(Boolean)
    },
  })

  return { render }
}
