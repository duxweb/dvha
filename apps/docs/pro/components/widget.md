# 小部件

小部件提供了常用的UI元素，包括头像、图片、连接状态等基础组件。

## 导入

```typescript
import {
  DuxAvatar,
  DuxConnect,
  DuxImage
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下小部件组件：

- **DuxAvatar** - 头像组件
- **DuxImage** - 图片组件
- **DuxConnect** - 连接状态组件

## DuxAvatar 头像组件

头像组件基于 Naive UI 的 Avatar 组件扩展，提供了默认占位符和更好的用户体验。

### 属性

DuxAvatar 继承了 Naive UI Avatar 组件的所有属性，主要包括：

| 属性名    | 类型                                                     | 默认值   | 说明         |
| --------- | -------------------------------------------------------- | -------- | ------------ |
| src       | string                                                   | -        | 头像图片地址 |
| size      | number \| 'small' \| 'medium' \| 'large'                 | 'medium' | 头像尺寸     |
| round     | boolean                                                  | false    | 是否为圆形   |
| circle    | boolean                                                  | false    | 是否为圆形   |
| objectFit | 'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down' | 'cover'  | 图片适应方式 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxAvatar } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 基础头像 -->
  <DuxAvatar src="/user-avatar.jpg" />

  <!-- 圆形头像 -->
  <DuxAvatar src="/user-avatar.jpg" round />

  <!-- 不同尺寸 -->
  <DuxAvatar src="/user-avatar.jpg" size="small" />
  <DuxAvatar src="/user-avatar.jpg" size="medium" />
  <DuxAvatar src="/user-avatar.jpg" size="large" />
  <DuxAvatar src="/user-avatar.jpg" :size="64" />
</template>
```

### 默认占位符

当没有提供图片或图片加载失败时，组件会显示默认的占位符：

```vue
<script setup lang="ts">
import { DuxAvatar } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 无图片时显示默认占位符 -->
  <DuxAvatar />

  <!-- 图片加载失败时也会显示占位符 -->
  <DuxAvatar src="/invalid-image.jpg" />
</template>
```

### 头像组合

```vue
<script setup lang="ts">
import { DuxAvatar } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const teamMembers = ref([
  { name: '张三', avatar: '/avatar1.jpg' },
  { name: '李四', avatar: '/avatar2.jpg' },
  { name: '王五', avatar: '/avatar3.jpg' },
  { name: '赵六', avatar: '' }
])
</script>

<template>
  <!-- 团队成员头像 -->
  <div class="flex gap-2">
    <DuxAvatar
      v-for="member in teamMembers"
      :key="member.name"
      :src="member.avatar"
      round
      size="small"
    />
  </div>

  <!-- 头像堆叠效果 -->
  <div class="flex -space-x-2">
    <DuxAvatar
      v-for="(member, index) in teamMembers.slice(0, 3)"
      :key="member.name"
      :src="member.avatar"
      round
      :size="40"
      class="border-2 border-white"
      :style="{ zIndex: teamMembers.length - index }"
    />
    <div
      v-if="teamMembers.length > 3"
      class="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-sm"
    >
      +{{ teamMembers.length - 3 }}
    </div>
  </div>
</template>
```

## DuxImage 图片组件

图片组件基于 Naive UI 的 Image 组件扩展，提供了默认占位符和错误处理。

### 属性

DuxImage 继承了 Naive UI Image 组件的所有属性，主要包括：

| 属性名          | 类型                                                     | 默认值  | 说明         |
| --------------- | -------------------------------------------------------- | ------- | ------------ |
| src             | string                                                   | -       | 图片地址     |
| width           | number \| string                                         | -       | 图片宽度     |
| height          | number \| string                                         | -       | 图片高度     |
| objectFit       | 'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down' | 'cover' | 图片适应方式 |
| previewDisabled | boolean                                                  | false   | 是否禁用预览 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxImage } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 基础图片 -->
  <DuxImage src="/product-image.jpg" width="200" height="150" />

  <!-- 无图片时显示占位符 -->
  <DuxImage width="200" height="150" />

  <!-- 自定义适应方式 -->
  <DuxImage
    src="/product-image.jpg"
    width="200"
    height="150"
    object-fit="contain"
  />
</template>
```

### 图片列表

```vue
<script setup lang="ts">
import { DuxImage } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const productImages = ref([
  '/product1.jpg',
  '/product2.jpg',
  '/product3.jpg',
  '', // 空图片测试占位符
])
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <DuxImage
      v-for="(image, index) in productImages"
      :key="index"
      :src="image"
      width="200"
      height="150"
      class="rounded"
    />
  </div>
</template>
```

### 响应式图片

```vue
<script setup lang="ts">
import { DuxImage } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 响应式图片 -->
  <div class="w-full max-w-md">
    <DuxImage
      src="/banner-image.jpg"
      width="100%"
      height="200"
      class="rounded-lg"
    />
  </div>
</template>
```

## DuxConnect 连接状态组件

连接状态组件用于展示系统连接状态、API 状态等信息，提供友好的视觉反馈。

### 属性

| 属性名 | 类型   | 默认值 | 说明     |
| ------ | ------ | ------ | -------- |
| title  | string | -      | 标题     |
| desc   | string | -      | 描述     |
| value  | number | -      | 数值     |
| local  | string | -      | 位置信息 |

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 主要内容 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxConnect } from '@duxweb/dvha-pro'
</script>

<template>
  <DuxConnect
    title="API 连接状态"
    desc="服务器连接正常，响应时间良好"
    :value="98"
    local="北京"
  >
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 bg-success rounded-full" />
      <span class="text-success text-sm">连接正常</span>
    </div>
  </DuxConnect>
</template>
```

### 多个连接状态

```vue
<script setup lang="ts">
import { DuxConnect } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const connections = ref([
  {
    title: '数据库连接',
    desc: 'MySQL 数据库连接正常',
    value: 99,
    local: '上海',
    status: 'success'
  },
  {
    title: 'Redis 缓存',
    desc: 'Redis 服务运行正常',
    value: 95,
    local: '深圳',
    status: 'success'
  },
  {
    title: '消息队列',
    desc: 'RabbitMQ 连接异常',
    value: 0,
    local: '广州',
    status: 'error'
  }
])

function getStatusInfo(status: string) {
  const statusMap = {
    success: { color: 'bg-success', text: '正常', textColor: 'text-success' },
    warning: { color: 'bg-warning', text: '警告', textColor: 'text-warning' },
    error: { color: 'bg-error', text: '异常', textColor: 'text-error' }
  }
  return statusMap[status] || statusMap.error
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <DuxConnect
      v-for="conn in connections"
      :key="conn.title"
      :title="conn.title"
      :desc="conn.desc"
      :value="conn.value"
      :local="conn.local"
    >
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full" :class="[getStatusInfo(conn.status).color]" />
        <span class="text-sm" :class="[getStatusInfo(conn.status).textColor]">
          {{ getStatusInfo(conn.status).text }}
        </span>
      </div>
    </DuxConnect>
  </div>
</template>
```

### 实时状态监控

```vue
<script setup lang="ts">
import { DuxConnect } from '@duxweb/dvha-pro'
import { onMounted, onUnmounted, ref } from 'vue'

const systemStatus = ref({
  title: '系统状态监控',
  desc: '实时监控系统运行状态',
  value: 98,
  local: '本地',
  uptime: '99.9%',
  responseTime: '120ms'
})

let timer: NodeJS.Timeout

function updateStatus() {
  // 模拟状态更新
  systemStatus.value.value = Math.floor(Math.random() * 20) + 80
  systemStatus.value.responseTime = `${Math.floor(Math.random() * 100) + 50}ms`
}

onMounted(() => {
  timer = setInterval(updateStatus, 5000)
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>

<template>
  <DuxConnect
    :title="systemStatus.title"
    :desc="systemStatus.desc"
    :value="systemStatus.value"
    :local="systemStatus.local"
  >
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span class="text-success text-sm">运行中</span>
      </div>
      <div class="text-xs text-muted">
        <div>运行时间: {{ systemStatus.uptime }}</div>
        <div>响应时间: {{ systemStatus.responseTime }}</div>
      </div>
    </div>
  </DuxConnect>
</template>
```

### 综合示例

```vue
<script setup lang="ts">
import { DuxAvatar, DuxConnect, DuxImage } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const userProfile = ref({
  name: '张三',
  avatar: '/user-avatar.jpg',
  role: '系统管理员',
  status: 'online'
})

const galleryImages = ref([
  '/gallery1.jpg',
  '/gallery2.jpg',
  '/gallery3.jpg',
  '/gallery4.jpg'
])

const systemConnections = ref([
  {
    title: '主数据库',
    desc: '核心业务数据存储',
    value: 99,
    local: '主机房',
    status: 'success'
  },
  {
    title: '文件存储',
    desc: '静态资源存储服务',
    value: 95,
    local: 'CDN',
    status: 'success'
  }
])
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 用户信息 -->
    <div class="flex items-center gap-4 p-4 bg-elevated rounded-lg">
      <DuxAvatar :src="userProfile.avatar" :size="64" round />
      <div class="flex-1">
        <h3 class="text-lg font-medium">
          {{ userProfile.name }}
        </h3>
        <p class="text-muted">
          {{ userProfile.role }}
        </p>
        <div class="flex items-center gap-2 mt-2">
          <div class="w-2 h-2 bg-success rounded-full" />
          <span class="text-success text-sm">在线</span>
        </div>
      </div>
    </div>

    <!-- 图片画廊 -->
    <div class="p-4 bg-elevated rounded-lg">
      <h3 class="text-lg font-medium mb-4">
        图片展示
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DuxImage
          v-for="(image, index) in galleryImages"
          :key="index"
          :src="image"
          width="150"
          height="100"
          class="rounded"
        />
      </div>
    </div>

    <!-- 系统状态 -->
    <div class="p-4 bg-elevated rounded-lg">
      <h3 class="text-lg font-medium mb-4">
        系统连接状态
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DuxConnect
          v-for="conn in systemConnections"
          :key="conn.title"
          :title="conn.title"
          :desc="conn.desc"
          :value="conn.value"
          :local="conn.local"
        >
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-success rounded-full" />
            <span class="text-success text-sm">正常运行</span>
          </div>
        </DuxConnect>
      </div>
    </div>
  </div>
</template>
```

### 最佳实践

#### 1. 头像组件

- 提供合适的默认尺寸
- 使用圆形头像提升视觉效果
- 考虑头像的加载失败处理

#### 2. 图片组件

- 设置合适的宽高比
- 使用占位符提升用户体验
- 考虑图片的懒加载

#### 3. 连接状态

- 提供清晰的状态指示
- 使用合适的颜色区分状态
- 定期更新状态信息

#### 4. 性能优化

- 图片资源优化压缩
- 使用 CDN 加速加载
- 合理设置缓存策略

### 常见问题

#### 1. 如何自定义头像占位符？

头像组件的占位符是内置的 SVG 图标，如需自定义可以通过 CSS 覆盖或修改组件源码。

#### 2. 如何处理图片加载错误？

```vue
<script setup lang="ts">
import { DuxImage } from '@duxweb/dvha-pro'
import { useMessage } from 'naive-ui'

const message = useMessage()

function handleImageError() {
  message.warning('图片加载失败')
}
</script>

<template>
  <DuxImage
    src="/may-fail-image.jpg"
    @error="handleImageError"
  />
</template>
```

#### 3. 如何实现头像上传功能？

可以结合图片裁剪组件实现：

```vue
<script setup lang="ts">
import { DuxAvatar, DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const showCrop = ref(false)
const avatarUrl = ref('')
</script>

<template>
  <div @click="showCrop = true">
    <DuxAvatar :src="avatarUrl" :size="80" round />
  </div>

  <DuxImageCrop
    v-if="showCrop"
    v-model:value="avatarUrl"
    @close="showCrop = false"
  />
</template>
```
