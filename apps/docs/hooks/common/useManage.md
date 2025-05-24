# useManage

`useManage` hook 用于获取当前管理端的配置信息和相关工具方法。

## 功能特点

- 🏢 **管理端配置** - 获取当前管理端的完整配置信息
- 🔗 **路径生成** - 自动生成管理端路由路径和 API 路径
- 🎯 **多管理端支持** - 支持多个独立管理端配置
- 🔧 **配置合并** - 自动合并全局配置和管理端特定配置
- 📱 **响应式** - 配置信息响应式更新
- 🛡️ **错误处理** - 自动处理配置错误和异常情况

## 接口关系

该hook不直接调用外部接口，而是从全局配置中获取管理端配置信息。

```typescript
// 管理端配置接口
interface IManage {
  name: string                                              // 管理端唯一标识
  title: string                                             // 管理端标题
  copyright?: string                                        // 版权信息
  description?: string                                      // 描述信息

  register?: boolean                                        // 是否支持注册
  forgotPassword?: boolean                                  // 是否支持忘记密码
  updatePassword?: boolean                                  // 是否支持修改密码

  apiRoutePath?: string                                     // 远程菜单 API 路径

  authProvider?: IAuthProvider                              // 认证提供者
  dataProvider?: IDataProvider | Record<string, IDataProvider>  // 数据提供者

  routePrefix?: string                                      // 路由前缀
  routes?: RouteRecordRaw[]                                 // 路由配置
  menus?: IMenu[]                                          // 菜单配置

  components?: IConfigComponent                             // 组件配置
  theme?: IConfigTheme                                     // 主题配置

  [key: string]: any                                       // 扩展字段
}

// useManage 返回接口
interface IManageHook {
  config: IManage
  getRoutePath: (path?: string) => string
  getApiUrl: (path?: string, dataProviderName?: string) => string
}
```

## 使用方法

```js
import { useManage } from '@duxweb/dvha-core'

// 获取当前管理端配置
const { config, getRoutePath, getApiUrl } = useManage()

// 或者指定管理端名称
const { config } = useManage('admin')
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | `string` | ❌ | 管理端名称，不传则使用当前管理端 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `config` | `IManage` | 管理端配置对象 |
| `getRoutePath` | `Function` | 生成管理端路由路径的方法 |
| `getApiUrl` | `Function` | 生成管理端 API 路径的方法 |

## 管理端配置

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

console.log('管理端信息:', {
  name: config.name,                    // 管理端名称
  title: config.title,                  // 页面标题
  description: config.description,      // 描述信息
  copyright: config.copyright,          // 版权信息
  routePrefix: config.routePrefix,      // 路由前缀

  // 功能开关
  register: config.register,            // 是否支持注册
  forgotPassword: config.forgotPassword, // 是否支持忘记密码
  updatePassword: config.updatePassword, // 是否支持修改密码

  // 远程菜单
  apiRoutePath: config.apiRoutePath,    // 远程菜单 API 路径

  // 提供者
  authProvider: config.authProvider,    // 认证提供者
  dataProvider: config.dataProvider,    // 数据提供者

  // 其他配置
  theme: config.theme,                  // 主题配置
  components: config.components,        // 组件配置
  routes: config.routes,                // 路由配置
  menus: config.menus                   // 菜单配置
})
```

## 路径生成示例

```js
import { useManage } from '@duxweb/dvha-core'

const { getRoutePath, getApiUrl } = useManage()

// 生成路由路径
const userListRoute = getRoutePath('users')        // '/admin/users'
const userDetailRoute = getRoutePath('users/123')  // '/admin/users/123'
const dashboardRoute = getRoutePath()              // '/admin/'

// 生成 API 地址 - 使用默认数据提供者
const userListApi = getApiUrl('users')             // 调用 dataProvider.apiUrl('users')
const userDetailApi = getApiUrl('users/123')       // 调用 dataProvider.apiUrl('users/123')
const statsApi = getApiUrl('dashboard/stats')      // 调用 dataProvider.apiUrl('dashboard/stats')

// 生成 API 地址 - 使用指定数据提供者
const analyticsApi = getApiUrl('stats', 'analytics')     // 调用 analytics 数据提供者
const paymentApi = getApiUrl('transactions', 'payment')  // 调用 payment 数据提供者
```

## 多管理端使用

```js
import { useManage } from '@duxweb/dvha-core'

// 获取不同管理端配置
const adminManage = useManage('admin')
const userManage = useManage('user')

console.log('管理端对比:', {
  admin: {
    name: adminManage.config.name,
    title: adminManage.config.title,
    routePrefix: adminManage.config.routePrefix,  // '/admin'
  },
  user: {
    name: userManage.config.name,
    title: userManage.config.title,
    routePrefix: userManage.config.routePrefix,   // '/user'
  }
})
```

## 主题配置获取

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

// 获取主题配置
const themeConfig = {
  logo: config.theme?.logo,
  darkLogo: config.theme?.darkLogo,
  banner: config.theme?.banner,
  darkBanner: config.theme?.darkBanner,
  primaryColor: config.theme?.primaryColor,
  // 其他主题配置...
}
```

## 数据提供者配置

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

// 检查数据提供者类型
const dataProvider = config.dataProvider

if (typeof dataProvider === 'object' && !Array.isArray(dataProvider)) {
  // 多数据提供者
  console.log('可用的数据提供者:', Object.keys(dataProvider))

  // 检查特定提供者是否存在
  const hasAnalytics = 'analytics' in dataProvider
  const hasPayment = 'payment' in dataProvider

} else {
  // 单一数据提供者
  console.log('使用单一数据提供者')
}
```

## 认证提供者配置

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

// 检查认证提供者配置
const hasAuth = !!config.authProvider

console.log('认证提供者状态:', hasAuth ? '已配置' : '未配置')

if (config.authProvider) {
  // 使用认证提供者方法
  // 注意：实际使用时应该通过相应的 hooks 来调用
  console.log('认证提供者可用方法:', {
    login: typeof config.authProvider.login,
    check: typeof config.authProvider.check,
    logout: typeof config.authProvider.logout,
    register: typeof config.authProvider.register,
    forgotPassword: typeof config.authProvider.forgotPassword,
    updatePassword: typeof config.authProvider.updatePassword
  })
}
```

## 配置示例

```js
import { createDux, simpleDataProvider, simpleAuthProvider } from '@duxweb/dvha-core'

// 创建数据提供者 - 注意新的语法
const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com'
})

const app = createDux({
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      description: '企业管理系统后台',
      copyright: '© 2024 Company',
      routePrefix: '/admin',

      // 功能开关
      register: false,
      forgotPassword: true,
      updatePassword: true,

      // 远程菜单
      apiRoutePath: '/api/admin/menus',

      // 提供者配置
      authProvider: simpleAuthProvider(),
      dataProvider,

      // 其他配置
      theme: {
        logo: '/logo.png',
        primaryColor: '#1890ff'
      }
    }
  ]
})
```

## 完整示例

```vue
<template>
  <div class="manage-info">
    <h1>{{ config.title }}</h1>
    <p>{{ config.description }}</p>

    <div class="paths">
      <p>用户列表路由: {{ userListRoute }}</p>
      <p>用户列表API: {{ userListApi }}</p>
      <p v-if="analyticsApi">分析API: {{ analyticsApi }}</p>
    </div>

    <div class="features">
      <p>支持注册: {{ config.register ? '是' : '否' }}</p>
      <p>忘记密码: {{ config.forgotPassword ? '是' : '否' }}</p>
      <p>修改密码: {{ config.updatePassword ? '是' : '否' }}</p>
    </div>

    <div class="theme" v-if="config.theme">
      <img :src="config.theme.logo" alt="Logo" />
    </div>

    <div class="copyright">
      {{ config.copyright }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useManage } from '@duxweb/dvha-core'

const { config, getRoutePath, getApiUrl } = useManage()

// 生成路径
const userListRoute = getRoutePath('users')
const userListApi = getApiUrl('users')

// 多数据提供者示例
const analyticsApi = computed(() => {
  const dataProvider = config.dataProvider
  if (typeof dataProvider === 'object' && 'analytics' in dataProvider) {
    return getApiUrl('stats', 'analytics')
  }
  return null
})
</script>
```

## 工作流程

1. **获取配置**: 从全局配置中查找指定管理端配置
2. **配置合并**: 将全局配置与管理端特定配置合并
3. **路径处理**: 处理路由前缀和 API 路径
4. **提供者配置**: 设置认证和数据提供者
5. **返回工具**: 提供配置对象和路径生成方法

## 注意事项

- 管理端名称必须在全局配置中已定义
- `getRoutePath` 会自动处理路由前缀和斜杠
- `getApiUrl` 通过调用数据提供者的 `apiUrl` 方法来构建完整的 API 地址
- 配置信息会自动合并全局和管理端特定配置
- 支持单一数据提供者或多数据提供者配置
- 支持在不同管理端之间切换和获取配置
- `apiRoutePath` 用于配置远程菜单的 API 路径
- 错误情况下会抛出明确的错误信息