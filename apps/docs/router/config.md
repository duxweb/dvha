# 路由配置

DVHA 会在初始化时根据全局配置与管理端配置生成路由。

## 路由来源

- `config.routes`：全局路由
- `manage.routes`：管理端路由（根据 `meta.authorization` 区分）

## 认证区分

在 `manage.routes` 中：

- `meta.authorization === false` → 归入 `noAuthLayout`
- 其他情况（`true`/`undefined`）→ 归入 `authLayout`

## 基础示例

```ts
import { createDux } from '@duxweb/dvha-core'

createDux({
  defaultManage: 'admin',
  routes: [
    { path: '/help', name: 'help', component: () => import('./Help.vue') },
  ],
  manages: [
    {
      name: 'admin',
      routePrefix: '/admin',
      routes: [
        { path: 'login', name: 'admin.login', component: () => import('./Login.vue'), meta: { authorization: false } },
        { path: 'home', name: 'admin.home', component: () => import('./Home.vue') },
      ],
      components: {
        authLayout: () => import('./layouts/AuthLayout.vue'),
        noAuthLayout: () => import('./layouts/NoAuthLayout.vue'),
      },
    },
  ],
})
```

## 默认重定向

系统会自动添加兜底路由：

```
/:catchAll(.*) → /{defaultManage 或第一个管理端名称}
```
