# useInfiniteList

`useInfiniteList` hook 用于无限滚动列表数据获取。

## 功能特点

- 📜 **无限滚动** - 支持无限滚动列表数据加载
- 📄 **自动分页** - 自动处理分页逻辑
- 🔍 **筛选排序** - 支持条件筛选和排序
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- 🔄 **自动重新验证** - 数据过期时自动刷新
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `getList(options, manage, auth)` 方法获取分页数据。

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
import { useInfiniteList } from '@duxweb/dvha-core'

const {
  data,
  isLoading,
  hasNextPage,
  fetchNextPage
} = useInfiniteList({
  path: 'posts'
})
```

## 常用参数

```js
const {
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  refetch
} = useInfiniteList({
  // 必需参数
  path: 'posts', // API 路径

  // 可选参数
  pagination: { // 分页配置
    limit: 20 // 每页数量
  },
  filters: { // 筛选条件
    category: 'tech',
    status: 'published'
  },
  sorters: { // 排序
    created_at: 'desc',
    title: 'asc'
  },
  meta: { // 额外参数
    include: 'author,tags'
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
| `pagination`   | `object`                          | ❌   | 分页配置，通常只需设置 limit     |
| `filters`      | `Record<string, any>`             | ❌   | 筛选条件                         |
| `sorters`      | `Record<string, 'asc' \| 'desc'>` | ❌   | 排序条件                         |
| `meta`         | `Record<string, any>`             | ❌   | 传递给 API 的额外参数            |
| `providerName` | `string`                          | ❌   | 数据提供者名称，默认为 'default' |
| `onError`      | `(error: any) => void`            | ❌   | 错误处理回调                     |
| `options`      | `IDataQueryOptionsInfinite`       | ❌   | TanStack Query 无限查询选项      |

## 返回值

| 字段            | 类型                | 说明             |
| --------------- | ------------------- | ---------------- |
| `data`          | `Ref<InfiniteData>` | 分页数据对象     |
| `isLoading`     | `Ref<boolean>`      | 是否加载中       |
| `isError`       | `Ref<boolean>`      | 是否出错         |
| `error`         | `Ref<any>`          | 错误信息         |
| `hasNextPage`   | `Ref<boolean>`      | 是否有下一页     |
| `fetchNextPage` | `Function`          | 加载下一页的方法 |
| `refetch`       | `Function`          | 重新获取数据     |

## 基本无限滚动示例

```vue
<script setup>
import { useInfiniteList } from '@duxweb/dvha-core'

const {
  data,
  isLoading,
  hasNextPage,
  fetchNextPage
} = useInfiniteList({
  path: 'posts',
  pagination: {
    limit: 10
  }
})
</script>

<template>
  <div class="infinite-list">
    <div
      v-for="page in data?.pages"
      :key="`page-${page.meta?.page}`"
      class="page-content"
    >
      <div
        v-for="item in page.data"
        :key="item.id"
        class="list-item"
      >
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>

    <div v-if="hasNextPage" class="load-more">
      <button
        :disabled="isLoading"
        class="load-button"
        @click="fetchNextPage"
      >
        {{ isLoading ? '加载中...' : '加载更多' }}
      </button>
    </div>

    <div v-else class="no-more">
      没有更多数据了
    </div>
  </div>
</template>
```

## 多数据提供者示例

```js
import { useInfiniteList } from '@duxweb/dvha-core'

// 使用默认数据提供者获取文章列表
const { data: posts, fetchNextPage: loadMorePosts } = useInfiniteList({
  path: 'posts',
  pagination: { limit: 20 }
})

// 使用分析服务获取访问记录
const { data: visits, fetchNextPage: loadMoreVisits } = useInfiniteList({
  path: 'access-logs',
  providerName: 'analytics',
  pagination: { limit: 50 },
  sorters: { timestamp: 'desc' }
})

// 使用支付服务获取交易记录
const { data: transactions, fetchNextPage: loadMoreTransactions } = useInfiniteList({
  path: 'transactions',
  providerName: 'payment',
  pagination: { limit: 30 },
  filters: { status: 'completed' }
})
```

## 自动加载更多示例

```vue
<script setup>
import { useInfiniteList } from '@duxweb/dvha-core'
import { onMounted, onUnmounted, ref } from 'vue'

const loadTrigger = ref(null)

const {
  data,
  isLoading,
  hasNextPage,
  fetchNextPage
} = useInfiniteList({
  path: 'news',
  pagination: { limit: 15 }
})

// 设置 Intersection Observer 自动加载
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasNextPage.value && !isLoading.value) {
      fetchNextPage()
    }
  })

  if (loadTrigger.value) {
    observer.observe(loadTrigger.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="auto-load-list">
    <div v-for="page in data?.pages" :key="`page-${page.meta?.page}`">
      <div v-for="item in page.data" :key="item.id" class="item">
        {{ item.title }}
      </div>
    </div>

    <div ref="loadTrigger" class="load-trigger">
      <span v-if="isLoading">加载中...</span>
      <span v-else-if="!hasNextPage">没有更多了</span>
    </div>
  </div>
</template>
```

## 筛选和排序示例

```js
import { useInfiniteList } from '@duxweb/dvha-core'
import { ref, watch } from 'vue'

const category = ref('all')
const sortBy = ref('created_at')
const sortOrder = ref('desc')

const {
  data,
  isLoading,
  hasNextPage,
  fetchNextPage,
  refetch
} = useInfiniteList({
  path: 'articles',
  pagination: { limit: 12 },
  filters: computed(() => ({
    category: category.value === 'all' ? undefined : category.value
  })),
  sorters: computed(() => ({
    [sortBy.value]: sortOrder.value
  }))
})

// 筛选或排序变化时重新加载
watch([category, sortBy, sortOrder], () => {
  refetch()
})
```

## 下拉刷新示例

```vue
<script setup>
import { useInfiniteList } from '@duxweb/dvha-core'
import { ref } from 'vue'

const listContainer = ref(null)
const isPulling = ref(false)
const isRefreshing = ref(false)
let startY = 0
let currentY = 0

const { data, refetch } = useInfiniteList({
  path: 'feed',
  pagination: { limit: 20 }
})

function handleTouchStart(e) {
  startY = e.touches[0].clientY
}

function handleTouchMove(e) {
  currentY = e.touches[0].clientY
  const diff = currentY - startY

  if (diff > 50 && listContainer.value.scrollTop === 0) {
    isPulling.value = true
  }
}

async function handleTouchEnd() {
  if (isPulling.value) {
    isRefreshing.value = true
    await refetch()
    isRefreshing.value = false
  }
  isPulling.value = false
}
</script>

<template>
  <div class="pull-refresh-list">
    <div
      class="pull-indicator"
      :class="{ pulling: isPulling, refreshing: isRefreshing }"
    >
      {{ isRefreshing ? '刷新中...' : isPulling ? '释放刷新' : '下拉刷新' }}
    </div>

    <div
      ref="listContainer"
      class="list-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- 列表内容 -->
      <div v-for="page in data?.pages" :key="`page-${page.meta?.page}`">
        <div v-for="item in page.data" :key="item.id" class="item">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>
```

## 响应数据格式

每一页的响应格式：

```json
{
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "content": "文章内容",
      "created_at": "2024-01-20T10:30:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

组合后的无限数据结构：

```js
{
  pages: [
    { data: [...], meta: { page: 1, ... } },
    { data: [...], meta: { page: 2, ... } },
    { data: [...], meta: { page: 3, ... } }
  ],
  pageParams: [0, 1, 2]
}
```
