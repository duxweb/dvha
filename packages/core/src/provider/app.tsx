import type { Ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { IDataProvider, IManage, IMenu } from '../types'
import { OverlaysProvider } from '@overlastic/vue'
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig, useManage } from '../hooks'
import { useAuthStore, useRouteStore } from '../stores'
import { useManageStore } from '../stores/manage'

export const DuxAppProvider = defineComponent({
  name: 'DuxAppProvider',
  props: {
  },
  setup(_props, { slots }) {
    const manageRef = inject<Ref<string>>('dux.manage')

    const config = useConfig()
    const router = useRouter()

    router.beforeEach(async (to, _from, next) => {
      const manageName = to.meta.manageName as string
      const noAuth = to.meta.authorization === false

      if (!manageName) {
        const defaultManage = config.defaultManage || config.manages?.[0]?.name || ''
        return next({
          path: `/${defaultManage}`,
          replace: true,
        })
      }

      if (manageRef) {
        manageRef.value = manageName
      }

      const manageStore = useManageStore(manageName)
      if (!manageStore.isInit()) {
        manageStore.setConfig(config.manages?.find(manage => manage.name === manageName) as IManage, config)
      }

      const routeStore = useRouteStore(manageName)
      const manage = useManage(manageName)
      const authStore = useAuthStore(manageName)

      // unlogin handle
      if (!authStore.isLogin()) {
        if (noAuth) {
          return next()
        }

        return next({
          path: manage.getRoutePath(`login`),
          replace: true,
        })
      }

      const formatMenus = (menus: IMenu[]) => {
        return menus?.map((item: IMenu) => {
          return {
            ...item,
            path: manage.getRoutePath(item.path || ''),
          }
        })
      }

      // init route
      if (!routeStore.getRouteInit()) {
        // components
        const components = manage.config?.components || {}
        const commonRoutes: IMenu[] = []

        if (components.notFound) {
          commonRoutes.push({
            name: `${manageName}.notFound`,
            label: '404',
            path: ':pathMatch(.*)*',
            component: components.notFound,
            hidden: true,
          })
        }

        if (components.notAuthorized) {
          commonRoutes.push({
            name: `${manageName}.notAuthorized`,
            label: '403',
            path: 'notAuthorized',
            component: components.notAuthorized,
            hidden: true,
          })
        }

        if (components.error) {
          commonRoutes.push({
            name: `${manageName}.error`,
            label: '500',
            path: 'error',
            component: components.error,
            hidden: true,
          })
        }

        // init local route
        routeStore.setRoutes(formatMenus(manage.config?.menus || []))

        // init remote route
        if (manage.config?.apiRoutePath) {
          console.log('config', manage.config.default)
          try {
            await (manage.config?.dataProvider as Record<string, IDataProvider>)?.default?.custom({
              path: manage.config.apiRoutePath,
              meta: {
                timeout: 5000,
              },
            }, manage, authStore.getUser()).then((res) => {
              routeStore.appendRoutes(formatMenus(res.data || []))
            })
          }
          catch (error) {
            console.error(error)
          }
        }

        // init common routes
        routeStore.appendRoutes(commonRoutes)

        // register route
        routeStore.getRoutes().forEach((item: IMenu) => {
          if (!item.path) {
            return
          }

          const route: Partial<RouteRecordRaw> = {
            name: item.name,
            path: item.path,
            meta: item.meta,
          }

          switch (item.loader) {
            case 'iframe':
              route.component = manage.config?.components?.iframe || (() => import('../components/loader/iframe'))
              break
            case 'link':
              route.beforeEnter = () => {
                const url = item.meta?.url || item.path
                if (url) {
                  window.open(url, '_blank')
                }
                return false
              }
              route.component = () => Promise.resolve({ template: '<div></div>' })
              break
            default:
              if (item.component) {
                route.component = item.component
              }
              break
          }

          router.addRoute(`${manageName}.auth`, route as RouteRecordRaw)
        })

        // reload route
        return next({
          path: to.fullPath,
          replace: true,
        })
      }

      const pathMatch = [
        '',
        '/',
        `/${manageName}`,
        `/${manageName}/`,
      ]

      // index route redirect
      if (pathMatch.includes(to.path)) {
        const indexRoute = routeStore.getIndexRoute()

        // if index route is not found
        if (!indexRoute?.path || pathMatch.includes(indexRoute?.path)) {
          console.warn(`[Dux] index route not found, skip redirect`)
          return next()
        }

        return next({
          path: indexRoute?.path || '/',
          replace: true,
        })
      }

      return next()
    })

    return () => (
      <OverlaysProvider>
        {slots.default?.()}
      </OverlaysProvider>
    )
  },
})
