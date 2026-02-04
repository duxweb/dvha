# useLogout

`useLogout` hook 用于处理用户登出操作，通过认证提供者清除用户会话。

## 功能特点

- 🚪 **安全登出** - 通过认证提供者安全清除会话
- 🔄 **自动跳转** - 登出后自动跳转到指定页面
- 🗑️ **状态清理** - 自动清除 authStore 中的用户状态
- ⚡ **即时生效** - 立即更新认证状态
- 🏢 **多管理端** - 支持多管理端独立登出
- 🛡️ **错误处理** - 处理登出失败情况

## 接口关系

该hook调用当前管理端的 `authProvider.logout(params?)` 方法进行登出操作。

```js
// 认证提供者接口
interface IAuthProvider {
  logout(params?: any, manage?: IManageHook): Promise<IAuthLogoutResponse>
}
```

## 使用方法

```js
import { useLogout } from '@duxweb/dvha-core'

const { mutate } = useLogout({
  onSuccess: (result) => {
    console.log('登出成功:', result)
  },
  onError: (result) => {
    console.error('登出失败:', result)
  }
})

// 执行登出
mutate()
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onSuccess` | `(result: IAuthLogoutResponse) => void` | ❌ | 登出成功回调函数 |
| `onError` | `(result: IAuthLogoutResponse) => void` | ❌ | 登出失败回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(params?: any) => Promise<void>` | 执行登出的异步函数 |

## 基本用法示例

```js
import { useLogout } from '@duxweb/dvha-core'

const { mutate: logout } = useLogout({
  onSuccess: (result) => {
    console.log('用户已安全登出')
  },
  onError: (result) => {
    console.error('登出失败')
  }
})

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    logout()
  }
}
```

## 高级用法示例

```js
// 携带登出原因
const handleManualLogout = () => {
  logout({ reason: 'manual' })
}

// 会话过期自动登出
const handleSessionExpired = () => {
  logout({ reason: 'session_expired' })
}

// 自动登出定时器
let inactivityTimer = null

const resetInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => {
    logout({ reason: 'inactivity' })
  }, 30 * 60 * 1000) // 30分钟无操作自动登出
}
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "登出成功",
  "redirectTo": "/login",
  "logout": true
}
```

### 失败响应
```json
{
  "success": false,
  "message": "登出失败",
  "logout": false
}
```

## 工作流程

1. 调用 `mutate` 函数（可选传入参数）
2. 通过当前管理端的 `authProvider.logout` 方法进行登出
3. 如果成功：
   - 调用 `onSuccess` 回调
   - 清除当前管理端在 `authStore` 中的用户状态
   - 自动跳转到 `redirectTo` 指定的页面（默认 `/login`）
4. 如果失败：
   - 调用 `onError` 回调

## 注意事项

- 登出后会自动跳转，无需手动处理路由
- 多管理端环境下，只会清除当前管理端的认证状态
- 登出操作是异步的，但通常很快完成
