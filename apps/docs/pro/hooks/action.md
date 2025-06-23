# useAction - 操作增强

`useAction` 是一个强大的 Hook，用于处理各种用户操作，如模态框显示、确认对话框、删除操作等。它提供了统一的操作处理接口，简化了复杂的用户交互逻辑。

## 特性

- **多种操作类型**: 支持模态框、抽屉、确认框、请求、删除、链接跳转等操作
- **自动消息提示**: 集成成功和错误消息提示
- **国际化支持**: 支持多语言文本
- **渲染支持**: 提供表格和通用组件的渲染功能

## 基础用法

### 导入

```typescript
import { useAction } from '@duxweb/dvha-pro'
```

### 基本配置

```typescript
const action = useAction({
  path: '/api/users', // 默认请求路径
  key: 'id', // 数据主键字段
  type: 'dropdown', // 渲染类型：button | dropdown
  text: false, // 是否显示为文本按钮
  align: 'left', // 对齐方式：left | center | right
  items: [
    // 操作项配置
  ]
})
```

## 操作类型

### modal - 模态框

打开模态框显示组件内容。

```typescript
{
  type: 'modal',
  label: '编辑',
  title: '编辑用户',
  component: EditUserModal,
  componentProps: { /* 组件属性 */ },
  width: 600,
  draggable: true
}
```

### drawer - 抽屉

打开抽屉显示组件内容。

```typescript
{
  type: 'drawer',
  label: '详情',
  title: '用户详情',
  component: UserDetail,
  componentProps: { /* 组件属性 */ },
  width: 400
}
```

### confirm - 确认对话框

显示确认对话框，用户确认后执行回调。

```typescript
{
  type: 'confirm',
  label: '启用',
  title: '确认启用',
  content: '确定要启用该用户吗？',
  callback: (id, data) => {
    // 确认后的处理逻辑
  }
}
```

### request - 请求操作

显示确认对话框，确认后发送 HTTP 请求。

```typescript
{
  type: 'request',
  label: '启用',
  title: '确认启用',
  content: '确定要启用该用户吗？',
  method: 'post',
  path: '/api/users/enable',
  data: (id, rowData) => ({ id, status: 'active' })
}
```

### delete - 删除操作

显示删除确认对话框，确认后执行删除请求。

```typescript
{
  type: 'delete',
  label: '删除',
  title: '确认删除',
  content: '删除后无法恢复，确定要删除吗？',
  path: '/api/users'
}
```

### link - 页面跳转

跳转到指定页面。

```typescript
{
  type: 'link',
  label: '编辑',
  path: '/users/edit'
  // 或者动态路径
  path: (id, data) => `/users/edit/${id}`
}
```

### callback - 自定义回调

执行自定义回调函数。

```typescript
{
  type: 'callback',
  label: '自定义',
  callback: (id, data) => {
    // 自定义处理逻辑
  }
}
```

## 渲染方法

### renderTable - 表格渲染

用于在表格中渲染操作列。

```typescript
import { useAction } from '@duxweb/dvha-pro'

const action = useAction({
  items: [
    { type: 'modal', label: '编辑', component: EditModal },
    { type: 'delete', label: '删除' }
  ]
})

// 在表格列配置中使用
const columns = [
  // ... 其他列
  {
    title: '操作',
    key: 'actions',
    render: action.renderTable({
      type: 'button',
      text: true
    })
  }
]
```

### renderAction - 通用渲染

用于在任意位置渲染操作组件。

```vue
<template>
  <div>
    <component :is="action.renderAction({ type: 'dropdown' })" />
  </div>
</template>
```

## 完整示例

```vue
<script setup>
import { useAction } from '@duxweb/dvha-pro'
import EditUserModal from './EditUserModal.vue'

const action = useAction({
  path: '/api/users',
  items: [
    {
      type: 'modal',
      label: '编辑',
      title: '编辑用户',
      component: EditUserModal,
      width: 600
    },
    {
      type: 'confirm',
      label: '启用',
      title: '确认启用',
      content: '确定要启用该用户吗？',
      callback: (id, data) => {
        console.log('启用用户', id, data)
      }
    },
    {
      type: 'delete',
      label: '删除',
      title: '确认删除',
      content: '删除后无法恢复'
    }
  ]
})

const columns = [
  { title: 'ID', key: 'id' },
  { title: '用户名', key: 'username' },
  {
    title: '操作',
    key: 'actions',
    render: action.renderTable({
      type: 'dropdown',
      align: 'center'
    })
  }
]

const data = ref([])
</script>

<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="data"
    />
  </div>
</template>
```

## 高级用法

### 条件显示操作

```typescript
const action = useAction({
  items: [
    {
      type: 'modal',
      label: '编辑',
      component: EditModal,
      show: (rowData, index) => {
        // 只有管理员可以编辑
        return rowData.role === 'admin'
      }
    },
    {
      type: 'delete',
      label: '删除',
      show: (rowData) => {
        // 只有非系统用户可以删除
        return !rowData.isSystem
      }
    }
  ]
})
```

### 动态组件属性

```typescript
const action = useAction({
  items: [
    {
      type: 'modal',
      label: '编辑',
      component: EditModal,
      componentProps: rowData => ({
        userId: rowData.id,
        readonly: rowData.status === 'locked'
      })
    }
  ]
})
```

### 自定义图标和颜色

```typescript
const action = useAction({
  items: [
    {
      type: 'modal',
      label: '编辑',
      icon: 'i-tabler:edit',
      color: 'primary',
      component: EditModal
    },
    {
      type: 'delete',
      label: '删除',
      icon: 'i-tabler:trash',
      color: 'error'
    }
  ]
})
```

## API 参考

### UseActionProps

| 属性  | 类型                          | 默认值     | 说明               |
| ----- | ----------------------------- | ---------- | ------------------ |
| path  | string                        | -          | 默认请求路径       |
| key   | string                        | 'id'       | 数据主键字段名     |
| type  | 'button' | 'dropdown'        | 'dropdown' | 渲染类型           |
| text  | boolean                       | false      | 是否显示为文本按钮 |
| align | 'left' | 'center' | 'right' | 'left'     | 对齐方式           |
| items | ActionItem[]                  | []         | 操作项配置         |

### ActionItem

| 属性           | 类型                                 | 说明                 |
| -------------- | ------------------------------------ | -------------------- |
| type           | string                               | 操作类型             |
| label          | string                               | 显示标签             |
| title          | string                               | 对话框标题           |
| show           | (rowData?, index?) => boolean        | 显示条件判断函数     |
| icon           | string                               | 图标类名             |
| color          | string                               | 按钮颜色             |
| component      | Component                            | 组件（modal/drawer） |
| componentProps | object | (rowData, index) => object | 组件属性             |
| width          | number                               | 宽度（modal/drawer） |
| draggable      | boolean                              | 是否可拖拽（modal）  |
| content        | string                               | 确认内容             |
| callback       | (id, data) => void                   | 回调函数             |
| method         | string                               | HTTP 方法            |
| path           | string | (id, data) => string       | 请求路径             |
| data           | object | (id, rowData) => object    | 请求数据             |

### 返回值

| 字段         | 类型     | 说明         |
| ------------ | -------- | ------------ |
| target       | Function | 操作执行函数 |
| renderTable  | Function | 表格渲染函数 |
| renderAction | Function | 通用渲染函数 |

## 最佳实践

### 1. 合理组织操作项

```typescript
// ✅ 推荐：按功能分组操作
const action = useAction({
  items: [
    // 查看操作
    { type: 'drawer', label: '查看', component: ViewModal },

    // 编辑操作
    { type: 'modal', label: '编辑', component: EditModal },
    { type: 'modal', label: '权限', component: PermissionModal },

    // 状态操作
    { type: 'request', label: '启用', method: 'patch', data: { status: 'active' } },
    { type: 'request', label: '禁用', method: 'patch', data: { status: 'inactive' } },

    // 危险操作
    { type: 'delete', label: '删除' }
  ]
})
```

### 2. 统一错误处理

```typescript
// ✅ 推荐：在操作中添加统一的错误处理
const action = useAction({
  onError: (error) => {
    console.error('操作失败:', error)
    // 可以添加全局错误处理逻辑
  },
  items: [
    // ... 操作项
  ]
})
```

### 3. 性能优化

```typescript
// ✅ 推荐：使用 show 函数避免不必要的渲染
const action = useAction({
  items: [
    {
      type: 'modal',
      label: '编辑',
      component: EditModal,
      show: (rowData) => {
        // 只在需要时显示，避免不必要的组件加载
        return rowData.editable
      }
    }
  ]
})
```

### 4. 类型安全

```typescript
// ✅ 推荐：使用 TypeScript 类型定义
interface UserData {
  id: number
  name: string
  role: 'admin' | 'user'
  editable: boolean
}

const action = useAction<UserData>({
  items: [
    {
      type: 'modal',
      label: '编辑',
      component: EditModal,
      show: (rowData: UserData) => rowData.editable
    }
  ]
})
```

## 常见问题

### Q: 如何在操作完成后刷新数据？

A: 可以在操作的回调函数中调用数据刷新方法：

```typescript
const action = useAction({
  items: [
    {
      type: 'request',
      label: '启用',
      callback: (id, data) => {
        // 操作完成后刷新数据
        refetch()
      }
    }
  ]
})
```

### Q: 如何自定义操作的确认对话框样式？

A: 可以通过 `useDialog` Hook 自定义对话框样式，然后在 callback 中使用。

### Q: 如何处理批量操作？

A: 可以结合表格的选择功能，在 callback 中处理选中的数据：

```typescript
const action = useAction({
  items: [
    {
      type: 'callback',
      label: '批量删除',
      callback: () => {
        // 处理选中的数据
        const selectedIds = checkedRowKeys.value
        // 执行批量删除逻辑
      }
    }
  ]
})
```
