# useFormValidate

`useFormValidate` hook 专门用于表单数据验证，基于 vee-validate 构建，提供独立的表单验证功能。

## 功能特点

- ✅ **独立验证** - 可单独使用的表单验证功能
- 📝 **响应式验证** - 表单数据变化时自动更新验证状态
- 🛡️ **双重规则支持** - 支持 vee-validate 内置规则和 Yup Schema 两种验证方式
- ⚡ **异步验证** - 支持异步验证函数
- 🔄 **状态重置** - 提供验证状态重置功能
- 🎯 **错误详情** - 提供详细的验证错误信息

## 支持的验证方式

框架支持两种验证方式，可根据项目需求选择：

### 1. vee-validate 内置规则（字符串格式）

- **适用场景**：简单验证、快速开发
- **格式**：字符串形式，如 `'required|email'`
- **优点**：语法简洁，上手快速
- **前提**：需要先调用 `initFormValidate()` 注册规则

### 2. Yup Schema 验证（对象格式）

- **适用场景**：复杂验证、类型安全、异步验证
- **格式**：Yup 对象形式
- **优点**：类型安全、功能强大、支持复杂逻辑
- **前提**：需要安装 `yup` 依赖

## 接口关系

该hook基于 vee-validate 构建，提供简化的验证接口。

```typescript
// 参数接口
interface UseValidateFormProps {
  data?: MaybeRef<Record<string, any>> // 要验证的表单数据
  rules?: TypedSchema // 验证规则（支持字符串规则或 Yup Schema）
}

// 返回值接口
interface UseValidateFormReturn {
  validate: () => Promise<ValidationResult> // 验证表单数据
  reset: () => void // 重置验证状态
  submit: Function // 处理表单提交（来自 vee-validate）
}

// 验证结果接口
interface ValidationResult {
  valid: boolean // 是否验证通过
  errors: Record<string, string> // 错误信息对象
}
```

## 验证规则初始化

使用 vee-validate 内置规则前，需要先初始化：

```js
import { initFormValidate } from '@duxweb/dvha-core'

// 在应用启动时调用，注册所有内置验证规则
initFormValidate()
```

## 使用方法

### 方式一：vee-validate 内置规则

```js
import { initFormValidate, useValidateForm } from '@duxweb/dvha-core'
import { ref } from 'vue'

// 初始化内置规则（应用启动时调用一次）
initFormValidate()

const formData = ref({
  name: '',
  email: ''
})

const { validate, reset, submit } = useValidateForm({
  data: formData,
  rules: {
    name: 'required|min:2',
    email: 'required|email'
  }
})
```

### 方式二：Yup Schema 验证

```js
import { useValidateForm } from '@duxweb/dvha-core'
import { ref } from 'vue'
import * as yup from 'yup'

const formData = ref({
  name: '',
  email: ''
})

const { validate, reset, submit } = useValidateForm({
  data: formData,
  rules: yup.object({
    name: yup.string().required('姓名是必填的').min(2, '姓名至少2个字符'),
    email: yup.string().required('邮箱是必填的').email('请输入有效邮箱')
  })
})
```

## 参数说明

| 参数    | 类型                            | 必需 | 说明                                    |
| ------- | ------------------------------- | ---- | --------------------------------------- |
| `data`  | `MaybeRef<Record<string, any>>` | ❌   | 要验证的表单数据                        |
| `rules` | `TypedSchema`                   | ❌   | 验证规则（支持字符串规则或 Yup Schema） |

## 返回值

| 字段       | 类型                              | 说明                              |
| ---------- | --------------------------------- | --------------------------------- |
| `validate` | `() => Promise<ValidationResult>` | 验证表单数据                      |
| `reset`    | `() => void`                      | 重置验证状态                      |
| `submit`   | `Function`                        | 处理表单提交（来自 vee-validate） |

## 方式一：vee-validate 内置规则示例

### 基础验证示例

```js
import { initFormValidate, useValidateForm } from '@duxweb/dvha-core'
import { ref } from 'vue'

// 应用启动时初始化
initFormValidate()

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  age: null
})

const { validate, reset } = useValidateForm({
  data: formData,
  rules: {
    username: 'required|min:3|max:20',
    password: 'required|min:6',
    confirmPassword: 'required|confirmed:@password',
    email: 'required|email',
    phone: 'regex:^1[3-9]\\d{9}$',
    age: 'numeric|min_value:1|max_value:120'
  }
})

// 验证表单
async function handleValidate() {
  const result = await validate()
  if (result.valid) {
    console.log('验证通过')
  }
  else {
    console.log('验证失败:', result.errors)
  }
}
```

### 常用内置规则

```js
const rules = {
  // 必填验证
  name: 'required',

  // 长度验证
  title: 'required|min:2|max:50',

  // 邮箱验证
  email: 'required|email',

  // 数值验证
  age: 'required|numeric|min_value:1|max_value:120',
  price: 'required|decimal:2|min_value:0',

  // 正则验证
  phone: 'required|regex:^1[3-9]\\d{9}$',

  // 确认验证（密码确认）
  password: 'required|min:6',
  confirmPassword: 'required|confirmed:@password',

  // URL验证
  website: 'url',

  // 日期验证
  birthday: 'required|date_format:YYYY-MM-DD',

  // 选择验证
  status: 'required|one_of:active,inactive,pending'
}
```

## 方式二：Yup Schema 验证示例

### 基础验证示例

```js
import { useValidateForm } from '@duxweb/dvha-core'
import { ref } from 'vue'
import * as yup from 'yup'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  age: null
})

const validationSchema = yup.object({
  username: yup.string()
    .required('用户名是必填的')
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符'),
  password: yup.string()
    .required('密码是必填的')
    .min(6, '密码至少6个字符'),
  confirmPassword: yup.string()
    .required('请确认密码')
    .oneOf([yup.ref('password')], '两次密码不一致'),
  email: yup.string()
    .required('邮箱是必填的')
    .email('请输入有效邮箱'),
  phone: yup.string()
    .matches(/^1[3-9]\d{9}$/, '请输入有效手机号'),
  age: yup.number()
    .required('年龄是必填的')
    .positive('年龄必须是正数')
    .integer('年龄必须是整数')
    .max(120, '年龄不能超过120岁')
})

const { validate, reset } = useValidateForm({
  data: formData,
  rules: validationSchema
})
```

### 异步验证示例

```js
import { useValidateForm } from '@duxweb/dvha-core'
import * as yup from 'yup'

// 自定义异步验证函数
async function checkEmailExists(email) {
  const response = await fetch(`/api/check-email?email=${email}`)
  const data = await response.json()
  return !data.exists
}

async function checkUsernameExists(username) {
  const response = await fetch(`/api/check-username?username=${username}`)
  const data = await response.json()
  return !data.exists
}

const formData = ref({
  email: '',
  username: ''
})

const { validate } = useValidateForm({
  data: formData,
  rules: yup.object({
    email: yup.string()
      .email('请输入有效邮箱')
      .required('邮箱是必填的')
      .test('email-exists', '邮箱已被使用', checkEmailExists),
    username: yup.string()
      .required('用户名是必填的')
      .min(3, '用户名至少3个字符')
      .test('username-exists', '用户名已被使用', checkUsernameExists)
  })
})

// 执行异步验证
async function handleAsyncValidate() {
  try {
    const result = await validate()
    if (result.valid) {
      console.log('异步验证通过')
    }
    else {
      console.log('异步验证失败:', result.errors)
    }
  }
  catch (error) {
    console.error('验证过程出错:', error)
  }
}
```

### 复杂验证示例

```js
import * as yup from 'yup'

const complexSchema = yup.object({
  // 条件验证
  hasJob: yup.boolean(),
  company: yup.string().when('hasJob', {
    is: true,
    then: schema => schema.required('请填写公司名称'),
    otherwise: schema => schema.notRequired()
  }),

  // 数组验证
  tags: yup.array()
    .of(yup.string().required())
    .min(1, '至少选择一个标签')
    .max(5, '最多选择5个标签'),

  // 对象验证
  address: yup.object({
    province: yup.string().required('请选择省份'),
    city: yup.string().required('请选择城市'),
    detail: yup.string().required('请填写详细地址')
  }),

  // 日期验证
  birthday: yup.date()
    .required('请选择生日')
    .max(new Date(), '生日不能是未来日期'),

  // 文件验证
  avatar: yup.mixed()
    .test('fileSize', '文件大小不能超过2MB', (value) => {
      return !value || value.size <= 2 * 1024 * 1024
    })
    .test('fileType', '只支持图片格式', (value) => {
      return !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
    })
})
```

## 对比两种验证方式

| 特性         | vee-validate 内置规则 | Yup Schema 验证 |
| ------------ | --------------------- | --------------- |
| **语法**     | 字符串格式            | 对象链式调用    |
| **类型安全** | ❌                    | ✅              |
| **异步验证** | ❌                    | ✅              |
| **条件验证** | ❌                    | ✅              |
| **复杂逻辑** | ❌                    | ✅              |
| **学习成本** | 低                    | 中等            |
| **性能**     | 较好                  | 良好            |
| **包大小**   | 小                    | 较大            |
| **自定义**   | 有限                  | 高度可定制      |

## 选择建议

- **简单表单**：推荐使用 vee-validate 内置规则，语法简洁，开发快速
- **复杂表单**：推荐使用 Yup Schema，功能强大，类型安全
- **异步验证**：必须使用 Yup Schema
- **条件验证**：推荐使用 Yup Schema
- **TypeScript 项目**：推荐使用 Yup Schema，有更好的类型支持

## 与组件集成示例

```vue
<script setup lang="ts">
import { initFormValidate, useValidateForm } from '@duxweb/dvha-core'
import { computed, ref } from 'vue'
import * as yup from 'yup'

// 初始化内置规则
initFormValidate()

const formData = ref({
  name: '',
  email: '',
  validationType: 'builtin' // 'builtin' | 'yup'
})

// 内置规则验证
const builtinRules = {
  name: 'required|min:2',
  email: 'required|email'
}

// Yup Schema 验证
const yupSchema = yup.object({
  name: yup.string()
    .required('姓名是必填的')
    .min(2, '姓名至少2个字符'),
  email: yup.string()
    .required('邮箱是必填的')
    .email('请输入有效邮箱')
})

// 根据选择动态切换验证方式
const currentRules = computed(() => {
  return formData.value.validationType === 'builtin' ? builtinRules : yupSchema
})

const { validate, reset } = useValidateForm({
  data: formData,
  rules: currentRules
})

const errors = ref({})
const isValidating = ref(false)

async function handleValidate() {
  isValidating.value = true
  try {
    const result = await validate()
    errors.value = result.valid ? {} : result.errors
    return result.valid
  }
  finally {
    isValidating.value = false
  }
}

async function handleSubmit() {
  const isValid = await handleValidate()
  if (isValid) {
    console.log('表单提交:', formData.value)
  }
}

function handleReset() {
  formData.value = {
    name: '',
    email: '',
    validationType: formData.value.validationType
  }
  errors.value = {}
  reset()
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>验证方式：</label>
      <select v-model="formData.validationType">
        <option value="builtin">
          vee-validate 内置规则
        </option>
        <option value="yup">
          Yup Schema 验证
        </option>
      </select>
    </div>

    <div>
      <label>姓名：</label>
      <input
        v-model="formData.name"
        type="text"
        :class="{ error: errors.name }"
      >
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
    </div>

    <div>
      <label>邮箱：</label>
      <input
        v-model="formData.email"
        type="email"
        :class="{ error: errors.email }"
      >
      <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
    </div>

    <div>
      <button
        type="submit"
        :disabled="isValidating"
      >
        {{ isValidating ? '验证中...' : '提交' }}
      </button>
      <button type="button" @click="handleReset">
        重置
      </button>
    </div>
  </form>
</template>

<style>
.error {
  border-color: red;
}
.error-text {
  color: red;
  font-size: 12px;
}
</style>
```
