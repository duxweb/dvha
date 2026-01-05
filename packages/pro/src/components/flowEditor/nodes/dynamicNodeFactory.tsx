import type { NodeProps } from '@vue-flow/core'
import type { VNodeChild } from 'vue'
import type { FlowDynamicFieldDefinition, FlowDynamicFieldPreviewContext, FlowDynamicFieldRenderContext, FlowDynamicNodeDefinition, FlowNodeData, FlowNodeRegistry } from '../types'
import { useI18n } from '@duxweb/dvha-core'
import { DuxSelect } from '@duxweb/dvha-naiveui'
import { useVueFlow } from '@vue-flow/core'
import { useVModel } from '@vueuse/core'
import cloneDeep from 'lodash-es/cloneDeep'
import { NColorPicker, NInput, NInputNumber, NSelect, NSwitch, NTag, useMessage } from 'naive-ui'
import { defineComponent, markRaw, ref, watch, watchEffect } from 'vue'
import { DuxFormItem, DuxFormLayout } from '../../form'
import { FlowFieldConfig } from '../components/fieldConfig'
import { FlowKVInput } from '../components/kvInput'
import { FlowNodeCard } from '../components/nodeCard'
import { FlowNote } from '../components/note'

const DEFAULT_PREVIEW_EMPTY = '-'

function normalizePreview(
  field: FlowDynamicFieldDefinition,
  context: FlowDynamicFieldPreviewContext,
) {
  if (field.preview === false) {
    return null
  }
  const base = typeof field.preview === 'object' ? field.preview : {}
  const type = base.type || (Array.isArray(context.value) ? 'tags' : 'text')
  const label = base.label || field.label || field.name
  return {
    label,
    type,
    emptyText: base.emptyText || DEFAULT_PREVIEW_EMPTY,
    tagType: base.tagType || 'default',
    maxTagCount: base.maxTagCount ?? 3,
    formatter: base.formatter,
    render: base.render,
  }
}

function renderTagList(
  values: any[],
  emptyText: string,
  tagType: string,
  maxTagCount: number,
) {
  if (!values.length) {
    return <span class="text-muted">{emptyText}</span>
  }
  const limited = values.slice(0, maxTagCount > 0 ? maxTagCount : values.length)
  return (
    <div class="flex flex-wrap gap-1">
      {limited.map((item, index) => (
        <NTag size="tiny" type={tagType as any} key={`${item?.name ?? item?.label ?? item}-${index}`}>
          {formatTagLabel(item)}
        </NTag>
      ))}
      {values.length > limited.length && (
        <NTag size="tiny" type="default">
          {`+${values.length - limited.length}`}
        </NTag>
      )}
    </div>
  )
}

function formatTagLabel(value: any) {
  if (value === null || value === undefined) {
    return DEFAULT_PREVIEW_EMPTY
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    return value.map(item => formatTagLabel(item)).join(', ')
  }
  if (typeof value === 'object') {
    return value.label || value.name || value.value || JSON.stringify(value)
  }
  return DEFAULT_PREVIEW_EMPTY
}

function renderPreviewValue(
  preview: ReturnType<typeof normalizePreview>,
  context: FlowDynamicFieldPreviewContext,
) {
  if (!preview) {
    return null
  }
  if (preview.render) {
    return preview.render(context)
  }
  if (preview.formatter) {
    const formatted = preview.formatter(context)
    if (formatted !== undefined && formatted !== null && formatted !== '') {
      return formatted
    }
  }

  if (preview.type === 'tags') {
    const values = Array.isArray(context.value) ? context.value : []
    return renderTagList(values, preview.emptyText, preview.tagType, preview.maxTagCount)
  }

  if (context.value === undefined || context.value === null || context.value === '') {
    return <span class="text-muted">{preview.emptyText}</span>
  }

  if (typeof context.value === 'string' || typeof context.value === 'number' || typeof context.value === 'boolean') {
    return <span class="truncate block">{String(context.value)}</span>
  }

  return (
    <span class="truncate block">{JSON.stringify(context.value)}</span>
  )
}

function renderDefaultPreview(nodeProps: NodeProps<FlowNodeData>, definition: FlowDynamicNodeDefinition) {
  const fields = (definition.settingFields || []).filter(field => !field.hideInPreview)
  if (!fields.length) {
    const description = nodeProps.data?.description
    return (
      <div class="text-xs text-muted">
        {description || DEFAULT_PREVIEW_EMPTY}
      </div>
    )
  }

  const rows: VNodeChild[] = []
  for (const field of fields) {
    const context: FlowDynamicFieldPreviewContext = {
      value: nodeProps.data?.config?.[field.name] ?? field.defaultValue,
      field,
      data: nodeProps.data,
      nodeProps,
    }
    const preview = normalizePreview(field, context)
    if (!preview) {
      continue
    }
    const previewValue = renderPreviewValue(preview, context)

    rows.push(
      <span key={`label-${field.name}`} class="text-xs text-muted text-right whitespace-nowrap">{preview.label}</span>,
      <div key={`value-${field.name}`} class="text-xs text-default min-w-0">
        {previewValue}
      </div>,
    )
  }

  if (!rows.length) {
    const description = nodeProps.data?.description
    return <div class="text-xs text-muted">{description || DEFAULT_PREVIEW_EMPTY}</div>
  }

  return (
    <div
      class="grid gap-y-1.5 gap-x-2 items-start"
      style={{ gridTemplateColumns: 'max-content 1fr' }}
    >
      {rows}
    </div>
  )
}

function createDynamicNodeComponent(definition: FlowDynamicNodeDefinition) {
  const component = (props: NodeProps<FlowNodeData>) => {
    const previewContent = definition.renderPreview
      ? definition.renderPreview({ nodeProps: props, settingFields: definition.settingFields || [] })
      : renderDefaultPreview(props, definition)
    return (
      <FlowNodeCard
        nodeProps={props}
        color={definition.color || 'primary'}
      >
        {previewContent}
      </FlowNodeCard>
    )
  }

  return markRaw(component)
}

function createDynamicSettingComponent(definition: FlowDynamicNodeDefinition) {
  return markRaw(defineComponent({
    name: `FlowDynamicNodeSetting_${definition.type || 'custom'}`,
    props: {
      modelValue: {
        type: Object,
        default: () => ({}),
      },
      nodeId: {
        type: String,
        default: '',
      },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const message = useMessage()
      const { getNodes, setNodes, getEdges, setEdges } = useVueFlow()
      const data = useVModel(props, 'modelValue', emit, {
        passive: false,
        deep: true,
      })
      const nodeIdInput = ref(props.nodeId || '')

      watch(() => props.nodeId, (newId) => {
        nodeIdInput.value = newId || ''
      })

      const renameNodeId = (nextId: string) => {
        const trimmed = nextId.trim()
        if (!trimmed || trimmed === props.nodeId)
          return

        const hasConflict = getNodes.value.some(node => node.id === trimmed)
        if (hasConflict) {
          message.error(t('components.flowEditor.nodeIdExists') || '节点 ID 已存在')
          nodeIdInput.value = props.nodeId || ''
          return
        }

        const updatedNodes = getNodes.value.map((node) => {
          if (node.id === props.nodeId) {
            return {
              ...node,
              id: trimmed,
            }
          }
          return node
        })

        const updatedEdges = getEdges.value.map((edge) => {
          const nextEdge = { ...edge }
          if (nextEdge.source === props.nodeId)
            nextEdge.source = trimmed
          if (nextEdge.target === props.nodeId)
            nextEdge.target = trimmed
          return nextEdge
        })

        setNodes(updatedNodes)
        setEdges(updatedEdges)
      }

      watchEffect(() => {
        const current = data.value || {}
        let next: any = current
        let changed = false

        const ensureNext = () => {
          if (next === current) {
            next = { ...next }
          }
        }

        if ((next.label === undefined || next.label === null) && definition.label) {
          ensureNext()
          next.label = definition.label
          changed = true
        }

        if ((next.description === undefined || next.description === null) && definition.description) {
          ensureNext()
          next.description = definition.description
          changed = true
        }

        let config = next.config
        let configChanged = false

        if (!config) {
          ensureNext()
          config = {}
          next.config = config
          configChanged = true
        }

        const defaults = definition.defaultConfig || {}
        Object.entries(defaults).forEach(([key, value]) => {
          if (config![key] === undefined) {
            if (!configChanged) {
              config = { ...config }
              ensureNext()
              next.config = config
              configChanged = true
            }
            config![key] = cloneDeep(value)
          }
        })

        if (changed || configChanged) {
          data.value = next
        }
      })

      const updateNodeData = (payload: Partial<FlowNodeData>) => {
        const current = data.value || {}
        data.value = {
          ...current,
          ...payload,
        }
      }

      const updateField = (name: string, value: any) => {
        const current = data.value || {}
        const nextConfig = {
          ...(current.config || {}),
          [name]: value,
        }
        data.value = {
          ...current,
          config: nextConfig,
        }
      }

      const renderFieldInput = (field: FlowDynamicFieldDefinition) => {
        const currentValue = data.value?.config?.[field.name] ?? field.defaultValue
        const context: FlowDynamicFieldRenderContext = {
          value: currentValue,
          field,
          data: (data.value || {}) as FlowNodeData,
          update: (val: any) => updateField(field.name, val),
        }

        if (typeof field.render === 'function') {
          return field.render(context)
        }

        const componentType = field.component || 'text'
        const componentProps = field.componentProps || {}
        switch (componentType) {
          case 'textarea':
            return (
              <NInput
                value={currentValue ?? ''}
                type="textarea"
                rows={field.rows || 3}
                placeholder={field.placeholder || ''}
                onUpdateValue={value => updateField(field.name, value)}
              />
            )
          case 'number':
            return (
              <NInputNumber
                value={typeof currentValue === 'number' ? currentValue : Number(currentValue)}
                placeholder={field.placeholder || ''}
                onUpdateValue={value => updateField(field.name, value)}
              />
            )
          case 'select':
            return (
              <NSelect
                value={currentValue}
                options={field.options || []}
                placeholder={field.placeholder || ''}
                onUpdateValue={value => updateField(field.name, value)}
              />
            )
          case 'switch':
            return (
              <NSwitch
                value={Boolean(currentValue)}
                onUpdateValue={value => updateField(field.name, value)}
              />
            )
          case 'color':
            return (
              <NColorPicker
                value={currentValue}
                onUpdateValue={value => updateField(field.name, value)}
              />
            )
          case 'field-config':
            return (
              <FlowFieldConfig
                modelValue={currentValue}
                onUpdate:modelValue={value => updateField(field.name, value)}
                {...componentProps}
              />
            )
          case 'kv-input':
            return (
              <FlowKVInput
                modelValue={currentValue}
                onUpdate:modelValue={value => updateField(field.name, value)}
                {...componentProps}
              />
            )
          case 'dux-select':
            return (
              <DuxSelect
                value={currentValue}
                onUpdateValue={value => updateField(field.name, value)}
                {...componentProps}
              />
            )
          case 'note':
            return (
              <FlowNote
                content={currentValue ?? field.defaultValue}
                {...componentProps}
              />
            )
          case 'json':
            return (
              <NInput
                value={typeof currentValue === 'string' ? currentValue : JSON.stringify(currentValue ?? {}, null, 2)}
                type="textarea"
                rows={field.rows || 6}
                placeholder={field.placeholder || ''}
                onUpdateValue={(value) => {
                  try {
                    updateField(field.name, value ? JSON.parse(value) : {})
                  }
                  catch {
                    updateField(field.name, value)
                  }
                }}
              />
            )
          default:
            return (
              <NInput
                value={currentValue ?? ''}
                placeholder={field.placeholder || ''}
                onUpdateValue={value => updateField(field.name, value)}
              />
            )
        }
      }

      return () => (
        <DuxFormLayout labelPlacement="top">
          {definition.allowNodeIdEdit !== false && (
            <DuxFormItem label={t('components.flowEditor.nodeId') || '节点 ID'}>
              <NInput
                value={nodeIdInput.value}
                placeholder={t('components.flowEditor.nodeIdPlaceholder') || '例如：custom_node'}
                onUpdateValue={value => nodeIdInput.value = value}
                onBlur={() => renameNodeId(nodeIdInput.value)}
              />
            </DuxFormItem>
          )}

          {definition.allowLabelEdit !== false && (
            <DuxFormItem label={t('components.flowEditor.label') || ''}>
              <NInput
                value={data.value?.label || ''}
                onUpdateValue={value => updateNodeData({ label: value })}
              />
            </DuxFormItem>
          )}

          {definition.allowDescriptionEdit !== false && (
            <DuxFormItem label={t('components.flowEditor.description') || ''}>
              <NInput
                value={data.value?.description || ''}
                type="textarea"
                rows={3}
                onUpdateValue={value => updateNodeData({ description: value })}
              />
            </DuxFormItem>
          )}

          {(definition.settingFields || []).map(field => (
            <DuxFormItem
              key={field.name}
              label={field.label || field.name}
              description={field.description}
              required={field.required}
              labelPlacement="top"
            >
              {renderFieldInput(field)}
            </DuxFormItem>
          ))}
        </DuxFormLayout>
      )
    },
  }))
}

export function createDynamicFlowNode(definition: FlowDynamicNodeDefinition): FlowNodeRegistry | null {
  const type = definition.type?.trim()
  if (!type) {
    return null
  }

  const meta = {
    name: type,
    label: definition.label || type,
    description: definition.description,
    category: definition.category || 'custom',
    nodeType: definition.nodeType || 'process',
    icon: definition.icon || 'i-tabler:puzzle',
    color: definition.color || 'primary',
    style: definition.style,
    defaultConfig: definition.defaultConfig ? cloneDeep(definition.defaultConfig) : undefined,
  }

  return {
    meta,
    component: definition.component || createDynamicNodeComponent(definition),
    settingComponent: definition.settingComponent || createDynamicSettingComponent(definition),
    multiInput: definition.multiInput,
    multiOutput: definition.multiOutput,
  }
}

export function createDynamicFlowNodes(
  definitions: FlowDynamicNodeDefinition[] | Record<string, FlowDynamicNodeDefinition> = [],
): Record<string, FlowNodeRegistry> {
  const list = Array.isArray(definitions)
    ? definitions
    : Object.entries(definitions).map(([key, value]) => ({
        ...(value || {}),
        type: value?.type || key,
      }))

  return list.reduce<Record<string, FlowNodeRegistry>>((acc, definition) => {
    if (!definition) {
      return acc
    }
    const registry = createDynamicFlowNode(definition)
    if (registry) {
      acc[registry.meta.name] = registry
    }
    return acc
  }, {})
}
