import type { IJsonAdaptor, IJsonAdaptorResult, JsonSchemaNode } from './types'
import type { VForParseResult } from './utils/expressionParser'
import { cleanProps, extractContext, injectContext } from './utils/contextManager'
import { parseVForExpression } from './utils/expressionParser'

export const vForAdaptor: IJsonAdaptor = {
  name: 'v-for',
  priority: 90,
  process(node: JsonSchemaNode, props: Record<string, any>): IJsonAdaptorResult | null {
    const vForValue = node.attrs?.['v-for'] || node.attrs?.vFor
    if (!vForValue) {
      return null
    }

    const newAttrs = { ...node.attrs }
    delete newAttrs['v-for']
    delete newAttrs.vFor

    const parentContext = extractContext(props)
    let parseResult: VForParseResult

    try {
      if (Array.isArray(vForValue)) {
        parseResult = {
          items: vForValue,
          itemName: 'item',
          indexName: 'index',
        }
      }
      else if (typeof vForValue === 'object' && vForValue.list) {
        parseResult = {
          items: Array.isArray(vForValue.list) ? vForValue.list : [],
          itemName: vForValue.item || 'item',
          indexName: vForValue.index || 'index',
        }
      }
      else if (typeof vForValue === 'string') {
        parseResult = parseVForExpression(vForValue, parentContext)
      }
      else {
        console.warn('Unsupported v-for format:', vForValue)
        return null
      }
    }
    catch (error) {
      console.warn('v-for parsing failed:', error)
      return null
    }

    const nodes: JsonSchemaNode[] = parseResult.items.map((item, index) => {
      const itemContext = {
        [parseResult.itemName]: item,
        [parseResult.indexName]: index,
      }

      const mergedContext = { ...parentContext, ...itemContext }

      return {
        ...node,
        attrs: {
          ...newAttrs,
          key: `${parseResult.itemName}_${index}`,
          ...injectContext({}, mergedContext),
        },
      }
    })

    return {
      props: cleanProps(props),
      nodes,
    }
  },
}
