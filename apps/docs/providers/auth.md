# 认证提供者

认证提供者是 DVHA 中负责处理用户身份验证和授权的核心组件。它提供了一个统一的接口来处理登录、登出、注册、密码重置等认证流程，支持多种认证方式和多管理端独立认证。

## 什么是认证提供者？

认证提供者是一个实现了特定接口的对象，它定义了如何处理用户的认证流程。DVHA 通过认证提供者来执行所有的认证操作，包括：

- **用户登录** (login)
- **用户登出** (logout)
- **认证检查** (check)
- **用户注册** (register)
- **忘记密码** (forgotPassword)
- **重置密码** (updatePassword)
- **错误处理** (onError)
- **权限验证** (can)

## 简单认证提供者

DVHA 内置了 `simpleAuthProvider`，适用于开发和测试：

```typescript
import { simpleAuthProvider } from '@duxweb/dvha-core'

const config: IConfig = {
  authProvider: simpleAuthProvider(),
  // ... 其他配置
}

// 或者使用自定义配置
const authProvider = simpleAuthProvider({
  apiPath: {
    login: '/auth/login', // 自定义登录接口路径
    check: '/auth/check', // 自定义认证检查路径
    logout: '/auth/logout', // 自定义登出接口路径
    register: '/auth/register', // 自定义注册接口路径
    forgotPassword: '/auth/forgot', // 自定义忘记密码路径
    updatePassword: '/auth/reset' // 自定义重置密码路径
  },
  routePath: {
    login: '/login', // 登录页面路径
    index: '/dashboard' // 登录成功后跳转路径
  },
  dataProviderName: 'default' // 指定使用的数据提供者名称
})
```

::: tip
`simpleAuthProvider` 是一个基于标准认证流程的简单实现，支持基本的登录、登出和认证检查功能，适合快速开始和原型开发。在开发环境中，它会接受任意用户名和密码的登录。
:::

## 认证提供者接口

```typescript
interface IAuthProvider {
  // 用户登录
  login: (params: any, manage: IManageHook) => Promise<IAuthLoginResponse>
  // 认证检查
  check: (params?: any, manage?: IManageHook) => Promise<IAuthCheckResponse>
  // 用户登出
  logout: (params?: any, manage?: IManageHook) => Promise<IAuthLogoutResponse>
  // 用户注册（可选）
  register?: (params: any, manage?: IManageHook) => Promise<IAuthLoginResponse>
  // 忘记密码（可选）
  forgotPassword?: (params: any, manage?: IManageHook) => Promise<IAuthActionResponse>
  // 重置密码（可选）
  updatePassword?: (params: any, manage?: IManageHook) => Promise<IAuthActionResponse>
  // 权限检查（可选）
  can?: (name: string, params?: any, manage?: IManageHook, auth?: IUserState) => boolean
  // 错误处理
  onError: (error?: IDataProviderError) => Promise<IAuthErrorResponse>
}
```

::: tip 接口变更
在最新版本中，`register`、`forgotPassword` 和 `updatePassword` 方法是可选的。如果不需要这些功能，可以不实现这些方法。
:::

## 参数说明

### 通用参数

每个认证提供者方法都接收以下参数：

- **params**: 请求参数对象，包含具体的操作数据
- **manage**: 当前管理端实例，提供 API URL 构建等功能

### 登录参数

```typescript
// 登录参数示例
interface LoginParams {
  username: string // 用户名
  password: string // 密码
  captcha?: string // 验证码（可选）
  rememberMe?: boolean // 记住登录状态（可选）
  [key: string]: any // 其他自定义字段
}
```

### 注册参数

```typescript
// 注册参数示例
interface RegisterParams {
  username: string // 用户名
  email: string // 邮箱
  password: string // 密码
  confirmPassword: string // 确认密码
  [key: string]: any // 其他自定义字段
}
```

### 密码重置参数

```typescript
// 忘记密码参数示例
interface ForgotPasswordParams {
  email: string // 邮箱地址
}

// 重置密码参数示例
interface UpdatePasswordParams {
  token: string // 重置令牌
  password: string // 新密码
  confirmPassword: string // 确认新密码
}
```

## 返回格式

### 基础响应格式

```typescript
interface IAuthActionResponse {
  success: boolean // 操作是否成功
  message?: string // 响应消息
  redirectTo?: string // 重定向地址
  [key: string]: unknown // 其他自定义字段
}
```

### 登录响应格式

```typescript
interface IAuthLoginResponse extends IAuthActionResponse {
  data?: IUserState // 用户状态数据
}
```

### 检查响应格式

```typescript
interface IAuthCheckResponse extends IAuthActionResponse {
  data?: IUserState // 用户状态数据
  logout?: boolean // 是否需要登出
}
```

### 登出响应格式

```typescript
interface IAuthLogoutResponse extends IAuthActionResponse {
  logout?: boolean // 是否需要清除状态
}
```

### 错误响应格式

```typescript
interface IAuthErrorResponse {
  logout?: boolean // 是否需要登出
  redirectTo?: string // 重定向地址
  error?: IDataProviderError // 统一错误信息
}
```

### 用户状态格式

```typescript
interface IUserState {
  token?: string // 认证令牌
  permission?: string[] | Record<string, any> // 用户权限列表或权限对象
  info?: Record<string, any> // 用户信息
  [key: string]: any // 其他自定义字段
}
```

## 响应示例

### 登录成功响应

```json
{
  "success": true,
  "message": "登录成功",
  "redirectTo": "/admin",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "permission": ["user.read", "user.write"],
    "info": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### 登录失败响应

```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

### 认证检查成功响应

```json
{
  "success": true,
  "message": "认证有效",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "info": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 认证检查失败响应

```json
{
  "success": false,
  "message": "认证已过期",
  "logout": true,
  "redirectTo": "/login"
}
```

### 登出响应

```json
{
  "success": true,
  "message": "登出成功",
  "redirectTo": "/login",
  "logout": true
}
```

## 配置认证提供者

### 基本配置

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleAuthProvider } from '@duxweb/dvha-core'

const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      // ... 其他配置
    }
  ],
  authProvider: simpleAuthProvider(), // 使用简单认证提供者
}
```

### 自定义认证提供者

```typescript
import type { IAuthProvider } from '@duxweb/dvha-core'

const customAuthProvider: IAuthProvider = {
  login: async (params, manage) => {
    // 您的登录逻辑
    // 使用 manage.getApiUrl('/login') 构建登录 URL
    return {
      success: true,
      message: '登录成功',
      redirectTo: '/admin',
      data: {
        token: 'your-token',
        info: { /* 用户信息 */ }
      }
    }
  },

  check: async (params, manage) => {
    // 您的认证检查逻辑
    return {
      success: true,
      data: { /* 用户状态 */ }
    }
  },

  logout: async (params, manage) => {
    // 您的登出逻辑
    return {
      success: true,
      redirectTo: '/login',
      logout: true
    }
  },

  // 可选：用户注册功能
  register: async (params, manage) => {
    // 您的注册逻辑
    return {
      success: true,
      message: '注册成功',
      redirectTo: '/admin',
      data: {
        token: 'new-user-token',
        info: { /* 新用户信息 */ }
      }
    }
  },

  // 可选：忘记密码功能
  forgotPassword: async (params, manage) => {
    // 您的忘记密码逻辑
    return {
      success: true,
      message: '重置邮件已发送'
    }
  },

  // 可选：重置密码功能
  updatePassword: async (params, manage) => {
    // 您的重置密码逻辑
    return {
      success: true,
      message: '密码重置成功',
      redirectTo: '/login'
    }
  },

  // 可选：权限检查功能
  can: (name, params, manage, auth) => {
    // 您的权限检查逻辑
    if (!auth?.permission) {
      return false
    }

    // 数组形式的权限检查
    if (Array.isArray(auth.permission)) {
      return auth.permission.includes(name)
    }

    // 对象形式的权限检查
    if (typeof auth.permission === 'object') {
      return auth.permission[name] === true
    }

    return false
  },

  onError: async (error) => {
    // 您的错误处理逻辑
    if (error?.status === 401) {
      return {
        logout: true,
        redirectTo: '/login',
        error
      }
    }
    return { logout: false, error }
  }
}

const config: IConfig = {
  authProvider: customAuthProvider,
  // ... 其他配置
}
```

### 最小化认证提供者

如果只需要基本的登录、登出和认证检查功能：

```typescript
const minimalAuthProvider: IAuthProvider = {
  login: async (params, manage) => {
    // 实现登录逻辑
    return {
      success: true,
      data: { token: 'user-token' }
    }
  },

  check: async (params, manage) => {
    // 实现认证检查逻辑
    return {
      success: true,
      data: { token: 'user-token' }
    }
  },

  logout: async (params, manage) => {
    // 实现登出逻辑
    return {
      success: true,
      logout: true
    }
  },

  onError: async (error) => {
    // 实现错误处理逻辑
    return {
      logout: error?.status === 401,
      error
    }
  }

  // 注意：register、forgotPassword、updatePassword 和 can 方法是可选的
  // 如果不需要这些功能，可以不实现
}
```

### 多管理端认证提供者

不同的管理端可以使用不同的认证提供者：

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',
      authProvider: simpleAuthProvider({
        apiPath: {
          login: '/admin/login',
          check: '/admin/check'
        },
        routePath: {
          login: '/admin/login',
          index: '/admin'
        }
      }), // 管理端专用
      // ... 其他配置
    },
    {
      name: 'merchant',
      authProvider: simpleAuthProvider({
        apiPath: {
          login: '/merchant/login',
          check: '/merchant/check'
        },
        routePath: {
          login: '/merchant/login',
          index: '/merchant'
        }
      }), // 商户端专用
      // ... 其他配置
    }
  ],
  authProvider: simpleAuthProvider(), // 全局后备
}
```

## URL 构建

在认证提供者中，使用 `manage.getApiUrl()` 方法构建完整的 API URL：

```typescript
// 登录接口
const loginUrl = manage.getApiUrl('/login')
// 结果: https://api.example.com/admin/login

// 认证检查接口
const checkUrl = manage.getApiUrl('/check')
// 结果: https://api.example.com/admin/check
```

## 路由守卫

DVHA 自动为需要认证的路由添加守卫，通过 `meta.authorization` 控制：

```typescript
const routes = [
  {
    name: 'admin.login',
    path: 'login',
    component: () => import('./pages/login.vue'),
    meta: {
      authorization: false, // 不需要认证
    }
  },
  {
    name: 'admin.dashboard',
    path: 'dashboard',
    component: () => import('./pages/dashboard.vue'),
    // meta.authorization 默认为 true，需要认证
  }
]
```

## 错误处理

`onError` 方法用于处理全局的认证错误：

```typescript
onError: async (error?: IDataProviderError) => {
  // 401 未授权 - 需要重新登录
  if (error?.status === 401) {
    return {
      logout: true,
      redirectTo: '/login',
      error
    }
  }

  // 403 权限不足 - 可选择是否登出
  if (error?.status === 403) {
    return {
      logout: false, // 不登出，显示权限不足提示
      error
    }
  }

  // 其他错误
  return {
    logout: false,
    error
  }
}
```

## 安全建议

### Token 管理

- 建议将 token 存储在 httpOnly cookie 中以提高安全性
- 实现 token 自动刷新机制
- 设置合理的 token 过期时间

### 认证检查

- 在应用启动时执行认证检查
- 定期检查 token 有效性
- 自动判断过期时间并返回新的 Token
- 在 API 请求失败时自动处理认证错误

## 权限检查

DVHA 支持基于权限的访问控制，通过认证提供者的 `can` 方法实现权限检查。

### 权限检查方法

```typescript
can?: (name: string, params?: any, manage?: IManageHook, auth?: IUserState) => boolean
```

**参数说明：**

- `name`: 权限名称或路由名称
- `params`: 可选的权限参数
- `manage`: 当前管理端实例
- `auth`: 当前用户认证信息

### 权限数据格式

权限数据可以是数组或对象格式：

```json
// 数组格式 - 简单权限列表
{
  "permission": ["user.read", "user.write", "post.manage"]
}

// 对象格式 - 复杂权限配置
{
  "permission": {
    "user.read": true,
    "user.write": true,
    "user.delete": false,
    "post.manage": true
  }
}
```

### 权限检查实现示例

```typescript
// 简单权限检查
can: (name, params, manage, auth) => {
  if (!auth?.permission) {
    return false
  }

  // 数组形式权限检查
  if (Array.isArray(auth.permission)) {
    return auth.permission.includes(name)
  }

  // 对象形式权限检查
  if (typeof auth.permission === 'object') {
    return auth.permission[name] === true
  }

  return false
}

// 复杂权限检查（支持通配符）
can: (name, params, manage, auth) => {
  if (!auth?.permission || !Array.isArray(auth.permission)) {
    return false
  }

  // 检查完全匹配
  if (auth.permission.includes(name)) {
    return true
  }

  // 检查通配符权限
  return auth.permission.some((permission) => {
    if (permission.endsWith('.*')) {
      const prefix = permission.slice(0, -2)
      return name.startsWith(`${prefix}.`)
    }
    return false
  })
}

// 基于角色的权限检查
can: (name, params, manage, auth) => {
  const userRole = auth?.info?.role
  const rolePermissions = {
    admin: ['*'], // 管理员拥有所有权限
    editor: ['post.*', 'user.read'],
    viewer: ['*.read']
  }

  const permissions = rolePermissions[userRole] || []

  return permissions.some((permission) => {
    if (permission === '*')
      return true
    if (permission.endsWith('.*')) {
      return name.startsWith(`${permission.slice(0, -2)}.`)
    }
    if (permission.endsWith('.read')) {
      return name.endsWith('.read')
    }
    return permission === name
  })
}
```

### 路由权限控制

路由可以通过 `meta.can` 字段控制访问权限，不设置默认为 `true`：

```typescript
const routes = [
  {
    name: 'admin.users',
    path: 'users',
    component: () => import('./pages/users.vue'),
    meta: {
      can: true, // 使用路由名称进行权限检查
      // 或者指定具体权限名称
      // can: 'user.manage'
    }
  }
]
```

## 下一步

了解如何在组件中使用认证功能：

- 🔑 [用户登录 (useLogin)](/hooks/auth/useLogin) - 实现登录功能
- 🚪 [用户登出 (useLogout)](/hooks/auth/useLogout) - 实现登出功能
- ✅ [认证检查 (useCheck)](/hooks/auth/useCheck) - 检查认证状态
- 📝 [用户注册 (useRegister)](/hooks/auth/useRegister) - 实现注册功能
- 🔒 [获取认证信息 (useGetAuth)](/hooks/auth/useGetAuth) - 获取当前用户信息
- 🛡️ [权限检查 (useCan)](/hooks/auth/useCan) - 检查用户权限
