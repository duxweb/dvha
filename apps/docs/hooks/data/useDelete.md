# useDelete

`useDelete` hook 用于删除现有的数据记录。

## 功能特点

- 🗑️ **数据删除** - 删除现有的资源记录
- 🔄 **自动缓存更新** - 删除成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理删除失败情况
- 🎯 **批量操作** - 支持单个和批量删除
- 🔄 **缓存失效** - 自动失效相关查询缓存
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `deleteOne(options, manage, auth)` 方法删除数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  deleteOne(
    options: IDataProviderDeleteOptions,
    manage?: IManageHook,
    auth?: IUserState
  ): Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderDeleteOptions {
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
import { useDelete } from '@duxweb/dvha-core'

const { mutate: deleteUser, isLoading, isError, error } = useDelete({
  path: 'users'
})

// 执行删除
deleteUser({
  id: 1
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useDelete({
  // 必需参数
  path: 'users',           // API 路径

  // 可选参数
  meta: {                  // 额外参数
    force: true           // 强制删除
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => {   // 成功回调
    console.log('删除成功:', data)
    // 可以刷新列表、显示提示等
  },
  onError: (err) => {      // 错误回调
    console.error('删除失败:', err)
  }
})

// 执行删除
const handleDelete = (userId) => {
  mutate({
    id: userId
  })
}
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | API 资源路径 |
| `meta` | `Record<string, any>` | ❌ | 传递给 API 的额外参数 |
| `providerName` | `string` | ❌ | 数据提供者名称，默认为 'default' |
| `onSuccess` | `(data: any) => void` | ❌ | 成功回调 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |
| `options` | `UseMutationOptions` | ❌ | TanStack Query Mutation 选项 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `Function` | 执行删除的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在删除 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 删除后的响应数据 |

## 确认删除示例

```js
import { useDelete } from '@duxweb/dvha-core'

const { mutate: deleteUser, isLoading } = useDelete({
  path: 'users',
  onSuccess: () => {
    console.log('用户删除成功')
    // 刷新列表或跳转到其他页面
  }
})

const handleDelete = (userId, userName) => {
  // 显示确认对话框
  if (confirm(`确定要删除用户 "${userName}" 吗？`)) {
    deleteUser({
      id: userId
    })
  }
}
```

## 多数据提供者示例

```js
import { useDelete } from '@duxweb/dvha-core'

// 使用默认数据提供者删除用户
const { mutate: deleteUser } = useDelete({
  path: 'users'
})

// 使用分析服务删除报告
const { mutate: deleteReport } = useDelete({
  path: 'reports',
  providerName: 'analytics'
})

// 使用支付服务删除订单
const { mutate: deleteOrder } = useDelete({
  path: 'orders',
  providerName: 'payment'
})

// 执行不同的删除操作
const handleDeleteUser = (userId) => {
  deleteUser({ id: userId })
}

const handleDeleteReport = (reportId) => {
  deleteReport({ id: reportId })
}

const handleDeleteOrder = (orderId) => {
  deleteOrder({ id: orderId })
}
```

## 软删除示例

```js
import { useDelete } from '@duxweb/dvha-core'

const { mutate: deleteUser } = useDelete({
  path: 'users',
  meta: {
    soft: true  // 软删除标记
  }
})

const handleSoftDelete = (userId) => {
  deleteUser({
    id: userId,
    meta: {
      reason: '用户违规'
    }
  })
}
```

## 批量删除准备

```js
import { useDelete } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedIds = ref([])

const { mutate: deleteUser, isLoading } = useDelete({
  path: 'users'
})

// 单个删除
const handleDeleteOne = (userId) => {
  deleteUser({ id: userId })
}

// 为批量删除做准备 - 使用 useDeleteMany hook
const handleDeleteSelected = () => {
  if (selectedIds.value.length === 0) {
    alert('请选择要删除的项目')
    return
  }

  if (confirm(`确定要删除选中的 ${selectedIds.value.length} 个项目吗？`)) {
    // 这里应该使用 useDeleteMany hook 进行批量删除
    console.log('需要删除的ID列表:', selectedIds.value)
  }
}
```

## 高级配置示例

```js
import { useDelete } from '@duxweb/dvha-core'

const { mutate: deleteUser, isLoading, error } = useDelete({
  path: 'users',
  meta: {
    cascade: true,      // 级联删除相关数据
    backup: true        // 删除前备份
  },
  providerName: 'userService',
  options: {
    onMutate: () => {
      console.log('开始删除用户...')
    },
    onSettled: () => {
      console.log('删除操作完成')
    }
  },
  onSuccess: (data) => {
    console.log('用户删除成功:', data)
    // 可以在这里进行列表刷新、显示成功提示等
  },
  onError: (error) => {
    console.error('删除用户失败:', error)
    // 可以在这里显示错误提示
  }
})

const handleDelete = (userId) => {
  deleteUser({
    id: userId,
    meta: {
      deleteReason: '管理员删除',
      notifyUser: false
    }
  })
}
```

## 响应格式

```json
{
  "message": "删除成功",
  "data": null
}
```