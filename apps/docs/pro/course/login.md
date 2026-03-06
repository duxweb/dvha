# 登录与鉴权

这一页主要讲：**怎么让你的 Pro 后台具备登录能力。**

后台项目基本都绕不开这件事：

- 未登录时去登录页
- 登录成功后进入后台
- 已登录后根据权限决定能看什么

## 最基本要做两件事

1. 配 `authProvider`
2. 注册登录页路由

## 1. 先配置 `authProvider`

```ts
import { simpleAuthProvider } from '@duxweb/dvha-core'

const config = {
  authProvider: simpleAuthProvider(),
}
```

最简单理解：

- `authProvider` 负责登录、退出、校验登录态、权限判断

如果你后面要接自己的后端登录接口，也通常是从这里扩展。

## 2. 再注册登录页

```ts
import { DuxLoginPage } from '@duxweb/dvha-pro'

const config = {
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

这里最关键的是：

- `component: DuxLoginPage`：直接使用 Pro 登录页
- `meta.authorization: false`：表示这个页面不需要登录也能访问

## 3. 权限判断一般放哪

权限判断通常依赖 `authProvider.can`。

```ts
const authProvider = {
  // ...
  can: (name, _params, _manage, auth) => {
    if (!auth?.permission)
      return true
    if (Array.isArray(auth.permission))
      return auth.permission.includes(name)
    if (typeof auth.permission === 'object')
      return auth.permission[name] !== false
    return true
  },
}
```

你可以先简单理解成：

- 框架问：这个用户能不能访问某个权限点
- `can` 返回：能 or 不能

## 4. 最常见问题

### 为什么登录页打不开

先检查：

- 登录路由有没有注册
- 路由 `path` 是否正确
- `meta.authorization: false` 有没有写

### 为什么登录后还是回到登录页

先检查：

- `authProvider` 是否正确返回登录状态
- 登录成功后认证信息是否保存成功

### 为什么菜单显示了，但点进去没权限

先检查：

- `authProvider.can` 的判断逻辑
- 当前用户权限数据结构

## 下一步建议

登录打通后，最推荐继续看：

- [`自定义数据接口`](/pro/course/api)
- [`权限管理与路由守卫`](/pro/course/permission)
