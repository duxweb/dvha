import type { IJsonAdaptor, VModelBinding } from './types'
import { toRef } from 'vue'

export const vModelAdaptor: IJsonAdaptor = {
  name: 'v-model',
  priority: 70,
  process(_node, props) {
    const modelProps: Record<string, any> = {}
    const restProps: Record<string, any> = {}
    let hasModel = false

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
          const { modelValue, updateFn } = createModelBinding(value as VModelBinding, modifiers)

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

function createModelBinding(value: VModelBinding | any, modifiers: string[]) {
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
