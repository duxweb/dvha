# useError

`useError` hook 用于处理认证相关的错误，通过认证提供者统一处理错误情况。

## 功能特点

- 🚨 **错误处理** - 通过认证提供者统一处理错误
- 🔄 **自动跳转** - 错误处理后可自动跳转
- 📱 **灵活配置** - 支持自定义错误处理逻辑
- ⚡ **即时响应** - 快速响应错误状态
- 🛡️ **安全重定向** - 错误时安全跳转到指定页面
- 🏢 **多管理端** - 支持多管理端独立错误处理

## 接口关系

该hook调用当前管理端的 `authProvider.onError(error)` 方法进行错误处理。

```js
// 认证提供者接口
interface IAuthProvider {
  onError(error: any): Promise<IAuthErrorResponse | void>
}
```

## 使用方法

```js
import { useError } from '@duxweb/dvha-core'

const { mutate: handleError } = useError((result) => {
  console.log('错误处理结果:', result)
})

// 处理错误
handleError(new Error('认证失败'))
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `onCallback` | `(result?: IAuthErrorResponse) => void` | ❌ | 错误处理完成回调函数 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `(error: any) => Promise<void>` | 执行错误处理的异步函数 |

## 基本用法示例

```js
import { useError } from '@duxweb/dvha-core'

const { mutate: handleError } = useError((result) => {
  if (result?.logout) {
    console.log('错误需要登出用户，框架会自动处理')
  }

  if (result?.error) {
    console.error('错误详情:', result.error)
  }
})

const handleAuthError = (error) => {
  handleError(error)
}
```

## 高级用法示例

```js
// HTTP拦截器中使用
axios.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status

    if (status === 401 || status === 403) {
      handleError(error)
    }

    return Promise.reject(error)
  }
)

// 路由守卫中使用
router.beforeEach(async (to, from, next) => {
  try {
    await checkAuth()
    next()
  } catch (error) {
    await handleError(error)
    next(false) // 框架会自动处理跳转
  }
})

// 全局错误捕获
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason

  if (error?.response?.status === 401 || error?.response?.status === 403) {
    handleError(error)
    event.preventDefault()
  }
})

// 自定义错误类型处理
const handleBusinessError = (errorType, errorData) => {
  const error = new Error(`业务错误: ${errorType}`)
  error.type = errorType
  error.data = errorData
  error.response = {
    status: errorType === 'AUTH_EXPIRED' ? 401 : 400,
    data: errorData
  }

  handleError(error)
}
```

## 响应格式

### 需要登出的错误响应
```json
{
  "logout": true,
  "redirectTo": "/login",
  "error": {
    "message": "认证已过期",
    "code": "AUTH_EXPIRED"
  }
}
```

### 不需要登出的错误响应
```json
{
  "logout": false,
  "error": {
    "message": "网络连接错误",
    "code": "NETWORK_ERROR"
  }
}
```

## 工作流程

1. 调用 `mutate` 函数并传入错误对象
2. 通过当前管理端的 `authProvider.onError` 方法处理错误
3. 根据处理结果：
   - 如果 `logout` 为 `true`，自动跳转到指定页面
   - 调用 `onCallback` 回调函数传递处理结果

## 注意事项

- 错误处理后如果需要登出，框架会自动处理状态清除和跳转
- 多管理端环境下，只影响当前管理端的认证状态
- 可以根据错误类型进行不同的处理逻辑
- 建议在生产环境中集成错误监控服务
- 网络错误等非认证错误通常不需要通过此hook处理
