# useInvalidate

`useInvalidate` hook 用于手动失效查询缓存，强制重新获取数据。

## 功能特点

- 🔄 **缓存失效** - 手动清除指定查询缓存
- 🎯 **精确控制** - 支持失效特定查询或所有查询
- ⚡ **即时生效** - 失效后相关查询会自动重新获取
- 🛠️ **灵活配置** - 支持条件失效和批量失效
- 🔗 **自动关联** - 可与其他操作联动使用
- 📱 **响应式更新** - 失效后组件会自动重新渲染

## 接口关系

该hook不直接调用数据提供者接口，而是操作 TanStack Query 的缓存管理系统。

```js
// 缓存失效操作
interface InvalidateQuery {
  path: string
  id?: string | number
  filters?: Record<string, any>
  pagination?: object
  meta?: Record<string, any>
}

// hook 内部使用 queryClient.invalidateQueries() 方法
```

## 使用方法

```js
import { useInvalidate } from '@duxweb/dvha-core'

const invalidate = useInvalidate()

// 失效单个查询
invalidate({ path: 'users' })

// 失效多个查询
invalidate([
  { path: 'users' },
  { path: 'posts' }
])
```

## 常用参数

```js
const invalidate = useInvalidate()

// 基本失效
invalidate({ path: 'users' })

// 带条件失效
invalidate({
  path: 'users',
  filters: { status: 'active' }
})

// 失效特定ID的查询
invalidate({
  path: 'users',
  id: 123
})

// 批量失效
invalidate([
  { path: 'users' },
  { path: 'posts', filters: { category: 'tech' } },
  { path: 'dashboard/stats' }
])
```

## 参数说明

### 单个失效参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | 要失效的资源路径 |
| `id` | `string \| number` | ❌ | 失效特定 ID 的查询 |
| `filters` | `Record<string, any>` | ❌ | 失效特定条件的查询 |
| `pagination` | `object` | ❌ | 失效特定分页的查询 |
| `meta` | `Record<string, any>` | ❌ | 失效特定元数据的查询 |

### 批量失效参数

接受上述单个参数的数组：`Array<InvalidateQuery>`

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `invalidate` | `Function` | 执行缓存失效的函数 |

## 失效特定查询

```js
import { useInvalidate } from '@duxweb/dvha-core'

const invalidate = useInvalidate()

// 失效用户列表
const invalidateUserList = () => {
  invalidate({ path: 'users' })
}

// 失效特定用户详情
const invalidateUser = (userId) => {
  invalidate({ path: 'users', id: userId })
}

// 失效带筛选条件的查询
const invalidateActiveUsers = () => {
  invalidate({
    path: 'users',
    filters: { status: 'active' }
  })
}
```

## 操作后失效缓存

```js
import { useCreate, useInvalidate } from '@duxweb/dvha-core'

const invalidate = useInvalidate()

const { mutate: createUser } = useCreate({
  path: 'users',
  onSuccess: () => {
    // 创建成功后失效相关缓存
    invalidate([
      { path: 'users' },                    // 用户列表
      { path: 'dashboard/stats' },          // 仪表板统计
      { path: 'users', filters: { status: 'pending' } }  // 待审核用户
    ])
  }
})
```

## 条件失效示例

```js
import { useInvalidate } from '@duxweb/dvha-core'
import { ref } from 'vue'

const invalidate = useInvalidate()
const selectedCategory = ref('all')

// 根据条件失效不同查询
const refreshData = () => {
  if (selectedCategory.value === 'all') {
    // 失效所有文章查询
    invalidate({ path: 'posts' })
  } else {
    // 失效特定分类的文章查询
    invalidate({
      path: 'posts',
      filters: { category: selectedCategory.value }
    })
  }
}
```

## 批量操作失效

```js
import { useCustomMutation, useInvalidate } from '@duxweb/dvha-core'

const invalidate = useInvalidate()

const { mutate: batchAction } = useCustomMutation({
  url: '/api/users/batch-action',
  method: 'POST',
  onSuccess: (result) => {
    // 批量操作后失效多个相关查询
    invalidate([
      { path: 'users' },
      { path: 'users', filters: { status: 'active' } },
      { path: 'users', filters: { status: 'inactive' } },
      { path: 'dashboard/user-stats' },
      { path: 'reports/user-activity' }
    ])
  }
})
```

## 定时失效示例

```js
import { useInvalidate } from '@duxweb/dvha-core'
import { onMounted, onUnmounted } from 'vue'

const invalidate = useInvalidate()
let timer = null

// 定时刷新数据
onMounted(() => {
  timer = setInterval(() => {
    invalidate({ path: 'dashboard/realtime-stats' })
  }, 30000) // 每30秒刷新一次
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
```

## 智能失效示例

```js
import { useInvalidate, useGetAuth } from '@duxweb/dvha-core'

const invalidate = useInvalidate()
const { data: authData } = useGetAuth()

const smartInvalidate = () => {
  const queries = [{ path: 'notifications' }]

  // 根据用户角色失效不同查询
  if (authData.value?.role === 'admin') {
    queries.push(
      { path: 'admin/dashboard' },
      { path: 'admin/users' },
      { path: 'admin/reports' }
    )
  } else {
    queries.push(
      { path: 'user/dashboard' },
      { path: 'user/profile' }
    )
  }

  invalidate(queries)
}
```

## 与其他 Hooks 配合

```js
import { useUpdate, useInvalidate } from '@duxweb/dvha-core'

const invalidate = useInvalidate()

// 更新用户状态后的缓存处理
const { mutate: updateUserStatus } = useUpdate({
  path: 'users',
  onSuccess: (data, variables) => {
    const userId = variables.id
    const newStatus = variables.data.status

    // 失效相关查询
    invalidate([
      { path: 'users', id: userId },        // 用户详情
      { path: 'users' },                    // 用户列表
      { path: 'users', filters: { status: newStatus } }, // 新状态用户列表
    ])
  }
})
```

## 使用场景

### 1. 数据操作后刷新
在创建、更新、删除操作后失效相关缓存

### 2. 页面切换刷新
在路由切换时失效可能过期的数据

### 3. 用户操作触发
在用户执行特定操作后刷新相关数据

### 4. 定时刷新
定期失效实时性要求高的数据

### 5. 条件变化刷新
在筛选条件或状态变化时刷新对应数据

## 最佳实践

1. **精确失效** - 只失效真正需要刷新的查询，避免过度失效
2. **批量操作** - 多个相关查询可以批量失效，提高效率
3. **条件匹配** - 使用条件参数精确匹配需要失效的查询
4. **时机选择** - 在合适的时机失效，如操作成功后或页面切换时
5. **性能考虑** - 避免频繁失效，可以使用防抖或节流控制