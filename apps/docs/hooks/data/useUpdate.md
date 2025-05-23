# useUpdate

`useUpdate` hook 用于更新现有数据。

## 功能特点

- ✏️ **数据更新** - 更新现有资源数据
- 🔄 **自动缓存更新** - 更新成功后自动更新缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理更新失败情况
- 🎯 **灵活配置** - 支持动态 ID 和自定义参数

## 接口关系

该hook调用数据提供者的 `update(resource, params)` 方法更新数据。

```js
// 数据提供者接口
interface IDataProvider {
  update(
    resource: string,
    params: {
      id: string | number
      data: Record<string, any>
      meta?: Record<string, any>
    }
  ): Promise<{
    data: any
  }>
}
```

## 使用方法

```js
import { useUpdate } from '@duxweb/dvha-core'

const { mutate: updateUser, isLoading, isError, error } = useUpdate({
  path: 'users',
  id: userId
})

// 执行更新
updateUser({
  data: { name: '新名称', email: 'new@example.com' }
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useUpdate({
  // 必需参数
  path: 'users',           // API 路径
  id: props.userId,        // 资源 ID

  // 可选参数
  meta: {                  // 额外参数
    include: 'profile'
  },
  onSuccess: (data) => {   // 成功回调
    console.log('更新成功:', data)
    // 可以进行页面跳转、显示提示等
  },
  onError: (err) => {      // 错误回调
    console.error('更新失败:', err)
  }
})

// 执行更新
const handleUpdate = () => {
  mutate({
    data: {
      name: '新名称',
      email: 'new@example.com'
    }
  })
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
| `mutate` | `Function` | 执行更新的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在更新 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 更新后的响应数据 |

## 动态 ID 更新

```js
import { useUpdate } from '@duxweb/dvha-core'

// 可以在调用时动态传入 ID
const { mutate: updateUser } = useUpdate({
  path: 'users'
})

const handleUpdate = (userId, userData) => {
  updateUser({
    id: userId,
    data: userData
  })
}
```

## 表单更新示例

```js
import { useUpdate } from '@duxweb/dvha-core'
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  status: 'active'
})

const {
  mutate: updateUser,
  isLoading,
  isError,
  isSuccess,
  error
} = useUpdate({
  path: 'users',
  id: userId,
  onSuccess: () => {
    console.log('更新成功')
  }
})

const handleSubmit = () => {
  updateUser({
    data: form.value
  })
}
```

## 响应格式

```json
{
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "status": "active",
    "updated_at": "2024-01-20T10:30:00Z"
  },
  "message": "更新成功"
}
```