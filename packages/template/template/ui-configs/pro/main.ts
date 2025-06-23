import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'
import { createApp } from 'vue'

import '@duxweb/dvha-pro/style.css'

const { createDuxPro, DuxApp, DuxAuthLayout, DuxLayout, DuxLoginPage, DuxPage404, DuxPage500, DuxPageLoading, enUS, zhCN } = DuxPro

const app = createApp(DuxApp)

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'Dux Pro 管理系统',
      routePrefix: '/admin',
      apiUrl: '/admin',
      apiRoutePath: '/routes',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        loading: DuxPageLoading,
        error: DuxPage500,
      },
      userMenus: [
        {
          label: '设置',
          key: 'setting',
          icon: 'i-tabler:settings',
          path: 'setting',
        },
      ],
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
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
          label: '工作台',
          component: () => import('./pages/home.vue'),
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
  remote: {
    packages: {
      'naive-ui': NaiveUI,
      '@duxweb/dvha-pro': DuxPro,
    },
  },
}

app.use(createDux(config))
app.use(NaiveUI)
app.use(createDuxPro())

app.mount('#app')
