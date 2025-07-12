import type { Ref } from 'vue'
import type { IMenu } from '../types'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'

export interface RouteStoreState {
  routes: Ref<IMenu[]>
  searchRoute: (path: string) => IMenu | undefined
  searchRouteName: (name: string) => IMenu | undefined
  appendRoute: (data: IMenu) => void
  appendRoutes: (data: IMenu[]) => void
  setRoutes: (data: IMenu[]) => void
  getRoutes: () => IMenu[]
  clearRoutes: () => void
  getIndexRoute: () => IMenu | undefined
  getRouteInit: () => boolean
  resetRouteInit: () => void
}

/**
 * use route store
 * @param manageName manage name
 * @returns route store
 */
export function useRouteStore(manageName?: string) {
  const manage = inject<Ref<string>>('dux.manage')
  if (!manageName) {
    manageName = manage?.value || ''
  }

  if (!manageName) {
    throw new Error('manage not found')
  }

  const routeStore = createRouteStore(manageName)
  return routeStore()
}

/**
 * create route store
 * @param manageName manage name
 * @returns route store
 */
function createRouteStore(manageName: string) {
  return defineStore<string, RouteStoreState>(`routes-${manageName}`, () => {
    const routes = ref<IMenu[]>([])

    /**
     * search route by path
     * @param path route path
     * @returns route object
     */
    const searchRoute = (path: string) => {
      return routes.value?.find((item) => {
        return item.path === path
      })
    }

    /**
     * search route by name
     * @param name route name
     * @returns route object
     */
    const searchRouteName = (name: string) => {
      return routes.value?.find((item) => {
        return item.name === name
      })
    }

    /**
     * append route
     * @param data route object
     */
    const appendRoute = (data: IMenu) => {
      routes.value?.push(data)
    }

    /**
     * append routes
     * @param data route objects
     */
    const appendRoutes = (data: IMenu[]) => {
      routes.value = [...routes.value, ...data]
    }

    /**
     * set routes
     * @param data route objects
     */
    const setRoutes = (data: IMenu[]) => {
      routes.value = data
    }

    /**
     * get routes
     * @returns route objects
     */
    const getRoutes = () => {
      return routes.value
    }

    /**
     * clear routes
     */
    const clearRoutes = () => {
      routes.value = []
    }

    /**
     * get index route
     * @returns route object
     */
    const getIndexRoute = () => {
      const topRoutes = routes.value
        ?.filter(item => !item.parent && !item.name?.includes('404') && !item.name?.includes('403'))
        ?.sort((a, b) => (a.sort || 0) - (b.sort || 0))

      const findFirstValidRoute = (route: IMenu): IMenu | undefined => {
        if (route.path) {
          return route
        }

        const children = routes.value
          ?.filter(item => item.parent === route.name)
          ?.sort((a, b) => (a.sort || 0) - (b.sort || 0))

        for (const child of children || []) {
          const validRoute = findFirstValidRoute(child)
          if (validRoute) {
            return validRoute
          }
        }

        return undefined
      }

      for (const route of topRoutes || []) {
        const validRoute = findFirstValidRoute(route)
        if (validRoute) {
          return validRoute
        }
      }

      return undefined
    }

    const routeInit = ref<boolean>(false)

    const getRouteInit = () => {
      const init = routeInit.value
      routeInit.value = true
      return init
    }

    const resetRouteInit = () => {
      routeInit.value = false
    }

    return {
      routes,
      searchRoute,
      searchRouteName,
      appendRoute,
      appendRoutes,
      setRoutes,
      getRoutes,
      clearRoutes,
      getIndexRoute,
      getRouteInit,
      resetRouteInit,
    }
  })
}
