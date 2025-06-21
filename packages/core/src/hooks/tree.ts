import { computed } from 'vue'
import { arrayToTree, treeToArr } from '../utils'
import { useList } from './data'

export interface IUseTreeProps {
  path?: string
  params?: Record<string, any>
  treeOptions?: {
    valueKey?: string
    parentKey?: string
    sortKey?: string
    childrenKey?: string
  }
  converTree?: boolean
  providerName?: string
}

export function useTree(props: IUseTreeProps) {
  const { data, isLoading } = useList({
    get path() {
      return props.path || ''
    },
    get filters() {
      return props.params
    },
    get providerName() {
      return props.providerName
    },
  })

  const options = computed(() => {
    if (!props.converTree) {
      return data.value?.data || []
    }
    return arrayToTree(data.value?.data || [], {
      idKey: props.treeOptions?.valueKey || 'id',
      parentKey: props.treeOptions?.parentKey || 'parentId',
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
