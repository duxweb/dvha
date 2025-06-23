# 表单组件

表单组件提供了完整的表单解决方案，包含表单项、表单布局、模态框表单、页面表单、设置表单等组件。

## 导入

```typescript
import {
  DuxFormItem,
  DuxFormLayout,
  DuxModalForm,
  DuxPageForm,
  DuxSettingForm
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下表单组件：

- **DuxFormItem** - 表单项组件
- **DuxFormLayout** - 表单布局组件
- **DuxModalForm** - 模态框表单组件
- **DuxPageForm** - 页面表单组件
- **DuxSettingForm** - 设置表单组件

## DuxFormItem 表单项

表单项组件，基于 vee-validate 提供验证功能的表单项包装器。

::: warning 重要提示
`DuxFormItem` 需要配合 `useExtendForm` 使用才能实现验证功能。如果单独使用，验证规则不会生效。其他表单组件（`DuxModalForm`、`DuxPageForm`、`DuxSettingForm`）内部已集成了 `useExtendForm`，可以直接使用验证功能。
:::

### 属性

| 属性名         | 类型                             | 默认值 | 说明                                |
| -------------- | -------------------------------- | ------ | ----------------------------------- |
| label          | string                           | -      | 标签文本                            |
| description    | string \| VNode                  | -      | 描述信息（可以是字符串或 VNode）    |
| path           | string                           | -      | 表单字段路径                        |
| labelPlacement | 'left' \| 'top' \| 'setting'     | -      | 标签位置                            |
| labelWidth     | number                           | -      | 标签宽度                            |
| rule           | RuleExpression                   | -      | 验证规则（vee-validate 规则表达式） |
| message        | string \| Record<string, string> | -      | 错误信息                            |

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 表单控件 |

### 配合 useExtendForm 使用

```vue
<script setup>
import { useExtendForm } from '@duxweb/dvha-core'
import { DuxFormItem } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const formData = ref({
  username: '',
  email: ''
})

// 必须使用 useExtendForm 才能让验证生效
const { form, isLoading, onSubmit, onReset } = useExtendForm({
  path: '/api/users',
  action: 'create',
  form: formData
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <DuxFormItem
      label="用户名"
      path="username"
      rule="required|min:3"
      description="请输入至少3个字符的用户名"
    >
      <n-input v-model:value="form.username" placeholder="请输入用户名" />
    </DuxFormItem>

    <DuxFormItem
      label="邮箱"
      path="email"
      rule="required|email"
    >
      <n-input v-model:value="form.email" placeholder="请输入邮箱" />
    </DuxFormItem>

    <div class="mt-4">
      <n-button type="primary" attr-type="submit" :loading="isLoading">
        提交
      </n-button>
      <n-button class="ml-2" @click="onReset">
        重置
      </n-button>
    </div>
  </form>
</template>
```

### 单独使用（无验证）

如果不需要验证功能，可以单独使用 `DuxFormItem` 作为布局组件：

```vue
<script setup>
import { DuxFormItem } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const userName = ref('')
</script>

<template>
  <DuxFormItem
    label="用户名"
    description="这只是一个布局组件，没有验证功能"
  >
    <n-input v-model:value="userName" placeholder="请输入用户名" />
  </DuxFormItem>
</template>
```

### 不同标签位置

```vue
<template>
  <!-- 左侧标签（默认） -->
  <DuxFormItem label="姓名" path="name" label-placement="left">
    <n-input v-model:value="form.name" />
  </DuxFormItem>

  <!-- 顶部标签 -->
  <DuxFormItem label="邮箱" path="email" label-placement="top">
    <n-input v-model:value="form.email" />
  </DuxFormItem>

  <!-- 设置样式（右对齐） -->
  <DuxFormItem label="通知设置" path="notification" label-placement="setting">
    <n-switch v-model:value="form.notification" />
  </DuxFormItem>
</template>
```

## DuxFormLayout 表单布局

表单布局组件，提供统一的表单布局和上下文配置。

### 属性

| 属性名         | 类型                         | 默认值 | 说明           |
| -------------- | ---------------------------- | ------ | -------------- |
| labelPlacement | 'left' \| 'top' \| 'setting' | 'left' | 标签位置       |
| labelWidth     | number                       | -      | 标签宽度       |
| inline         | boolean                      | false  | 是否内联显示   |
| divider        | boolean                      | false  | 是否显示分割线 |

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 表单内容 |

### 基础用法

```vue
<script setup>
import { DuxFormItem, DuxFormLayout } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  phone: ''
})
</script>

<template>
  <DuxFormLayout label-placement="top" :label-width="80" divider>
    <DuxFormItem label="姓名" path="name" rule="required">
      <n-input v-model:value="form.name" />
    </DuxFormItem>

    <DuxFormItem label="邮箱" path="email" rule="required|email">
      <n-input v-model:value="form.email" />
    </DuxFormItem>

    <DuxFormItem label="手机" path="phone">
      <n-input v-model:value="form.phone" />
    </DuxFormItem>
  </DuxFormLayout>
</template>
```

## DuxModalForm 模态框表单

模态框表单组件，集成了表单管理、验证和模态框显示。

### 属性

| 属性名    | 类型                                   | 默认值 | 说明                             |
| --------- | -------------------------------------- | ------ | -------------------------------- |
| id        | string \| number                       | -      | 编辑时的记录 ID                  |
| action    | 'create' \| 'edit'                     | -      | 操作类型                         |
| path      | string                                 | -      | API 路径                         |
| data      | MaybeRef<Record<string, any>>          | -      | 表单数据                         |
| onClose   | () => void                             | -      | 关闭回调                         |
| title     | string                                 | -      | 标题（默认根据 action 自动设置） |
| onSuccess | (data?: IDataProviderResponse) => void | -      | 成功回调                         |
| onError   | (error?: IDataProviderError) => void   | -      | 错误回调                         |

**继承自 DuxFormLayout 的所有属性**

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 表单内容 |

### 基础用法

```vue
<script setup>
import { DuxFormItem, DuxModalForm } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const showModal = ref(false)
const formData = ref({
  name: '',
  email: ''
})

function handleSuccess(data) {
  console.log('保存成功:', data)
  showModal.value = false
}
</script>

<template>
  <DuxModalForm
    v-if="showModal"
    title="创建用户"
    path="/api/users"
    action="create"
    :data="formData"
    label-placement="top"
    @close="showModal = false"
    @success="handleSuccess"
  >
    <DuxFormItem label="姓名" path="name" rule="required">
      <n-input v-model:value="formData.name" />
    </DuxFormItem>

    <DuxFormItem label="邮箱" path="email" rule="required|email">
      <n-input v-model:value="formData.email" />
    </DuxFormItem>
  </DuxModalForm>
</template>
```

### 编辑模式

```vue
<script setup>
const editData = ref({})

function handleEdit(id) {
  showModal.value = true
  editId.value = id
}
</script>

<template>
  <DuxModalForm
    v-if="showModal"
    :id="editId"
    title="编辑用户"
    path="/api/users"
    action="edit"
    :data="editData"
    @close="showModal = false"
    @success="handleSuccess"
  >
    <DuxFormItem label="姓名" path="name" rule="required">
      <n-input v-model:value="editData.name" />
    </DuxFormItem>

    <DuxFormItem label="邮箱" path="email" rule="required|email">
      <n-input v-model:value="editData.email" />
    </DuxFormItem>
  </DuxModalForm>
</template>
```

## DuxPageForm 页面表单

页面表单组件，提供完整的页面级表单布局。

### 属性

| 属性名    | 类型                                   | 默认值   | 说明            |
| --------- | -------------------------------------- | -------- | --------------- |
| id        | string \| number                       | -        | 编辑时的记录 ID |
| action    | 'create' \| 'edit'                     | -        | 操作类型        |
| path      | string                                 | -        | API 路径        |
| data      | MaybeRef<Record<string, any>>          | -        | 表单数据        |
| onSuccess | (data?: IDataProviderResponse) => void | -        | 成功回调        |
| onError   | (error?: IDataProviderError) => void   | -        | 错误回调        |
| size      | 'small' \| 'medium' \| 'large'         | 'medium' | 表单尺寸        |

### 插槽

| 插槽名  | 说明           | 参数                                             |
| ------- | -------------- | ------------------------------------------------ |
| default | 表单内容       | `{ form, isLoading, onSubmit, onReset, isEdit }` |
| actions | 自定义操作按钮 | `{ form, isLoading, onSubmit, onReset, isEdit }` |

### 基础用法

```vue
<script setup>
import { DuxFormItem, DuxFormLayout, DuxPageForm } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  description: ''
})

function handleSuccess(data) {
  console.log('保存成功:', data)
  // 可以跳转到列表页或其他操作
}
</script>

<template>
  <DuxPageForm
    path="/api/users"
    action="create"
    :data="formData"
    size="large"
    @success="handleSuccess"
  >
    <template #default="{ form, isLoading }">
      <DuxFormLayout label-placement="top" divider>
        <DuxFormItem label="姓名" path="name" rule="required">
          <n-input v-model:value="form.name" :disabled="isLoading" />
        </DuxFormItem>

        <DuxFormItem label="邮箱" path="email" rule="required|email">
          <n-input v-model:value="form.email" :disabled="isLoading" />
        </DuxFormItem>

        <DuxFormItem label="描述" path="description">
          <n-input
            v-model:value="form.description"
            type="textarea"
            :disabled="isLoading"
            :rows="4"
          />
        </DuxFormItem>
      </DuxFormLayout>
    </template>
  </DuxPageForm>
</template>
```

## DuxSettingForm 设置表单

设置表单组件，适用于设置页面，支持标签页布局。

### 属性

| 属性名     | 类型                                   | 默认值   | 说明               |
| ---------- | -------------------------------------- | -------- | ------------------ |
| id         | string \| number                       | -        | 编辑时的记录 ID    |
| action     | 'create' \| 'edit'                     | -        | 操作类型           |
| path       | string                                 | -        | API 路径           |
| data       | MaybeRef<Record<string, any>>          | -        | 表单数据           |
| onSuccess  | (data?: IDataProviderResponse) => void | -        | 成功回调           |
| onError    | (error?: IDataProviderError) => void   | -        | 错误回调           |
| tabs       | boolean                                | false    | 是否启用标签页布局 |
| defaultTab | string                                 | ''       | 默认激活的标签页   |
| size       | 'small' \| 'medium' \| 'large'         | 'medium' | 表单尺寸           |

### 插槽

| 插槽名  | 说明     | 参数                                             |
| ------- | -------- | ------------------------------------------------ |
| default | 表单内容 | `{ form, isLoading, onSubmit, onReset, isEdit }` |

### 基础用法

```vue
<script setup>
import { DuxFormItem, DuxFormLayout, DuxSettingForm } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const settingsData = ref({
  siteName: '',
  siteUrl: '',
  emailEnabled: false,
  emailHost: '',
  emailPort: 587
})
</script>

<template>
  <DuxSettingForm
    path="/api/settings"
    action="edit"
    :data="settingsData"
    size="large"
  >
    <template #default="{ form }">
      <DuxFormLayout label-placement="setting" divider>
        <DuxFormItem label="站点名称" path="siteName" rule="required">
          <n-input v-model:value="form.siteName" />
        </DuxFormItem>

        <DuxFormItem label="站点URL" path="siteUrl" rule="required|url">
          <n-input v-model:value="form.siteUrl" />
        </DuxFormItem>

        <DuxFormItem label="启用邮件" path="emailEnabled">
          <n-switch v-model:value="form.emailEnabled" />
        </DuxFormItem>

        <DuxFormItem label="邮件主机" path="emailHost" rule="required_if:emailEnabled,true">
          <n-input v-model:value="form.emailHost" :disabled="!form.emailEnabled" />
        </DuxFormItem>
      </DuxFormLayout>
    </template>
  </DuxSettingForm>
</template>
```

### 标签页模式

```vue
<script setup>
import { DuxFormItem, DuxFormLayout, DuxSettingForm } from '@duxweb/dvha-pro'
import { NTabPane } from 'naive-ui'
import { ref } from 'vue'

const settingsData = ref({
  // 基础设置
  siteName: '',
  siteUrl: '',
  // 邮件设置
  emailEnabled: false,
  emailHost: '',
  emailPort: 587
})
</script>

<template>
  <DuxSettingForm
    path="/api/settings"
    action="edit"
    :data="settingsData"
    tabs
    default-tab="basic"
    size="large"
  >
    <template #default="{ form }">
      <NTabPane name="basic" tab="基础设置">
        <DuxFormLayout label-placement="setting" divider>
          <DuxFormItem label="站点名称" path="siteName" rule="required">
            <n-input v-model:value="form.siteName" />
          </DuxFormItem>

          <DuxFormItem label="站点URL" path="siteUrl" rule="required|url">
            <n-input v-model:value="form.siteUrl" />
          </DuxFormItem>
        </DuxFormLayout>
      </NTabPane>

      <NTabPane name="email" tab="邮件设置">
        <DuxFormLayout label-placement="setting" divider>
          <DuxFormItem label="启用邮件" path="emailEnabled">
            <n-switch v-model:value="form.emailEnabled" />
          </DuxFormItem>

          <DuxFormItem label="邮件主机" path="emailHost" rule="required_if:emailEnabled,true">
            <n-input v-model:value="form.emailHost" :disabled="!form.emailEnabled" />
          </DuxFormItem>

          <DuxFormItem label="邮件端口" path="emailPort" rule="required_if:emailEnabled,true|numeric">
            <n-input-number v-model:value="form.emailPort" :disabled="!form.emailEnabled" />
          </DuxFormItem>
        </DuxFormLayout>
      </NTabPane>
    </template>
  </DuxSettingForm>
</template>
```

## 表单验证

所有表单组件都内置了基于 `useExtendForm` 的验证功能，支持 vee-validate 规则和 Yup Schema 验证。

### 基础验证规则

```vue
<template>
  <DuxFormItem label="用户名" path="username" rule="required|min:3|max:20">
    <n-input v-model:value="form.username" />
  </DuxFormItem>

  <DuxFormItem label="邮箱" path="email" rule="required|email">
    <n-input v-model:value="form.email" />
  </DuxFormItem>

  <DuxFormItem label="年龄" path="age" rule="required|numeric|min_value:18">
    <n-input-number v-model:value="form.age" />
  </DuxFormItem>
</template>
```

### Yup Schema 验证

```vue
<script setup>
import * as yup from 'yup'

const validationSchema = yup.object({
  username: yup.string()
    .required('用户名是必填的')
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符'),
  email: yup.string()
    .required('邮箱是必填的')
    .email('请输入有效邮箱'),
  age: yup.number()
    .required('年龄是必填的')
    .min(18, '年龄必须大于18岁')
})
</script>

<template>
  <DuxModalForm
    path="/api/users"
    action="create"
    :data="formData"
    :rules="validationSchema"
  >
    <!-- 表单项 -->
  </DuxModalForm>
</template>
```
