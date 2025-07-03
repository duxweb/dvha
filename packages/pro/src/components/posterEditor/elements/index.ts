import type { ElementConfig } from './types'
import circleElement from './circle'
import imageElement from './image'
import rectElement from './rect'
import textElement from './text'

// 元素注册器
class ElementRegistry {
  private elements = new Map<string, ElementConfig>()

  // 注册元素
  register(config: ElementConfig): void {
    this.elements.set(config.type, config)
  }

  // 批量注册元素
  registerAll(configs: ElementConfig[]): void {
    configs.forEach(config => this.register(config))
  }

  // 获取元素配置
  get(type: string): ElementConfig | null {
    return this.elements.get(type) || null
  }

  // 获取所有元素配置
  getAll(): ElementConfig[] {
    return Array.from(this.elements.values())
  }

  // 根据分类获取元素配置
  getByCategory(category: string): ElementConfig[] {
    return this.getAll().filter(config => config.category === category)
  }

  // 获取所有分类
  getCategories(): string[] {
    const categories = new Set(this.getAll().map(config => config.category))
    return Array.from(categories)
  }
}

// 创建全局元素注册器实例
export const elementRegistry = new ElementRegistry()

// 注册默认元素
elementRegistry.registerAll([
  textElement,
  rectElement,
  circleElement,
  imageElement,
])

// 兼容性导出（保持向后兼容）
export const elementConfigs: ElementConfig[] = elementRegistry.getAll()
export const getElementConfig = (type: string) => elementRegistry.get(type)
export const getElementsByCategory = (category: string) => elementRegistry.getByCategory(category)

// 导出类型
export * from './types'
