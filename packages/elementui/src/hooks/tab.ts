import { useTabStore } from '@duxweb/dvha-core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useElmTab(): ReturnType<typeof useTabStore> & { props: any } {
  const tab = useTabStore()
  const router = useRouter()

  const getTabTarget = (item: { path?: string } & Record<string, any>) => item.tabKey || item.path || ''

  const props = computed(() => {
    return {
      modelValue: tab.current,
      onTabRemove: (value: string) => {
        tab.delTab(value, (item) => {
          router.push(getTabTarget(item))
        })
      },
      onTabChange: (value: string) => {
        tab.changeTab(value, (item) => {
          router.push(getTabTarget(item))
        })
      },
    }
  })

  return {
    ...tab,
    props,
  }
}
