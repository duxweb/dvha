# useInvalidate

`useInvalidate` hook 用于手动失效缓存，强制重新获取数据。

## 功能特点

- 🔄 **缓存失效** - 手动使指定查询缓存失效
- 🎯 **精确控制** - 可以失效特定路径的缓存
- ⚡ **即时生效** - 失效后立即触发重新获取
- 🛡️ **安全操作** - 不会影响其他查询的缓存
- 🎯 **多数据源** - 支持失效不同数据提供者的缓存

## 接口关系

该hook操作 TanStack Query 的缓存系统，不直接调用数据提供者。

```typescript
interface IInvalidateHook {
  invalidate: (path: string, providerName?: string) => Promise<void>
}
```

## 使用方法

```js
import { useInvalidate } from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

// 失效特定路径的缓存
await invalidate('users')
```

## 常用参数

```js
const { invalidate } = useInvalidate()

// 失效默认数据提供者的缓存
await invalidate('users')

// 失效指定数据提供者的缓存
await invalidate('reports', 'analytics')

// 失效支付服务的订单缓存
await invalidate('orders', 'payment')
```

## 参数说明

### invalidate 方法

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | 要失效的 API 路径 |
| `providerName` | `string` | ❌ | 数据提供者名称，默认为 'default' |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `invalidate` | `Function` | 失效缓存的方法 |

## 基本用法示例

```js
import { useInvalidate, useCreate, useUpdate, useDelete } from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

// 创建成功后失效列表缓存
const { mutate: createUser } = useCreate({
  path: 'users',
  onSuccess: async () => {
    await invalidate('users')
    console.log('用户列表缓存已失效')
  }
})

// 更新成功后失效相关缓存
const { mutate: updateUser } = useUpdate({
  path: 'users',
  onSuccess: async (data) => {
    await invalidate('users')
    await invalidate(`users/${data.id}`)
    console.log('用户缓存已失效')
  }
})

// 删除成功后失效缓存
const { mutate: deleteUser } = useDelete({
  path: 'users',
  onSuccess: async () => {
    await invalidate('users')
    console.log('用户列表缓存已失效')
  }
})
```

## 多数据提供者示例

```js
import { useInvalidate } from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

// 失效不同数据提供者的缓存
const refreshAllData = async () => {
  // 失效默认数据提供者的用户缓存
  await invalidate('users')

  // 失效分析服务的报告缓存
  await invalidate('reports', 'analytics')

  // 失效支付服务的订单缓存
  await invalidate('orders', 'payment')

  // 失效物流服务的配送缓存
  await invalidate('deliveries', 'logistics')

  console.log('所有相关缓存已失效')
}

// 失效特定服务的所有缓存
const refreshAnalyticsData = async () => {
  await invalidate('stats', 'analytics')
  await invalidate('reports', 'analytics')
  await invalidate('dashboards', 'analytics')
  console.log('分析服务缓存已失效')
}
```

## 条件失效示例

```js
import { useInvalidate } from '@duxweb/dvha-core'
import { ref } from 'vue'

const { invalidate } = useInvalidate()
const shouldRefresh = ref(false)

// 根据条件决定是否失效缓存
const conditionalInvalidate = async (path, condition) => {
  if (condition) {
    await invalidate(path)
    console.log(`${path} 缓存已失效`)
  }
}

// 批量条件失效
const batchInvalidate = async (pathList, providerName) => {
  const promises = pathList.map(path => invalidate(path, providerName))
  await Promise.all(promises)
  console.log('批量失效完成')
}

// 使用示例
const handleDataUpdate = async () => {
  // 总是失效主要数据
  await invalidate('users')

  // 条件性失效其他数据
  await conditionalInvalidate('reports', shouldRefresh.value)

  // 批量失效分析数据
  await batchInvalidate(['stats', 'charts', 'dashboards'], 'analytics')
}
```

## 与其他 Hooks 集成

```js
import {
  useInvalidate,
  useCreate,
  useUpdate,
  useDelete,
  useCustomMutation
} from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

// 在创建操作中集成
const { mutate: createProduct } = useCreate({
  path: 'products',
  onSuccess: async (data) => {
    // 失效产品列表
    await invalidate('products')

    // 失效分类统计
    await invalidate(`categories/${data.category_id}/stats`, 'analytics')

    // 失效库存信息
    await invalidate('inventory', 'warehouse')
  }
})

// 在自定义操作中集成
const { mutate: publishProduct } = useCustomMutation({
  path: 'products/publish',
  onSuccess: async (data) => {
    // 失效多个相关缓存
    await Promise.all([
      invalidate('products'),
      invalidate('published-products'),
      invalidate(`categories/${data.category_id}`, 'analytics'),
      invalidate('site-stats', 'analytics')
    ])
  }
})
```

## 错误处理示例

```js
import { useInvalidate } from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

const safeInvalidate = async (path, providerName) => {
  try {
    await invalidate(path, providerName)
    console.log(`${path} 缓存失效成功`)
  } catch (error) {
    console.error('缓存失效失败:', error)
    // 可以在这里添加错误提示或重试逻辑
  }
}

// 批量安全失效
const safeBatchInvalidate = async (pathList, providerName) => {
  const results = await Promise.allSettled(
    pathList.map(path => invalidate(path, providerName))
  )

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`${pathList[index]} 失效失败:`, result.reason)
    } else {
      console.log(`${pathList[index]} 失效成功`)
    }
  })
}
```

## 最佳实践

### 1. 在数据变更后及时失效

```js
// ✅ 好的做法
const { mutate: updateUser } = useUpdate({
  path: 'users',
  onSuccess: async (data) => {
    await invalidate('users')           // 失效列表
    await invalidate(`users/${data.id}`) // 失效详情
  }
})

// ❌ 不好的做法 - 忘记失效缓存
const { mutate: updateUser } = useUpdate({
  path: 'users',
  onSuccess: (data) => {
    console.log('更新成功') // 缓存没有失效，界面可能显示旧数据
  }
})
```

### 2. 合理使用数据提供者参数

```js
// ✅ 好的做法 - 明确指定数据提供者
await invalidate('stats', 'analytics')
await invalidate('users', 'default')

// ⚠️ 注意 - 确保数据提供者名称正确
await invalidate('reports', 'nonexistent') // 如果提供者不存在可能出错
```

### 3. 批量操作时的缓存管理

```js
// ✅ 好的做法 - 批量失效相关缓存
const { mutate: batchDelete } = useDeleteMany({
  path: 'users',
  onSuccess: async () => {
    await Promise.all([
      invalidate('users'),
      invalidate('user-stats', 'analytics'),
      invalidate('department-stats', 'analytics')
    ])
  }
})
```

## 注意事项

- 缓存失效是异步操作，使用时需要适当处理
- 过度失效缓存可能影响性能，应该精确控制失效范围
- 在数据变更操作的成功回调中失效相关缓存是最佳实践
- 失效缓存后，相关的查询会自动重新获取数据
- 确保指定的数据提供者名称存在且正确