# useForm

`useForm` hook 用于处理表单数据，集成了创建和更新操作，提供表单状态管理功能。

## 功能特点

- 📝 **表单管理** - 统一处理创建和编辑表单
- 🔄 **自动数据获取** - 编辑模式下自动获取数据
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🛡️ **错误处理** - 自动处理表单提交失败情况
- 🎯 **双向绑定** - 支持表单数据双向绑定
- 🔄 **表单重置** - 提供表单重置功能
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook内部使用 `useOne`、`useCreate` 和 `useUpdate` hooks。

```typescript
// 参数接口
interface IUseFormProps {
  path?: string // 资源路径
  id?: string | number // 编辑时的记录ID
  form?: Record<string, any> // 初始表单数据
  onSuccess?: (data: IDataProviderResponse) => void // 成功回调
  onError?: (error: IDataProviderError) => void // 错误回调
  action?: 'create' | 'edit' // 操作类型
  providerName?: string // 数据提供者名称
}

// 返回值接口
interface IUseFormReturn {
  form: Ref<Record<string, any>> // 表单数据
  isLoading: ComputedRef<boolean> // 加载状态
  onSubmit: () => void // 提交方法
  onReset: () => void // 重置方法
}
```

## 使用方法

```js
import { useForm } from '@duxweb/dvha-core'

const { form, isLoading, onSubmit, onReset } = useForm({
  path: 'users',
  action: 'create'
})
```

## 常用参数

```js
const { form, isLoading, onSubmit, onReset } = useForm({
  // 必需参数
  path: 'users', // API 路径
  action: 'create', // 操作类型：'create' 或 'edit'

  // 可选参数
  id: 1, // 编辑时的记录ID（action为'edit'时必需）
  form: { // 初始表单数据
    name: '',
    email: '',
    status: 'active'
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => { // 成功回调
    console.log('操作成功:', data)
  },
  onError: (error) => { // 错误回调
    console.error('操作失败:', error)
  }
})
```

## 参数说明

| 参数           | 类型                   | 必需 | 说明                                   |
| -------------- | ---------------------- | ---- | -------------------------------------- |
| `path`         | `string`               | ❌   | API 资源路径                           |
| `id`           | `string \| number`     | ❌   | 编辑时的记录ID（action为'edit'时必需） |
| `form`         | `Record<string, any>`  | ❌   | 初始表单数据                           |
| `action`       | `'create' \| 'edit'`   | ❌   | 操作类型，默认为 'create'              |
| `providerName` | `string`               | ❌   | 数据提供者名称，默认为 'default'       |
| `onSuccess`    | `(data: any) => void`  | ❌   | 成功回调                               |
| `onError`      | `(error: any) => void` | ❌   | 错误处理回调                           |

## 返回值

| 字段        | 类型                       | 说明                                 |
| ----------- | -------------------------- | ------------------------------------ |
| `form`      | `Ref<Record<string, any>>` | 表单数据对象                         |
| `isLoading` | `ComputedRef<boolean>`     | 是否加载中（包含数据获取和提交状态） |
| `onSubmit`  | `Function`                 | 提交表单的函数                       |
| `onReset`   | `Function`                 | 重置表单的函数                       |

## 创建表单示例

```js
import { useForm } from '@duxweb/dvha-core'
import { ref } from 'vue'

const { form, isLoading, onSubmit, onReset } = useForm({
  path: 'users',
  form: {
    name: '',
    email: '',
    role: 'user'
  },
  action: 'create',
  onSuccess: (data) => {
    console.log('用户创建成功:', data)
    // 可以进行页面跳转、显示成功提示等
  },
  onError: (error) => {
    console.error('创建失败:', error)
  }
})

function handleSubmit() {
  onSubmit()
}

function handleReset() {
  onReset()
}
```

## 编辑表单示例

```js
import { useForm } from '@duxweb/dvha-core'

const userId = ref(1)

const { form, isLoading, onSubmit, onReset } = useForm({
  path: 'users',
  id: userId.value,
  form: {
    name: '',
    email: '',
    role: 'user'
  },
  action: 'edit',
  onSuccess: (data) => {
    console.log('用户更新成功:', data)
  },
  onError: (error) => {
    console.error('更新失败:', error)
  }
})

// 表单会自动获取用户数据并填充
```

## 多数据提供者示例

```js
import { useForm } from '@duxweb/dvha-core'

// 使用默认数据提供者创建用户
const { form: userForm, onSubmit: submitUser } = useForm({
  path: 'users',
  action: 'create',
  form: { name: '', email: '' }
})

// 使用分析服务创建报告
const { form: reportForm, onSubmit: submitReport } = useForm({
  path: 'reports',
  action: 'create',
  providerName: 'analytics',
  form: { title: '', type: 'monthly' }
})

// 使用支付服务创建订单
const { form: orderForm, onSubmit: submitOrder } = useForm({
  path: 'orders',
  action: 'create',
  providerName: 'payment',
  form: { amount: 0, currency: 'CNY' }
})
```

## 完整示例

```vue
<script setup lang="ts">
import { useForm } from '@duxweb/dvha-core'

const props = defineProps<{
  id?: string | number
  action: 'create' | 'edit'
}>()

const { form, isLoading, onSubmit, onReset } = useForm({
  path: 'users',
  id: props.id,
  form: {
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  },
  action: props.action,
  onSuccess: (data) => {
    console.log('操作成功:', data)
    // 可以进行页面跳转、显示成功提示等
  },
  onError: (error) => {
    console.error('操作失败:', error)
    // 显示错误提示
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>姓名</label>
      <input v-model="form.name" type="text" required>
    </div>

    <div>
      <label>邮箱</label>
      <input v-model="form.email" type="email" required>
    </div>

    <div>
      <label>角色</label>
      <select v-model="form.role">
        <option value="user">
          用户
        </option>
        <option value="admin">
          管理员
        </option>
      </select>
    </div>

    <div>
      <label>状态</label>
      <select v-model="form.status">
        <option value="active">
          激活
        </option>
        <option value="inactive">
          禁用
        </option>
      </select>
    </div>

    <div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '提交中...' : (action === 'create' ? '创建' : '更新') }}
      </button>
      <button type="button" :disabled="isLoading" @click="onReset">
        重置
      </button>
    </div>
  </form>
</template>
```

## 工作流程

1. **初始化**: 根据 `action` 和 `id` 参数初始化表单
2. **数据获取**: 编辑模式下自动获取现有数据
3. **表单填充**: 将获取的数据填充到表单中
4. **提交处理**: 根据 `action` 调用创建或更新操作
5. **状态更新**: 自动更新加载状态和处理回调

## 注意事项

- 编辑模式（`action: 'edit'`）时必须提供 `id` 参数
- 表单数据会自动与初始数据进行双向绑定
- 重置操作会将表单恢复到初始状态或获取的数据状态
- 加载状态包含了数据获取和提交操作的状态
- 支持多数据提供者配置

## 相关链接

- 📝 [数据创建 (useCreate)](/hooks/data/useCreate) - 创建数据
- ✏️ [数据更新 (useUpdate)](/hooks/data/useUpdate) - 更新数据
- 📄 [获取单条 (useOne)](/hooks/data/useOne) - 获取单条数据
