import type { PropType } from 'vue'
import type { ToolbarControl } from './elements/types'
import { NColorPicker, NInput, NInputNumber, NSelect, NSlider, NSwitch } from 'naive-ui'
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { DuxCard } from '../card'
import { DuxImageUpload } from '../upload'
import { CanvasRuler } from './components/CanvasRuler'
import { usePosterEditor } from './hooks/usePosterEditor'
import { LeftToolbar, RightPanel } from './pages'

export interface PosterEditorProps {
  data?: string
  width?: number
  height?: number
  backgroundColor?: string
  backgroundImage?: string
}


export const DuxPosterEditor = defineComponent({
  name: 'DuxPosterEditor',
  props: {
    data: {
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
    backgroundImage: {
      type: String as PropType<string>,
      default: '',
    },
    onDataUpdate: Function as PropType<(data?: string) => void>,
    onSave: Function as PropType<(data?: string) => void>,
  },
  setup(props) {
    const canvasElement = ref<HTMLCanvasElement>()
    const containerElement = ref<HTMLElement>()

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
      currentElementData,
      currentElementConfig,
      hasMultipleSelection,
      updateCanvasSettings,
      updateCanvasBackground,
      updateCanvasBackgroundImage,
      saveData,
      exportJson,
    } = usePosterEditor({
      width: props.width,
      height: props.height,
      backgroundColor: props.backgroundColor,
      backgroundImage: props.backgroundImage,
    })

    // 设置回调
    setCallbacks({
      onDataChange: props?.onDataUpdate,
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
        case 'image':
          return (
            <DuxImageUpload
              value={control.value}
              onUpdateValue={updateValue}
            />
          )
        default:
          return null
      }
    }

    watch(
      () => props.data,
      (newData) => {
        if (newData) {
          loadData(newData)
        }
      },
      { immediate: false }
    )

    onMounted(() => {
      if (canvasElement.value && containerElement.value) {
        initCanvas(canvasElement.value, containerElement.value)
        loadData(props.data)
      }
    })

    onUnmounted(() => {
      destroy()
    })

    return () => (
      <DuxCard class="h-full" shadow>
        <div class="h-full flex">
          <LeftToolbar
            onAddElement={addElement}
            canvasWidth={canvasData.value.width}
            canvasHeight={canvasData.value.height}
          />

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
            canvasBackgroundImage={canvasData.value.backgroundImage}
            onDeleteSelectedElements={deleteSelectedElements}
            onAlignElements={(type: string) => alignElements(type as any)}
            onUpdateElementProperty={updateElementProperty}
            onUpdateCanvasSize={(width: number, height: number) => updateCanvasSettings(width, height)}
            onUpdateCanvasBackground={updateCanvasBackground}
            onUpdateCanvasBackgroundImage={updateCanvasBackgroundImage}
            onSaveData={async () => {
              await saveData()
              await props?.onSave?.()
            }}
            onExportJson={exportJson}
            onRenderToolbarControl={renderToolbarControl}
            canvasScale={canvasScale.value}
          />
        </div>
      </DuxCard>
    )
  },
})
