# 管理端配置

这一页主要讲：**一个项目里如果不止一个后台，DVHA 怎么管理。**

很多后台项目做到后面，都会慢慢出现这些角色：

- 总后台
- 商家后台
- 用户中心
- 代理后台

如果按传统方式做，通常会越来越麻烦：

- 路由要拆
- 菜单要拆
- 登录逻辑要拆
- 接口前缀要拆
- 主题和布局也要拆

DVHA 的做法是：**把多管理端当成内建能力来设计。**

所以你可以在同一个项目里，直接配置多个管理端，并让它们各自拥有自己的：

- 路由前缀
- 菜单
- 登录方式
- 数据接口
- 主题
- 动态扩展能力

## 管理端接口定义

```typescript
interface IManage {
  name: string                                              // 管理端唯一标识
  title: string                                             // 管理端标题
  copyright?: string                                        // 版权信息
  description?: string                                      // 描述信息

  register?: boolean                                        // 是否支持注册
  forgotPassword?: boolean                                  // 是否支持忘记密码
  updatePassword?: boolean                                  // 是否支持修改密码

  apiRoutePath?: string                                     // 远程菜单 API 路径
  apiBasePath?: string                                      // API 基础路径

  authProvider?: IAuthProvider                              // 认证提供者
  dataProvider?: IDataProvider | Record<string, IDataProvider>  // 数据提供者
  i18nProvider?: I18nProvider                               // 国际化提供者

  routePrefix?: string                                      // 路由前缀
  routes?: RouteRecordRaw[]                                 // 路由配置
  menus?: IMenu[]                                          // 菜单配置

  components?: IConfigComponent                             // 组件配置
  theme?: IConfigTheme                                     // 主题配置
  remote?: {
    packages?: Options
    apiMethod?: string
    apiRoutePath?: string | ((path: string) => string)
  }                                                        // 远程包配置
  jsonSchema?: {
    adaptors?: IJsonAdaptor[]
    components?: Record<string, Component> | Component[]
  }                                                        // JSON Schema 配置

  [key: string]: any                                       // 扩展字段
}
```

## 远程与 JSON Schema 扩展

如果你想给某个管理端单独加能力，最常见的就是这两个配置：

- `remote`：给这个管理端的远程页面加包
- `jsonSchema`：给这个管理端的 JSON Schema 加组件

先记一句最简单的话：

- 当前管理端远程页面缺包，看 `remote.packages`
- 当前管理端 JSON Schema 缺组件，看 `jsonSchema.components`

### 给当前管理端加载三方包

如果某个管理端里的远程页面写了：

```ts
import { NButton } from 'naive-ui'
```

那你就要在这个管理端的 `remote.packages` 里先注册 `naive-ui`：

```ts
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      remote: {
        packages: {
          'naive-ui': NaiveUI,
          '@duxweb/dvha-pro': DuxPro,
        },
        apiRoutePath: 'static',
      },
    },
  ],
}
```

这里几个字段可以这样理解：

| 字段 | 说明 |
| --- | --- |
| `packages` | 这个管理端远程页面可以使用的包 |
| `apiMethod` | 拉取远程文件时使用的请求方法 |
| `apiRoutePath` | 这个管理端拉取远程文件的接口地址 |

### 给当前管理端加载三方组件

如果某个管理端里的 JSON Schema 写了：

```ts
const schema = [
  {
    tag: 'UserProfileCard',
  },
]
```

那你就要在这个管理端的 `jsonSchema.components` 里先注册对应组件：

```ts
import UserProfileCard from './components/UserProfileCard.vue'

const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      jsonSchema: {
        components: {
          UserProfileCard,
        },
      },
    },
  ],
}
```

### 和全局配置是什么关系

这里的配置不会替代全局，而是会和全局一起合并：

- 全局先加载
- 当前管理端后加载
- 如果字段重名，当前管理端优先

所以你可以把“公共能力”放全局，把“当前管理端独有的能力”放这里。

想继续看更完整的入门解释，可以参考 [`/guide/custom-extension`](/guide/custom-extension)。

## 基础配置

### 单管理端配置

```js
import { createDux, simpleDataProvider } from '@duxweb/dvha-core'

// 创建数据提供者
const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com'
})

const app = createDux({
  // 默认管理端
  defaultManage: 'admin',

  // 管理端配置
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      copyright: '© 2024 My Company',
      description: '企业管理系统',

      // 功能开关
      register: false,
      forgotPassword: true,
      updatePassword: true,

      // 路由配置
      routePrefix: '/admin',
      apiBasePath: '/admin',

      // 认证提供者
      authProvider: adminAuthProvider,

      // 数据提供者
      dataProvider,

      // 菜单配置
      menus: [
        // 菜单项...
      ],

      // 主题配置
      theme: {
        logo: '/logo.png',
        banner: '/banner.jpg'
      }
    }
  ]
})
```

### 多管理端配置

```js
// 创建不同的数据提供者
const adminDataProvider = simpleDataProvider({
  apiUrl: 'https://admin-api.example.com'
})

const userDataProvider = simpleDataProvider({
  apiUrl: 'https://user-api.example.com'
})

const merchantDataProvider = simpleDataProvider({
  apiUrl: 'https://merchant-api.example.com'
})

const app = createDux({
  // 全局配置
  title: 'DVHA 框架',
  copyright: '© 2024 DVHA',

  // 默认管理端
  defaultManage: 'admin',

  // 管理端配置
  manages: [
    // 系统管理端
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/admin',
      authProvider: adminAuthProvider,
      dataProvider: adminDataProvider,
      theme: {
        logo: '/admin-logo.png'
      }
    },

    // 用户中心
    {
      name: 'user',
      title: '用户中心',
      routePrefix: '/user',
      authProvider: userAuthProvider,
      dataProvider: userDataProvider,
      theme: {
        logo: '/user-logo.png'
      }
    },

    // 商家后台 - 使用多数据提供者
    {
      name: 'merchant',
      title: '商家后台',
      routePrefix: '/merchant',
      authProvider: merchantAuthProvider,
      dataProvider: {
        default: merchantDataProvider,
        analytics: simpleDataProvider({
          apiUrl: 'https://analytics-api.example.com'
        }),
        payment: simpleDataProvider({
          apiUrl: 'https://payment-api.example.com'
        })
      },
      register: true,
      forgotPassword: true
    }
  ]
})
```

## 配置继承机制

### 全局配置与管理端配置

DVHA 支持全局配置和管理端配置的继承机制：

```js
const app = createDux({
  // 全局配置
  title: 'DVHA 系统',
  copyright: '© 2024 DVHA',

  // 全局认证提供者
  authProvider: globalAuthProvider,

  // 全局数据提供者
  dataProvider: globalDataProvider,

  // 全局主题
  theme: {
    logo: '/global-logo.png',
    banner: '/global-banner.jpg'
  },

  manages: [
    {
      name: 'admin',
      title: '管理后台',  // 最终标题: "管理后台 - DVHA 系统"

      // 继承全局 authProvider
      // 继承全局 dataProvider

      // 覆盖全局主题
      theme: {
        logo: '/admin-logo.png'  // 覆盖全局 logo
        // banner 继承全局配置
      }
    }
  ]
})
```

### 配置合并规则

1. **字符串字段**: 管理端配置覆盖全局配置
2. **对象字段**: 深度合并，管理端配置优先
3. **标题字段**: 特殊处理，格式为 "管理端标题 - 全局标题"
4. **数据提供者**: 管理端配置覆盖全局配置

## 管理端功能配置

### 认证功能配置

```js
{
  name: 'admin',
  title: '管理后台',

  // 认证功能开关
  register: true,           // 启用注册功能
  forgotPassword: true,     // 启用忘记密码
  updatePassword: true,     // 启用修改密码

  // 认证提供者
  authProvider: {
    login: async (params, manage) => {
      // 登录逻辑
    },
    logout: async (params, manage) => {
      // 登出逻辑
    },
    register: async (params, manage) => {
      // 注册逻辑
    },
    forgotPassword: async (params, manage) => {
      // 忘记密码逻辑
    },
    updatePassword: async (params, manage) => {
      // 修改密码逻辑
    }
  }
}
```

### 数据源配置

```js
{
  name: 'admin',
  title: '管理后台',

  // 单一数据提供者
  dataProvider: simpleDataProvider({
    apiUrl: 'https://api.example.com'
  }),

  // 或者多重数据提供者
  dataProvider: {
    default: simpleDataProvider({
      apiUrl: 'https://api.example.com'
    }),
    user: simpleDataProvider({
      apiUrl: 'https://user-api.example.com'
    }),
    order: simpleDataProvider({
      apiUrl: 'https://order-api.example.com'
    }),
    product: simpleDataProvider({
      apiUrl: 'https://product-api.example.com'
    })
  }
}
```

### 路由和菜单配置

```js
{
  name: 'admin',
  title: '管理后台',

  // 路由前缀
  routePrefix: '/admin',

  // 静态路由配置
  routes: [
    {
      path: 'login',
      name: 'admin.login',
      component: () => import('./pages/Login.vue'),
      meta: { authorization: false }
    }
  ],

  // 菜单配置
  menus: [
    {
      name: 'dashboard',
      label: '仪表盘',
      path: 'dashboard',
      icon: 'dashboard',
      component: () => import('./pages/Dashboard.vue')
    }
  ],

  // 远程菜单
  apiRoutePath: '/api/admin/menus'
}
```

### 布局组件配置

```js
{
  name: 'admin',
  title: '管理后台',

  // 布局组件配置
  components: {
    authLayout: () => import('./layouts/AdminLayout.vue'),
    noAuthLayout: () => import('./layouts/LoginLayout.vue'),
    notFound: () => import('./pages/404.vue'),
    notAuthorized: () => import('./pages/403.vue'),
    error: () => import('./pages/500.vue')
  }
}
```

### 主题配置

```js
{
  name: 'admin',
  title: '管理后台',

  // 主题配置
  theme: {
    logo: '/admin-logo.png',           // 亮色主题 Logo
    darkLogo: '/admin-logo-dark.png',  // 暗色主题 Logo
    banner: '/admin-banner.jpg',       // 亮色主题横幅
    darkBanner: '/admin-banner-dark.jpg' // 暗色主题横幅
  }
}
```

## 实际应用示例

### 企业级多管理端配置

```js
import { createDux, simpleDataProvider } from '@duxweb/dvha-core'

// 认证提供者
const createAuthProvider = (baseUrl) => ({
  login: async (params) => {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return await response.json()
  },
  logout: async () => {
    await fetch(`${baseUrl}/auth/logout`, { method: 'POST' })
    return { success: true }
  }
})

const app = createDux({
  // 全局配置
  title: '企业管理平台',
  copyright: '© 2024 Enterprise Corp',

  defaultManage: 'admin',

  manages: [
    // 系统管理端
    {
      name: 'admin',
      title: '系统管理',
      description: '企业系统管理后台',
      routePrefix: '/admin',

      authProvider: createAuthProvider('https://admin-api.example.com'),
      dataProvider: simpleDataProvider({
        apiUrl: 'https://admin-api.example.com'
      }),

      register: false,
      forgotPassword: true,

      menus: [
        {
          name: 'dashboard',
          label: '系统概览',
          path: 'dashboard',
          icon: 'dashboard',
          component: () => import('./admin/Dashboard.vue')
        },
        {
          name: 'users',
          label: '用户管理',
          path: 'users',
          icon: 'users',
          component: () => import('./admin/Users.vue')
        }
      ],

      theme: {
        logo: '/logos/admin-logo.png',
        banner: '/banners/admin-banner.jpg'
      },

      components: {
        authLayout: () => import('./layouts/AdminLayout.vue'),
        noAuthLayout: () => import('./layouts/AdminLogin.vue')
      }
    },

    // 用户中心
    {
      name: 'user',
      title: '用户中心',
      description: '用户个人管理中心',
      routePrefix: '/user',

      authProvider: createAuthProvider('https://user-api.example.com'),
      dataProvider: simpleDataProvider({
        apiUrl: 'https://user-api.example.com'
      }),

      register: true,
      forgotPassword: true,
      updatePassword: true,

      menus: [
        {
          name: 'profile',
          label: '个人资料',
          path: 'profile',
          icon: 'user',
          component: () => import('./user/Profile.vue')
        },
        {
          name: 'settings',
          label: '账户设置',
          path: 'settings',
          icon: 'settings',
          component: () => import('./user/Settings.vue')
        }
      ],

      theme: {
        logo: '/logos/user-logo.png',
        banner: '/banners/user-banner.jpg'
      },

      components: {
        authLayout: () => import('./layouts/UserLayout.vue'),
        noAuthLayout: () => import('./layouts/UserLogin.vue')
      }
    },

    // 商家后台
    {
      name: 'merchant',
      title: '商家后台',
      description: '商家店铺管理后台',
      routePrefix: '/merchant',

      authProvider: createAuthProvider('https://merchant-api.example.com'),
      dataProvider: simpleDataProvider({
        apiUrl: 'https://merchant-api.example.com'
      }),

      register: true,
      forgotPassword: true,
      updatePassword: true,

      apiRoutePath: '/api/merchant/menus', // 动态菜单

      menus: [
        {
          name: 'dashboard',
          label: '店铺概览',
          path: 'dashboard',
          icon: 'dashboard',
          component: () => import('./merchant/Dashboard.vue')
        }
      ],

      theme: {
        logo: '/logos/merchant-logo.png',
        banner: '/banners/merchant-banner.jpg'
      },

      components: {
        authLayout: () => import('./layouts/MerchantLayout.vue'),
        noAuthLayout: () => import('./layouts/MerchantLogin.vue')
      }
    }
  ]
})
```

### 使用管理端配置

```vue
<script setup>
import { useManage } from '@duxweb/dvha-core'

// 获取当前管理端配置
const manage = useManage()

console.log('管理端名称:', manage.config.name)
console.log('管理端标题:', manage.config.title)

// 生成路由路径
const dashboardPath = manage.getRoutePath('dashboard')
console.log('仪表盘路径:', dashboardPath)

// 生成API地址 - 使用默认数据提供者
const usersApiUrl = manage.getApiUrl('users')
console.log('用户API地址:', usersApiUrl)

// 生成API地址 - 使用指定的数据提供者
const analyticsApiUrl = manage.getApiUrl('stats', 'analytics')
console.log('分析API地址:', analyticsApiUrl)
</script>
```

## 管理端切换

### 程序化切换

```js
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()

// 切换到不同管理端
const switchToAdmin = () => {
  const adminManage = useManage('admin')
  router.push(adminManage.getRoutePath(''))
}

const switchToUser = () => {
  const userManage = useManage('user')
  router.push(userManage.getRoutePath('profile'))
}
```

### 管理端选择器组件

```vue
<template>
  <div class="manage-selector">
    <select v-model="currentManage" @change="switchManage">
      <option value="admin">系统管理</option>
      <option value="user">用户中心</option>
      <option value="merchant">商家后台</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()
const currentManage = ref('admin')

const switchManage = () => {
  const manage = useManage(currentManage.value)
  router.push(manage.getRoutePath(''))
}
</script>
```

## 最佳实践

1. **管理端命名**: 使用简洁明确的名称，避免特殊字符
2. **路由前缀**: 确保路由前缀唯一，避免冲突
3. **配置复用**: 合理使用全局配置减少重复代码
4. **主题统一**: 保持同系列管理端的视觉一致性
5. **权限隔离**: 确保不同管理端的权限完全隔离
6. **数据隔离**: 不同管理端使用独立的数据源和API
7. **错误处理**: 为每个管理端配置适当的错误页面

## 注意事项

- **唯一性**: 管理端名称必须全局唯一
- **路由冲突**: 确保路由前缀不冲突
- **资源路径**: 主题资源路径应使用绝对路径
- **配置顺序**: 配置项的加载顺序会影响继承效果
- **内存管理**: 多管理端会增加内存占用，合理配置
- **SEO考虑**: 不同管理端可能需要不同的SEO配置
