import type { MaybeRef } from 'vue'
import { debounce, isArray } from 'lodash-es'
import { computed, ref, toRef, watch } from 'vue'
import { useList, useMany } from './data'

type SelectValue = Array<string | number> | string | number | null | undefined

export interface IUseSelectProps {
  /** 默认选中值，可以是单个值或数组 */
  defaultValue?: MaybeRef<SelectValue>
  /** 数据请求路径 */
  path?: string
  /** 请求参数 */
  params?: Record<string, any>
  /** 分页配置，false表示不分页，true表示默认20条/页，数字表示指定每页条数 */
  pagination?: boolean | number
  /** 数据提供者名称 */
  providerName?: string
  /**
   * 选项显示标签配置
   * - 字符串：指定用作显示标签的字段名
   * - 函数：自定义标签生成逻辑
   * - 默认fallback顺序：label -> name -> title -> value/id的字符串形式
   */
  optionLabel?: string | ((item: Record<string, any>) => string)
  /**
   * 选项值配置
   * - 字符串：指定用作选项值的字段名
   * - 函数：自定义值获取逻辑
   * - 默认fallback顺序：value -> id
   * - 用途：生成最终选项的 value 属性，供外部使用
   */
  optionValue?: string | ((item: Record<string, any>) => string)
  /**
   * 选项唯一标识字段名
   * - 仅支持字符串类型，指定用于去重比较的字段名
   * - 默认fallback顺序：value -> id
   * - 用途：内部选项去重和比较，防止重复选项
   * - 与 optionValue 的区别：optionField 用于内部去重逻辑，optionValue 用于生成最终选项值
   */
  optionField?: string
  /** 搜索关键词字段名，默认为 'keyword' */
  keywordField?: string
  /** 搜索防抖延迟时间（毫秒），默认300ms */
  debounce?: number
}

export function useSelect(props: IUseSelectProps) {
  const defaultValue = toRef(props, 'defaultValue')
  const keyword = ref<string>()
  const pagination = ref({
    page: 1,
    pageSize: typeof props.pagination === 'number'
      ? props.pagination
      : props.pagination ? 20 : 0,
  })
  const selectedOnce = ref(false)
  const filters = ref<Record<string, any>>({
    ...props.params,
    keyword: '',
  })

  const debouncedSearch = debounce((value: string) => {
    keyword.value = value
    filters.value.keyword = value
  }, props.debounce || 300)

  const onSearch = (searchValue: string) => {
    debouncedSearch(searchValue)
  }

  watch(() => props.params, (params) => {
    filters.value = {
      keyword: keyword.value,
      ...params,
    }
  }, {
    deep: true,
  })

  const { data, isLoading, total, pageCount } = useList({
    get path() {
      return props.path || ''
    },
    filters,
    get pagination() {
      return props.pagination ? pagination.value : undefined
    },
    get providerName() {
      return props.providerName
    },
  })

  const selectedItems = ref<Record<string, any>[]>([])

  const getOptionFieldValue = (item: Record<string, any>) => {
    const fieldConfig = props.optionField || props.optionValue

    if (typeof fieldConfig === 'string') {
      return item[fieldConfig] || item.value || item.id
    }
    else if (typeof fieldConfig === 'function') {
      return fieldConfig(item)
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
      return isArray(defaultValue.value) ? defaultValue.value as string[] : [defaultValue.value as string]
    },
    options: {
      enabled: false,
    },
    providerName: props.providerName,
  })

  watch(defaultValue, async (value) => {
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
  }, { immediate: true, deep: true })

  const loading = computed(() => isLoading.value)

  return {
    onSearch,
    options,
    meta,
    loading,
    pagination,
    total,
    pageCount,
  }
}
