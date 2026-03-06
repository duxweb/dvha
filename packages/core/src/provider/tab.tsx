import type { LocationQueryValue } from 'vue-router'
import { defineComponent, KeepAlive, Transition, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useRouteStore, useTabStore } from '../stores'

export const DuxTabRouterView = defineComponent({
  name: 'DuxTabRouterView',
  props: {},
  setup() {
    const route = useRoute()
    const tabStore = useTabStore()
    const routeStore = useRouteStore()

    const normalizeQueryValue = (value: LocationQueryValue | LocationQueryValue[]) => {
      if (Array.isArray(value)) {
        return value.map(item => item ?? '').sort().join(',')
      }
      return value ?? ''
    }

    const getTabKey = () => {
      const entries = Object.entries(route.query || {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${normalizeQueryValue(value)}`)

      return entries.length ? `${route.path}?${entries.join('&')}` : route.path
    }

    // route cache
    const cacheMap = new Map()

    const wrap = (name: string, component: any) => {
      let cache
      const cacheName = name

      if (cacheMap.has(cacheName)) {
        cache = cacheMap.get(cacheName)
      }
      else {
        cache = {
          name: cacheName,
          render() {
            return component
          },
        }
        cacheMap.set(cacheName, cache)
      }
      return cache
    }

    tabStore.$subscribe((_mutation, state) => {
      cacheMap.forEach((cache) => {
        if (!state.tabs.some(t => (t.tabKey || t.path) === cache.name)) {
          cacheMap.delete(cache.name)
        }
      })
    })

    // add index route
    const indexRoute = routeStore.getIndexRoute()
    if (indexRoute) {
      tabStore.addTab({ ...indexRoute, meta: { ...indexRoute.meta, lock: true } })
    }

    // watch route and routeStore.routes
    watch([route, () => routeStore.routes], () => {
      const info = routeStore.searchRouteName(route.name as string)
      if (!info) {
        return
      }
      const item = { label: info.label as string, path: route.path, tabKey: getTabKey(), name: info.name }
      tabStore.addTab(item)
    }, { immediate: true })

    return () => (
      <RouterView>
        {{
          default: ({ Component }) => {
            const tabKey = getTabKey()
            const WrappedComponent = wrap(tabKey, Component)
            return (
              <Transition name="tab-fade" mode="out-in" appear>
                <KeepAlive include={tabStore.tabs.map(t => t.tabKey || t.path || '')}>
                  <WrappedComponent key={tabKey} />
                </KeepAlive>
              </Transition>
            )
          },
        }}
      </RouterView>
    )
  },
})
