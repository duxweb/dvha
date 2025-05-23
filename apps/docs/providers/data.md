# 数据提供者

数据提供者是 DVHA 的核心概念之一，它是一个抽象层，负责处理应用程序与后端 API 之间的所有数据交互。通过数据提供者，您可以轻松地连接到任何后端服务，无论是 REST API、GraphQL，还是其他数据源。

## 什么是数据提供者？

数据提供者是一个实现了特定接口的对象，它定义了如何与您的后端 API 通信。DVHA 通过数据提供者来执行所有的数据操作，包括：

- **获取列表数据** (getList)
- **获取单条数据** (getOne)
- **获取多条数据** (getMany)
- **创建数据** (create)
- **更新数据** (update)
- **删除数据** (deleteOne)
- **批量操作** (createMany, updateMany, deleteMany)
- **自定义请求** (custom)

## 简单数据提供者

DVHA 内置了 `simpleDataProvider`，适用于开发和测试：

```typescript
import { simpleDataProvider } from '@duxweb/dvha-core'

const config: IConfig = {
  dataProvider: simpleDataProvider,
  // ... 其他配置
}
```

::: tip
`simpleDataProvider` 是一个基于标准 RESTful API 的简单实现，支持常见的 CRUD 操作，适合快速开始和原型开发。
:::

## 数据提供者接口

```typescript
interface IDataProvider {
  // 获取列表
  getList: (
    options: IDataProviderListOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 创建数据
  create: (
    options: IDataProviderCreateOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 更新数据
  update: (
    options: IDataProviderUpdateOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 删除单个数据
  deleteOne: (
    options: IDataProviderDeleteOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 获取单个数据
  getOne: (
    options: IDataProviderGetOneOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 获取多个数据
  getMany: (
    options: IDataProviderGetManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 创建多个数据 (可选)
  createMany?: (
    options: IDataProviderCreateManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 更新多个数据 (可选)
  updateMany?: (
    options: IDataProviderUpdateManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 删除多个数据 (可选)
  deleteMany?: (
    options: IDataProviderDeleteManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>

  // 自定义请求 (可选)
  custom?: (
    options: IDataProviderCustomOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>
}
```

## 参数说明

### 通用参数

每个数据提供者方法都接收三个参数：

- **options**: 请求选项对象，包含具体的操作参数
- **manage**: 当前管理端实例，提供 API URL 构建等功能
- **auth**: 当前用户认证状态，包含 token 等信息

### 列表查询参数

```typescript
interface IDataProviderListOptions {
  path: string                              // 资源路径，如 'users'
  pagination?: {                            // 分页参数
    page: number                            // 当前页码
    limit: number                           // 每页数量
    pageSize: number                        // 页面大小
  } | boolean
  sorters?: Record<string, 'asc' | 'desc'>  // 排序条件
  filters?: Record<string, any>             // 过滤条件
  meta?: Record<string, any>                // 额外的请求参数
}
```

### 创建数据参数

```typescript
interface IDataProviderCreateOptions {
  path?: string                             // 资源路径，如 'users'
  data: any                                 // 要创建的数据
  meta?: Record<string, any>                // 额外的请求参数
}
```

### 更新数据参数

```typescript
interface IDataProviderUpdateOptions {
  path?: string                             // 资源路径
  id?: string | number                      // 要更新的记录 ID
  data: any                                 // 更新数据
  meta?: Record<string, any>                // 额外的请求参数
}
```

### 删除数据参数

```typescript
interface IDataProviderDeleteOptions {
  path: string                              // 资源路径
  id: string | number                       // 要删除的记录 ID
  meta?: Record<string, any>                // 额外的请求参数
}
```

### 获取单条数据参数

```typescript
interface IDataProviderGetOneOptions {
  path: string                              // 资源路径
  id: string | number                       // 记录 ID
  meta?: Record<string, any>                // 额外的请求参数
}
```

### 获取多条数据参数

```typescript
interface IDataProviderGetManyOptions {
  path: string                              // 资源路径
  ids: (string | number)[]                  // 记录 ID 数组
  meta?: Record<string, any>                // 额外的请求参数
}
```

### 自定义请求参数

```typescript
interface IDataProviderCustomOptions {
  path?: string                             // 请求路径
  method?: string                           // HTTP 方法
  query?: Record<string, any>               // 查询参数
  payload?: any                             // 请求体数据
  headers?: Record<string, string>          // 自定义请求头
  filters?: Record<string, any>             // 过滤条件
  sorters?: Record<string, 'asc' | 'desc'>  // 排序条件
  meta?: Record<string, any>                // 额外的请求参数
}
```

## 返回格式

### 标准响应格式

所有数据提供者方法都应该返回符合以下格式的响应：

```typescript
interface IDataProviderResponse {
  message?: string                          // 响应消息
  data?: any                                // 响应数据
  meta?: Record<string, any>                // 元数据信息
  [key: string]: any                        // 其他自定义字段
}
```

### 列表数据响应示例

```typescript
{
  message: "获取成功",
  data: [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ],
  meta: {
    total: 50,        // 总记录数
    page: 1,          // 当前页码
    pageSize: 10,     // 每页数量
    totalPages: 5     // 总页数
  }
}
```

### 单条数据响应示例

```typescript
{
  message: "获取成功",
  data: {
    id: 1,
    name: 'John',
    email: 'john@example.com',
    createdAt: '2023-12-01T10:00:00Z'
  },
  meta: {
    lastModified: '2023-12-01T10:00:00Z'
  }
}
```

### 创建/更新响应示例

```typescript
{
  message: "操作成功",
  data: {
    id: 1,
    name: 'John',
    email: 'john@example.com'
  }
}
```

### 删除响应示例

```typescript
{
  message: "删除成功",
  data: null
}
```

## 配置数据提供者

### 基本配置

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleDataProvider } from '@duxweb/dvha-core'

const config: IConfig = {
  apiUrl: 'https://api.example.com',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      apiUrl: '/admin',
      // ... 其他配置
    }
  ],
  dataProvider: simpleDataProvider,  // 使用简单数据提供者
}
```

### 自定义数据提供者

```typescript
import type { IDataProvider } from '@duxweb/dvha-core'

const customDataProvider: IDataProvider = {
  getList: async (options, manage, auth) => {
    // 您的实现逻辑
    // 使用 manage?.getApiUrl(options.path) 构建 URL
    // 使用 auth?.token 添加认证信息
    return {
      message: '获取成功',
      data: [], // 您的数据
      meta: {}  // 元数据
    }
  },

  create: async (options, manage, auth) => {
    // 您的创建逻辑
    return { message: '创建成功', data: {} }
  },

  // ... 实现其他必需的方法
}

const config: IConfig = {
  dataProvider: customDataProvider,
  // ... 其他配置
}
```

### 多管理端数据提供者

不同的管理端可以使用不同的数据提供者：

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',
      dataProvider: adminDataProvider,    // 管理端专用
      // ... 其他配置
    },
    {
      name: 'merchant',
      dataProvider: merchantDataProvider, // 商户端专用
      // ... 其他配置
    }
  ],
  dataProvider: globalDataProvider,       // 全局后备
}
```

## URL 构建

在数据提供者中，使用 `manage?.getApiUrl()` 方法构建完整的 API URL：

```typescript
// 基础路径
const url = manage?.getApiUrl(options.path) || ''
// 结果: https://api.example.com/admin/users

// 带 ID 的路径
const url = manage?.getApiUrl(`${options.path}/${options.id}`) || ''
// 结果: https://api.example.com/admin/users/123
```

## 认证集成

使用第三个参数中的认证信息：

```typescript
const headers: Record<string, string> = {}

if (auth?.token) {
  headers['Authorization'] = `Bearer ${auth.token}`
}

// 在 HTTP 请求中使用
```

## 下一步

了解如何在组件中使用数据提供者：

- 📊 [数据查询 (useList)](/hooks/data/useList) - 获取列表数据
- 📄 [获取单条 (useOne)](/hooks/data/useOne) - 获取单条记录
- ➕ [数据创建 (useCreate)](/hooks/data/useCreate) - 创建新记录
- ✏️ [数据更新 (useUpdate)](/hooks/data/useUpdate) - 更新现有记录
- 🗑️ [数据删除 (useDelete)](/hooks/data/useDelete) - 删除记录