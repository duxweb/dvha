import type { IJsonAdaptor, IJsonAdaptorResult, JsonSchemaNode } from './types'
import { evaluateExpression } from './utils/expressionParser'

/**
 * 检查字符串是否包含插值表达式
 */
function hasInterpolation(str: string): boolean {
  return typeof str === 'string' && /\{\{.+?\}\}/.test(str)
}

/**
 * 处理字符串插值
 */
function processStringInterpolation(text: string, context: Record<string, any>): string {
  if (!hasInterpolation(text)) {
    return text
  }

  return text.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
    try {
      const result = evaluateExpression(expression.trim(), context)
      return String(result ?? '')
    }
    catch (error) {
      console.warn(`Interpolation expression evaluation failed: ${expression}`, error)
      return match
    }
  })
}

export const vTextAdaptor: IJsonAdaptor = {
  name: 'v-text',
  priority: 50,
  process(node: JsonSchemaNode, props: Record<string, any>): IJsonAdaptorResult | null {
    const context = props._context || {}
    let hasChanges = false
    let childrenChanged = false

    const processedProps: Record<string, any> = {}
    Object.entries(props).forEach(([key, value]) => {
      if (typeof value === 'string' && hasInterpolation(value)) {
        const newValue = processStringInterpolation(value, context)
        if (newValue !== value) {
          processedProps[key] = newValue
          hasChanges = true
        }
        else {
          processedProps[key] = value
        }
      }
      else {
        processedProps[key] = value
      }
    })

    let processedChildren = node.children
    if (typeof node.children === 'string' && hasInterpolation(node.children)) {
      const newText = processStringInterpolation(node.children, context)
      if (newText !== node.children) {
        processedChildren = newText
        hasChanges = true
        childrenChanged = true
      }
    }

    if (!hasChanges) {
      return null
    }

    if (childrenChanged) {
      const newNode = {
        ...node,
        attrs: node.attrs,
        children: processedChildren,
      }
      return {
        props: processedProps,
        nodes: [newNode],
      }
    }

    return {
      props: processedProps,
    }
  },
}
