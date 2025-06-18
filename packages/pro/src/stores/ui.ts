import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

/**
 * use ui store
 * @param manageName manage name
 * @returns ui store
 */
export function useUIStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const uiStore = createUIStore(manageName)
  return uiStore()
}

/**
 * create route store
 * @param manageName manage name
 * @returns route store
 */
function createUIStore(manageName: string) {
  return defineStore(`ui-${manageName}`, () => {
    const menuCollapsed = ref(false)
    const menuMobileCollapsed = ref(false)

    const setMenuCollapsed = (collapsed: boolean) => {
      menuCollapsed.value = collapsed
    }

    const setMenuMobileCollapsed = (collapsed: boolean) => {
      menuMobileCollapsed.value = collapsed
    }

    const cmdVisible = ref(false)

    const setCmdVisible = (visible: boolean) => {
      cmdVisible.value = visible
    }

    return {
      menuCollapsed,
      setMenuCollapsed,

      cmdVisible,
      setCmdVisible,

      menuMobileCollapsed,
      setMenuMobileCollapsed,

    }
  }, {
    persist: {
      pick: ['menuCollapsed'],
    },
  } as any)
}
