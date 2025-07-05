import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { TableColumn } from '@duxweb/dvha-naiveui'
import type { PropType } from 'vue'
import type { DuxDynamicDataColumn } from './dynamicData'
import { useClient, useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { defineComponent, ref, watch } from 'vue'
import { useModal } from '../../hooks'
import { DuxDynamicData } from './dynamicData'

type Value = Record<string, any>[]

export const DuxDynamicSelect = defineComponent({
  name: 'DuxDynamicSelect',
  props: {
    rowKey: {
      type: String,
      default: 'id',
    },
    path: String,
    columns: Array as PropType<DuxDynamicDataColumn[]>,
    filterColumns: Array as PropType<TableColumn[]>,
    filterSchema: {
      type: Array as PropType<JsonSchemaNode[]>,
    },
    value: {
      type: Array as PropType<Value>,
      default: [],
    },
    defaultValue: {
      type: Array as PropType<Value>,
      default: [],
    },
  },
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue,
      deep: true,
    })

    const modal = useModal()
    const client = useClient()
    const { t } = useI18n()

    const once = ref(true)

    watch([model, once], () => {
      if (!once.value || !model.value || model.value.length === 0) {
        return
      }
      const ids = model.value?.map(e => e[props.rowKey]) || []

      client.request({
        path: props.path,
        query: {
          ids: ids?.join(',') || '',
        },
      }).then((res) => {
        once.value = false
        res?.data?.forEach((row, index) => {
          if (!model.value.some(e => e[props.rowKey] === row[props.rowKey])) {
            model.value.push(row)
          }
          else {
            model.value[index] = { ...model.value[index], ...row }
          }
        })
      })
    })

    return () => (
      <DuxDynamicData
        v-model:value={model.value}
        columns={props.columns}
        onCreate={() => {
          modal.show({
            component: () => import('./selectModal'),
            componentProps: {
              path: props.path,
              columns: props.filterColumns,
              filterSchema: props.filterSchema,
            },
            width: 1000,
            title: t('components.button.select'),
          }).then((rows: Record<string, any>[]) => {
            once.value = false
            rows?.forEach((row) => {
              if (!model.value.some(e => e[props.rowKey] === row[props.rowKey])) {
                model.value.push(row)
              }
            })
          })
        }}
      />
    )
  },
})
