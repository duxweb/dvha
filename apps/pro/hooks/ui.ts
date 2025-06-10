import { storeToRefs } from 'pinia'
import { useUIStore } from '../stores/ui'

export function useUI() {
  const uiStore = useUIStore()
  const { menuCollapsed, cmdVisible, menuMobileCollapsed } = storeToRefs(uiStore)

  return {
    menuCollapsed,
    setMenuCollapsed: uiStore.setMenuCollapsed,

    menuMobileCollapsed,
    setMenuMobileCollapsed: uiStore.setMenuMobileCollapsed,

    cmdVisible,
    setCmdVisible: uiStore.setCmdVisible,

  }
}
