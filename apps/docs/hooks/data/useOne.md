# useOne

`useOne` hook 用于获取单条数据记录。

## 功能特点

- 📄 **单条查询** - 获取指定 ID 的资源详情
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- 🔄 **自动重新验证** - 数据过期时自动刷新
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🛡️ **错误处理** - 自动处理网络错误和认证失败
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `getOne(options, manage, auth)` 方法获取单条数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  getOne(
    options: IDataProviderGetOneOptions,
    manage?: IManageHook,
    auth?: IUserState
  ): Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderGetOneOptions {
  path: string                                          // API 路径
  id?: string | number                                  // 资源 ID
  meta?: Record<string, any>                           // 额外参数
}

// 响应数据接口
interface IDataProviderResponse {
  message?: string                          // 响应消息
  data?: any                                // 响应数据
  meta?: Record<string, any>                // 元数据信息
  [key: string]: any                        // 其他自定义字段
}
```

## 使用方法

```js
import { useOne } from '@duxweb/dvha-core'

const { data, isLoading, isError, error } = useOne({
  path: 'users',
  id: 1
})
```

## 常用参数

```js
const { data, isLoading, isError, error, refetch } = useOne({
  // 必需参数
  path: 'users',           // API 路径
  id: 1,                   // 资源 ID

  // 可选参数
  meta: {                  // 额外参数
    include: 'profile,roles'
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onError: (err) => {      // 错误回调
    console.error('获取失败:', err)
  }
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | API 资源路径 |
| `id` | `string \| number` | ❌ | 资源 ID |
| `meta` | `Record<string, any>` | ❌ | 传递给 API 的额外参数 |
| `providerName` | `string` | ❌ | 数据提供者名称，默认为 'default' |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |
| `options` | `IDataQueryOptions` | ❌ | TanStack Query 选项 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<any>` | 响应数据 |
| `isLoading` | `Ref<boolean>` | 是否加载中 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `refetch` | `Function` | 重新获取数据 |

## 动态 ID 查询

```js
import { useOne } from '@duxweb/dvha-core'
import { ref, watch } from 'vue'

const userId = ref(1)

const { data, isLoading, refetch } = useOne({
  path: 'users',
  id: userId.value
})

// 监听 ID 变化，自动重新获取
watch(userId, () => {
  refetch()
})
```

## 多数据提供者示例

```js
import { useOne } from '@duxweb/dvha-core'

// 使用默认数据提供者获取用户详情
const { data: user } = useOne({
  path: 'users',
  id: 1
})

// 使用分析服务获取报告详情
const { data: report } = useOne({
  path: 'reports',
  id: 'report-123',
  providerName: 'analytics'
})

// 使用支付服务获取订单详情
const { data: order } = useOne({
  path: 'orders',
  id: 'order-456',
  providerName: 'payment',
  meta: {
    include: 'items,shipping'
  }
})
```

## 响应格式

```json
{
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "status": "active",
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```