import type { PropType } from 'vue'
import type { ToolbarControl } from './elements/types'
import { NColorPicker, NInput, NInputNumber, NSelect, NSlider, NSwitch } from 'naive-ui'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { CanvasRuler } from './components/CanvasRuler'
import { usePosterEditor } from './hooks/usePosterEditor'
import { LeftToolbar, RightPanel } from './pages'
import { DuxCard } from '../card'

// 组件 Props 接口
export interface PosterEditorProps {
  value?: string
  width?: number
  height?: number
  backgroundColor?: string
}

// 组件 Emits 接口
export interface PosterEditorEmits {
  'update:value': (value: string) => void
}

export const DuxPosterEditor = defineComponent({
  name: 'DuxPosterEditor',
  props: {
    value: {
      type: String as PropType<string>,
      default: '',
    },
    width: {
      type: Number as PropType<number>,
      default: 750,
    },
    height: {
      type: Number as PropType<number>,
      default: 1000,
    },
    backgroundColor: {
      type: String as PropType<string>,
      default: '#ffffff',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const canvasElement = ref<HTMLCanvasElement>()
    const containerElement = ref<HTMLElement>()

    // 使用海报编辑器Hook
    const {
      initCanvas,
      destroy,
      setCallbacks,
      addElement,
      deleteSelectedElements,
      updateElementProperty,
      alignElements,
      canMoveUp,
      canMoveDown,
      canMoveToFront,
      canMoveToBack,
      clearCanvas,
      loadData,
      canvasData,
      selectedElements,
      canvasScale,
      // currentElement,
      currentElementData,
      currentElementConfig,
      hasMultipleSelection,
      updateCanvasSettings,
      updateCanvasBackground,
      saveData,
      exportJson,
    } = usePosterEditor({
      width: props.width,
      height: props.height,
      backgroundColor: props.backgroundColor,
    })

    // 设置回调
    setCallbacks({
      onDataChange: (data: string) => emit('update:value', data),
    })

    // 渲染工具栏控件
    const renderToolbarControl = (control: ToolbarControl) => {
      const updateValue = (value: any) => {
        if (currentElementData.value) {
          updateElementProperty(currentElementData.value.id, control.key, value)
        }
      }

      switch (control.type) {
        case 'text':
          return (
            <NInput
              value={control.value}
              placeholder={control.options?.placeholder}
              onUpdate:value={updateValue}
            />
          )
        case 'number':
          return (
            <NInputNumber
              value={control.value}
              min={control.options?.min}
              max={control.options?.max}
              step={control.options?.step}
              onUpdate:value={updateValue}
            />
          )
        case 'color':
          return (
            <NColorPicker
              value={control.value}
              onUpdate:value={updateValue}
            />
          )
        case 'select':
          return (
            <NSelect
              value={control.value}
              options={control.options?.choices || []}
              onUpdate:value={updateValue}
            />
          )
        case 'switch':
          return (
            <NSwitch
              value={control.value}
              onUpdate:value={updateValue}
            />
          )
        case 'slider':
          return (
            <NSlider
              value={control.value}
              min={control.options?.min}
              max={control.options?.max}
              step={control.options?.step}
              onUpdate:value={updateValue}
            />
          )
        default:
          return null
      }
    }

    onMounted(() => {
      if (canvasElement.value && containerElement.value) {
        initCanvas(canvasElement.value, containerElement.value)

        // 加载初始数据
        if (props.value) {
          loadData(props.value)
        }
      }
    })

    onUnmounted(() => {
      destroy()
    })

    return () => (
      <DuxCard class='h-full' shadow>
        <div class="h-full flex">
        {/* 左侧工具栏 - 元素添加 */}
        <LeftToolbar
          onAddElement={addElement}
          canvasWidth={canvasData.value.width}
          canvasHeight={canvasData.value.height}
        />

        {/* 画布区域 */}
        <div
          ref={containerElement}
          class="flex-1 p-6  pl-12 pt-12 flex items-center justify-center overflow-hidden relative"
          style="background: linear-gradient(45deg, rgba(0,0,0, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0, 0.1) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0, 0.1) 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;"
        >
          <CanvasRuler
            canvasScale={canvasScale.value}
            canvasWidth={canvasData.value.width}
            canvasHeight={canvasData.value.height}
          />

          <div class="bg-default shadow-lg" style="position: relative;">
            <canvas ref={canvasElement} style="display: block;" />
          </div>
        </div>

        {/* 右侧属性面板 */}
        <RightPanel
          onClearCanvas={clearCanvas}
          hasMultipleSelection={hasMultipleSelection.value}
          selectedElementsCount={selectedElements.value.length}
          currentElementData={currentElementData.value || undefined}
          currentElementConfig={currentElementConfig.value || undefined}
          canMoveUp={canMoveUp.value}
          canMoveDown={canMoveDown.value}
          canMoveToFront={canMoveToFront.value}
          canMoveToBack={canMoveToBack.value}
          canvasWidth={canvasData.value.width}
          canvasHeight={canvasData.value.height}
          canvasBackgroundColor={canvasData.value.backgroundColor}
          onDeleteSelectedElements={deleteSelectedElements}
          onAlignElements={(type: string) => alignElements(type as any)}
          onUpdateElementProperty={updateElementProperty}
          onUpdateCanvasSize={(width: number, height: number) => updateCanvasSettings(width, height)}
          onUpdateCanvasBackground={updateCanvasBackground}
          onSaveData={saveData}
          onExportJson={exportJson}
          onRenderToolbarControl={renderToolbarControl}
          canvasScale={canvasScale.value}
        />
        </div>
      </DuxCard>
    )
  },
})
