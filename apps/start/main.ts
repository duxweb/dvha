import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import * as dvhaPro from '@duxweb/dvha-pro'
import NaiveUI from 'naive-ui'
import { createApp } from 'vue'

import '@duxweb/dvha-pro/style.css'

const app = createApp(dvhaPro.DuxApp)

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
        authLayout: () => import('./dvha/authLayout.vue'),
        noAuthLayout: () => import('./dvha/layout.vue'),
        notFound: () => import('./dvha/page404.vue'),
        loading: () => import('./dvha/pageLoading.vue'),
        error: () => import('./dvha/page500.vue'),
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
          component: dvhaPro.DuxLoginPage,
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
          name: 'example.list',
          icon: 'i-tabler:layout-kanban',
          label: '列表 ',
        },
        {
          name: 'table',
          path: 'table',
          icon: 'i-tabler:table',
          label: '表格列表',
          component: () => import('./pages/table.vue'),
          parent: 'example.list',
        },
        {
          name: 'list.card',
          path: 'list/card',
          icon: 'i-tabler:list-check',
          label: '卡片列表',
          parent: 'example.list',
          component: () => import('./pages/list/card.vue'),
        },
        {
          name: 'list.article',
          path: 'list/article',
          icon: 'i-tabler:article',
          label: '文章列表',
          parent: 'example.list',
          component: () => import('./pages/list/article.vue'),
        },
        {
          name: 'list.list',
          path: 'list/list',
          icon: 'i-tabler:list',
          label: '订单列表',
          parent: 'example.list',
          component: () => import('./pages/list/list.vue'),
        },
        {
          name: 'example.form',
          icon: 'i-tabler:layout-kanban',
          label: '表单',
        },
        {
          name: 'form.form',
          path: 'form/form',
          icon: 'i-tabler:forms',
          label: '表单页面',
          component: () => import('./pages/form/page.vue'),
          parent: 'example.form',
        },
        {
          name: 'form.setting',
          path: 'form/setting',
          icon: 'i-tabler:settings',
          label: '个人设置',
          hidden: false,
          component: () => import('./pages/setting.vue'),
          parent: 'example.form',
        },
        {
          name: 'render',
          icon: 'i-tabler:layout-kanban',
          label: '渲染',
        },
        {
          name: 'render.json',
          path: 'render/json',
          label: 'Json渲染',
          parent: 'render',
          icon: 'i-tabler:json',
          component: () => import('./pages/render.vue'),
        },
        {
          name: 'render.remote',
          path: 'render/remote',
          icon: 'i-tabler:list-check',
          label: '远程渲染',
          loader: 'remote',
          parent: 'render',
          meta: {
            path: '/remote',
          },

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
      'zh-CN': dvhaPro.zhCN,
      'en-US': dvhaPro.enUS,
    },
  }),
  remote: {
    packages: {
      'naive-ui': NaiveUI,
      '@duxweb/dvha-pro': dvhaPro,
    },
  },
}

app.use(NaiveUI)
app.use(createDux(config))
app.use(dvhaPro.createDuxPro())
app.mount('#app')
