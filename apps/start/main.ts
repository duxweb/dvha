import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'
import { createApp } from 'vue'

// import '@duxweb/dvha-pro/style.css'

import '@duxweb/dvha-pro/theme/style.scss'

const { createDuxPro, DuxApp, DuxAuthLayout, DuxLayout, DuxLoginPage, DuxPage404, DuxPage500, enUS, zhCN } = DuxPro

const app = createApp(DuxApp)

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'Dvha Pro',
      routePrefix: '/admin',
      apiBasePath: '/admin',
      apiRoutePath: '/routes',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
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
        {
          name: 'stats',
          path: 'stats',
          icon: 'i-tabler:chart-bar',
          label: '统计',
          component: () => import('./pages/stats.vue'),
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
          name: 'form.ui',
          path: 'form/ui',
          icon: 'i-tabler:forms',
          label: '基本组件',
          component: () => import('./pages/form/ui.vue'),
          parent: 'example.form',
        },
        {
          name: 'form.form',
          path: 'form/form',
          icon: 'i-tabler:forms',
          label: '高阶组件',
          component: () => import('./pages/form/page.vue'),
          parent: 'example.form',
        },
        {
          name: 'form.setting',
          path: 'form/setting',
          icon: 'i-tabler:settings',
          label: '设置页面',
          hidden: false,
          component: () => import('./pages/setting.vue'),
          parent: 'example.form',
        },
        {
          name: 'interaction',
          path: 'interaction',
          icon: 'i-tabler:chart-bar',
          label: '交互',
          component: () => import('./pages/interaction.vue'),
        },
        {
          name: 'chart',
          path: 'chart',
          icon: 'i-tabler:chart-bar',
          label: '图表',
          component: () => import('./pages/chart.vue'),
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
        {
          name: 'poster',
          path: 'poster',
          icon: 'i-tabler:photo',
          label: '图像',
          component: () => import('./pages/posterEditor.vue'),
        },
        {
          name: 'design',
          path: 'design',
          icon: 'i-tabler:code',
          label: '设计',
          component: () => import('./pages/designEditor.vue'),
        },
        {
          name: 'flow',
          icon: 'i-tabler:sitemap',
          label: '流程',
        },
        {
          name: 'flow.approval',
          path: 'flow/approval',
          icon: 'i-tabler:user-check',
          label: '审批流设计器',
          parent: 'flow',
          component: () => import('./pages/flow/approval.vue'),
        },
        {
          name: 'flow.agent',
          path: 'flow/agent',
          icon: 'i-tabler:robot',
          label: 'AI Agent 设计器',
          parent: 'flow',
          component: () => import('./pages/flow/agent.vue'),
        },
      ],
    },
  ],
  dataProvider: simpleDataProvider({
    apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default',
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
  jsonSchema: {
    components: [
      ...Object.values(DuxPro).filter(comp => comp?.name?.startsWith?.('Dux')),
      ...Object.values(DuxNaiveUI).filter(comp => comp?.name?.startsWith?.('Dux')),
      ...Object.entries(NaiveUI)
        .filter(([key, _comp]) => {
          return key.startsWith?.('N')
        })
        .map((comp) => {
          const component = comp[1] as any
          component.name = comp[0]
          return component
        }),
    ],
  },
}

app.use(createDux(config))

app.use(NaiveUI)
app.use(createDuxPro())

app.mount('#app')
