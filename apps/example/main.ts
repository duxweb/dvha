import type { IConfig } from '@dux-vue/core'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard, createDux } from '@dux-vue/core'
import { createApp } from 'vue'
import App from './App.vue'
import { authProvider, dataProvider } from './core'

const app = createApp(App)

const config: IConfig = {
  apiUrl: 'https://mock.dux.plus',
  manages: [
    {
      name: 'admin',
      title: '中后台管理系统',
      routePrefix: '/admin',
      apiUrl: 'api',
    },
  ],
  dataProvider,
  authProvider,
  routes: [
    {
      path: '',
      component: () => import('./pages/home.vue'),
      beforeEnter: [authGuard()],
    },
    {
      path: 'login',
      component: () => import('./pages/login.vue'),
    },
  ],
}

app.use(createDux(config))

app.mount('#app')
