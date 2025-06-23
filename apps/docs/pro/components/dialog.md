# 对话框组件

对话框组件提供了灵活的对话框容器，支持自定义内容、大小和操作按钮。

## 导入

```typescript
import { DuxDialog } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下对话框组件：

- **DuxDialog** - 对话框组件
- **useDialog** - 对话框管理 Hook

## DuxDialog 对话框

基于 Naive UI Modal 封装的对话框组件，支持多种类型的对话框显示。

### 属性

| 属性名       | 类型                                                    | 默认值 | 说明                   |
| ------------ | ------------------------------------------------------- | ------ | ---------------------- |
| title        | string                                                  | -      | 对话框标题             |
| content      | string                                                  | -      | 对话框内容             |
| type         | 'confirm' \| 'success' \| 'error' \| 'prompt' \| 'node' | -      | 对话框类型             |
| formSchema   | JsonSchemaNode[]                                        | -      | 表单配置（prompt类型） |
| defaultValue | Record<string, any>                                     | -      | 表单默认值             |
| render       | () => VNode                                             | -      | 自定义渲染函数         |

### 接口定义

```typescript
interface UseDialogProps {
  title?: string // 对话框标题
  content?: string // 对话框内容
  type?: 'confirm' | 'error' | 'success' | 'prompt' | 'node' // 对话框类型
  formSchema?: JsonSchemaNode[] // 表单配置（prompt类型使用）
  defaultValue?: Record<string, any> // 表单默认值
  render?: () => VNode // 自定义渲染函数（node类型使用）
}

interface UseDialogResult {
  confirm: (props: UseDialogProps) => Promise<any> // 确认对话框
  success: (props: UseDialogProps) => Promise<any> // 成功对话框
  error: (props: UseDialogProps) => Promise<any> // 错误对话框
  prompt: (props: UseDialogProps) => Promise<any> // 输入对话框
  node: (props: UseDialogProps) => Promise<any> // 自定义内容对话框
}
```

## useDialog Hook

对话框管理 Hook，提供便捷的对话框调用方法。

### 基础用法

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'

const dialog = useDialog()

// 确认对话框
function showConfirm() {
  dialog.confirm({
    title: '确认删除',
    content: '确定要删除这条记录吗？此操作不可撤销。'
  }).then(() => {
    console.log('用户点击了确认')
  }).catch(() => {
    console.log('用户点击了取消')
  })
}

// 成功提示
function showSuccess() {
  dialog.success({
    title: '操作成功',
    content: '数据已成功保存！'
  })
}

// 错误提示
function showError() {
  dialog.error({
    title: '操作失败',
    content: '网络连接异常，请稍后重试。'
  })
}
</script>

<template>
  <div class="flex gap-4">
    <NButton @click="showConfirm">
      确认对话框
    </NButton>
    <NButton @click="showSuccess">
      成功提示
    </NButton>
    <NButton @click="showError">
      错误提示
    </NButton>
  </div>
</template>
```

### 输入对话框

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { NInput, NSelect } from 'naive-ui'

const dialog = useDialog()

function showPrompt() {
  dialog.prompt({
    title: '添加用户',
    formSchema: [
      {
        tag: NInput,
        attrs: {
          'v-model:value': [formData, 'username'],
          'placeholder': '请输入用户名'
        },
        title: '用户名'
      },
      {
        tag: NInput,
        attrs: {
          'v-model:value': [formData, 'email'],
          'placeholder': '请输入邮箱'
        },
        title: '邮箱'
      },
      {
        tag: NSelect,
        attrs: {
          'v-model:value': [formData, 'role'],
          'options': [
            { label: '管理员', value: 'admin' },
            { label: '普通用户', value: 'user' }
          ]
        },
        title: '角色'
      }
    ],
    defaultValue: {
      username: '',
      email: '',
      role: 'user'
    }
  }).then((result) => {
    console.log('用户输入的数据:', result)
    // result = { username: '...', email: '...', role: '...' }
  }).catch(() => {
    console.log('用户取消了输入')
  })
}
</script>

<template>
  <NButton @click="showPrompt">
    输入对话框
  </NButton>
</template>
```

### 自定义内容对话框

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { NButton, NProgress, NSpace } from 'naive-ui'
import { h, ref } from 'vue'

const dialog = useDialog()
const progress = ref(0)

function showCustomDialog() {
  dialog.node({
    title: '文件上传进度',
    render: () => h(NSpace, { vertical: true }, [
      h('div', '正在上传文件...'),
      h(NProgress, {
        percentage: progress.value,
        type: 'line',
        status: progress.value === 100 ? 'success' : 'info'
      }),
      h('div', `${progress.value}% 完成`)
    ])
  })

  // 模拟上传进度
  const timer = setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      clearInterval(timer)
    }
  }, 500)
}
</script>

<template>
  <NButton @click="showCustomDialog">
    自定义对话框
  </NButton>
</template>
```

### 异步操作确认

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'
import { useMessage } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()

async function handleDelete(id) {
  try {
    const confirmed = await dialog.confirm({
      title: '确认删除',
      content: '删除后数据将无法恢复，确定要继续吗？'
    })

    if (confirmed) {
      // 执行删除操作
      await deleteRecord(id)
      message.success('删除成功')
    }
  }
  catch (error) {
    // 用户取消或操作失败
    console.log('操作被取消或失败')
  }
}

async function deleteRecord(id) {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
}
</script>
```

### 链式调用

```vue
<script setup>
import { useDialog } from '@duxweb/dvha-pro'

const dialog = useDialog()

function showChainedDialogs() {
  dialog.confirm({
    title: '第一步确认',
    content: '是否继续下一步操作？'
  }).then(() => {
    return dialog.prompt({
      title: '第二步输入',
      formSchema: [{
        tag: NInput,
        attrs: {
          'v-model:value': [formData, 'reason'],
          'placeholder': '请输入操作原因'
        },
        title: '原因'
      }]
    })
  }).then((result) => {
    return dialog.success({
      title: '操作完成',
      content: `操作原因：${result.reason}`
    })
  }).catch(() => {
    dialog.error({
      title: '操作取消',
      content: '用户取消了操作流程'
    })
  })
}
</script>
```

## 类型说明

### 对话框类型

- **confirm**: 确认对话框，包含确认和取消按钮
- **success**: 成功提示对话框，只有确认按钮，绿色图标
- **error**: 错误提示对话框，只有确认按钮，红色图标
- **prompt**: 输入对话框，包含表单和确认/取消按钮
- **node**: 自定义内容对话框，完全自定义内容区域

### 返回值说明

- **confirm/prompt**: 返回 Promise，确认时 resolve，取消时 reject
- **success/error**: 返回 Promise，点击确认时 resolve
- **node**: 返回 Promise，需要在自定义内容中手动调用 resolve/reject

## 国际化支持

对话框组件支持国际化，默认文本可以通过语言包配置：

```json
{
  "components": {
    "dialog": {
      "confirm": {
        "title": "确认",
        "content": "确定要执行此操作吗？"
      },
      "success": {
        "title": "成功",
        "content": "操作成功完成"
      },
      "error": {
        "title": "错误",
        "content": "操作执行失败"
      },
      "prompt": {
        "title": "输入信息"
      }
    },
    "button": {
      "confirm": "确认",
      "cancel": "取消"
    }
  }
}
```

## 最佳实践

### 1. 合理使用对话框类型

```javascript
// ✅ 推荐：根据场景选择合适的类型
dialog.confirm({ ... }) // 需要用户确认的操作
dialog.success({ ... }) // 操作成功的反馈
dialog.error({ ... })   // 错误信息提示
dialog.prompt({ ... })  // 需要用户输入信息

// ❌ 不推荐：滥用confirm类型
dialog.confirm({ title: '成功', content: '操作完成' }) // 应该用success
```

### 2. 提供清晰的提示信息

```javascript
// ✅ 推荐：清晰的标题和内容
dialog.confirm({
  title: '删除用户',
  content: '确定要删除用户"张三"吗？删除后将无法恢复，相关数据也将被清除。'
})

// ❌ 不推荐：模糊的提示
dialog.confirm({
  title: '确认',
  content: '确定吗？'
})
```

### 3. 合理处理异步操作

```javascript
// ✅ 推荐：正确处理Promise
try {
  await dialog.confirm({ ... })
  // 执行确认后的操作
} catch {
  // 处理取消操作
}

// ❌ 不推荐：忽略Promise处理
dialog.confirm({ ... }) // 没有处理返回值
```
