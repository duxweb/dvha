import type { Ref } from 'vue'
import type { IMenu } from '../types'
import { defineStore } from 'pinia'
import { inject, nextTick, ref } from 'vue'

export interface TabStoreState {
  current: Ref<string | undefined>
  tabs: Ref<IMenu[]>
  isTab: (path: string) => boolean
  addTab: (item: IMenu, cb?: (item: IMenu) => void) => void
  delTab: (path: string, cb?: (item: IMenu) => void) => void
  changeTab: (path: string, cb?: (item: IMenu) => void) => void
  delOther: (path: string, cb?: () => void) => void
  delLeft: (path: string, cb?: () => void) => void
  delRight: (path: string, cb?: () => void) => void
  lockTab: (path: string) => void
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

    const isTab = (path: string) => {
      return tabs.value.some(tag => tag.path === path)
    }

    const addTab = (item: IMenu, cb?: (item: IMenu) => void) => {
      if (!item.path) {
        return
      }
      if (!tabs.value.some(tag => tag.path === item.path)) {
        if (current.value) {
          previousTab.value = tabs.value.find(t => t.path === current.value)
        }
        tabs.value.push(item)
        cb?.(item)
        current.value = item.path as string
      }
      else {
        if (current.value && current.value !== item.path) {
          previousTab.value = tabs.value.find(t => t.path === current.value)
        }
        current.value = item.path as string
      }
    }

    const delTab = (path: string, cb?: (item: IMenu) => void) => {
      const index = tabs.value.findIndex(t => t.path === path)
      if (index === -1 || tabs.value.length <= 1) {
        return
      }

      const tab = tabs.value[index]
      if (tab?.meta?.lock) {
        return
      }

      let targetTab: IMenu | undefined
      if (path === current.value && previousTab.value) {
        targetTab = tabs.value.find(t => t.path === previousTab.value?.path && t.path !== path)
      }

      if (!targetTab) {
        const prev = tabs.value[index - 1]
        const next = tabs.value[index + 1]
        targetTab = prev || next
      }

      tabs.value.splice(index, 1)
      cb?.(targetTab)
    }

    const delOther = (path: string, cb?: () => void) => {
      tabs.value = tabs.value.filter(t => t.path === path || t.meta?.lock)
      cb?.()
    }

    const delLeft = (path: string, cb?: () => void) => {
      const index = tabs.value.findIndex(t => t.path === path)
      if (index <= 0) {
        return
      }

      nextTick(() => {
        tabs.value = [...tabs.value.slice(0, index).filter(t => t.meta?.lock), ...tabs.value.slice(index)]
        cb?.()
      })
    }

    const delRight = (path: string, cb?: () => void) => {
      const index = tabs.value.findIndex(t => t.path === path)
      if (index === -1 || index === tabs.value.length - 1) {
        return
      }
      nextTick(() => {
        tabs.value = [...tabs.value.slice(0, index + 1), ...tabs.value.slice(index + 1).filter(t => t.meta?.lock)]
        cb?.()
      })
    }

    const lockTab = (path: string) => {
      const index = tabs.value.findIndex(t => t.path === path)
      if (index !== -1 && tabs.value[index]) {
        if (!tabs.value[index].meta) {
          tabs.value[index].meta = {}
        }
        tabs.value[index].meta.lock = !tabs.value[index].meta.lock
      }
    }

    const changeTab = (path: string, cb?: (item: IMenu) => void) => {
      const info = tabs.value.find(t => t.path === path)
      if (info) {
        if (current.value && current.value !== path) {
          previousTab.value = tabs.value.find(t => t.path === current.value)
        }
        current.value = path
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
