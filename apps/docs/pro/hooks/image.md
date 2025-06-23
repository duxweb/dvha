# useImagePreview - 图片预览

`useImagePreview` 是一个图片预览 Hook，提供图片预览功能，支持单张和多张图片预览。

## 特性

- **单张预览**: 支持单张图片预览
- **批量预览**: 支持多张图片组合预览
- **指定索引**: 支持指定预览的起始图片

## 基础用法

### 导入

```typescript
import { useImagePreview } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const imagePreview = useImagePreview()

// 单张图片预览
imagePreview.show(['https://example.com/image.jpg'])

// 多张图片预览
const imageList = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
]
imagePreview.show(imageList)

// 指定预览索引
imagePreview.show(imageList, 1) // 从第二张图片开始预览
```

## API 参考

### UseImagePreviewResult

| 字段 | 类型                                              | 说明       |
| ---- | ------------------------------------------------- | ---------- |
| show | (list: string[], previewIndex?: number) => void  | 显示图片预览 |

### 参数说明

| 参数名       | 类型     | 默认值 | 说明                   |
| ------------ | -------- | ------ | ---------------------- |
| list         | string[] | -      | 图片链接数组           |
| previewIndex | number   | 0      | 预览起始图片的索引     |

## 使用示例

### 基础图片预览

```vue
<script setup>
import { useImagePreview } from '@duxweb/dvha-pro'
import { NButton, NImage } from 'naive-ui'

const imagePreview = useImagePreview()

const singleImage = 'https://example.com/sample.jpg'
const imageList = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
  'https://example.com/image4.jpg'
]

// 预览单张图片
function previewSingle() {
  imagePreview.show([singleImage])
}

// 预览多张图片
function previewMultiple() {
  imagePreview.show(imageList)
}

// 从第三张开始预览
function previewFromThird() {
  imagePreview.show(imageList, 2)
}
</script>

<template>
  <div class="space-y-4">
    <!-- 单张图片 -->
    <div>
      <h3 class="mb-2">
        单张图片预览
      </h3>
      <NImage
        :src="singleImage"
        width="100"
        height="100"
        object-fit="cover"
        class="cursor-pointer"
        @click="previewSingle"
      />
    </div>

    <!-- 多张图片 -->
    <div>
      <h3 class="mb-2">
        多张图片预览
      </h3>
      <div class="flex gap-2">
        <NImage
          v-for="(image, index) in imageList"
          :key="index"
          :src="image"
          width="80"
          height="80"
          object-fit="cover"
          class="cursor-pointer"
          @click="() => imagePreview.show(imageList, index)"
        />
      </div>
    </div>

    <!-- 按钮控制 -->
    <div class="flex gap-2">
      <NButton @click="previewSingle">
        预览单张
      </NButton>
      <NButton @click="previewMultiple">
        预览多张
      </NButton>
      <NButton @click="previewFromThird">
        从第三张开始
      </NButton>
    </div>
  </div>
</template>
```

### 动态图片列表

```vue
<script setup>
import { useImagePreview } from '@duxweb/dvha-pro'
import { NButton, NImage, NInput } from 'naive-ui'
import { ref } from 'vue'

const imagePreview = useImagePreview()
const newImageUrl = ref('')
const images = ref([
  'https://example.com/default1.jpg',
  'https://example.com/default2.jpg'
])

// 添加图片
function addImage() {
  if (newImageUrl.value.trim()) {
    images.value.push(newImageUrl.value.trim())
    newImageUrl.value = ''
  }
}

// 移除图片
function removeImage(index) {
  images.value.splice(index, 1)
}

// 预览所有图片
function previewAll() {
  if (images.value.length > 0) {
    imagePreview.show(images.value)
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- 添加图片 -->
    <div class="flex gap-2">
      <NInput
        v-model:value="newImageUrl"
        placeholder="输入图片链接"
        @keyup.enter="addImage"
      />
      <NButton @click="addImage">
        添加
      </NButton>
    </div>

    <!-- 图片列表 -->
    <div class="grid grid-cols-6 gap-2">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="relative group"
      >
        <NImage
          :src="image"
          width="80"
          height="80"
          object-fit="cover"
          class="cursor-pointer"
          @click="() => imagePreview.show(images, index)"
        />
        <button
          class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          @click="removeImage(index)"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 预览按钮 -->
    <NButton :disabled="images.length === 0" @click="previewAll">
      预览所有图片 ({{ images.length }})
    </NButton>
  </div>
</template>
```
