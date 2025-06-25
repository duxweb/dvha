import type { Component, Ref } from 'vue'
import type { IConfig } from '../types'
import type { JsonAdaptorOptions, JsonSchemaNode } from './json/index'
import { computed, defineComponent, h, isRef, markRaw, unref } from 'vue'
import { useJsonSchemaStore } from '../stores/jsonSchema'
import { useConfig } from './config'
import { defaultAdaptors } from './json/index'
import { injectContext } from './json/utils/contextManager'

function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * 加载组件到 store
 */
function loadComponentsToStore(components: Record<string, Component> | Component[], jsonSchemaStore: any) {
  if (Array.isArray(components)) {
    components.forEach((component) => {
      const comp = component as any
      let name = comp.name
      if (!name && comp.__name) {
        name = comp.__name.replace(/\.(vue|ts|tsx|js|jsx)$/, '').split('/').pop()
      }
      if (name) {
        jsonSchemaStore.addComponent(markRaw(component), name)
      }
    })
  }
  else if (typeof components === 'object' && components !== null) {
    Object.entries(components).forEach(([name, component]) => {
      jsonSchemaStore.addComponent(markRaw(component), name)
    })
  }
}

/**
 * 初始化 JSON Schema 组件
 * 在应用启动时调用，将配置中的组件加载到全局缓存
 */
export function initJsonSchemaComponents(config: IConfig, manageName?: string) {
  const jsonSchemaStore = useJsonSchemaStore(manageName)

  if (config.jsonSchema?.components) {
    loadComponentsToStore(config.jsonSchema.components, jsonSchemaStore)
  }

  config.manages?.forEach((manage) => {
    if (manage.jsonSchema?.components) {
      loadComponentsToStore(manage.jsonSchema.components, jsonSchemaStore)
    }
  })
}

export type JsonSchemaData = JsonSchemaNode[] | Ref<JsonSchemaNode[]>

export interface UseJsonSchemaProps extends JsonAdaptorOptions {
  data?: JsonSchemaData
  components?: Record<string, Component> | Component[]
  context?: Record<string, any> | Ref<Record<string, any>>
}

/**
 * JSON Schema 渲染器
 */
export function useJsonSchema(props?: UseJsonSchemaProps) {
  const config = useConfig()
  const jsonSchemaStore = useJsonSchemaStore()

  const adaptors = [
    ...defaultAdaptors,
    ...(config.jsonSchema?.adaptors || []),
    ...(props?.adaptors || []),
  ]

  if (props?.components) {
    loadComponentsToStore(props.components, jsonSchemaStore)
  }
  const data = computed(() => isRef(props?.data) ? props?.data.value : props?.data)

  function getGlobalContext(): Record<string, any> {
    const ctx = isRef(props?.context) ? props?.context.value : props?.context
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

    const resolveComponent = (tagName: string) => {
      // 直接从 store 中查找组件
      let component = jsonSchemaStore.getComponentByName(tagName)
      if (component) {
        return component
      }

      // 尝试 kebab-case 格式查找
      const kebabName = kebabCase(tagName)
      component = jsonSchemaStore.getComponentByName(kebabName)
      if (component) {
        return component
      }

      // 尝试 PascalCase 格式查找
      const pascalName = tagName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/^[a-z]/, letter => letter.toUpperCase())
      component = jsonSchemaStore.getComponentByName(pascalName)
      if (component) {
        return component
      }

      return null
    }

    let resolvedTag = typeof tag === 'string' ? (resolveComponent(tag) || tag) : tag

    if (typeof resolvedTag !== 'string' && typeof resolvedTag === 'object') {
      resolvedTag = markRaw(resolvedTag)
    }

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
      return data.value?.map(node => processNode(node)).filter(Boolean) || []
    },
  })

  function renderAsync(options: {
    data: JsonSchemaNode[]
    context?: Record<string, any>
  }) {
    return defineComponent({
      name: 'DynamicJsonSchemaRenderer',
      render() {
        const dynamicContext = { ...getGlobalContext(), ...options.context }
        return options.data?.map(node => processNode(node, false, dynamicContext)).filter(Boolean)
      },
    })
  }

  return { render, renderAsync }
}
