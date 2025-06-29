import type { ElementConfig, ToolbarControl } from './types'
import { Group, Image, Rect, Text } from 'fabric'

const imageElement: ElementConfig = {
  type: 'image',
  name: '图片',
  icon: 'i-tabler:photo',
  category: 'basic',

  defaultProps: {
    id: '',
    type: 'image',
    left: 100,
    top: 100,
    width: 200,
    height: 200,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    locked: false,
    src: '',
    opacity: 1,
    cropX: 0,
    cropY: 0,
    borderRadius: 0,
  },

  createFabricObject: (props): any => {
    if (!props.src) {
      // 创建占位符矩形
      const placeholder = new Rect({
        left: props.left,
        top: props.top,
        width: props.width,
        height: props.height,
        fill: '#f0f0f0',
        stroke: '#ddd',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        angle: props.angle,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        opacity: props.opacity,
        visible: props.visible,
        selectable: !props.locked,
        evented: !props.locked,
      })

      // 添加占位符文本
      const text = new Text('点击选择图片', {
        left: props.left + props.width / 2,
        top: props.top + props.height / 2,
        fontSize: 14,
        fill: '#999',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      })

      return new Group([placeholder, text], {
        left: props.left,
        top: props.top,
        selectable: !props.locked,
        evented: !props.locked,
      })
    }

    // 创建实际图片对象
    return Image.fromURL(props.src, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      img.set({
        left: props.left,
        top: props.top,
        scaleX: props.width / (img.width || 1),
        scaleY: props.height / (img.height || 1),
        angle: props.angle,
        opacity: props.opacity,
        visible: props.visible,
        selectable: !props.locked,
        evented: !props.locked,
        cropX: props.cropX,
        cropY: props.cropY,
      })

      // 添加圆角效果
      if (props.borderRadius > 0) {
        img.clipPath = new Rect({
          width: props.width,
          height: props.height,
          rx: props.borderRadius,
          ry: props.borderRadius,
          originX: 'center',
          originY: 'center',
        })
      }

      return img
    })
  },

  getPropsFromFabricObject: (obj) => {
    if (obj.type === 'group') {
      // 占位符组的情况
      const scaleX = obj.scaleX || 1
      const scaleY = obj.scaleY || 1

      return {
        type: 'image',
        left: Math.round(obj.left || 0),
        top: Math.round(obj.top || 0),
        width: Math.round((obj.width || 200) * scaleX),
        height: Math.round((obj.height || 200) * scaleY),
        angle: Math.round(obj.angle || 0),
        scaleX: 1, // 始终重置为1，将缩放应用到实际尺寸
        scaleY: 1, // 始终重置为1，将缩放应用到实际尺寸
        visible: obj.visible !== false,
        locked: !obj.selectable,
        src: '',
        opacity: obj.opacity || 1,
        cropX: Math.round(0),
        cropY: Math.round(0),
        borderRadius: Math.round(0),
      }
    }

    const img = obj as Image
    const scaleX = img.scaleX || 1
    const scaleY = img.scaleY || 1

    return {
      type: 'image',
      left: Math.round(img.left || 0),
      top: Math.round(img.top || 0),
      width: Math.round((img.width || 200) * scaleX),
      height: Math.round((img.height || 200) * scaleY),
      angle: Math.round(img.angle || 0),
      scaleX: 1, // 始终重置为1，将缩放应用到实际尺寸
      scaleY: 1, // 始终重置为1，将缩放应用到实际尺寸
      visible: img.visible !== false,
      locked: !img.selectable,
      src: img.getSrc() || '',
      opacity: img.opacity || 1,
      cropX: Math.round(img.cropX || 0),
      cropY: Math.round(img.cropY || 0),
      borderRadius: Math.round(0), // 需要从clipPath中获取
    }
  },

  getToolbarControls: (props): ToolbarControl[] => [
    {
      key: 'src',
      label: '选择图片',
      type: 'text',
      value: props.src,
      options: { placeholder: '点击选择图片文件' },
    },
    {
      key: 'width',
      label: '宽度',
      type: 'number',
      value: props.width,
      options: { min: 10, max: 2000, step: 1 },
    },
    {
      key: 'height',
      label: '高度',
      type: 'number',
      value: props.height,
      options: { min: 10, max: 2000, step: 1 },
    },
    {
      key: 'borderRadius',
      label: '圆角半径',
      type: 'number',
      value: props.borderRadius,
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
    if (fabricObject.type === 'group') {
      // 占位符组的情况
      const rect = (fabricObject as Group).getObjects()[0] as Rect
      rect.set({
        width: props.width,
        height: props.height,
      })

      const text = (fabricObject as Group).getObjects()[1] as Text
      text.set({
        left: props.width / 2,
        top: props.height / 2,
      })

      return
    }

    const img = fabricObject as Image
    img.set({
      scaleX: props.width / (img.width || 1),
      scaleY: props.height / (img.height || 1),
      opacity: props.opacity,
    })

    // 更新圆角
    if (props.borderRadius > 0) {
      img.clipPath = new Rect({
        width: props.width,
        height: props.height,
        rx: props.borderRadius,
        ry: props.borderRadius,
        originX: 'center',
        originY: 'center',
      })
    }
    else {
      img.clipPath = undefined
    }
  },
}

export default imageElement
