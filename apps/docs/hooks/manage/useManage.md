# useManage

`useManage` hook 用于获取当前管理端的配置信息和相关工具方法。

## 功能特点

- 🏢 **管理端配置** - 获取当前管理端的完整配置信息
- 🔗 **路径生成** - 自动生成管理端路由路径和 API 路径
- 📍 **当前路径** - 获取当前页面相对于管理端的路径
- 🎯 **多管理端支持** - 支持多个独立管理端配置
- 🔧 **配置合并** - 自动合并全局配置和管理端特定配置
- 📱 **响应式** - 配置信息响应式更新
- 🛡️ **错误处理** - 自动处理配置错误和异常情况

## 接口关系

该hook不直接调用外部接口，而是从全局配置中获取管理端配置信息。

```typescript
// useManage 返回接口
interface IManageHook {
  config: IManage // 管理端配置
  getRoutePath: (path?: string) => string // 生成路由路径
  getApiUrl: (path?: string, dataProviderName?: string) => string // 生成API路径
  getPath: () => string // 获取当前相对路径
}

// 管理端配置接口
interface IManage {
  name: string // 管理端唯一标识
  title: string // 管理端标题
  copyright?: string // 版权信息
  description?: string // 描述信息

  register?: boolean // 是否支持注册
  forgotPassword?: boolean // 是否支持忘记密码
  updatePassword?: boolean // 是否支持修改密码

  apiRoutePath?: string // 远程菜单 API 路径
  apiBasePath?: string // API 基础路径

  authProvider?: IAuthProvider // 认证提供者
  dataProvider?: IDataProvider | Record<string, IDataProvider> // 数据提供者
  i18nProvider?: I18nProvider // 国际化提供者

  routePrefix?: string // 路由前缀
  routes?: RouteRecordRaw[] // 路由配置
  menus?: IMenu[] // 菜单配置

  components?: IConfigComponent // 组件配置
  theme?: IConfigTheme // 主题配置
  remote?: {
    packages?: Options
    apiMethod?: string
    apiRoutePath?: string | ((path: string) => string)
  }
  jsonSchema?: {
    adaptors?: IJsonAdaptor[]
    components?: Record<string, Component> | Component[]
  }

  [key: string]: any // 扩展字段
}
```

## 使用方法

```js
import { useManage } from '@duxweb/dvha-core'

// 获取当前管理端配置
const { config, getRoutePath, getApiUrl, getPath } = useManage()

// 或者指定管理端名称
const { config } = useManage('admin')
```

## `config.remote` 与 `config.jsonSchema`

`useManage()` 里拿到的 `config`，已经是“全局配置 + 当前管理端配置”合并后的结果。

所以这里你可以直接这样理解：

- `config.remote`：当前管理端远程页面相关配置
- `config.jsonSchema`：当前管理端 JSON Schema 相关配置

### 1. 看当前管理端远程页面能用哪些包

```ts
const { config } = useManage()

console.log(config.remote?.packages)
console.log(config.remote?.apiRoutePath)
```

最常见的场景是排查：

- 为什么远程页面里 `import 'naive-ui'` 报错
- 为什么远程页面加载的接口地址不对

这时优先检查：

- `config.remote?.packages`
- `config.remote?.apiRoutePath`

### 2. 看当前管理端 JSON Schema 能用哪些组件

```ts
const { config } = useManage()

console.log(config.jsonSchema?.components)
console.log(config.jsonSchema?.adaptors)
```

最常见的场景是排查：

- 为什么 schema 里的 `NInput` 不显示
- 为什么 schema 里的业务组件名不生效

这时优先检查：

- `config.jsonSchema?.components`
- 组件注册名是否和 schema 的 `tag` 一致

### 3. 什么时候会看这里

一般你会在这几种场景下用到 `useManage()`：

- 调试当前管理端到底合并了哪些配置
- 判断当前管理端是否已经注册了某个远程依赖
- 判断当前管理端是否已经注册了某个 JSON Schema 组件

如果你是要“配置”这些字段，请看 [`/guide/config`](/guide/config) 和 [`/guide/custom-extension`](/guide/custom-extension)。
如果你是要看 JSON Schema 怎么消费这些组件，请看 [`/hooks/advanced/useJson`](/hooks/advanced/useJson)。

## 参数说明

| 参数   | 类型     | 必需 | 说明                             |
| ------ | -------- | ---- | -------------------------------- |
| `name` | `string` | ❌   | 管理端名称，不传则使用当前管理端 |

## 返回值

| 字段           | 类型       | 说明                      |
| -------------- | ---------- | ------------------------- |
| `config`       | `IManage`  | 管理端配置对象            |
| `getRoutePath` | `Function` | 生成管理端路由路径的方法  |
| `getApiUrl`    | `Function` | 生成管理端 API 路径的方法 |
| `getPath`      | `Function` | 获取当前相对路径的方法    |

## 管理端配置

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

console.log('管理端信息:', {
  name: config.name, // 管理端名称
  title: config.title, // 页面标题
  description: config.description, // 描述信息
  copyright: config.copyright, // 版权信息
  routePrefix: config.routePrefix, // 路由前缀

  // 功能开关
  register: config.register, // 是否支持注册
  forgotPassword: config.forgotPassword, // 是否支持忘记密码
  updatePassword: config.updatePassword, // 是否支持修改密码

  // 远程菜单
  apiRoutePath: config.apiRoutePath, // 远程菜单 API 路径

  // 提供者
  authProvider: config.authProvider, // 认证提供者
  dataProvider: config.dataProvider, // 数据提供者

  // 其他配置
  theme: config.theme, // 主题配置
  components: config.components, // 组件配置
  routes: config.routes, // 路由配置
  menus: config.menus // 菜单配置
})
```

## 路径生成示例

```js
import { useManage } from '@duxweb/dvha-core'

const { getRoutePath, getApiUrl, getPath } = useManage()

// 生成路由路径
const userListRoute = getRoutePath('users') // '/admin/users'
const userDetailRoute = getRoutePath('users/123') // '/admin/users/123'
const dashboardRoute = getRoutePath() // '/admin/'

// 生成 API 地址 - 使用默认数据提供者
// 内部调用 dataProvider.apiUrl(path, manage.config.apiBasePath)
const userListApi = getApiUrl('users')
const userDetailApi = getApiUrl('users/123')
const statsApi = getApiUrl('dashboard/stats')

// 生成 API 地址 - 使用指定数据提供者
const analyticsApi = getApiUrl('stats', 'analytics') // 调用 analytics 数据提供者
const paymentApi = getApiUrl('transactions', 'payment') // 调用 payment 数据提供者

// 获取当前相对路径
const currentPath = getPath() // 例如: 'users/123/edit'
console.log('当前页面路径:', currentPath)
```

## 当前路径获取示例

```js
import { useManage } from '@duxweb/dvha-core'
import { watch } from 'vue'

const { getPath } = useManage()

// 监听路径变化
watch(() => getPath(), (newPath) => {
  console.log('页面路径变化:', newPath)

  // 根据路径判断当前页面
  if (newPath.startsWith('users')) {
    console.log('在用户管理页面')
  }
  else if (newPath.startsWith('settings')) {
    console.log('在设置页面')
  }
  else if (newPath === '') {
    console.log('在首页')
  }
})

// 面包屑导航生成
function generateBreadcrumb() {
  const path = getPath()
  const segments = path.split('/').filter(Boolean)

  return segments.map((segment, index) => {
    const routePath = segments.slice(0, index + 1).join('/')
    return {
      name: segment,
      path: getRoutePath(routePath)
    }
  })
}
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
    routePrefix: adminManage.config.routePrefix, // '/admin'
    currentPath: adminManage.getPath()
  },
  user: {
    name: userManage.config.name,
    title: userManage.config.title,
    routePrefix: userManage.config.routePrefix, // '/user'
    currentPath: userManage.getPath()
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
}
else {
  // 单一数据提供者
  console.log('使用单一数据提供者')
}
```

## 认证提供者配置

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

// 获取认证提供者配置
const authProvider = config.authProvider

if (authProvider) {
  console.log('认证功能可用:', {
    支持注册: config.register,
    忘记密码: config.forgotPassword,
    修改密码: config.updatePassword
  })

  // 执行认证相关操作
  // 注意：实际认证操作通常通过 useLogin 等认证 hooks 进行
}
```

## 菜单配置使用

```js
import { useManage } from '@duxweb/dvha-core'

const { config } = useManage()

// 获取菜单配置
const menus = config.menus || []
const remoteMenuApi = config.apiRoutePath

console.log('菜单配置:', {
  本地菜单数量: menus.length,
  远程菜单API: remoteMenuApi,
  菜单列表: menus.map(menu => ({
    name: menu.name,
    path: menu.path,
    icon: menu.icon
  }))
})
```

## 完整示例

```vue
<script setup lang="ts">
import { useManage } from '@duxweb/dvha-core'
import { computed } from 'vue'

const { config, getRoutePath, getApiUrl, getPath } = useManage()

// 获取当前路径
const currentPath = computed(() => getPath())

// 生成路径
const userListRoute = getRoutePath('users')
const userListApi = getApiUrl('users')

// 生成面包屑
const breadcrumb = computed(() => {
  const path = currentPath.value
  const segments = path.split('/').filter(Boolean)

  return segments.map((segment, index) => {
    const routePath = segments.slice(0, index + 1).join('/')
    return {
      name: segment,
      path: getRoutePath(routePath)
    }
  })
})

// 多数据提供者示例
const analyticsApi = computed(() => {
  const dataProvider = config.dataProvider
  if (typeof dataProvider === 'object' && 'analytics' in dataProvider) {
    return getApiUrl('stats', 'analytics')
  }
  return null
})
</script>

<template>
  <div class="manage-info">
    <h1>{{ config.title }}</h1>
    <p>{{ config.description }}</p>

    <div class="paths">
      <p>当前路径: {{ currentPath }}</p>
      <p>用户列表路由: {{ userListRoute }}</p>
      <p>用户列表API: {{ userListApi }}</p>
      <p v-if="analyticsApi">
        分析API: {{ analyticsApi }}
      </p>
    </div>

    <div class="breadcrumb">
      <span v-for="item in breadcrumb" :key="item.path">
        {{ item.name }} >
      </span>
    </div>

    <div class="features">
      <p>支持注册: {{ config.register ? '是' : '否' }}</p>
      <p>忘记密码: {{ config.forgotPassword ? '是' : '否' }}</p>
      <p>修改密码: {{ config.updatePassword ? '是' : '否' }}</p>
    </div>

    <div v-if="config.theme" class="theme">
      <img :src="config.theme.logo" alt="Logo">
    </div>

    <div class="copyright">
      {{ config.copyright }}
    </div>
  </div>
</template>
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
- `getApiUrl` 通过调用数据提供者的 `apiUrl(path, apiBasePath)` 方法构建 API 地址
- `apiBasePath` 用于为当前管理端提供 API 路径前缀
- `getPath` 返回当前页面相对于管理端前缀的路径，用于面包屑导航等
- 配置信息会自动合并全局和管理端特定配置
- 支持单一数据提供者或多数据提供者配置
- 支持在不同管理端之间切换和获取配置
- `apiRoutePath` 用于配置远程菜单的 API 路径
- 错误情况下会抛出明确的错误信息
