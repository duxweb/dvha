# useList

`useList` hook 用于获取列表数据，支持分页、筛选、排序等功能。

## 功能特点

- 📋 **列表查询** - 获取资源列表数据
- 📄 **分页支持** - 自动处理分页逻辑
- 🔍 **筛选排序** - 支持条件筛选和排序
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- 🔄 **自动重新验证** - 数据过期时自动刷新
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `getList(options, manage, auth)` 方法获取列表数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  getList: (
    options: IDataProviderListOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderListOptions {
  path: string // API 路径
  pagination?: { // 分页配置
    page?: number
    pageSize?: number
  }
  filters?: Record<string, any> // 筛选条件
  sorters?: Record<string, 'asc' | 'desc'> // 排序配置
  meta?: Record<string, any> // 额外参数
}

// 响应数据接口
interface IDataProviderResponse {
  message?: string // 响应消息
  data?: any // 响应数据
  meta?: Record<string, any> // 元数据信息
  [key: string]: any // 其他自定义字段
}
```

## 使用方法

```js
import { useList } from '@duxweb/dvha-core'

const { data, isLoading, isError, error } = useList({
  path: 'users'
})
```

## 常用参数

```js
const { data, isLoading, isError, error, refetch } = useList({
  // 必需参数
  path: 'users', // API 路径

  // 可选参数
  pagination: { // 分页配置
    page: 1,
    pageSize: 10
  },
  filters: { // 筛选条件
    name: 'zhang',
    status: 'active'
  },
  sorters: { // 排序
    created_at: 'desc',
    name: 'asc'
  },
  meta: { // 额外参数
    include: 'profile,roles'
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onError: (err) => { // 错误回调
    console.error('获取失败:', err)
  }
})
```

## 参数说明

| 参数           | 类型                              | 必需 | 说明                             |
| -------------- | --------------------------------- | ---- | -------------------------------- |
| `path`         | `string`                          | ✅   | API 资源路径                     |
| `pagination`   | `object`                          | ❌   | 分页配置                         |
| `filters`      | `Record<string, any>`             | ❌   | 筛选条件                         |
| `sorters`      | `Record<string, 'asc' \| 'desc'>` | ❌   | 排序条件                         |
| `meta`         | `Record<string, any>`             | ❌   | 传递给 API 的额外参数            |
| `providerName` | `string`                          | ❌   | 数据提供者名称，默认为 'default' |
| `onError`      | `(error: any) => void`            | ❌   | 错误处理回调                     |
| `options`      | `IDataQueryOptions`               | ❌   | TanStack Query 选项              |

## 返回值

| 字段        | 类型           | 说明         |
| ----------- | -------------- | ------------ |
| `data`      | `Ref<any>`     | 响应数据     |
| `isLoading` | `Ref<boolean>` | 是否加载中   |
| `isError`   | `Ref<boolean>` | 是否出错     |
| `error`     | `Ref<any>`     | 错误信息     |
| `refetch`   | `Function`     | 重新获取数据 |
| `pagination`| `Ref<object>`  | 分页配置对象 |

## 动态筛选示例

```js
import { useList } from '@duxweb/dvha-core'
import { ref, watch } from 'vue'

const searchText = ref('')
const selectedStatus = ref('all')

const { data, isLoading, refetch } = useList({
  path: 'users',
  filters: {
    name: searchText.value,
    status: selectedStatus.value === 'all' ? undefined : selectedStatus.value
  }
})

// 监听筛选条件变化
watch([searchText, selectedStatus], () => {
  refetch()
})
```

## 分页处理示例

```js
import { useList } from '@duxweb/dvha-core'
import { ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)

const { data, isLoading } = useList({
  path: 'users',
  pagination: {
    page: currentPage.value,
    pageSize: pageSize.value
  }
})

// 切换页码
function changePage(page) {
  currentPage.value = page
}
```

## 多数据提供者示例

```js
import { useList } from '@duxweb/dvha-core'

// 使用默认数据提供者
const { data: users } = useList({
  path: 'users'
})

// 使用指定的数据提供者
const { data: analyticsData } = useList({
  path: 'stats',
  providerName: 'analytics'
})

// 使用支付服务的数据提供者
const { data: transactions } = useList({
  path: 'transactions',
  providerName: 'payment'
})
```

## 高级配置示例

```js
import { useList } from '@duxweb/dvha-core'

const { data, isLoading, error } = useList({
  path: 'users',
  pagination: {
    page: 1,
    pageSize: 20
  },
  filters: {
    role: 'admin',
    active: true,
    created_at: {
      gte: '2024-01-01',
      lte: '2024-12-31'
    }
  },
  sorters: {
    created_at: 'desc',
    name: 'asc'
  },
  meta: {
    include: 'profile,permissions',
    fields: 'id,name,email,created_at'
  },
  providerName: 'userService',
  options: {
    enabled: true, // 是否启用查询
    refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
    staleTime: 5 * 60 * 1000 // 5分钟内数据视为新鲜
  },
  onError: (error) => {
    console.error('获取用户列表失败:', error)
    // 可以在这里显示错误提示
  }
})
```

## 响应格式

```json
{
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "status": "active",
      "created_at": "2024-01-20T10:30:00Z"
    },
    {
      "id": 2,
      "name": "李四",
      "email": "lisi@example.com",
      "status": "inactive",
      "created_at": "2024-01-19T15:20:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "pages": 10
  }
}
```
