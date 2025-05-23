# useDelete

`useDelete` hook 用于删除数据。

## 功能特点

- 🗑️ **数据删除** - 删除指定资源
- 🔄 **自动缓存更新** - 删除成功后自动更新缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理删除失败情况
- 🎯 **灵活配置** - 支持动态 ID 和批量删除

## 接口关系

该hook调用数据提供者的 `remove(resource, params)` 方法删除数据。

```js
// 数据提供者接口
interface IDataProvider {
  remove(
    resource: string,
    params: {
      id: string | number
      data?: Record<string, any>
      meta?: Record<string, any>
    }
  ): Promise<{
    data?: any
  }>
}
```

## 使用方法

```js
import { useDelete } from '@duxweb/dvha-core'

const { mutate: deleteUser, isLoading, isError, error } = useDelete({
  path: 'users',
  id: userId
})

// 执行删除
deleteUser()
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useDelete({
  // 必需参数
  path: 'users',           // API 路径
  id: props.userId,        // 资源 ID

  // 可选参数
  meta: {                  // 额外参数
    force: true            // 强制删除
  },
  onSuccess: (data) => {   // 成功回调
    console.log('删除成功:', data)
    // 可以进行页面跳转、刷新列表等
  },
  onError: (err) => {      // 错误回调
    console.error('删除失败:', err)
  }
})

// 执行删除
const handleDelete = () => {
  mutate()
}
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | API 资源路径 |
| `id` | `string \| number` | ❌ | 资源 ID（也可在 mutate 时传入） |
| `meta` | `Record<string, any>` | ❌ | 传递给 API 的额外参数 |
| `onSuccess` | `(data: any) => void` | ❌ | 成功回调 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `Function` | 执行删除的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在删除 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 删除后的响应数据 |

## 动态 ID 删除

```js
import { useDelete } from '@duxweb/dvha-core'

// 可以在调用时动态传入 ID
const { mutate: deleteUser } = useDelete({
  path: 'users'
})

const handleDelete = (userId) => {
  deleteUser({ id: userId })
}
```

## 确认删除示例

```js
import { useDelete } from '@duxweb/dvha-core'
import { ref } from 'vue'

const showConfirm = ref(false)

const {
  mutate: deleteItem,
  isLoading,
  isError,
  error
} = useDelete({
  path: 'users',
  id: itemId,
  onSuccess: () => {
    showConfirm.value = false
    // 触发列表刷新
  }
})

const confirmDelete = () => {
  deleteItem()
}
```

## 批量删除

```js
import { useDelete } from '@duxweb/dvha-core'
import { ref, computed } from 'vue'

const selectedIds = ref([])

const { mutate: batchDelete, isLoading } = useDelete({
  path: 'users',
  onSuccess: () => {
    selectedIds.value = []
    // 刷新列表
  }
})

const handleBatchDelete = () => {
  if (confirm(`确定要删除选中的 ${selectedIds.value.length} 项吗？`)) {
    // 如果支持批量删除 API
    batchDelete({
      data: { ids: selectedIds.value }
    })
  }
}
```

## 响应格式

```json
{
  "message": "删除成功",
  "data": {
    "deleted_id": 1
  }
}
```