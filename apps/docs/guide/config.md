# 项目配置

DVHA 提供了丰富的配置选项来满足不同项目的需求。配置主要分为全局配置和管理端配置两个层级，支持多管理端、自定义主题、路由和菜单等功能。

## 基本配置示例

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'

// 创建数据提供者
const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com'
})

const config: IConfig = {
  title: '我的管理系统',
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      apiBasePath: '/admin',
      // ... 其他配置
    }
  ],
  dataProvider,
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': { welcome: '欢迎' },
      'en-US': { welcome: 'Welcome' }
    }
  }),
}
```

## 全局配置 (IConfig)

全局配置可以理解成：**整个项目的默认配置**。

如果你是第一次接触，先记住下面这几个最常用的：

- `title`：项目名称
- `defaultManage`：默认进入哪个管理端
- `manages`：一共有哪几个管理端
- `dataProvider`：数据请求怎么发
- `authProvider`：登录校验怎么做
- `i18nProvider`：多语言怎么处理
- `components` / `theme`：页面长什么样

### 1. 项目的基础信息写哪里

如果你想设置项目名称、描述、版权，写在这里：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | ❌ | 项目标题 |
| `copyright` | `string` | ❌ | 页脚版权信息 |
| `description` | `string` | ❌ | 项目描述 |
| `lang` | `string` | ❌ | 默认语言 |

最常见写法：

```ts
const config: IConfig = {
  title: '企业管理系统',
  description: '一个后台管理项目',
  copyright: '© 2026 My Company',
  lang: 'zh-CN',
}
```

这些字段大多会在你自己的页面里通过 `useConfig()` 读取。

### 2. 默认进入哪个管理端

如果你的项目有多个管理端，比如：

- `/admin`
- `/user`
- `/merchant`

那 `defaultManage` 就表示：用户首次进入项目时，默认先进哪一个。

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `defaultManage` | `string` | ❌ | 默认管理端名称 |
| `manages` | `IManage[]` | ✅ | 管理端列表 |

```ts
const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
    },
    {
      name: 'user',
      title: '用户中心',
      routePrefix: '/user',
    },
  ],
}
```

如果你不确定要配什么，先至少保证：

- `manages` 一定要有
- `defaultManage` 最好指向其中一个已存在的 `name`

### 3. 请求、登录、多语言配哪里

这三个配置是项目最核心的运行能力：

- `dataProvider`：负责请求接口
- `authProvider`：负责登录、退出、鉴权
- `i18nProvider`：负责多语言

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `authProvider` | `IAuthProvider` | ❌ | 全局登录相关配置 |
| `dataProvider` | `IDataProvider \| Record<string, IDataProvider>` | ❌ | 全局数据请求配置 |
| `i18nProvider` | `I18nProvider` | ❌ | 全局国际化配置 |

最简单示例：

```ts
const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com',
})

const config: IConfig = {
  dataProvider,
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': { welcome: '欢迎' },
      'en-US': { welcome: 'Welcome' },
    },
  }),
}
```

> 现在接口地址不再直接写 `apiUrl` 到全局配置里，而是交给 `dataProvider` 去处理。

### 4. 布局、路由、主题配哪里

如果你想控制页面长什么样、用哪个布局、额外加哪些路由，就看这一组：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `components` | `IConfigComponent` | ❌ | 全局布局组件配置 |
| `routes` | `RouteRecordRaw[]` | ❌ | 全局附加路由 |
| `theme` | `IConfigTheme` | ❌ | 全局主题配置 |

最简单理解：

- `components`：页面外壳是谁来渲染
- `routes`：额外补充哪些路由
- `theme`：Logo、Banner、主题默认值放哪里

例如：

```ts
const config: IConfig = {
  components: {
    authLayout: () => import('./layouts/AuthLayout.vue'),
    notFound: () => import('./pages/404.vue'),
  },
  theme: {
    logo: '/logo.png',
    banner: '/banner.jpg',
  },
}
```

### 远程与 JSON Schema

这一组配置主要解决两个问题：

- 远程页面里可以使用哪些包
- JSON Schema 里可以使用哪些组件

如果你是第一次接触，先记最简单的一句话：

- 远程页面缺包，看 `remote.packages`
- JSON Schema 缺组件，看 `jsonSchema.components`

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `remote` | `object` | ❌ | 远程页面相关配置 |
| `jsonSchema` | `object` | ❌ | JSON Schema 渲染相关配置 |

#### 1. `remote` 是做什么的

`remote` 用来配置远程页面怎么加载。

最常用的是 `remote.packages`，它表示：**远程页面允许运行时使用哪些包**。

比如远程页面里写了：

```ts
import { NButton } from 'naive-ui'
```

那你就要在配置里先注册 `naive-ui`：

```ts
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

const config: IConfig = {
  remote: {
    packages: {
      'naive-ui': NaiveUI,
      '@duxweb/dvha-pro': DuxPro,
      '@duxweb/dvha-naiveui': DuxNaiveUI,
    },
    apiMethod: 'POST',
    apiRoutePath: 'static',
  },
}
```

`remote` 里几个常见字段：

| 字段 | 说明 |
| --- | --- |
| `packages` | 远程页面可以使用的包 |
| `apiMethod` | 拉取远程文件时使用的请求方法，默认 `POST` |
| `apiRoutePath` | 拉取远程文件时请求的接口地址，默认 `static` |

如果远程页面里：

- `import 'naive-ui'` 报错
- `import '@duxweb/dvha-pro'` 报错

通常先检查 `remote.packages` 有没有配、包名有没有写对。

#### 2. `jsonSchema` 是做什么的

`jsonSchema` 用来配置 JSON Schema 渲染时可以使用哪些组件。

最常用的是 `jsonSchema.components`，它表示：**JSON Schema 里写到的组件名，实际对应哪些 Vue 组件**。

比如你在 schema 里写了：

```ts
const schema = [
  {
    tag: 'NInput',
  },
  {
    tag: 'DuxFormItem',
  },
]
```

那你就要先注册这些组件：

```ts
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

const config: IConfig = {
  jsonSchema: {
    components: [
      ...Object.values(DuxPro).filter(comp => comp?.name?.startsWith?.('Dux')),
      ...Object.values(DuxNaiveUI).filter(comp => comp?.name?.startsWith?.('Dux')),
      ...Object.entries(NaiveUI)
        .filter(([name]) => name.startsWith('N'))
        .map(([name, component]) => {
          ;(component as any).name = name
          return component
        }),
    ],
  },
}
```

如果只是少量业务组件，也可以直接写对象：

```ts
import UserProfileCard from './components/UserProfileCard.vue'
import UserStatusTag from './components/UserStatusTag.vue'

const config: IConfig = {
  jsonSchema: {
    components: {
      UserProfileCard,
      UserStatusTag,
    },
  },
}
```

如果 schema 里：

- 写了 `NInput` 但是不渲染
- 写了 `DuxFormItem` 但是不识别
- 写了业务组件名但页面空白

通常先检查 `jsonSchema.components` 有没有注册，名字是否和 `tag` 一致。

#### 3. 放全局还是放管理端

如果多个管理端都要用，优先写在全局：

- `IConfig.remote`
- `IConfig.jsonSchema`

如果只有某个管理端要用，就写在当前管理端：

- `IManage.remote`
- `IManage.jsonSchema`

管理端配置会在运行时与全局配置合并，同名字段以管理端自己的配置为准。

想看更详细的教程，可以继续看 [`/guide/custom-extension`](/guide/custom-extension)。

### 扩展配置

如果上面的配置都不够用，而你又想给项目放一些“自己的业务参数”，就用 `extends`。

比如这些都适合放进去：

- 上传大小限制
- 埋点开关
- 第三方服务地址
- 业务常量

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `extends` | `Record<string, any>` | ❌ | 你自己的业务配置 |

```ts
const config: IConfig = {
  extends: {
    analytics: {
      enabled: true,
    },
    upload: {
      maxSize: 10 * 1024 * 1024,
    },
  },
}
```

读取方式：

```ts
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

console.log(config.extends?.analytics?.enabled)
```

## 管理端配置 (IManage)

如果全局配置是“整个项目的默认配置”，那管理端配置就是：**某一个管理端自己的配置**。

比如你可能有：

- 管理后台
- 用户中心
- 商家后台

它们都可以有不同的：

- 路由前缀
- 登录方式
- 数据接口
- 菜单
- 主题

### 1. 每个管理端最少要写什么

每个管理端最少建议先写这三个：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | ✅ | 管理端唯一名称 |
| `title` | `string` | ✅ | 管理端标题 |
| `routePrefix` | `string` | ❌ | 这个管理端的路由前缀 |

```ts
const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
    },
  ],
}
```

### 2. 如果这个管理端有自己的登录和接口

如果某个管理端要单独使用自己的登录逻辑、自己的接口地址，就在当前管理端里覆盖：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `authProvider` | `IAuthProvider` | ❌ | 当前管理端自己的登录配置 |
| `dataProvider` | `IDataProvider \| Record<string, IDataProvider>` | ❌ | 当前管理端自己的请求配置 |
| `i18nProvider` | `I18nProvider` | ❌ | 当前管理端自己的多语言配置 |
| `apiBasePath` | `string` | ❌ | 当前管理端接口前缀 |
| `apiRoutePath` | `string` | ❌ | 当前管理端远程菜单接口 |

### 3. 如果这个管理端有自己的页面和菜单

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `routes` | `RouteRecordRaw[]` | ❌ | 当前管理端额外路由 |
| `menus` | `IMenu[]` | ❌ | 当前管理端菜单 |
| `components` | `IConfigComponent` | ❌ | 当前管理端布局组件 |
| `theme` | `IConfigTheme` | ❌ | 当前管理端主题 |

最常见理解：

- `routes`：补充页面路由
- `menus`：控制侧边栏显示什么
- `components`：这个管理端页面外壳是谁
- `theme`：这个管理端用什么 Logo、Banner

### 4. 功能开关放哪里

如果你想控制当前管理端是否支持：

- 注册
- 忘记密码
- 修改密码

就写在这里：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `register` | `boolean` | ❌ | 是否启用注册 |
| `forgotPassword` | `boolean` | ❌ | 是否启用忘记密码 |
| `updatePassword` | `boolean` | ❌ | 是否启用修改密码 |

### 5. 远程页面和 JSON Schema 该配哪

如果是“这个管理端自己”的远程页面或 JSON Schema 能力，就写在：

- `IManage.remote`
- `IManage.jsonSchema`

如果是所有管理端都共用，就优先写到全局 `IConfig` 里。

最简单的规则就是：

- 公共能力放全局
- 当前管理端独有能力放当前管理端

## 组件配置 (IConfigComponent)

这一组配置决定“页面外壳”和“异常页面”由谁来渲染。

最常见的几个：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `authLayout` | `RouteComponent` | ❌ | 登录后的主布局 |
| `noAuthLayout` | `RouteComponent` | ❌ | 未登录时的布局 |
| `notFound` | `RouteComponent` | ❌ | 404 页面 |
| `notAuthorized` | `RouteComponent` | ❌ | 无权限页面 |
| `error` | `RouteComponent` | ❌ | 错误页面 |
| `exception` | `RouteComponent` | ❌ | 通用异常页面 |
| `iframe` | `RouteComponent` | ❌ | iframe 页面加载器 |
| `remote` | `RouteComponent` | ❌ | 远程页面加载器 |

如果你想换掉默认布局，最常改的是：

- `authLayout`
- `notFound`
- `remote`

## 主题配置 (IConfigTheme)

这一组配置决定页面看起来是什么样，最常用的是 Logo 和 Banner。

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `logo` | `string` | ❌ | 亮色主题 Logo |
| `darkLogo` | `string` | ❌ | 暗色主题 Logo |
| `appLogo` | `string` | ❌ | 应用 Logo（亮色） |
| `appDarkLogo` | `string` | ❌ | 应用 Logo（暗色） |
| `banner` | `string` | ❌ | 亮色横幅 |
| `darkBanner` | `string` | ❌ | 暗色横幅 |
| `config` | `object` | ❌ | 主题组件配置 |
| `defaultTheme` | `object` | ❌ | 主题默认状态 |

如果你只是想快速换品牌素材，通常先改：

- `logo`
- `darkLogo`
- `banner`
- `darkBanner`

## 菜单配置 (IMenu)

菜单配置决定侧边栏显示什么、点进去打开哪个页面。

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | ✅ | 菜单唯一名称 |
| `label` | `string` | ❌ | 菜单显示文本 |
| `path` | `string` | ❌ | 菜单路径 |
| `icon` | `string` | ❌ | 菜单图标 |
| `sort` | `number` | ❌ | 菜单排序 |
| `parent` | `string` | ❌ | 父级菜单名称 |
| `hidden` | `boolean` | ❌ | 是否隐藏 |
| `loader` | `string` | ❌ | 特殊加载方式，如 `iframe` / `remote` / `link` |
| `component` | `RouteComponent` | ❌ | 本地页面组件 |
| `meta` | `Record<string, any>` | ❌ | 菜单附加参数 |

最常见的理解方式：

- 普通本地页面：配 `path` + `component`
- 远程页面：配 `path` + `loader: 'remote'`
- iframe 页面：配 `path` + `loader: 'iframe'`

## 配置怎么读取

有些配置是框架自己会自动用的，比如：

- `manages`
- `routes`
- `menus`
- `components`
- `theme`
- `provider`

有些配置则更适合你自己在页面里读取，比如：

- `title`
- `description`
- `extends`
- 某些功能开关

最常见读取方式：

```ts
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

console.log(config.title)
console.log(config.extends?.analytics?.enabled)
```

```ts
import { useManage } from '@duxweb/dvha-core'

const manage = useManage()

console.log(manage.config.title)
console.log(manage.config.routePrefix)
```

```ts
import { useTheme } from '@duxweb/dvha-core'

const theme = useTheme()

console.log(theme.logo)
```

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
import { i18nProvider } from '@duxweb/dvha-core'
import enUS from './locales/en-US.json'
import zhCN from './locales/zh-CN.json'

// 创建数据提供者
const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com'
})

const config: IConfig = {
  title: '企业管理系统',
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',

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

  dataProvider,
  authProvider: simpleAuthProvider(),

  // 全局国际化配置
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS
    }
  }),
}
```

### 多数据提供者配置

DVHA 支持为不同的资源配置不同的数据提供者，这在微服务架构或多数据源场景下非常有用：

```typescript
// 创建不同的数据提供者
const userDataProvider = simpleDataProvider({
  apiUrl: 'https://user-api.example.com'
})

const orderDataProvider = simpleDataProvider({
  apiUrl: 'https://order-api.example.com'
})

const productDataProvider = simpleDataProvider({
  apiUrl: 'https://product-api.example.com'
})

const config: IConfig = {
  title: '多服务管理系统',
  defaultManage: 'admin',

  // 全局多数据提供者配置
  dataProvider: {
    default: userDataProvider, // 默认数据提供者
    user: userDataProvider, // 用户服务
    order: orderDataProvider, // 订单服务
    product: productDataProvider, // 商品服务
  },

  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',

      // 管理端可以覆盖特定的数据提供者
      dataProvider: {
        default: userDataProvider,
        analytics: simpleDataProvider({
          apiUrl: 'https://analytics-api.example.com'
        })
      }
    }
  ]
}
```

### 多管理端配置

```typescript
import { i18nProvider } from '@duxweb/dvha-core'
import adminEnUS from './locales/admin/en-US.json'
import adminZhCN from './locales/admin/zh-CN.json'
import merchantEnUS from './locales/merchant/en-US.json'
import merchantZhCN from './locales/merchant/zh-CN.json'

// 创建数据提供者
const adminDataProvider = simpleDataProvider({
  apiUrl: 'https://admin-api.example.com'
})

const merchantDataProvider = simpleDataProvider({
  apiUrl: 'https://merchant-api.example.com'
})

const config: IConfig = {
  title: '多端管理系统',
  defaultManage: 'admin',

  // 全局国际化提供者
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': { common: { title: '多端管理系统' } },
      'en-US': { common: { title: 'Multi-Platform Management' } }
    }
  }),

  manages: [
    // 管理员端
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      dataProvider: adminDataProvider,
      authProvider: adminAuthProvider,

      // 管理端专用国际化配置
      i18nProvider: i18nProvider({
        locale: 'zh-CN',
        fallbackLocale: 'en-US',
        messages: {
          'zh-CN': adminZhCN,
          'en-US': adminEnUS
        }
      }),

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

      // 商户端使用多数据提供者
      dataProvider: {
        default: merchantDataProvider,
        analytics: simpleDataProvider({
          apiUrl: 'https://analytics-api.example.com'
        }),
        payment: simpleDataProvider({
          apiUrl: 'https://payment-api.example.com'
        })
      },

      authProvider: merchantAuthProvider,

      // 商户端专用国际化配置（支持英文优先）
      i18nProvider: i18nProvider({
        locale: 'en-US',
        fallbackLocale: 'zh-CN',
        messages: {
          'zh-CN': merchantZhCN,
          'en-US': merchantEnUS
        }
      }),

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
  authProvider: simpleAuthProvider(),
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
// 创建环境配置的数据提供者
const dataProvider = simpleDataProvider({
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

const config: IConfig = {
  title: import.meta.env.VITE_APP_TITLE || '管理系统',
  dataProvider,
  // ... 其他配置
}
```

## 国际化配置详解

### 全局国际化配置

全局国际化配置为所有管理端提供基础的多语言支持：

```typescript
import { i18nProvider } from '@duxweb/dvha-core'
import globalEnUS from './locales/global/en-US.json'
import globalZhCN from './locales/global/zh-CN.json'

const config: IConfig = {
  // 全局国际化提供者
  i18nProvider: i18nProvider({
    locale: 'zh-CN', // 默认语言
    fallbackLocale: 'en-US', // 回退语言
    messages: {
      'zh-CN': globalZhCN,
      'en-US': globalEnUS
    }
  }),
  // ... 其他配置
}
```

### 管理端专用国际化配置

每个管理端可以有独立的国际化配置，会覆盖全局配置：

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',

      // 管理端专用国际化配置
      i18nProvider: i18nProvider({
        locale: 'zh-CN',
        fallbackLocale: 'en-US',
        messages: {
          'zh-CN': {
            nav: { dashboard: '仪表板', users: '用户管理' },
            form: { save: '保存', cancel: '取消' }
          },
          'en-US': {
            nav: { dashboard: 'Dashboard', users: 'User Management' },
            form: { save: 'Save', cancel: 'Cancel' }
          }
        }
      }),
      // ... 其他配置
    }
  ]
}
```

### 动态语言包加载配置

支持动态加载语言包，适用于大型应用：

```typescript
const config: IConfig = {
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': {}, // 初始为空，动态加载
      'en-US': {}
    }
  }),
  // ... 其他配置
}

// 在应用启动后动态加载
async function loadLanguagePacks() {
  const { i18nProvider: provider } = useConfig()

  // 加载中文语言包
  const zhCN = await import('./locales/zh-CN.json')
  await provider.loadLocale('zh-CN', zhCN.default)

  // 加载英文语言包
  const enUS = await import('./locales/en-US.json')
  await provider.loadLocale('en-US', enUS.default)
}
```
