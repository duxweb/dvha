import type { RouteRecordRaw } from 'vue-router'
import type { IConfig } from '@/types'
import { provide } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

export function initRouter(config: IConfig) {
  const routes: RouteRecordRaw[] = []

  config.manages?.forEach((manage) => {
    routes.push({
      path: manage.routePrefix || '',
      children: manage.routes || [],
      meta: {
        manageName: manage.name,
      },
      beforeEnter: (_to, _from, next) => {
        provide('dux.manage', manage.name)
        return next()
      },
    })
  })

  return createRouter({
    history: createWebHashHistory(),
    routes: [
      ...routes,
    ],
  })
}
