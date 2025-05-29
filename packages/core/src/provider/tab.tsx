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
        if (!state.tabs.some(t => t.path === cache.name)) {
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
      const item = { label: info.label as string, path: route.path, name: info.name }
      tabStore.addTab(item)
    }, { immediate: true })

    return () => (
      <RouterView>
        {{
          default: ({ Component }) => {
            const WrappedComponent = wrap(route.path, Component)
            return (
              <Transition name="tab-fade" mode="out-in" appear>
                <KeepAlive include={tabStore.tabs.map(t => t.path || '')}>
                  <WrappedComponent key={route.path} />
                </KeepAlive>
              </Transition>
            )
          },
        }}
      </RouterView>
    )
  },
})
