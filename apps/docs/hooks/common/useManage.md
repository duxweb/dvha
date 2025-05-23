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

```js
// 配置接口
interface IManage {
  name: string
  title?: string
  description?: string
  copyright?: string
  routePrefix: string
  apiUrl: string
  theme?: ITheme
  authProvider?: IAuthProvider
  dataProvider?: IDataProvider
  layoutComponent?: Record<string, any>
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
  name: config.name,           // 管理端名称
  title: config.title,         // 页面标题
  description: config.description,  // 描述信息
  copyright: config.copyright,      // 版权信息
  routePrefix: config.routePrefix,  // 路由前缀
  apiUrl: config.apiUrl,           // API 基础路径
  theme: config.theme,             // 主题配置
  authProvider: config.authProvider,    // 认证提供者
  dataProvider: config.dataProvider,    // 数据提供者
  layoutComponent: config.layoutComponent  // 布局组件
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

// 生成 API 路径
const userListApi = getApiUrl('users')             // 'admin/users'
const userDetailApi = getApiUrl('users/123')       // 'admin/users/123'
const statsApi = getApiUrl('dashboard/stats')      // 'admin/dashboard/stats'
```

## 多管理端使用

```js
import { useManage } from '@duxweb/dvha-core'

// 获取不同管理端配置
const adminManage = useManage('admin')
const userManage = useManage('user')

console.log('管理端对比:', {
  admin: {
    routePrefix: adminManage.config.routePrefix,  // '/admin'
    apiUrl: adminManage.config.apiUrl             // 'admin'
  },
  user: {
    routePrefix: userManage.config.routePrefix,   // '/user'
    apiUrl: userManage.config.apiUrl              // 'user'
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

## 提供者配置

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

// 检查提供者配置
const hasAuth = !!config.authProvider
const hasData = !!config.dataProvider

console.log('提供者状态:', {
  认证提供者: hasAuth ? '已配置' : '未配置',
  数据提供者: hasData ? '已配置' : '未配置'
})

// 获取提供者实例
if (config.authProvider) {
  // 使用认证提供者
  const authResult = await config.authProvider.check()
}

if (config.dataProvider) {
  // 使用数据提供者
  const listData = await config.dataProvider.getList('users', {})
}
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
import { useManage } from '@duxweb/dvha-core'

const { config, getRoutePath, getApiUrl } = useManage()

// 生成路径
const userListRoute = getRoutePath('users')
const userListApi = getApiUrl('users')
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
- 路径生成会自动处理前缀和斜杠
- 配置信息会自动合并全局和管理端特定配置
- 支持在不同管理端之间切换和获取配置
- 错误情况下会抛出明确的错误信息