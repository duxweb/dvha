import type { IConfig } from '@dux-vue/core'
import { createDux } from '@dux-vue/core'
import naive from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'
import { authProvider, dataProvider } from './core'
import ElementPlus from 'element-plus'
import 'virtual:uno.css'

const app = createApp(App)

const config: IConfig = {
  apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default',

  defaultManage: 'naive',

  manages: [
    {
      name: 'naive',
      title: 'NAIVE UI',
      routePrefix: '/naive',
      apiUrl: '/admin',
      apiRoutePath: '/routes',
      components: {
        authLayout: () => import('./naive/layout.vue'),
        notFound: () => import('./naive/404.vue'),
      },
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: () => import('./naive/login.vue'),
          meta: {
            authorization: false,
          }
        },
      ],
      menus: [
        {
          name: 'home',
          path: 'index',
          icon: 'i-tabler:home',
          label: '首页',
          component: () => import('./naive/home.vue'),
        },
      ]
    },
    {
      name: 'elm',
      title: 'Element Plus',
      routePrefix: '/elm',
      apiUrl: '/admin',
      apiRoutePath: '/routes',
      components: {
        authLayout: () => import('./element/layout.vue'),
        notFound: () => import('./element/404.vue'),
      },
      routes: [
        {
          name: 'store.login',
          path: 'login',
          component: () => import('./element/login.vue'),
          meta: {
            authorization: false,
          }
        },
      ],
      menus: [
        {
          name: 'home',
          path: 'index',
          icon: 'i-tabler:home',
          label: '首页',
          component: () => import('./naive/home.vue'),
        },
      ]
    },
  ],
  dataProvider,
  authProvider,

}

app.use(createDux(config))
app.use(naive)
app.use(ElementPlus)
app.mount('#app')
