# useCan

`useCan` hook 用于检查当前用户是否具有指定的权限，基于认证提供者的权限检查逻辑。

## 功能特点

- 🛡️ **权限检查** - 检查用户是否具有特定权限
- 🎯 **灵活配置** - 支持多种权限格式和检查逻辑
- ⚡ **高性能** - 本地权限检查，无需网络请求
- 📱 **响应式** - 权限状态变化自动更新
- 🏢 **多管理端** - 支持多管理端独立权限检查
- 🔧 **可扩展** - 支持自定义权限检查逻辑

## 接口关系

该hook调用当前管理端的 `authProvider.can(name, params, manage, auth)` 方法进行权限检查。

```typescript
// 认证提供者接口
interface IAuthProvider {
  can?: (name: string, params?: any, manage?: IManageHook, auth?: IUserState) => boolean
}
```

## 使用方法

```typescript
import { useCan } from '@duxweb/dvha-core'

const can = useCan()

// 检查权限
if (can('user.read')) {
  console.log('用户有读取权限')
}

// 带参数的权限检查
if (can('post.edit', { postId: 123 })) {
  console.log('用户可以编辑指定文章')
}
```

## 参数说明

| 参数         | 类型     | 必需 | 说明                             |
| ------------ | -------- | ---- | -------------------------------- |
| `manageName` | `string` | ❌   | 管理端名称，不传则使用当前管理端 |

## 返回值

| 字段   | 类型                                      | 说明         |
| ------ | ----------------------------------------- | ------------ |
| 返回值 | `(name: string, params?: any) => boolean` | 权限检查函数 |

### 权限检查函数参数

| 参数     | 类型     | 必需 | 说明               |
| -------- | -------- | ---- | ------------------ |
| `name`   | `string` | ✅   | 权限名称或路由名称 |
| `params` | `any`    | ❌   | 权限检查参数       |

## 基本用法示例

```typescript
import { useCan } from '@duxweb/dvha-core'

const can = useCan()

// 基本权限检查
const canReadUsers = can('user.read')
const canWriteUsers = can('user.write')
const canDeleteUsers = can('user.delete')

// 在模板中使用
const showEditButton = computed(() => can('post.edit'))
const showDeleteButton = computed(() => can('post.delete'))

// 条件渲染
function renderUserActions() {
  const actions = []

  if (can('user.edit')) {
    actions.push({ label: '编辑', action: 'edit' })
  }

  if (can('user.delete')) {
    actions.push({ label: '删除', action: 'delete' })
  }

  return actions
}
```

## 高级用法示例

```typescript
// 带参数的权限检查
function canEditPost(postId: number) {
  return can('post.edit', { postId })
}

function canAccessResource(resourceType: string, resourceId: number) {
  return can(`${resourceType}.access`, { id: resourceId })
}

// 多管理端权限检查
const adminCan = useCan('admin')
const userCan = useCan('user')

const hasAdminPermission = adminCan('system.manage')
const hasUserPermission = userCan('profile.edit')

// 组合权限检查
function hasAnyEditPermission() {
  return can('user.edit') || can('post.edit') || can('system.edit')
}

function hasAllRequiredPermissions() {
  return can('user.read') && can('user.write') && can('user.delete')
}

// 路由权限检查
const router = useRouter()

function navigateWithPermission(routeName: string) {
  if (can(routeName)) {
    router.push({ name: routeName })
  }
  else {
    console.warn('没有访问权限')
  }
}

// 动态权限检查
function checkDynamicPermission(action: string, resource: string) {
  const permissionName = `${resource}.${action}`
  return can(permissionName)
}
```

## 在组件中使用

### 条件渲染

```vue
<script setup>
import { useCan } from '@duxweb/dvha-core'

const can = useCan()

// 复杂权限检查逻辑
function canManageUser(user) {
  // 管理员可以管理所有用户
  if (can('user.manage.all')) {
    return true
  }

  // 用户只能管理自己
  if (can('user.manage.self') && user.id === currentUser.id) {
    return true
  }

  return false
}
</script>

<template>
  <div class="user-actions">
    <!-- 基本权限检查 -->
    <button v-if="can('user.create')" @click="createUser">
      创建用户
    </button>

    <!-- 带参数的权限检查 -->
    <button
      v-if="can('user.edit', { userId: user.id })"
      @click="editUser(user.id)"
    >
      编辑用户
    </button>

    <!-- 复杂权限逻辑 -->
    <button
      v-if="canManageUser(user)"
      @click="manageUser(user)"
    >
      管理用户
    </button>
  </div>
</template>
```

### 路由守卫

```typescript
import { useCan } from '@duxweb/dvha-core'

const can = useCan()

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const requiredPermission = to.meta.permission

  if (requiredPermission && !can(requiredPermission)) {
    next({ name: 'unauthorized' })
  }
  else {
    next()
  }
})

// 组件内守卫
onMounted(() => {
  if (!can('page.access')) {
    router.push({ name: 'unauthorized' })
  }
})
```

## 权限数据格式

### 数组格式

```json
// 用户权限数据
{
  "permission": [
    "user.read",
    "user.write",
    "post.read",
    "post.write",
    "system.read"
  ]
}
```

```typescript
// 权限检查
can('user.read') // true
can('user.delete') // false
```

### 对象格式

```json
// 用户权限数据
{
  "permission": {
    "user.read": true,
    "user.write": true,
    "user.delete": false,
    "post.read": true,
    "post.write": false
  }
}
```

```typescript
// 权限检查
can('user.read') // true
can('user.delete') // false
```

### 通配符支持

```json
// 用户权限数据
{
  "permission": [
    "user.*",
    "post.read",
    "*.read"
  ]
}
```

```typescript
// 权限检查（需要认证提供者支持）
can('user.read') // true (匹配 user.*)
can('user.write') // true (匹配 user.*)
can('post.read') // true (直接匹配)
can('post.write') // false
```

## 工作流程

1. 调用 `useCan()` 获取权限检查函数
2. 调用权限检查函数 `can(name, params)`
3. 从 authStore 获取当前用户信息
4. 调用认证提供者的 `can` 方法进行权限检查
5. 如果没有配置 `can` 方法，默认返回 `true`
6. 返回权限检查结果

## 注意事项

- 权限检查是同步操作，基于本地用户状态
- 如果认证提供者没有实现 `can` 方法，默认返回 `true`
- 权限数据格式取决于后端实现和认证提供者配置
- 建议在关键操作前进行权限检查
- 多管理端环境下，需要指定管理端名称来检查对应的权限
- 权限检查结果会随用户状态变化自动更新
- 建议配合路由守卫和组件权限控制使用

## DuxCan 组件

DVHA 提供了 `DuxCan` 组件用于基于权限的条件渲染：

### 基本用法

```vue
<script setup>
import { DuxCan } from '@duxweb/dvha-core'
</script>

<template>
  <!-- 基本权限检查 -->
  <DuxCan name="user.create">
    <button @click="createUser">
      创建用户
    </button>
  </DuxCan>

  <!-- 带参数的权限检查 -->
  <DuxCan name="post.edit" :params="{ postId: post.id }">
    <button @click="editPost(post.id)">
      编辑文章
    </button>
  </DuxCan>

  <!-- 带回退内容 -->
  <DuxCan name="admin.access">
    <template #default>
      <div class="admin-panel">
        管理员面板
      </div>
    </template>
    <template #fallback>
      <div class="no-permission">
        权限不足
      </div>
    </template>
  </DuxCan>
</template>
```

### 组件属性

| 属性     | 类型     | 必需 | 说明         |
| -------- | -------- | ---- | ------------ |
| `name`   | `string` | ✅   | 权限名称     |
| `params` | `any`    | ❌   | 权限检查参数 |

### 插槽

| 插槽       | 说明                       |
| ---------- | -------------------------- |
| `default`  | 有权限时显示的内容         |
| `fallback` | 无权限时显示的内容（可选） |

### 高级用法

```vue
<template>
  <!-- 复杂权限组合 -->
  <div class="user-management">
    <DuxCan name="user.read">
      <UserList />
    </DuxCan>

    <DuxCan name="user.create">
      <CreateUserButton />
    </DuxCan>

    <DuxCan name="user.export">
      <ExportButton />
    </DuxCan>
  </div>

  <!-- 动态权限检查 -->
  <DuxCan
    v-for="action in userActions"
    :key="action.name"
    :name="action.permission"
    :params="action.params"
  >
    <ActionButton :action="action" />
  </DuxCan>
</template>
```

## v-can 指令

DVHA 提供了 `v-can` 指令用于简单的权限控制：

### 基本用法

```vue
<script setup>
import { ref } from 'vue'

const permissionName = ref('user.edit')
</script>

<template>
  <!-- 基本权限检查 -->
  <button v-can="'user.create'" @click="createUser">
    创建用户
  </button>

  <!-- 动态权限名称 -->
  <button v-can="permissionName" @click="handleAction">
    执行操作
  </button>

  <!-- 权限不足时元素会被移除 -->
  <div v-can="'admin.access'" class="admin-panel">
    管理员专用功能
  </div>
</template>
```

### 注意事项

- `v-can` 指令会在权限检查失败时直接移除 DOM 元素
- 指令只支持权限名称，不支持参数传递
- 如果需要更复杂的权限逻辑，建议使用 `DuxCan` 组件或 `useCan` hook

### 指令 vs 组件 vs Hook

| 方式          | 适用场景       | 优点                   | 缺点                 |
| ------------- | -------------- | ---------------------- | -------------------- |
| `v-can` 指令  | 简单权限控制   | 使用简单，代码简洁     | 功能有限，不支持参数 |
| `DuxCan` 组件 | 复杂权限控制   | 功能完整，支持回退内容 | 需要额外的组件包装   |
| `useCan` hook | 编程式权限检查 | 最灵活，可用于逻辑判断 | 需要手动处理渲染逻辑 |

## 最佳实践

### 1. 权限命名规范

```typescript
// 推荐的权限命名格式
const permissions = [
  'user.read', // 模块.操作
  'user.write',
  'user.delete',
  'post.read',
  'post.write',
  'system.manage',
  'report.export'
]
```

### 2. 权限分层设计

```typescript
// 分层权限设计
const rolePermissions = {
  super_admin: ['*'], // 超级管理员
  admin: ['user.*', 'post.*'], // 管理员
  editor: ['post.read', 'post.write'], // 编辑者
  viewer: ['*.read'] // 查看者
}
```

### 3. 组件权限封装

```vue
<!-- PermissionButton.vue -->
<script setup>
import { DuxCan } from '@duxweb/dvha-core'

defineProps({
  permission: { type: String, required: true },
  params: { type: Object },
  buttonClass: { type: String },
  disabled: { type: Boolean }
})

defineEmits(['click'])
</script>

<template>
  <DuxCan :name="permission" :params="params">
    <button
      :class="buttonClass"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <slot />
    </button>
  </DuxCan>
</template>
```

### 4. 路由权限配置

```typescript
const routes = [
  {
    name: 'users',
    path: '/users',
    component: UserList,
    meta: {
      can: true, // 使用路由名称检查权限
      title: '用户管理'
    }
  },
  {
    name: 'settings',
    path: '/settings',
    component: Settings,
    meta: {
      can: 'system.manage', // 指定具体权限
      title: '系统设置'
    }
  }
]
```

## 相关文档

- 📚 [认证提供者](/providers/auth) - 了解权限检查的实现原理
- 🛡️ [路由权限](/router/config) - 路由级别的权限控制
- 🔐 [用户认证](/hooks/auth/useGetAuth) - 获取用户认证信息
- 🏢 [多管理端](/manage/multiple) - 多管理端权限管理
