import type { SelectProps } from 'naive-ui'
import type { PropType, VNodeChild } from 'vue'
import { useSelect } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { isEqual } from 'lodash-es'
import { NAvatar, NImage, NPagination, NSelect, NSpace, NTag } from 'naive-ui'
import { computed, defineComponent, toRef, watch } from 'vue'

interface DuxSelectProps extends SelectProps {
  path?: string
  params?: Record<string, any>
  pagination?: boolean
  avatarField?: string
  imageField?: string
  descField?: string
  multiple?: boolean
  option?: Record<string, any> | Record<string, any>[] | null
}

export const DuxSelect = defineComponent<DuxSelectProps>({
  name: 'DuxSelect',
  props: {
    path: String,
    params: Object,
    pagination: {
      type: Boolean,
      default: true,
    },
    avatarField: {
      type: String,
    },
    imageField: {
      type: String,
    },
    descField: {
      type: String,
    },
    multiple: Boolean,
    option: {
      type: [Object, Array] as PropType<Record<string, any> | Record<string, any>[] | null>,
      default: undefined,
    },
  },
  extends: NSelect,
  setup(props, { emit, slots }) {
    const params = toRef(props, 'params', {})
    const path = toRef(props, 'path')

    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue,
    })

    const optionModel = useVModel(props, 'option', emit, {
      passive: true,
      defaultValue: props.multiple ? [] : null,
    })

    const labelField = toRef(props, 'labelField', 'name')
    const valueField = toRef(props, 'valueField', 'id')
    const avatarField = toRef(props, 'avatarField', '')
    const imageField = toRef(props, 'imageField', '')
    const descField = toRef(props, 'descField', '')

    const { onSearch, loading, pagination, options, pageCount } = useSelect({
      path,
      params,
      defaultValue: model,
      pagination: props.pagination,
      optionLabel: labelField.value,
      optionValue: valueField.value,
    })

    const selectProps = computed(() => {
      const { labelField, valueField, avatarField, imageField, descField, option, ...rest } = props
      return rest
    })

    const syncOptionModel = (records: Record<string, any>[] | Record<string, any> | null) => {
      if (props.multiple) {
        if (!isEqual(optionModel.value, records)) {
          optionModel.value = (records || []) as Record<string, any>[]
        }
        return
      }

      if (optionModel.value !== records) {
        optionModel.value = (records || null) as Record<string, any> | null
      }
    }

    watch(
      [model, options],
      ([modelValue, optionList]) => {
        if (props.multiple) {
          const values = Array.isArray(modelValue) ? modelValue : []
          const records = values
            .map(value => optionList.find(option => option.value === value)?.raw)
            .filter((item): item is Record<string, any> => Boolean(item))
          syncOptionModel(records)
          return
        }

        const record = optionList.find(option => option.value === modelValue)?.raw || null
        syncOptionModel(record)
      },
      {
        immediate: true,
      },
    )

    return () => (
      <NSelect
        {...selectProps.value}
        onSearch={onSearch}
        loading={loading.value}
        filterable={!!props.pagination}
        clearable
        remote
        options={options.value}
        v-model:value={model.value}
        multiple={props.multiple}
        onClear={() => {
          onSearch('')
        }}
        renderLabel={(item: Record<string, any>) => {
          if (imageField.value || descField.value) {
            return (
              <NSpace
                align="center"
                size="small"
                wrapItem={false}
                style={{
                  padding: '6px 0',
                }}
              >
                {imageField.value && (
                  <NImage src={item?.raw?.[imageField.value]} objectFit="cover" width={32} height={32} />
                )}
                {avatarField.value && (
                  <NAvatar
                    round
                    src={item?.raw?.[avatarField.value]}
                    size={32}
                  >
                    {item?.raw?.[labelField.value]?.charAt?.(0)}
                  </NAvatar>
                )}
                <NSpace vertical size={0} wrapItem={false}>
                  <div>{item?.raw?.[labelField.value]}</div>
                  {descField.value && (
                    <div style={{
                      opacity: 0.6,
                    }}
                    >
                      {item?.raw?.[descField.value]}
                    </div>
                  )}
                </NSpace>
              </NSpace>
            )
          }
          else {
            return item?.raw?.[labelField.value]
          }
        }}
        renderTag={({ option, handleClose }): VNodeChild => {
          return props.multiple
            ? (
                <NTag
                  type="primary"
                  size={props.size}
                  closable
                  round
                  onClose={() => {
                    handleClose()
                  }}
                  style={{
                    '--n-padding': '0',
                  }}
                >
                  {renderTag(option, labelField.value, imageField.value, avatarField.value, descField.value)}
                </NTag>
              )
            : renderTag(option, labelField.value, imageField.value, avatarField.value, descField.value)
        }}
      >
        {{
          action: () => {
            if (props.pagination) {
              return (
                <NPagination
                  size="small"
                  v-model:page={pagination.value.page}
                  pageSlot={3}
                  pageCount={pageCount.value}
                  pageSize={pagination.value.pageSize}
                />
              )
            }
            return null
          },
          ...slots,
        }}
      </NSelect>
    )
  },
})

function renderTag(option: Record<string, any>, labelField: string, imageField?: string, avatarField?: string, descField?: string) {
  return (imageField || descField || avatarField)
    ? (
        <NSpace
          align="center"
          size="small"
          style={{
            padding: '6px 0',
          }}
          wrapItem={false}
        >
          {imageField && (
            <NImage src={option?.raw?.[imageField]} objectFit="cover" width={22} height={22} />
          )}
          {avatarField && (
            <NAvatar
              round
              src={option?.raw?.[avatarField] as string || ''}
              size={22}
            >
              {option?.raw?.[labelField]?.charAt?.(0)}
            </NAvatar>
          )}
          <div>
            {option?.raw?.[labelField]}
          </div>
        </NSpace>
      )
    : option?.raw?.[labelField] || ''
}
