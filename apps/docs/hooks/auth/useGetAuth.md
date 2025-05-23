# useGetAuth

`useGetAuth` hook 用于获取当前用户的认证信息，从 authStore 中读取用户状态。

## 功能特点

- 👤 **用户信息** - 获取当前登录用户的详细信息
- 🔐 **认证状态** - 实时获取认证状态数据
- 🎯 **权限信息** - 获取用户权限和相关数据
- 📱 **响应式** - 认证状态变化自动响应
- 🏢 **多管理端** - 支持获取指定管理端的认证信息
- ⚡ **高性能** - 直接从本地状态读取，无需网络请求

## 接口关系

该hook直接从 `authStore` 中读取认证数据，不调用网络接口。数据结构由认证提供者的登录和检查方法更新。

```js
// authStore 中的用户状态结构
interface IUserState {
  token: string
  id: number
  info: Record<string, any>
  permission: any
}
```

## 使用方法

```js
import { useGetAuth } from '@duxweb/dvha-core'

const userAuth = useGetAuth()

// 获取用户信息
if (userAuth.value?.token) {
  console.log('用户已登录:', userAuth.value)
} else {
  console.log('用户未登录')
}
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `manageName` | `string` | ❌ | 管理端名称，不传则使用当前管理端 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| 返回值 | `Ref<IUserState>` | 用户认证状态的响应式引用 |

### IUserState 类型说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `token` | `string` | 认证令牌 |
| `id` | `number` | 用户ID |
| `info` | `Record<string, any>` | 用户详细信息 |
| `permission` | `any` | 用户权限信息 |

## 基本用法示例

```js
import { useGetAuth } from '@duxweb/dvha-core'
import { computed } from 'vue'

const userAuth = useGetAuth()

// 获取用户基本信息
const currentUser = computed(() => {
  return userAuth.value?.info || null
})

const isAuthenticated = computed(() => {
  return !!userAuth.value?.token
})

const displayName = computed(() => {
  const info = userAuth.value?.info
  return info?.name || info?.username || '访客'
})
```

## 高级用法示例

```js
// 权限检查
const hasPermission = (permission) => {
  const permissions = userAuth.value?.permission

  if (Array.isArray(permissions)) {
    return permissions.includes(permission)
  }

  if (typeof permissions === 'object' && permissions !== null) {
    return permissions[permission] === true
  }

  return false
}

// 多管理端使用
const adminAuth = useGetAuth('admin')
const userAuth = useGetAuth('user')

const currentManageAuth = computed(() => {
  const currentManage = getCurrentManageName()
  return useGetAuth(currentManage).value
})

// 状态监听
watch(userAuth, (newAuth, oldAuth) => {
  if (!newAuth?.token && oldAuth?.token) {
    console.log('用户已登出')
    clearUserData()
  } else if (newAuth?.token && !oldAuth?.token) {
    console.log('用户已登录:', newAuth.info)
    initializeUserData()
  }
}, { deep: true })

// 用户偏好设置
const userPreferences = computed(() => {
  return userAuth.value?.info?.preferences || {}
})

const theme = computed(() => {
  return userPreferences.value.theme || 'light'
})
```

## 响应格式

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "info": {
    "username": "admin",
    "name": "管理员",
    "email": "admin@example.com",
    "avatar": "/avatars/admin.jpg",
    "role": "admin",
    "status": "active",
    "last_login_at": "2023-12-25T10:30:00Z",
    "created_at": "2023-01-01T00:00:00Z",
    "preferences": {
      "theme": "dark",
      "language": "zh"
    }
  },
  "permission": ["user.manage", "post.manage", "setting.manage"]
}
```

## 注意事项

- 这是一个同步操作，直接从本地状态读取，不会发起网络请求
- 返回的是响应式引用，状态变化会自动更新视图
- 多管理端环境下，需要指定管理端名称来获取对应的认证信息
- 如果用户未登录，返回的对象可能为空或只包含部分字段
- 权限信息的格式取决于后端实现，可能是数组或对象
- 建议在使用前先检查 token 字段来确认用户是否已登录