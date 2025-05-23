# 路由配置

DVHA 框架提供了灵活的路由配置系统，支持多管理端路由配置和动态路由注册。

## 功能特点

- 🏗️ **多管理端支持** - 每个管理端可以独立配置路由
- 🔐 **认证路由分离** - 自动区分需要认证和无需认证的路由
- 🚀 **动态路由注册** - 支持运行时动态添加路由
- 📱 **布局组件** - 支持认证和非认证布局组件
- 🔄 **自动重定向** - 提供默认路由重定向逻辑
- 🎯 **路径前缀** - 支持管理端路由前缀配置

## 全局路由配置

### 基础配置

```js
import { createDuxApp } from '@duxweb/dvha-core'

const app = createDuxApp({
  // 全局路由配置
  routes: [
    {
      path: '/help',
      name: 'help',
      component: () => import('./pages/Help.vue')
    }
  ],

  // 默认管理端
  defaultManage: 'admin',

  // 管理端配置
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',  // 路由前缀
      routes: [
        // 管理端专属路由
      ]
    }
  ]
})
```

### 管理端路由配置

```js
const adminManage = {
  name: 'admin',
  title: '管理后台',
  routePrefix: '/admin',

  // 管理端路由配置
  routes: [
    // 需要认证的路由
    {
      path: 'dashboard',
      name: 'admin.dashboard',
      component: () => import('./pages/Dashboard.vue'),
      meta: {
        authorization: true  // 需要认证（默认值）
      }
    },

    // 无需认证的路由
    {
      path: 'login',
      name: 'admin.login',
      component: () => import('./pages/Login.vue'),
      meta: {
        authorization: false  // 无需认证
      }
    }
  ],

  // 布局组件配置
  components: {
    authLayout: () => import('./layouts/AuthLayout.vue'),      // 认证布局
    noAuthLayout: () => import('./layouts/NoAuthLayout.vue'),  // 非认证布局
    notFound: () => import('./pages/404.vue'),                 // 404页面
    notAuthorized: () => import('./pages/403.vue'),            // 403页面
    error: () => import('./pages/500.vue')                     // 错误页面
  }
}
```

## 路由结构说明

### 自动生成的路由结构

DVHA 会自动为每个管理端生成以下路由结构：

```
/{manageName}
├── auth (认证布局)
│   ├── dashboard
│   ├── users
│   └── ...其他需要认证的路由
└── noAuth (非认证布局)
    ├── login
    ├── register
    └── ...其他无需认证的路由
```

### 路由命名规则

- 管理端根路由：`{manageName}`
- 认证路由容器：`{manageName}.auth`
- 非认证路由容器：`{manageName}.noAuth`
- 具体路由：按配置的 `name` 字段命名

## 路由元信息

### authorization 字段

控制路由是否需要认证：

```js
{
  path: 'dashboard',
  name: 'admin.dashboard',
  component: () => import('./pages/Dashboard.vue'),
  meta: {
    authorization: true,    // 需要认证（默认）
    // authorization: false,   // 无需认证
    // authorization: undefined // 默认需要认证
  }
}
```

### manageName 字段

系统自动添加，标识路由所属的管理端：

```js
// 系统自动添加
meta: {
  manageName: 'admin'
}
```

### 自定义元信息

```js
{
  path: 'users',
  name: 'admin.users',
  component: () => import('./pages/Users.vue'),
  meta: {
    authorization: true,
    title: '用户管理',
    icon: 'users',
    permissions: ['user.read'],
    breadcrumb: ['首页', '用户管理']
  }
}
```

## 布局组件配置

### 认证布局 (authLayout)

用于需要认证的页面，通常包含导航栏、侧边栏等：

```vue
<!-- AuthLayout.vue -->
<template>
  <div class="auth-layout">
    <header class="header">
      <!-- 顶部导航 -->
    </header>
    <aside class="sidebar">
      <!-- 侧边菜单 -->
    </aside>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>
```

### 非认证布局 (noAuthLayout)

用于登录、注册等无需认证的页面：

```vue
<!-- NoAuthLayout.vue -->
<template>
  <div class="no-auth-layout">
    <div class="container">
      <router-view />
    </div>
  </div>
</template>
```

### 错误页面组件

```js
components: {
  notFound: () => import('./pages/404.vue'),        // 404 页面
  notAuthorized: () => import('./pages/403.vue'),   // 403 页面
  error: () => import('./pages/500.vue')            // 500 页面
}
```

## 路由前缀配置

### 单管理端配置

```js
{
  name: 'admin',
  title: '管理后台',
  routePrefix: '/admin',  // 所有路由都会添加 /admin 前缀
  routes: [
    {
      path: 'dashboard',  // 实际路径: /admin/dashboard
      name: 'admin.dashboard',
      component: () => import('./pages/Dashboard.vue')
    }
  ]
}
```

### 多管理端配置

```js
manages: [
  {
    name: 'admin',
    title: '系统管理',
    routePrefix: '/admin',
    routes: [/* ... */]
  },
  {
    name: 'user',
    title: '用户中心',
    routePrefix: '/user',
    routes: [/* ... */]
  }
]
```

## 默认路由重定向

### 根路径重定向

访问根路径时自动重定向到默认管理端：

```js
{
  defaultManage: 'admin',  // 访问 / 时重定向到 /admin
  manages: [
    {
      name: 'admin',
      // ...
    }
  ]
}
```

### 兜底路由

系统自动添加兜底路由，处理未匹配的路径：

```js
// 自动生成
{
  name: 'default',
  path: '/:catchAll(.*)',
  redirect: '/admin'  // 重定向到默认管理端
}
```

## 实际使用示例

### 单管理端应用

```js
import { createDuxApp } from '@duxweb/dvha-core'

const app = createDuxApp({
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',

      routes: [
        // 登录页面（无需认证）
        {
          path: 'login',
          name: 'admin.login',
          component: () => import('./pages/Login.vue'),
          meta: { authorization: false }
        },

        // 仪表盘（需要认证）
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          component: () => import('./pages/Dashboard.vue')
        },

        // 用户管理
        {
          path: 'users',
          name: 'admin.users',
          component: () => import('./pages/Users.vue'),
          meta: {
            title: '用户管理',
            permissions: ['user.read']
          }
        }
      ],

      components: {
        authLayout: () => import('./layouts/AuthLayout.vue'),
        noAuthLayout: () => import('./layouts/LoginLayout.vue'),
        notFound: () => import('./pages/404.vue')
      }
    }
  ]
})
```

### 多管理端应用

```js
const app = createDuxApp({
  defaultManage: 'admin',
  manages: [
    // 系统管理端
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/admin',
      routes: [
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          component: () => import('./admin/Dashboard.vue')
        }
      ],
      components: {
        authLayout: () => import('./admin/Layout.vue'),
        noAuthLayout: () => import('./admin/LoginLayout.vue')
      }
    },

    // 用户中心
    {
      name: 'user',
      title: '用户中心',
      routePrefix: '/user',
      routes: [
        {
          path: 'profile',
          name: 'user.profile',
          component: () => import('./user/Profile.vue')
        }
      ],
      components: {
        authLayout: () => import('./user/Layout.vue'),
        noAuthLayout: () => import('./user/LoginLayout.vue')
      }
    }
  ]
})
```

## 工作流程

1. **初始化路由器**: `initRouter()` 函数创建 Vue Router 实例
2. **注册全局路由**: 添加全局配置的路由
3. **注册管理端路由**: 为每个管理端创建认证和非认证路由容器
4. **添加兜底路由**: 处理未匹配路径的重定向
5. **路由守卫处理**: 在导航守卫中处理认证和权限逻辑

## 注意事项

- **路由名称唯一性**: 确保所有路由名称在全局范围内唯一
- **布局组件**: 认证和非认证布局组件必须正确配置
- **路径规范**: 路由路径不要以 `/` 开头（除了全局路由）
- **元信息设置**: 合理使用 `meta` 字段传递路由相关信息
- **懒加载**: 建议使用动态导入实现组件懒加载
- **错误处理**: 配置错误页面组件以提供良好的用户体验