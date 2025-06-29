import type { Canvas, FabricObject } from 'fabric'

export interface PropertyControl {
  key: string
  label: string
  type: 'input' | 'number' | 'color' | 'select' | 'button' | 'textarea' | 'slider'
  value: any
  min?: number
  max?: number
  options?: Array<{ label: string, value: any }>
  action?: () => void
  disabled?: boolean
}

export interface ElementPlugin {
  id: string
  name: string
  icon: string
  category: string
  elementTypes: string[]

  // 创建元素配置
  create: (options?: any) => {
    type: string
    config: any
  }

  // 获取工具栏控件
  getToolbarControls: (
    object: FabricObject,
    context: {
      updateProperty: (key: string, value: any) => void
      canvas: Canvas | null
    }
  ) => PropertyControl[]
}

export interface CanvasSettings {
  width: number
  height: number
  backgroundColor: string
  backgroundImage: string | null
}

export interface FabricElement {
  id: string
  type: string
  config: any
  elementType?: string
}

export interface AlignmentControl {
  key: string
  label: string
  action: () => void
}
