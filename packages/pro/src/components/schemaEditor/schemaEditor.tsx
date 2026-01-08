import type { PropType } from 'vue'
import type { SchemaParamField, SchemaTreeNode, SchemaTypeOption } from './types'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import cloneDeep from 'lodash-es/cloneDeep'
import { NButton, NEmpty, NForm, NFormItem, NInput, NInputNumber, NSelect, NSwitch, NTag, NTree } from 'naive-ui'
import { computed, defineComponent, markRaw, ref, watch } from 'vue'
import { useModal } from '../../hooks'
import { DuxModalPage } from '../modal'

interface TreeOptionWithSchema {
  key: string
  label: string
  schema: SchemaTreeNode
  children?: TreeOptionWithSchema[]
}

const DEFAULT_TYPES: SchemaTypeOption[] = [
  { label: 'Object', value: 'object', tagType: 'info' },
  { label: 'Array', value: 'array', tagType: 'success' },
  { label: 'String', value: 'string', tagType: 'default' },
  { label: 'Number', value: 'number', tagType: 'warning' },
  { label: 'Boolean', value: 'boolean', tagType: 'error' },
]

const createRandomId = () => `schema_${Math.random().toString(36).slice(2, 8)}`

function normalizeNode(node: SchemaTreeNode, fallbackName?: string, fallbackType?: string): SchemaTreeNode {
  return {
    id: node.id || createRandomId(),
    name: node.name?.trim() || fallbackName || '',
    type: node.type || fallbackType || '',
    description: node.description,
    params: node.params ? cloneDeep(node.params) : {},
    children: Array.isArray(node.children) ? cloneDeep(node.children) : [],
  }
}

const SchemaNodeModal = defineComponent({
  name: 'SchemaNodeModal',
  props: {
    node: {
      type: Object as PropType<SchemaTreeNode>,
      required: true,
    },
    typeOptions: {
      type: Array as PropType<SchemaTypeOption[]>,
      default: () => DEFAULT_TYPES,
    },
    paramFields: {
      type: Array as PropType<SchemaParamField[]>,
      default: () => [],
    },
    onSubmit: {
      type: Function as PropType<(node: SchemaTreeNode) => void>,
    },
    onClose: {
      type: Function as PropType<() => void>,
    },
    onConfirm: {
      type: Function as PropType<(node: SchemaTreeNode) => void>,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const form = ref<SchemaTreeNode>(cloneDeep(props.node))

    watch(() => props.node, (next) => {
      form.value = cloneDeep(next || {
        id: createRandomId(),
        name: '',
        type: props.typeOptions?.[0]?.value || DEFAULT_TYPES[0].value,
        params: {},
        children: [],
      })
    }, { immediate: true, deep: true })

    const resolvedTypeOptions = computed<SchemaTypeOption[]>(() => props.typeOptions?.length ? props.typeOptions : DEFAULT_TYPES)
    const selectTypeOptions = computed(() => resolvedTypeOptions.value.map(option => ({
      label: option.label,
      value: option.value,
    })))

    const updateField = (key: keyof SchemaTreeNode, value: any) => {
      form.value = {
        ...form.value,
        [key]: value,
      }
    }

    const updateParam = (field: SchemaParamField, value: any) => {
      form.value = {
        ...form.value,
        params: {
          ...(form.value.params || {}),
          [field.key]: value,
        },
      }
    }

    const renderParamInput = (field: SchemaParamField) => {
      const value = form.value.params?.[field.key]
      const component = field.component || 'input'
      const extraProps = field.componentProps || {}

      if (component === 'select') {
        return (
          <NSelect
            value={value}
            options={field.options || []}
            placeholder={field.placeholder}
            onUpdateValue={val => updateParam(field, val)}
            disabled={props.readonly}
            {...extraProps}
          />
        )
      }

      if (component === 'number') {
        return (
          <NInputNumber
            value={typeof value === 'number' ? value : Number(value)}
            placeholder={field.placeholder}
            onUpdateValue={val => updateParam(field, val)}
            disabled={props.readonly}
            {...extraProps}
          />
        )
      }

      if (component === 'switch') {
        return (
          <NSwitch
            value={!!value}
            onUpdateValue={val => updateParam(field, val)}
            disabled={props.readonly}
            {...extraProps}
          />
        )
      }

      if (component === 'textarea') {
        return (
          <NInput
            value={value}
            type="textarea"
            rows={field.rows || 3}
            placeholder={field.placeholder}
            onUpdateValue={val => updateParam(field, val)}
            disabled={props.readonly}
            {...extraProps}
          />
        )
      }

      return (
        <NInput
          value={value}
          placeholder={field.placeholder}
          onUpdateValue={val => updateParam(field, val)}
          disabled={props.readonly}
          {...extraProps}
        />
      )
    }

    const submit = () => {
      const fallbackType = resolvedTypeOptions.value[0]?.value || 'object'
      const payload = normalizeNode(
        form.value,
        t('components.schemaEditor.newNode'),
        fallbackType,
      )
      props.onSubmit?.(payload)
      props.onConfirm?.(payload)
    }

    return () => (
      <DuxModalPage title={t('components.schemaEditor.editModalTitle')} onClose={props.onClose}>
        {{
          default: () => (
            <NForm labelPlacement="top" class="flex flex-col gap-4">
              <div class="grid gap-4 md:grid-cols-2">
                <NFormItem showFeedback={false} label={t('components.schemaEditor.nodeName')}>
                  <NInput
                    value={form.value.name}
                    placeholder={t('components.schemaEditor.nodeNamePlaceholder')}
                    onUpdateValue={val => updateField('name', val)}
                    disabled={props.readonly}
                  />
                </NFormItem>
                <NFormItem label={t('components.schemaEditor.nodeType')} showFeedback={false}>
                  <NSelect
                    value={form.value.type}
                    options={selectTypeOptions.value}
                    placeholder={t('components.schemaEditor.nodeTypePlaceholder')}
                    onUpdateValue={val => updateField('type', val)}
                    disabled={props.readonly}
                  />
                </NFormItem>
              </div>
              <NFormItem label={t('components.schemaEditor.description')} showFeedback={false}>
                <NInput
                  value={form.value.description}
                  type="textarea"
                  rows={3}
                  placeholder={t('components.schemaEditor.descriptionPlaceholder')}
                  onUpdateValue={val => updateField('description', val)}
                  disabled={props.readonly}
                />
              </NFormItem>
              {props.paramFields.length > 0 && props.paramFields.map(field => (
                <NFormItem key={field.key} label={field.label} showFeedback={false}>
                  {renderParamInput(field)}
                </NFormItem>
              ))}
            </NForm>
          ),
          footer: () => (
            <div class="flex justify-end gap-2">
              <NButton onClick={props.onClose}>
                {t('components.button.cancel')}
              </NButton>
              <NButton type="primary" onClick={submit}>
                {t('components.button.confirm')}
              </NButton>
            </div>
          ),
        }}
      </DuxModalPage>
    )
  },
})

const SchemaNodeModalRaw = markRaw(SchemaNodeModal)

export const DuxSchemaTreeEditor = defineComponent({
  name: 'DuxSchemaTreeEditor',
  props: {
    modelValue: {
      type: Array as PropType<SchemaTreeNode[]>,
      default: () => [],
    },
    typeOptions: {
      type: Array as PropType<SchemaTypeOption[]>,
      default: () => DEFAULT_TYPES,
    },
    paramFields: {
      type: Array as PropType<SchemaParamField[]>,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const modal = useModal()
    const treeState = useVModel(props, 'modelValue', emit, {
      passive: false,
      deep: true,
      defaultValue: [],
    })
    const selectedKey = ref<string | null>(null)

    const typeOptions = computed<SchemaTypeOption[]>(() =>
      (props.typeOptions?.length ? props.typeOptions : DEFAULT_TYPES).map(option => ({
        tagType: 'default',
        ...option,
      })),
    )
    const typeMap = computed<Record<string, SchemaTypeOption>>(() => {
      return typeOptions.value.reduce((acc, option) => {
        acc[option.value] = option
        return acc
      }, {} as Record<string, SchemaTypeOption>)
    })

    const ensureTree = () => Array.isArray(treeState.value) ? treeState.value : []

    const findNodeById = (nodes: SchemaTreeNode[], id: string | null): SchemaTreeNode | null => {
      if (!id)
        return null
      for (const node of nodes) {
        if (node.id === id)
          return node
        if (node.children?.length) {
          const match = findNodeById(node.children, id)
          if (match)
            return match
        }
      }
      return null
    }

    const assignNode = (nodeId: string, handler: (node: SchemaTreeNode) => SchemaTreeNode) => {
      const cloned = cloneDeep(ensureTree())
      const walk = (nodes: SchemaTreeNode[]): boolean => {
        for (const node of nodes) {
          if (node.id === nodeId) {
            const next = handler(node)
            Object.assign(node, next)
            return true
          }
          if (node.children?.length && walk(node.children))
            return true
        }
        return false
      }
      if (walk(cloned))
        treeState.value = cloned
    }

    const removeNode = (nodeId: string) => {
      if (props.readonly)
        return
      const cloned = cloneDeep(ensureTree())
      let removed = false
      const walk = (nodes: SchemaTreeNode[]): SchemaTreeNode[] => {
        return nodes
          .map((node) => {
            if (node.children?.length)
              node.children = walk(node.children)
            return node
          })
          .filter((node) => {
            if (node.id === nodeId) {
              removed = true
              return false
            }
            return true
          })
      }

      treeState.value = walk(cloned)
      if (removed) {
        if (selectedKey.value === nodeId) {
          selectedKey.value = treeState.value?.[0]?.id || null
          emit('select', selectedKey.value ? findNodeById(treeState.value, selectedKey.value) : null)
        }
      }
    }

    const createNode = (overrides?: Partial<SchemaTreeNode>): SchemaTreeNode => ({
      id: overrides?.id || createRandomId(),
      name: overrides?.name || t('components.schemaEditor.newNode') || '',
      type: overrides?.type || typeOptions.value[0]?.value || 'object',
      description: overrides?.description,
      params: overrides?.params || {},
      children: overrides?.children ? cloneDeep(overrides.children) : [],
    })

    const openNodeForm = (title: string, initial: SchemaTreeNode, onSubmit: (node: SchemaTreeNode) => void) => {
      if (props.readonly)
        return
      modal.show({
        title,
        width: 640,
        component: SchemaNodeModalRaw,
        componentProps: {
          node: cloneDeep(initial),
          typeOptions: typeOptions.value,
          paramFields: props.paramFields,
          onSubmit,
          readonly: props.readonly,
        },
      })
    }

    const handleAddRoot = () => {
      const draft = createNode()
      openNodeForm(t('components.schemaEditor.addRootTitle') || '', draft, (node) => {
        const nextNode = normalizeNode(node, t('components.schemaEditor.newNode'), node.type || (typeOptions.value[0]?.value || 'object'))
        treeState.value = [...ensureTree(), nextNode]
        updateSelection(nextNode.id)
      })
    }

    const handleAddChild = () => {
      const targetId = selectedKey.value
      if (!targetId) {
        handleAddRoot()
        return
      }
      const draft = createNode({ name: t('components.schemaEditor.childNode') })
      openNodeForm(t('components.schemaEditor.addChildTitle') || '', draft, (node) => {
        const nextNode = normalizeNode(node, t('components.schemaEditor.childNode'), node.type || (typeOptions.value[0]?.value || 'object'))
        assignNode(targetId, parent => ({
          ...parent,
          children: [...(parent.children || []), nextNode],
        }))
        updateSelection(nextNode.id)
      })
    }

    const findParentId = (childId: string): string | null => {
      const walk = (nodes: SchemaTreeNode[], parentId: string | null): string | null => {
        for (const node of nodes) {
          if (node.id === childId)
            return parentId
          if (node.children?.length) {
            const result = walk(node.children, node.id)
            if (result)
              return result
          }
        }
        return null
      }
      return walk(ensureTree(), null)
    }

    const handleDuplicate = (nodeId: string | null) => {
      if (!nodeId)
        return
      const original = findNodeById(ensureTree(), nodeId)
      if (!original)
        return
      const draft = createNode({
        ...cloneDeep(original),
        id: undefined,
        name: `${original.name || t('components.schemaEditor.newNode')} ${t('components.schemaEditor.copySuffix')}`,
      })
      openNodeForm(t('components.schemaEditor.duplicateTitle') || '', draft, (node) => {
        const nextNode = normalizeNode(node, draft.name || t('components.schemaEditor.newNode'), node.type || draft.type)
        const parentId = findParentId(nodeId)
        if (!parentId) {
          treeState.value = [...ensureTree(), nextNode]
        }
        else {
          assignNode(parentId, parent => ({
            ...parent,
            children: [...(parent.children || []), nextNode],
          }))
        }
        updateSelection(nextNode.id)
      })
    }

    const treeOptions = computed<TreeOptionWithSchema[]>(() => {
      const build = (nodes: SchemaTreeNode[]): TreeOptionWithSchema[] => {
        return nodes.map(node => ({
          key: node.id,
          label: node.name || t('components.schemaEditor.untitled'),
          schema: node,
          children: node.children?.length ? build(node.children) : undefined,
        })) as any
      }
      return build(ensureTree())
    })

    const currentNode = computed(() => findNodeById(ensureTree(), selectedKey.value))

    function updateSelection(key: string | null) {
      selectedKey.value = key
      emit('select', key ? findNodeById(ensureTree(), key) : null)
    }

    const handleTreeSelect = (keys: (string | number)[]) => {
      updateSelection((keys?.[0] as string) || null)
    }

    watch(treeState, (nodes) => {
      if (!Array.isArray(nodes) || !nodes.length) {
        updateSelection(null)
        return
      }
      if (!selectedKey.value || !findNodeById(nodes, selectedKey.value)) {
        updateSelection(nodes[0].id)
      }
    }, { deep: true, immediate: true })

    const handleEditNode = () => {
      if (!currentNode.value || props.readonly)
        return
      openNodeForm(t('components.schemaEditor.editNodeTitle') || '', cloneDeep(currentNode.value), (node) => {
        assignNode(currentNode.value!.id, () => ({
          ...node,
          id: currentNode.value!.id,
        }))
      })
    }

    const formatParamValue = (field: SchemaParamField, node: SchemaTreeNode) => {
      const value = node.params?.[field.key]
      if (value === undefined || value === null || value === '')
        return t('components.schemaEditor.paramsEmpty')
      if (typeof value === 'object')
        return JSON.stringify(value)
      return String(value)
    }

    return () => (
      <div class="flex flex-col gap-4 lg:flex-row min-h-[300px]">

        <div class="rounded-lg border border-default bg-default p-3 flex flex-col gap-4">

          <div class="flex flex-wrap items-center gap-2">
            <NButton size="small" type="primary" disabled={props.readonly} onClick={handleAddRoot}>
              {t('components.schemaEditor.addRoot')}
            </NButton>
            <NButton size="small" tertiary disabled={props.readonly || !selectedKey.value} onClick={handleAddChild}>
              {t('components.schemaEditor.addChild')}
            </NButton>
            <NButton size="small" tertiary disabled={props.readonly || !selectedKey.value} onClick={() => handleDuplicate(selectedKey.value)}>
              {t('components.schemaEditor.duplicate')}
            </NButton>
            <NButton size="small" tertiary type="error" disabled={props.readonly || !selectedKey.value} onClick={() => selectedKey.value && removeNode(selectedKey.value)}>
              {t('components.schemaEditor.remove')}
            </NButton>
          </div>

          {treeOptions.value.length
            ? (
                <NTree
                  data={treeOptions.value as any}
                  blockLine
                  selectable
                  defaultExpandAll
                  selectedKeys={selectedKey.value ? [selectedKey.value] : []}
                  renderLabel={({ option }) => {
                    const schema = (option?.schema || {}) as SchemaTreeNode
                    const type = typeMap.value[schema.type]
                    return (
                      <div class="flex items-center justify-between gap-3 pr-1 py-1">
                        <div class="min-w-0">
                          <div class="text-sm font-medium truncate">
                            {schema.name || t('components.schemaEditor.untitled')}
                          </div>
                          <div class="text-xs text-muted truncate">
                            {type?.label || schema.type}
                          </div>
                        </div>
                        <NTag size="small" type={type?.tagType || 'default'}>
                          {type?.label || schema.type}
                        </NTag>
                      </div>
                    )
                  }}
                  onUpdateSelectedKeys={handleTreeSelect}
                />
              )
            : (
                <NEmpty description={t('components.schemaEditor.empty')}>
                  {{
                    extra: () => (
                      <NButton type="primary" size="small" onClick={handleAddRoot} disabled={props.readonly}>
                        {t('components.schemaEditor.addFirst')}
                      </NButton>
                    ),
                  }}
                </NEmpty>
              )}
        </div>
        <div class="flex-1 rounded-lg border border-default bg-default p-4">
          {currentNode.value
            ? (
                <div class="space-y-4">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0 space-y-1">
                        <div class="text-lg font-semibold truncate flex items-center gap-2">
                          <span class="truncate">{currentNode.value.name || t('components.schemaEditor.untitled')}</span>
                          {!props.readonly && (
                            <button
                              type="button"
                              class="text-primary hover:text-primary-700 transition-colors cursor-pointer"
                              onClick={handleEditNode}
                            >
                              <div class="i-tabler:edit size-4" />
                            </button>
                          )}
                        </div>
                        <div class="text-sm text-muted">
                          {currentNode.value.description || t('components.schemaEditor.noDescription')}
                        </div>
                      </div>
                      <NTag size="small" type={typeMap.value[currentNode.value.type]?.tagType || 'default'}>
                        {typeMap.value[currentNode.value.type]?.label || currentNode.value.type}
                      </NTag>
                    </div>
                  </div>

                  <div class="space-y-2">
                    {props.paramFields.length > 0
                      ? props.paramFields.map(field => (
                          <div key={field.key} class="flex items-start justify-between gap-3 text-sm">
                            <span class="text-muted">{field.label}</span>
                            <span class="text-default text-right break-all">
                              {formatParamValue(field, currentNode.value!)}
                            </span>
                          </div>
                        ))
                      : (
                          <div class="text-sm text-muted">
                            {t('components.schemaEditor.paramsEmpty')}
                          </div>
                        )}
                  </div>

                  {!props.readonly && (
                    <div class="flex gap-2">
                      {/* 保留入口以备将来扩展其它操作 */}
                    </div>
                  )}
                </div>
              )
            : (
                <div class="flex h-full flex-col items-center justify-center text-center text-sm text-muted">
                  {t('components.schemaEditor.selectHint')}
                </div>
              )}
        </div>
      </div>
    )
  },
})
