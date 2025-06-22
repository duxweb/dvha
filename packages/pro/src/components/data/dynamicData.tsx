import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PropType, VNode } from 'vue'
import { useJsonSchema } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NTable } from 'naive-ui'
import { computed, defineComponent, h } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { DuxBlockEmpty } from '../status'

export interface DuxDynamicDataColumn {
  key: string
  title?: string
  copy?: boolean
  width?: number
  render?: (
    cell: Record<string, any>,
    rowIndex: number,
  ) => VNode
  schema?: JsonSchemaNode | JsonSchemaNode[]
}

export const DuxDynamicData = defineComponent({
  name: 'DuxDynamicData',
  props: {
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

    const copy = (field: string | number) => {
      const firstRowValue = model.value?.[0][field]
      const newData = [...(model.value || [])].map(row => ({
        ...row,
        [field]: firstRowValue,
      }))
      model.value = [...newData]
    }

    const colNum = computed(() => {
      let num = props.columns?.length || 0
      if (props.createAction || props.deleteAction) {
        num += 1
      }
      return num
    })

    return () => (
      <VueDraggable
        modelValue={model.value}
        {...{
          'onUpdate:modelValue': (v) => {
            model.value = v
          },
        }}
        handle=".sort-handle"
        target=".sort-target"
        animation={150}
      >
        <div class="overflow-auto w-full">
          <NTable class="table-fixed w-full">
            <thead>
              <tr>
                <th style={{
                  width: '40px',
                }}
                >

                </th>
                {props.columns?.map((item, index) => (
                  <th
                    key={index}
                    style={{
                      width: `${item.width}px`,
                    }}
                  >
                    <div class="flex items-center justify-between">
                      <div>{item.title}</div>
                      {item.copy && (
                        <div>
                          <NButton
                            onClick={() => {
                              copy(item.key)
                            }}
                            renderIcon={() => <div class="i-tabler:pencil-down t-icon"></div>}
                            text
                            type="primary"
                          >
                          </NButton>
                        </div>
                      )}
                    </div>
                  </th>
                ))}

                {(props.createAction || props.deleteAction) && (
                  <th
                    class="w-15"
                  >
                    {props.createAction
                      && (
                        <NButton
                          tertiary
                          type="primary"
                          circle
                          renderIcon={() => <div class="i-tabler:plus h-4 w-4"></div>}
                          onClick={() => {
                            if (props?.onCreate) {
                              props.onCreate()
                            }
                            else {
                              if (!model.value) {
                                model.value = []
                              }
                              model.value?.push(props?.createCallback?.(model.value) || {})
                            }
                          }}
                        />
                      )}
                  </th>
                )}
              </tr>
            </thead>
            <tbody class="sort-target">
              {(model.value && model.value?.length > 0)
                ? model.value.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>
                        <div class="sort-handle i-tabler:grid-dots size-4 cursor-move"></div>
                      </td>
                      {props.columns?.map((column, columnIndex) => (
                        <td key={columnIndex}>
                          {column.schema
                            ? h(renderAsync({
                                data: Array.isArray(column.schema) ? column.schema : [column.schema],
                                context: {
                                  rowIndex,
                                  model: model.value,
                                  row,
                                },
                              }))
                            : column.render?.(row, rowIndex) || row[column.key]}
                        </td>
                      ))}
                      {(props.createAction || props.deleteAction) && (
                        <td class="w-15">
                          {props.deleteAction && (
                            <NButton
                              tertiary
                              type="error"
                              circle
                              renderIcon={() => <div class="i-tabler:trash h-4 w-4"></div>}
                              onClick={() => {
                                model.value.splice(rowIndex, 1)
                              }}
                            />
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                : (
                    <tr>
                      <td colspan={colNum.value}>
                        <DuxBlockEmpty />
                      </td>
                    </tr>
                  )}
            </tbody>
          </NTable>
        </div>
      </VueDraggable>
    )
  },
})
