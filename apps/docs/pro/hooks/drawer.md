# useDrawer - 抽屉管理

`useDrawer` 是一个抽屉管理 Hook，提供异步组件加载的抽屉调用方法，适用于侧边栏表单、详情展示等场景。

## 特性

- **异步组件加载**: 支持动态导入组件，按需加载
- **多方向支持**: 支持从上、右、下、左四个方向滑出
- **Promise 支持**: 基于 Promise 的异步操作

## 基础用法

### 导入

```typescript
import { useDrawer } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const drawer = useDrawer()

// 显示抽屉
drawer.show({
  title: '用户详情',
  width: 500,
  placement: 'right',
  component: () => import('./UserDetail.vue'),
  componentProps: {
    userId: 123
  }
}).then((result) => {
  console.log('抽屉返回结果:', result)
}).catch(() => {
  console.log('用户取消了操作')
})
```

## API 参考

### UseDrawerResult

| 字段 | 类型                                | 说明       |
| ---- | ----------------------------------- | ---------- |
| show | (props: UseDrawerProps) => Promise\<any\> | 显示抽屉 |

### UseDrawerProps

| 属性名         | 类型                                  | 默认值   | 说明               |
| -------------- | ------------------------------------- | -------- | ------------------ |
| title          | string                                | -        | 抽屉标题           |
| width          | number \| string                      | -        | 抽屉宽度           |
| component      | AsyncComponentLoader \| Component     | -        | 要显示的组件       |
| componentProps | Record\<string, any\>                 | -        | 传递给组件的属性   |
| placement      | 'top' \| 'right' \| 'bottom' \| 'left' | 'right'  | 抽屉滑出方向       |

## 使用示例

### 基础抽屉

```vue
<script setup>
import { useDrawer } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'

const drawer = useDrawer()

// 显示用户详情抽屉
function showUserDetail(userId) {
  drawer.show({
    title: '用户详情',
    width: 500,
    placement: 'right',
    component: () => import('./components/UserDetail.vue'),
    componentProps: {
      userId
    }
  })
}

// 显示编辑表单抽屉
function showEditForm(data) {
  drawer.show({
    title: '编辑信息',
    width: 600,
    placement: 'right',
    component: () => import('./components/EditForm.vue'),
    componentProps: {
      data
    }
  }).then((result) => {
    console.log('编辑结果:', result)
  })
}
</script>

<template>
  <div class="flex gap-4">
    <NButton @click="showUserDetail(123)">
      查看详情
    </NButton>
    <NButton @click="showEditForm({ id: 1 })">
      编辑信息
    </NButton>
  </div>
</template>
```

### 不同方向的抽屉

```vue
<script setup>
import { useDrawer } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'

const drawer = useDrawer()

function showFromRight() {
  drawer.show({
    title: '右侧抽屉',
    width: 400,
    placement: 'right',
    component: () => import('./RightPanel.vue')
  })
}

function showFromLeft() {
  drawer.show({
    title: '左侧抽屉',
    width: 300,
    placement: 'left',
    component: () => import('./LeftPanel.vue')
  })
}

function showFromTop() {
  drawer.show({
    title: '顶部抽屉',
    width: '100%',
    placement: 'top',
    component: () => import('./TopPanel.vue')
  })
}

function showFromBottom() {
  drawer.show({
    title: '底部抽屉',
    width: '100%',
    placement: 'bottom',
    component: () => import('./BottomPanel.vue')
  })
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <NButton @click="showFromRight">
      右侧抽屉
    </NButton>
    <NButton @click="showFromLeft">
      左侧抽屉
    </NButton>
    <NButton @click="showFromTop">
      顶部抽屉
    </NButton>
    <NButton @click="showFromBottom">
      底部抽屉
    </NButton>
  </div>
</template>
```

## 配置选项

### placement - 抽屉位置

支持四个方向的抽屉滑出：

```typescript
// 从右侧滑出（默认）
drawer.show({
  placement: 'right',
  component: SidePanel
})

// 从左侧滑出
drawer.show({
  placement: 'left',
  component: SideMenu
})

// 从顶部滑出
drawer.show({
  placement: 'top',
  component: NotificationPanel
})

// 从底部滑出
drawer.show({
  placement: 'bottom',
  component: ActionSheet
})
```

### width - 抽屉宽度

支持固定宽度和响应式宽度：

```typescript
// 固定宽度
drawer.show({
  width: 400,
  component: UserForm
})

// 百分比宽度
drawer.show({
  width: '50%',
  component: DataViewer
})

// 响应式宽度
drawer.show({
  width: 'min(600px, 80vw)',
  component: ResponsivePanel
})
```

## 完整示例

### 基础使用示例

```vue
<script setup>
import { useDrawer } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'

const drawer = useDrawer()

// 显示用户编辑抽屉
function showUserEdit(userId) {
  drawer.show({
    title: '编辑用户',
    width: 500,
    placement: 'right',
    component: () => import('./components/UserEditForm.vue'),
    componentProps: {
      userId
    }
  }).then((result) => {
    console.log('用户编辑结果:', result)
  }).catch(() => {
    console.log('用户取消了编辑')
  })
}

// 显示设置面板
function showSettings() {
  drawer.show({
    title: '系统设置',
    width: 600,
    placement: 'right',
    component: () => import('./components/SettingsPanel.vue')
  })
}

// 显示详情信息
function showDetails(itemId) {
  drawer.show({
    title: '详细信息',
    width: 800,
    placement: 'right',
    component: () => import('./components/ItemDetails.vue'),
    componentProps: {
      itemId
    }
  })
}
</script>

<template>
  <div class="flex gap-4">
    <NButton @click="showUserEdit(123)">
      编辑用户
    </NButton>
    <NButton @click="showSettings">
      系统设置
    </NButton>
    <NButton @click="showDetails(456)">
      查看详情
    </NButton>
  </div>
</template>
```

### 表单编辑抽屉

```vue
<!-- UserEditForm.vue -->
<script setup>
import { DuxDrawerPage } from '@duxweb/dvha-pro'
import { NButton, NForm, NFormItem, NInput, NSelect, useMessage } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  userId?: number
  onConfirm?: (data: any) => void
  onClose?: () => void
}>()

const message = useMessage()

const formData = ref({
  name: '',
  email: '',
  role: 'user',
  status: 'active'
})

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' }
]

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
]

function handleSubmit() {
  // 表单验证
  if (!formData.value.name) {
    message.error('请输入用户名')
    return
  }

  if (!formData.value.email) {
    message.error('请输入邮箱')
    return
  }

  // 提交数据
  props.onConfirm?.(formData.value)
  message.success('保存成功')
}

function handleCancel() {
  props.onClose?.()
}
</script>

<template>
  <DuxDrawerPage>
    <template #default>
      <NForm :model="formData" label-placement="top">
        <NFormItem label="用户名" path="name">
          <NInput v-model:value="formData.name" placeholder="请输入用户名" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="formData.email" placeholder="请输入邮箱" />
        </NFormItem>
        <NFormItem label="角色" path="role">
          <NSelect v-model:value="formData.role" :options="roleOptions" />
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NSelect v-model:value="formData.status" :options="statusOptions" />
        </NFormItem>
      </NForm>
    </template>

    <template #action>
      <NButton @click="handleCancel">
        取消
      </NButton>
      <NButton type="primary" @click="handleSubmit">
        保存
      </NButton>
    </template>
  </DuxDrawerPage>
</template>
```

### 详情展示抽屉

```vue
<!-- ItemDetails.vue -->
<script setup>
import { DuxDrawerPage } from '@duxweb/dvha-pro'
import { NDescriptions, NDescriptionsItem, NTag } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  itemId?: number
  onClose?: () => void
}>()

const itemData = ref({
  id: 1,
  name: '示例商品',
  category: '电子产品',
  price: 999.99,
  status: 'active',
  description: '这是一个示例商品的详细描述信息...',
  createdAt: '2024-01-01 10:00:00',
  updatedAt: '2024-01-15 15:30:00'
})

function handleClose() {
  props.onClose?.()
}
</script>

<template>
  <DuxDrawerPage>
    <template #default>
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold mb-4">
            基本信息
          </h3>
          <NDescriptions :column="1" bordered>
            <NDescriptionsItem label="商品ID">
              {{ itemData.id }}
            </NDescriptionsItem>
            <NDescriptionsItem label="商品名称">
              {{ itemData.name }}
            </NDescriptionsItem>
            <NDescriptionsItem label="分类">
              {{ itemData.category }}
            </NDescriptionsItem>
            <NDescriptionsItem label="价格">
              ¥{{ itemData.price }}
            </NDescriptionsItem>
            <NDescriptionsItem label="状态">
              <NTag :type="itemData.status === 'active' ? 'success' : 'error'">
                {{ itemData.status === 'active' ? '上架' : '下架' }}
              </NTag>
            </NDescriptionsItem>
          </NDescriptions>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">
            详细描述
          </h3>
          <div class="p-4 bg-gray-50 rounded">
            {{ itemData.description }}
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4">
            时间信息
          </h3>
          <NDescriptions :column="1" bordered>
            <NDescriptionsItem label="创建时间">
              {{ itemData.createdAt }}
            </NDescriptionsItem>
            <NDescriptionsItem label="更新时间">
              {{ itemData.updatedAt }}
            </NDescriptionsItem>
          </NDescriptions>
        </div>
      </div>
    </template>

    <template #action>
      <NButton @click="handleClose">
        关闭
      </NButton>
    </template>
  </DuxDrawerPage>
</template>
```

## 高级用法

### 多步骤抽屉

```vue
<script setup>
import { useDrawer } from '@duxweb/dvha-pro'

const drawer = useDrawer()

function showMultiStepDrawer() {
  drawer.show({
    title: '多步骤向导',
    width: 600,
    component: () => import('./components/MultiStepWizard.vue')
  }).then((result) => {
    console.log('向导完成:', result)
  })
}
</script>
```

### 嵌套抽屉

```typescript
function showNestedDrawer() {
  // 第一层抽屉
  drawer.show({
    title: '用户列表',
    width: 500,
    component: UserList
  }).then(() => {
    // 第二层抽屉
    return drawer.show({
      title: '用户详情',
      width: 400,
      component: UserDetail
    })
  }).then(() => {
    console.log('嵌套抽屉操作完成')
  })
}
```

### 动态标题和宽度

```typescript
function showDynamicDrawer(type: string) {
  const configs = {
    edit: {
      title: '编辑信息',
      width: 600,
      component: EditForm
    },
    view: {
      title: '查看详情',
      width: 400,
      component: ViewDetail
    },
    settings: {
      title: '系统设置',
      width: 800,
      component: SettingsPanel
    }
  }

  const config = configs[type]
  if (config) {
    drawer.show(config)
  }
}
```

## 最佳实践

### 1. 合理选择抽屉位置

```typescript
// ✅ 推荐：根据内容选择合适的位置
drawer.show({ placement: 'right', ... }) // 表单编辑、详情展示
drawer.show({ placement: 'left', ... })  // 导航菜单、过滤器
drawer.show({ placement: 'top', ... })   // 通知、消息中心
drawer.show({ placement: 'bottom', ... }) // 操作面板、选择器
```

### 2. 合理设置抽屉宽度

```typescript
// ✅ 推荐：根据内容设置合适的宽度
drawer.show({ width: 400 }) // 简单表单
drawer.show({ width: 600 }) // 复杂表单
drawer.show({ width: 800 }) // 详情展示
drawer.show({ width: '50%' }) // 响应式宽度
```

### 3. 正确处理组件通信

```typescript
// ✅ 推荐：通过 componentProps 传递数据和回调
drawer.show({
  component: () => import('./EditForm.vue'),
  componentProps: {
    userId: 123,
    onSave: (data) => {
      // 处理保存逻辑
      console.log('保存数据:', data)
    },
    onCancel: () => {
      // 处理取消逻辑
      console.log('用户取消')
    }
  }
})
```

### 4. 合理使用异步组件

```typescript
// ✅ 推荐：使用动态导入减少初始包大小
drawer.show({
  component: () => import('./components/LargeForm.vue')
})
```

### 5. 提供良好的用户体验

```typescript
// ✅ 推荐：提供清晰的标题和操作反馈
drawer.show({
  title: '编辑用户信息', // 清晰的标题
  component: () => import('./UserForm.vue'),
  componentProps: {
    onSave: async (data) => {
      try {
        await saveUser(data)
        message.success('保存成功')
        // 关闭抽屉
      }
      catch (error) {
        message.error('保存失败')
      }
    }
  }
})
```

## 常见问题

### Q: 如何在抽屉中使用表单验证？

A: 可以在抽屉组件内部使用 Naive UI 的表单验证功能：

```vue
<script setup>
import { NForm, NFormItem, NInput } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref()
const formData = ref({})

const rules = {
  name: { required: true, message: '请输入姓名' }
}

function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      // 验证通过，提交表单
    }
  })
}
</script>

<template>
  <NForm ref="formRef" :model="formData" :rules="rules">
    <NFormItem label="姓名" path="name">
      <NInput v-model:value="formData.name" />
    </NFormItem>
  </NForm>
</template>
```

### Q: 如何实现抽屉的自动关闭？

A: 可以在组件中调用 `onClose` 回调：

```typescript
// 在抽屉组件中
props.onClose?.() // 关闭抽屉
```

### Q: 如何处理抽屉的数据传递？

A: 通过 `componentProps` 传递数据，通过回调函数返回结果：

```typescript
drawer.show({
  componentProps: {
    data: inputData,
    onConfirm: (result) => {
      console.log('返回结果:', result)
    }
  }
})
```

### Q: 如何实现抽屉的拖拽调整大小？

A: 抽屉组件内置了拖拽调整大小功能，可以通过 `resizable` 属性控制。
