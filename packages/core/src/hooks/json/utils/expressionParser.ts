import jsep from 'jsep'
import { unref } from 'vue'

jsep.addIdentifierChar('$')
jsep.addIdentifierChar('@')

export function parseExpression(expression: string): jsep.Expression | null {
  try {
    return jsep(expression)
  }
  catch (error) {
    console.warn(`Expression parsing failed: ${expression}`, error)
    return null
  }
}

export function evaluateExpression(expression: string, context: Record<string, any>): any {
  const ast = parseExpression(expression)
  if (!ast)
    return undefined

  return evaluateAst(ast, context)
}

function evaluateAst(node: any, context: Record<string, any>): any {
  if (!node || typeof node !== 'object')
    return undefined

  switch (node.type) {
    case 'Literal':
      return node.value

    case 'Identifier':
      return getNestedValue(context, node.name)

    case 'MemberExpression': {
      const object = evaluateAst(node.object, context)
      if (object == null)
        return undefined

      const property = node.computed
        ? evaluateAst(node.property, context)
        : node.property?.name

      // 解包响应式数据
      const unwrappedObject = unref(object)
      return unwrappedObject?.[property]
    }

    case 'BinaryExpression': {
      const left = evaluateAst(node.left, context)
      const right = evaluateAst(node.right, context)

      const ops = {
        '+': () => left + right,
        '-': () => left - right,
        '*': () => left * right,
        '/': () => left / right,
        '%': () => left % right,
        '==': () => left === right,
        '===': () => left === right,
        '!=': () => left !== right,
        '!==': () => left !== right,
        '<': () => left < right,
        '>': () => left > right,
        '<=': () => left <= right,
        '>=': () => left >= right,
      }

      return ops[node.operator]?.() ?? undefined
    }

    case 'LogicalExpression': {
      const left = evaluateAst(node.left, context)

      if (node.operator === '&&')
        return left && evaluateAst(node.right, context)
      if (node.operator === '||')
        return left || evaluateAst(node.right, context)
      if (node.operator === '??')
        return left ?? evaluateAst(node.right, context)

      return undefined
    }

    case 'UnaryExpression': {
      const arg = evaluateAst(node.argument, context)

      if (node.operator === '!')
        return !arg
      if (node.operator === '-')
        return -arg
      if (node.operator === '+')
        return +arg

      return undefined
    }

    case 'ConditionalExpression': {
      const test = evaluateAst(node.test, context)
      return test
        ? evaluateAst(node.consequent, context)
        : evaluateAst(node.alternate, context)
    }

    case 'CallExpression': {
      const callee = evaluateAst(node.callee, context)

      // 解包响应式函数
      const unwrappedCallee = unref(callee)

      if (typeof unwrappedCallee !== 'function') {
        console.warn('Attempting to call non-function value:', unwrappedCallee)
        return undefined
      }

      const args = Array.isArray(node.arguments)
        ? node.arguments.map((arg: any) => {
            const result = evaluateAst(arg, context)
            return unref(result) // 解包参数中的响应式数据
          })
        : []

      try {
        // 获取函数所属的对象作为 this 上下文
        let thisContext
        if (node.callee.type === 'MemberExpression') {
          const object = evaluateAst(node.callee.object, context)
          thisContext = unref(object)
        }

        return unwrappedCallee.apply(thisContext, args)
      }
      catch (error) {
        console.warn('Function call error:', error)
        return undefined
      }
    }

    case 'ArrayExpression': {
      if (!Array.isArray(node.elements))
        return []

      return node.elements.map((element: any) => {
        if (!element)
          return undefined
        const result = evaluateAst(element, context)
        return unref(result)
      })
    }

    default:
      console.warn(`Unsupported expression type: ${node.type}`)
      return undefined
  }
}

function getNestedValue(obj: any, path: string): any {
  if (!path || !obj)
    return undefined

  try {
    return path.split('.').reduce((current, key) => {
      if (current == null)
        return undefined
      // 解包每一层的响应式数据
      const unwrapped = unref(current)
      return unwrapped?.[key]
    }, obj)
  }
  catch {
    return undefined
  }
}

export interface VForParseResult {
  items: any[]
  itemName: string
  indexName: string
}

export function parseVForExpression(expression: string, context: Record<string, any>): VForParseResult {
  const trimmed = expression.trim()

  const tupleMatch = trimmed.match(/^\((\w+),\s*(\w+)\) in (.+)$/)
  if (tupleMatch) {
    const [, itemName, indexName, listExpr] = tupleMatch
    const items = evaluateExpression(listExpr, context)
    const unwrappedItems = unref(items)
    return {
      items: Array.isArray(unwrappedItems) ? unwrappedItems : [],
      itemName,
      indexName,
    }
  }

  const simpleMatch = trimmed.match(/^(\w+) in (.+)$/)
  if (simpleMatch) {
    const [, itemName, listExpr] = simpleMatch
    const items = evaluateExpression(listExpr, context)
    const unwrappedItems = unref(items)
    return {
      items: Array.isArray(unwrappedItems) ? unwrappedItems : [],
      itemName,
      indexName: 'index',
    }
  }

  throw new Error(`Invalid v-for expression: ${expression}`)
}

export function extractVariables(ast: jsep.Expression): string[] {
  const variables = new Set<string>()

  function walk(node: any): void {
    if (!node || typeof node !== 'object')
      return

    switch (node.type) {
      case 'Identifier':
        variables.add(node.name)
        break
      case 'MemberExpression':
        walk(node.object)
        if (node.computed)
          walk(node.property)
        break
      case 'BinaryExpression':
      case 'LogicalExpression':
        walk(node.left)
        walk(node.right)
        break
      case 'UnaryExpression':
        walk(node.argument)
        break
      case 'ConditionalExpression':
        walk(node.test)
        walk(node.consequent)
        walk(node.alternate)
        break
      case 'CallExpression':
        walk(node.callee)
        if (Array.isArray(node.arguments)) {
          node.arguments.forEach((arg: any) => walk(arg))
        }
        break
      case 'ArrayExpression':
        if (Array.isArray(node.elements)) {
          node.elements.forEach((element: any) => {
            if (element)
              walk(element)
          })
        }
        break
    }
  }

  walk(ast)
  return Array.from(variables)
}
