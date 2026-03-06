import type { Ref } from 'vue'
import type { IMenu } from '../types'
import { defineStore } from 'pinia'
import { inject, nextTick, ref } from 'vue'

export interface TabStoreState {
  current: Ref<string | undefined>
  tabs: Ref<IMenu[]>
  isTab: (key: string) => boolean
  addTab: (item: IMenu, cb?: (item: IMenu) => void) => void
  delTab: (key: string, cb?: (item: IMenu) => void) => void
  changeTab: (key: string, cb?: (item: IMenu) => void) => void
  delOther: (key: string, cb?: () => void) => void
  delLeft: (key: string, cb?: () => void) => void
  delRight: (key: string, cb?: () => void) => void
  lockTab: (key: string) => void
  clearTab: () => void
}

export function useTabStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const tabStore = createTabStore(manageName)
  return tabStore()
}

export function createTabStore(manageName: string) {
  return defineStore<string, TabStoreState>(`tab-${manageName}`, () => {
    const current = ref<string>()
    const previousTab = ref<IMenu>()
    const tabs = ref<IMenu[]>([])

    const getTabKey = (item: Pick<IMenu, 'tabKey' | 'path'>) => item.tabKey || item.path || ''

    const isTab = (key: string) => {
      return tabs.value.some(tag => getTabKey(tag) === key)
    }

    const addTab = (item: IMenu, cb?: (item: IMenu) => void) => {
      const key = getTabKey(item)
      if (!key) {
        return
      }
      if (!item.tabKey) {
        item.tabKey = key
      }
      if (!tabs.value.some(tag => getTabKey(tag) === key)) {
        if (current.value) {
          previousTab.value = tabs.value.find(t => getTabKey(t) === current.value)
        }
        tabs.value.push(item)
        cb?.(item)
        current.value = key
      }
      else {
        if (current.value && current.value !== key) {
          previousTab.value = tabs.value.find(t => getTabKey(t) === current.value)
        }
        current.value = key
      }
    }

    const delTab = (key: string, cb?: (item: IMenu) => void) => {
      const index = tabs.value.findIndex(t => getTabKey(t) === key)
      if (index === -1 || tabs.value.length <= 1) {
        return
      }

      const tab = tabs.value[index]
      if (tab?.meta?.lock) {
        return
      }

      let targetTab: IMenu | undefined
      if (key === current.value && previousTab.value) {
        const previousKey = getTabKey(previousTab.value)
        targetTab = tabs.value.find(t => getTabKey(t) === previousKey && getTabKey(t) !== key)
      }

      if (!targetTab) {
        const prev = tabs.value[index - 1]
        const next = tabs.value[index + 1]
        targetTab = prev || next
      }

      tabs.value.splice(index, 1)
      cb?.(targetTab)
    }

    const delOther = (key: string, cb?: () => void) => {
      tabs.value = tabs.value.filter(t => getTabKey(t) === key || t.meta?.lock)
      cb?.()
    }

    const delLeft = (key: string, cb?: () => void) => {
      const index = tabs.value.findIndex(t => getTabKey(t) === key)
      if (index <= 0) {
        return
      }

      nextTick(() => {
        tabs.value = [...tabs.value.slice(0, index).filter(t => t.meta?.lock), ...tabs.value.slice(index)]
        cb?.()
      })
    }

    const delRight = (key: string, cb?: () => void) => {
      const index = tabs.value.findIndex(t => getTabKey(t) === key)
      if (index === -1 || index === tabs.value.length - 1) {
        return
      }
      nextTick(() => {
        tabs.value = [...tabs.value.slice(0, index + 1), ...tabs.value.slice(index + 1).filter(t => t.meta?.lock)]
        cb?.()
      })
    }

    const lockTab = (key: string) => {
      const index = tabs.value.findIndex(t => getTabKey(t) === key)
      if (index !== -1 && tabs.value[index]) {
        if (!tabs.value[index].meta) {
          tabs.value[index].meta = {}
        }
        tabs.value[index].meta.lock = !tabs.value[index].meta.lock
      }
    }

    const changeTab = (key: string, cb?: (item: IMenu) => void) => {
      const info = tabs.value.find(t => getTabKey(t) === key)
      if (info) {
        if (current.value && current.value !== key) {
          previousTab.value = tabs.value.find(t => getTabKey(t) === current.value)
        }
        current.value = key
        cb?.(info)
      }
    }

    const clearTab = () => {
      current.value = undefined
      previousTab.value = undefined
      tabs.value = []
    }

    return {
      current,
      tabs,
      isTab,
      addTab,
      delTab,
      changeTab,
      delOther,
      delLeft,
      delRight,
      lockTab,
      clearTab,
    }
  })
}
