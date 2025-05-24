# useCustom

`useCustom` hook 用于执行自定义查询操作。

## 功能特点

- 🔧 **自定义查询** - 支持任意 API 查询操作
- 🌐 **HTTP 方法** - 支持 GET、POST、PUT、DELETE 等
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🛡️ **错误处理** - 自动处理网络错误和认证失败
- 🎯 **灵活配置** - 支持自定义请求头和参数
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `custom(options, manage, auth)` 方法执行自定义请求。

```typescript
// 数据提供者接口
interface IDataProvider {
  custom(
    options: IDataProviderCustomOptions,
    manage?: IManageHook,
    auth?: IUserState
  ): Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderCustomOptions {
  path?: string                                         // API 路径
  method?: string                                       // HTTP 方法
  sorters?: Record<string, 'asc' | 'desc'>             // 排序配置
  filters?: Record<string, any>                        // 筛选条件
  query?: Record<string, any>                          // 查询参数
  headers?: Record<string, string>                     // 自定义请求头
  meta?: Record<string, any>                           // 额外参数
  payload?: any                                        // 请求体数据
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
import { useCustom } from '@duxweb/dvha-core'

const { data, isLoading, isError, error } = useCustom({
  path: 'dashboard/stats',
  method: 'GET'
})
```

## 常用参数

```js
const { data, isLoading, isError, error, refetch } = useCustom({
  // 必需参数
  path: 'users/stats',      // API 路径
  method: 'GET',            // HTTP 方法

  // 可选参数
  query: {                  // 查询参数
    period: 'month',
    status: 'active'
  },
  filters: {                // 筛选条件
    role: 'admin'
  },
  sorters: {                // 排序
    created_at: 'desc'
  },
  headers: {                // 自定义请求头
    'Custom-Header': 'value'
  },
  payload: {                // 请求体（POST/PUT 时）
    data: 'example'
  },
  meta: {                   // 额外参数
    include: 'profile'
  },
  providerName: 'default',  // 数据提供者名称，默认为 'default'
  onError: (err) => {       // 错误回调
    console.error('请求失败:', err)
  }
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ❌ | API 路径 |
| `method` | `string` | ❌ | HTTP 方法，默认为 'GET' |
| `query` | `Record<string, any>` | ❌ | 查询参数 |
| `filters` | `Record<string, any>` | ❌ | 筛选条件 |
| `sorters` | `Record<string, 'asc' \| 'desc'>` | ❌ | 排序配置 |
| `headers` | `Record<string, string>` | ❌ | 自定义请求头 |
| `payload` | `any` | ❌ | 请求体数据 |
| `meta` | `Record<string, any>` | ❌ | 额外参数 |
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

## 动态参数查询

```js
import { useCustom } from '@duxweb/dvha-core'
import { ref, watch } from 'vue'

const selectedPeriod = ref('day')

const { data, isLoading, refetch } = useCustom({
  path: 'analytics',
  method: 'GET',
  query: {
    period: selectedPeriod.value
  }
})

// 监听参数变化，重新请求
watch(selectedPeriod, () => {
  refetch()
})
```

## POST 请求示例

```js
import { useCustom } from '@duxweb/dvha-core'

const { data, isLoading } = useCustom({
  path: 'reports/generate',
  method: 'POST',
  payload: {
    type: 'user_activity',
    format: 'pdf',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    }
  }
})
```

## 多数据提供者示例

```js
import { useCustom } from '@duxweb/dvha-core'

// 使用默认数据提供者获取统计数据
const { data: basicStats } = useCustom({
  path: 'stats/overview'
})

// 使用分析服务获取详细分析
const { data: analyticsData } = useCustom({
  path: 'detailed-stats',
  providerName: 'analytics',
  query: {
    period: 'month',
    metrics: ['views', 'clicks', 'conversions']
  }
})

// 使用支付服务获取交易统计
const { data: paymentStats } = useCustom({
  path: 'transaction-stats',
  providerName: 'payment',
  filters: {
    status: 'completed',
    currency: 'CNY'
  }
})
```

## 复杂查询示例

```js
import { useCustom } from '@duxweb/dvha-core'

const { data, isLoading, error } = useCustom({
  path: 'advanced-search',
  method: 'POST',
  payload: {
    search_term: '产品名称',
    categories: ['electronics', 'computers'],
    price_range: {
      min: 100,
      max: 5000
    }
  },
  filters: {
    in_stock: true,
    brand: 'Apple'
  },
  sorters: {
    price: 'asc',
    rating: 'desc'
  },
  query: {
    page: 1,
    limit: 20
  },
  headers: {
    'Accept-Language': 'zh-CN'
  },
  meta: {
    include: 'images,reviews',
    format: 'detailed'
  },
  providerName: 'productService'
})
```

## 文件上传示例

```js
import { useCustom } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedFile = ref(null)

const { data, isLoading, mutate } = useCustom({
  path: 'upload',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const handleUpload = () => {
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('category', 'documents')

  // 对于文件上传，可能需要使用 useCustomMutation
  console.log('文件上传应使用 useCustomMutation hook')
}
```

## 条件查询示例

```js
import { useCustom } from '@duxweb/dvha-core'
import { ref, computed } from 'vue'

const searchParams = ref({
  keyword: '',
  category: '',
  status: 'all',
  dateRange: null
})

const { data, isLoading, refetch } = useCustom({
  path: 'search',
  method: 'GET',
  query: computed(() => {
    const params = {}
    if (searchParams.value.keyword) {
      params.q = searchParams.value.keyword
    }
    if (searchParams.value.category) {
      params.category = searchParams.value.category
    }
    if (searchParams.value.status !== 'all') {
      params.status = searchParams.value.status
    }
    if (searchParams.value.dateRange) {
      params.start_date = searchParams.value.dateRange[0]
      params.end_date = searchParams.value.dateRange[1]
    }
    return params
  }),
  options: {
    enabled: computed(() => !!searchParams.value.keyword) // 只有输入关键词才查询
  }
})
```

## 响应格式

```json
{
  "message": "获取成功",
  "data": {
    "total_users": 1250,
    "active_users": 980,
    "new_users_today": 25,
    "growth_rate": 12.5
  }
}
```