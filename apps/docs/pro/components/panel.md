# 面板组件

面板组件提供了信息展示的容器，包括警告面板和卡片面板等。

## 导入

```typescript
import {
  DuxPanelAlert,
  DuxPanelCard
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下面板组件：

- **DuxPanelAlert** - 警告面板组件
- **DuxPanelCard** - 卡片面板组件

## DuxPanelAlert 警告面板

警告面板组件，用于显示重要信息或警告内容，支持不同的警告类型和操作按钮。

### 属性

| 属性名      | 类型                                                     | 默认值    | 说明     |
| ----------- | -------------------------------------------------------- | --------- | -------- |
| type        | 'default' \| 'error' \| 'warning' \| 'info' \| 'success' | 'default' | 警告类型 |
| title       | string                                                   | ''        | 标题     |
| description | string                                                   | ''        | 描述信息 |

### 插槽

| 插槽名      | 说明     |
| ----------- | -------- |
| title       | 标题内容 |
| description | 描述内容 |
| actions     | 操作按钮 |

### 基础用法

```vue
<script setup>
import { DuxPanelAlert } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'
</script>

<template>
  <!-- 基础警告面板 -->
  <DuxPanelAlert
    type="info"
    title="信息提示"
    description="这是一条重要的信息提示，请仔细阅读。"
  />

  <!-- 错误警告面板 -->
  <DuxPanelAlert
    type="error"
    title="危险操作"
    description="此操作不可逆，请谨慎考虑后再进行操作。"
  >
    <template #actions>
      <NButton type="error">
        确认删除
      </NButton>
    </template>
  </DuxPanelAlert>

  <!-- 成功提示面板 -->
  <DuxPanelAlert
    type="success"
    title="操作成功"
    description="您的设置已成功保存，更改将立即生效。"
  >
    <template #actions>
      <NButton type="primary">
        继续操作
      </NButton>
    </template>
  </DuxPanelAlert>
</template>
```

### 不同类型

```vue
<script setup>
import { DuxPanelAlert } from '@duxweb/dvha-pro'
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 默认类型 -->
    <DuxPanelAlert
      title="默认提示"
      description="这是默认类型的面板提示。"
    />

    <!-- 信息类型 -->
    <DuxPanelAlert
      type="info"
      title="信息提示"
      description="这是信息类型的面板提示。"
    />

    <!-- 成功类型 -->
    <DuxPanelAlert
      type="success"
      title="成功提示"
      description="这是成功类型的面板提示。"
    />

    <!-- 警告类型 -->
    <DuxPanelAlert
      type="warning"
      title="警告提示"
      description="这是警告类型的面板提示。"
    />

    <!-- 错误类型 -->
    <DuxPanelAlert
      type="error"
      title="错误提示"
      description="这是错误类型的面板提示。"
    />
  </div>
</template>
```

### 自定义内容

```vue
<script setup>
import { DuxPanelAlert } from '@duxweb/dvha-pro'
import { NButton, NSpace } from 'naive-ui'
</script>

<template>
  <DuxPanelAlert type="warning">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="i-tabler:alert-triangle text-warning" />
        账号安全警告
      </div>
    </template>

    <template #description>
      <div class="space-y-2">
        <p>检测到您的账号存在以下安全风险：</p>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>密码强度较弱</li>
          <li>未开启两步验证</li>
          <li>登录设备异常</li>
        </ul>
      </div>
    </template>

    <template #actions>
      <NSpace>
        <NButton>
          忽略
        </NButton>
        <NButton type="warning">
          立即修复
        </NButton>
      </NSpace>
    </template>
  </DuxPanelAlert>
</template>
```

## DuxPanelCard 卡片面板

卡片面板组件，用于设置页面的内容区域布局，提供标题、描述和操作按钮区域。

### 属性

| 属性名      | 类型                                     | 默认值 | 说明         |
| ----------- | ---------------------------------------- | ------ | ------------ |
| title       | string                                   | ''     | 面板标题     |
| description | string                                   | ''     | 面板描述     |
| padding     | 'none' \| 'small' \| 'medium' \| 'large' | -      | 内容区域边距 |

### 插槽

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 面板内容     |
| actions | 操作按钮区域 |

### 基础用法

```vue
<script setup>
import { DuxFormItem, DuxFormLayout, DuxPanelCard } from '@duxweb/dvha-pro'
import { NButton, NInput, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  notifications: true
})
</script>

<template>
  <DuxPanelCard
    title="个人信息"
    description="管理您的个人资料信息"
  >
    <template #actions>
      <NButton type="primary">
        保存更改
      </NButton>
    </template>

    <DuxFormLayout label-placement="setting" divider>
      <DuxFormItem label="姓名" path="name">
        <NInput v-model:value="form.name" />
      </DuxFormItem>

      <DuxFormItem label="邮箱" path="email">
        <NInput v-model:value="form.email" />
      </DuxFormItem>

      <DuxFormItem label="接收通知" path="notifications">
        <NSwitch v-model:value="form.notifications" />
      </DuxFormItem>
    </DuxFormLayout>
  </DuxPanelCard>
</template>
```

### 不同边距设置

```vue
<script setup>
import { DuxPanelCard } from '@duxweb/dvha-pro'
</script>

<template>
  <div class="space-y-4">
    <!-- 无边距 -->
    <DuxPanelCard
      title="无边距面板"
      description="内容区域没有内边距"
      padding="none"
    >
      <div class="bg-gray-100 p-4">
        这里是内容区域，没有额外的边距
      </div>
    </DuxPanelCard>

    <!-- 小边距 -->
    <DuxPanelCard
      title="小边距面板"
      description="内容区域有较小的内边距"
      padding="small"
    >
      <div class="bg-gray-100">
        这里是内容区域，有小边距
      </div>
    </DuxPanelCard>

    <!-- 中等边距 -->
    <DuxPanelCard
      title="中等边距面板"
      description="内容区域有中等的内边距"
      padding="medium"
    >
      <div class="bg-gray-100">
        这里是内容区域，有中等边距
      </div>
    </DuxPanelCard>

    <!-- 大边距 -->
    <DuxPanelCard
      title="大边距面板"
      description="内容区域有较大的内边距"
      padding="large"
    >
      <div class="bg-gray-100">
        这里是内容区域，有大边距
      </div>
    </DuxPanelCard>
  </div>
</template>
```

### 设置页面示例

```vue
<script setup>
import { DuxFormItem, DuxFormLayout, DuxPanelAlert, DuxPanelCard } from '@duxweb/dvha-pro'
import { NButton, NInput, NSelect, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const profileForm = ref({
  nickname: '',
  email: '',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai'
})

const securityForm = ref({
  twoFactor: false,
  loginNotification: true,
  deviceLimit: 5
})

const languageOptions = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

const timezoneOptions = [
  { label: '北京时间', value: 'Asia/Shanghai' },
  { label: '东京时间', value: 'Asia/Tokyo' },
  { label: 'UTC', value: 'UTC' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- 个人资料设置 -->
    <DuxPanelCard
      title="个人资料"
      description="管理您的公开资料信息"
    >
      <template #actions>
        <NButton type="primary">
          保存资料
        </NButton>
      </template>

      <DuxFormLayout label-placement="setting" divider>
        <DuxFormItem label="昵称" path="nickname">
          <NInput v-model:value="profileForm.nickname" placeholder="请输入昵称" />
        </DuxFormItem>

        <DuxFormItem label="邮箱地址" path="email">
          <NInput v-model:value="profileForm.email" placeholder="请输入邮箱" />
        </DuxFormItem>

        <DuxFormItem label="界面语言" path="language">
          <NSelect v-model:value="profileForm.language" :options="languageOptions" />
        </DuxFormItem>

        <DuxFormItem label="时区设置" path="timezone">
          <NSelect v-model:value="profileForm.timezone" :options="timezoneOptions" />
        </DuxFormItem>
      </DuxFormLayout>
    </DuxPanelCard>

    <!-- 安全设置 -->
    <DuxPanelCard
      title="安全设置"
      description="管理您的账号安全选项"
    >
      <template #actions>
        <NButton type="primary">
          保存设置
        </NButton>
      </template>

      <DuxFormLayout label-placement="setting" divider>
        <DuxFormItem label="两步验证" path="twoFactor">
          <NSwitch v-model:value="securityForm.twoFactor" />
        </DuxFormItem>

        <DuxFormItem label="登录通知" path="loginNotification">
          <NSwitch v-model:value="securityForm.loginNotification" />
        </DuxFormItem>

        <DuxFormItem label="设备限制" path="deviceLimit">
          <NInput
            v-model:value="securityForm.deviceLimit"
            type="number"
            placeholder="同时登录设备数量"
          />
        </DuxFormItem>
      </DuxFormLayout>
    </DuxPanelCard>

    <!-- 危险操作区域 -->
    <DuxPanelAlert
      type="error"
      title="删除账号"
      description="删除账号后将无法恢复，请谨慎操作。"
    >
      <template #actions>
        <NButton type="error">
          删除账号
        </NButton>
      </template>
    </DuxPanelAlert>
  </div>
</template>
```

## 最佳实践

### 面板组合使用

```vue
<script setup>
import { DuxPanelAlert, DuxPanelCard } from '@duxweb/dvha-pro'
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- 信息提示 -->
    <DuxPanelAlert
      type="info"
      title="设置说明"
      description="以下设置将影响您的账号安全和使用体验。"
    />

    <!-- 主要设置区域 -->
    <DuxPanelCard
      title="账号设置"
      description="管理您的账号基本信息"
    >
      <!-- 设置表单内容 -->
    </DuxPanelCard>

    <!-- 警告提示 -->
    <DuxPanelAlert
      type="warning"
      title="注意事项"
      description="修改某些设置可能需要重新登录才能生效。"
    />
  </div>
</template>
```

### 响应式布局

```vue
<script setup>
import { DuxPanelCard } from '@duxweb/dvha-pro'
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <DuxPanelCard title="左侧面板" description="这是左侧的设置面板">
      <!-- 左侧内容 -->
    </DuxPanelCard>

    <DuxPanelCard title="右侧面板" description="这是右侧的设置面板">
      <!-- 右侧内容 -->
    </DuxPanelCard>
  </div>
</template>
```

## 常见问题

### 如何自定义警告面板的颜色？

警告面板的颜色由 `type` 属性控制，支持 5 种预定义类型。如需自定义颜色，可以通过 CSS 变量覆盖：

```css
.custom-alert {
  --ui-color-primary: 120 113 108; /* 自定义主色调 */
}
```

### 如何在面板中使用复杂的表单布局？

建议结合 `DuxFormLayout` 和 `DuxFormItem` 组件使用：

```vue
<DuxPanelCard title="复杂表单">
  <DuxFormLayout label-placement="setting" divider>
    <DuxFormItem label="字段1">
      <!-- 表单控件 -->
    </DuxFormItem>
    <DuxFormItem label="字段2">
      <!-- 表单控件 -->
    </DuxFormItem>
  </DuxFormLayout>
</DuxPanelCard>
```

### 面板组件是否支持嵌套使用？

不建议嵌套使用面板组件，这可能导致样式冲突。如需复杂布局，建议使用网格系统或其他布局组件。
