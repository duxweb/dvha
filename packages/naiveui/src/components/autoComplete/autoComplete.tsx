import type { AutoCompleteProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useSelect } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NAutoComplete } from 'naive-ui'
import { defineComponent, toRef, watch } from 'vue'

interface DuxAutoCompleteProps extends AutoCompleteProps {
  path?: string
  params?: Record<string, any>
  pagination?: boolean
  valueField?: string
  labelField?: string
}

export const DuxAutoComplete = defineComponent<DuxAutoCompleteProps>({
  name: 'DuxAutoComplete',
  props: {
    path: String,
    params: Object as PropType<Record<string, any>>,
    pagination: {
      type: Boolean,
      default: true,
    },
    valueField: {
      type: String,
      default: 'id',
    },
    labelField: {
      type: String,
      default: 'name',
    },
    multiple: Boolean,
  },
  extends: NAutoComplete,
  setup(props, { emit, slots }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue || undefined,
    })

    const path = toRef(props, 'path')
    const params = toRef(props, 'params', {})

    const { onSearch, loading, options } = useSelect({
      path,
      params,
      pagination: props.pagination,
      optionValue: props.valueField || 'id',
    })

    watch(model, () => {
      onSearch(model.value || '')
    }, { immediate: true })

    return () => (
      <NAutoComplete
        {...props}
        loading={loading.value}
        clearable
        options={options.value?.map(item => ({
          label: item[props.labelField || 'name'],
          value: item[props.valueField || 'id'],
        }))}
        showEmpty={true}
        v-model:value={model.value}
      >
        {{
          ...slots,
        }}
      </NAutoComplete>
    )
  },
})
