import type { FlowNodeCategory, FlowNodeRegistry } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import clsx from 'clsx'
import { NScrollbar } from 'naive-ui'
import ShortUniqueId from 'short-unique-id'
import { computed, defineComponent } from 'vue'

interface ToolbarProps {
  nodes: Record<string, FlowNodeRegistry>
  categories?: FlowNodeCategory[]
}

export const FlowToolbar = defineComponent({
  name: 'FlowToolbar',
  props: {
    nodes: {
      type: Object as () => Record<string, FlowNodeRegistry>,
      default: () => ({}),
    },
    categories: {
      type: Array as () => FlowNodeCategory[],
      default: () => [],
    },
  },
  setup(props: ToolbarProps) {
    const { t } = useI18n()
    const { randomUUID } = new ShortUniqueId({ length: 10 })

    // 默认分类
    const defaultCategories: FlowNodeCategory[] = [
      { key: 'start', label: t('components.flowEditor.categories.start') || '', icon: 'i-tabler:flag', order: 1 },
      { key: 'process', label: t('components.flowEditor.categories.process') || '', icon: 'i-tabler:box', order: 2 },
      { key: 'condition', label: t('components.flowEditor.categories.condition') || '', icon: 'i-tabler:git-branch', order: 3 },
      { key: 'end', label: t('components.flowEditor.categories.end') || '', icon: 'i-tabler:flag-check', order: 4 },
    ]

    // 合并分类
    const allCategories = computed(() => {
      const categoriesMap = new Map<string, FlowNodeCategory>()

      // 添加默认分类
      defaultCategories.forEach(cat => categoriesMap.set(cat.key, cat))

      // 添加自定义分类（会覆盖默认的）
      props.categories?.forEach(cat => categoriesMap.set(cat.key, cat))

      return Array.from(categoriesMap.values()).sort((a, b) => (a.order || 999) - (b.order || 999))
    })

    // 按分类分组的节点
    const groupedNodes = computed(() => {
      const groups = new Map<string, FlowNodeRegistry[]>()

      Object.entries(props.nodes).forEach(([_key, node]) => {
        const category = node.meta.category
        if (!groups.has(category)) {
          groups.set(category, [])
        }
        groups.get(category)!.push(node)
      })

      return groups
    })

    // 拖拽开始处理
    const handleDragStart = (event: DragEvent, node: FlowNodeRegistry) => {
      const nodeData = {
        id: randomUUID(),
        type: node.meta.name,
        position: { x: 0, y: 0 },
        data: {
          label: node.meta.label,
          description: node.meta.description,
          icon: node.meta.icon,
          color: node.meta.color,
          config: { ...node.meta.defaultConfig },
        },
      }

      event.dataTransfer!.setData('application/vueflow', JSON.stringify(nodeData))
      event.dataTransfer!.effectAllowed = 'move'
    }

    // 获取节点样式类
    const getNodeStyleClass = (node: FlowNodeRegistry) => {
      return {
        bg: 'bg-default dark:bg-muted hover:bg-elevated',
        iconBg: node.meta.style?.iconBgClass || 'bg-gray-100',
        icon: 'text-white',
        text: 'text-default',
      }
    }

    return () => (
      <div class="w-220px h-full">
        <NScrollbar>
          <div class="p-4 space-y-4">
            {allCategories.value.map((category) => {
              const categoryNodes = groupedNodes.value.get(category.key) || []
              if (categoryNodes.length === 0)
                return null

              return (
                <div key={category.key} class="space-y-4">
                  {/* 分类标题 */}
                  <div class="flex items-center gap-2 text-sm ">
                    <div class={clsx(['size-4', category.icon])} />
                    <span>{category.label}</span>
                  </div>

                  {/* 该分类下的节点 */}
                  <div class="space-y-2">
                    {categoryNodes.map((node) => {
                      const styleClass = getNodeStyleClass(node)
                      return (
                        <div
                          key={node.meta.name}
                          draggable
                          onDragstart={e => handleDragStart(e, node)}
                          class={clsx([
                            'rounded-lg px-3 py-2 cursor-move transition-all',
                            styleClass.bg,
                            'flex items-center gap-3',
                          ])}
                        >
                          <div class={clsx([
                            'size-8 rounded-lg flex items-center justify-center flex-shrink-0',
                            styleClass.iconBg,
                          ])}
                          >
                            <div class={clsx(['size-4', node.meta.icon, styleClass.icon])} />
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class={clsx(['text-sm font-medium truncate', styleClass.text])}>
                              {node.meta.label}
                            </div>
                            {node.meta.description && (
                              <div class={clsx(['text-xs truncate opacity-80', styleClass.text])}>
                                {node.meta.description}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </NScrollbar>
      </div>
    )
  },
})
