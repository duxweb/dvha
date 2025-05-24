import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

const app = createApp(App)

const config: IConfig = {
  apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default',
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'DVHA 后台管理系统',
      routePrefix: '/admin',
      apiUrl: '/admin',
      components: {
        authLayout: () => import('./pages/layout.vue'),
        notFound: () => import('./pages/404.vue'),
      },
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: () => import('./pages/login.vue'),
          meta: {
            authorization: false,
          },
        },
      ],
      menus: [
        {
          name: 'home',
          path: 'index',
          icon: 'i-tabler:home',
          label: '首页',
          component: () => import('./pages/home.vue'),
        },
        {
          name: 'users',
          path: 'users',
          icon: 'i-tabler:users',
          label: '用户管理',
          component: () => import('./pages/home.vue'),
        },
        {
          name: 'settings',
          path: 'settings',
          icon: 'i-tabler:settings',
          label: '系统设置',
          component: () => import('./pages/home.vue'),
        },
      ],
    },
  ],
  dataProvider: simpleDataProvider,
  authProvider: simpleAuthProvider,
}

app.use(createDux(config))
app.mount('#app')
