# useRegister

`useRegister` hook 用于处理用户注册操作，通过认证提供者创建新用户账户。

## 功能特点

- 📝 **用户注册** - 通过认证提供者创建用户账户
- 🔐 **自动登录** - 注册成功后自动登录用户
- 💾 **状态管理** - 自动保存用户状态到 authStore
- 🔄 **自动跳转** - 注册成功后自动跳转到指定页面
- ⚡ **实时反馈** - 提供注册进度和结果状态
- 🛡️ **错误处理** - 处理注册失败情况
- 🏢 **多管理端** - 支持多管理端独立注册

## 接口关系

该hook调用当前管理端的 `authProvider.register(data)` 方法进行用户注册。

```js
// 认证提供者接口
interface IAuthProvider {
  register(data: Record<string, any>, manage?: IManageHook): Promise<IAuthLoginResponse>
}
```

## 使用方法

```js
import { useRegister } from '@duxweb/dvha-core'

const { mutate } = useRegister({
  onSuccess: (result) => {
    console.log('注册成功:', result)
  },
  onError: (result) => {
    console.error('注册失败:', result)
  }
})

// 执行注册
mutate({
  username: 'newuser',
  email: 'user@example.com',
  password: '123456'
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onSuccess` | `(result: IAuthLoginResponse) => void` | ❌ | 注册成功回调函数 |
| `onError` | `(result: IAuthLoginResponse) => void` | ❌ | 注册失败回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(data: Record<string, any>) => Promise<void>` | 执行注册的异步函数 |

## 基本用法示例

```js
import { useRegister } from '@duxweb/dvha-core'
import { ref } from 'vue'

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const { mutate: register } = useRegister({
  onSuccess: (result) => {
    console.log('注册成功，用户已自动登录')
  },
  onError: (result) => {
    if (result?.errors) {
      console.error('表单验证错误:', result.errors)
    } else {
      alert(result?.message || '注册失败')
    }
  }
})

const handleRegister = () => {
  register(form.value)
}
```

## 高级用法示例

```js
// 邮箱验证注册
const handleEmailRegister = () => {
  register({
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    email_verification_code: form.value.emailCode
  })
}

// 手机号注册
const handlePhoneRegister = () => {
  register({
    phone: form.value.phone,
    sms_code: form.value.smsCode,
    password: form.value.password,
    username: form.value.username
  })
}

// 第三方注册
const handleOAuthRegister = (provider, token) => {
  register({
    provider: provider,
    token: token
  })
}

// 企业注册
const handleEnterpriseRegister = () => {
  register({
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    account_type: 'enterprise',
    company_name: form.value.companyName
  })
}
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "注册成功",
  "redirectTo": "/dashboard",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 2,
    "info": {
      "username": "newuser",
      "email": "user@example.com",
      "status": "active"
    },
    "permission": ["user.read"]
  }
}
```

### 失败响应
```json
{
  "success": false,
  "message": "注册失败",
  "errors": {
    "username": "用户名已存在",
    "email": "邮箱格式不正确"
  }
}
```

## 工作流程

1. 调用 `mutate` 函数并传入注册数据
2. 通过当前管理端的 `authProvider.register` 方法进行注册
3. 如果成功：
   - 调用 `onSuccess` 回调
   - 将用户数据保存到 `authStore`（自动登录）
   - 自动跳转到 `redirectTo` 指定的页面
4. 如果失败：
   - 调用 `onError` 回调

## 注意事项

- 注册成功后用户会自动登录，无需再次调用登录接口
- 注册后会自动跳转，无需手动处理路由
- 多管理端环境下，注册的用户归属于当前管理端
- 可以传递任意自定义字段满足特定的注册需求
- 建议在客户端进行基本的表单验证以提升用户体验
