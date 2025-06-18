# useFormExtend

`useFormExtend` hook 用于处理带验证功能的表单数据，集成了表单管理和数据验证，基于 `useForm` 和 `useFormValidate` 构建。

## 功能特点

- 📝 **表单管理** - 继承 `useForm` 的所有表单管理功能
- ✅ **自动验证** - 提交前自动进行表单数据验证
- 🛡️ **验证拦截** - 验证失败时阻止表单提交
- 🔄 **状态管理** - 提供完整的加载和编辑状态
- 🎯 **错误处理** - 验证失败时自动调用错误回调
- 🔄 **双重重置** - 同时重置表单数据和验证状态

## 接口关系

该hook内部使用 `useForm` 和 `useValidateForm` hooks。

```typescript
// 参数接口
interface UseExtendFormProps extends IUseFormProps {
  rules?: TypedSchema // 验证规则（基于 vee-validate）
}

// 返回值接口
interface UseExtendFormReturn {
  isLoading: ComputedRef<boolean> // 加载状态
  isEdit: ComputedRef<boolean> // 编辑模式
  form: Ref<Record<string, any>> // 表单数据
  onSubmit: (data?: Record<string, any>) => void // 提交方法（带验证）
  onReset: () => void // 重置方法（表单+验证）
}
```

## 使用方法

```js
import { useExtendForm } from '@duxweb/dvha-core'
import * as yup from 'yup'

const { form, isLoading, onSubmit, onReset } = useExtendForm({
  path: 'users',
  action: 'create',
  rules: yup.object({
    name: yup.string().required('姓名是必填的'),
    email: yup.string().email('请输入有效邮箱').required('邮箱是必填的')
  })
})
```

## 常用参数

```js
const { form, isLoading, onSubmit, onReset } = useExtendForm({
  // 基础表单参数（继承自 useForm）
  path: 'users', // API 路径
  action: 'create', // 操作类型
  form: { // 初始表单数据
    name: '',
    email: '',
    status: 'active'
  },

  // 验证相关参数
  rules: yup.object({ // 验证规则
    name: yup.string()
      .required('姓名是必填的')
      .min(2, '姓名至少2个字符'),
    email: yup.string()
      .email('请输入有效邮箱')
      .required('邮箱是必填的'),
    status: yup.string()
      .oneOf(['active', 'inactive'], '状态值无效')
  }),

  // 回调函数
  onSuccess: (data) => { // 成功回调
    console.log('提交成功:', data)
  },
  onError: (error) => { // 错误回调（包括验证失败）
    console.error('操作失败:', error)
  }
})
```

## 参数说明

| 参数    | 类型          | 必需 | 说明                              |
| ------- | ------------- | ---- | --------------------------------- |
| `rules` | `TypedSchema` | ❌   | 表单验证规则（基于 vee-validate） |

其他参数继承自 `IUseFormProps`，详见 [useForm 文档](/hooks/advanced/useForm)。

## 返回值

| 字段        | 类型                                   | 说明                     |
| ----------- | -------------------------------------- | ------------------------ |
| `isLoading` | `ComputedRef<boolean>`                 | 是否正在加载             |
| `isEdit`    | `ComputedRef<boolean>`                 | 是否为编辑模式           |
| `form`      | `Ref<Record<string, any>>`             | 表单数据                 |
| `onSubmit`  | `(data?: Record<string, any>) => void` | 提交表单（会先进行验证） |
| `onReset`   | `() => void`                           | 重置表单数据和验证状态   |

## 创建表单示例

```js
import { useExtendForm } from '@duxweb/dvha-core'
import * as yup from 'yup'

const {
  form,
  isLoading,
  onSubmit,
  onReset
} = useExtendForm({
  path: 'users',
  action: 'create',
  form: {
    name: '',
    email: '',
    age: null,
    role: 'user'
  },
  rules: yup.object({
    name: yup.string()
      .required('姓名是必填的')
      .min(2, '姓名至少2个字符'),
    email: yup.string()
      .email('请输入有效邮箱')
      .required('邮箱是必填的'),
    age: yup.number()
      .positive('年龄必须是正数')
      .integer('年龄必须是整数')
      .max(120, '年龄不能超过120岁'),
    role: yup.string()
      .oneOf(['admin', 'user'], '角色值无效')
  }),
  onSuccess: (data) => {
    console.log('用户创建成功:', data)
    // 可以进行页面跳转、显示成功提示等
  },
  onError: (error) => {
    console.error('操作失败:', error.message)
    // 显示错误提示
  }
})

function handleSubmit() {
  // 会自动进行验证，验证通过后才提交
  onSubmit()
}

function handleReset() {
  // 重置表单数据和验证状态
  onReset()
}
```

## 编辑表单示例

```js
import { useExtendForm } from '@duxweb/dvha-core'
import { ref } from 'vue'
import * as yup from 'yup'

const userId = ref(1)

const {
  form,
  isLoading,
  isEdit,
  onSubmit,
  onReset
} = useExtendForm({
  path: 'users',
  id: userId.value,
  action: 'edit',
  rules: yup.object({
    name: yup.string().required('姓名是必填的'),
    email: yup.string().email().required('邮箱是必填的')
  }),
  onSuccess: (data) => {
    console.log('用户更新成功:', data)
  },
  onError: (error) => {
    console.error('更新失败:', error.message)
  }
})

// 表单会自动获取用户数据并填充
// isEdit.value 为 true 表示编辑模式
```

## 验证失败处理

```js
import { useExtendForm } from '@duxweb/dvha-core'
import * as yup from 'yup'

const { form, onSubmit } = useExtendForm({
  path: 'users',
  action: 'create',
  rules: yup.object({
    name: yup.string().required('姓名是必填的'),
    email: yup.string().email().required('邮箱是必填的')
  }),
  onError: (error) => {
    if (error.message === '表单验证失败') {
      // 这是验证失败的情况
      console.log('请检查表单输入')
    }
    else {
      // 这是API请求失败的情况
      console.error('提交失败:', error.message)
    }
  }
})

// 当验证失败时，onError 会被调用，错误消息为 "表单验证失败"
// 当验证通过但API请求失败时，onError 会被调用，错误消息为实际的API错误
```

## 完整示例

```vue
<script setup lang="ts">
import { useExtendForm } from '@duxweb/dvha-core'
import * as yup from 'yup'

const props = defineProps<{
  id?: string | number
  action: 'create' | 'edit'
}>()

const validationSchema = yup.object({
  name: yup.string()
    .required('姓名是必填的')
    .min(2, '姓名至少2个字符'),
  email: yup.string()
    .email('请输入有效邮箱')
    .required('邮箱是必填的'),
  phone: yup.string()
    .matches(/^1[3-9]\d{9}$/, '请输入有效手机号'),
  age: yup.number()
    .positive('年龄必须是正数')
    .integer('年龄必须是整数')
    .max(120, '年龄不能超过120岁')
})

const {
  form,
  isLoading,
  isEdit,
  onSubmit,
  onReset
} = useExtendForm({
  path: 'users',
  id: props.id,
  action: props.action,
  form: {
    name: '',
    email: '',
    phone: '',
    age: null
  },
  rules: validationSchema,
  onSuccess: (data) => {
    console.log('操作成功:', data)
  },
  onError: (error) => {
    console.error('操作失败:', error.message)
  }
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>姓名：</label>
      <input v-model="form.name" type="text">
    </div>
    <div>
      <label>邮箱：</label>
      <input v-model="form.email" type="email">
    </div>
    <div>
      <label>手机：</label>
      <input v-model="form.phone" type="tel">
    </div>
    <div>
      <label>年龄：</label>
      <input v-model.number="form.age" type="number">
    </div>
    <div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '提交中...' : (isEdit ? '更新' : '创建') }}
      </button>
      <button type="button" @click="onReset">
        重置
      </button>
    </div>
  </form>
</template>
```
