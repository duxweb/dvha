import type { IJsonAdaptor, VModelBinding } from './types'
import { toRef } from 'vue'
import { extractContext } from './utils/contextManager'
import { evaluateExpression } from './utils/expressionParser'

export const vModelAdaptor: IJsonAdaptor = {
  name: 'v-model',
  priority: 70,
  process(_node, props) {
    const modelProps: Record<string, any> = {}
    const restProps: Record<string, any> = {}
    let hasModel = false
    const context = extractContext(props)

    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('v-model') || key.startsWith('vModel')) {
        hasModel = true

        const [modelPart, ...modifiers] = key.split('.')

        let modelName: string
        if (modelPart === 'v-model' || modelPart === 'vModel') {
          modelName = 'modelValue'
        }
        else if (modelPart.startsWith('v-model:')) {
          modelName = modelPart.slice(8)
        }
        else if (modelPart.startsWith('vModel:')) {
          modelName = modelPart.slice(7)
        }
        else {
          modelName = 'modelValue'
        }

        try {
          const { modelValue, updateFn } = createModelBinding(value as VModelBinding, modifiers, context)

          modelProps[modelName] = modelValue
          modelProps[`onUpdate:${modelName}`] = updateFn
        }
        catch (error) {
          console.error(`v-model binding error (${modelName}):`, error)
        }
      }
      else {
        restProps[key] = value
      }
    })

    return hasModel ? { props: { ...restProps, ...modelProps } } : null
  },
}

function createModelBinding(value: VModelBinding | any, modifiers: string[], context: Record<string, any>) {
  // 如果是字符串表达式，尝试从 context 中解析
  if (typeof value === 'string') {
    // 简单的路径解析，如 'row.name' -> context.row.name
    const getValue = () => {
      try {
        return evaluateExpression(value, context)
      }
      catch (error) {
        console.warn(`v-model: Failed to evaluate expression "${value}"`, error)
        return undefined
      }
    }

    const setValue = (newValue: any) => {
      try {
        // 解析路径，如 'row.name' -> ['row', 'name']
        const parts = value.split('.')
        if (parts.length >= 2) {
          const objPath = parts.slice(0, -1).join('.')
          const propName = parts[parts.length - 1]
          const obj = evaluateExpression(objPath, context)

          if (obj && typeof obj === 'object') {
            obj[propName] = applyModifiers(newValue, modifiers)
            return
          }
        }
        console.warn(`v-model: Cannot update expression "${value}". Target object not found.`)
      }
      catch (error) {
        console.warn(`v-model: Failed to update expression "${value}"`, error)
      }
    }

    return {
      modelValue: getValue(),
      updateFn: setValue,
    }
  }

  if (Array.isArray(value) && value.length === 2
    && typeof value[0] === 'function' && typeof value[1] === 'function') {
    const [getter, setter] = value

    return {
      modelValue: getter(),
      updateFn: (newValue: any) => {
        setter(applyModifiers(newValue, modifiers))
      },
    }
  }

  if (Array.isArray(value) && value.length === 2) {
    const [obj, prop] = value

    if (!obj || typeof prop !== 'string') {
      throw new Error('Invalid v-model binding format: [obj, prop] expected')
    }

    const valueRef = toRef(obj, prop)

    return {
      modelValue: valueRef.value,
      updateFn: (newValue: any) => {
        valueRef.value = applyModifiers(newValue, modifiers)
      },
    }
  }

  const valueRef = toRef(value)

  if (valueRef === value && typeof value !== 'object') {
    return {
      modelValue: value,
      updateFn: () => {
        console.warn('v-model: Cannot update non-reactive value. Please use ref, [obj, prop], or [getter, setter] format.')
      },
    }
  }

  return {
    modelValue: valueRef.value,
    updateFn: (newValue: any) => {
      valueRef.value = applyModifiers(newValue, modifiers)
    },
  }
}

function applyModifiers(value: any, modifiers: string[]): any {
  return modifiers.reduce((val, modifier) => {
    switch (modifier) {
      case 'trim':
        return typeof val === 'string' ? val.trim() : val
      case 'number': {
        const num = Number(val)
        return Number.isNaN(num) ? val : num
      }
      case 'lazy':
        return val
      default:
        console.warn(`Unknown v-model modifier: ${modifier}`)
        return val
    }
  }, value)
}
