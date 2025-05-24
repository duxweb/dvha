import type { Ref } from 'vue'
import type { IMenu } from '../types'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

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
  return defineStore(`tab-${manageName}`, () => {
    const current = ref<string>()
    const tabs = ref<IMenu[]>([])

    const isTab = (path: string) => {
      return tabs.value.some(tag => tag.path === path)
    }
    const addTab = (item: IMenu, cb?: (item: IMenu) => void) => {
      if (!item.path) {
        return
      }
      if (!tabs.value.some(tag => tag.path === item.path)) {
        tabs.value.push(item)
        cb?.(item)
      }
      current.value = item.path as string
    }

    const delTab = (path: string, cb?: (item: IMenu) => void) => {
      const index = tabs.value.findIndex(t => t.path === path)
      if (!index || tabs.value.length <= 1) {
        return
      }

      const tab = tabs.value[index]
      if (tab?.meta?.lock) {
        return
      }

      const prev = tabs.value[index - 1]
      const next = tabs.value[index + 1]

      cb?.(prev || next)

      setTimeout(() => {
        tabs.value.splice(index, 1)
      }, 0)
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
      tabs.value = [...tabs.value.slice(0, index).filter(t => t.meta?.lock), ...tabs.value.slice(index)]
      cb?.()
    }

    const delRight = (path: string, cb?: () => void) => {
      const index = tabs.value.findIndex(t => t.path === path)
      if (index === -1 || index === tabs.value.length - 1) {
        return
      }
      tabs.value = [...tabs.value.slice(0, index + 1), ...tabs.value.slice(index + 1).filter(t => t.meta?.lock)]
      cb?.()
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
      current.value = path
      const info = tabs.value.find(t => t.path === path)
      if (info) {
        cb?.(info)
      }
    }

    const clearTab = () => {
      current.value = undefined
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
