import type { ElementConfig, ToolbarControl } from './types'
import { Rect } from 'fabric'

const rectElement: ElementConfig = {
  type: 'rect',
  name: '矩形',
  icon: 'i-tabler:square',
  category: 'basic',

  defaultProps: {
    id: '',
    type: 'rect',
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    locked: false,
    fill: '#ff0000',
    stroke: '',
    strokeWidth: 0,
    strokeDashArray: null,
    rx: 0,
    ry: 0,
    opacity: 1,
    label: '',
  },

  createFabricObject: (props) => {
    const rect = new Rect({
      left: props.left,
      top: props.top,
      width: props.width,
      height: props.height,
      fill: props.fill,
      stroke: props.stroke || undefined,
      strokeWidth: props.strokeWidth,
      strokeDashArray: props.strokeDashArray,
      rx: props.rx,
      ry: props.ry,
      angle: props.angle,
      scaleX: props.scaleX,
      scaleY: props.scaleY,
      opacity: props.opacity,
      visible: props.visible,
      selectable: !props.locked,
      evented: !props.locked,
      strokeUniform: true,
      // 支持等比例缩放：用户可以按住Shift键进行等比例缩放
      uniformScaling: false, // 默认不强制等比例，但支持Shift键等比例缩放
    })

    // 添加自定义控制点，支持等比例缩放
    rect.setControlsVisibility({
      mtr: true, // 旋转控制点
      mt: true, // 顶部中间
      mb: true, // 底部中间
      ml: true, // 左侧中间
      mr: true, // 右侧中间
      tl: true, // 左上角 - 支持等比例缩放
      tr: true, // 右上角 - 支持等比例缩放
      bl: true, // 左下角 - 支持等比例缩放
      br: true, // 右下角 - 支持等比例缩放
    })

    // 保存label到自定义属性
    ;(rect as any).label = props.label

    return rect
  },

  getPropsFromFabricObject: (obj) => {
    const rect = obj as Rect
    const scaleX = rect.scaleX || 1
    const scaleY = rect.scaleY || 1

    return {
      type: 'rect',
      left: Math.round(rect.left || 0),
      top: Math.round(rect.top || 0),
      width: Math.round((rect.width || 100) * scaleX),
      height: Math.round((rect.height || 100) * scaleY),
      angle: Math.round(rect.angle || 0),
      scaleX: 1, // 始终重置为1，将缩放应用到实际尺寸
      scaleY: 1, // 始终重置为1，将缩放应用到实际尺寸
      visible: rect.visible !== false,
      locked: !rect.selectable,
      fill: rect.fill || '#ff0000',
      stroke: rect.stroke || '',
      strokeWidth: Math.round(rect.strokeWidth || 0),
      strokeDashArray: rect.strokeDashArray || null,
      rx: Math.round(rect.rx || 0),
      ry: Math.round(rect.ry || 0),
      opacity: rect.opacity || 1,
      label: (rect as any).label || '',
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
      key: 'width',
      label: '宽度',
      type: 'number',
      value: props.width,
      options: { min: 1, max: 2000, step: 1 },
    },
    {
      key: 'height',
      label: '高度',
      type: 'number',
      value: props.height,
      options: { min: 1, max: 2000, step: 1 },
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
      key: 'rx',
      label: '圆角半径',
      type: 'number',
      value: props.rx,
      options: { min: 0, max: 100, step: 1 },
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
    const rect = fabricObject as Rect
    rect.set({
      width: props.width,
      height: props.height,
      fill: props.fill,
      stroke: props.stroke || undefined,
      strokeWidth: props.strokeWidth,
      rx: props.rx,
      ry: props.rx, // 让ry跟随rx
      opacity: props.opacity,
    })
    // 保存label到自定义属性
    ;(rect as any).label = props.label
  },
}

export default rectElement
