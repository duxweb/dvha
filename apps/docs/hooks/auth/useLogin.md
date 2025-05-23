# useLogin

`useLogin` hook 用于处理用户登录操作，通过认证提供者进行用户身份验证。

## 功能特点

- 🔐 **统一认证** - 通过认证提供者统一处理登录
- 🔄 **自动跳转** - 登录成功后自动跳转到指定页面
- 💾 **状态管理** - 自动保存用户状态到 authStore
- ⚡ **加载状态** - 提供登录进度状态
- 🛡️ **错误处理** - 处理登录失败情况
- 🏢 **多管理端** - 支持多管理端独立认证

## 接口关系

该hook调用当前管理端的 `authProvider.login(data)` 方法进行登录认证。

```js
// 认证提供者接口
interface IAuthProvider {
  login(data: Record<string, any>): Promise<IAuthLoginResponse>
}
```

## 使用方法

```js
import { useLogin } from '@duxweb/dvha-core'

const { mutate, isLoading } = useLogin({
  onSuccess: (result) => {
    console.log('登录成功:', result)
  },
  onError: (result) => {
    console.error('登录失败:', result)
  }
})

// 执行登录
mutate({
  username: 'admin',
  password: '123456'
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onSuccess` | `(result: IAuthLoginResponse) => void` | ❌ | 登录成功回调函数 |
| `onError` | `(result: IAuthLoginResponse) => void` | ❌ | 登录失败回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(data: Record<string, any>) => Promise<void>` | 执行登录的异步函数 |
| `isLoading` | `Ref<boolean>` | 是否正在登录中 |

## 基本用法示例

```js
import { useLogin } from '@duxweb/dvha-core'
import { ref } from 'vue'

const form = ref({
  username: '',
  password: ''
})

const { mutate: login, isLoading } = useLogin({
  onSuccess: (result) => {
    console.log('登录成功，将自动跳转')
  },
  onError: (result) => {
    alert(result?.message || '登录失败')
  }
})

const handleLogin = () => {
  login(form.value)
}
```

## 高级用法示例

```js
// 带验证码登录
const handleLoginWithCaptcha = () => {
  login({
    username: form.value.username,
    password: form.value.password,
    captcha: form.value.captcha,
    rememberMe: form.value.remember
  })
}

// 第三方登录
const handleOAuthLogin = (provider, token) => {
  login({
    provider: provider,
    token: token
  })
}
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "登录成功",
  "redirectTo": "/admin",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1,
    "info": {
      "username": "admin",
      "email": "admin@example.com"
    },
    "permission": ["user.read", "user.write"]
  }
}
```

### 失败响应
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

## 工作流程

1. 调用 `mutate` 函数并传入登录数据
2. 设置 `isLoading` 为 `true`
3. 通过当前管理端的 `authProvider.login` 方法进行认证
4. 如果成功：
   - 调用 `onSuccess` 回调
   - 将用户数据保存到 `authStore`
   - 自动跳转到 `redirectTo` 指定的页面
5. 如果失败：
   - 调用 `onError` 回调
6. 设置 `isLoading` 为 `false`

## 注意事项

- 登录成功后会自动跳转，无需手动处理路由
- 多管理端环境下，会使用当前管理端对应的认证提供者
- 可以传递任意登录参数满足不同的认证需求
- 建议在客户端进行基本的表单验证以提升用户体验