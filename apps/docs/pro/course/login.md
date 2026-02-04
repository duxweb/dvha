# 登录与鉴权

核心步骤：

1. 配置 `authProvider`。
2. 注册登录路由并使用 `DuxLoginPage`。

示例（节选）：

```ts
import { simpleAuthProvider } from '@duxweb/dvha-core'
import { DuxLoginPage } from '@duxweb/dvha-pro'

const config = {
  authProvider: simpleAuthProvider(),
  manages: [
    {
      name: 'admin',
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
}
```
