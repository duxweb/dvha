import type { IConfig } from '@duxweb/dvha-core'
import { i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
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
  theme: {},
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
      '@duxweb/dvha-naiveui': DuxNaiveUI,
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

function injectConfig(config: IConfig): IConfig {
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
