import type { ElementConfig, ToolbarControl } from './types'
import { Circle } from 'fabric'

const circleElement: ElementConfig = {
  type: 'circle',
  name: '圆形',
  icon: 'i-tabler:circle',
  category: 'basic',

  defaultProps: {
    type: 'circle',
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    locked: false,
    radius: 50,
    fill: '#00ff00',
    stroke: '',
    strokeWidth: 0,
    strokeDashArray: null,
    opacity: 1,
    label: '',
  },

  createFabricObject: (props) => {
    const circle = new Circle({
      left: props.left,
      top: props.top,
      originX: 'left',
      originY: 'top',
      radius: props.radius,
      fill: props.fill,
      stroke: props.stroke || undefined,
      strokeWidth: props.strokeWidth,
      strokeDashArray: props.strokeDashArray,
      angle: props.angle,
      scaleX: props.scaleX,
      scaleY: props.scaleY,
      opacity: props.opacity,
      visible: props.visible,
      selectable: !props.locked,
      evented: !props.locked,
      strokeUniform: true,
      lockUniScaling: true, // 强制等比例缩放，确保圆形始终占满容器
    })

    // 保存label到自定义属性
    ;(circle as any).label = props.label

    return circle
  },

  getPropsFromFabricObject: (obj) => {
    const circle = obj as Circle
    const scaleX = circle.scaleX || 1
    const scaleY = circle.scaleY || 1
    const radius = Math.round((circle.radius || 50) * Math.max(scaleX, scaleY)) // 圆形使用较大的缩放值

    return {
      type: 'circle',
      left: Math.round(circle.left || 0),
      top: Math.round(circle.top || 0),
      width: radius * 2,
      height: radius * 2,
      angle: Math.round(circle.angle || 0),
      scaleX: 1, // 始终重置为1，将缩放应用到实际尺寸
      scaleY: 1, // 始终重置为1，将缩放应用到实际尺寸
      visible: circle.visible !== false,
      locked: !circle.selectable,
      radius,
      fill: circle.fill || '#00ff00',
      stroke: circle.stroke || '',
      strokeWidth: Math.round(circle.strokeWidth || 0),
      strokeDashArray: circle.strokeDashArray || null,
      opacity: circle.opacity || 1,
      label: (circle as any).label || '',
    }
  },

  getToolbarControls: (props): ToolbarControl[] => [
    {
      key: 'label',
      label: '标签',
      type: 'text',
      value: props.label,
      options: { placeholder: '请输入标签' },
    },
    {
      key: 'radius',
      label: '半径',
      type: 'number',
      value: props.radius,
      options: { min: 1, max: 1000, step: 1 },
    },
    {
      key: 'fill',
      label: '填充颜色',
      type: 'color',
      value: props.fill,
    },
    {
      key: 'stroke',
      label: '边框颜色',
      type: 'color',
      value: props.stroke,
    },
    {
      key: 'strokeWidth',
      label: '边框宽度',
      type: 'number',
      value: props.strokeWidth,
      options: { min: 0, max: 50, step: 1 },
    },
    {
      key: 'opacity',
      label: '透明度',
      type: 'slider',
      value: props.opacity,
      options: { min: 0, max: 1, step: 0.01 },
    },
  ],

  onPropsChange: (props, fabricObject) => {
    const circle = fabricObject as Circle
    circle.set({
      radius: props.radius,
      fill: props.fill,
      stroke: props.stroke || undefined,
      strokeWidth: props.strokeWidth,
      opacity: props.opacity,
    })
    // 保存label到自定义属性
    ;(circle as any).label = props.label
  },
}

export default circleElement
