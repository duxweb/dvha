import { useTabStore } from '@duxweb/dvha-core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useNaiveTab() {
  const tab = useTabStore()
  const { tabs, current } = storeToRefs(tab)

  const router = useRouter()

  const props = computed(() => {
    return {
      value: current.value,
      defaultValue: current.value || '',
      onClose: (value) => {
        tab.delTab(value, (item) => {
          router.push(item.path || '')
        })
      },
      onUpdateValue: (value) => {
        tab.changeTab(value, (item) => {
          router.push(item.path || '')
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
