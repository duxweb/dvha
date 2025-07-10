import type { IUseTreeProps } from '@duxweb/dvha-core'
import type { DropdownOption, TreeDropInfo, TreeOption, TreeProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useCustomMutation, useI18n, useTree } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import clsx from 'clsx'
import { NButton, NDropdown, NInput, NScrollbar, NSpin, NTree } from 'naive-ui'
import { computed, defineComponent, ref, toRef, watch } from 'vue'
import { DuxCard } from '../card'

export interface TreeMenu {
  label?: string
  value?: string
  icon?: string
  onSelect: (option?: TreeOption) => void
}

export interface TreeFilterProps extends TreeProps {
  title?: string
  path?: string
  sortPath?: string
  params?: Record<string, any>
  menus?: TreeMenu[]
  numField?: string
  iconField?: string
  treeOptions?: IUseTreeProps
  value?: (string | number)[]
  defaultValue?: (string | number)[]
  draggable?: boolean
  onUpdateValue?: (value: (string | number)[]) => void
  bordered?: boolean
}

export const DuxTreeFilter = defineComponent<TreeFilterProps>({
  name: 'DuxTreeFilter',
  props: {
    title: String,
    path: String,
    sortPath: String,
    params: Object as PropType<Record<string, any>>,
    menus: Array as PropType<TreeMenu[]>,
    numField: String,
    iconField: String,
    treeOptions: Object as PropType<IUseTreeProps>,
    value: Array as PropType<(string | number)[]>,
    defaultValue: Array as PropType<(string | number)[]>,
    onUpdateValue: Function as PropType<(value: (string | number)[]) => void>,
    draggable: Boolean,
    bordered: {
      type: Boolean,
      default: false,
    },
  },
  extends: NTree,
  setup(props, { emit, slots }) {
    const model = useVModel(props, 'value', emit, {
      passive: false,
      defaultValue: props.defaultValue,
    })

    const params = toRef(props, 'params', {})
    const path = toRef(props, 'path', '')
    const sortPath = toRef(props, 'sortPath', '')

    const dropdownOption = ref<TreeOption>()
    const x = ref(0)
    const y = ref(0)

    const data = ref<TreeOption[]>([])
    const keyword = ref<string>()
    const { t } = useI18n()

    const { options, loading, expanded } = useTree({
      path: path.value,
      params: params.value,
      ...props.treeOptions,
    })

    // 设置树数据
    watch(options, (v) => {
      data.value = v
    }, { immediate: true, deep: true })

    // 下拉菜单
    const dropdownShow = ref(false)
    const dropdownOptions = computed<DropdownOption[]>(() => {
      return props.menus?.map((menu) => {
        return {
          label: menu.label,
          key: menu.value,
          icon: menu?.icon ? () => <div class={menu?.icon}></div> : undefined,
          onSelect: menu.onSelect,
        } as DropdownOption
      }) || []
    })

    // 下拉菜单选择
    const handleSelect = (value) => {
      const menu = props.menus?.find(menu => menu.value === value)
      if (menu) {
        menu.onSelect(dropdownOption.value)
      }
      dropdownShow.value = false
    }

    const client = useCustomMutation({
      path: sortPath.value,
      method: 'POST',
    })

    // 找到父节点
    const findParentNode = (
      tree: TreeOption[],
      targetId: any,
    ): TreeOption | undefined => {
      for (const node of tree) {
        if (node.children) {
          for (const child of node.children) {
            if (child.id === targetId) {
              return node
            }
          }
          const parentNode = findParentNode(node.children, targetId)
          if (parentNode) {
            return parentNode
          }
        }
      }
    }

    // 拖拽位置处理
    const handleDrop = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
      const oldParent = findParentNode(data.value, dragNode.id)
      const isTopLevelDrag = !oldParent

      const newData = [...data.value]

      if (isTopLevelDrag) {
        const index = data.value.findIndex(item => item.id === dragNode.id)
        if (index >= 0)
          newData.splice(index, 1)
      }
      else {
        const index = oldParent?.children?.indexOf(dragNode) || 0
        oldParent?.children?.splice(index, 1)
      }

      let parent = findParentNode(newData, node.id)
      let beforeId: any
      let targetCollection: TreeOption[] = parent?.children || newData
      let insertPosition = 0

      switch (dropPosition) {
        case 'before':
          insertPosition = targetCollection.findIndex(item => item.id === node.id)
          if (insertPosition > 0) {
            beforeId = targetCollection[insertPosition - 1].id
          }
          break

        case 'inside':
          parent = node
          targetCollection = parent.children = parent.children || []
          insertPosition = targetCollection.length
          break

        case 'after':
          insertPosition = targetCollection.findIndex(item => item.id === node.id) + 1
          beforeId = node.id
          break
      }

      targetCollection.splice(insertPosition, 0, dragNode as any)

      data.value = newData

      client.mutate({
        payload: {
          parent_id: parent?.id,
          before_id: beforeId,
          id: dragNode.id,
        },
      })
    }

    const expandedKeys = ref<unknown[]>([])
    const isExpanded = ref(false)

    watch(expanded, (v) => {
      if (expandedKeys?.value?.length > 0) {
        return
      }
      isExpanded.value = v.length > 0
      expandedKeys.value = v
    }, { immediate: true })

    const getAllKeys = (nodes: TreeOption[]): unknown[] => {
      const keys: unknown[] = []
      const traverse = (items: TreeOption[]) => {
        items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            keys.push(item.key || item.id)
            traverse(item.children)
          }
        })
      }
      traverse(nodes)
      return keys
    }

    const toggleExpandAll = () => {
      if (isExpanded.value) {
        // 收起所有
        expandedKeys.value = []
        isExpanded.value = false
      }
      else {
        // 展开所有
        expandedKeys.value = getAllKeys(data.value)
        isExpanded.value = true
      }
    }

    const treeProps = computed(() => {
      const { title, path, sortPath, params, menus, numField, iconField, treeOptions, value, defaultValue, onUpdateValue, bordered, ...rest } = props
      return rest
    })

    return () => (
      <DuxCard class="h-full" contentClass="flex flex-col" bordered={props.bordered}>
        {props?.title && (
          <div class="px-2 py-3 pb-1 text-base font-bold">
            {props.title}
          </div>
        )}
        <div class="p-2 flex gap-2 items-center">
          <NButton onClick={toggleExpandAll}>
            {{
              icon: () => <div class={isExpanded.value ? 'i-tabler:fold-up' : 'i-tabler:fold-down'}></div>,
            }}
          </NButton>
          <div class="flex-1">
            {slots.header
              ? slots.header()
              : (
                  <NInput v-model:value={keyword.value} placeholder={t('common.keyword')} />
                )}
          </div>
          {slots.tools?.()}
        </div>
        <NScrollbar class="flex-1 min-h-0" xScrollable>
          <div class="p-2">
            <NSpin show={loading.value} class="h-full">
              <NTree
                {...treeProps.value}
                data={data.value || []}
                expandedKeys={expandedKeys.value as any}
                onUpdateExpandedKeys={(v) => {
                  expandedKeys.value = v
                  // 检查是否为全部展开状态
                  const allKeys = getAllKeys(data.value)
                  isExpanded.value = allKeys.length > 0 && allKeys.every(key => (v as unknown[]).includes(key))
                }}
                blockLine
                selectedKeys={model.value}
                onUpdateSelectedKeys={(v) => {
                  model.value = v
                  props?.onUpdateValue?.(v)
                }}
                onDrop={handleDrop}
                pattern={keyword.value}
                renderPrefix={props?.numField || (props?.iconField)
                  ? ({ option }) => {
                      return (
                        <>
                          {props.iconField && option[props.iconField] && (
                            <div class={clsx(
                              option[props.iconField] || '',
                              'size-4',
                            )}
                            />
                          )}
                          {props.numField && <div class="rounded-full bg-primary px-2 text-xs text-white">{option[props.numField as any] || 0}</div>}
                        </>
                      )
                    }
                  : undefined}
                nodeProps={({ option }) => {
                  return {
                    onContextmenu: (e) => {
                      dropdownOption.value = option
                      dropdownShow.value = true
                      x.value = e.clientX
                      y.value = e.clientY
                      e.preventDefault()
                    },
                  }
                }}
              />
            </NSpin>
          </div>
        </NScrollbar>
        <NDropdown
          trigger="manual"
          placement="bottom-start"
          show={dropdownShow.value}
          options={dropdownOptions.value as any}
          x={x.value}
          y={y.value}
          width={100}
          onSelect={handleSelect}
          onClickoutside={() => {
            dropdownShow.value = false
          }}
        />
      </DuxCard>
    )
  },
})
