import type { NodeProps } from '@vue-flow/core'
import type { PropType } from 'vue'
import type { FlowNodeData } from '../types'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import clsx from 'clsx'
import { NDropdown } from 'naive-ui'
import { defineComponent, inject } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { defaultNodes } from '../nodes'

// 基础节点卡片组件
export const FlowNodeCard = defineComponent({
  name: 'FlowNodeCard',
  props: {
    nodeProps: {
      type: Object as () => NodeProps<FlowNodeData>,
      required: true,
    },
    handlePosition: {
      type: Object as () => {
        source?: Position
        target?: Position
      },
      default: () => ({
        source: Position.Right,
        target: Position.Left,
      }),
    },
    showTargetHandle: {
      type: Boolean,
      default: true,
    },
    showSourceHandle: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
    onClick: {
      type: Function as PropType<((event: MouseEvent) => void) | undefined>,
      default: undefined,
    },
    onDoubleClick: {
      type: Function as PropType<((event: MouseEvent) => void) | undefined>,
      default: undefined,
    },
    // NodeToolbar相关配置
    showToolbar: {
      type: Boolean,
      default: true,
    },
    toolbarPosition: {
      type: String as () => 'top' | 'right' | 'bottom' | 'left',
      default: 'top',
    },
    toolbarOffset: {
      type: Number,
      default: 10,
    },
  },
  setup(props, { slots }) {
    const flowNodes = inject('flowNodes', {}) as Record<string, any>
    const { removeNodes, addNodes, findNode } = useVueFlow()
    const { t } = useI18n()

    const handleClick = (event: MouseEvent) => {
      if (props.onClick) {
        props.onClick(event)
      }
    }

    const handleDoubleClick = (event: MouseEvent) => {
      if (props.onDoubleClick) {
        props.onDoubleClick(event)
      }
    }

    // 处理节点操作
    const handleNodeAction = (key: string) => {
      const nodeId = props.nodeProps.id

      switch (key) {
        case 'delete': {
          removeNodes([nodeId])
          break
        }
        case 'copy': {
          const originalNode = findNode(nodeId)
          if (originalNode) {
            const duplicatedNode = {
              ...originalNode,
              id: `${nodeId}-copy-${Date.now()}`,
              position: {
                x: originalNode.position.x + 50,
                y: originalNode.position.y + 50,
              },
              data: {
                ...originalNode.data,
                label: `${originalNode.data.label} (copy)`,
              },
              selected: false,
            }
            addNodes([duplicatedNode])
          }
          break
        }
      }
    }

    return () => {
      const { data, selected, type } = props.nodeProps
      const allNodes = flowNodes || defaultNodes
      const nodesData = allNodes?.value || allNodes
      const nodeRegistry = nodesData[type || '']
      const nodeStyle = nodeRegistry?.meta?.style || {}

      return (
        <div
            class={clsx([
              'relative rounded-md border transition-all cursor-pointer min-w-60',
              'bg-default dark:bg-default/80  backdrop-blur shadow-lg shadow-gray-100 dark:shadow-gray-950/20 hover:shadow-md',
              selected ? 'border-primary' : 'border-primary-900/20',
            ])}
            onClick={handleClick}
            onDblclick={handleDoubleClick}
          >
            <div class="bg-linear-to-b from-primary/10 dark:from-transparent via-transparent to-transparent rounded-t p-4 flex items-center justify-between">
              <div class="flex gap-1.5 items-center">
                {data.icon && (
                  <div class={clsx([
                    'rounded flex-none p-1',
                    nodeStyle.iconBgClass || 'bg-primary',
                  ])}
                  >
                    <div class={clsx([
                      'size-3 text-white',
                      data.icon,
                    ])}
                    />
                  </div>
                )}
                <div class="text-sm truncate">{data.label}</div>
              </div>
              <NDropdown
                trigger="click"
                options={[
                  {
                    label: t('components.flowEditor.nodeCard.delete') || '',
                    key: 'delete',
                    icon: () => <div class="i-tabler:trash text-sm" />,
                  },
                  {
                    label: t('components.flowEditor.nodeCard.copy') || '',
                    key: 'copy',
                    icon: () => <div class="i-tabler:copy text-sm" />,
                  },
                ]}
                onSelect={handleNodeAction}
              >
                <div
                  class="hover:bg-black/5 p-1 rounded cursor-pointer transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  <div class="i-tabler:dots text-sm text-gray-500" />
                </div>
              </NDropdown>
            </div>

            <div class="p-4 pt-0 text-xs text-muted">
              {slots.default
                ? slots.default()
                : <div class="bg-elevated rounded p-2">{data.description}</div>}
            </div>

            {props.showTargetHandle && (
              <Handle
                type="target"
                position={props.handlePosition.target}
                connectable={true}
                class="!bg-primary !border-2 !border-white !size-2.5 !rounded-full"
              />
            )}

            {props.showSourceHandle && (
              <Handle
                type="source"
                position={props.handlePosition.source}
                connectable={true}
                class="!bg-primary !border-2 !border-white !size-2.5 !rounded-full"
              />
            )}
        </div>
      )
    }
  },
})
