import { isArray } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { useCustom, useMany } from './data'

type SelectValue = Array<string | number> | string | number | null | undefined

interface UseSelectProps {
  value: SelectValue
  path?: string
  params?: Record<string, any>
  pagination?: boolean | number
  optionLabel?: string | ((item: Record<string, any>) => string)
  optionValue?: string | ((item: Record<string, any>) => string)
  optionField?: string
  keywordField?: string
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
      return props.pagination
        ? {
            page: page.value,
            pageSize: pageSize.value,
            ...(keyword.value && { [props.keywordField || 'keyword']: keyword.value }),
          }
        : undefined
    },
  })

  const selectedItems = ref<Record<string, any>[]>([])

  // 获取用于去重的字段值
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
      if (!props.value) {
        return []
      }
      return isArray(props.value) ? props.value as string[] : [props.value as string]
    },
    options: {
      enabled: false,
    },
  })

  watch(() => props.value, async (value) => {
    if (selectedOnce.value || !value) {
      return
    }

    selectedOnce.value = true

    try {
      const res = await fetchSelected()
      selectedItems.value = res?.data?.data || []
    }
    catch (error) {
      console.warn('Failed to fetch selected items:', error)
    }
  }, { immediate: true })

  const onSearch = (searchValue: string) => {
    keyword.value = searchValue
  }

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
