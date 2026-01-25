import type { IUseTreeProps } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import { useI18n, useTree } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NCheckbox, NScrollbar, NSpin } from 'naive-ui'
import { computed, defineComponent, ref, toRef, watch } from 'vue'

export interface CascaderPanelOption {
  [key: string]: any
}

export type CascaderPanelCheckStrategy = 'all' | 'parent' | 'child'
type CascaderPath = (string | number)[]
type CascaderPaths = CascaderPath[]

export const DuxCascaderPanel = defineComponent({
  name: 'DuxCascaderPanel',
  props: {
    value: {
      type: [String, Number, Array] as PropType<string | number | (string | number)[] | (string | number)[][]>,
      default: () => [],
    },
    options: Array as PropType<CascaderPanelOption[]>,
    path: String,
    params: Object as PropType<Record<string, any>>,
    treeOptions: Object as PropType<IUseTreeProps>,
    maxLevel: {
      type: Number,
      default: 3,
    },
    maxHeight: {
      type: Number,
      default: 420,
    },
    labelField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    childrenField: {
      type: String,
      default: 'children',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    cascade: {
      type: Boolean,
      default: true,
    },
    checkStrategy: {
      type: String as PropType<CascaderPanelCheckStrategy>,
      default: 'all',
    },
    showPath: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: false,
      defaultValue: [],
    })
    const { t } = useI18n()

    const activePath = ref<(string | number)[]>([])
    const selectedPaths = ref<(string | number)[][]>([])
    const data = ref<CascaderPanelOption[]>([])
    const loading = ref(false)

    if (props.options !== undefined) {
      watch(() => props.options, (v) => {
        data.value = Array.isArray(v) ? v : []
      }, { immediate: true, deep: true })
    }
    else if (props.path) {
      const path = toRef(props, 'path', '')
      const params = toRef(props, 'params', {})
      const treeOptions = toRef(props, 'treeOptions', {})
      const tree = useTree({
        path,
        params,
        ...treeOptions.value,
      })

      watch(tree.options, (v) => {
        data.value = Array.isArray(v) ? v : []
      }, { immediate: true, deep: true })

      watch(tree.loading, (v) => {
        loading.value = !!v
      }, { immediate: true })
    }

    const getLabel = (node: CascaderPanelOption) => {
      const labelField = props.labelField
      return node?.[labelField] ?? node?.label ?? node?.name ?? node?.title ?? ''
    }

    const getValue = (node: CascaderPanelOption) => {
      const valueField = props.valueField
      return node?.[valueField] ?? node?.value ?? node?.id ?? node?.code ?? node?.key ?? ''
    }

    const getChildren = (node: CascaderPanelOption) => {
      const childrenField = props.childrenField
      const children = node?.[childrenField] ?? node?.children
      return Array.isArray(children) ? children : []
    }

    const isPath = (val: unknown): val is CascaderPath => {
      return Array.isArray(val) && val.every(item => typeof item === 'string' || typeof item === 'number')
    }

    const isPaths = (val: unknown): val is CascaderPaths => {
      return Array.isArray(val) && val.every(item => isPath(item))
    }

    const pathKey = (path: (string | number)[]) => {
      return JSON.stringify(path)
    }

    const findNodeByPath = (
      nodes: CascaderPanelOption[],
      path: (string | number)[],
    ): { node: CascaderPanelOption, level: number } | null => {
      let items = nodes
      let level = 0
      let current: CascaderPanelOption | undefined
      for (const value of path) {
        current = items.find(item => String(getValue(item)) === String(value))
        if (!current) {
          return null
        }
        level += 1
        items = getChildren(current)
      }
      return current ? { node: current, level: level - 1 } : null
    }

    const getLeafPathsFromNode = (
      node: CascaderPanelOption,
      path: (string | number)[],
      level: number,
    ): (string | number)[][] => {
      if (!props.cascade) {
        return [path]
      }
      const children = getChildren(node)
      if (level >= props.maxLevel - 1 || children.length === 0) {
        return [path]
      }
      const result: (string | number)[][] = []
      for (const child of children) {
        result.push(...getLeafPathsFromNode(
          child,
          [...path, getValue(child)],
          level + 1,
        ))
      }
      return result
    }

    const getLeafPathsByPath = (path: (string | number)[]) => {
      const found = findNodeByPath(data.value, path)
      if (!found) {
        return [path]
      }
      return getLeafPathsFromNode(found.node, path, found.level)
    }

    const findPathByValue = (
      nodes: CascaderPanelOption[],
      target: string | number,
    ): (string | number)[] | null => {
      for (const node of nodes) {
        const currentValue = getValue(node)
        if (String(currentValue) === String(target)) {
          return [currentValue]
        }
        const children = getChildren(node)
        if (children.length) {
          const childPath = findPathByValue(children, target)
          if (childPath) {
            return [currentValue, ...childPath]
          }
        }
      }
      return null
    }

    const toStoredValue = (paths: (string | number)[][]) => {
      if (props.multiple) {
        if (props.showPath) {
          return paths
        }
        return paths
          .map(path => path[path.length - 1])
          .filter(item => item !== undefined && item !== null)
      }

      if (!paths.length) {
        return props.showPath ? [] : null
      }

      if (props.showPath) {
        return paths[0]
      }

      return paths[0][paths[0].length - 1]
    }

    const isSamePath = (a: (string | number)[], b: (string | number)[]) => {
      if (a.length !== b.length) {
        return false
      }
      return a.every((item, index) => String(item) === String(b[index]))
    }

    const normalizeSelection = () => {
      const next = Array.isArray(activePath.value) ? [...activePath.value] : []
      let items = data.value
      let changed = false

      for (let level = 0; level < props.maxLevel; level++) {
        if (!Array.isArray(items) || items.length === 0) {
          if (next.length > level) {
            next.splice(level)
            changed = true
          }
          break
        }

        const current = next[level]
        const currentNode = items.find(item => String(getValue(item)) === String(current))
        if (!currentNode) {
          const firstValue = getValue(items[0])
          if (firstValue !== '' && firstValue !== undefined && firstValue !== null) {
            next[level] = firstValue
            changed = true
            items = getChildren(items[0])
          }
          else {
            next.splice(level)
            changed = true
            break
          }
        }
        else {
          items = getChildren(currentNode)
        }
      }

      if (changed) {
        activePath.value = next
        if (!props.multiple) {
          selectedPaths.value = next.length ? [next] : []
          model.value = toStoredValue(selectedPaths.value) as any
        }
      }
    }

    watch(data, normalizeSelection, { immediate: true, deep: true })
    watch(() => props.maxLevel, normalizeSelection, { immediate: true })
    watch(() => props.value, (val) => {
      if (props.showPath) {
        if (props.multiple) {
          if (isPaths(val)) {
            const paths = val.map(path => path.slice(0, props.maxLevel))
            selectedPaths.value = paths
            if (activePath.value.length && paths.some(path => isSamePath(path, activePath.value))) {
              activePath.value = [...activePath.value]
            }
            else {
              const last = paths[paths.length - 1]
              activePath.value = last ? [...last] : []
            }
            return
          }
        }
        else if (isPath(val)) {
          const path = val
          selectedPaths.value = path.length ? [path.slice(0, props.maxLevel)] : []
          activePath.value = selectedPaths.value[0] ? [...selectedPaths.value[0]] : []
          return
        }
        else if (isPaths(val)) {
          const path = val[0] || []
          selectedPaths.value = path.length ? [path.slice(0, props.maxLevel)] : []
          activePath.value = selectedPaths.value[0] ? [...selectedPaths.value[0]] : []
          return
        }
      }
      else {
        if (props.multiple && Array.isArray(val)) {
          const paths = val
            .map(item => findPathByValue(data.value, item))
            .filter((path): path is (string | number)[] => Array.isArray(path) && path.length > 0)
          selectedPaths.value = paths
          if (activePath.value.length && paths.some(path => isSamePath(path, activePath.value))) {
            activePath.value = [...activePath.value]
          }
          else {
            const last = paths[paths.length - 1]
            activePath.value = last ? [...last] : []
          }
          return
        }
        if (!props.multiple && (val !== undefined && val !== null) && !Array.isArray(val)) {
          const path = findPathByValue(data.value, val as any)
          selectedPaths.value = path ? [path] : []
          activePath.value = path ? [...path] : []
          return
        }
      }
      selectedPaths.value = []
      activePath.value = []
    }, { immediate: true, deep: true })

    const columns = computed(() => {
      const cols: Array<{
        level: number
        items: CascaderPanelOption[]
        activeValue?: string | number
      }> = []

      let items = data.value
      for (let level = 0; level < props.maxLevel; level++) {
        const activeValue = activePath.value?.[level]
        cols.push({
          level,
          items,
          activeValue,
        })

        const activeNode = items.find(item => String(getValue(item)) === String(activeValue))
        items = activeNode ? getChildren(activeNode) : []
      }

      return cols
    })

    const panelStyle = computed(() => {
      return {
        gridTemplateColumns: `repeat(${props.maxLevel}, minmax(160px, 1fr))`,
      }
    })

    const isLeaf = (level: number, node: CascaderPanelOption) => {
      if (level >= props.maxLevel - 1) {
        return true
      }
      return getChildren(node).length === 0
    }

    const canSelect = (level: number, node: CascaderPanelOption) => {
      if (!props.multiple) {
        return true
      }
      if (props.checkStrategy === 'child') {
        return isLeaf(level, node)
      }
      if (props.checkStrategy === 'parent') {
        return !isLeaf(level, node)
      }
      return true
    }

    const handleExpand = (level: number, node: CascaderPanelOption) => {
      const next = Array.isArray(activePath.value) ? [...activePath.value] : []
      next[level] = getValue(node)
      next.splice(level + 1)
      activePath.value = next
    }

    const buildPathForRow = (level: number, node: CascaderPanelOption) => {
      return [
        ...activePath.value.slice(0, level),
        getValue(node),
      ]
    }

    const getSelectedLeafSet = () => {
      const set = new Set<string>()
      const source = Array.isArray(selectedPaths.value) ? selectedPaths.value : []
      if (!props.cascade) {
        source.forEach(path => set.add(pathKey(path)))
        return set
      }
      source.forEach((path) => {
        getLeafPathsByPath(path).forEach(leaf => set.add(pathKey(leaf)))
      })
      return set
    }

    const getCheckedState = (
      path: (string | number)[],
      node: CascaderPanelOption,
      level: number,
      leafSet: Set<string>,
    ) => {
      const leafPaths = getLeafPathsFromNode(node, path, level)
      if (leafPaths.length === 0) {
        return { checked: false, indeterminate: false }
      }
      const selectedCount = leafPaths.filter(item => leafSet.has(pathKey(item))).length
      return {
        checked: selectedCount > 0 && selectedCount === leafPaths.length,
        indeterminate: selectedCount > 0 && selectedCount < leafPaths.length,
      }
    }

    const buildCheckedPathsFromLeafSet = (leafSet: Set<string>) => {
      const leafPaths = Array.from(leafSet).map(key => JSON.parse(key) as (string | number)[])
      if (!props.cascade || props.checkStrategy === 'child') {
        return leafPaths
      }

      const results: (string | number)[][] = []
      const walk = (
        node: CascaderPanelOption,
        path: (string | number)[],
        level: number,
      ) => {
        const children = getChildren(node)
        if (level >= props.maxLevel - 1 || children.length === 0) {
          const isSelected = leafSet.has(pathKey(path))
          return { allSelected: isSelected, paths: isSelected ? [path] : [] }
        }

        const childResults = children.map(child => walk(
          child,
          [...path, getValue(child)],
          level + 1,
        ))
        const allSelected = childResults.length > 0 && childResults.every(item => item.allSelected)
        let paths: (string | number)[][] = []

        if (props.checkStrategy === 'parent') {
          if (allSelected) {
            paths = [path]
          }
          else {
            childResults.forEach(item => paths.push(...item.paths))
          }
        }
        else {
          if (allSelected) {
            paths.push(path)
          }
          childResults.forEach(item => paths.push(...item.paths))
        }

        return { allSelected, paths }
      }

      data.value.forEach((node) => {
        const res = walk(node, [getValue(node)], 0)
        results.push(...res.paths)
      })

      return results
    }

    const handleCheckboxToggle = (level: number, node: CascaderPanelOption, checked: boolean) => {
      const next = buildPathForRow(level, node)
      activePath.value = next

      if (props.multiple) {
        if (!canSelect(level, node)) {
          return
        }
        if (props.cascade) {
          const leafSet = getSelectedLeafSet()
          const leafPaths = getLeafPathsFromNode(node, next, level)
          leafPaths.forEach((path) => {
            const key = pathKey(path)
            if (checked) {
              leafSet.add(key)
            }
            else {
              leafSet.delete(key)
            }
          })
          const list = buildCheckedPathsFromLeafSet(leafSet)
          selectedPaths.value = list
          model.value = toStoredValue(list) as any
        }
        else {
          const list = Array.isArray(selectedPaths.value) ? [...selectedPaths.value] : []
          const index = list.findIndex(path => isSamePath(path, next))
          if (checked && index < 0) {
            list.push(next)
          }
          if (!checked && index >= 0) {
            list.splice(index, 1)
          }
          selectedPaths.value = list
          model.value = toStoredValue(list) as any
        }
        return
      }

      if (checked) {
        selectedPaths.value = [next]
        model.value = toStoredValue(selectedPaths.value) as any
      }
      else {
        selectedPaths.value = []
        model.value = toStoredValue([]) as any
      }
    }

    const applyColumnSelection = (level: number, rows: CascaderPanelOption[], checked: boolean) => {
      if (!props.multiple || rows.length === 0) {
        return
      }
      if (props.cascade) {
        const leafSet = getSelectedLeafSet()
        rows.forEach((row) => {
          const path = buildPathForRow(level, row)
          const leafPaths = getLeafPathsFromNode(row, path, level)
          leafPaths.forEach((leafPath) => {
            const key = pathKey(leafPath)
            if (checked) {
              leafSet.add(key)
            }
            else {
              leafSet.delete(key)
            }
          })
        })
        const list = buildCheckedPathsFromLeafSet(leafSet)
        selectedPaths.value = list
        model.value = toStoredValue(list) as any
        return
      }

      const list = Array.isArray(selectedPaths.value) ? [...selectedPaths.value] : []
      rows.forEach((row) => {
        const path = buildPathForRow(level, row)
        const index = list.findIndex(item => isSamePath(item, path))
        if (checked && index < 0) {
          list.push(path)
        }
        if (!checked && index >= 0) {
          list.splice(index, 1)
        }
      })
      selectedPaths.value = list
      model.value = toStoredValue(list) as any
    }

    return () => {
      const leafSet = getSelectedLeafSet()
      return (
        <NSpin show={loading.value}>
          <div class="grid gap-3" style={panelStyle.value}>
            {columns.value.map((column) => {
              return (
                <div key={column.level} class="border border-muted rounded">
                  {props.multiple
                    ? (
                        <div class="flex items-center justify-between px-2 py-2 border-b border-muted">
                          <span class="text-xs text-muted">
                            {t('components.cascaderPanel.level', { num: column.level + 1 })}
                          </span>
                          <div class="flex items-center gap-2">
                            <NButton
                              size="small"
                              tertiary
                              onClick={(event) => {
                                event.stopPropagation()
                                applyColumnSelection(column.level, column.items || [], true)
                              }}
                            >
                              {t('components.cascaderPanel.selectAll')}
                            </NButton>
                            <NButton
                              size="small"
                              tertiary
                              onClick={(event) => {
                                event.stopPropagation()
                                applyColumnSelection(column.level, column.items || [], false)
                              }}
                            >
                              {t('components.cascaderPanel.clearAll')}
                            </NButton>
                          </div>
                        </div>
                      )
                    : null}
                  <NScrollbar style={{ maxHeight: `${props.maxHeight}px` }}>
                    <div class="p-2 space-y-2">
                      {column.items?.map((row) => {
                        const value = getValue(row)
                        const isActive = String(column.activeValue) === String(value)
                        const rowPath = buildPathForRow(column.level, row)
                        const checkState = getCheckedState(rowPath, row, column.level, leafSet)
                        return (
                          <div
                            key={String(value)}
                            class={[
                              'flex items-center justify-between gap-2 px-2 py-1 rounded cursor-pointer',
                              isActive ? 'bg-muted' : 'hover:bg-muted',
                            ]}
                            onClick={() => handleExpand(column.level, row)}
                          >
                            <div class="flex items-center gap-2">
                              <NCheckbox
                                checked={checkState.checked}
                                indeterminate={checkState.indeterminate}
                                onUpdateChecked={checked => handleCheckboxToggle(column.level, row, !!checked)}
                              />
                              <span>{getLabel(row)}</span>
                            </div>
                            {column.level < props.maxLevel - 1
                              ? <span class="text-muted">›</span>
                              : null}
                          </div>
                        )
                      })}
                    </div>
                  </NScrollbar>
                </div>
              )
            })}
          </div>
        </NSpin>
      )
    }
  },
})
