import type { TabProps } from 'naive-ui'
import { useTabStore } from '@duxweb/dvha-core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useNaiveTab() {
  const tab = useTabStore()
  const router = useRouter()

  const props = computed(() => {
    return {
      value: tab.current,
      defaultValue: tab.current,
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
    } as TabProps
  })

  return {
    ...tab,
    props,
  }
}
