import type { PropType } from 'vue'
import type { FlowData, FlowEditorConfig, FlowNodeCategory, FlowNodeRegistry } from './types'
import { useTheme, useI18n } from '@duxweb/dvha-core'
import { Background } from '@vue-flow/background'
import { ConnectionMode, MarkerType, useVueFlow, VueFlow } from '@vue-flow/core'
import { NButton } from 'naive-ui'
import { computed, defineComponent, provide, ref, watch } from 'vue'
import { FlowSetting, FlowToolbar } from './components'
import { defaultNodes } from './nodes'
import './style.css'

export const DuxFlowEditor = defineComponent({
  name: 'DuxFlowEditor',
  props: {
    modelValue: {
      type: Object as PropType<FlowData>,
      default: () => ({
        nodes: [],
        edges: [],
      }),
    },
    // 自定义节点
    customNodes: {
      type: Object as PropType<Record<string, FlowNodeRegistry>>,
      default: () => ({}),
    },
    // 节点分类
    categories: {
      type: Array as PropType<FlowNodeCategory[]>,
      default: () => [],
    },
    // 编辑器配置
    config: {
      type: Object as PropType<FlowEditorConfig>,
      default: () => ({
        readonly: false,
        showGrid: true,
        showControls: true,
      }),
    },
    // 保存回调
    onSave: {
      type: Function,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    const flowContainer = ref<HTMLElement>()
    const { isDark } = useTheme()
    const { t } = useI18n()
    const {
      project,
      vueFlowRef,
      getNodes,
      getEdges,
      setNodes,
      setEdges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      addNodes,
      addEdges,
      fitView,
      zoomIn,
      zoomOut,
    } = useVueFlow()

    // 合并节点注册表
    const allNodes = computed(() => ({
      ...defaultNodes,
      ...props.customNodes,
    }))

    // Vue Flow 节点类型映射
    const nodeTypes = computed(() => {
      const types: Record<string, any> = {}
      Object.entries(allNodes.value).forEach(([key, registry]) => {
        types[key] = registry.component
      })
      return types
    })

    // 跟踪是否是内部更新，避免循环更新
    const isInternalUpdate = ref(false)
    
    // 全局设置状态
    const globalSettings = ref<Record<string, any>>(props.modelValue?.globalSettings || {})

    // 使用 Vue Flow 的内部事件监听器而不是通过 props
    onNodesChange((changes) => {
      if (!Array.isArray(changes) || changes.length === 0)
        return

      isInternalUpdate.value = true
      emit('update:modelValue', {
        nodes: getNodes.value,
        edges: getEdges.value,
        globalSettings: globalSettings.value,
      })
    })

    onEdgesChange((changes) => {
      if (!Array.isArray(changes) || changes.length === 0)
        return

      isInternalUpdate.value = true
      emit('update:modelValue', {
        nodes: getNodes.value,
        edges: getEdges.value,
        globalSettings: globalSettings.value,
      })
    })

    onConnect((connection) => {
      if (!connection)
        return

      // 创建新的边对象
      const newEdge = {
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        data: { type: 'success' },
        type: 'default', // 使用默认贝塞尔曲线
      }

      // 应用样式并添加边
      const styledEdge = getEdgeStyle(newEdge)
      addEdges([styledEdge])

      isInternalUpdate.value = true
      emit('update:modelValue', {
        nodes: getNodes.value,
        edges: getEdges.value,
        globalSettings: globalSettings.value,
      })
    })

    // 边样式映射
    const getEdgeStyle = (edge: any) => {
      const type = edge.data?.type || 'success'
      const colorMap = {
        success: { stroke: '#10b981', markerColor: '#10b981' }, // 绿色 - 通过
        error: { stroke: '#ef4444', markerColor: '#ef4444' }, // 红色 - 退回
      }

      const colors = colorMap[type] || colorMap.success

      return {
        ...edge,
        style: {
          stroke: colors.stroke,
          strokeWidth: 2,
          ...edge.style,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: colors.markerColor,
          ...edge.markerEnd,
        },
      }
    }

    // 初始化数据 - 监听外部数据变化并同步到 Vue Flow
    watch(() => props.modelValue, (data) => {
      if (isInternalUpdate.value) {
        isInternalUpdate.value = false
        return
      }

      // 同步节点数据
      if (data.nodes && Array.isArray(data.nodes)) {
        setNodes([...data.nodes])
      }

      // 同步边数据并应用样式
      if (data.edges && Array.isArray(data.edges)) {
        const styledEdges = data.edges.map(getEdgeStyle)
        setEdges(styledEdges)
      }
      
      // 同步全局设置数据
      if (data.globalSettings) {
        globalSettings.value = { ...data.globalSettings }
      }

      if ((data.nodes && data.nodes.length > 0) || (data.edges && data.edges.length > 0)) {
        // 延迟执行以确保DOM已准备好
        setTimeout(() => {
          fitView()
        }, 100)
      }
    }, { immediate: true, deep: true })

    // 拖放状态
    const isOverDropZone = ref(false)

    // 连接验证函数
    const isValidConnection = (connection: any) => {
      // 允许所有连接，但不允许自连接
      return connection.source !== connection.target
    }

    // 处理拖放
    const handleDrop = (event: DragEvent) => {
      event.preventDefault()
      isOverDropZone.value = false

      const nodeDataStr = event.dataTransfer?.getData('application/vueflow')
      if (!nodeDataStr)
        return

      const nodeData = JSON.parse(nodeDataStr)
      const position = project({
        x: event.clientX - (vueFlowRef.value?.getBoundingClientRect().left || 0),
        y: event.clientY - (vueFlowRef.value?.getBoundingClientRect().top || 0),
      })

      const newNode = {
        ...nodeData,
        position,
      }

      addNodes([newNode])
    }

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault()
      isOverDropZone.value = true
    }

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault()
      isOverDropZone.value = false
    }

    // 提供节点注册表给子组件
    provide('flowNodes', allNodes)

    return () => (
      <div class="h-full w-full relative bg-muted rounded-md">
        {/* 背景画布 - 占满整个编辑器 */}
        <div
          ref={flowContainer}
          class="absolute inset-0 w-full h-full"
          onDrop={handleDrop}
          onDragover={handleDragOver}
          onDragleave={handleDragLeave}
        >
          <VueFlow
            class="w-full h-full"
            nodeTypes={nodeTypes.value}
            fitViewOnInit={true}
            defaultEdgeOptions={{
              type: 'default',
              style: {
                strokeWidth: 2,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 12,
                height: 12,
              },
            }}
            nodesDraggable={!props.config.readonly}
            nodesConnectable={!props.config.readonly}
            elementsSelectable={!props.config.readonly}
            connectionMode={ConnectionMode.Loose}
            isValidConnection={isValidConnection}
            minZoom={0.1}
            maxZoom={1}
          >
            {/* 背景网格 */}
            {props.config.showGrid && (
              <Background
                variant="dots"
                gap={20}
                size={1.5}
                patternColor={isDark.value ? 'rgba(255,255,255, 0.2)' : 'rgba(0,0,0, 0.2)'}
              />
            )}

            {/* 缩放控制按钮 - 底部居中 */}
            {props.config.showControls && (
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                <NButton
                  onClick={() => zoomOut()}
                  size="small"
                  class="!size-8"
                  secondary
                >
                  {{
                    icon: () => <div class="i-tabler:minus size-4" />,
                  }}
                </NButton>
                <NButton
                  onClick={() => fitView()}
                  size="small"
                  class="!size-8"
                  secondary
                >
                  {{
                    icon: () => <div class="i-tabler:focus-2 size-4" />,
                  }}
                </NButton>
                <NButton
                  onClick={() => zoomIn()}
                  size="small"
                  class="!size-8"
                  secondary
                >
                  {{
                    icon: () => <div class="i-tabler:plus size-4" />,
                  }}
                </NButton>
              </div>
            )}

            {/* 自定义工具栏插槽 */}
            {slots.toolbar && (
              <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                {slots.toolbar()}
              </div>
            )}
          </VueFlow>

          {/* 拖放提示 */}
          {isOverDropZone.value && (
            <div class="absolute inset-0 bg-blue-50/80 border-2 border-dashed border-blue-400 pointer-events-none flex items-center justify-center z-10">
              <div class="bg-white px-6 py-3 rounded-lg shadow-xl border border-blue-200">
                <div class="flex items-center gap-2 text-blue-600">
                  <div class="i-tabler:plus" />
                  <span class="font-medium">{t('components.flowEditor.toolbar.releaseToAdd') || ''}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div class="absolute top-4 left-4 z-1 bottom-4">
          <div class="h-full bg-default shadow rounded">
            <FlowToolbar
              nodes={allNodes.value}
              categories={props.categories}
            />
          </div>
        </div>

        <div class="absolute top-4 right-4 bottom-4 z-1">
          <div class="h-full bg-default shadow rounded">
            <FlowSetting
              nodes={allNodes.value}
              modelValue={props.modelValue}
              onUpdate:modelValue={(value: any) => emit('update:modelValue', value)}
              onSave={props.onSave}
            >
              {{
                globalSettings: slots.globalSettings ? () => slots.globalSettings?.({
                  globalSettings: globalSettings.value,
                  updateGlobalSettings: (newSettings: Record<string, any>) => {
                    globalSettings.value = { ...newSettings }
                    // 立即触发更新
                    emit('update:modelValue', {
                      nodes: getNodes.value,
                      edges: getEdges.value,
                      globalSettings: globalSettings.value,
                    })
                  }
                }) : undefined
              }}
            </FlowSetting>
          </div>
        </div>
      </div>
    )
  },
})
