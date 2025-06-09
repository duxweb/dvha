import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import naive from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'

import enUS from './langs/en-US.json'
import zhCN from './langs/zh-CN.json'

import 'virtual:uno.css'
import './theme/style.scss'

const app = createApp(App)

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'Dvha Pro',
      routePrefix: '/admin',
      apiUrl: '/admin',
      apiRoutePath: '/routes',
      components: {
        authLayout: () => import('./components/pages/layout'),
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
          name: 'example',
          icon: 'i-tabler:layout-kanban',
          label: '示例',
        },
        {
          name: 'table',
          path: 'table',
          icon: 'i-tabler:table',
          label: '表格',
          component: () => import('./pages/table.vue'),
          parent: 'example',
        },
        {
          name: 'form',
          path: 'form',
          icon: 'i-tabler:forms',
          label: '表单',
          component: () => import('./pages/form.vue'),
          parent: 'example',
        },
        {
          name: 'list',
          path: 'list',
          icon: 'i-tabler:list',
          label: '列表',
          component: () => import('./pages/list.vue'),
        },
      ],
    },
  ],
  dataProvider: simpleDataProvider({
    apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
  }),
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  }),
}

app.use(createDux(config))
app.use(naive)
app.mount('#app')
