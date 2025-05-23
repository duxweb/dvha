# useForgotPassword

`useForgotPassword` hook 用于处理忘记密码功能，通过认证提供者发送密码重置请求。

## 功能特点

- 🔐 **密码重置** - 通过认证提供者发送重置请求
- 📧 **多种方式** - 支持邮箱、手机号等重置方式
- 🔄 **自动跳转** - 处理完成后可自动跳转
- ⚡ **即时反馈** - 提供发送进度和结果状态
- 🛡️ **安全控制** - 确保重置请求的安全性
- 🏢 **多管理端** - 支持多管理端独立处理

## 接口关系

该hook调用当前管理端的 `authProvider.forgotPassword(params)` 方法发送密码重置请求。

```js
// 认证提供者接口
interface IAuthProvider {
  forgotPassword(params?: any): Promise<IAuthActionResponse>
}
```

## 使用方法

```js
import { useForgotPassword } from '@duxweb/dvha-core'

const { mutate } = useForgotPassword({
  onSuccess: (result) => {
    console.log('重置请求发送成功:', result)
  },
  onError: (result) => {
    console.error('发送失败:', result)
  }
})

// 发送重置请求
mutate({
  email: 'user@example.com'
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onSuccess` | `(result: IAuthActionResponse) => void` | ❌ | 发送成功回调函数 |
| `onError` | `(result: IAuthActionResponse) => void` | ❌ | 发送失败回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(params?: any) => Promise<void>` | 执行发送的异步函数 |

## 基本用法示例

```js
import { useForgotPassword } from '@duxweb/dvha-core'
import { ref } from 'vue'

const form = ref({
  email: '',
  type: 'email'
})

const { mutate: sendReset } = useForgotPassword({
  onSuccess: (result) => {
    console.log('重置邮件发送成功')
    alert('密码重置链接已发送到您的邮箱')
  },
  onError: (result) => {
    alert(result?.message || '发送失败')
  }
})

const handleSendReset = () => {
  sendReset(form.value)
}
```

## 高级用法示例

```js
// 多种方式重置
const resetType = ref('email') // email, phone, username

const handleMultiReset = () => {
  const payload = { type: resetType.value }

  if (resetType.value === 'email') {
    payload.email = contact.value
  } else if (resetType.value === 'phone') {
    payload.phone = contact.value
  } else {
    payload.username = contact.value
  }

  sendReset(payload)
}

// 倒计时控制
const countdown = ref(0)
let timer = null

const sendWithCooldown = () => {
  if (countdown.value > 0) return

  sendReset(form.value).then(() => {
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  })
}

// 安全验证重置
const handleSecureReset = () => {
  sendReset({
    email: form.value.email,
    security_answer: form.value.securityAnswer,
    captcha: form.value.captcha
  })
}
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "密码重置邮件已发送",
  "redirectTo": "/reset-password"
}
```

### 失败响应
```json
{
  "success": false,
  "message": "邮箱地址不存在"
}
```

## 工作流程

1. 调用 `mutate` 函数并传入重置参数
2. 通过当前管理端的 `authProvider.forgotPassword` 方法处理请求
3. 如果成功：
   - 调用 `onSuccess` 回调
   - 如果有 `redirectTo`，自动跳转到指定页面
4. 如果失败：
   - 调用 `onError` 回调

## 注意事项

- 重置成功后如果有跳转地址，框架会自动处理跳转
- 多管理端环境下，只处理当前管理端的重置请求
- 可以传递任意自定义参数来满足特定的重置需求
- 建议添加防刷控制，避免频繁发送重置请求
- 安全起见，即使用户不存在也应该返回成功，但不实际发送