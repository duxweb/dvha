import type { ElementConfig, ToolbarControl } from './types'
import { Textbox } from 'fabric'

const textElement: ElementConfig = {
  type: 'text',
  name: '文本',
  icon: 'i-tabler:typography',
  category: 'basic',

  defaultProps: {
    id: '',
    type: 'text',
    left: 100,
    top: 100,
    width: 200,
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    visible: true,
    locked: false,
    text: '双击编辑文本',
    fontSize: 20,
    fontFamily: 'Arial',
    fill: '#000000',
    textAlign: 'left',
    fontWeight: 'normal',
    fontStyle: 'normal',
    underline: false,
    linethrough: false,
  },

  createFabricObject: (props) => {
    const textbox = new Textbox(props.text, {
      left: props.left,
      top: props.top,
      originX: 'left',
      originY: 'top',
      width: props.width,
      angle: props.angle,
      scaleX: props.scaleX,
      scaleY: props.scaleY,
      visible: props.visible,
      selectable: !props.locked,
      evented: !props.locked,
      fontSize: props.fontSize,
      fontFamily: props.fontFamily,
      fill: props.fill,
      textAlign: props.textAlign as any,
      fontWeight: props.fontWeight as any,
      fontStyle: props.fontStyle as any,
      underline: props.underline,
      linethrough: props.linethrough,
      // 启用自动换行的关键配置
      splitByGrapheme: true,
      // 锁定高度缩放，只允许宽度缩放
      lockScalingY: true,
      // 禁用高度手柄
      setControlsVisibility: {
        mt: false, // 顶部中间
        mb: false, // 底部中间
      },
    })

    // 记录开始缩放时的字体大小
    let scaleStartFontSize = props.fontSize

    // 添加鼠标按下事件监听，记录开始缩放时的字体大小
    textbox.on('mousedown', () => {
      scaleStartFontSize = textbox.fontSize || 20
    })

    // 添加缩放事件监听
    textbox.on('scaling', () => {
      // 计算新的字体大小，使用X轴缩放比例（因为锁定了Y轴缩放）
      const scale = textbox.scaleX || 1
      const newFontSize = Math.round(scaleStartFontSize * scale)

      // 限制字体大小范围
      const fontSize = Math.max(8, Math.min(200, newFontSize))

      // 更新字体大小并重置缩放
      textbox.set({
        fontSize,
        scaleX: 1,
        scaleY: 1,
      })

      // 强制重新渲染
      textbox.canvas?.requestRenderAll()
    })

    // 添加双击编辑事件
    textbox.on('mousedblclick', () => {
      textbox.enterEditing()
      textbox.selectAll()
    })

    return textbox
  },

  getPropsFromFabricObject: (obj) => {
    const textbox = obj as Textbox
    return {
      left: Math.round(textbox.left || 0),
      top: Math.round(textbox.top || 0),
      width: Math.round(textbox.width || 0),
      angle: Math.round(textbox.angle || 0),
      scaleX: textbox.scaleX || 1,
      scaleY: textbox.scaleY || 1,
      visible: textbox.visible !== false,
      locked: !textbox.selectable,
      text: textbox.text || '',
      fontSize: Math.round(textbox.fontSize || 20),
      fontFamily: textbox.fontFamily || 'Arial',
      fill: textbox.fill as string,
      textAlign: textbox.textAlign || 'left',
      fontWeight: textbox.fontWeight || 'normal',
      fontStyle: textbox.fontStyle || 'normal',
      underline: textbox.underline || false,
      linethrough: textbox.linethrough || false,
    }
  },

  onPropsChange: (props, fabricObject) => {
    const textbox = fabricObject as Textbox

    // 更新基础属性
    textbox.set({
      left: props.left,
      top: props.top,
      width: props.width,
      angle: props.angle,
      visible: props.visible,
      selectable: !props.locked,
      evented: !props.locked,
      text: props.text,
      fontSize: props.fontSize,
      fontFamily: props.fontFamily,
      fill: props.fill,
      textAlign: props.textAlign,
      fontWeight: props.fontWeight,
      fontStyle: props.fontStyle,
      underline: props.underline,
      linethrough: props.linethrough,
    })
  },

  getToolbarControls: (props): ToolbarControl[] => {
    return [
      {
        key: 'text',
        label: '文本内容',
        type: 'text',
        value: props.text,
      },
      {
        key: 'fontSize',
        label: '字体大小',
        type: 'number',
        value: props.fontSize,
        options: {
          min: 8,
          max: 200,
          step: 1,
        },
      },
      {
        key: 'fontFamily',
        label: '字体',
        type: 'select',
        value: props.fontFamily,
        options: {
          choices: [
            { label: 'Arial', value: 'Arial' },
            { label: '微软雅黑', value: 'Microsoft YaHei' },
            { label: '宋体', value: 'SimSun' },
            { label: '黑体', value: 'SimHei' },
          ],
        },
      },
      {
        key: 'fill',
        label: '颜色',
        type: 'color',
        value: props.fill,
      },
      {
        key: 'textAlign',
        label: '对齐',
        type: 'select',
        value: props.textAlign,
        options: {
          choices: [
            { label: '左对齐', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右对齐', value: 'right' },
          ],
        },
      },
      {
        key: 'fontWeight',
        label: '粗体',
        type: 'select',
        value: props.fontWeight,
        options: {
          choices: [
            { label: '正常', value: 'normal' },
            { label: '粗体', value: 'bold' },
          ],
        },
      },
      {
        key: 'fontStyle',
        label: '斜体',
        type: 'select',
        value: props.fontStyle,
        options: {
          choices: [
            { label: '正常', value: 'normal' },
            { label: '斜体', value: 'italic' },
          ],
        },
      },
      {
        key: 'underline',
        label: '下划线',
        type: 'switch',
        value: props.underline,
      },
      {
        key: 'linethrough',
        label: '删除线',
        type: 'switch',
        value: props.linethrough,
      },
    ]
  },
}

export default textElement
