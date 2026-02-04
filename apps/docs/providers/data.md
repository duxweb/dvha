# 数据提供者

数据提供者用于承载 DVHA 的所有数据请求逻辑。

## 接口定义

```ts
interface IDataProvider {
  apiUrl?: (path?: string, basePath?: string) => string
  getList: (options: IDataProviderListOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  create: (options: IDataProviderCreateOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  update: (options: IDataProviderUpdateOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  deleteOne: (options: IDataProviderDeleteOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  getOne: (options: IDataProviderGetOneOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  getMany: (options: IDataProviderGetManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  createMany: (options: IDataProviderCreateManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  updateMany: (options: IDataProviderUpdateManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  deleteMany: (options: IDataProviderDeleteManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  custom: (options: IDataProviderCustomOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>
  getTotal: (options: IDataProviderResponse) => number
}
```

## 简单数据提供者

内置 `simpleDataProvider`（Axios 实现）：

```ts
import { simpleDataProvider } from '@duxweb/dvha-core'

const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com',
})
```

## 配置方式

`dataProvider` 支持单个或多数据源：

```ts
const config = {
  dataProvider: {
    default: simpleDataProvider({ apiUrl: 'https://api.example.com' }),
    analytics: simpleDataProvider({ apiUrl: 'https://analytics.example.com' }),
  },
}
```

管理端也可以覆盖：

```ts
const config = {
  manages: [
    {
      name: 'admin',
      dataProvider: simpleDataProvider({ apiUrl: 'https://admin.example.com' }),
    },
  ],
}
```

## 响应与错误

```ts
interface IDataProviderResponse {
  message?: string
  data?: any
  meta?: Record<string, any>
  raw?: any
  headers?: Record<string, any>
  status?: number
}

interface IDataProviderError {
  status?: number
  message?: string
  data?: any
  meta?: Record<string, any>
  raw?: any
}
```
