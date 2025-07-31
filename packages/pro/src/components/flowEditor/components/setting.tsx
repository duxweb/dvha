import type { FlowNode, FlowNodeRegistry } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { MarkerType, useVueFlow } from '@vue-flow/core'
import clsx from 'clsx'
import { NButton, NRadio, NRadioGroup, NScrollbar, useMessage } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { useModal } from '../../../hooks'
import { DuxFormLayout, DuxFormItem } from '../../form'

// 标题组件
const SettingHeader = ({ 
  icon, 
  iconBgClass = 'bg-primary', 
  title, 
  description 
}: { 
  icon?: string
  iconBgClass?: string
  title: string
  description?: string
}) => (
  <div class="p-4 border-b border-default">
    <div class="flex gap-2 items-center">
      {icon && (
        <div class={clsx(['rounded p-2 flex-shrink-0', iconBgClass])}>
          <div class={clsx(['size-6 text-white', icon])} />
        </div>
      )}
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-medium">{title}</h3>
        {description && (
          <p class="text-sm text-muted mt-1">{description}</p>
        )}
      </div>                 
    </div>
  </div>
)

interface SettingProps {
  nodes: Record<string, FlowNodeRegistry>
  modelValue?: any
  onSave?: (data: any) => void
}

export const FlowSetting = defineComponent({
  name: 'FlowSetting',
  props: {
    nodes: {
      type: Object as () => Record<string, FlowNodeRegistry>,
      default: () => ({}),
    },
    modelValue: {
      type: Object,
      default: () => ({ nodes: [], edges: [] }),
    },
    onSave: {
      type: Function,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props: SettingProps, { emit, slots }) {
    const { t } = useI18n()
    const { getSelectedNodes, getSelectedEdges, updateNodeData, updateEdgeData, getNodes, getEdges, removeEdges } = useVueFlow()
    const message = useMessage()
    const modal = useModal()

    const selectedNode = computed(() => {
      const nodes = getSelectedNodes.value
      return nodes.length === 1 ? nodes[0] as FlowNode : null
    })

    const selectedEdge = computed(() => {
      const edges = getSelectedEdges.value
      return edges.length === 1 ? edges[0] : null
    })

    const selectedNodeRegistry = computed(() => {
      if (!selectedNode.value || !selectedNode.value.type)
        return null
      return props.nodes[selectedNode.value.type]
    })

    // 创建节点数据的响应式副本
    const nodeData = ref<any>({})
    const edgeData = ref<any>({})

    // 监听选中节点变化
    watch(selectedNode, (node) => {
      if (node) {
        nodeData.value = { ...node.data }
      }
      else {
        nodeData.value = {}
      }
    }, { immediate: true })

    // 监听选中边变化
    watch(selectedEdge, (edge) => {
      if (edge) {
        edgeData.value = { ...edge.data }
      }
      else {
        edgeData.value = {}
      }
    }, { immediate: true })

    // 监听数据变化并更新节点
    watch(nodeData, (data) => {
      if (selectedNode.value) {
        updateNodeData(selectedNode.value.id, data)
        // 强制触发重新渲染
        emit('update:modelValue', {
          nodes: getNodes.value,
          edges: getEdges.value,
        })
      }
    }, { deep: true, flush: 'post' })

    // 监听数据变化并更新边
    watch(edgeData, (data) => {
      if (selectedEdge.value) {
        updateEdgeData(selectedEdge.value.id, data)
        
        // 根据 Vue Flow 文档，直接修改边对象的样式属性
        const edge = selectedEdge.value
        if (edge && data.type) {
          const colorMap = {
            success: { stroke: '#10b981', markerColor: '#10b981' }, // 通过 - 绿色
            error: { stroke: '#ef4444', markerColor: '#ef4444' },   // 退回 - 红色
          }
          const colors = colorMap[data.type] || colorMap.success
          
          // 直接修改边的样式属性
          const existingStyle = edge.style || {}
          edge.style = Object.assign({}, existingStyle, {
            stroke: colors.stroke,
            strokeWidth: 2,
          })
          
          const existingMarker = edge.markerEnd || {}
          edge.markerEnd = Object.assign({}, existingMarker, {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
            color: colors.markerColor,
          })
        }
      }
    }, { deep: true })

    // 清空流程
    const clearFlow = () => {
      emit('update:modelValue', { nodes: [], edges: [] })
      message.success(t('components.flowEditor.flowCleared') || '')
    }

    // 保存流程 - 调用回调
    const saveFlow = () => {
      const flowData = {
        nodes: getNodes.value,
        edges: getEdges.value,
      }

      if (props.onSave) {
        props.onSave(flowData)
      }
      else {
        message.success(t('components.flowEditor.flowSaved') || '')
      }
    }

    // 编辑JSON - 显示弹窗
    const editJSON = () => {
      const flowData = {
        nodes: getNodes.value,
        edges: getEdges.value,
      }

      modal.show({
        title: t('components.flowEditor.editFlowJSON') || '',
        width: '600px',
        component: () => import('./jsonEditor'),
        componentProps: {
          data: flowData,
          onConfirm: (data: any) => {
            emit('update:modelValue', data)
          },
        },
      })
    }

    // 删除连接线
    const deleteEdge = () => {
      if (selectedEdge.value) {
        removeEdges([selectedEdge.value.id])
        message.success(t('components.flowEditor.edgeDeleted') || '')
      }
    }

    return () => (
      <div class="w-300px h-full flex flex-col">
        {/* 标题区域 - 不参与滚动 */}
        {!selectedNode.value && !selectedEdge.value && (
          <SettingHeader
            icon="i-tabler:settings"
            iconBgClass="bg-gray-500"
            title={t('components.flowEditor.properties') || ''}
            description={t('components.flowEditor.selectNodeOrEdge') || ''}
          />
        )}
        
        {/* 节点标题 - 不参与滚动 */}
        {selectedNode.value && (
          <SettingHeader
            icon={selectedNodeRegistry.value?.meta.icon}
            iconBgClass={selectedNodeRegistry.value?.meta.style?.iconBgClass || 'bg-primary'}
            title={selectedNodeRegistry.value?.meta.label || 'Node'}
            description={selectedNodeRegistry.value?.meta.description}
          />
        )}
        
        {/* 边标题 - 不参与滚动 */}
        {selectedEdge.value && (
          <SettingHeader
            icon="i-tabler:arrow-right"
            iconBgClass="bg-blue-500"
            title={t('components.flowEditor.edgeSettings') || ''}
            description={t('components.flowEditor.edgeDescription') || ''}
          />
        )}

        <NScrollbar class='flex-1 min-h-0'>
            <div class="p-4 space-y-4">
              {/* 全局操作 - 只在没有选择元素时显示 */}
              {!selectedNode.value && !selectedEdge.value && (
                <div class="space-y-4">
                  {/* 全局设置插槽 */}
                  {slots.globalSettings?.()}
                  
                  <div class="flex flex-col gap-2">
                    <NButton onClick={editJSON} type="default" block secondary>
                    {{
                      icon: () => <div class="i-tabler:code" />,
                      default: () => t('components.flowEditor.editJSON') || '',
                    }}
                  </NButton>
                  <NButton onClick={saveFlow} type="primary" block secondary>
                    {{
                      icon: () => <div class="i-tabler:device-floppy" />,
                      default: () => t('components.flowEditor.saveFlow') || '',
                    }}
                  </NButton>
                  <NButton onClick={clearFlow} type="warning" block secondary>
                    {{
                      icon: () => <div class="i-tabler:trash" />,
                      default: () => t('components.flowEditor.clearFlow') || '',
                    }}
                  </NButton>
                  </div>
                </div>
              )}

              {/* 节点配置 */}
              {selectedNode.value && selectedNodeRegistry.value?.settingComponent && (
                <selectedNodeRegistry.value.settingComponent
                  {...{
                    'modelValue': nodeData.value,
                    'onUpdate:modelValue': (v: any) => nodeData.value = v,
                    'nodeId': selectedNode.value.id,
                    'nodeRegistries': props.nodes,
                  }}
                />
              )}

              {/* 边配置 */}
              {selectedEdge.value && (
                <DuxFormLayout labelPlacement="top">

                  <DuxFormItem label={t('components.flowEditor.connectionType') || ''}>
                    <NRadioGroup
                      value={edgeData.value.type || 'success'}
                      onUpdateValue={(value: string) => {
                        edgeData.value = { ...edgeData.value, type: value }
                      }}
                    >
                      <div class="space-y-2">
                        <NRadio value="success">
                          <div class="flex items-center gap-2">
                            <span>{t('components.flowEditor.pass') || ''}</span>
                          </div>
                        </NRadio>
                        <NRadio value="error">
                          <div class="flex items-center gap-2">
                            <span>{t('components.flowEditor.reject') || ''}</span>
                          </div>
                        </NRadio>
                      </div>
                    </NRadioGroup>
                  </DuxFormItem>

                  <DuxFormItem>
                    <NButton onClick={deleteEdge} type="error" block>
                      {{
                        icon: () => <div class="i-tabler:trash" />,
                        default: () => t('components.flowEditor.deleteEdge') || '',
                      }}
                    </NButton>
                  </DuxFormItem>
                </DuxFormLayout>
              )}

            </div>
          </NScrollbar>
      </div>
    )
  },
})
