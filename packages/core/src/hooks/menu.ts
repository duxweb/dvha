import type { IMenu } from '../types'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteStore } from '../stores'
import { arrayToTree, searchTree } from '../utils'

export interface UseMenuProps {
  doubleMenu?: boolean
}

export function useMenu(props?: UseMenuProps) {
  const routeStore = useRouteStore()
  const { routes } = storeToRefs(routeStore)

  const getMenu = (hidden: boolean = true): IMenu[] => {
    return cloneDeep(routes.value)?.filter(item => !!item?.name).filter(item => !hidden || item.hidden === undefined || item.hidden === false)
  }

  const originalList = computed<Record<string, any>[]>(() => {
    const menus = getMenu(false)
    return arrayToTree(menus, {
      idKey: 'name',
      parentKey: 'parent',
      childrenKey: 'children',
      sortKey: 'sort',
    }, undefined)
  })

  const list = computed<Record<string, any>[]>(() => {
    const menus = getMenu()
    const data = arrayToTree(menus, {
      idKey: 'name',
      parentKey: 'parent',
      childrenKey: 'children',
      sortKey: 'sort',
    }, undefined)
    return data
  })

  const route = useRoute()

  const allKey = ref(route.name)
  const appKey = ref(route.name)
  const subKey = ref(route.name)

  const mainMenu = computed(() => {
    if (!props?.doubleMenu) {
      return list.value
    }
    const appList = cloneDeep(list.value)
    return appList?.map((item) => {
      delete item.children
      return item
    })
  })

  const subMenu = computed(() => {
    if (!props?.doubleMenu) {
      return []
    }
    const subList = list.value?.find(item => item.name === appKey.value)?.children
    return subList || []
  })

  const crumbs = computed(() => {
    const data = searchTree(originalList.value, (item) => {
      return item?.name === route.name
    })
    return data
  })

  watch(() => props?.doubleMenu, () => {
    if (!props?.doubleMenu) {
      const paths = searchTree(list.value, (item) => {
        return item?.name === subKey.value
      })
      appKey.value = paths?.[paths.length - 1]?.name
      subKey.value = paths?.[paths.length - 1]?.name
    }
    else {
      const paths = searchTree(list.value, (item) => {
        return item?.name === appKey.value
      })

      appKey.value = paths?.[0]?.name
      subKey.value = paths?.[paths.length - 1]?.name
    }
  }, { immediate: true })

  const isSubMenu = computed(() => {
    if (!props?.doubleMenu) {
      return true
    }
    return subMenu.value.length > 0
  })

  watch([route, originalList, () => props?.doubleMenu], () => {
    const paths = searchTree(originalList.value, (item) => {
      return item.name === route.name
    })

    const findIndex = (list) => {
      let index = -1
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].hidden === false || list[i].hidden === undefined) {
          index = i
          break
        }
      }
      return index
    }

    const subIndex = findIndex(paths)

    allKey.value = paths?.[subIndex]?.name

    if (!props?.doubleMenu) {
      appKey.value = paths?.[subIndex]?.name
      subKey.value = paths?.[subIndex]?.name
    }
    else {
      appKey.value = paths?.[0]?.name
      subKey.value = paths?.[subIndex]?.name
    }
  }, { immediate: true })

  return {
    data: list,
    originalData: originalList,
    getMenu,
    mainMenu,
    subMenu,
    isSubMenu,
    crumbs,
    active: allKey,
    appActive: appKey,
    subActive: subKey,
  }
}
