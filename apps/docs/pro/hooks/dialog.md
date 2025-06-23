# useDialog - 对话框管理

`useDialog` 是一个对话框管理 Hook，提供多种类型的对话框调用方法，包括确认、成功、错误、提示输入和自定义内容对话框。

## 特性

- **多种类型**: 支持确认、成功、错误、提示、自定义内容对话框
- **表单支持**: 支持通过 JSON Schema 构建表单对话框
- **Promise 支持**: 基于 Promise 的异步操作
- **自定义渲染**: 支持自定义 VNode 内容

## 基础用法

### 导入

```typescript
import { useDialog } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const dialog = useDialog()

// 确认对话框
dialog.confirm({
  title: '确认删除',
  content: '确定要删除这条记录吗？'
}).then(() => {
  console.log('用户确认删除')
}).catch(() => {
  console.log('用户取消删除')
})

// 成功提示
dialog.success({
  title: '操作成功',
  content: '数据保存成功！'
})

// 错误提示
dialog.error({
  title: '操作失败',
  content: '网络连接失败，请重试'
})
```

## API 参考

### UseDialogResult

| 字段    | 类型                                | 说明           |
| ------- | ----------------------------------- | -------------- |
| confirm | (props: UseDialogProps) => Promise\<any\> | 确认对话框   |
| success | (props: UseDialogProps) => Promise\<any\> | 成功提示对话框 |
| error   | (props: UseDialogProps) => Promise\<any\> | 错误提示对话框 |
| prompt  | (props: UseDialogProps) => Promise\<any\> | 输入对话框   |
| node    | (props: UseDialogProps) => Promise\<any\> | 自定义内容对话框 |

### UseDialogProps

| 属性名       | 类型                                                    | 默认值 | 说明                     |
| ------------ | ------------------------------------------------------- | ------ | ------------------------ |
| title        | string                                                  | -      | 对话框标题               |
| content      | string                                                  | -      | 对话框内容               |
| type         | 'confirm' \| 'error' \| 'success' \| 'prompt' \| 'node' | -      | 对话框类型               |
| formSchema   | JsonSchemaNode[]                                        | -      | 表单 Schema 配置（JSON Schema 格式） |
| defaultValue | Record\<string, any\>                                   | -      | 表单默认值               |
| render       | () => VNode                                             | -      | 自定义渲染函数           |

## 使用示例

### 基础对话框

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { NButton, useMessage } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()

// 确认删除
function handleDelete() {
  dialog.confirm({
    title: '确认删除',
    content: '删除后数据无法恢复，确定要删除吗？'
  }).then(() => {
    message.success('删除成功')
  }).catch(() => {
    message.info('已取消删除')
  })
}

// 成功提示
function showSuccess() {
  dialog.success({
    title: '操作成功',
    content: '数据已成功保存到服务器'
  })
}

// 错误提示
function showError() {
  dialog.error({
    title: '操作失败',
    content: '网络连接超时，请检查网络后重试'
  })
}
</script>

<template>
  <div class="flex gap-4">
    <NButton type="error" @click="handleDelete">
      删除数据
    </NButton>
    <NButton type="success" @click="showSuccess">
      成功提示
    </NButton>
    <NButton type="error" @click="showError">
      错误提示
    </NButton>
  </div>
</template>
```

### 表单输入对话框

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { NButton, useMessage } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()

// 输入对话框
function showPrompt() {
  dialog.prompt({
    title: '请输入用户名',
    formSchema: [
      {
        tag: 'n-input',
        attrs: {
          'v-model:value': [form.value, 'username'],
          'placeholder': '请输入用户名'
        }
      }
    ]
  }).then((result) => {
    message.success(`用户名: ${result.username}`)
  }).catch(() => {
    message.info('已取消输入')
  })
}

// 复杂表单对话框
function showForm() {
  dialog.prompt({
    title: '编辑用户信息',
    formSchema: [
      {
        tag: 'n-form-item',
        attrs: { label: '姓名' },
        children: [
          {
            tag: 'n-input',
            attrs: {
              'v-model:value': [form.value, 'name'],
              'placeholder': '请输入姓名'
            }
          }
        ]
      },
      {
        tag: 'n-form-item',
        attrs: { label: '邮箱' },
        children: [
          {
            tag: 'n-input',
            attrs: {
              'v-model:value': [form.value, 'email'],
              'placeholder': '请输入邮箱'
            }
          }
        ]
      },
      {
        tag: 'n-form-item',
        attrs: { label: '角色' },
        children: [
          {
            tag: 'n-select',
            attrs: {
              'v-model:value': [form.value, 'role'],
              'options': [
                { label: '管理员', value: 'admin' },
                { label: '用户', value: 'user' }
              ]
            }
          }
        ]
      }
    ],
    defaultValue: {
      name: 'John',
      email: 'john@example.com',
      role: 'user'
    }
  }).then((result) => {
    console.log('表单数据:', result)
  })
}
</script>

<template>
  <div class="flex gap-4">
    <NButton @click="showPrompt">
      输入对话框
    </NButton>
    <NButton @click="showForm">
      表单对话框
    </NButton>
  </div>
</template>
```

### 自定义内容对话框

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { NButton, NSpace, NTag } from 'naive-ui'
import { h } from 'vue'

const dialog = useDialog()

function showCustomDialog() {
  dialog.node({
    title: '自定义内容',
    render: () => h(NSpace, { vertical: true }, [
      h('p', '这是自定义渲染的内容'),
      h(NTag, { type: 'success' }, '成功标签'),
      h(NTag, { type: 'warning' }, '警告标签'),
      h('div', { class: 'mt-4' }, [
        h('strong', '重要提示：'),
        h('p', '这是通过 render 函数渲染的复杂内容')
      ])
    ])
  })
}
</script>

<template>
  <NButton @click="showCustomDialog">
    自定义内容对话框
  </NButton>
</template>
```
