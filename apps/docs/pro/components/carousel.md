# 轮播组件

轮播组件提供了图片轮播展示功能，支持自定义控制和指示器。

## 导入

```typescript
import { DuxCarousel } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下轮播组件：

- **DuxCarousel** - 图片轮播组件

## DuxCarousel 图片轮播组件

图片轮播组件，用于展示多张图片的循环播放，支持点击事件和自定义高度。

### 属性

| 属性名 | 类型                             | 默认值 | 说明             |
| ------ | -------------------------------- | ------ | ---------------- |
| height | number                           | 200    | 轮播图高度（px） |
| data   | Array<DuxCarouselData \| string> | -      | 轮播图数据数组   |

### 数据类型

```typescript
interface DuxCarouselData {
  src: string // 图片地址
  onClick: () => void // 点击事件
}
```

### 基础用法

```vue
<script setup>
import { DuxCarousel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

// 简单字符串数组
const simpleImages = ref([
  '/banner1.jpg',
  '/banner2.jpg',
  '/banner3.jpg'
])

// 带点击事件的数据
const carouselData = ref([
  {
    src: '/banner1.jpg',
    onClick: () => {
      console.log('点击了第一张图片')
    }
  },
  {
    src: '/banner2.jpg',
    onClick: () => {
      console.log('点击了第二张图片')
    }
  },
  {
    src: '/banner3.jpg',
    onClick: () => {
      console.log('点击了第三张图片')
    }
  }
])
</script>

<template>
  <!-- 基础轮播 -->
  <DuxCarousel :data="simpleImages" />

  <!-- 自定义高度 -->
  <DuxCarousel
    :data="simpleImages"
    :height="300"
  />

  <!-- 带点击事件 -->
  <DuxCarousel
    :data="carouselData"
    :height="250"
  />
</template>
```

### 电商轮播示例

```vue
<script setup>
import { DuxCarousel } from '@duxweb/dvha-pro'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const bannerData = ref([
  {
    src: '/banners/promotion1.jpg',
    onClick: () => {
      router.push('/products/promotion')
    }
  },
  {
    src: '/banners/new-arrival.jpg',
    onClick: () => {
      router.push('/products/new')
    }
  },
  {
    src: '/banners/sale.jpg',
    onClick: () => {
      router.push('/products/sale')
    }
  },
  {
    src: '/banners/brand.jpg',
    onClick: () => {
      router.push('/brands')
    }
  }
])
</script>

<template>
  <div class="w-full">
    <DuxCarousel
      :data="bannerData"
      :height="400"
    />
  </div>
</template>
```

### 公告轮播示例

```vue
<script setup>
import { DuxCarousel } from '@duxweb/dvha-pro'
import { NModal } from 'naive-ui'
import { ref } from 'vue'

const showModal = ref(false)
const modalContent = ref('')

const announcementBanners = ref([
  {
    src: '/announcements/system-update.jpg',
    onClick: () => {
      modalContent.value = '系统将于今晚进行维护升级，预计耗时2小时...'
      showModal.value = true
    }
  },
  {
    src: '/announcements/new-feature.jpg',
    onClick: () => {
      modalContent.value = '新功能上线：智能推荐系统正式启用...'
      showModal.value = true
    }
  },
  {
    src: '/announcements/holiday.jpg',
    onClick: () => {
      modalContent.value = '春节放假通知：2024年2月10日至2月17日...'
      showModal.value = true
    }
  }
])
</script>

<template>
  <div>
    <DuxCarousel
      :data="announcementBanners"
      :height="160"
    />

    <NModal v-model:show="showModal" title="公告详情">
      <div class="p-4">
        {{ modalContent }}
      </div>
    </NModal>
  </div>
</template>
```

### 产品展示轮播

```vue
<script setup>
import { DuxCarousel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const productImages = ref([
  '/products/product1-main.jpg',
  '/products/product1-detail1.jpg',
  '/products/product1-detail2.jpg',
  '/products/product1-detail3.jpg'
])

const featuredProducts = ref([
  {
    src: '/products/featured1.jpg',
    onClick: () => {
      window.open('/products/1', '_blank')
    }
  },
  {
    src: '/products/featured2.jpg',
    onClick: () => {
      window.open('/products/2', '_blank')
    }
  },
  {
    src: '/products/featured3.jpg',
    onClick: () => {
      window.open('/products/3', '_blank')
    }
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- 产品详情轮播 -->
    <div>
      <h3 class="text-lg font-medium mb-4">
        产品图片
      </h3>
      <DuxCarousel
        :data="productImages"
        :height="350"
      />
    </div>

    <!-- 推荐产品轮播 -->
    <div>
      <h3 class="text-lg font-medium mb-4">
        推荐产品
      </h3>
      <DuxCarousel
        :data="featuredProducts"
        :height="200"
      />
    </div>
  </div>
</template>
```

### 响应式轮播

```vue
<script setup>
import { DuxCarousel } from '@duxweb/dvha-pro'
import { useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

const { width } = useWindowSize()

const bannerData = ref([
  '/banners/desktop1.jpg',
  '/banners/desktop2.jpg',
  '/banners/desktop3.jpg'
])

// 根据屏幕宽度调整高度
const carouselHeight = computed(() => {
  if (width.value < 640)
    return 150
  if (width.value < 1024)
    return 250
  return 350
})
</script>

<template>
  <DuxCarousel
    :data="bannerData"
    :height="carouselHeight"
  />
</template>
```

### 与其他组件结合

```vue
<script setup>
import { DuxCard, DuxCarousel } from '@duxweb/dvha-pro'
import { NButton, NTag } from 'naive-ui'
import { ref } from 'vue'

const promotionBanners = ref([
  {
    src: '/promotions/summer-sale.jpg',
    onClick: () => {
      console.log('夏季大促销')
    }
  },
  {
    src: '/promotions/new-member.jpg',
    onClick: () => {
      console.log('新会员福利')
    }
  }
])
</script>

<template>
  <DuxCard title="最新活动" divide>
    <template #headerExtra>
      <NTag type="error" size="small">
        热门
      </NTag>
    </template>

    <DuxCarousel
      :data="promotionBanners"
      :height="200"
    />

    <template #footer>
      <div class="flex justify-between items-center">
        <span class="text-sm text-muted">更多精彩活动</span>
        <NButton size="small" type="primary">
          查看全部
        </NButton>
      </div>
    </template>
  </DuxCard>
</template>
```

## 设计特性

### 用户体验

- **拖拽支持** - 支持鼠标拖拽和触摸滑动
- **自动播放** - 继承 Naive UI Carousel 的自动播放功能
- **圆角阴影** - 默认添加圆角和阴影效果
- **响应式适配** - 图片自动适应容器尺寸

### 交互反馈

- **点击事件** - 支持为每张图片配置独立的点击事件
- **悬停效果** - 鼠标悬停时暂停自动播放
- **指示器** - 显示当前图片位置和总数

### 性能优化

- **图片适应** - 使用 `object-cover` 确保图片完美适配
- **懒加载** - 可配合图片懒加载库使用
- **流畅动画** - 基于 CSS 过渡实现流畅的切换效果

## 最佳实践

### 图片规范

- **尺寸一致** - 确保所有轮播图片具有相同的宽高比
- **文件优化** - 使用适当的图片格式和压缩比例
- **加载策略** - 考虑使用 WebP 格式和渐进式加载

### 内容设计

- **信息层次** - 重要信息放在前几张图片
- **行动号召** - 为每张图片设计明确的点击目标
- **视觉一致** - 保持轮播图片的视觉风格统一

### 用户体验

- **加载状态** - 为图片加载提供占位符
- **错误处理** - 处理图片加载失败的情况
- **无障碍访问** - 提供适当的 alt 文本和键盘导航

## 常见问题

### Q: 如何自定义轮播的自动播放间隔？

A: DuxCarousel 基于 Naive UI 的 Carousel 组件，可以通过扩展组件属性来支持更多配置选项。

### Q: 如何处理图片加载失败？

A: 可以在图片 URL 中使用占位符服务，或者监听图片加载错误事件提供备用图片。

### Q: 支持视频轮播吗？

A: 当前版本主要支持图片轮播，如需视频轮播可以考虑使用 video 标签替换 img 标签。

### Q: 如何实现垂直轮播？

A: 可以通过扩展组件属性，传递 Naive UI Carousel 的 `direction` 属性来实现垂直轮播。
