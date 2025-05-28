import { debounce, isArray } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { useCustom, useMany } from './data'

type SelectValue = Array<string | number> | string | number | null | undefined

interface UseSelectProps {
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

export function useSelect(props: UseSelectProps) {
  const keyword = ref<string>()
  const page = ref(1)
  const pageSize = ref(
    typeof props.pagination === 'number'
      ? props.pagination
      : props.pagination ? 20 : 0,
  )
  const selectedOnce = ref(false)

  const debouncedSearch = debounce((value: string) => {
    keyword.value = value
  }, props.debounce || 300)

  const onSearch = (searchValue: string) => {
    debouncedSearch(searchValue)
  }

  watch([() => props.path, () => props.params, keyword], () => {
    if (props.pagination) {
      page.value = 1
    }
  }, { deep: true })

  const { data, isLoading } = useCustom({
    get path() {
      return props.path || ''
    },
    get filters() {
      return props.params
    },
    get query() {
      const query: Record<string, any> = {}

      if (props.pagination) {
        query.page = page.value
        query.pageSize = pageSize.value
      }

      if (keyword.value) {
        query[props.keywordField || 'keyword'] = keyword.value
      }

      return Object.keys(query).length ? query : undefined
    },
    providerName: props.providerName,
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
    page,
    pageSize,
  }
}
