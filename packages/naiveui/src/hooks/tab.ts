import { useTabStore } from '@duxweb/dvha-core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useNaiveTab() {
  const tab = useTabStore()
  const { tabs, current } = storeToRefs(tab)

  const router = useRouter()

  const getTabTarget = (item: { path?: string } & Record<string, any>) => item.tabKey || item.path || ''

  const props = computed(() => {
    return {
      value: current.value,
      defaultValue: current.value || '',
      onClose: (value) => {
        tab.delTab(value, (item) => {
          router.push(getTabTarget(item))
        })
      },
      onUpdateValue: (value) => {
        tab.changeTab(value, (item) => {
          router.push(getTabTarget(item))
        })
      },
    }
  })

  return {
    ...tab,
    tabs,
    current,
    tabsProps: props,
  }
}
