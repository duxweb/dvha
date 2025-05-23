# useList

`useList` hook 用于获取列表数据，支持分页、筛选、排序等功能。

## 功能特点

- 📋 **列表查询** - 获取资源列表数据
- 📄 **分页支持** - 自动处理分页逻辑
- 🔍 **筛选排序** - 支持条件筛选和排序
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- 🔄 **自动重新验证** - 数据过期时自动刷新
- ⚡ **实时状态** - 提供加载、错误、成功状态

## 接口关系

该hook调用数据提供者的 `getList(resource, params)` 方法获取列表数据。

```js
// 数据提供者接口
interface IDataProvider {
  getList(
    resource: string,
    params: {
      pagination?: { page: number; limit: number }
      filters?: Record<string, any>
      sorters?: Record<string, 'asc' | 'desc'>
      meta?: Record<string, any>
    }
  ): Promise<{
    data: any[]
    meta: { total: number; page: number; limit: number; pages: number }
  }>
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
  path: 'users',           // API 路径

  // 可选参数
  pagination: {            // 分页配置
    page: 1,
    limit: 10
  },
  filters: {               // 筛选条件
    name: 'zhang',
    status: 'active'
  },
  sorters: {               // 排序
    created_at: 'desc',
    name: 'asc'
  },
  meta: {                  // 额外参数
    include: 'profile,roles'
  },
  onError: (err) => {      // 错误回调
    console.error('获取失败:', err)
  }
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | API 资源路径 |
| `pagination` | `object` | ❌ | 分页配置 |
| `filters` | `Record<string, any>` | ❌ | 筛选条件 |
| `sorters` | `Record<string, 'asc' \| 'desc'>` | ❌ | 排序条件 |
| `meta` | `Record<string, any>` | ❌ | 传递给 API 的额外参数 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<any>` | 响应数据 |
| `isLoading` | `Ref<boolean>` | 是否加载中 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `refetch` | `Function` | 重新获取数据 |

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
    limit: pageSize.value
  }
})

// 切换页码
const changePage = (page) => {
  currentPage.value = page
}
```

## 响应格式

```json
{
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  },
  "message": "获取成功"
}
```