# useCreateMany

`useCreateMany` hook 用于批量创建多条数据记录，适用于需要同时创建大量数据的场景。

## 功能特点

- ➕ **批量创建** - 一次请求创建多条数据记录
- 🔄 **自动缓存更新** - 创建成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理批量创建失败情况
- 🎯 **高效处理** - 相比单个创建，减少网络请求次数
- 🔄 **缓存失效** - 自动失效相关列表查询缓存
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `createMany(options, manage, auth)` 方法批量创建数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  createMany: (
    options: IDataProviderCreateManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderCreateManyOptions {
  path: string // API 路径
  data: Record<string, any>[] // 要创建的数据数组
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
import { useCreateMany } from '@duxweb/dvha-core'

const { mutate: createUsers, isLoading, isError, error } = useCreateMany({
  path: 'users'
})

// 执行批量创建
createUsers({
  data: [
    { name: '张三', email: 'zhangsan@example.com' },
    { name: '李四', email: 'lisi@example.com' },
    { name: '王五', email: 'wangwu@example.com' }
  ]
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useCreateMany({
  // 必需参数
  path: 'users', // API 路径

  // 可选参数
  meta: { // 额外参数
    include: 'profile',
    notify: true
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => { // 成功回调
    console.log('批量创建成功:', data)
    console.log(`成功创建 ${data.data.length} 条记录`)
  },
  onError: (err) => { // 错误回调
    console.error('批量创建失败:', err)
  }
})

// 执行批量创建
function handleBatchCreate() {
  mutate({
    data: batchData.value
  })
}
```

## 参数说明

| 参数           | 类型                   | 必需 | 说明                             |
| -------------- | ---------------------- | ---- | -------------------------------- |
| `path`         | `string`               | ✅   | API 资源路径                     |
| `meta`         | `Record<string, any>`  | ❌   | 传递给 API 的额外参数            |
| `providerName` | `string`               | ❌   | 数据提供者名称，默认为 'default' |
| `onSuccess`    | `(data: any) => void`  | ❌   | 成功回调                         |
| `onError`      | `(error: any) => void` | ❌   | 错误处理回调                     |
| `options`      | `UseMutationOptions`   | ❌   | TanStack Query Mutation 选项     |

## 返回值

| 字段        | 类型           | 说明               |
| ----------- | -------------- | ------------------ |
| `mutate`    | `Function`     | 执行批量创建的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在创建       |
| `isError`   | `Ref<boolean>` | 是否出错           |
| `error`     | `Ref<any>`     | 错误信息           |
| `isSuccess` | `Ref<boolean>` | 是否成功           |
| `data`      | `Ref<any>`     | 创建后的响应数据   |

## 批量用户创建示例

```js
import { useCreateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

// 批量用户数据
const userList = ref([
  { name: '张三', email: 'zhangsan@example.com', role: 'user' },
  { name: '李四', email: 'lisi@example.com', role: 'editor' },
  { name: '王五', email: 'wangwu@example.com', role: 'admin' },
  { name: '赵六', email: 'zhaoliu@example.com', role: 'user' }
])

const {
  mutate: batchCreateUsers,
  isLoading,
  isError,
  isSuccess,
  error
} = useCreateMany({
  path: 'users',
  onSuccess: (response) => {
    console.log(`批量创建成功，共创建 ${response.data.length} 个用户`)
    // 清空列表或跳转到用户列表页
    userList.value = []
  },
  onError: (error) => {
    console.error('批量创建失败:', error.message)
  }
})

function handleBatchCreate() {
  if (userList.value.length === 0) {
    alert('请先添加要创建的用户')
    return
  }

  batchCreateUsers({
    data: userList.value
  })
}

// 添加新用户到列表
function addUser() {
  userList.value.push({
    name: '',
    email: '',
    role: 'user'
  })
}

// 删除用户
function removeUser(index) {
  userList.value.splice(index, 1)
}
```

## Excel/CSV 导入示例

```js
import { useCreateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const importedData = ref([])

const { mutate: importUsers, isLoading } = useCreateMany({
  path: 'users/import',
  meta: {
    source: 'excel_import',
    validate: true
  },
  onSuccess: (response) => {
    console.log('导入成功:', response)
    const { success, failed, total } = response.meta
    alert(`导入完成！成功: ${success}，失败: ${failed}，总计: ${total}`)
  },
  onError: (error) => {
    console.error('导入失败:', error)
  }
})

// 解析 Excel 文件
function parseExcelFile(file) {
  // 假设使用 SheetJS 或其他库解析 Excel
  // 这里简化处理
  const data = [
    { name: '用户1', email: 'user1@example.com', department: 'IT' },
    { name: '用户2', email: 'user2@example.com', department: 'HR' },
    // ... 更多数据
  ]
  importedData.value = data
}

// 执行批量导入
function handleImport() {
  if (importedData.value.length === 0) {
    alert('请先选择并解析文件')
    return
  }

  importUsers({
    data: importedData.value,
    meta: {
      batchSize: 100, // 每批处理100条
      validate: true, // 启用数据验证
      skipDuplicates: true // 跳过重复数据
    }
  })
}
```

## 多数据提供者示例

```js
import { useCreateMany } from '@duxweb/dvha-core'

// 使用默认数据提供者批量创建用户
const { mutate: createUsers } = useCreateMany({
  path: 'users'
})

// 使用分析服务批量创建报告
const { mutate: createReports } = useCreateMany({
  path: 'reports',
  providerName: 'analytics'
})

// 使用支付服务批量创建订单
const { mutate: createOrders } = useCreateMany({
  path: 'orders',
  providerName: 'payment'
})

// 执行不同的批量创建操作
function handleBatchCreateUsers() {
  createUsers({
    data: [
      { name: '张三', email: 'zhangsan@example.com' },
      { name: '李四', email: 'lisi@example.com' }
    ]
  })
}

function handleBatchCreateReports() {
  createReports({
    data: [
      { type: 'monthly', period: '2024-01', status: 'pending' },
      { type: 'weekly', period: '2024-W1', status: 'pending' }
    ]
  })
}

function handleBatchCreateOrders() {
  createOrders({
    data: [
      { amount: 100, currency: 'CNY', customer_id: 1 },
      { amount: 200, currency: 'CNY', customer_id: 2 }
    ]
  })
}
```

## 数据验证示例

```js
import { useCreateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const products = ref([])

const { mutate: createProducts, isLoading, error } = useCreateMany({
  path: 'products',
  meta: {
    validate: true,
    allowPartialSuccess: false // 不允许部分成功，要么全部成功，要么全部失败
  },
  onSuccess: (response) => {
    console.log('所有产品创建成功:', response.data)
  },
  onError: (error) => {
    console.error('批量创建失败:', error)
    // 可能包含验证错误详情
    if (error.validationErrors) {
      console.log('验证错误:', error.validationErrors)
    }
  }
})

// 验证产品数据
function validateProducts() {
  const errors = []
  products.value.forEach((product, index) => {
    if (!product.name || product.name.trim() === '') {
      errors.push(`第 ${index + 1} 行：产品名称不能为空`)
    }
    if (!product.price || product.price <= 0) {
      errors.push(`第 ${index + 1} 行：价格必须大于 0`)
    }
  })
  return errors
}

function handleCreateProducts() {
  // 客户端验证
  const validationErrors = validateProducts()
  if (validationErrors.length > 0) {
    alert(`数据验证失败:\n${validationErrors.join('\n')}`)
    return
  }

  // 执行批量创建
  createProducts({
    data: products.value
  })
}
```

## 高级配置示例

```js
import { useCreateMany } from '@duxweb/dvha-core'

const { mutate: batchCreateUsers, isLoading, error } = useCreateMany({
  path: 'users',
  meta: {
    include: 'profile,permissions',
    notification: true,
    batchOptions: {
      size: 50, // 每批50条
      parallel: false, // 不并行处理
      continueOnError: false // 遇到错误时停止
    }
  },
  providerName: 'userService',
  options: {
    onMutate: () => {
      console.log('开始批量创建用户...')
    },
    onSettled: () => {
      console.log('批量创建操作完成')
    }
  },
  onSuccess: (data) => {
    console.log('用户批量创建成功:', data)
    const { total, success, failed } = data.meta
    console.log(`总计: ${total}, 成功: ${success}, 失败: ${failed}`)
  },
  onError: (error) => {
    console.error('批量创建用户失败:', error)
    // 显示详细错误信息
    if (error.details) {
      console.log('失败详情:', error.details)
    }
  }
})

function handleAdvancedBatchCreate() {
  batchCreateUsers({
    data: [
      {
        name: '高级用户1',
        email: 'advanced1@example.com',
        role: 'admin',
        profile: {
          phone: '13800138001',
          address: '北京市朝阳区'
        },
        permissions: ['read', 'write', 'delete']
      },
      {
        name: '高级用户2',
        email: 'advanced2@example.com',
        role: 'editor',
        profile: {
          phone: '13800138002',
          address: '上海市浦东新区'
        },
        permissions: ['read', 'write']
      }
      // ... 更多复杂数据
    ],
    meta: {
      sendWelcomeEmail: true,
      assignDefaultGroup: 'new_users'
    }
  })
}
```

## 响应格式

```json
{
  "message": "批量创建成功",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "status": "active",
      "created_at": "2024-01-20T10:30:00Z"
    },
    {
      "id": 2,
      "name": "李四",
      "email": "lisi@example.com",
      "status": "active",
      "created_at": "2024-01-20T10:30:01Z"
    }
  ],
  "meta": {
    "total": 2,
    "success": 2,
    "failed": 0,
    "batch_id": "batch_20240120_001"
  }
}
```

## Vue 组件完整示例

```vue
<script setup lang="ts">
import { useCreateMany } from '@duxweb/dvha-core'
import { computed, ref } from 'vue'

const userList = ref([
  { name: '', email: '', role: 'user' }
])

const {
  mutate: batchCreateUsers,
  isLoading,
  isError,
  isSuccess,
  error
} = useCreateMany({
  path: 'users',
  onSuccess: (response) => {
    console.log('批量创建成功:', response)
    // 重置表单
    userList.value = [{ name: '', email: '', role: 'user' }]
  }
})

const canSubmit = computed(() => {
  return userList.value.every(user =>
    user.name.trim() !== '' && user.email.trim() !== ''
  ) && userList.value.length > 0
})

function addUser() {
  userList.value.push({ name: '', email: '', role: 'user' })
}

function removeUser(index: number) {
  if (userList.value.length > 1) {
    userList.value.splice(index, 1)
  }
}

function handleSubmit() {
  if (!canSubmit.value) {
    alert('请填写完整的用户信息')
    return
  }

  batchCreateUsers({
    data: userList.value
  })
}
</script>

<template>
  <div class="batch-create-users">
    <h2>批量创建用户</h2>

    <div class="user-form">
      <div
        v-for="(user, index) in userList"
        :key="index"
        class="user-item"
      >
        <input
          v-model="user.name"
          placeholder="姓名"
          class="form-input"
        >
        <input
          v-model="user.email"
          placeholder="邮箱"
          type="email"
          class="form-input"
        >
        <select v-model="user.role" class="form-select">
          <option value="user">
            普通用户
          </option>
          <option value="editor">
            编辑者
          </option>
          <option value="admin">
            管理员
          </option>
        </select>
        <button
          :disabled="userList.length === 1"
          class="btn btn-danger btn-sm"
          @click="removeUser(index)"
        >
          删除
        </button>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-secondary" @click="addUser">
        添加用户
      </button>
      <button
        :disabled="!canSubmit || isLoading"
        class="btn btn-primary"
        @click="handleSubmit"
      >
        {{ isLoading ? '创建中...' : '批量创建' }}
      </button>
    </div>

    <div v-if="isError" class="error">
      创建失败: {{ error?.message }}
    </div>

    <div v-if="isSuccess" class="success">
      批量创建成功！
    </div>
  </div>
</template>

<style scoped>
.batch-create-users {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-form {
  margin-bottom: 20px;
}

.user-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.form-input,
.form-select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}
.btn-secondary {
  background: #6c757d;
  color: white;
}
.btn-danger {
  background: #dc3545;
  color: white;
}
.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.error {
  color: #dc3545;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
}

.success {
  color: #155724;
  padding: 10px;
  background: #d4edda;
  border-radius: 4px;
}
</style>
```

## 工作流程

1. **调用 mutate**: 传入要批量创建的数据数组
2. **调用数据提供者**: 框架调用配置的数据提供者的 `createMany` 方法
3. **批量处理**: 服务器端处理批量创建逻辑
4. **处理响应**:
   - 成功：触发 `onSuccess` 回调，自动失效相关查询缓存
   - 失败：触发 `onError` 回调
5. **缓存更新**: 创建成功后，相关的查询缓存会自动失效并重新获取

## 注意事项

- 批量创建通常比逐个创建更高效，减少网络请求次数
- 服务器端需要支持批量创建接口
- 大量数据时考虑分批处理，避免请求超时
- 创建成功后，框架会自动失效相关的列表查询缓存
- 支持部分成功模式，可以通过响应数据查看详细结果
- 错误处理可能包含验证错误的详细信息
- 适合文件导入、表单批量提交等场景
- 可以配合数据验证确保数据质量
