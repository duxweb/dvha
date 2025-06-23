import type { Component, Ref } from 'vue'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

/**
 * 组件缓存项
 */
interface ComponentCacheItem {
  component: Component
  name: string
  originalName: string
  cacheKey: string
}

export interface JsonSchemaStoreState {
  componentCache: Ref<Map<string, ComponentCacheItem>>
  componentsByName: Ref<Map<string, Component>>
  addComponent: (component: Component, name: string, originalName?: string) => string
  getComponent: (key: string) => Component | undefined
  getComponentByName: (name: string) => Component | undefined
  hasComponent: (key: string) => boolean
  clearCache: () => void
  getCacheSize: () => number
}

/**
 * 生成组件缓存键
 */
function generateCacheKey(component: Component, name: string): string {
  // 使用组件名和组件引用的字符串化来生成唯一键
  const componentId = component.toString ? component.toString() : String(component)
  return `${name}-${componentId.slice(0, 32)}`
}

/**
 * use json schema store
 * @param manageName manage name
 * @returns json schema store
 */
export function useJsonSchemaStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const jsonSchemaStore = createJsonSchemaStore(manageName)
  return jsonSchemaStore()
}

/**
 * create json schema store
 * @param manageName manage name
 * @returns json schema store
 */
function createJsonSchemaStore(manageName: string) {
  return defineStore<string, JsonSchemaStoreState>(`jsonSchema-${manageName}`, () => {
    const componentCache = ref<Map<string, ComponentCacheItem>>(new Map())
    const componentsByName = ref<Map<string, Component>>(new Map())

    /**
     * 添加组件到缓存
     */
    const addComponent = (component: Component, name: string, originalName?: string): string => {
      const cacheKey = generateCacheKey(component, name)

      if (!componentCache.value.has(cacheKey)) {
        componentCache.value.set(cacheKey, {
          component,
          name,
          originalName: originalName || name,
          cacheKey,
        })

        // 同时添加到按名称索引的映射中
        componentsByName.value.set(name, component)
      }

      return cacheKey
    }

    /**
     * 从缓存获取组件
     */
    const getComponent = (key: string): Component | undefined => {
      return componentCache.value.get(key)?.component
    }

    /**
     * 根据名称获取组件
     */
    const getComponentByName = (name: string): Component | undefined => {
      return componentsByName.value.get(name)
    }

    /**
     * 检查缓存中是否存在组件
     */
    const hasComponent = (key: string): boolean => {
      return componentCache.value.has(key)
    }

    /**
     * 清空缓存
     */
    const clearCache = () => {
      componentCache.value.clear()
      componentsByName.value.clear()
    }

    /**
     * 获取缓存大小
     */
    const getCacheSize = () => {
      return componentCache.value.size
    }

    return {
      componentCache,
      componentsByName,
      addComponent,
      getComponent,
      getComponentByName,
      hasComponent,
      clearCache,
      getCacheSize,
    }
  })
}
