# 选择组件

选择组件提供了卡片样式的选择器，适用于选项较少且需要直观展示的场景。

## 导入

```typescript
import { DuxSelectCard } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下选择组件：

- **DuxSelectCard** - 卡片选择组件

## DuxSelectCard 卡片选择组件

卡片选择组件提供了视觉化的选择方式，支持单选和多选，适用于套餐选择、配置选择等场景。

### 属性

| 属性名       | 类型                                     | 默认值  | 说明         |
| ------------ | ---------------------------------------- | ------- | ------------ |
| options      | CardSelectOption[]                       | []      | 选项数据     |
| value        | string \| number \| (string \| number)[] | -       | 选中的值     |
| defaultValue | string \| number \| (string \| number)[] | -       | 默认选中的值 |
| multiple     | boolean                                  | false   | 是否支持多选 |
| disabled     | boolean                                  | false   | 是否禁用     |
| minWidth     | string                                   | '150px' | 卡片最小宽度 |
| maxWidth     | string                                   | '200px' | 卡片最大宽度 |

### 事件

| 事件名       | 类型                                                      | 说明         |
| ------------ | --------------------------------------------------------- | ------------ |
| update:value | (value: string \| number \| (string \| number)[]) => void | 值更新时触发 |

### CardSelectOption 接口

```typescript
interface CardSelectOption {
  value: string | number // 选项值
  label: string // 选项标题
  description?: string // 选项描述
  disabled?: boolean // 是否禁用
  icon?: string // 图标类名
  iconColor?: string // 图标颜色
}
```

### 基础用法

```vue
<script setup lang="ts">
import { DuxSelectCard } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedPlan = ref('basic')

const planOptions = [
  {
    value: 'basic',
    label: '基础版',
    description: '适合个人用户使用',
    icon: 'i-tabler:user',
    iconColor: 'primary'
  },
  {
    value: 'pro',
    label: '专业版',
    description: '适合小团队使用',
    icon: 'i-tabler:users',
    iconColor: 'success'
  },
  {
    value: 'enterprise',
    label: '企业版',
    description: '适合大型企业使用',
    icon: 'i-tabler:building',
    iconColor: 'warning'
  }
]
</script>

<template>
  <DuxSelectCard
    v-model:value="selectedPlan"
    :options="planOptions"
  />
</template>
```

### 多选模式

```vue
<script setup lang="ts">
import { DuxSelectCard } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedFeatures = ref<string[]>(['storage', 'backup'])

const featureOptions = [
  {
    value: 'storage',
    label: '云存储',
    description: '100GB 云存储空间',
    icon: 'i-tabler:cloud',
    iconColor: 'primary'
  },
  {
    value: 'backup',
    label: '自动备份',
    description: '每日自动备份数据',
    icon: 'i-tabler:device-floppy',
    iconColor: 'success'
  },
  {
    value: 'analytics',
    label: '数据分析',
    description: '高级数据分析功能',
    icon: 'i-tabler:chart-line',
    iconColor: 'info'
  },
  {
    value: 'support',
    label: '技术支持',
    description: '7x24 技术支持服务',
    icon: 'i-tabler:headset',
    iconColor: 'warning'
  }
]
</script>

<template>
  <DuxSelectCard
    v-model:value="selectedFeatures"
    :options="featureOptions"
    multiple
  />
</template>
```

### 自定义样式

```vue
<script setup lang="ts">
import { DuxSelectCard } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedSize = ref('medium')

const sizeOptions = [
  {
    value: 'small',
    label: '小型',
    description: '1-10 人团队'
  },
  {
    value: 'medium',
    label: '中型',
    description: '11-50 人团队'
  },
  {
    value: 'large',
    label: '大型',
    description: '51-200 人团队'
  },
  {
    value: 'enterprise',
    label: '企业级',
    description: '200+ 人团队'
  }
]
</script>

<template>
  <!-- 自定义卡片尺寸 -->
  <DuxSelectCard
    v-model:value="selectedSize"
    :options="sizeOptions"
    min-width="120px"
    max-width="180px"
  />
</template>
```

### 禁用状态

```vue
<script setup lang="ts">
import { DuxSelectCard } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedOption = ref('option1')

const options = [
  {
    value: 'option1',
    label: '选项 1',
    description: '这是选项 1 的描述'
  },
  {
    value: 'option2',
    label: '选项 2',
    description: '这是选项 2 的描述',
    disabled: true // 单个选项禁用
  },
  {
    value: 'option3',
    label: '选项 3',
    description: '这是选项 3 的描述'
  }
]
</script>

<template>
  <!-- 整体禁用 -->
  <DuxSelectCard
    v-model:value="selectedOption"
    :options="options"
    disabled
  />
</template>
```

### 表单集成

```vue
<script setup lang="ts">
import { DuxFormItem, DuxFormLayout, DuxSelectCard } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const formData = ref({
  plan: 'basic',
  features: ['storage']
})

const planOptions = [
  {
    value: 'basic',
    label: '基础版',
    description: '¥99/月',
    icon: 'i-tabler:star',
    iconColor: 'primary'
  },
  {
    value: 'pro',
    label: '专业版',
    description: '¥199/月',
    icon: 'i-tabler:crown',
    iconColor: 'warning'
  }
]

const featureOptions = [
  {
    value: 'storage',
    label: '扩展存储',
    description: '+500GB 存储空间'
  },
  {
    value: 'priority',
    label: '优先支持',
    description: '优先技术支持'
  }
]
</script>

<template>
  <DuxFormLayout>
    <DuxFormItem label="选择套餐" path="plan">
      <DuxSelectCard
        v-model:value="formData.plan"
        :options="planOptions"
      />
    </DuxFormItem>

    <DuxFormItem label="附加功能" path="features">
      <DuxSelectCard
        v-model:value="formData.features"
        :options="featureOptions"
        multiple
      />
    </DuxFormItem>
  </DuxFormLayout>
</template>
```

### 响应式布局

卡片选择组件支持响应式布局，会根据容器宽度自动调整列数：

- 默认：2 列
- 大屏幕：根据 `minWidth` 和 `maxWidth` 自动适配列数
- 支持通过 CSS Grid 实现灵活布局

### 最佳实践

#### 1. 选项数量建议

- 单选：建议不超过 6 个选项
- 多选：建议不超过 12 个选项
- 选项过多时考虑使用分页或搜索功能

#### 2. 描述文本

- 保持描述简洁明了
- 突出选项的核心特点
- 避免过长的描述文本

#### 3. 图标使用

- 使用语义化的图标
- 保持图标风格一致
- 合理使用颜色区分不同类型

#### 4. 无障碍支持

- 提供清晰的标签文本
- 支持键盘导航
- 合理的颜色对比度

### 常见问题

#### 1. 如何实现动态选项？

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const category = ref('basic')
const selectedPlan = ref('')

const planOptions = computed(() => {
  if (category.value === 'basic') {
    return [
      { value: 'starter', label: '入门版', description: '基础功能' },
      { value: 'standard', label: '标准版', description: '完整功能' }
    ]
  }
  return [
    { value: 'pro', label: '专业版', description: '高级功能' },
    { value: 'enterprise', label: '企业版', description: '全部功能' }
  ]
})
</script>

<template>
  <DuxSelectCard
    v-model:value="selectedPlan"
    :options="planOptions"
  />
</template>
```

#### 2. 如何自定义选中状态样式？

可以通过 CSS 变量或 UnoCSS 类名自定义样式：

```vue
<template>
  <div class="custom-select-card">
    <DuxSelectCard
      v-model:value="selectedValue"
      :options="options"
    />
  </div>
</template>

<style>
.custom-select-card {
  --ui-color-primary: 59 130 246; /* 自定义主色调 */
}
</style>
```
