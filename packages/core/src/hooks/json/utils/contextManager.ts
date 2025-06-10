/**
 * 合并父子上下文
 */
export function mergeContext(parentContext: Record<string, any>, childContext: Record<string, any>): Record<string, any> {
  return {
    ...parentContext,
    ...childContext,
  }
}

/**
 * 从属性中提取上下文
 */
export function extractContext(props: Record<string, any>): Record<string, any> {
  return props._context || {}
}

/**
 * 注入上下文到属性
 */
export function injectContext(props: Record<string, any>, context: Record<string, any>): Record<string, any> {
  if (Object.keys(context).length === 0) {
    return props
  }

  return {
    ...props,
    _context: context,
  }
}

/**
 * 清理属性中的内部字段
 */
export function cleanProps(props: Record<string, any>): Record<string, any> {
  const { _context, ...cleanedProps } = props
  return cleanedProps
}

/**
 * 创建适配器处理结果
 */
export function createAdaptorResult(props: Record<string, any>, options: {
  skip?: boolean
  nodes?: any[]
  cleanKeys?: string[]
} = {}) {
  const cleanedProps = { ...props }

  if (options.cleanKeys) {
    options.cleanKeys.forEach(key => delete cleanedProps[key])
  }

  return {
    props: cleanedProps,
    skip: options.skip,
    nodes: options.nodes,
  }
}

/**
 * 通用条件求值函数
 */
export function evaluateCondition(value: any, context: Record<string, any>, evaluateExpression: (expr: string, ctx: Record<string, any>) => any): boolean {
  if (typeof value === 'string') {
    return Boolean(evaluateExpression(value, context))
  }
  return Boolean(value)
}
