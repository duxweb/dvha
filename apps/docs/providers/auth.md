# 认证提供者

认证提供者用于处理登录、登出与认证检查。

## 接口定义

```ts
interface IAuthProvider {
  login: (params: any, manage: IManageHook) => Promise<IAuthLoginResponse>
  logout: (params?: any, manage?: IManageHook) => Promise<IAuthLogoutResponse>
  register?: (params: any, manage?: IManageHook) => Promise<IAuthLoginResponse>
  forgotPassword?: (params: any, manage?: IManageHook) => Promise<IAuthActionResponse>
  updatePassword?: (params: any, manage?: IManageHook) => Promise<IAuthActionResponse>
  check?: (params?: any, manage?: IManageHook, auth?: IUserState) => Promise<IAuthCheckResponse>
  can?: (name: string, params?: any, manage?: IManageHook, auth?: IUserState) => boolean
  onError: (error?: IDataProviderError) => Promise<IAuthErrorResponse>
}
```

## 简单认证提供者

```ts
import { simpleAuthProvider } from '@duxweb/dvha-core'

const authProvider = simpleAuthProvider({
  apiPath: {
    login: '/login',
    check: '/check',
  },
  routePath: {
    login: '/login',
    index: '/',
  },
  dataProviderName: 'default',
})
```

## 配置方式

```ts
const config = {
  authProvider,
}
```

也可以在管理端配置中覆盖：

```ts
const config = {
  manages: [
    {
      name: 'admin',
      authProvider,
    },
  ],
}
```
