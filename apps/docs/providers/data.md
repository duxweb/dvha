# 数据提供者

数据提供者是 DVHA 的核心概念之一，它是一个抽象层，负责处理应用程序与后端 API 之间的所有数据交互。通过数据提供者，您可以轻松地连接到任何后端服务，无论是 REST API、GraphQL，还是其他数据源。

## 什么是数据提供者？

数据提供者是一个实现了特定接口的对象，它定义了如何与您的后端 API 通信。DVHA 通过数据提供者来执行所有的数据操作，包括：

- **获取接口地址** (apiUrl)
- **获取列表数据** (getList)
- **获取单条数据** (getOne)
- **获取多条数据** (getMany)
- **创建数据** (create)
- **更新数据** (update)
- **删除数据** (deleteOne)
- **批量操作** (createMany, updateMany, deleteMany)
- **自定义请求** (custom)
- **获取数据总数** (getTotal)

## 简单数据提供者

DVHA 内置了 `simpleDataProvider`，适用于开发和测试：

```typescript
import { simpleDataProvider } from '@duxweb/dvha-core'

const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com',
  // 可选：自定义成功响应处理
  successCallback: res => ({
    message: res.data?.message,
    data: res.data?.data,
    meta: res.data?.meta,
    raw: res.data
  }),
  // 可选：自定义错误处理
  errorCallback: err => ({
    message: err.response?.data?.message || err?.message,
    data: err.response?.data?.data,
    meta: err.response?.data?.meta,
    status: err.response?.data?.code || err.response?.status || 500,
    raw: err.response?.data
  }),
  // 可选：自定义总数获取逻辑
  getTotal: options => options.meta?.total || 0
})

const config: IConfig = {
  dataProvider,
  // ... 其他配置
}
```

::: tip
`simpleDataProvider` 是一个基于标准 RESTful API 和 Axios 的实现，支持常见的 CRUD 操作，适合快速开始和原型开发。配置时需要传入一个包含 `apiUrl` 属性的对象，还可以提供自定义的回调函数来处理响应和错误。
:::

## 数据提供者接口

```typescript
interface IDataProvider {
  // 获取接口地址
  apiUrl?: (path?: string, basePath?: string) => string

  // 获取列表
  getList: (options: IDataProviderListOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 创建数据
  create: (options: IDataProviderCreateOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 更新数据
  update: (options: IDataProviderUpdateOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 删除单个数据
  deleteOne: (options: IDataProviderDeleteOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 获取单个数据
  getOne: (options: IDataProviderGetOneOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 获取多个数据
  getMany: (options: IDataProviderGetManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 创建多个数据
  createMany: (options: IDataProviderCreateManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 更新多个数据
  updateMany: (options: IDataProviderUpdateManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 删除多个数据
  deleteMany: (options: IDataProviderDeleteManyOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 自定义请求
  custom: (options: IDataProviderCustomOptions, manage?: IManageHook, auth?: IUserState) => Promise<IDataProviderResponse>

  // 获取数据总数
  getTotal: (options: IDataProviderResponse) => number
}
```

## 参数说明

### 通用参数

每个数据提供者方法都接收三个参数：

- **options**: 请求选项对象，包含具体的操作参数
- **manage**: 当前管理端实例，提供 API URL 构建等功能
- **auth**: 当前用户认证状态，包含 token 等信息

### 选项接口

```typescript
// 分页选项
interface IDataProviderPagination {
  page?: number
  pageSize?: number
  pageCount?: number
  total?: number
}

// 进度回调接口
interface IDataProviderProgress {
  loaded: number
  total?: number
  percent?: number
}

// 列表查询选项
interface IDataProviderListOptions {
  path: string
  pagination?: IDataProviderPagination | boolean
  sorters?: Record<string, 'asc' | 'desc'>
  filters?: Record<string, any>
  meta?: Record<string, any>
}

// 创建数据选项
interface IDataProviderCreateOptions {
  path?: string
  data?: any
  meta?: Record<string, any>
}

// 更新数据选项
interface IDataProviderUpdateOptions extends IDataProviderCreateOptions {
  id?: string | number
}

// 获取单个数据选项
interface IDataProviderGetOneOptions {
  path: string
  id?: string | number
  meta?: Record<string, any>
}

// 获取多个数据选项
interface IDataProviderGetManyOptions {
  path: string
  ids: string[] | number[]
  meta?: Record<string, any>
}

// 创建多个数据选项
interface IDataProviderCreateManyOptions {
  path?: string
  data?: any[]
  meta?: Record<string, any>
}

// 更新多个数据选项
interface IDataProviderUpdateManyOptions {
  path?: string
  data?: any
  meta?: Record<string, any>
  ids: string[] | number[]
}

// 删除多个数据选项
interface IDataProviderDeleteManyOptions {
  path?: string
  meta?: Record<string, any>
  ids: string[] | number[]
}

// 删除单个数据选项
interface IDataProviderDeleteOptions {
  path?: string
  meta?: Record<string, any>
  id?: string | number
}

// 自定义请求选项
interface IDataProviderCustomOptions {
  path?: string
  method?: string
  sorters?: Record<string, 'asc' | 'desc'>
  filters?: Record<string, any>
  query?: Record<string, any>
  headers?: Record<string, string>
  meta?: Record<string, any>
  payload?: any
  signal?: AbortSignal // 请求取消信号
  onUploadProgress?: (progress: IDataProviderProgress) => void // 上传进度回调
  onDownloadProgress?: (progress: IDataProviderProgress) => void // 下载进度回调
}
```

## 返回格式

### 标准响应格式

所有数据提供者方法都应该返回符合以下格式的响应：

```typescript
interface IDataProviderResponse {
  message?: string // 响应消息
  data?: any // 响应数据
  meta?: Record<string, any> // 元数据信息
  raw?: any // 原始响应数据
  [key: string]: any // 其他自定义字段
}
```

### 错误响应格式

当数据请求发生错误时，数据提供者应该抛出符合以下格式的错误对象：

```typescript
interface IDataProviderError {
  status?: number // HTTP 状态码（如 400、401、404、500 等）
  message?: string // 用户友好的错误消息
  data?: any // 详细的错误数据或验证错误信息
  meta?: Record<string, any> // 错误相关的元数据
  raw?: any // 原始的错误响应数据
  [key: string]: any // 其他自定义错误字段
}
```

**错误处理说明：**

- **status**: HTTP 状态码，用于判断错误类型（网络错误、认证错误、服务器错误等）
- **message**: 面向用户的错误提示信息，应该是可读性强的中文描述
- **data**: 包含具体的错误详情，如表单验证错误、字段错误等
- **meta**: 错误相关的附加信息，如错误代码、时间戳等
- **raw**: 保留原始的服务器响应，便于调试和日志记录

**错误抛出示例：**

```typescript
// 网络错误
throw new Error(JSON.stringify({
  status: 500,
  message: '服务器内部错误，请稍后重试',
  data: null,
  meta: { timestamp: Date.now() },
  raw: originalError
}))

// 认证错误
throw new Error(JSON.stringify({
  status: 401,
  message: '登录已过期，请重新登录',
  data: null,
  meta: { redirectTo: '/login' }
}))

// 验证错误
throw new Error(JSON.stringify({
  status: 422,
  message: '数据验证失败',
  data: {
    email: ['邮箱格式不正确'],
    password: ['密码长度至少6位']
  },
  meta: { field_count: 2 }
}))

// 权限错误
throw new Error(JSON.stringify({
  status: 403,
  message: '权限不足，无法执行此操作',
  data: { required_permission: 'user.delete' },
  meta: { action: 'delete_user' }
}))
```

### 列表数据响应示例

```json
{
  "message": "获取成功",
  "data": [
    { "id": 1, "name": "John", "email": "john@example.com" },
    { "id": 2, "name": "Jane", "email": "jane@example.com" }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### 单条数据响应示例

```json
{
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com",
    "createdAt": "2023-12-01T10:00:00Z"
  },
  "meta": {
    "lastModified": "2023-12-01T10:00:00Z"
  }
}
```

### 创建/更新响应示例

```json
{
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  }
}
```

### 删除响应示例

```json
{
  "message": "删除成功",
  "data": null
}
```

## 配置数据提供者

### 基本配置

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { simpleDataProvider } from '@duxweb/dvha-core'

const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com'
})

const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      // ... 其他配置
    }
  ],
  dataProvider, // 使用简单数据提供者
}
```

### 简单数据提供者配置选项

```typescript
interface ISimpleDataProviderProps {
  apiUrl: string // 基础 API URL
  successCallback?: (res: any) => IDataProviderResponse // 自定义成功响应处理
  errorCallback?: (err: any) => IDataProviderError // 自定义错误处理
  getTotal?: (options: IDataProviderResponse) => number // 自定义总数获取
}

const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com',

  // 自定义成功响应处理
  successCallback: res => ({
    message: res.data?.message,
    data: res.data?.data,
    meta: res.data?.meta,
    raw: res.data
  }),

  // 自定义错误处理
  errorCallback: err => ({
    message: err.response?.data?.message || err?.message,
    data: err.response?.data?.data,
    meta: err.response?.data?.meta,
    status: err.response?.data?.code || err.response?.status || 500,
    raw: err.response?.data
  }),

  // 自定义总数获取
  getTotal: options => options.meta?.total || options.data?.length || 0
})
```

### 自定义数据提供者

```typescript
import type { IDataProvider } from '@duxweb/dvha-core'

const customDataProvider: IDataProvider = {
  apiUrl: (path?: string, basePath?: string) => {
    // 您的URL构建逻辑
    const prefixUrl = `https://api.example.com${basePath ? `/${basePath}` : ''}`
    return path ? `${prefixUrl}/${path}` : prefixUrl
  },

  getList: async (options, manage, auth) => {
    // 您的实现逻辑
    // 使用 auth?.token 添加认证信息
    return {
      message: '获取成功',
      data: [], // 您的数据
      meta: {} // 元数据
    }
  },

  create: async (options, manage, auth) => {
    // 您的创建逻辑
    return { message: '创建成功', data: {} }
  },

  // ... 实现其他必需的方法
  createMany: async (options, manage, auth) => {
    // 批量创建逻辑
    return { message: '批量创建成功', data: {} }
  },

  updateMany: async (options, manage, auth) => {
    // 批量更新逻辑
    return { message: '批量更新成功', data: {} }
  },

  deleteMany: async (options, manage, auth) => {
    // 批量删除逻辑
    return { message: '批量删除成功', data: {} }
  },

  custom: async (options, manage, auth) => {
    // 自定义请求逻辑，支持上传下载进度回调
    return { message: '请求成功', data: {} }
  },

  getTotal: (options) => {
    // 获取数据总数逻辑
    return options.meta?.total || 0
  }
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
      dataProvider: simpleDataProvider({ // 管理端专用
        apiUrl: 'https://admin-api.example.com'
      }),
      // ... 其他配置
    },
    {
      name: 'merchant',
      dataProvider: simpleDataProvider({ // 商户端专用
        apiUrl: 'https://merchant-api.example.com'
      }),
      // ... 其他配置
    }
  ],
  dataProvider: simpleDataProvider({ // 全局后备
    apiUrl: 'https://api.example.com'
  }),
}
```

### 多数据源配置

在单个管理端中使用多个数据源：

```typescript
const config: IConfig = {
  // 全局多数据源配置
  dataProvider: {
    default: simpleDataProvider({
      apiUrl: 'https://api.example.com'
    }),
    analytics: simpleDataProvider({
      apiUrl: 'https://analytics-api.example.com'
    }),
    payment: simpleDataProvider({
      apiUrl: 'https://payment-api.example.com'
    }),
    logistics: simpleDataProvider({
      apiUrl: 'https://logistics-api.example.com'
    })
  },

  manages: [
    {
      name: 'admin',
      // 管理端可以覆盖特定的数据源
      dataProvider: {
        default: simpleDataProvider({
          apiUrl: 'https://admin-api.example.com'
        }),
        analytics: simpleDataProvider({
          apiUrl: 'https://admin-analytics.example.com'
        })
        // 其他数据源会从全局继承
      }
    }
  ]
}
```

## URL 构建

### 使用数据提供者的 apiUrl 方法

```typescript
// 在数据提供者中构建URL
const url = dataProvider.apiUrl?.(options.path) || ''
// 结果: https://api.example.com/users

// 带基础路径的URL构建
const url = dataProvider.apiUrl?.(options.path, 'v1/api') || ''
// 结果: https://api.example.com/v1/api/users

// 带 ID 的路径
const url = dataProvider.apiUrl?.(`${options.path}/${options.id}`, 'v1/api') || ''
// 结果: https://api.example.com/v1/api/users/123
```

### 使用管理端的 getApiUrl 方法

在数据提供者中，可以使用 `manage?.config.apiBasePath` 获取管理端的 API 基础路径：

```typescript
// 基础路径
const url = dataProvider.apiUrl?.(options.path, manage?.config.apiBasePath) || ''
// 结果: https://api.example.com/admin/users

// 带 ID 的路径
const url = dataProvider.apiUrl?.(`${options.path}/${options.id}`, manage?.config.apiBasePath) || ''
// 结果: https://api.example.com/admin/users/123
```

## 认证集成

使用第三个参数中的认证信息：

```typescript
const headers: Record<string, string> = {}

if (auth?.token) {
  headers.Authorization = auth.token // 直接使用 token，不需要 Bearer 前缀
}

// 在 HTTP 请求中使用
```

## 进度监控

自定义请求支持上传和下载进度监控：

```typescript
// 使用自定义请求进行文件上传
const uploadResponse = await dataProvider.custom({
  path: 'upload',
  method: 'POST',
  payload: formData,
  onUploadProgress: (progress) => {
    console.log(`上传进度: ${progress.percent}%`)
    console.log(`已上传: ${progress.loaded} / ${progress.total} 字节`)
  }
}, manage, auth)

// 使用自定义请求进行文件下载
const downloadResponse = await dataProvider.custom({
  path: 'download/file.zip',
  method: 'GET',
  onDownloadProgress: (progress) => {
    console.log(`下载进度: ${progress.percent}%`)
    console.log(`已下载: ${progress.loaded} / ${progress.total} 字节`)
  }
}, manage, auth)
```

## 请求取消

支持使用 AbortSignal 取消请求：

```typescript
const controller = new AbortController()

// 发起可取消的请求
const response = await dataProvider.custom({
  path: 'long-running-task',
  method: 'POST',
  payload: data,
  signal: controller.signal
}, manage, auth)

// 在需要时取消请求
controller.abort()
```

## 下一步

了解如何在组件中使用数据提供者：

- 📊 [数据查询 (useList)](/hooks/data/useList) - 获取列表数据
- 📄 [获取单条 (useOne)](/hooks/data/useOne) - 获取单条记录
- ➕ [数据创建 (useCreate)](/hooks/data/useCreate) - 创建新记录
- ✏️ [数据更新 (useUpdate)](/hooks/data/useUpdate) - 更新现有记录
- 🗑️ [数据删除 (useDelete)](/hooks/data/useDelete) - 删除记录
