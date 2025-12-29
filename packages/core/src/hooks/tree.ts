import type { MaybeRef } from 'vue'
import { computed, reactive, unref, watch } from 'vue'
import { arrayToTree, treeToArr } from '../utils'
import { useList } from './data'

export interface IUseTreeProps {
  path?: MaybeRef<string | undefined>
  params?: MaybeRef<Record<string, any> | undefined>
  treeOptions?: {
    valueKey?: string
    parentKey?: string
    sortKey?: string
    childrenKey?: string
  }
  converTree?: boolean
  providerName?: MaybeRef<string | undefined>
}

export function useTree(props: IUseTreeProps) {
  const path = computed(() => unref(props.path) || '')
  const resolvedParams = computed<Record<string, any>>(() => unref(props.params) || {})
  const providerName = computed(() => unref(props.providerName))
  const filters = reactive<Record<string, any>>({
    ...resolvedParams.value,
  })

  watch(resolvedParams, (value) => {
    const next = value || {}

    Object.keys(filters).forEach((key) => {
      if (!(key in next)) {
        delete filters[key]
      }
    })

    Object.entries(next).forEach(([key, val]) => {
      filters[key] = val
    })
  }, {
    deep: true,
    immediate: true,
  })

  const { data, isLoading } = useList({
    get path() {
      return path.value
    },
    filters,
    get providerName() {
      return providerName.value
    },
  })

  const options = computed(() => {
    if (!props.converTree) {
      return data.value?.data || []
    }
    return arrayToTree(data.value?.data || [], {
      idKey: props.treeOptions?.valueKey || 'id',
      parentKey: props.treeOptions?.parentKey || 'parent_id',
      sortKey: props.treeOptions?.sortKey || 'sort',
      childrenKey: props.treeOptions?.childrenKey || 'children',
    })
  })

  const expanded = computed(() => {
    return treeToArr(options.value, props.treeOptions?.valueKey || 'id', props.treeOptions?.childrenKey || 'children')
  })

  const loading = computed(() => isLoading.value)

  const optionsData = computed(() => {
    const processOptions = (items: any[]) => {
      return items.map((item) => {
        const newItem = { ...item }
        if (Array.isArray(newItem.children)) {
          if (newItem.children.length === 0) {
            delete newItem.children
          }
          else {
            newItem.children = processOptions(newItem.children)
          }
        }
        return newItem
      })
    }
    return processOptions(options.value || [])
  })

  return {
    options: optionsData,
    loading,
    expanded,
  }
}
