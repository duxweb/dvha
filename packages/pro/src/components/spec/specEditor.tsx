import type { PropType, Ref } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NCheckbox, NInput } from 'naive-ui'
import { computed, defineComponent, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { DuxImageUpload } from '../upload'

export interface DuxSpecValueItem {
  id: string
  label: string
  image?: string
}

export interface DuxSpecItem {
  id: string
  name: string
  values: DuxSpecValueItem[]
  is_image?: boolean
}

export type DuxSpecImageUploadProps = InstanceType<typeof DuxImageUpload>['$props']

const createId = (() => {
  let seed = 0
  return (prefix: string) => {
    seed += 1
    return `${prefix}_${Date.now().toString(36)}_${seed}`
  }
})()

export function createSpecValue(): DuxSpecValueItem {
  return {
    id: createId('spec_value'),
    label: '',
    image: '',
  }
}

export function createSpec(): DuxSpecItem {
  return {
    id: createId('spec'),
    name: '',
    values: [createSpecValue()],
    is_image: false,
  }
}

export const DuxSpecEditor = defineComponent({
  name: 'DuxSpecEditor',
  props: {
    value: Array as PropType<DuxSpecItem[]>,
    defaultValue: {
      type: Array as PropType<DuxSpecItem[]>,
      default: () => [],
    },
    imageUploadProps: {
      type: Object as PropType<Partial<DuxSpecImageUploadProps>>,
      default: () => ({}),
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit, expose, slots }) {
    const { t } = useI18n()
    const specs = useVModel(props, 'value', emit, {
      passive: true,
      deep: true,
      defaultValue: props.defaultValue || [],
    })

    const ensureSpecs = () => {
      if (!specs.value) {
        specs.value = []
      }
    }

    ensureSpecs()

    const specNameBuffers = new Map<string, Ref<string>>()
    const specValueBuffers = new Map<string, Ref<string>>()
    const editingSpecNames = new Set<string>()
    const editingSpecValues = new Set<string>()

    const mergedImageUploadProps = computed(() => ({
      manager: true,
      multiple: false,
      ...(props.imageUploadProps || {}),
    }))

    const ensureSpecNameBuffer = (spec: DuxSpecItem) => {
      const nextValue = spec.name || ''
      let buffer = specNameBuffers.get(spec.id)
      if (!buffer) {
        buffer = ref(nextValue)
        specNameBuffers.set(spec.id, buffer)
      }
      else if (!editingSpecNames.has(spec.id) && buffer.value !== nextValue) {
        buffer.value = nextValue
      }
      return buffer
    }

    const ensureSpecValueBuffer = (value: DuxSpecValueItem) => {
      const nextValue = value.label || ''
      let buffer = specValueBuffers.get(value.id)
      if (!buffer) {
        buffer = ref(nextValue)
        specValueBuffers.set(value.id, buffer)
      }
      else if (!editingSpecValues.has(value.id) && buffer.value !== nextValue) {
        buffer.value = nextValue
      }
      return buffer
    }

    const removeSpecBuffers = (spec?: DuxSpecItem) => {
      if (!spec) {
        return
      }
      specNameBuffers.delete(spec.id)
      editingSpecNames.delete(spec.id)
      spec.values?.forEach((value) => {
        specValueBuffers.delete(value.id)
        editingSpecValues.delete(value.id)
      })
    }

    const removeSpecValueBuffer = (value?: DuxSpecValueItem) => {
      if (!value) {
        return
      }
      specValueBuffers.delete(value.id)
      editingSpecValues.delete(value.id)
    }

    const syncBuffersFromSpecs = (list: DuxSpecItem[] = []) => {
      editingSpecNames.clear()
      editingSpecValues.clear()
      const specIds = new Set<string>()
      const valueIds = new Set<string>()
      list.forEach((spec) => {
        specIds.add(spec.id)
        const nameBuffer = specNameBuffers.get(spec.id)
        if (!nameBuffer) {
          specNameBuffers.set(spec.id, ref(spec.name || ''))
        }
        else {
          nameBuffer.value = spec.name || ''
        }
        spec.values?.forEach((value) => {
          valueIds.add(value.id)
          const valueBuffer = specValueBuffers.get(value.id)
          if (!valueBuffer) {
            specValueBuffers.set(value.id, ref(value.label || ''))
          }
          else {
            valueBuffer.value = value.label || ''
          }
        })
      })

      Array.from(specNameBuffers.keys()).forEach((id) => {
        if (!specIds.has(id)) {
          specNameBuffers.delete(id)
          editingSpecNames.delete(id)
        }
      })
      Array.from(specValueBuffers.keys()).forEach((id) => {
        if (!valueIds.has(id)) {
          specValueBuffers.delete(id)
          editingSpecValues.delete(id)
        }
      })
    }

    watch(specs, (next) => {
      syncBuffersFromSpecs(next || [])
    }, {
      immediate: true,
    })

    const triggerChange = () => {
      emit('change', specs.value || [])
    }

    const addSpec = () => {
      ensureSpecs()
      const spec = createSpec()
      specs.value!.push(spec)
      ensureSpecNameBuffer(spec)
      spec.values?.forEach(value => ensureSpecValueBuffer(value))
      triggerChange()
    }

    const removeSpec = (index: number) => {
      ensureSpecs()
      const removed = specs.value!.splice(index, 1)?.[0]
      removeSpecBuffers(removed)
      triggerChange()
    }

    const addSpecValue = (spec: DuxSpecItem) => {
      spec.values = spec.values || []
      const value = createSpecValue()
      spec.values.push(value)
      ensureSpecValueBuffer(value)
      triggerChange()
    }

    const removeSpecValue = (spec: DuxSpecItem, index: number) => {
      const removed = spec.values?.splice(index, 1)?.[0]
      removeSpecValueBuffer(removed)
      triggerChange()
    }

    const setPresetSpecs = (preset: DuxSpecItem[] = []) => {
      specs.value = preset.map((spec) => {
        return {
          ...spec,
          id: spec.id || createId('spec'),
          values: spec.values?.map(value => ({
            ...value,
            id: value.id || createId('spec_value'),
          })) || [createSpecValue()],
        }
      })
      triggerChange()
    }

    const commitSpecName = (spec: DuxSpecItem) => {
      const buffer = specNameBuffers.get(spec.id)
      if (!buffer) {
        return
      }
      const next = buffer.value?.trim() || ''
      if (spec.name !== next) {
        spec.name = next
        triggerChange()
      }
      buffer.value = next
    }

    const commitSpecValue = (value: DuxSpecValueItem) => {
      const buffer = specValueBuffers.get(value.id)
      if (!buffer) {
        return
      }
      const next = buffer.value?.trim() || ''
      if (value.label !== next) {
        value.label = next
        triggerChange()
      }
      buffer.value = next
    }

    expose({
      setPresetSpecs,
    })

    return () => {
      const hasSpecs = (specs.value?.length || 0) > 0
      return (
        <div class="flex flex-col gap-4">
          {hasSpecs && (
            <VueDraggable
              modelValue={specs.value || []}
              handle=".spec-drag-handle"
              target=".spec-drag-container"
              animation={200}
              {...{
                'onUpdate:modelValue': (value: DuxSpecItem[]) => {
                  specs.value = value
                  triggerChange()
                },
              }}
            >
              <div class="flex flex-col gap-3 spec-drag-container">
                {specs.value?.map((spec, specIndex) => {
                  const nameBuffer = ensureSpecNameBuffer(spec)
                  return (
                    <div
                      key={spec.id}
                      class="rounded-md border border-muted flex gap-4 items-center"
                    >
                      <div class="flex-1 flex flex-col">

                        <div class="flex items-center gap-2 bg-muted p-4 rounded-t">

                          <div class="spec-drag-handle i-tabler:dots-vertical text-gray-400 cursor-move flex-none w-4"></div>
                          <div class="w-14 text-right text-sm text-gray-500 flex-shrink-0">
                            {t('components.spec.nameLabel')}
                          </div>
                          <div class="flex items-center gap-3">
                            {slots?.namePrefix?.({
                              spec,
                              specIndex,
                              commit: () => commitSpecName(spec),
                              triggerChange,
                            })}
                            <NInput
                              style={{
                                width: '150px',
                              }}
                              placeholder={t('components.spec.namePlaceholder')}
                              value={nameBuffer.value}
                              onUpdateValue={(val) => {
                                nameBuffer.value = val
                              }}
                              onFocus={() => editingSpecNames.add(spec.id)}
                              onBlur={() => {
                                editingSpecNames.delete(spec.id)
                                commitSpecName(spec)
                              }}
                              onKeyup={(event) => {
                                if ((event as KeyboardEvent).key === 'Enter') {
                                  commitSpecName(spec)
                                }
                              }}
                              v-slots={{
                                suffix: () => (
                                  <NButton
                                    text
                                    type="error"
                                    size="tiny"
                                    onClick={() => removeSpec(specIndex)}
                                  >
                                    <div class="i-tabler:trash text-xs"></div>
                                  </NButton>
                                ),
                              }}
                            />
                            <div>
                              <NCheckbox
                                checked={spec.is_image}
                                {...{
                                  'onUpdate:checked': (value: boolean) => {
                                    spec.is_image = value
                                    triggerChange()
                                  },
                                }}
                              >
                                {t('components.spec.addImage')}
                              </NCheckbox>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-start gap-2 p-4 bg-default rounded-b">
                          <div class="w-14 text-right text-sm text-gray-500 flex-shrink-0 pt-1 ml-6 mt-0.7">
                            {t('components.spec.valueLabel')}
                          </div>
                          <div class="flex flex-col gap-2 flex-1">
                            <div class="flex flex-wrap gap-4 items-start">
                              {spec.values?.map((value, valueIndex) => {
                                const valueBuffer = ensureSpecValueBuffer(value)
                                return (
                                  <div key={value.id} class="flex flex-col gap-1">
                                    <div class="flex items-center gap-2">
                                      {slots?.valuePrefix?.({
                                        spec,
                                        value,
                                        specIndex,
                                        valueIndex,
                                        commit: () => commitSpecValue(value),
                                        triggerChange,
                                      })}
                                      <NInput
                                        style={{
                                          width: '150px',
                                        }}
                                        placeholder={t('components.spec.valuePlaceholder')}
                                        value={valueBuffer.value}
                                        onUpdateValue={(val) => {
                                          valueBuffer.value = val
                                        }}
                                        onFocus={() => editingSpecValues.add(value.id)}
                                        onBlur={() => {
                                          editingSpecValues.delete(value.id)
                                          commitSpecValue(value)
                                        }}
                                        onKeyup={(event) => {
                                          if ((event as KeyboardEvent).key === 'Enter') {
                                            commitSpecValue(value)
                                          }
                                        }}
                                        v-slots={{
                                          suffix: () => (
                                            <NButton
                                              text
                                              type="error"
                                              size="tiny"
                                              onClick={() => removeSpecValue(spec, valueIndex)}
                                            >
                                              <div class="i-tabler:trash text-xs"></div>
                                            </NButton>
                                          ),
                                        }}
                                      />
                                    </div>
                                    {spec.is_image && (
                                      <div class="w-[140px]">
                                        <DuxImageUpload
                                          {...mergedImageUploadProps.value}
                                          value={typeof value.image === 'string' ? value.image : ''}
                                          onUpdateValue={(img) => {
                                            value.image = (Array.isArray(img) ? img?.[0] : img) as string
                                            triggerChange()
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                              <div class="mt-1.5">
                                <NButton
                                  text
                                  type="primary"
                                  size="small"
                                  onClick={() => addSpecValue(spec)}
                                >
                                  {t('components.spec.addValue')}
                                </NButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </VueDraggable>
          )}
          <div class="flex items-center gap-2">
            <NButton
              secondary
              type="primary"
              onClick={addSpec}
            >
              {t('components.spec.addSpec')}
            </NButton>
            {slots?.actions?.()}
          </div>
        </div>
      )
    }
  },
})
