# 抽屉组件

抽屉组件提供了从屏幕边缘滑入的面板容器，适用于详情展示、表单编辑等场景。

## 导入

```typescript
import {
  DuxDrawer,
  DuxDrawerPage
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下抽屉组件：

- **DuxDrawer** - 抽屉容器组件
- **DuxDrawerPage** - 抽屉页面组件
- **useDrawer** - 抽屉管理 Hook

## DuxDrawer 抽屉容器

基于 Naive UI Drawer 封装的抽屉容器组件，支持异步组件加载和多方向滑出。

### 属性

| 属性名         | 类型                                   | 默认值  | 说明             |
| -------------- | -------------------------------------- | ------- | ---------------- |
| title          | string                                 | -       | 抽屉标题         |
| width          | number \| string                       | 400     | 抽屉宽度         |
| placement      | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' | 抽屉位置         |
| component      | AsyncComponentLoader \| Component      | -       | 抽屉内容组件     |
| componentProps | Record<string, any>                    | -       | 传递给组件的属性 |

### 接口定义

```typescript
interface UseDrawerProps {
  title?: string // 抽屉标题
  width?: number | string // 抽屉宽度
  placement?: 'left' | 'right' | 'top' | 'bottom' // 抽屉位置
  component: AsyncComponentLoader<any> | Component // 抽屉内容组件
  componentProps?: Record<string, any> // 传递给组件的属性
}

interface UseDrawerResult {
  show: (props: UseDrawerProps) => Promise<any> // 显示抽屉
}
```

## DuxDrawerPage 抽屉页面

抽屉页面组件，提供标准的页面布局结构，包含内容区域和操作区域。

### 插槽

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 页面内容 | -    |
| action  | 操作按钮 | -    |

### 基础用法

```vue
<script setup>
import { DuxDrawerPage } from '@duxweb/dvha-pro'
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  onConfirm?: (data: any) => void
  onClose?: () => void
}>()

const formData = ref({
  name: '',
  email: '',
  phone: ''
})

function handleSubmit() {
  props.onConfirm?.(formData.value)
}

function handleCancel() {
  props.onClose?.()
}
</script>

<template>
  <DuxDrawerPage>
    <template #default>
      <NForm :model="formData" label-placement="top">
        <NFormItem label="姓名" path="name">
          <NInput v-model:value="formData.name" placeholder="请输入姓名" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="formData.email" placeholder="请输入邮箱" />
        </NFormItem>
        <NFormItem label="电话" path="phone">
          <NInput v-model:value="formData.phone" placeholder="请输入电话" />
        </NFormItem>
      </NForm>
    </template>

    <template #action>
      <NButton @click="handleCancel">
        取消
      </NButton>
      <NButton type="primary" @click="handleSubmit">
        确认
      </NButton>
    </template>
  </DuxDrawerPage>
</template>
```

## useDrawer Hook

抽屉管理 Hook，提供便捷的抽屉调用方法。

### 基础用法

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

### 不同位置的抽屉

```vue
<script setup>
import { useDrawer } from '@duxweb/dvha-pro'

const drawer = useDrawer()

function showFromLeft() {
  drawer.show({
    title: '左侧菜单',
    width: 300,
    placement: 'left',
    component: () => import('./components/SideMenu.vue')
  })
}

function showFromRight() {
  drawer.show({
    title: '右侧面板',
    width: 400,
    placement: 'right',
    component: () => import('./components/SidePanel.vue')
  })
}

function showFromTop() {
  drawer.show({
    title: '顶部通知',
    width: '100%',
    placement: 'top',
    component: () => import('./components/NotificationPanel.vue')
  })
}

function showFromBottom() {
  drawer.show({
    title: '底部操作',
    width: '100%',
    placement: 'bottom',
    component: () => import('./components/ActionSheet.vue')
  })
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <NButton @click="showFromLeft">
      左侧抽屉
    </NButton>
    <NButton @click="showFromRight">
      右侧抽屉
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
const loading = ref(false)
const formData = ref({
  name: '',
  email: '',
  role: 'user',
  status: 'active'
})

// 模拟加载用户数据
if (props.userId) {
  // 加载现有用户数据
  formData.value = {
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin',
    status: 'active'
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    message.success('保存成功')
    props.onConfirm?.(formData.value)
  }
  catch (error) {
    message.error('保存失败')
  }
  finally {
    loading.value = false
  }
}

function handleCancel() {
  props.onClose?.()
}
</script>

<template>
  <DuxDrawerPage>
    <template #default>
      <NForm :model="formData" label-placement="top">
        <NFormItem label="用户名" path="name" required>
          <NInput
            v-model:value="formData.name"
            placeholder="请输入用户名"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="邮箱" path="email" required>
          <NInput
            v-model:value="formData.email"
            placeholder="请输入邮箱"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="角色" path="role">
          <NSelect
            v-model:value="formData.role"
            :options="[
              { label: '管理员', value: 'admin' },
              { label: '普通用户', value: 'user' },
            ]"
            :disabled="loading"
          />
        </NFormItem>

        <NFormItem label="状态" path="status">
          <NSelect
            v-model:value="formData.status"
            :options="[
              { label: '启用', value: 'active' },
              { label: '禁用', value: 'inactive' },
            ]"
            :disabled="loading"
          />
        </NFormItem>
      </NForm>
    </template>

    <template #action>
      <NButton :disabled="loading" @click="handleCancel">
        取消
      </NButton>
      <NButton
        type="primary"
        :loading="loading"
        @click="handleSubmit"
      >
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
import { NButton, NDescriptions, NDescriptionsItem, NSpin, NTag } from 'naive-ui'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  itemId?: number
  onClose?: () => void
}>()

const loading = ref(true)
const data = ref<any>({})

onMounted(async () => {
  // 模拟加载数据
  await new Promise(resolve => setTimeout(resolve, 1000))

  data.value = {
    id: props.itemId,
    name: '示例项目',
    description: '这是一个示例项目的详细描述信息',
    status: 'active',
    createdAt: '2023-12-01 10:00:00',
    updatedAt: '2023-12-15 14:30:00',
    author: '张三',
    tags: ['重要', '紧急', '优先']
  }

  loading.value = false
})

function handleClose() {
  props.onClose?.()
}
</script>

<template>
  <DuxDrawerPage>
    <template #default>
      <NSpin :show="loading">
        <div class="min-h-200px">
          <NDescriptions v-if="!loading" bordered :column="1">
            <NDescriptionsItem label="ID">
              {{ data.id }}
            </NDescriptionsItem>
            <NDescriptionsItem label="名称">
              {{ data.name }}
            </NDescriptionsItem>
            <NDescriptionsItem label="描述">
              {{ data.description }}
            </NDescriptionsItem>
            <NDescriptionsItem label="状态">
              <NTag :type="data.status === 'active' ? 'success' : 'default'">
                {{ data.status === 'active' ? '启用' : '禁用' }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem label="标签">
              <div class="flex gap-2">
                <NTag v-for="tag in data.tags" :key="tag" type="info">
                  {{ tag }}
                </NTag>
              </div>
            </NDescriptionsItem>
            <NDescriptionsItem label="创建时间">
              {{ data.createdAt }}
            </NDescriptionsItem>
            <NDescriptionsItem label="更新时间">
              {{ data.updatedAt }}
            </NDescriptionsItem>
            <NDescriptionsItem label="作者">
              {{ data.author }}
            </NDescriptionsItem>
          </NDescriptions>
        </div>
      </NSpin>
    </template>

    <template #action>
      <NButton @click="handleClose">
        关闭
      </NButton>
    </template>
  </DuxDrawerPage>
</template>
```

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

## 最佳实践

### 1. 合理选择抽屉位置

```javascript
// ✅ 推荐：根据内容选择合适的位置
drawer.show({ placement: 'right', ... }) // 表单编辑、详情展示
drawer.show({ placement: 'left', ... })  // 导航菜单、过滤器
drawer.show({ placement: 'top', ... })   // 通知、消息中心
drawer.show({ placement: 'bottom', ... }) // 操作面板、选择器

// ❌ 不推荐：不考虑用户体验的位置选择
drawer.show({ placement: 'top', width: '100%' }) // 用于表单编辑
```

### 2. 合理设置抽屉宽度

```javascript
// ✅ 推荐：根据内容设置合适的宽度
drawer.show({ width: 400 }) // 简单表单
drawer.show({ width: 600 }) // 复杂表单
drawer.show({ width: 800 }) // 详情展示
drawer.show({ width: '50%' }) // 响应式宽度

// ❌ 不推荐：固定使用过小或过大的宽度
drawer.show({ width: 200 }) // 太窄，内容显示不全
drawer.show({ width: 1200 }) // 太宽，影响用户体验
```

### 3. 正确处理组件通信

```javascript
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

// ❌ 不推荐：在组件内部直接关闭抽屉
// 应该通过回调函数通知父组件
```

### 4. 合理使用异步组件

```javascript
// ✅ 推荐：使用动态导入减少初始包大小
drawer.show({
  component: () => import('./components/LargeForm.vue')
})

// ✅ 推荐：为复杂组件提供加载状态
drawer.show({
  component: () => import('./components/ComplexChart.vue')
  // 组件内部应该有适当的加载状态
})
```

### 5. 提供良好的用户体验

```javascript
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
