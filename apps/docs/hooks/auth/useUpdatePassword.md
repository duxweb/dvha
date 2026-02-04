# useUpdatePassword

`useUpdatePassword` hook 用于处理密码更新操作，通过认证提供者修改用户密码。

## 功能特点

- 🔐 **密码更新** - 通过认证提供者更新用户密码
- 🔄 **自动跳转** - 更新完成后可自动跳转
- 🛡️ **安全验证** - 验证当前密码或重置令牌
- ⚡ **即时反馈** - 提供更新进度和结果状态
- 🎯 **灵活配置** - 支持多种密码更新场景
- 🏢 **多管理端** - 支持多管理端独立处理

## 接口关系

该hook调用当前管理端的 `authProvider.updatePassword(params)` 方法进行密码更新。

```js
// 认证提供者接口
interface IAuthProvider {
  updatePassword(params?: any, manage?: IManageHook): Promise<IAuthActionResponse>
}
```

## 使用方法

```js
import { useUpdatePassword } from '@duxweb/dvha-core'

const { mutate } = useUpdatePassword({
  onSuccess: (result) => {
    console.log('密码更新成功:', result)
  },
  onError: (result) => {
    console.error('密码更新失败:', result)
  }
})

// 更新密码
mutate({
  currentPassword: 'oldpassword',
  newPassword: 'newpassword'
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onSuccess` | `(result: IAuthActionResponse) => void` | ❌ | 更新成功回调函数 |
| `onError` | `(result: IAuthActionResponse) => void` | ❌ | 更新失败回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(params?: any) => Promise<void>` | 执行更新的异步函数 |

## 基本用法示例

```js
import { useUpdatePassword } from '@duxweb/dvha-core'
import { ref } from 'vue'

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const { mutate: updatePassword } = useUpdatePassword({
  onSuccess: (result) => {
    console.log('密码修改成功')
    alert('密码已更新，请重新登录')
  },
  onError: (result) => {
    if (result?.errors) {
      console.error('表单验证错误:', result.errors)
    } else {
      alert(result?.message || '密码更新失败')
    }
  }
})

const handleUpdatePassword = () => {
  updatePassword(form.value)
}
```

## 高级用法示例

```js
// 通过重置令牌修改密码
const handleResetPassword = () => {
  updatePassword({
    token: route.query.token,
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword
  })
}

// 验证码方式重置
const handleCodeReset = () => {
  updatePassword({
    email: form.value.email,
    verification_code: form.value.verificationCode,
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword
  })
}

// 首次登录设置密码
const handleInitialPassword = () => {
  updatePassword({
    newPassword: form.value.newPassword,
    confirmPassword: form.value.confirmPassword,
    isInitialSetup: true
  })
}

// 管理员重置用户密码
const handleAdminReset = () => {
  updatePassword({
    user_id: form.value.userId,
    new_password: form.value.newPassword,
    force_change_next_login: true,
    admin_action: true
  })
}
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "密码更新成功",
  "redirectTo": "/login"
}
```

### 失败响应
```json
{
  "success": false,
  "message": "当前密码不正确",
  "errors": {
    "currentPassword": "当前密码验证失败",
    "newPassword": "密码强度不足"
  }
}
```

## 工作流程

1. 调用 `mutate` 函数并传入密码更新参数
2. 通过当前管理端的 `authProvider.updatePassword` 方法处理请求
3. 如果成功：
   - 调用 `onSuccess` 回调
   - 如果有 `redirectTo`，自动跳转到指定页面
4. 如果失败：
   - 调用 `onError` 回调

## 注意事项

- 更新成功后如果有跳转地址，框架会自动处理跳转
- 某些情况下密码更新后可能需要重新登录
- 多管理端环境下，只更新当前管理端的用户密码
- 可以传递任意自定义参数来满足特定的更新需求
- 建议在客户端进行密码强度验证以提升安全性
- 重要操作前建议验证用户身份
