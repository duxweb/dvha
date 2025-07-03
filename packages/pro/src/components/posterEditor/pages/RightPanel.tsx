import type { PropType } from 'vue'
import type { ElementData, ToolbarControl } from '../elements/types'
import { NButton, NColorPicker, NInputNumber, NTooltip } from 'naive-ui'
import { defineComponent } from 'vue'
import { DuxImageUpload } from '../../upload'
import { Panel } from './Panel'
import { PanelItem } from './PanelItem'

export interface RightPanelProps {
  // 选中元素相关
  hasMultipleSelection: boolean
  selectedElementsCount: number
  currentElementData?: ElementData
  currentElementConfig?: any
  canMoveUp: boolean
  canMoveDown: boolean
  canMoveToFront: boolean
  canMoveToBack: boolean

  // 画布设置相关
  canvasWidth: number
  canvasHeight: number
  canvasBackgroundColor: string
  canvasBackgroundImage?: string

  // 事件处理
  onDeleteSelectedElements: () => void
  onAlignElements: (type: string) => void
  onUpdateElementProperty: (id: string, key: string, value: any) => void
  onUpdateCanvasSize: (width: number, height: number) => void
  onUpdateCanvasBackground: (color: string) => void
  onUpdateCanvasBackgroundImage: (imageUrl: string) => void
  onSaveData: () => void
  onExportJson: () => void
  onRenderToolbarControl: (control: ToolbarControl) => any

  onClearCanvas: () => void

  canvasScale: number
}

export const RightPanel = defineComponent({
  name: 'RightPanel',
  props: {
    hasMultipleSelection: {
      type: Boolean,
      required: true,
    },
    selectedElementsCount: {
      type: Number,
      required: true,
    },
    currentElementData: {
      type: Object as PropType<ElementData>,
    },
    currentElementConfig: {
      type: Object,
    },
    canMoveUp: {
      type: Boolean,
      required: true,
    },
    canMoveDown: {
      type: Boolean,
      required: true,
    },
    canMoveToFront: {
      type: Boolean,
      required: true,
    },
    canMoveToBack: {
      type: Boolean,
      required: true,
    },
    canvasWidth: {
      type: Number,
      required: true,
    },
    canvasHeight: {
      type: Number,
      required: true,
    },
    canvasBackgroundColor: {
      type: String,
      required: true,
    },
    canvasBackgroundImage: {
      type: String,
    },
    onDeleteSelectedElements: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onAlignElements: {
      type: Function as PropType<(type: string) => void>,
      required: true,
    },
    onUpdateElementProperty: {
      type: Function as PropType<(id: string, key: string, value: any) => void>,
      required: true,
    },
    onUpdateCanvasSize: {
      type: Function as PropType<(width: number, height: number) => void>,
      required: true,
    },
    onUpdateCanvasBackground: {
      type: Function as PropType<(color: string) => void>,
      required: true,
    },
    onUpdateCanvasBackgroundImage: {
      type: Function as PropType<(imageUrl: string) => void>,
      required: true,
    },
    onSaveData: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onExportJson: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onRenderToolbarControl: {
      type: Function as PropType<(control: ToolbarControl) => any>,
      required: true,
    },

    onClearCanvas: {
      type: Function as PropType<() => void>,
      required: true,
    },

    canvasScale: {
      type: Number,
      required: true,
    },

  },
  setup(props) {
    // 渲染元素属性
    const renderElementProperties = () => {
      // 多选工具栏
      if (props.hasMultipleSelection) {
        return (

          <Panel title="多选操作">
            {{
              default: () => (
                <>
                  <PanelItem title="对齐">
                    <div class="grid grid-cols-4 gap-2">
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('left')} renderIcon={() => <div class="i-tabler:layout-align-left"></div>}></NButton>,
                          default: () => '左对齐',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('right')} renderIcon={() => <div class="i-tabler:layout-align-right"></div>}></NButton>,
                          default: () => '右对齐',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('top')} renderIcon={() => <div class="i-tabler:layout-align-top"></div>}></NButton>,
                          default: () => '顶部对齐',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('bottom')} renderIcon={() => <div class="i-tabler:layout-align-bottom"></div>}></NButton>,
                          default: () => '底部对齐',
                        }}
                      </NTooltip>
                    </div>
                  </PanelItem>
                  <PanelItem title="居中">
                    <div class="grid grid-cols-4 gap-2">
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('center-horizontal')} renderIcon={() => <div class="i-tabler:layout-align-center"></div>}></NButton>,
                          default: () => '水平居中',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('center-vertical')} renderIcon={() => <div class="i-tabler:layout-align-middle"></div>}></NButton>,
                          default: () => '垂直居中',
                        }}
                      </NTooltip>

                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('distribute-horizontal')} renderIcon={() => <div class="i-tabler:layout-distribute-horizontal"></div>}></NButton>,
                          default: () => '水平分布',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('distribute-vertical')} renderIcon={() => <div class="i-tabler:layout-distribute-vertical"></div>}></NButton>,
                          default: () => '垂直分布',
                        }}
                      </NTooltip>
                    </div>
                  </PanelItem>
                </>
              ),
              footer: () => (
                <>
                  <NButton
                    block
                    onClick={props.onDeleteSelectedElements}
                    type="error"
                  >
                    {{
                      icon: () => <div class="i-tabler:trash" />,
                      default: () => '删除',
                    }}
                  </NButton>
                </>
              ),
            }}
          </Panel>
        )
      }
      // 单选工具栏
      else if (props.currentElementData && props.currentElementConfig) {
        const controls = props.currentElementConfig.getToolbarControls(props.currentElementData)

        return (
          <Panel title="元素设置">
            {{
              default: () => (
                <>

                  {controls.map((control: ToolbarControl) => (
                    <PanelItem key={control.key} title={control.label}>
                      {props.onRenderToolbarControl(control)}
                    </PanelItem>
                  ))}

                  <PanelItem title="X">
                    <NInputNumber
                      value={props.currentElementData?.left}

                      onUpdate:value={(val: number | null) =>
                        props.onUpdateElementProperty(props.currentElementData!.id, 'left', val || 0)}
                    />
                  </PanelItem>

                  <PanelItem title="Y">
                    <NInputNumber
                      value={props.currentElementData?.top}

                      onUpdate:value={(val: number | null) =>
                        props.onUpdateElementProperty(props.currentElementData!.id, 'top', val || 0)}
                    />
                  </PanelItem>

                  <PanelItem title="角度">
                    <NInputNumber
                      value={props.currentElementData?.angle}

                      min={-180}
                      max={180}
                      onUpdate:value={(val: number | null) =>
                        props.onUpdateElementProperty(props.currentElementData!.id, 'angle', val || 0)}
                    />
                  </PanelItem>

                  <PanelItem title="对齐">
                    <div class="grid grid-cols-3 gap-2">
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('center-horizontal')} renderIcon={() => <div class="i-tabler:layout-align-center"></div>}></NButton>,
                          default: () => '水平居中',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('center-vertical')} renderIcon={() => <div class="i-tabler:layout-align-middle"></div>}></NButton>,
                          default: () => '垂直居中',
                        }}
                      </NTooltip>
                      <NTooltip>
                        {{
                          trigger: () => <NButton onClick={() => props.onAlignElements('center-both')} renderIcon={() => <div class="i-tabler:layout-distribute-horizontal"></div>}></NButton>,
                          default: () => '居中',
                        }}
                      </NTooltip>
                    </div>
                  </PanelItem>

                  <PanelItem title="层级">

                    <div class="grid grid-cols-4 gap-2">

                      <NTooltip>
                        {{
                          trigger: () => <NButton disabled={!props.canMoveUp} onClick={() => props.onAlignElements('move-up')} renderIcon={() => <div class="i-tabler:arrow-narrow-up"></div>}></NButton>,
                          default: () => '上移一层',
                        }}
                      </NTooltip>

                      <NTooltip>
                        {{
                          trigger: () => <NButton disabled={!props.canMoveDown} onClick={() => props.onAlignElements('move-down')} renderIcon={() => <div class="i-tabler:arrow-narrow-down"></div>}></NButton>,
                          default: () => '下移一层',
                        }}
                      </NTooltip>

                      <NTooltip>
                        {{
                          trigger: () => <NButton disabled={!props.canMoveToFront} onClick={() => props.onAlignElements('move-to-front')} renderIcon={() => <div class="i-tabler:arrow-bar-to-up"></div>}></NButton>,
                          default: () => '移到最前',
                        }}
                      </NTooltip>

                      <NTooltip>
                        {{
                          trigger: () => <NButton disabled={!props.canMoveToBack} onClick={() => props.onAlignElements('move-to-back')} renderIcon={() => <div class="i-tabler:arrow-bar-to-down"></div>}></NButton>,
                          default: () => '移到最后',
                        }}
                      </NTooltip>
                    </div>
                  </PanelItem>

                </>
              ),

              footer: () => (
                <>
                  <NButton
                    block
                    onClick={props.onDeleteSelectedElements}
                    type="error"
                  >
                    {{
                      icon: () => <div class="i-tabler:trash" />,
                      default: () => '删除',
                    }}
                  </NButton>
                </>
              ),

            }}
          </Panel>
        )
      }
      // 未选中状态 - 显示画布设置
      else {
        return (
          <Panel title="画布设置">

            {{
              default: () => (
                <>
                  <PanelItem title="宽度">
                    <NInputNumber
                      value={props.canvasWidth}

                      min={100}
                      max={2000}
                      onUpdate:value={(val: number | null) =>
                        props.onUpdateCanvasSize(val || 800, props.canvasHeight)}
                    />
                  </PanelItem>

                  <PanelItem title="高度">
                    <NInputNumber
                      value={props.canvasHeight}

                      min={100}
                      max={2000}
                      onUpdate:value={(val: number | null) =>
                        props.onUpdateCanvasSize(props.canvasWidth, val || 600)}
                    />
                  </PanelItem>

                  <PanelItem title="背景颜色">
                    <NColorPicker
                      value={props.canvasBackgroundColor}

                      onUpdate:value={(val: string) =>
                        props.onUpdateCanvasBackground(val)}
                    />
                  </PanelItem>

                  <PanelItem title="背景图片">
                    <DuxImageUpload
                      value={props.canvasBackgroundImage || ''}
                      onUpdateValue={(val?: string | string[]) =>
                        props.onUpdateCanvasBackgroundImage(typeof val === 'string' ? val : (Array.isArray(val) ? val[0] || '' : ''))}
                    />
                  </PanelItem>
                </>
              ),
              footer: () => (
                <>
                  <NButton
                    type="primary"

                    block
                    onClick={props.onSaveData}
                  >
                    保存
                  </NButton>
                  <NButton

                    block
                    onClick={props.onExportJson}
                  >
                    导出 JSON
                  </NButton>

                  <NButton

                    block
                    onClick={props.onClearCanvas}
                  >
                    清空画布
                  </NButton>
                </>
              ),
            }}

          </Panel>
        )
      }
    }

    return () => (
      <div class="w-60 bg-default border-l border-default">
        {renderElementProperties()}
      </div>
    )
  },
})
