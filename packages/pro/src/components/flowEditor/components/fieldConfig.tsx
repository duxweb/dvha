import type { SelectMixedOption } from 'naive-ui/es/select/src/interface'
import type { PropType } from 'vue'
import type { FlowFieldConfigItem, FlowFieldConfigValue } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NInput, NSelect, NSwitch } from 'naive-ui'
import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import { DuxCodeEditor } from '../../code'

interface ModeOption {
  label: string
  value: 'text' | 'json' | 'code'
}

function createItem(index = 0): FlowFieldConfigItem {
  return {
    name: index === 0 ? 'content' : `content_${index + 1}`,
    type: 'text',
    content: '',
    description: '',
    label: '',
    required: false,
  }
}

function createDefaultValue(): FlowFieldConfigValue {
  return {
    mode: 'text',
    text: '',
    items: [createItem(0)],
    code: '',
  }
}

export const FlowFieldConfig = defineComponent({
  name: 'FlowFieldConfig',
  props: {
    modelValue: {
      type: Object as PropType<FlowFieldConfigValue | null>,
      default: () => null,
    },
    modeOptions: {
      type: Array as PropType<ModeOption[]>,
      default: () => [],
    },
    fieldTypeOptions: {
      type: Array as PropType<Array<{ label: string, value: string }>>,
      default: () => [],
    },
    textPlaceholder: {
      type: String,
      default: '',
    },
    jsonDescription: {
      type: String,
      default: '',
    },
    showLabelInput: {
      type: Boolean,
      default: false,
    },
    labelPlaceholder: {
      type: String,
      default: '字段显示名称',
    },
    showRequiredSwitch: {
      type: Boolean,
      default: false,
    },
    requiredLabel: {
      type: String,
      default: '必填',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const value = useVModel(props, 'modelValue', emit, {
      passive: false,
      deep: true,
      defaultValue: createDefaultValue(),
    })

    const ensureValue = () => {
      if (!value.value) {
        value.value = createDefaultValue()
        return
      }
      if (value.value.code === undefined) {
        value.value = {
          ...value.value,
          code: '',
        }
      }
    }

    const ensureJsonItems = () => {
      ensureValue()
      if (!value.value)
        return
      if (!Array.isArray(value.value.items) || value.value.items.length === 0) {
        value.value = {
          ...value.value,
          items: [createItem(0)],
        }
      }
    }

    watchEffect(() => {
      ensureValue()
      if (value.value?.mode === 'json') {
        ensureJsonItems()
      }
    })

    const mode = computed<ModeOption['value']>(() => {
      if (value.value?.mode === 'json' || value.value?.mode === 'code') {
        return value.value.mode
      }
      return 'text'
    })
    const resolvedModeOptions = computed<SelectMixedOption[]>(() => {
      if (props.modeOptions?.length) {
        return props.modeOptions as SelectMixedOption[]
      }
      return [
        { label: t('components.flowEditor.fieldConfig.modeText') || '文本模式', value: 'text' },
        { label: t('components.flowEditor.fieldConfig.modeJson') || 'JSON 模式', value: 'json' },
        { label: t('components.flowEditor.fieldConfig.modeCode') || '代码模式', value: 'code' },
      ]
    })
    const resolvedFieldTypeOptions = computed(() => props.fieldTypeOptions || [])
    const items = computed<FlowFieldConfigItem[]>(() => {
      if (Array.isArray(value.value?.items)) {
        return value.value!.items
      }
      return []
    })
    const updateValue = (next: FlowFieldConfigValue) => {
      value.value = next
    }

    const codeInput = ref(value.value?.code || '')

    watch(() => value.value?.code, (nextCode) => {
      const normalized = typeof nextCode === 'string' ? nextCode : ''
      if (codeInput.value !== normalized)
        codeInput.value = normalized
    }, { immediate: true })

    watch(codeInput, (nextVal) => {
      ensureValue()
      if (!value.value)
        return
      const normalized = nextVal || ''
      if (value.value.code === normalized)
        return
      updateValue({
        ...value.value,
        code: normalized,
      })
    })

    const setMode = (nextMode: ModeOption['value']) => {
      ensureValue()
      if (!value.value)
        return
      const next: FlowFieldConfigValue = {
        ...value.value,
        mode: nextMode,
      }
      if (nextMode === 'json' && (!Array.isArray(next.items) || next.items.length === 0)) {
        next.items = [createItem(0)]
      }
      if (nextMode === 'code') {
        if (typeof next.code !== 'string' || !next.code.trim()) {
          try {
            next.code = JSON.stringify(next.items ?? [], null, 2)
          }
          catch {
            next.code = ''
          }
        }
      }
      updateValue(next)
    }

    const updateText = (text: string) => {
      ensureValue()
      if (!value.value)
        return
      updateValue({
        ...value.value,
        text,
      })
    }

    const updateItems = (nextItems: FlowFieldConfigItem[]) => {
      ensureValue()
      if (!value.value)
        return
      updateValue({
        ...value.value,
        items: nextItems,
      })
    }

    const updateItem = (index: number, key: keyof FlowFieldConfigItem, fieldValue: any) => {
      const next = items.value.map((item, idx) => (idx === index ? { ...item, [key]: fieldValue } : item))
      updateItems(next)
    }

    const addItem = () => {
      const next = [...items.value, createItem(items.value.length)]
      updateItems(next)
    }

    const removeItem = (index: number) => {
      if (items.value.length <= 1) {
        updateItems([createItem(0)])
        return
      }
      updateItems(items.value.filter((_, idx) => idx !== index))
    }

    const renderJsonConfig = () => (
      <div class="space-y-3">
        {items.value.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            class="rounded-md border border-default bg-default p-3 space-y-2"
          >
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <NInput
                  class="flex-1"
                  value={item.name}
                  placeholder={t('components.flowEditor.fieldConfig.fieldNamePlaceholder') || '字段名称'}
                  onUpdateValue={val => updateItem(index, 'name', val || '')}
                />
                <NSelect
                  class="flex-1"
                  value={item.type}
                  options={resolvedFieldTypeOptions.value}
                  placeholder={t('components.flowEditor.fieldConfig.fieldTypePlaceholder') || '字段类型'}
                  onUpdateValue={val => updateItem(index, 'type', val || 'text')}
                />
                <NButton
                  circle
                  tertiary
                  size="small"
                  type="error"
                  disabled={items.value.length <= 1}
                  onClick={() => removeItem(index)}
                >
                  {{
                    icon: () => <div class="i-tabler:x size-4" />,
                  }}
                </NButton>
              </div>
              {props.showLabelInput && (
                <NInput
                  value={item.label || ''}
                  placeholder={props.labelPlaceholder || t('components.flowEditor.fieldConfig.labelPlaceholder') || '字段说明'}
                  onUpdateValue={val => updateItem(index, 'label', val || '')}
                />
              )}
            </div>
            <NInput
              value={item.content}
              type="textarea"
              autosize={{ minRows: 2, maxRows: 6 }}
              placeholder={props.textPlaceholder || t('components.flowEditor.fieldConfig.textPlaceholder') || ''}
              onUpdateValue={val => updateItem(index, 'content', val || '')}
            />
            <NInput
              value={item.description}
              placeholder={t('components.flowEditor.fieldConfig.notePlaceholder') || '备注说明'}
              onUpdateValue={val => updateItem(index, 'description', val || '')}
            />
            {props.showRequiredSwitch && (
              <div class="flex items-center justify-between text-sm text-muted">
                <span>{props.requiredLabel}</span>
                <NSwitch
                  value={!!item.required}
                  size="small"
                  onUpdateValue={val => updateItem(index, 'required', !!val)}
                />
              </div>
            )}
          </div>
        ))}

        <NButton dashed block type="primary" onClick={addItem}>
          {t('components.flowEditor.fieldConfig.addField') || '新增字段'}
        </NButton>

        {props.jsonDescription && (
          <div class="text-xs text-muted">{props.jsonDescription}</div>
        )}
      </div>
    )

    return () => (
      <div class="space-y-3">
        <NSelect
          value={mode.value}
          options={resolvedModeOptions.value}
          onUpdateValue={value => setMode((value as ModeOption['value']) || 'text')}
          placeholder={t('components.flowEditor.fieldConfig.modePlaceholder') || '请选择'}
        />

        {mode.value === 'text' && (
          <NInput
            value={value.value?.text || ''}
            type="textarea"
            autosize={{ minRows: 4, maxRows: 8 }}
            placeholder={props.textPlaceholder}
            onUpdateValue={val => updateText(val || '')}
          />
        )}

        {mode.value === 'json' && renderJsonConfig()}

        {mode.value === 'code' && (
          <div class="space-y-2">
            <DuxCodeEditor
              v-model:value={codeInput.value}
              lang="json"
            />
          </div>
        )}
      </div>
    )
  },
})
