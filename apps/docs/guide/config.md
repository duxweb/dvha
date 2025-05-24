# 项目配置

DVHA 提供了丰富的配置选项来满足不同项目的需求。配置主要分为全局配置和管理端配置两个层级，支持多管理端、自定义主题、路由和菜单等功能。

## 基本配置示例

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleDataProvider, simpleAuthProvider } from '@duxweb/dvha-core'

const config: IConfig = {
  apiUrl: 'https://api.example.com',
  title: '我的管理系统',
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      apiUrl: '/admin',
      // ... 其他配置
    }
  ],
  dataProvider: simpleDataProvider,
  authProvider: simpleAuthProvider,
}
```

## 全局配置 (IConfig)

全局配置是整个应用的基础配置，影响所有管理端的行为。

### 基础信息配置

**用途说明**: 📝 这些配置主要供开发者在组件中调用，通过 `useConfig()` 获取后显示在界面上，如页面标题、页脚版权信息等。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | ❌ | - | 应用标题 |
| `copyright` | `string` | ❌ | - | 版权信息 |
| `description` | `string` | ❌ | - | 应用描述 |
| `lang` | `string` | ❌ | - | 默认语言 |

### API 配置

**用途说明**: 🔗 框架内部使用，用于构建完整的 API 请求地址。数据提供者和认证提供者会自动使用此配置。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `apiUrl` | `string` | ❌ | - | 全局 API 基础地址 |

### 管理端配置

**用途说明**: 🏗️ 框架内部使用，用于多管理端架构的路由管理、管理端切换和默认管理端选择。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `defaultManage` | `string` | ❌ | - | 默认管理端名称 |
| `manages` | `IManage[]` | ❌ | `[]` | 管理端配置列表 |

### 提供者配置

**用途说明**: ⚙️ 框架内部使用，为所有 Hooks 提供底层的数据操作和认证功能。管理端配置中的提供者会覆盖全局提供者。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `authProvider` | `IAuthProvider` | ❌ | - | 全局认证提供者 |
| `dataProvider` | `IDataProvider` | ❌ | - | 全局数据提供者 |

### 全局组件配置

**用途说明**: 🎨 框架内部使用，用于路由渲染时自动选择对应的布局组件和错误页面。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `components` | `IConfigComponent` | ❌ | - | 全局布局组件配置 |
| `routes` | `RouteRecordRaw[]` | ❌ | `[]` | 全局路由配置 |
| `theme` | `IConfigTheme` | ❌ | - | 全局主题配置 |

### 扩展配置

**用途说明**: 🔧 完全供开发者自定义使用，可以存储任意项目特定的配置，通过 `useConfig()` 在组件中获取。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `extends` | `Record<string, any>` | ❌ | - | 扩展配置对象 |

## 管理端配置 (IManage)

每个管理端都可以有独立的配置，支持多个管理端同时运行。

### 基础信息配置

**用途说明**: 📝 `name` 为框架内部使用的唯一标识；其他字段主要供开发者在组件中调用，用于显示管理端标题、描述等信息。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | `string` | ✅ | - | 管理端唯一标识 |
| `title` | `string` | ✅ | - | 管理端标题 |
| `copyright` | `string` | ❌ | - | 版权信息 |
| `description` | `string` | ❌ | - | 管理端描述 |

### 功能开关配置

**用途说明**: 🎛️ 供开发者在组件中调用，通过 `useManage()` 获取后判断是否显示注册按钮、忘记密码链接等功能。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `register` | `boolean` | ❌ | `false` | 是否启用注册功能 |
| `forgotPassword` | `boolean` | ❌ | `false` | 是否启用忘记密码功能 |
| `updatePassword` | `boolean` | ❌ | `false` | 是否启用更新密码功能 |

### API 配置

**用途说明**: 🔗 框架内部使用，用于构建管理端专用的 API 地址。会与全局 `apiUrl` 拼接生成完整请求地址。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `apiUrl` | `string` | ❌ | - | 管理端 API 地址 |
| `apiRoutePath` | `string` | ❌ | - | API 路由地址 |

### 路由配置

**用途说明**: 🛣️ 框架内部使用，用于生成管理端的路由结构和页面访问路径。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `routePrefix` | `string` | ❌ | - | 路由前缀 (如 `/admin`) |
| `routes` | `RouteRecordRaw[]` | ❌ | `[]` | 自定义路由配置 |

### 菜单配置

**用途说明**: 🧭 框架内部使用，用于自动生成侧边栏菜单结构，包括菜单层级、权限控制等。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `menus` | `IMenu[]` | ❌ | `[]` | 菜单配置列表 |

### 提供者配置

**用途说明**: ⚙️ 框架内部使用，为当前管理端提供专用的认证和数据操作功能，会覆盖全局提供者配置。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `authProvider` | `IAuthProvider` | ❌ | - | 管理端专用认证提供者 |
| `dataProvider` | `IDataProvider` | ❌ | - | 管理端专用数据提供者 |

### 组件配置

**用途说明**: 🎨 框架内部使用，用于当前管理端的布局渲染和主题显示，会与全局配置合并。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `components` | `IConfigComponent` | ❌ | - | 布局组件配置 |
| `theme` | `IConfigTheme` | ❌ | - | 主题配置 |

## 组件配置 (IConfigComponent)

**用途说明**: 🎨 框架内部使用，根据路由状态和用户认证状态自动选择对应的布局组件进行渲染。

用于配置各种布局组件。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `authLayout` | `RouteComponent` | ❌ | - | 认证后的主布局组件 |
| `noAuthLayout` | `RouteComponent` | ❌ | - | 未认证时的布局组件 |
| `notFound` | `RouteComponent` | ❌ | - | 404 页面组件 |
| `notAuthorized` | `RouteComponent` | ❌ | - | 无权限页面组件 |
| `error` | `RouteComponent` | ❌ | - | 错误页面组件 |

## 主题配置 (IConfigTheme)

**用途说明**: 🎨 部分框架使用 + 部分开发者调用。Logo 可能被框架自动显示在导航栏，其他字段可通过 `useTheme()` 在组件中获取使用。

用于配置应用的视觉主题。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `logo` | `string` | ❌ | - | 亮色主题 Logo URL |
| `darkLogo` | `string` | ❌ | - | 暗色主题 Logo URL |
| `banner` | `string` | ❌ | - | 亮色主题横幅 URL |
| `darkBanner` | `string` | ❌ | - | 暗色主题横幅 URL |

## 菜单配置 (IMenu)

**用途说明**: 🧭 框架内部使用，用于自动生成和渲染侧边栏菜单，包括菜单排序、层级结构、权限控制和路由跳转。

用于配置侧边栏菜单。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | `string` | ✅ | - | 菜单唯一标识 |
| `label` | `string` | ❌ | - | 菜单显示名称 |
| `path` | `string` | ❌ | - | 菜单路径 |
| `icon` | `string` | ❌ | - | 菜单图标 (支持 iconify) |
| `sort` | `number` | ❌ | `0` | 菜单排序 |
| `parent` | `string` | ❌ | - | 父级菜单标识 |
| `hidden` | `boolean` | ❌ | `false` | 是否隐藏菜单 |
| `loader` | `string` | ❌ | - | 菜单加载器 |
| `component` | `RouteComponent` | ❌ | - | 菜单对应的组件 |
| `meta` | `Record<string, any>` | ❌ | - | 菜单元数据 |

## 配置调用方式

### 框架内部使用的配置

这些配置由 DVHA 框架自动使用，开发者无需手动调用：

- **API 配置**: 自动构建请求地址
- **管理端配置**: 自动路由管理和切换
- **提供者配置**: 自动注入到 Hooks 中
- **组件配置**: 自动路由渲染
- **路由配置**: 自动注册路由
- **菜单配置**: 自动生成侧边栏

### 开发者调用的配置

这些配置需要开发者在组件中主动获取和使用：

```typescript
// 获取全局配置
import { useConfig } from '@duxweb/dvha-core'
const config = useConfig()

// 在模板中显示应用标题
console.log(config.title) // '我的管理系统'

// 获取扩展配置
console.log(config.extends?.analytics?.enabled) // true
```

```typescript
// 获取当前管理端配置
import { useManage } from '@duxweb/dvha-core'
const manage = useManage()

// 根据功能开关显示/隐藏按钮
const showRegister = manage.register // false
const showForgotPassword = manage.forgotPassword // true

// 显示管理端标题
console.log(manage.title) // '管理后台'
```

```typescript
// 获取主题配置
import { useTheme } from '@duxweb/dvha-core'
const theme = useTheme()

// 获取当前主题的 Logo
console.log(theme.logo) // '/images/logo.png'
```

## 配置示例

### 基础单管理端配置

```typescript
const config: IConfig = {
  title: '企业管理系统',
  apiUrl: 'https://api.example.com',
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      apiUrl: '/admin',

      // 功能开关 - 供组件调用
      forgotPassword: true,
      updatePassword: true,

      components: {
        authLayout: () => import('./layouts/AdminLayout.vue'),
        notFound: () => import('./pages/404.vue'),
      },
      menus: [
        {
          name: 'dashboard',
          label: '仪表板',
          path: 'index',
          icon: 'i-tabler:dashboard',
          component: () => import('./pages/Dashboard.vue'),
        },
        {
          name: 'users',
          label: '用户管理',
          path: 'users',
          icon: 'i-tabler:users',
          component: () => import('./pages/Users.vue'),
        },
      ]
    }
  ],

  // 扩展配置 - 供组件调用
  extends: {
    analytics: {
      enabled: true,
      trackingId: 'GA-XXXXXXXX',
    },
  },

  dataProvider: simpleDataProvider,
  authProvider: simpleAuthProvider,
}
```

### 多管理端配置

```typescript
const config: IConfig = {
  title: '多端管理系统',
  apiUrl: 'https://api.example.com',
  defaultManage: 'admin',
  manages: [
    // 管理员端
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      apiUrl: '/admin',
      authProvider: adminAuthProvider,
      theme: {
        logo: '/logos/admin-logo.png',
        banner: '/banners/admin-banner.png',
      },
      menus: [
        {
          name: 'dashboard',
          label: '仪表板',
          path: 'index',
          icon: 'i-tabler:dashboard',
          component: () => import('./pages/admin/Dashboard.vue'),
        },
        {
          name: 'system',
          label: '系统管理',
          icon: 'i-tabler:settings',
        },
        {
          name: 'users',
          label: '用户管理',
          path: 'users',
          parent: 'system',
          component: () => import('./pages/admin/Users.vue'),
        },
      ]
    },
    // 商户端
    {
      name: 'merchant',
      title: '商户中心',
      routePrefix: '/merchant',
      apiUrl: '/merchant',
      authProvider: merchantAuthProvider,

      // 不同的功能开关
      register: true,
      forgotPassword: false,

      theme: {
        logo: '/logos/merchant-logo.png',
        banner: '/banners/merchant-banner.png',
      },
      menus: [
        {
          name: 'dashboard',
          label: '数据概览',
          path: 'index',
          icon: 'i-tabler:chart-line',
          component: () => import('./pages/merchant/Dashboard.vue'),
        },
        {
          name: 'products',
          label: '商品管理',
          path: 'products',
          icon: 'i-tabler:package',
          component: () => import('./pages/merchant/Products.vue'),
        },
      ]
    }
  ],
  dataProvider: simpleDataProvider,
  authProvider: simpleAuthProvider,
}
```

## 配置优先级

DVHA 的配置遵循以下优先级规则：

1. **管理端配置** > **全局配置**
2. 管理端的 `authProvider` 会覆盖全局的 `authProvider`
3. 管理端的 `dataProvider` 会覆盖全局的 `dataProvider`
4. 管理端的 `theme` 会与全局 `theme` 合并
5. 管理端的 `components` 会与全局 `components` 合并

## 动态配置

DVHA 支持在运行时动态修改配置：

```typescript
import { useConfig } from '@duxweb/dvha-core'

// 在组件中获取配置
const config = useConfig()

// 配置是响应式的，可以直接修改
config.title = '新标题'
```

## 环境变量配置

建议将敏感信息通过环境变量配置：

```typescript
const config: IConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  title: import.meta.env.VITE_APP_TITLE || '管理系统',
  // ...
}
```
