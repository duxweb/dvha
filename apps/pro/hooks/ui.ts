import { storeToRefs } from 'pinia'
import { useUIStore } from '../stores/ui'

export function useUI() {
  const uiStore = useUIStore()
  const { menuCollapsed, cmdVisible } = storeToRefs(uiStore)

  return {
    menuCollapsed,
    setMenuCollapsed: uiStore.setMenuCollapsed,

    cmdVisible,
    setCmdVisible: uiStore.setCmdVisible,
  }
}
