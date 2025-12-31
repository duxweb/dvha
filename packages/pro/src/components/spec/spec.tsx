import type { PropType } from 'vue'
import type { DuxDynamicDataColumn } from '../data'
import type { DuxSpecImageUploadProps, DuxSpecItem, DuxSpecValueItem } from './specEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NSwitch } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { DuxDynamicData } from '../data'
import { createSpec, createSpecValue, DuxSpecEditor } from './specEditor'

export interface DuxSpecValueModel {
  specs: DuxSpecItem[]
  rows: Record<string, any>[]
}

interface NormalizedSpecValue extends DuxSpecValueItem {
  specId: string
  specName: string
}

interface NormalizedSpec {
  id: string
  name: string
  values: NormalizedSpecValue[]
}

interface SpecCombination {
  key: string
  map: Record<string, NormalizedSpecValue>
}

const SPEC_COLUMN_PREFIX = '__dux_spec__'

const getSpecColumnKey = (specId: string) => `${SPEC_COLUMN_PREFIX}${specId}`

function normalizePresetSpecs(specs: DuxSpecItem[] = []) {
  return (specs || []).map((spec) => {
    const normalizedValues = (spec.values?.length ? spec.values : [createSpecValue()]).map(value => ({
      ...value,
      id: value.id || createSpecValue().id,
    }))
    return {
      ...spec,
      id: spec.id || createSpec().id,
      values: normalizedValues,
    }
  })
}

function buildCombinations(specs: NormalizedSpec[]): SpecCombination[] {
  if (!specs.length) {
    return []
  }

  let combos: Record<string, NormalizedSpecValue>[] = [{}]

  specs.forEach((spec) => {
    const next: Record<string, NormalizedSpecValue>[] = []
    combos.forEach((entry) => {
      spec.values.forEach((value) => {
        next.push({
          ...entry,
          [spec.id]: value,
        })
      })
    })
    combos = next
  })

  return combos.map(map => ({
    key: specs.map(spec => map[spec.id]?.id || '').join('__'),
    map,
  }))
}

function buildRowFallbackKey(row: Record<string, any>, specs: NormalizedSpec[]) {
  return specs.map(spec => row[getSpecColumnKey(spec.id)] || '').join('__')
}

export const DuxSpec = defineComponent({
  name: 'DuxSpec',
  props: {
    columns: {
      type: Array as PropType<DuxDynamicDataColumn[]>,
      default: () => [],
    },
    value: Object as PropType<DuxSpecValueModel | undefined>,
    defaultValue: Object as PropType<DuxSpecValueModel | undefined>,
    onUpdateValue: Function as PropType<(value: DuxSpecValueModel | undefined) => void>,
    imageUploadProps: {
      type: Object as PropType<Partial<DuxSpecImageUploadProps>>,
      default: () => ({}),
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit, expose, slots }) {
    const { t } = useI18n()
    const model = useVModel(props, 'value', emit, {
      defaultValue: props.defaultValue || { specs: [], rows: [] },
      passive: true,
      deep: true,
    })

    const specEditorRef = ref<{ setPresetSpecs: (preset?: DuxSpecItem[]) => void } | null>(null)

    const ensureModelState = () => {
      if (!model.value) {
        model.value = {
          specs: [],
          rows: [],
        }
        return
      }
      if (!Array.isArray(model.value.specs)) {
        model.value.specs = []
      }
      if (!Array.isArray(model.value.rows)) {
        model.value.rows = []
      }
      if (model.value.rows.length === 0) {
        model.value.rows.push({ status: 1 })
      }
    }

    ensureModelState()

    const triggerChange = () => {
      props.onUpdateValue?.(model.value)
      emit('change', model.value)
    }

    const normalizedSpecs = computed<NormalizedSpec[]>(() => {
      ensureModelState()
      return (model.value?.specs || [])
        .map((spec) => {
          const trimmedName = (spec.name || '').trim()
          const values = (spec.values || [])
            .map<NormalizedSpecValue>(value => ({
              id: value.id,
              label: (value.label || '').trim(),
              specId: spec.id,
              specName: trimmedName,
            }))
            .filter(value => !!value.label)
          return {
            id: spec.id,
            name: trimmedName,
            values,
          }
        })
        .filter(spec => spec.name && spec.values.length)
    })

    const syncRowsWithSpecs = (specs: NormalizedSpec[]) => {
      ensureModelState()
      if (!specs.length) {
        let patched = false
        const rows = (model.value!.rows || []) as Record<string, any>[]
        if (!rows.length) {
          model.value!.rows = [{ status: 1 }]
          triggerChange()
        }
        else {
          rows.forEach((row) => {
            if (typeof row.status === 'undefined') {
              row.status = 1
              patched = true
            }
          })
          if (patched) {
            triggerChange()
          }
        }
        return
      }

      const existingRows = (model.value!.rows || []) as Record<string, any>[]
      const combinations = buildCombinations(specs)
      const previousRows = existingRows
      const previousMap = new Map<string, Record<string, any>>()
      previousRows.forEach((row) => {
        const key = row.__specKey || buildRowFallbackKey(row, specs)
        previousMap.set(key, row)
      })

      let changed = combinations.length !== previousRows.length

      const nextRows = combinations.map((combination) => {
        const existing = previousMap.get(combination.key)
        const row: Record<string, any> = existing ? { ...existing } : { status: 1 }
        row.__specKey = combination.key
        row.__specs = combination.map
        if (typeof row.status === 'undefined') {
          row.status = 1
        }
        specs.forEach((spec) => {
          const columnKey = getSpecColumnKey(spec.id)
          row[columnKey] = combination.map[spec.id]?.label || ''
        })
        if (!changed && existing) {
          const columnDiff = specs.some((spec) => {
            const columnKey = getSpecColumnKey(spec.id)
            return existing[columnKey] !== row[columnKey]
          })
          if (columnDiff) {
            changed = true
          }
        }
        if (!existing) {
          changed = true
        }
        return row
      })

      if (!changed) {
        return
      }

      model.value!.rows = nextRows
      triggerChange()
    }

    watch(normalizedSpecs, (specs) => {
      syncRowsWithSpecs(specs)
    }, {
      immediate: true,
    })

    const specColumns = computed<DuxDynamicDataColumn[]>(() => {
      return normalizedSpecs.value.map((spec) => {
        const columnKey = getSpecColumnKey(spec.id)
        return {
          key: columnKey,
          title: spec.name,
          width: 160,
          render: (row: Record<string, any>) => row?.[columnKey] || row?.__specs?.[spec.id]?.label || '',
        }
      })
    })

    const statusColumn = computed<DuxDynamicDataColumn>(() => ({
      key: '__dux_spec_status',
      title: t('components.spec.status'),
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (row: Record<string, any>) => (
        <NSwitch
          value={row.status !== 0 && row.status !== false}
          {...{
            'onUpdate:value': (value: boolean) => {
              row.status = value ? 1 : 0
              triggerChange()
            },
          }}
        />
      ),
    }))

    const mergedColumns = computed(() => {
      return [
        ...specColumns.value,
        ...(props.columns || []),
        statusColumn.value,
      ]
    })

    const setPresetSpecs = (specs: DuxSpecItem[] = []) => {
      if (specEditorRef.value && specEditorRef.value.setPresetSpecs) {
        specEditorRef.value.setPresetSpecs(specs)
        return
      }
      ensureModelState()
      model.value!.specs = normalizePresetSpecs(specs)
      triggerChange()
      syncRowsWithSpecs(normalizedSpecs.value)
    }

    expose({ setPresetSpecs })

    return () => (
      <div class="flex flex-col gap-4">
        <DuxSpecEditor
          ref={specEditorRef}
          value={model.value?.specs}
          defaultValue={props.defaultValue?.specs}
          imageUploadProps={props.imageUploadProps}
          {...{
            'onUpdate:value': (value: DuxSpecItem[]) => {
              ensureModelState()
              model.value!.specs = value
              triggerChange()
            },
          }}
          v-slots={{
            actions: () => slots?.actions?.(),
            namePrefix: scope => slots?.namePrefix?.(scope),
            valuePrefix: scope => slots?.valuePrefix?.(scope),
          }}
        />

        <DuxDynamicData
          value={model.value?.rows || []}
          columns={mergedColumns.value}
          createAction={false}
          deleteAction={false}
          moveAction={false}

          {...{
            'onUpdate:value': (rows: Record<string, any>[]) => {
              ensureModelState()
              model.value!.rows = rows
              triggerChange()
            },
          }}
        />
      </div>
    )
  },
})
