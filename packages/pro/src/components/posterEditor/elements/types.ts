import type { FabricObject } from 'fabric'

// 元素基础属性
export interface BaseElementProps {
  id: string
  type: string
  left: number
  top: number
  width: number
  height: number
  angle: number
  scaleX: number
  scaleY: number
  visible: boolean
  locked: boolean
}

// 工具栏控件类型
export type ToolbarControlType = 'number' | 'text' | 'color' | 'select' | 'switch' | 'slider' | 'image'

// 工具栏控件配置
export interface ToolbarControl {
  key: string
  label: string
  type: ToolbarControlType
  value: any
  options?: {
    min?: number
    max?: number
    step?: number
    choices?: Array<{ label: string, value: any }>
    placeholder?: string
  }
}

// 元素配置接口
export interface ElementConfig {
  type: string
  name: string
  icon: string
  category: string
  defaultProps: Record<string, any>

  // 创建Fabric对象
  createFabricObject: (props: Record<string, any>) => FabricObject

  // 从Fabric对象获取属性
  getPropsFromFabricObject: (obj: FabricObject) => Record<string, any>

  // 获取工具栏控件
  getToolbarControls: (props: Record<string, any>) => ToolbarControl[]

  // 属性更新回调
  onPropsChange?: (props: Record<string, any>, fabricObject: FabricObject) => void
}

// 对齐类型
export type AlignType
  = | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'center-horizontal'
    | 'center-vertical'
    | 'center-both'
    | 'distribute-horizontal'
    | 'distribute-vertical'
    | 'move-up'
    | 'move-down'
    | 'move-to-front'
    | 'move-to-back'

// 元素数据类型（BaseElementProps 的别名，用于更清晰的语义）
export type ElementData = BaseElementProps & Record<string, any>

// 画布数据
export interface CanvasData {
  width: number
  height: number
  backgroundColor: string
  backgroundImage?: string
  elements: ElementData[]
}
