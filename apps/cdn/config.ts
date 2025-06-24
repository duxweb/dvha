import type { IConfig } from '@duxweb/dvha-core'
import { i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import { enUS, zhCN } from '@duxweb/dvha-pro'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

declare global {
  interface Window {
    duxConfig?: {
      defaultManage?: string
      theme?: {
        logo?: string
        darkLogo?: string
        banner?: string
        darkBanner?: string
      }
      copyright?: string
      manage?: Array<{
        name?: string
        title?: string
        description?: string
        routePrefix?: string
        apiBasePath?: string
        apiRoutePath?: string
        userMenus?: Array<{
          key?: string
          label?: string
          icon?: string
          path?: string
        }>
      }>
    }
  }
}

const config = {
  defaultManage: 'admin',
  theme: {},
  copyright: 'Dux Pro',
  manages: [
  ],
  dataProvider: simpleDataProvider({
    apiUrl: '',
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
    components: NaiveUI as any,
  },
}

function injectConfig(config): IConfig {
  if (typeof window == 'undefined' || !window.duxConfig) {
    throw new Error('config not found')
  }

  const serverConfig = window.duxConfig

  config.defaultManage = serverConfig.defaultManage || config.defaultManage

  if (serverConfig.theme) {
    config.theme = {
      ...config.theme,
      ...serverConfig.theme,
    }
  }

  config.copyright = serverConfig.copyright || config.copyright

  serverConfig?.manage?.forEach((serverManage) => {
    config.manages.push({
      ...serverManage,
      components: {
        authLayout: DuxPro.DuxAuthLayout,
        noAuthLayout: DuxPro.DuxLayout,
        notFound: DuxPro.DuxPage404,
        loading: DuxPro.DuxPageLoading,
        error: DuxPro.DuxPage500,
      },
      routes: [
        {
          name: `${serverManage.name}.login`,
          path: 'login',
          component: DuxPro.DuxLoginPage,
          meta: {
            authorization: false,
          },
        },
      ],
    } as any)
  })

  return config as IConfig
}

export default injectConfig(config)
