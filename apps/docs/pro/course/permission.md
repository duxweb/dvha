# 权限管理与路由守卫

本教程将教你如何在 DVHA Pro 中实现完整的权限管理系统，包括角色权限、菜单权限、页面权限和按钮权限。

## 📋 前置条件

- 已完成 [登录与鉴权](/pro/course/login) 教程
- 已完成 [自定义数据接口](/pro/course/api) 教程
- 了解 Vue Router 和权限控制概念

## 🎯 目标效果

完成本教程后，你将能够：
- 🔐 实现基于角色的权限控制
- 🧭 配置动态菜单和路由权限
- 🔒 添加页面级和按钮级权限控制
- ⚡ 使用 `useCan` Hook 进行权限判断

## 💡 权限设计理念

在 DVHA 中，权限控制采用简洁高效的设计：

- **权限在登录时返回**，存储在用户状态中，无需单独的权限接口
- **菜单自动处理权限显示**，根据用户权限自动显示/隐藏菜单项
- **路由自动处理 401**，当 API 返回 401 时自动跳转登录页
- **权限标识采用层级命名**，如 `user.view`、`user.create`、`user.edit`

## 🔧 第一步：登录时返回权限

修改 `src/authProvider.ts`，在登录响应中包含权限信息：

```typescript{25-35}
import type { AuthProvider } from '@duxweb/dvha-core'

export const authProvider: AuthProvider = {
  // 登录方法
  login: async ({ username, password }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()

      if (result.code === 200) {
        return {
          success: true,
          message: '登录成功',
          data: {
            token: result.data.token,
            id: result.data.user.id,
            info: {
              name: result.data.user.name,
              email: result.data.user.email,
              avatar: result.data.user.avatar,
              role: result.data.user.role,
            },
            // 关键：权限在登录时返回
            permission: result.data.permissions || []
          }
        }
      } else {
        return {
          success: false,
          message: result.message || '登录失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `登录失败: ${error.message}`
      }
    }
  },

  // 权限检查方法
  can: (name, params, manage, auth) => {
    if (!auth?.permission) {
      return false
    }

    // 数组形式权限检查
    if (Array.isArray(auth.permission)) {
      return auth.permission.includes(name)
    }

    // 对象形式权限检查
    if (typeof auth.permission === 'object') {
      return auth.permission[name] === true
    }

    return false
  },

  // ... 其他方法
}
```

## 🧭 第二步：配置动态菜单

修改 `main.ts`，使用远程菜单配置：

```typescript{10-15}
import { createApp } from 'vue'
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro } from '@duxweb/dvha-pro'
import App from './App.vue'
import { authProvider } from './authProvider'
import { dataProvider } from './dataProvider'

const app = createApp(App)

const config = {
  authProvider,
  dataProvider,

  // 使用远程菜单
  asyncMenus: true,
  menuPath: '/api/auth/menus', // 菜单接口路径

  // 基础路由（不需要权限的页面）
  menus: [
    {
      name: 'dashboard',
      title: '仪表盘',
      icon: 'i-tabler:dashboard',
      path: '/dashboard'
    }
  ]
}

app.use(createDux(config))
app.use(createDuxPro())
app.mount('#app')
```

## 🔒 第三步：后端接口格式

### 登录接口 `/api/auth/login`

```typescript
// 请求格式
{
  username: 'admin',
  password: '123456'
}

// 响应格式
{
  code: 200,
  message: '登录成功',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    user: {
      id: 1,
      name: '管理员',
      email: 'admin@example.com',
      avatar: '/avatar.jpg',
      role: 'admin'
    },
    // 关键：权限列表在登录时返回
    permissions: [
      'user.view',    // 用户管理菜单权限
      'user.list',    // 用户列表页面权限
      'user.create',  // 添加用户页面权限
      'user.edit',    // 编辑用户按钮权限
      'user.delete',  // 删除用户按钮权限
      'article.view', // 文章管理菜单权限
      'article.create' // 创建文章按钮权限
    ]
  }
}
```

### 菜单接口 `/api/auth/menus`

```typescript
// 响应格式（DVHA 会自动根据权限过滤菜单）
{
  code: 200,
  data: {
    menus: [
      {
        name: 'user.view', // name 就是权限标识
        title: '用户管理',
        icon: 'i-tabler:users',
        path: '/user',
        children: [
          {
            name: 'user.list',
            title: '用户列表',
            path: '/user/list'
          },
          {
            name: 'user.create',
            title: '添加用户',
            path: '/user/create'
          }
        ]
      },
      {
        name: 'article.view',
        title: '文章管理',
        icon: 'i-tabler:article',
        path: '/article'
      }
    ]
  }
}
```

## 📱 第四步：使用内置权限组件

DVHA 提供了内置的权限组件和指令，可以直接使用：

### 使用 DuxCan 组件

```vue
<script setup>
import { DuxCan } from '@duxweb/dvha-core'
import { NButton } from 'naive-ui'
</script>

<template>
  <div>
    <!-- 使用 DuxCan 组件 -->
    <DuxCan name="user.create">
      <NButton type="primary">
        新增用户
      </NButton>
    </DuxCan>

    <!-- 带回退内容 -->
    <DuxCan name="user.delete">
      <template #default>
        <NButton type="error">
          删除用户
        </NButton>
      </template>
      <template #fallback>
        <span class="text-gray-400">无删除权限</span>
      </template>
    </DuxCan>

    <!-- 使用 v-can 指令 -->
    <NButton v-can="'user.edit'">
      编辑用户
    </NButton>
    <NButton v-can="'user.export'">
      导出数据
    </NButton>
  </div>
</template>
```

### 使用 useCan Hook

```vue
<script setup>
import { useCan } from '@duxweb/dvha-core'
import { NButton, NIcon } from 'naive-ui'

const can = useCan()

// 表格列配置中的权限控制
const columns = [
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      const actions = []

      if (can('user.edit')) {
        actions.push(
          h(NButton, { size: 'small' }, () => '编辑')
        )
      }

      if (can('user.delete')) {
        actions.push(
          h(NButton, { size: 'small', type: 'error' }, () => '删除')
        )
      }

      return actions
    }
  }
]
</script>

<template>
  <div>
    <!-- 工具栏权限控制 -->
    <div class="toolbar">
      <NButton v-if="can('user.create')" type="primary">
        <template #icon>
          <NIcon><i class="i-tabler:plus" /></NIcon>
        </template>
        新增用户
      </NButton>

      <NButton v-if="can('user.export')" type="default">
        <template #icon>
          <NIcon><i class="i-tabler:download" /></NIcon>
        </template>
        导出数据
      </NButton>
    </div>
  </div>
</template>
```

## 🧪 第五步：测试权限功能

1. 配置不同角色的测试用户
2. 测试菜单权限：不同角色看到不同菜单
3. 测试按钮权限：根据权限显示/隐藏按钮
4. 测试 API 权限：后端返回 401 时自动跳转登录

```bash
npm run dev
```

## 💡 高级权限控制

### 基于角色的权限检查

```typescript
// 在 authProvider 中实现复杂权限逻辑
can: (name, params, manage, auth) => {
  if (!auth?.permission) {
    return false
  }

  // 超级管理员拥有所有权限
  if (auth.info?.role === 'super_admin') {
    return true
  }

  // 数组形式权限检查
  if (Array.isArray(auth.permission)) {
    // 完全匹配
    if (auth.permission.includes(name)) {
      return true
    }

    // 通配符权限检查
    return auth.permission.some((permission) => {
      if (permission.endsWith('.*')) {
        const prefix = permission.slice(0, -2)
        return name.startsWith(`${prefix}.`)
      }
      return false
    })
  }

  return false
}
```

### 带参数的权限检查

```typescript
// 检查资源级权限
can: (name, params, manage, auth) => {
  // 基础权限检查
  if (!auth?.permission?.includes(name)) {
    return false
  }

  // 资源级权限检查
  if (params?.resourceId && params?.userId) {
    // 只能操作自己的资源
    if (name.includes('.edit') || name.includes('.delete')) {
      return params.userId === auth.id
    }
  }

  return true
}
```

使用带参数的权限检查：

```vue
<script setup>
const can = useCan()
const { user } = useAuth()

// 检查是否可以编辑特定用户
function canEditUser(targetUser) {
  return can('user.edit', {
    resourceId: targetUser.id,
    userId: user.value.id
  })
}
</script>

<template>
  <NButton
    v-if="canEditUser(row)"
    @click="editUser(row)"
  >
    编辑
  </NButton>
</template>
```

## 🔄 权限更新处理

当用户权限发生变化时，可以通过以下方式更新：

```typescript
// 在需要的地方重新检查认证状态
import { useCheck } from '@duxweb/dvha-core'

const { mutate: checkAuth } = useCheck()

// 权限变更后重新检查
async function handlePermissionUpdate() {
  try {
    await checkAuth()
    message.success('权限已更新')
  }
  catch (error) {
    message.error('权限更新失败')
  }
}
```

## 💡 常见问题

::: details 菜单没有按权限显示怎么办？
检查菜单的 `name` 字段是否与用户权限列表中的权限标识匹配。DVHA 会自动根据权限过滤菜单。
:::

::: details 如何实现字段级权限控制？
在表格列配置或表单字段中使用 `can()` 方法判断，动态控制字段的显示和编辑权限。
:::

::: details API 返回 401 后如何处理？
DVHA 会自动处理 401 响应，清除用户状态并跳转到登录页，无需手动处理。
:::

::: details 权限检查的性能如何？
权限检查是本地操作，基于内存中的用户状态，性能很高。权限数据在登录时获取并缓存。
:::

## 🎯 总结

通过本教程，你学会了：

✅ **在登录时返回权限**，无需单独的权限接口
✅ **使用 `useCan` 进行权限检查**，支持页面和按钮级控制
✅ **利用内置权限组件**，如 `DuxCan` 和 `v-can` 指令
✅ **菜单自动权限过滤**，根据用户权限显示菜单
✅ **自动处理 401 响应**，无需手动路由守卫

DVHA 的权限系统设计简洁高效，通过登录时返回权限、菜单自动过滤、内置权限检查等机制，让权限管理变得简单而强大。
