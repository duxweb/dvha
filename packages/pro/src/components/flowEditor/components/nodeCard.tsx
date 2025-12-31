import type { NodeProps } from '@vue-flow/core'
import type { PropType } from 'vue'
import type { FlowNodeData } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import clsx from 'clsx'
import { NDropdown } from 'naive-ui'
import { defineComponent, inject } from 'vue'
import { defaultNodes } from '../nodes'

interface NodeColorClasses {
  border: string
  borderSelected: string
  headerFrom: string
  handle: string
  iconBg: string
}

const COLOR_CLASS_MAP: Record<string, NodeColorClasses> = {
  primary: {
    border: 'border-primary/50',
    borderSelected: 'border-primary',
    headerFrom: 'from-primary/10',
    handle: '!bg-primary',
    iconBg: 'bg-primary',
  },
  success: {
    border: 'border-emerald/50',
    borderSelected: 'border-emerald',
    headerFrom: 'from-emerald/10',
    handle: '!bg-emerald',
    iconBg: 'bg-emerald',
  },
  warning: {
    border: 'border-amber/50',
    borderSelected: 'border-amber',
    headerFrom: 'from-amber/15',
    handle: '!bg-amber',
    iconBg: 'bg-amber',
  },
  danger: {
    border: 'border-red/50',
    borderSelected: 'border-red',
    headerFrom: 'from-red/10',
    handle: '!bg-red',
    iconBg: 'bg-red',
  },
  info: {
    border: 'border-sky/50',
    borderSelected: 'border-sky',
    headerFrom: 'from-sky/10',
    handle: '!bg-sky',
    iconBg: 'bg-sky',
  },
  purple: {
    border: 'border-violet/50',
    borderSelected: 'border-violet',
    headerFrom: 'from-violet/15',
    handle: '!bg-violet',
    iconBg: 'bg-violet',
  },
}

const DEFAULT_COLOR_CLASSES: NodeColorClasses = COLOR_CLASS_MAP.primary

const getColorClasses = (key?: string) => (key && COLOR_CLASS_MAP[key]) || DEFAULT_COLOR_CLASSES

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
      const { data, type } = props.nodeProps
      const currentNode = findNode(props.nodeProps.id)
      const selected = currentNode?.selected ?? props.nodeProps.selected ?? false
      const allNodes = flowNodes || defaultNodes
      const nodesData = allNodes?.value || allNodes
      const nodeRegistry = nodesData[type || '']
      const nodeStyle = nodeRegistry?.meta?.style || {}
      const colorClasses = getColorClasses(nodeRegistry?.meta?.color || props.color)

      return (
        <div
          class={clsx([
            'relative rounded-md transition-all cursor-pointer min-w-60 border bg-default dark:bg-default/80 backdrop-blur shadow-lg shadow-gray-100 dark:shadow-gray-950/20 hover:shadow-md',
            selected ? colorClasses.borderSelected : colorClasses.border,
          ])}
          onClick={handleClick}
          onDblclick={handleDoubleClick}
        >
          <div
            class={clsx([
              'bg-linear-to-b dark:from-transparent via-transparent to-transparent rounded-t p-4 flex items-center justify-between',
              colorClasses.headerFrom,
            ])}
          >
            <div class="flex gap-1.5 items-center">
              {data.icon && (
                <div
                  class={clsx([
                    'rounded flex-none p-1 text-white',
                    nodeStyle.iconBgClass || colorClasses.iconBg,
                  ])}
                >
                  <div class={clsx([
                    'size-3',
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
              class={clsx('!border-2 !border-white !size-2.5 !rounded-full', colorClasses.handle)}
            />
          )}

          {props.showSourceHandle && (
            <Handle
              type="source"
              position={props.handlePosition.source}
              connectable={true}
              class={clsx('!border-2 !border-white !size-2.5 !rounded-full', colorClasses.handle)}
            />
          )}
        </div>
      )
    }
  },
})
