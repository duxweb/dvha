import type { RouteRecordRaw } from 'vue-router'
import type { IConfig } from '../types'
import { createRouter, createWebHashHistory } from 'vue-router'

export function initRouter(config: IConfig) {
  const routes: RouteRecordRaw[] = [
    ...config.routes || [],
    {
      name: 'default',
      path: '/:catchAll(.*)',
      redirect: `/${config.defaultManage || config.manages?.[0]?.name || ''}`,
    },
  ]

  config.manages?.forEach((manage) => {

    const authRoutes = manage.routes?.filter((route) => route.meta?.authorization === true || route.meta?.authorization === undefined) || []
    const noAuthRoutes = manage.routes?.filter((route) => route.meta?.authorization === false) || []

    routes.push({
      name: manage.name,
      path: manage.routePrefix || '',
      children: [
        {
          path: '',
          name: `${manage.name}.auth`,
          component: manage.components?.authLayout,
          children: authRoutes,
        },
        {
          path: '',
          name: `${manage.name}.noAuth`,
          component: manage.components?.noAuthLayout,
          children: noAuthRoutes,
        },
      ],
      meta: {
        manageName: manage.name,
      },
    })
  })

  return createRouter({
    history: createWebHashHistory(),
    routes,
  })
}
