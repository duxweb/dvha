# useIsLogin

`useIsLogin` hook 用于快速判断用户登录状态，从 authStore 中读取登录状态。

## 功能特点

- ✅ **快速判断** - 简单直接的登录状态检查
- ⚡ **响应式** - 登录状态变化自动更新
- 🎯 **轻量级** - 专注于登录状态判断
- 🔄 **实时同步** - 与认证系统实时同步
- 🏢 **多管理端** - 支持检查指定管理端的登录状态
- 📱 **易于使用** - 简洁的 API 设计

## 接口关系

该hook直接从 `authStore` 中读取登录状态，基于用户的 `token` 字段判断是否已登录。

```js
// 登录状态判断逻辑
const isLogin = computed(() => !!authStore.getAuth(manageName)?.token)
```

## 使用方法

```js
import { useIsLogin } from '@duxweb/dvha-core'

const isLogin = useIsLogin()

// 检查登录状态
if (isLogin.value) {
  console.log('用户已登录')
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
| 返回值 | `Ref<boolean>` | 登录状态（true=已登录，false=未登录） |

## 基本用法示例

```js
import { useIsLogin } from '@duxweb/dvha-core'
import { computed } from 'vue'

const isLogin = useIsLogin()

// 基于登录状态的计算属性
const welcomeMessage = computed(() => {
  return isLogin.value ? '欢迎回来！' : '请先登录'
})

const showLoginButton = computed(() => {
  return !isLogin.value
})

const showUserMenu = computed(() => {
  return isLogin.value
})
```

## 高级用法示例

```js
// 路由守卫
const router = useRouter()

watch(isLogin, (loggedIn) => {
  if (!loggedIn) {
    router.push('/login')
  }
}, { immediate: true })

// 页面访问控制
onMounted(() => {
  if (!isLogin.value) {
    router.push('/login')
  }
})

// 多管理端登录状态
const isAdminLogin = useIsLogin('admin')
const isUserLogin = useIsLogin('user')

const anyUserLoggedIn = computed(() => {
  return isAdminLogin.value || isUserLogin.value
})

// 状态变化监听
watch(isLogin, (newStatus, oldStatus) => {
  if (newStatus && !oldStatus) {
    console.log('用户已登录')
    onUserLogin()
  } else if (!newStatus && oldStatus) {
    console.log('用户已登出')
    onUserLogout()
  }
})

// API调用控制
const makeAuthenticatedRequest = async (url, options) => {
  if (!isLogin.value) {
    throw new Error('用户未登录，无法执行认证请求')
  }

  return fetch(url, options)
}
```

## 注意事项

- 这是一个同步操作，直接从本地状态读取，不会发起网络请求
- 返回的是响应式引用，状态变化会自动更新视图
- 多管理端环境下，需要指定管理端名称来检查对应的登录状态
- 只检查是否有有效的认证令牌，不验证令牌的有效性
- 建议配合 `useCheck` hook 定期验证认证状态的有效性
- 状态变化是实时的，当用户登录或登出时会立即反映