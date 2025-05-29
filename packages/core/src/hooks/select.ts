import { debounce, isArray } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { useList, useMany } from './data'

type SelectValue = Array<string | number> | string | number | null | undefined

interface IUseSelectProps {
  defaultValue?: SelectValue
  path?: string
  params?: Record<string, any>
  pagination?: boolean | number
  providerName?: string
  optionLabel?: string | ((item: Record<string, any>) => string)
  optionValue?: string | ((item: Record<string, any>) => string)
  optionField?: string
  keywordField?: string
  debounce?: number
}

export function useSelect(props: IUseSelectProps) {
  const keyword = ref<string>()
  const pagination = ref({
    page: 1,
    pageSize: typeof props.pagination === 'number'
      ? props.pagination
      : props.pagination ? 20 : 0,
  })
  const selectedOnce = ref(false)

  const debouncedSearch = debounce((value: string) => {
    keyword.value = value
  }, props.debounce || 300)

  const onSearch = (searchValue: string) => {
    debouncedSearch(searchValue)
  }

  const { data, isLoading } = useList({
    get path() {
      return props.path || ''
    },
    get filters() {
      const filters: Record<string, any> = { ...props.params }
      if (keyword.value) {
        filters[props.keywordField || 'keyword'] = keyword.value
      }
      return filters
    },
    get pagination() {
      return props.pagination ? pagination.value : undefined
    },
    get providerName() {
      return props.providerName
    },
  })

  const selectedItems = ref<Record<string, any>[]>([])

  const getOptionFieldValue = (item: Record<string, any>) => {
    const { optionField } = props
    if (typeof optionField === 'string') {
      return item[optionField] || item.value || item.id
    }
    return item.value || item.id
  }

  const formatOption = (item: Record<string, any>) => {
    const { optionLabel = 'label', optionValue = 'value' } = props

    let label: string
    if (typeof optionLabel === 'function') {
      label = optionLabel(item)
    }
    else if (typeof optionLabel === 'string') {
      label = item[optionLabel] || item.label || item.name || item.title || String(item.value || item.id || '')
    }
    else {
      label = item.label || item.name || item.title || String(item.value || item.id || '')
    }

    let value: string | number
    if (typeof optionValue === 'function') {
      value = optionValue(item)
    }
    else if (typeof optionValue === 'string') {
      value = item[optionValue] || item.value || item.id
    }
    else {
      value = item.value || item.id
    }

    return {
      label,
      value,
      raw: item,
    }
  }

  const options = computed(() => {
    const listData = data.value?.data || []

    const combined = [...selectedItems.value]
    listData.forEach((item) => {
      const exists = combined.some(selected =>
        getOptionFieldValue(selected) === getOptionFieldValue(item),
      )
      if (!exists) {
        combined.push(item)
      }
    })

    return combined.map(item => formatOption(item))
  })

  const meta = computed(() => data.value?.meta || {})

  const { refetch: fetchSelected } = useMany({
    get path() {
      return props.path || ''
    },
    get ids() {
      if (!props.defaultValue) {
        return []
      }
      return isArray(props.defaultValue) ? props.defaultValue as string[] : [props.defaultValue as string]
    },
    options: {
      enabled: false,
    },
    providerName: props.providerName,
  })

  watch(() => props.defaultValue, async (value) => {
    if (selectedOnce.value || !value) {
      return
    }
    selectedOnce.value = true

    const defaultValues = Array.isArray(value) ? value : [value]

    const allValuesExist = defaultValues.every(val =>
      options.value.some(option => option.value === val),
    )

    if (allValuesExist) {
      return
    }

    try {
      const res = await fetchSelected()
      selectedItems.value = res?.data?.data || []
    }
    catch (error) {
      console.warn('Failed to fetch selected items:', error)
    }
  }, { immediate: true })

  const loading = computed(() => isLoading.value && !data.value)

  return {
    onSearch,
    options,
    meta,
    loading,
    pagination,
  }
}
