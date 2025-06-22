import type { MaybeRef, Ref } from 'vue'
import { useClient } from '@duxweb/dvha-core'
import { useQuery } from '@tanstack/vue-query'
import { computed, ref, toRef, watch } from 'vue'

interface UseLevelProps {
  value?: MaybeRef<string[]>
  path?: MaybeRef<string>
  maxLevel?: MaybeRef<number> // 0 表示无限级
  nameField?: string
  labelField?: string
  valueField?: string
}

interface LevelOption {
  label: string
  value: string
}

export function useLevel(props: UseLevelProps) {
  const regionData = ref<LevelOption[][]>([])
  const isInitializing = ref(false)
  const currentQuery = ref<{ level: number, name?: string } | null>(null)

  const path = toRef(props, 'path', 'area') as Ref<string>
  const value = toRef(props, 'value', []) as Ref<string[]>
  const maxLevel = toRef(props, 'maxLevel', 4) as Ref<number>

  const { request } = useClient()

  const { data: queryData, isFetching } = useQuery({
    queryKey: [path, currentQuery],
    queryFn: async () => {
      if (!currentQuery.value)
        return null

      const query: Record<string, any> = { level: currentQuery.value.level }
      if (currentQuery.value.name) {
        query[props.nameField || 'name'] = currentQuery.value.name
      }

      return request({
        path: path.value as string,
        method: 'GET',
        query,
      })
    },
    enabled: computed(() => !!currentQuery.value),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const formatOptions = (data: any[]) => {
    const labelField = props.labelField || 'name'
    const valueField = props.valueField || 'value'
    return data.map(item => ({
      label: item[labelField] || item.name || item.label,
      value: item[valueField] || item.value || item.name || item.code,
    }))
  }

  const updateLevelData = (level: number, options: LevelOption[]) => {
    while (regionData.value.length <= level) {
      regionData.value.push([])
    }
    regionData.value[level] = options
    regionData.value = [...regionData.value]
  }

  watch(queryData, (data) => {
    if (!data?.data || !currentQuery.value)
      return

    const level = currentQuery.value.level
    updateLevelData(level, formatOptions(data.data))

    if (isInitializing.value && value.value.length > level) {
      const nextName = value.value[level]
      const shouldContinue = nextName && (maxLevel.value === 0 || level < maxLevel.value - 1)

      currentQuery.value = shouldContinue
        ? { level: level + 1, name: nextName }
        : null

      if (!shouldContinue) {
        isInitializing.value = false
      }
    }
    else {
      currentQuery.value = null
    }
  })

  const onChange = (selectedValue: string, index: number) => {
    value.value = [...value.value.slice(0, index), selectedValue]
    regionData.value = regionData.value.slice(0, index + 1)

    if (maxLevel.value === 0 || index < maxLevel.value - 1) {
      currentQuery.value = { level: index + 1, name: selectedValue }
    }
  }

  watch(value, (val) => {
    if (!isInitializing.value) {
      regionData.value = []
      isInitializing.value = val && val.length > 0
      currentQuery.value = { level: 0 }
    }
  }, { immediate: true })

  const isLoading = computed(() => isFetching.value)

  return {
    regions: computed(() => regionData.value),
    onChange,
    isLoading,
    value,
  }
}
