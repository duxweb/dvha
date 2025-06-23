# 卡片组件

卡片组件提供了灵活的容器布局，支持头部、内容、底部等区域的自定义配置，是构建界面的基础组件。

## 导入

```typescript
import { DuxCard } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下卡片组件：

- **DuxCard** - 通用卡片容器组件

## DuxCard 通用卡片容器

通用卡片容器组件，提供了灵活的布局结构，支持头部、内容、底部区域的自定义，以及多种样式配置。

### 属性

| 属性名         | 类型                                     | 默认值    | 说明               |
| -------------- | ---------------------------------------- | --------- | ------------------ |
| size           | 'none' \| 'small' \| 'medium' \| 'large' | 'none'    | 整体内边距尺寸     |
| headerSize     | 'none' \| 'small' \| 'medium' \| 'large' | 'medium'  | 头部内边距尺寸     |
| footerSize     | 'none' \| 'small' \| 'medium' \| 'large' | 'medium'  | 底部内边距尺寸     |
| contentSize    | 'none' \| 'small' \| 'medium' \| 'large' | 'medium'  | 内容区域内边距尺寸 |
| divide         | boolean                                  | false     | 是否显示分割线     |
| headerClass    | string                                   | ''        | 头部自定义样式类   |
| footerClass    | string                                   | ''        | 底部自定义样式类   |
| contentClass   | string                                   | ''        | 内容自定义样式类   |
| title          | string                                   | ''        | 卡片标题           |
| description    | string                                   | ''        | 卡片描述           |
| bordered       | boolean                                  | false     | 是否显示边框       |
| shadow         | boolean                                  | true      | 是否显示阴影       |
| headerBordered | boolean                                  | false     | 头部是否显示边框   |
| footerBordered | boolean                                  | false     | 底部是否显示边框   |
| type           | 'default' \| 'elevated' \| 'inverted'    | 'default' | 卡片类型           |

### 插槽

| 插槽名      | 说明         |
| ----------- | ------------ |
| default     | 主要内容区域 |
| header      | 头部内容     |
| footer      | 底部内容     |
| headerExtra | 头部额外内容 |

### 基础用法

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 基础卡片 -->
  <DuxCard title="基础卡片" description="这是一个基础的卡片组件">
    <p>这里是卡片的主要内容区域</p>
  </DuxCard>

  <!-- 自定义头部和底部 -->
  <DuxCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">
          自定义头部
        </h3>
        <button class="text-primary">
          操作
        </button>
      </div>
    </template>

    <p>卡片内容</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button class="px-4 py-2 text-sm border rounded">
          取消
        </button>
        <button class="px-4 py-2 text-sm bg-primary text-white rounded">
          确认
        </button>
      </div>
    </template>
  </DuxCard>
</template>
```

### 不同尺寸

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 无内边距 -->
  <DuxCard title="无内边距" size="none">
    <div class="p-4 bg-gray-50">
      自定义内边距的内容
    </div>
  </DuxCard>

  <!-- 小尺寸 -->
  <DuxCard title="小尺寸" size="small">
    <p>小尺寸内边距的卡片</p>
  </DuxCard>

  <!-- 中等尺寸 -->
  <DuxCard title="中等尺寸" size="medium">
    <p>中等尺寸内边距的卡片</p>
  </DuxCard>

  <!-- 大尺寸 -->
  <DuxCard title="大尺寸" size="large">
    <p>大尺寸内边距的卡片</p>
  </DuxCard>
</template>
```

### 不同类型

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 默认类型 -->
  <DuxCard title="默认卡片" type="default">
    <p>这是默认类型的卡片</p>
  </DuxCard>

  <!-- 浮起类型 -->
  <DuxCard title="浮起卡片" type="elevated">
    <p>这是浮起类型的卡片，具有更明显的阴影效果</p>
  </DuxCard>

  <!-- 反色类型 -->
  <DuxCard title="反色卡片" type="inverted">
    <p>这是反色类型的卡片，适用于深色主题</p>
  </DuxCard>
</template>
```

### 边框和分割线

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 带边框的卡片 -->
  <DuxCard title="带边框卡片" bordered>
    <p>这是带有边框的卡片</p>
  </DuxCard>

  <!-- 带分割线的卡片 -->
  <DuxCard divide>
    <template #header>
      <h3>头部区域</h3>
    </template>

    <p>内容区域</p>

    <template #footer>
      <p>底部区域</p>
    </template>
  </DuxCard>

  <!-- 头部和底部边框 -->
  <DuxCard header-bordered footer-bordered>
    <template #header>
      <h3>带边框的头部</h3>
    </template>

    <p>内容区域</p>

    <template #footer>
      <p>带边框的底部</p>
    </template>
  </DuxCard>
</template>
```

### 复杂布局示例

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NTag } from 'naive-ui'
import { ref } from 'vue'

const stats = ref([
  { label: '总访问量', value: '12,345' },
  { label: '今日访问', value: '1,234' },
  { label: '用户数', value: '567' },
  { label: '转化率', value: '12.3%' }
])
</script>

<template>
  <!-- 统计卡片 -->
  <DuxCard title="网站统计" description="最近30天的数据统计" divide>
    <template #headerExtra>
      <NTag type="success" size="small">
        实时
      </NTag>
    </template>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="text-2xl font-bold text-primary">
          {{ stat.value }}
        </div>
        <div class="text-sm text-muted">
          {{ stat.label }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <span class="text-sm text-muted">最后更新：2024-01-01 12:00</span>
        <NButton size="small">
          查看详情
        </NButton>
      </div>
    </template>
  </DuxCard>

  <!-- 用户信息卡片 -->
  <DuxCard size="none" bordered>
    <template #header>
      <div class="flex items-center gap-3 p-4">
        <img src="/avatar.jpg" alt="用户头像" class="w-12 h-12 rounded-full">
        <div>
          <h3 class="font-medium">
            张三
          </h3>
          <p class="text-sm text-muted">
            高级开发工程师
          </p>
        </div>
      </div>
    </template>

    <div class="px-4 pb-4">
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-muted">邮箱</span>
          <span>zhangsan@example.com</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">部门</span>
          <span>技术部</span>
        </div>
        <div class="flex justify-between">
          <span class="text-muted">入职时间</span>
          <span>2023-01-01</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 p-4 pt-0">
        <NButton size="small" block>
          发送消息
        </NButton>
        <NButton size="small" type="primary" block>
          查看详情
        </NButton>
      </div>
    </template>
  </DuxCard>
</template>
```

### 表单卡片

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NInput, NSelect } from 'naive-ui'
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  department: ''
})

const departments = [
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '设计部', value: 'design' }
]
</script>

<template>
  <DuxCard title="用户信息" description="请填写完整的用户信息" divide>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">姓名</label>
        <NInput v-model:value="formData.name" placeholder="请输入姓名" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">邮箱</label>
        <NInput v-model:value="formData.email" placeholder="请输入邮箱" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">部门</label>
        <NSelect
          v-model:value="formData.department"
          :options="departments"
          placeholder="请选择部门"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <NButton>取消</NButton>
        <NButton type="primary">
          保存
        </NButton>
      </div>
    </template>
  </DuxCard>
</template>
```

### 图片卡片

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NTag } from 'naive-ui'
</script>

<template>
  <DuxCard size="none" class="overflow-hidden">
    <template #header>
      <div class="relative">
        <img
          src="/product-image.jpg"
          alt="产品图片"
          class="w-full h-48 object-cover"
        >
        <div class="absolute top-2 right-2">
          <NTag type="error" size="small">
            热销
          </NTag>
        </div>
      </div>
    </template>

    <div class="p-4">
      <h3 class="text-lg font-medium mb-2">
        产品名称
      </h3>
      <p class="text-muted text-sm mb-3">
        这里是产品的详细描述信息，介绍产品的主要特点和优势。
      </p>
      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold text-red-500">¥299</span>
        <span class="text-sm text-muted line-through">¥399</span>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-2 p-4 pt-0">
        <NButton block>
          加入购物车
        </NButton>
        <NButton type="primary" block>
          立即购买
        </NButton>
      </div>
    </template>
  </DuxCard>
</template>
```

## 设计特性

### 灵活的布局结构

- **头部区域** - 支持标题、描述和额外操作
- **内容区域** - 主要内容展示区域
- **底部区域** - 操作按钮或补充信息

### 丰富的样式配置

- **尺寸控制** - 支持不同区域的内边距配置
- **视觉效果** - 边框、阴影、分割线等视觉元素
- **主题适配** - 支持不同的卡片类型和主题

### 响应式设计

- 自动适配不同屏幕尺寸
- 支持移动端和桌面端的最佳显示效果
- 灵活的网格布局支持

## 最佳实践

### 内容组织

- 使用清晰的标题和描述
- 合理组织内容层次结构
- 避免在单个卡片中放置过多信息

### 样式一致性

- 在同一页面中保持卡片样式的一致性
- 合理使用边框和分割线
- 选择合适的内边距尺寸

### 交互设计

- 在需要时提供悬停效果
- 合理放置操作按钮
- 使用适当的视觉反馈

## 常见问题

### Q: 如何自定义卡片的背景色？

A: 可以通过 CSS 类名或内联样式来自定义背景色，也可以使用 `type` 属性选择预设的主题。

### Q: 如何控制卡片的宽度和高度？

A: 卡片的尺寸由其容器控制，可以通过 CSS 类名或网格布局来设置宽度和高度。

### Q: 如何在卡片中嵌套其他组件？

A: 卡片组件支持任意内容的嵌套，可以在插槽中放置其他组件、表单元素或自定义内容。

### Q: 如何实现卡片的响应式布局？

A: 使用 CSS Grid 或 Flexbox 布局，结合响应式断点类名来实现不同屏幕下的布局效果。
