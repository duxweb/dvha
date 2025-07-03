import type { ElementConfig, ToolbarControl } from './types'
import { FabricImage } from 'fabric'


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
  },

  createFabricObject: (props): any => {
    return FabricImage.fromURL(props.src || '', {
      crossOrigin: 'anonymous',
    }).then((img) => {
      img.set({
        left: props.left,
        top: props.top,
        width: props.width,
        height: props.height,
        angle: props.angle,
        opacity: props.opacity,
        visible: props.visible,
        selectable: !props.locked,
        evented: !props.locked,
      })
      return img
    })
  },

  getPropsFromFabricObject: (obj) => {
    const img = obj as FabricImage
    const actualWidth = (img.width || 200) * (img.scaleX || 1)
    const actualHeight = (img.height || 200) * (img.scaleY || 1)
    return {
      type: 'image',
      left: Math.round(img.left || 0),
      top: Math.round(img.top || 0),
      width: Math.round(actualWidth),
      height: Math.round(actualHeight),
      angle: Math.round(img.angle || 0),
      scaleX: img.scaleX || 1,
      scaleY: img.scaleY || 1,
      visible: img.visible !== false,
      locked: !img.selectable,
      src: img.getSrc() || '',
      opacity: img.opacity || 1,
      cropX: 0,
      cropY: 0,
      borderRadius: 0,
    }
  },

  getToolbarControls: (props): ToolbarControl[] => [
    {
      key: 'src',
      label: '选择图片',
      type: 'image',
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
      key: 'opacity',
      label: '透明度',
      type: 'slider',
      value: props.opacity,
      options: { min: 0, max: 1, step: 0.01 },
    },
  ],

  onPropsChange: (props, fabricObject) => {
    const img = fabricObject as FabricImage

    if (props.src && props.src !== (img.getSrc() || '')) {
      img.setSrc(props.src, { crossOrigin: 'anonymous' })
      .then(() => {
        const imgWidth = img.getElement().width
        const imgHeight = img.getElement().height

        const canvas = img.canvas
        const canvasWidth = canvas?.width || 800
        const canvasHeight = canvas?.height || 600

        const scaleX = canvasWidth / imgWidth
        const scaleY = canvasHeight / imgHeight
        const scale = Math.min(scaleX, scaleY, 1)

        img.set({
          left: props.left,
          top: props.top,
          width: imgWidth,
          height: imgHeight,
          scaleX: scale,
          scaleY: scale,
          angle: props.angle,
          opacity: props.opacity,
          visible: props.visible,
          selectable: !props.locked,
          evented: !props.locked,
        })

        img.setCoords()
        img.canvas?.renderAll()

        img.canvas?.fire('object:modified', { target: img })
      })

      return
    }

    if (!props.src) {
      img.setSrc('').then(() => {
        img.set({
          width: 200,
          height: 200,
        })
        img.setCoords()
        img.canvas?.renderAll()

        img.canvas?.fire('object:modified', { target: img })
      })
      return
    }

    const currentWidth = img.width || 200
    const currentHeight = img.height || 200
    const newScaleX = props.width / currentWidth
    const newScaleY = props.height / currentHeight

    img.set({
      left: props.left,
      top: props.top,
      scaleX: newScaleX,
      scaleY: newScaleY,
      angle: props.angle,
      opacity: props.opacity,
      visible: props.visible,
      selectable: !props.locked,
      evented: !props.locked,
    })

    img.setCoords()
    img.canvas?.renderAll()

    img.canvas?.fire('object:modified', { target: img })

  },
}

export default imageElement
