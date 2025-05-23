import { defineComponent, inject, Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig, useManage } from '../hooks'
import { useAuthStore, useRouteStore } from '../stores'
import { storeToRefs } from 'pinia'
import { IMenu } from '../types'
import { OverlaysProvider } from '@overlastic/vue'

export const DuxAppProvider = defineComponent({
  name: 'DuxAppProvider',
  props: {
  },
  setup(_props, { slots }) {
    const manageRef = inject<Ref<string>>('dux.manage')

    const config = useConfig()
    const router = useRouter()
    const authStore = useAuthStore()


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

      const routeStore = useRouteStore(manageName)
      const { routes } = storeToRefs(routeStore)
      const manage = useManage(manageName)

      // unlogin handle
      if (!authStore.isLogin(manageName)) {

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
          })
        }

        if (components.notAuthorized) {
          commonRoutes.push({
            name: `${manageName}.notAuthorized`,
            label: '403',
            path: 'notAuthorized',
            component: components.notAuthorized,
          })
        }

        if (components.error) {
          commonRoutes.push({
            name: `${manageName}.error`,
            label: '500',
            path: 'error',
            component: components.error,
          })
        }


        // init local route
        routeStore.setRoutes(formatMenus(manage.config?.menus || []))

        // init remote route
        if (manage.config?.apiRoutePath) {
          try {
            await manage.config.dataProvider?.custom({
              path: manage.config.apiRoutePath,
              meta: {
                timeout: 5000,
              }
            }, manage, authStore.getUser(manageName)).then((res) => {
              routeStore.appendRoutes(formatMenus(res.data || []))
            })
          } catch (error) {
            console.error(error)
          }
        }

        // init common routes
        routeStore.appendRoutes(commonRoutes)

        // register route
        routes.value.forEach((item: IMenu) => {
          if (!item.path) {
            return
          }

          router.addRoute(`${manageName}.auth`, {
            name: item.name,
            path: item.path,
            component: typeof item.component === 'function' ? item.component : () => import('../components/loader/iframe'),
            meta: item.meta,
          })
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
