# useInfiniteList

`useInfiniteList` hook 用于实现无限滚动列表，适合长列表和移动端场景。

## 功能特点

- ♾️ **无限滚动** - 支持无限加载更多数据
- 📱 **移动友好** - 适合移动端长列表场景
- 📄 **分页支持** - 自动处理分页逻辑
- 🔍 **筛选排序** - 支持条件筛选和排序
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- ⚡ **实时状态** - 提供加载、错误、成功状态

## 接口关系

该hook调用数据提供者的 `getList(resource, params)` 方法，根据页码递增获取分页数据。

```js
// 数据提供者接口（与 useList 相同）
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
import { useInfiniteList } from '@duxweb/dvha-core'

const {
  data,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteList({
  path: 'posts'
})
```

## 常用参数

```js
const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteList({
  // 必需参数
  path: 'posts',           // API 路径

  // 可选参数
  pagination: {            // 分页配置
    page: 1,
    limit: 10
  },
  filters: {               // 筛选条件
    status: 'published',
    category: 'tech'
  },
  sorters: {               // 排序
    created_at: 'desc'
  },
  meta: {                  // 额外参数
    include: 'author,tags'
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
| `data` | `Ref<any>` | 分页数据，包含 `pages` 数组 |
| `isLoading` | `Ref<boolean>` | 是否首次加载中 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `fetchNextPage` | `Function` | 获取下一页数据 |
| `hasNextPage` | `Ref<boolean>` | 是否有下一页 |
| `isFetchingNextPage` | `Ref<boolean>` | 是否正在获取下一页 |

## 自动滚动加载

```js
import { useInfiniteList } from '@duxweb/dvha-core'
import { useIntersectionObserver } from '@vueuse/core'

const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteList({
  path: 'posts'
})

// 监听滚动到底部
const loadMoreRef = ref(null)
useIntersectionObserver(
  loadMoreRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
      fetchNextPage()
    }
  }
)
```

## 响应格式

```json
{
  "pages": [
    {
      "data": [
        {
          "id": 1,
          "title": "文章标题1",
          "description": "文章描述1"
        }
      ],
      "meta": {
        "total": 100,
        "page": 1,
        "limit": 10
      }
    }
  ]
}
```