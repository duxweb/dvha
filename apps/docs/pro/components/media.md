# 媒体组件

媒体组件提供了媒体文件的展示和管理功能，支持图片、视频、音频等多种格式的展示。

## 导入

```typescript
import { DuxMedia } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下媒体组件：

- **DuxMedia** - 媒体展示组件

## DuxMedia 媒体展示组件

媒体展示组件，用于展示包含图片、头像、标题、描述等内容的媒体信息。

### 属性

| 属性名      | 类型               | 默认值 | 说明                   |
| ----------- | ------------------ | ------ | ---------------------- |
| title       | string             | -      | 标题文本               |
| avatar      | boolean            | false  | 是否以头像形式显示图片 |
| image       | string \| string[] | -      | 图片地址               |
| desc        | string \| string[] | -      | 描述文本               |
| extend      | string             | -      | 扩展文本               |
| onClick     | Function           | -      | 标题点击事件           |
| imageWidth  | number             | 48     | 图片宽度               |
| imageHeight | number             | 48     | 图片高度               |

### 插槽

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 默认内容       |
| image   | 自定义图片区域 |
| prefix  | 标题前缀内容   |
| desc    | 自定义描述内容 |
| extend  | 扩展内容       |

### 基础用法

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 基础媒体展示 -->
  <DuxMedia
    title="用户名称"
    image="/avatar.jpg"
    desc="这是用户的描述信息"
  />
</template>
```

### 头像模式

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 头像模式 -->
  <DuxMedia
    title="张三"
    image="/users/zhang.jpg"
    desc="产品经理"
    avatar
    :image-width="40"
  />

  <!-- 多个头像 -->
  <DuxMedia
    title="项目团队"
    :image="['/users/user1.jpg', '/users/user2.jpg', '/users/user3.jpg']"
    desc="3人团队"
    avatar
  />
</template>
```

### 图片展示模式

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 单张图片 -->
  <DuxMedia
    title="产品名称"
    image="/products/product1.jpg"
    desc="这是一个很棒的产品"
    :image-width="60"
    :image-height="60"
  />

  <!-- 多张图片（支持预览） -->
  <DuxMedia
    title="产品图册"
    :image="[
      '/products/img1.jpg',
      '/products/img2.jpg',
      '/products/img3.jpg',
    ]"
    desc="产品的多角度展示"
    :image-width="50"
    :image-height="50"
  />
</template>
```

### 多行描述

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 多行描述 -->
  <DuxMedia
    title="文章标题"
    image="/articles/cover.jpg"
    :desc="[
      '发布时间：2024-01-15',
      '作者：张三',
      '分类：技术文章',
    ]"
  />
</template>
```

### 可点击标题

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleTitleClick() {
  router.push('/user/profile')
}
</script>

<template>
  <DuxMedia
    title="用户详情"
    image="/users/user.jpg"
    desc="点击查看详情"
    :on-click="handleTitleClick"
  />
</template>
```

### 扩展内容

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 使用 extend 属性 -->
  <DuxMedia
    title="文档名称"
    image="/docs/doc.png"
    desc="PDF 文档"
    extend="2.5MB"
  />

  <!-- 使用 extend 插槽 -->
  <DuxMedia
    title="任务状态"
    desc="进行中的任务"
  >
    <template #extend>
      <n-tag type="info">
        进行中
      </n-tag>
    </template>
  </DuxMedia>
</template>
```

### 自定义插槽

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { NBadge, NIcon } from 'naive-ui'
</script>

<template>
  <!-- 自定义图片区域 -->
  <DuxMedia
    title="通知消息"
    desc="您有新的消息"
  >
    <template #image>
      <NBadge :value="3" :max="99">
        <NIcon size="32">
          <div class="i-tabler:bell" />
        </NIcon>
      </NBadge>
    </template>
  </DuxMedia>

  <!-- 自定义标题前缀 -->
  <DuxMedia
    title="重要文档"
    desc="需要立即处理"
    image="/docs/important.pdf"
  >
    <template #prefix>
      <NIcon color="red">
        <div class="i-tabler:alert-triangle" />
      </NIcon>
    </template>
  </DuxMedia>

  <!-- 自定义描述内容 -->
  <DuxMedia
    title="项目进度"
    image="/projects/project.jpg"
  >
    <template #desc>
      <div class="flex items-center gap-2">
        <n-progress type="line" :percentage="75" />
        <span class="text-sm">75%</span>
      </div>
    </template>
  </DuxMedia>
</template>
```

## 使用场景

### 用户列表

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const users = ref([
  {
    id: 1,
    name: '张三',
    avatar: '/users/zhang.jpg',
    email: 'zhang@example.com',
    department: '技术部',
    status: 'online'
  },
  {
    id: 2,
    name: '李四',
    avatar: '/users/li.jpg',
    email: 'li@example.com',
    department: '产品部',
    status: 'offline'
  }
])
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="user in users"
      :key="user.id"
      class="p-4 border border-gray-200 rounded-lg"
    >
      <DuxMedia
        :title="user.name"
        :image="user.avatar"
        :desc="[user.email, user.department]"
        avatar
        :image-width="48"
      >
        <template #extend>
          <n-tag
            :type="user.status === 'online' ? 'success' : 'default'"
            size="small"
          >
            {{ user.status === 'online' ? '在线' : '离线' }}
          </n-tag>
        </template>
      </DuxMedia>
    </div>
  </div>
</template>
```

### 文件列表

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const files = ref([
  {
    id: 1,
    name: '项目文档.pdf',
    size: '2.5MB',
    type: 'pdf',
    icon: '/icons/pdf.png',
    lastModified: '2024-01-15'
  },
  {
    id: 2,
    name: '设计图.png',
    size: '1.2MB',
    type: 'image',
    icon: '/icons/image.png',
    lastModified: '2024-01-14'
  }
])

function getFileIcon(type) {
  const icons = {
    pdf: '/icons/pdf.png',
    image: '/icons/image.png',
    doc: '/icons/doc.png',
    excel: '/icons/excel.png'
  }
  return icons[type] || '/icons/file.png'
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="file in files"
      :key="file.id"
      class="p-3 hover:bg-gray-50 rounded cursor-pointer"
    >
      <DuxMedia
        :title="file.name"
        :image="getFileIcon(file.type)"
        :desc="[`大小: ${file.size}`, `修改时间: ${file.lastModified}`]"
        :extend="file.size"
        :image-width="32"
        :image-height="32"
      />
    </div>
  </div>
</template>
```

### 商品列表

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const products = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro',
    images: ['/products/iphone1.jpg', '/products/iphone2.jpg'],
    price: 7999,
    description: '最新款 iPhone，性能强劲',
    stock: 50
  },
  {
    id: 2,
    name: 'MacBook Pro',
    images: ['/products/macbook1.jpg'],
    price: 12999,
    description: '专业级笔记本电脑',
    stock: 20
  }
])
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      v-for="product in products"
      :key="product.id"
      class="p-4 border border-gray-200 rounded-lg"
    >
      <DuxMedia
        :title="product.name"
        :image="product.images"
        :desc="[product.description, `库存: ${product.stock}`]"
        :image-width="80"
        :image-height="80"
      >
        <template #extend>
          <div class="text-right">
            <div class="text-lg font-bold text-red-500">
              ¥{{ product.price }}
            </div>
          </div>
        </template>
      </DuxMedia>
    </div>
  </div>
</template>
```

### 消息列表

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const messages = ref([
  {
    id: 1,
    sender: '系统通知',
    avatar: '/system-avatar.jpg',
    content: '您的订单已发货',
    time: '2分钟前',
    unread: true
  },
  {
    id: 2,
    sender: '张三',
    avatar: '/users/zhang.jpg',
    content: '会议时间改为下午3点',
    time: '10分钟前',
    unread: false
  }
])
</script>

<template>
  <div class="space-y-1">
    <div
      v-for="message in messages"
      :key="message.id"
      class="p-3 hover:bg-gray-50 rounded cursor-pointer"
      :class="{ 'bg-blue-50': message.unread }"
    >
      <DuxMedia
        :title="message.sender"
        :image="message.avatar"
        :desc="message.content"
        :extend="message.time"
        avatar
        :image-width="40"
      >
        <template #prefix>
          <div
            v-if="message.unread"
            class="w-2 h-2 bg-red-500 rounded-full"
          />
        </template>
      </DuxMedia>
    </div>
  </div>
</template>
```

### 评论列表

```vue
<script setup lang="ts">
import { DuxMedia } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const comments = ref([
  {
    id: 1,
    user: {
      name: '张三',
      avatar: '/users/zhang.jpg'
    },
    content: '这篇文章写得很好，学到了很多！',
    time: '2024-01-15 14:30',
    likes: 5
  },
  {
    id: 2,
    user: {
      name: '李四',
      avatar: '/users/li.jpg'
    },
    content: '同意楼上的观点，作者的分析很透彻。',
    time: '2024-01-15 15:20',
    likes: 3
  }
])
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="p-4 bg-gray-50 rounded-lg"
    >
      <DuxMedia
        :title="comment.user.name"
        :image="comment.user.avatar"
        :desc="[comment.content, comment.time]"
        avatar
        :image-width="36"
      >
        <template #extend>
          <div class="flex items-center gap-1 text-gray-500">
            <n-icon>
              <div class="i-tabler:heart" />
            </n-icon>
            <span class="text-sm">{{ comment.likes }}</span>
          </div>
        </template>
      </DuxMedia>
    </div>
  </div>
</template>
```

## 最佳实践

### 1. 合理设置图片尺寸

```vue
<template>
  <!-- 头像场景：较小尺寸 -->
  <DuxMedia
    avatar
    :image-width="32"
    :image-height="32"
  />

  <!-- 列表场景：中等尺寸 -->
  <DuxMedia
    :image-width="48"
    :image-height="48"
  />

  <!-- 详情场景：较大尺寸 -->
  <DuxMedia
    :image-width="80"
    :image-height="80"
  />
</template>
```

### 2. 响应式设计

```vue
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="item in items"
      :key="item.id"
      class="p-4 border rounded-lg"
    >
      <DuxMedia
        :title="item.title"
        :image="item.image"
        :desc="item.desc"
        :image-width="isMobile ? 40 : 60"
        :image-height="isMobile ? 40 : 60"
      />
    </div>
  </div>
</template>
```

### 3. 图片懒加载

```vue
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['items'])

const processedItems = computed(() => {
  return props.items.map(item => ({
    ...item,
    image: `${item.image}?lazy=true`
  }))
})
</script>

<template>
  <DuxMedia
    v-for="item in processedItems"
    :key="item.id"
    :title="item.title"
    :image="item.image"
    :desc="item.desc"
  />
</template>
```

### 4. 无障碍访问

```vue
<template>
  <DuxMedia
    :title="item.title"
    :image="item.image"
    :desc="item.desc"
    role="article"
    :aria-label="`${item.title} - ${item.desc}`"
    tabindex="0"
  />
</template>
```
