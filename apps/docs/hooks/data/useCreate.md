# useCreate

`useCreate` hook 用于创建新的数据记录。

## 功能特点

- ➕ **数据创建** - 创建新的资源记录
- 🔄 **自动缓存更新** - 创建成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理创建失败情况
- 🎯 **表单集成** - 完美集成表单提交流程
- 🔄 **缓存失效** - 自动失效相关列表查询缓存
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `create(options, manage, auth)` 方法创建新数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  create(
    options: IDataProviderCreateOptions,
    manage?: IManageHook,
    auth?: IUserState
  ): Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderCreateOptions {
  path: string                                          // API 路径
  data: Record<string, any>                            // 要创建的数据
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
import { useCreate } from '@duxweb/dvha-core'

const { mutate: createUser, isLoading, isError, error } = useCreate({
  path: 'users'
})

// 执行创建
createUser({
  data: { name: '张三', email: 'zhangsan@example.com' }
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useCreate({
  // 必需参数
  path: 'users',           // API 路径

  // 可选参数
  meta: {                  // 额外参数
    include: 'profile'
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => {   // 成功回调
    console.log('创建成功:', data)
    // 可以进行页面跳转、清空表单等
  },
  onError: (err) => {      // 错误回调
    console.error('创建失败:', err)
  }
})

// 执行创建
const handleCreate = () => {
  mutate({
    data: {
      name: '新用户',
      email: 'new@example.com',
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
| `mutate` | `Function` | 执行创建的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在创建 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 创建后的响应数据 |

## 表单提交示例

```js
import { useCreate } from '@duxweb/dvha-core'
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  role: 'user',
  active: true
})

const {
  mutate: createUser,
  isLoading,
  isError,
  isSuccess,
  error
} = useCreate({
  path: 'users',
  onSuccess: () => {
    // 清空表单
    form.value = {
      name: '',
      email: '',
      role: 'user',
      active: true
    }
    console.log('用户创建成功')
  }
})

const handleSubmit = () => {
  createUser({
    data: form.value
  })
}
```

## 多数据提供者示例

```js
import { useCreate } from '@duxweb/dvha-core'

// 使用默认数据提供者创建用户
const { mutate: createUser } = useCreate({
  path: 'users'
})

// 使用分析服务创建报告
const { mutate: createReport } = useCreate({
  path: 'reports',
  providerName: 'analytics'
})

// 使用支付服务创建订单
const { mutate: createOrder } = useCreate({
  path: 'orders',
  providerName: 'payment'
})

// 执行不同的创建操作
const handleCreateUser = () => {
  createUser({
    data: { name: '张三', email: 'zhangsan@example.com' }
  })
}

const handleCreateReport = () => {
  createReport({
    data: { type: 'monthly', period: '2024-01' }
  })
}

const handleCreateOrder = () => {
  createOrder({
    data: { amount: 100, currency: 'CNY' }
  })
}
```

## 文件上传创建

```js
import { useCreate } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedFile = ref(null)
const description = ref('')

const { mutate: createPost, isLoading } = useCreate({
  path: 'posts',
  meta: {
    'Content-Type': 'multipart/form-data'
  }
})

const handleUpload = () => {
  const formData = new FormData()
  formData.append('title', description.value)
  formData.append('image', selectedFile.value)

  createPost({
    data: formData
  })
}
```

## 高级配置示例

```js
import { useCreate } from '@duxweb/dvha-core'

const { mutate: createUser, isLoading, error } = useCreate({
  path: 'users',
  meta: {
    include: 'profile,permissions',
    notification: true
  },
  providerName: 'userService',
  options: {
    onMutate: () => {
      console.log('开始创建用户...')
    },
    onSettled: () => {
      console.log('创建操作完成')
    }
  },
  onSuccess: (data) => {
    console.log('用户创建成功:', data)
    // 可以在这里进行页面跳转、显示成功提示等
  },
  onError: (error) => {
    console.error('创建用户失败:', error)
    // 可以在这里显示错误提示
  }
})

const handleCreate = () => {
  createUser({
    data: {
      name: '新用户',
      email: 'newuser@example.com',
      role: 'admin',
      profile: {
        phone: '13800138000',
        address: '北京市朝阳区'
      }
    },
    meta: {
      sendWelcomeEmail: true
    }
  })
}
```

## 响应格式

```json
{
  "message": "创建成功",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com",
    "status": "active",
    "created_at": "2024-01-20T10:30:00Z"
  }
}
```

## 完整示例

```vue
<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6">创建用户</h2>

    <form @submit.prevent="handleCreate" class="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
        <input
          v-model="userForm.username"
          type="text"
          placeholder="请输入用户名"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
        <input
          v-model="userForm.email"
          type="email"
          placeholder="请输入邮箱"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">角色</label>
        <select v-model="userForm.role" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
      </div>

      <div>
        <label class="flex items-center">
          <input v-model="userForm.active" type="checkbox" class="mr-2" />
          <span class="text-sm text-gray-700">激活状态</span>
        </label>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          重置
        </button>
        <button
          type="submit"
          :disabled="isLoading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isLoading ? '创建中...' : '创建用户' }}
        </button>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error?.message || '创建失败' }}
      </div>

      <div v-if="data" class="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        用户创建成功！ID: {{ data?.id }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCreate, useInvalidate } from '@duxweb/dvha-core'

const userForm = reactive({
  username: '',
  email: '',
  role: 'user',
  active: true
})

const invalidate = useInvalidate()

const { mutate: createUser, isLoading, error, data } = useCreate({
  path: 'users',
  onSuccess: (result) => {
    console.log('用户创建成功:', result)

    // 手动失效相关查询
    invalidate([
      { path: 'users' }, // 失效用户列表
      { path: 'dashboard/stats' } // 失效仪表板统计
    ])

    // 重置表单
    resetForm()
  },
  onError: (error) => {
    console.error('用户创建失败:', error)
  },
  // 自动失效相关查询
  invalidates: [
    { path: 'users' },
    { path: 'users', options: { role: userForm.role } }
  ]
})

const handleCreate = () => {
  createUser({
    values: {
      username: userForm.username,
      email: userForm.email,
      role: userForm.role,
      active: userForm.active
    },
    options: {
      // 可以传递额外的选项给数据提供者
      notify: true
    }
  })
}

const resetForm = () => {
  Object.assign(userForm, {
    username: '',
    email: '',
    role: 'user',
    active: true
  })
}
</script>
```

## 文件上传示例

```vue
<template>
  <div class="max-w-md mx-auto p-6">
    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
        <input
          v-model="formData.title"
          placeholder="文件标题"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">文件</label>
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading || !formData.file"
        class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isLoading ? '上传中...' : '上传文件' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCreate } from '@duxweb/dvha-core'

const formData = reactive({
  title: '',
  file: null as File | null
})

const { mutate, isLoading } = useCreate({
  path: 'files',
  onSuccess: (result) => {
    console.log('文件上传成功:', result)
    formData.title = ''
    formData.file = null
  }
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  formData.file = target.files?.[0] || null
}

const handleSubmit = () => {
  if (!formData.file) return

  const formDataToSend = new FormData()
  formDataToSend.append('title', formData.title)
  formDataToSend.append('file', formData.file)

  mutate({
    values: formDataToSend
  })
}
</script>
```

## 批量创建示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useCreate } from '@duxweb/dvha-core'

const batchData = ref([
  { name: '用户1', email: 'user1@example.com' },
  { name: '用户2', email: 'user2@example.com' },
  { name: '用户3', email: 'user3@example.com' }
])

const { mutate: batchCreate, isLoading } = useCreate({
  path: 'users/batch',
  onSuccess: (result) => {
    console.log('批量创建成功:', result)
  }
})

const handleBatchCreate = () => {
  batchCreate({
    values: {
      users: batchData.value
    }
  })
}
</script>
```

## 工作流程

1. **调用 mutate**: 传入要创建的数据
2. **调用数据提供者**: 框架调用配置的数据提供者的 `create` 方法
3. **处理响应**:
   - 成功：触发 `onSuccess` 回调，自动失效相关查询缓存
   - 失败：触发 `onError` 回调
4. **缓存更新**: 创建成功后，相关的查询缓存会自动失效并重新获取

## 注意事项

- 创建成功后，框架会自动失效相关的列表查询缓存
- 可以通过 `invalidates` 参数指定额外需要失效的查询
- 支持文件上传，使用 `FormData` 格式
- 支持批量创建操作
- 错误处理会自动显示服务器返回的错误信息
