# 菜单配置

DVHA 框架提供了灵活的菜单配置系统，支持本地菜单和远程菜单，可以构建单级和多级菜单结构。

## 功能特点

- 📋 **本地菜单** - 静态配置的菜单结构
- 🌐 **远程菜单** - 从服务端动态获取的菜单
- 🏗️ **多级菜单** - 支持父子级菜单关系
- 🎯 **路径自动处理** - 自动添加管理端路径前缀
- 🔍 **菜单过滤** - 支持隐藏特定菜单项
- 🎨 **图标支持** - 支持菜单图标配置
- 📊 **排序功能** - 支持菜单项排序

## 菜单接口定义

```typescript
interface IMenu {
  label?: string           // 菜单名称
  name: string            // 菜单唯一标识
  path?: string           // 菜单路径
  icon?: string           // 菜单图标
  sort?: number           // 菜单排序
  parent?: string         // 父级菜单标识
  hidden?: boolean        // 是否隐藏
  loader?: string         // 菜单加载器
  component?: RouteComponent  // 菜单组件
  meta?: Record<string, any>  // 菜单元数据
}
```

## 本地菜单配置

### 基础菜单配置

```js
const adminManage = {
  name: 'admin',
  title: '管理后台',

  // 本地菜单配置
  menus: [
    {
      name: 'dashboard',
      label: '仪表盘',
      path: 'dashboard',
      icon: 'dashboard',
      sort: 1,
      component: () => import('./pages/Dashboard.vue')
    },
    {
      name: 'users',
      label: '用户管理',
      path: 'users',
      icon: 'users',
      sort: 2,
      component: () => import('./pages/Users.vue')
    }
  ]
}
```

### 多级菜单配置

```js
menus: [
  // 一级菜单
  {
    name: 'system',
    label: '系统管理',
    icon: 'system',
    sort: 1
  },

  // 二级菜单
  {
    name: 'system.users',
    label: '用户管理',
    path: 'system/users',
    icon: 'users',
    parent: 'system',  // 指定父级菜单
    sort: 1,
    component: () => import('./pages/system/Users.vue')
  },
  {
    name: 'system.roles',
    label: '角色管理',
    path: 'system/roles',
    icon: 'roles',
    parent: 'system',
    sort: 2,
    component: () => import('./pages/system/Roles.vue')
  },

  // 另一个一级菜单
  {
    name: 'content',
    label: '内容管理',
    icon: 'content',
    sort: 2
  },
  {
    name: 'content.articles',
    label: '文章管理',
    path: 'content/articles',
    parent: 'content',
    sort: 1,
    component: () => import('./pages/content/Articles.vue')
  }
]
```

### 隐藏菜单配置

```js
menus: [
  // 正常显示的菜单
  {
    name: 'dashboard',
    label: '仪表盘',
    path: 'dashboard',
    component: () => import('./pages/Dashboard.vue')
  },

  // 隐藏的菜单（不在菜单栏显示，但路由存在）
  {
    name: 'user.detail',
    label: '用户详情',
    path: 'users/:id',
    hidden: true,  // 隐藏菜单
    component: () => import('./pages/UserDetail.vue')
  }
]
```

## 远程菜单配置

### 启用远程菜单

```js
const adminManage = {
  name: 'admin',
  title: '管理后台',

  // 远程菜单API路径
  apiRoutePath: '/api/admin/menus',

  // 数据提供者（用于获取远程菜单）
  dataProvider: myDataProvider,

  // 本地菜单（会与远程菜单合并）
  menus: [
    {
      name: 'dashboard',
      label: '仪表盘',
      path: 'dashboard',
      component: () => import('./pages/Dashboard.vue')
    }
  ]
}
```

### 远程菜单API响应格式

```js
// GET /api/admin/menus 响应格式
{
  "data": [
    {
      "name": "users",
      "label": "用户管理",
      "path": "users",
      "icon": "users",
      "sort": 1
    },
    {
      "name": "system",
      "label": "系统管理",
      "icon": "system",
      "sort": 2
    },
    {
      "name": "system.settings",
      "label": "系统设置",
      "path": "system/settings",
      "parent": "system",
      "sort": 1
    }
  ]
}
```

## 菜单加载器

### 外部链接加载器

```js
{
  name: 'external.docs',
  label: '帮助文档',
  loader: 'iframe',  // 使用 iframe 加载器
  path: 'https://docs.example.com',
  icon: 'help'
}
```

### 自定义加载器

```js
{
  name: 'custom.tool',
  label: '自定义工具',
  loader: 'custom',
  path: 'tools/custom',
  component: () => import('./components/CustomLoader.vue')
}
```

## 菜单元数据

### 权限控制

```js
{
  name: 'users',
  label: '用户管理',
  path: 'users',
  component: () => import('./pages/Users.vue'),
  meta: {
    permissions: ['user.read', 'user.write'],  // 所需权限
    roles: ['admin', 'manager']  // 所需角色
  }
}
```

### 页面配置

```js
{
  name: 'dashboard',
  label: '仪表盘',
  path: 'dashboard',
  component: () => import('./pages/Dashboard.vue'),
  meta: {
    title: '控制台 - 仪表盘',  // 页面标题
    keepAlive: true,          // 保持组件活跃
    breadcrumb: false,        // 不显示面包屑
    layout: 'full'            // 布局类型
  }
}
```

## 完整配置示例

### 单管理端菜单

```js
import { createDux } from '@duxweb/dvha-core'

const app = createDux({
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',

      menus: [
        // 仪表盘
        {
          name: 'dashboard',
          label: '仪表盘',
          path: 'dashboard',
          icon: 'dashboard',
          sort: 1,
          component: () => import('./pages/Dashboard.vue')
        },

        // 用户管理
        {
          name: 'users',
          label: '用户管理',
          icon: 'users',
          sort: 2
        },
        {
          name: 'users.list',
          label: '用户列表',
          path: 'users',
          parent: 'users',
          sort: 1,
          component: () => import('./pages/users/List.vue')
        },
        {
          name: 'users.detail',
          label: '用户详情',
          path: 'users/:id',
          parent: 'users',
          hidden: true,  // 隐藏在菜单中
          component: () => import('./pages/users/Detail.vue')
        },

        // 系统管理
        {
          name: 'system',
          label: '系统管理',
          icon: 'system',
          sort: 3
        },
        {
          name: 'system.settings',
          label: '系统设置',
          path: 'system/settings',
          parent: 'system',
          sort: 1,
          component: () => import('./pages/system/Settings.vue'),
          meta: {
            permissions: ['system.admin']
          }
        },

        // 外部链接
        {
          name: 'docs',
          label: '帮助文档',
          loader: 'iframe',
          path: 'https://docs.example.com',
          icon: 'help',
          sort: 4
        }
      ]
    }
  ]
})
```

### 多管理端菜单

```js
const app = createDux({
  defaultManage: 'admin',
  manages: [
    // 系统管理端
    {
      name: 'admin',
      title: '系统管理',
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
      ]
    },

    // 用户中心
    {
      name: 'user',
      title: '用户中心',
      menus: [
        {
          name: 'profile',
          label: '个人资料',
          path: 'profile',
          icon: 'profile',
          component: () => import('./user/Profile.vue')
        },
        {
          name: 'settings',
          label: '账户设置',
          path: 'settings',
          icon: 'settings',
          component: () => import('./user/Settings.vue')
        }
      ]
    }
  ]
})
```

### 远程菜单配置

```js
const adminManage = {
  name: 'admin',
  title: '管理后台',

  // 远程菜单配置
  apiRoutePath: '/api/admin/menus',
  dataProvider: {
    custom: async (options, manage, auth) => {
      const response = await fetch(options.path, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })
      return await response.json()
    }
  },

  // 本地基础菜单
  menus: [
    {
      name: 'dashboard',
      label: '仪表盘',
      path: 'dashboard',
      icon: 'dashboard',
      sort: 0,  // 优先显示
      component: () => import('./pages/Dashboard.vue')
    }
  ]
}
```

## 菜单处理流程

### 菜单初始化流程

1. **本地菜单加载**: 加载管理端配置中的本地菜单
2. **远程菜单获取**: 如果配置了 `apiRoutePath`，则获取远程菜单
3. **菜单合并**: 将本地菜单和远程菜单合并
4. **路径处理**: 为菜单路径添加管理端前缀
5. **路由注册**: 将菜单注册为 Vue Router 路由
6. **菜单排序**: 根据 `sort` 字段对菜单进行排序

### 路径自动处理

```js
// 配置的菜单路径
{
  name: 'users',
  path: 'users',  // 原始路径
}

// 系统自动处理后的路径
{
  name: 'users',
  path: '/admin/users',  // 添加了管理端前缀
}
```

## 菜单使用

### 获取菜单数据

```vue
<script setup>
import { useMenu } from '@duxweb/dvha-core'

const { menus, getMenuTree } = useMenu()

// 获取扁平的菜单列表
console.log(menus.value)

// 获取树形菜单结构
const menuTree = getMenuTree()
console.log(menuTree)
</script>
```

### 渲染菜单

```vue
<template>
  <nav class="menu">
    <div
      v-for="menu in visibleMenus"
      :key="menu.name"
      class="menu-item"
    >
      <router-link
        v-if="menu.path"
        :to="menu.path"
        class="menu-link"
      >
        <i v-if="menu.icon" :class="menu.icon"></i>
        {{ menu.label }}
      </router-link>

      <!-- 子菜单 -->
      <div v-if="menu.children" class="submenu">
        <div
          v-for="child in menu.children"
          :key="child.name"
          class="submenu-item"
        >
          <router-link :to="child.path">
            {{ child.label }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useMenu } from '@duxweb/dvha-core'

const { getMenuTree } = useMenu()

const visibleMenus = computed(() => {
  return getMenuTree().filter(menu => !menu.hidden)
})
</script>
```

## 注意事项

- **菜单名称唯一性**: 确保 `name` 字段在管理端内唯一
- **路径规范**: 菜单路径不要以 `/` 开头，系统会自动添加前缀
- **父子关系**: 使用 `parent` 字段建立菜单层级关系
- **排序优先级**: `sort` 值越小优先级越高
- **远程菜单格式**: 远程菜单API返回的数据格式要符合 `IMenu` 接口
- **组件懒加载**: 建议使用动态导入实现组件懒加载
- **权限控制**: 通过 `meta` 字段传递权限相关信息