# useCheck

`useCheck` hook 用于检查和验证用户认证状态，并更新用户信息。

## 功能特点

- 🔐 **认证验证** - 验证当前用户认证状态
- 🔄 **信息更新** - 更新 authStore 中的用户信息
- 🛡️ **状态同步** - 与服务器同步最新认证状态
- ⚡ **即时响应** - 快速返回验证结果
- 🚨 **失效处理** - 自动处理认证失效情况
- 🏢 **多管理端** - 支持多管理端独立验证

## 接口关系

该hook调用当前管理端的 `authProvider.check(params?)` 方法进行认证检查。

```js
// 认证提供者接口
interface IAuthProvider {
  check(params?: any, manage?: IManageHook, auth?: IUserState): Promise<IAuthCheckResponse>
}
```

## 使用方法

```js
import { useCheck } from '@duxweb/dvha-core'

const { mutate } = useCheck({
  onSuccess: (result) => {
    console.log('认证有效:', result)
  },
  onError: (result) => {
    console.error('认证无效:', result)
  }
})

// 执行认证检查
mutate()
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onSuccess` | `(result: IAuthCheckResponse) => void` | ❌ | 检查成功回调函数 |
| `onError` | `(result: IAuthCheckResponse) => void` | ❌ | 检查失败回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(params?: any) => Promise<void>` | 执行认证检查的异步函数 |

## 基本用法示例

```js
import { useCheck } from '@duxweb/dvha-core'
import { onMounted } from 'vue'

const { mutate: checkAuth } = useCheck({
  onSuccess: (result) => {
    console.log('用户认证有效')
  },
  onError: (result) => {
    if (result?.logout) {
      console.log('认证已失效，将自动跳转到登录页')
    }
  }
})

// 页面加载时检查认证状态
onMounted(() => {
  checkAuth()
})
```

## 高级用法示例

```js
// 定时检查认证状态
let checkInterval = null

const startPeriodicCheck = () => {
  checkInterval = setInterval(() => {
    checkAuth({ silent: true })
  }, 5 * 60 * 1000) // 每5分钟检查一次
}

// 强制检查（忽略缓存）
const handleForceCheck = () => {
  checkAuth({ force: true })
}

// 检查特定权限
const handleCheckPermission = (permission) => {
  checkAuth({ permission })
}

// 路由守卫中使用
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await checkAuth()
      next()
    } catch (error) {
      next(false) // 框架会自动处理跳转
    }
  } else {
    next()
  }
})
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "认证有效",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": 1,
    "info": {
      "username": "admin",
      "email": "admin@example.com",
      "last_login": "2023-12-25T10:00:00Z"
    },
    "permission": ["user.read", "user.write"]
  }
}
```

### 失败响应（需要登出）
```json
{
  "success": false,
  "message": "认证已过期",
  "logout": true,
  "redirectTo": "/login"
}
```

## 工作流程

1. 调用 `mutate` 函数（可选传入参数）
2. 通过当前管理端的 `authProvider.check` 方法进行验证
3. 如果成功：
   - 调用 `onSuccess` 回调
   - 将最新的用户数据更新到 `authStore`
4. 如果失败：
   - 调用 `onError` 回调
   - 如果 `result.logout` 为 `true`，自动跳转到登录页

## 注意事项

- 检查成功后会自动更新 authStore 中的用户信息
- 如果检查失败且 `logout` 为 `true`，框架会自动处理登出和跳转
- 多管理端环境下，只检查当前管理端的认证状态
- 建议在关键操作前进行认证检查
- 可以传递自定义参数来满足特定的检查需求
