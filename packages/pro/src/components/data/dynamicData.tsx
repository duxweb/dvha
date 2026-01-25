import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { DataTableColumn } from 'naive-ui'
import type { PropType, VNode } from 'vue'
import { useJsonSchema } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NDataTable } from 'naive-ui'
import { computed, defineComponent, h, ref } from 'vue'
import { DuxBlockEmpty } from '../status'

export interface DuxDynamicDataColumn {
  key: string
  title?: string
  copy?: boolean
  width?: number
  minWidth?: number
  render?: (
    cell: Record<string, any>,
    rowIndex: number,
  ) => VNode
  fixed?: 'left' | 'right'
  align?: 'left' | 'right' | 'center'
  ellipsis?: boolean
  schema?: JsonSchemaNode | JsonSchemaNode[] | ((cell: Record<string, any>, rowIndex: number) => JsonSchemaNode | JsonSchemaNode[])
}

export const DuxDynamicData = defineComponent({
  name: 'DuxDynamicData',
  props: {
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'small',
    },
    moveAction: {
      type: Boolean,
      default: true,
    },
    createAction: {
      type: Boolean,
      default: true,
    },
    deleteAction: {
      type: Boolean,
      default: true,
    },
    columns: Array as PropType<DuxDynamicDataColumn[]>,
    createCallback: Function as PropType<(value: Record<string, any>[]) => void>,
    onCreate: Function,
    value: {
      type: Array as PropType<Record<string, any>[]>,
      default: [],
    },
    defaultValue: {
      type: Array as PropType<Record<string, any>[]>,
      default: [],
    },
  },
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue || [],
      deep: true,
    })

    const { renderAsync } = useJsonSchema()
    const draggingRowIndex = ref<number | null>(null)

    const copy = (field: string | number) => {
      const firstRowValue = model.value?.[0][field]
      const newData = [...(model.value || [])].map(row => ({
        ...row,
        [field]: firstRowValue,
      }))
      model.value = [...newData]
    }

    const dataSource = computed(() => model.value || [])

    const handleCreate = () => {
      if (props?.onCreate) {
        props.onCreate()
        return
      }
      const nextRow = props?.createCallback?.(model.value) || {}
      model.value = [...(model.value || []), nextRow]
    }

    const deleteRow = (rowIndex: number) => {
      if (!model.value) {
        return
      }
      const list = [...model.value]
      list.splice(rowIndex, 1)
      model.value = list
    }

    const rowKeyMap = new WeakMap<Record<string, any>, number>()
    let rowKeySeed = 0
    const getRowKey = (row: Record<string, any>) => {
      if (row.__specKey || row.__rowKey) {
        return row.__specKey || row.__rowKey
      }
      if (!rowKeyMap.has(row)) {
        rowKeySeed += 1
        rowKeyMap.set(row, rowKeySeed)
      }
      return rowKeyMap.get(row)!
    }

    const moveRow = (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) {
        return
      }
      const list = [...(model.value || [])]
      const [item] = list.splice(fromIndex, 1)
      list.splice(toIndex, 0, item)
      model.value = list
    }

    const getRowProps = (rowIndex: number) => {
      if (!props.moveAction) {
        return {}
      }
      return {
        style: { cursor: 'move' },
        draggable: true,
        onDragstart: (event: DragEvent) => {
          draggingRowIndex.value = rowIndex
          event.dataTransfer?.setData('text/plain', String(rowIndex))
          event.dataTransfer?.setDragImage?.(event.currentTarget as HTMLElement, 0, 0)
        },
        onDragover: (event: DragEvent) => {
          event.preventDefault()
          event.dataTransfer!.dropEffect = 'move'
        },
        onDrop: (event: DragEvent) => {
          event.preventDefault()
          const from = draggingRowIndex.value
          if (from === null) {
            return
          }
          moveRow(from, rowIndex)
          draggingRowIndex.value = null
        },
        onDragend: () => {
          draggingRowIndex.value = null
        },
      }
    }

    const moveColumn = computed<DataTableColumn<Record<string, any>> | null>(() => {
      if (!props.moveAction) {
        return null
      }
      return {
        key: '__move',
        fixed: 'left',
        width: 48,
        align: 'center',
        title: '',
        render: () => (
          <div class="i-tabler:grid-dots text-gray-400 size-4 inline-flex items-center justify-center"></div>
        ),
      }
    })

    const mappedColumns = computed<DataTableColumn<Record<string, any>>[]>(() => {
      return (props.columns || []).map((column) => {
        const titleNode = column.copy
          ? () => (
              <div class="flex items-center justify-between gap-1">
                <span>{column.title}</span>
                <NButton
                  text
                  type="primary"
                  size="small"
                  onClick={() => copy(column.key)}
                  renderIcon={() => <div class="i-tabler:pencil-down text-base"></div>}
                />
              </div>
            )
          : column.title
        return {
          key: column.key,
          title: titleNode,
          width: column.width,
          minWidth: column.minWidth,
          fixed: column.fixed,
          align: column.align,
          ellipsis: column.ellipsis,
          render: (row: Record<string, any>, rowIndex: number) => {
            if (column.schema) {
              const schema = typeof column.schema === 'function' ? column.schema(row, rowIndex) : column.schema
              return h(renderAsync({
                data: (Array.isArray(schema) ? schema : [schema]) as JsonSchemaNode[],
                context: {
                  rowIndex,
                  model: model.value,
                  row,
                },
              }))
            }
            return column.render?.(row, rowIndex) ?? row[column.key]
          },
        } as DataTableColumn<Record<string, any>>
      })
    })

    const actionColumn = computed<DataTableColumn<Record<string, any>> | null>(() => {
      if (!props.createAction && !props.deleteAction) {
        return null
      }
      return {
        key: '__action',
        width: 64,
        fixed: 'right',
        align: 'center',
        title: props.createAction
          ? () => (
              <NButton
                tertiary
                type="primary"
                circle
                renderIcon={() => <div class="i-tabler:plus h-4 w-4"></div>}
                onClick={handleCreate}
              />
            )
          : '',
        render: (_, rowIndex: number) => (
          props.deleteAction
            ? (
                <NButton
                  tertiary
                  type="error"
                  circle
                  renderIcon={() => <div class="i-tabler:trash h-4 w-4"></div>}
                  onClick={() => deleteRow(rowIndex)}
                />
              )
            : null
        ),
      }
    })

    const tableColumns = computed(() => {
      const cols: (DataTableColumn<Record<string, any>> | null)[] = [
        moveColumn.value,
        ...mappedColumns.value,
        actionColumn.value,
      ]
      return cols.filter(Boolean) as DataTableColumn<Record<string, any>>[]
    })

    return () => (
      <NDataTable
        size={props.size}
        rowKey={getRowKey}
        bordered={true}
        columns={tableColumns.value}
        data={dataSource.value}
        pagination={false}
        {...{
          rowProps: (_row: Record<string, any>, rowIndex: number) => getRowProps(rowIndex),
        }}
        style={{
          '--n-empty-padding': '20px 0',
        }}
        v-slots={{
          empty: () => (
            <DuxBlockEmpty />
          ),
        }}
      />
    )
  },
})
