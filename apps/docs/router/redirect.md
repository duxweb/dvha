# 路由跳转

DVHA 框架提供了便捷的路由跳转功能，支持管理端内跳转、跨管理端跳转和路径生成等功能。

## 功能特点

- 🔗 **智能路径生成** - 自动添加管理端前缀
- 🏗️ **管理端感知** - 自动识别当前管理端
- 🌐 **跨管理端跳转** - 支持在不同管理端间跳转
- 📍 **路径标准化** - 统一的路径处理逻辑
- 🔄 **编程式导航** - 支持代码控制的路由跳转
- 📋 **参数传递** - 支持路由参数和查询参数

## 基础路由跳转

### 使用 vue-router

```vue
<template>
  <!-- 声明式导航 -->
  <router-link to="/admin/users">用户管理</router-link>

  <!-- 编程式导航 -->
  <button @click="goToUsers">跳转到用户管理</button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToUsers = () => {
  router.push('/admin/users')
}
</script>
```

### 使用 useManage 路径生成

```vue
<template>
  <!-- 使用自动生成的路径 -->
  <router-link :to="manage.getRoutePath('users')">用户管理</router-link>

  <button @click="goToUsers">跳转到用户管理</button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()
const manage = useManage()

const goToUsers = () => {
  // 自动添加当前管理端前缀
  router.push(manage.getRoutePath('users'))
}
</script>
```

## 路径生成功能

### getRoutePath 方法

`useManage` hook 提供的 `getRoutePath` 方法可以自动生成带有管理端前缀的完整路径：

```js
import { useManage } from '@duxweb/dvha-core'

const manage = useManage()

// 基础路径生成
manage.getRoutePath('users')          // 返回: '/admin/users'
manage.getRoutePath('system/roles')   // 返回: '/admin/system/roles'

// 带参数的路径
manage.getRoutePath('users/123')      // 返回: '/admin/users/123'

// 绝对路径（不会添加前缀）
manage.getRoutePath('/external')      // 返回: '/external'

// 空路径处理
manage.getRoutePath('')               // 返回: '/admin'
manage.getRoutePath('/')              // 返回: '/admin'
```

### 参数化路径

```js
// 动态生成参数路径
const userId = 123
const userPath = manage.getRoutePath(`users/${userId}`)  // '/admin/users/123'

// 带查询参数
const usersPath = manage.getRoutePath('users') + '?page=2&size=10'
// '/admin/users?page=2&size=10'
```

## 不同跳转方式

### 声明式导航

```vue
<template>
  <!-- 基础跳转 -->
  <router-link :to="manage.getRoutePath('dashboard')">
    仪表盘
  </router-link>

  <!-- 带参数跳转 -->
  <router-link
    :to="{
      path: manage.getRoutePath('users'),
      query: { page: 1, size: 20 }
    }"
  >
    用户列表
  </router-link>

  <!-- 命名路由跳转 -->
  <router-link
    :to="{
      name: 'admin.users',
      params: { id: 123 }
    }"
  >
    用户详情
  </router-link>
</template>

<script setup>
import { useManage } from '@duxweb/dvha-core'
const manage = useManage()
</script>
```

### 编程式导航

```js
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()
const manage = useManage()

// push 方法（会保留历史记录）
const navigateToUsers = () => {
  router.push(manage.getRoutePath('users'))
}

// replace 方法（替换当前记录）
const replaceToUsers = () => {
  router.replace(manage.getRoutePath('users'))
}

// go 方法（历史记录导航）
const goBack = () => {
  router.go(-1)  // 后退一步
}

const goForward = () => {
  router.go(1)   // 前进一步
}
```

### 带参数的跳转

```js
// 路径参数
const goToUserDetail = (userId) => {
  router.push(manage.getRoutePath(`users/${userId}`))
}

// 查询参数
const goToUsersWithFilter = (filters) => {
  router.push({
    path: manage.getRoutePath('users'),
    query: filters
  })
}

// 命名路由 + 参数
const goToUserEdit = (userId) => {
  router.push({
    name: 'admin.users.edit',
    params: { id: userId }
  })
}

// 混合参数
const goToUserPage = (userId, page = 1) => {
  router.push({
    path: manage.getRoutePath(`users/${userId}`),
    query: { page, tab: 'profile' }
  })
}
```

## 跨管理端跳转

### 跳转到其他管理端

```js
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()

// 获取特定管理端的 manage 实例
const adminManage = useManage('admin')
const userManage = useManage('user')

// 跳转到其他管理端
const goToAdminDashboard = () => {
  router.push(adminManage.getRoutePath('dashboard'))  // '/admin/dashboard'
}

const goToUserProfile = () => {
  router.push(userManage.getRoutePath('profile'))     // '/user/profile'
}
```

### 管理端切换

```js
// 从当前管理端跳转到另一个管理端
const switchToAdmin = () => {
  const adminManage = useManage('admin')
  router.push(adminManage.getRoutePath(''))  // 跳转到 admin 管理端首页
}

const switchToUser = () => {
  const userManage = useManage('user')
  router.push(userManage.getRoutePath(''))   // 跳转到 user 管理端首页
}
```

## 路由守卫中的跳转

### 认证检查跳转

```js
// 在路由守卫中进行跳转
router.beforeEach((to, from, next) => {
  const manageName = to.meta.manageName
  const manage = useManage(manageName)

  if (!isAuthenticated(manageName)) {
    // 跳转到登录页
    next(manage.getRoutePath('login'))
  } else {
    next()
  }
})
```

### 权限检查跳转

```js
router.beforeEach((to, from, next) => {
  const manageName = to.meta.manageName
  const manage = useManage(manageName)

  if (!hasPermission(to.meta.permissions)) {
    // 跳转到无权限页面
    next(manage.getRoutePath('notAuthorized'))
  } else {
    next()
  }
})
```

## 实际应用示例

### 用户管理页面

```vue
<template>
  <div class="user-management">
    <!-- 面包屑导航 -->
    <nav class="breadcrumb">
      <router-link :to="manage.getRoutePath('')">首页</router-link>
      <span> / </span>
      <span>用户管理</span>
    </nav>

    <!-- 操作按钮 -->
    <div class="actions">
      <button @click="createUser">新建用户</button>
      <button @click="exportUsers">导出用户</button>
    </div>

    <!-- 用户列表 -->
    <div class="user-list">
      <div
        v-for="user in users"
        :key="user.id"
        class="user-item"
        @click="viewUser(user.id)"
      >
        <span>{{ user.name }}</span>
        <button @click.stop="editUser(user.id)">编辑</button>
        <button @click.stop="deleteUser(user.id)">删除</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()
const manage = useManage()
const users = ref([])

// 新建用户
const createUser = () => {
  router.push(manage.getRoutePath('users/create'))
}

// 查看用户详情
const viewUser = (userId) => {
  router.push(manage.getRoutePath(`users/${userId}`))
}

// 编辑用户
const editUser = (userId) => {
  router.push(manage.getRoutePath(`users/${userId}/edit`))
}

// 导出功能（新窗口打开）
const exportUsers = () => {
  const exportUrl = manage.getRoutePath('users/export')
  window.open(exportUrl, '_blank')
}

// 删除用户后的跳转
const deleteUser = async (userId) => {
  if (confirm('确定删除此用户？')) {
    await deleteUserApi(userId)
    // 删除成功后刷新当前页面
    router.go(0)
  }
}
</script>
```

### 表单页面跳转

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- 表单内容 -->
    <div class="form-actions">
      <button type="submit" :disabled="loading">
        {{ isEdit ? '更新' : '创建' }}
      </button>
      <button type="button" @click="cancel">取消</button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const route = useRoute()
const router = useRouter()
const manage = useManage()

const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

// 表单提交
const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await updateUser(route.params.id, formData)
    } else {
      await createUser(formData)
    }

    // 成功后跳转到列表页
    router.push(manage.getRoutePath('users'))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 取消操作
const cancel = () => {
  // 返回上一页或跳转到列表页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push(manage.getRoutePath('users'))
  }
}
</script>
```

### 条件跳转

```js
import { useRouter } from 'vue-router'
import { useManage, useIsLogin } from '@duxweb/dvha-core'

const router = useRouter()
const manage = useManage()
const isLogin = useIsLogin()

// 根据登录状态跳转
const conditionalRedirect = () => {
  if (isLogin.value) {
    router.push(manage.getRoutePath('dashboard'))
  } else {
    router.push(manage.getRoutePath('login'))
  }
}

// 根据用户角色跳转
const roleBasedRedirect = (userRole) => {
  switch (userRole) {
    case 'admin':
      router.push(manage.getRoutePath('admin/dashboard'))
      break
    case 'user':
      router.push(manage.getRoutePath('user/profile'))
      break
    default:
      router.push(manage.getRoutePath(''))
  }
}

// 根据权限跳转
const permissionBasedRedirect = (permissions) => {
  if (permissions.includes('user.manage')) {
    router.push(manage.getRoutePath('users'))
  } else if (permissions.includes('content.manage')) {
    router.push(manage.getRoutePath('content'))
  } else {
    router.push(manage.getRoutePath('dashboard'))
  }
}
```

## 注意事项

- **路径一致性**: 使用 `getRoutePath` 确保路径格式一致
- **管理端识别**: 跨管理端跳转时要指定正确的管理端名称
- **参数处理**: 注意路径参数和查询参数的区别
- **历史记录**: 选择合适的导航方法（push vs replace）
- **错误处理**: 跳转失败时要有适当的错误处理
- **性能考虑**: 避免不必要的路由跳转
- **用户体验**: 提供合适的加载状态和反馈