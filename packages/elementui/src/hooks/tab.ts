import { useTabStore } from '@duxweb/dvha-core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useElmTab(): ReturnType<typeof useTabStore> & { props: any } {
  const tab = useTabStore()
  const router = useRouter()

  const props = computed(() => {
    return {
      modelValue: tab.current,
      onTabRemove: (value: string) => {
        tab.delTab(value, (item) => {
          router.push(item.path || '')
        })
      },
      onTabChange: (value: string) => {
        tab.changeTab(value, (item) => {
          router.push(item.path || '')
        })
      },
    }
  })

  return {
    ...tab,
    props,
  }
}
