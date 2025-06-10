import type { IJsonAdaptor, JsonSchemaNode } from './types'
import { evaluateCondition, extractContext } from './utils/contextManager'
import { evaluateExpression } from './utils/expressionParser'

export const vShowAdaptor: IJsonAdaptor = {
  name: 'v-show',
  priority: 95,
  process(node: JsonSchemaNode, props: Record<string, any>) {
    const vShowValue = node.attrs?.['v-show']
    if (vShowValue === undefined)
      return null

    const context = extractContext(props)
    const show = evaluateCondition(vShowValue, context, evaluateExpression)

    const cleanProps = { ...props }
    delete cleanProps['v-show']

    const currentStyle = cleanProps.style || {}
    const newStyle = typeof currentStyle === 'object'
      ? { ...currentStyle, display: show ? undefined : 'none' }
      : { display: show ? undefined : 'none' }

    return {
      props: {
        ...cleanProps,
        style: newStyle,
      },
    }
  },
}
