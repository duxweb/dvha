import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import ElementPlus from 'element-plus'
import naive from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

const app = createApp(App)

const config: IConfig = {
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
          },
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
      ],
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
          },
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
      ],
    },
  ],
  dataProvider: simpleDataProvider({
    apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
  }),
  authProvider: simpleAuthProvider(),

}

app.use(createDux(config))
app.use(naive)
app.use(ElementPlus)
app.mount('#app')
