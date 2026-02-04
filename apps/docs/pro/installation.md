# 安装指南

## 安装依赖

```bash
pnpm add @duxweb/dvha-pro
```

`@duxweb/dvha-pro` 已包含 `@duxweb/dvha-core` 与 `@duxweb/dvha-naiveui` 依赖。

## 基础接入

```ts
import { createApp } from 'vue'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp, DuxAuthLayout, DuxLayout, DuxLoginPage, DuxPage404, DuxPage403, DuxPage500 } from '@duxweb/dvha-pro'

import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

app.use(createDux({
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      routePrefix: '/admin',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        notAuthorized: DuxPage403,
        error: DuxPage500,
      },
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
          meta: { authorization: false },
        },
      ],
    },
  ],
  dataProvider: simpleDataProvider({ apiUrl: 'https://api.example.com' }),
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({ locale: 'zh-CN', fallbackLocale: 'en-US' }),
}))

app.use(createDuxPro())

app.mount('#app')
```
