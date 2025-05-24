# useUpdate

`useUpdate` hook 用于更新现有的数据记录。

## 功能特点

- ✏️ **数据更新** - 更新现有的资源记录
- 🔄 **自动缓存更新** - 更新成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理更新失败情况
- 🎯 **表单集成** - 完美集成表单编辑流程
- 🔄 **缓存失效** - 自动失效相关查询缓存
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `update(options, manage, auth)` 方法更新数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  update(
    options: IDataProviderUpdateOptions,
    manage?: IManageHook,
    auth?: IUserState
  ): Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderUpdateOptions {
  path: string                                          // API 路径
  id?: string | number                                  // 资源 ID
  data: Record<string, any>                            // 要更新的数据
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
import { useUpdate } from '@duxweb/dvha-core'

const { mutate: updateUser, isLoading, isError, error } = useUpdate({
  path: 'users'
})

// 执行更新
updateUser({
  id: 1,
  data: { name: '张三三', status: 'inactive' }
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useUpdate({
  // 必需参数
  path: 'users',           // API 路径

  // 可选参数
  meta: {                  // 额外参数
    include: 'profile'
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => {   // 成功回调
    console.log('更新成功:', data)
    // 可以进行页面跳转、刷新列表等
  },
  onError: (err) => {      // 错误回调
    console.error('更新失败:', err)
  }
})

// 执行更新
const handleUpdate = () => {
  mutate({
    id: 1,
    data: {
      name: '更新的用户名',
      email: 'updated@example.com',
      status: 'active'
    }
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
| `mutate` | `Function` | 执行更新的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在更新 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 更新后的响应数据 |

## 表单编辑示例

```js
import { useUpdate } from '@duxweb/dvha-core'
import { ref } from 'vue'

const editForm = ref({
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com',
  role: 'user',
  active: true
})

const {
  mutate: updateUser,
  isLoading,
  isError,
  isSuccess,
  error
} = useUpdate({
  path: 'users',
  onSuccess: () => {
    console.log('用户更新成功')
    // 可以关闭编辑对话框、跳转到详情页等
  }
})

const handleSubmit = () => {
  updateUser({
    id: editForm.value.id,
    data: {
      name: editForm.value.name,
      email: editForm.value.email,
      role: editForm.value.role,
      active: editForm.value.active
    }
  })
}
```

## 多数据提供者示例

```js
import { useUpdate } from '@duxweb/dvha-core'

// 使用默认数据提供者更新用户
const { mutate: updateUser } = useUpdate({
  path: 'users'
})

// 使用分析服务更新报告
const { mutate: updateReport } = useUpdate({
  path: 'reports',
  providerName: 'analytics'
})

// 使用支付服务更新订单
const { mutate: updateOrder } = useUpdate({
  path: 'orders',
  providerName: 'payment'
})

// 执行不同的更新操作
const handleUpdateUser = () => {
  updateUser({
    id: 1,
    data: { name: '新名称', status: 'active' }
  })
}

const handleUpdateReport = () => {
  updateReport({
    id: 'report-123',
    data: { status: 'published' }
  })
}

const handleUpdateOrder = () => {
  updateOrder({
    id: 'order-456',
    data: { status: 'shipped' }
  })
}
```

## 部分更新示例

```js
import { useUpdate } from '@duxweb/dvha-core'

const { mutate: updateUser } = useUpdate({
  path: 'users'
})

// 仅更新用户状态
const toggleUserStatus = (userId, currentStatus) => {
  updateUser({
    id: userId,
    data: {
      status: currentStatus === 'active' ? 'inactive' : 'active'
    }
  })
}

// 更新用户头像
const updateAvatar = (userId, avatarFile) => {
  const formData = new FormData()
  formData.append('avatar', avatarFile)

  updateUser({
    id: userId,
    data: formData,
    meta: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
```

## 高级配置示例

```js
import { useUpdate } from '@duxweb/dvha-core'

const { mutate: updateUser, isLoading, error } = useUpdate({
  path: 'users',
  meta: {
    include: 'profile,permissions',
    notify: true
  },
  providerName: 'userService',
  options: {
    onMutate: () => {
      console.log('开始更新用户...')
    },
    onSettled: () => {
      console.log('更新操作完成')
    }
  },
  onSuccess: (data) => {
    console.log('用户更新成功:', data)
    // 可以在这里进行页面跳转、显示成功提示等
  },
  onError: (error) => {
    console.error('更新用户失败:', error)
    // 可以在这里显示错误提示
  }
})

const handleUpdate = () => {
  updateUser({
    id: 1,
    data: {
      name: '更新后的用户名',
      email: 'updated@example.com',
      profile: {
        phone: '13900139000',
        address: '上海市浦东新区'
      }
    },
    meta: {
      sendNotification: true
    }
  })
}
```

## 响应格式

```json
{
  "message": "更新成功",
  "data": {
    "id": 1,
    "name": "张三三",
    "email": "zhangsan@example.com",
    "status": "inactive",
    "updated_at": "2024-01-20T15:45:00Z"
  }
}
```