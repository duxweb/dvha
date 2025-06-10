import type { IJsonAdaptor, JsonSchemaNode } from './types'
import { createAdaptorResult, evaluateCondition, extractContext } from './utils/contextManager'
import { evaluateExpression } from './utils/expressionParser'

export const vIfAdaptor: IJsonAdaptor = {
  name: 'v-if',
  priority: 100,
  process(node: JsonSchemaNode, props: Record<string, any>) {
    const attrs = node.attrs || {}
    const context = extractContext(props)

    let condition: any

    if (attrs['v-if'] !== undefined) {
      condition = evaluateCondition(attrs['v-if'], context, evaluateExpression)
    }
    else if (attrs['v-else-if'] !== undefined) {
      condition = evaluateCondition(attrs['v-else-if'], context, evaluateExpression)
    }
    else if (attrs['v-else'] !== undefined) {
      condition = true
    }

    if (condition === undefined) {
      return null
    }

    return createAdaptorResult(props, {
      skip: !condition,
      cleanKeys: ['v-if', 'v-else-if', 'v-else'],
    })
  },
}
