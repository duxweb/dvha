# 裁剪组件

裁剪组件提供了图片裁剪功能，支持自定义裁剪比例、预览和保存。

## 导入

```typescript
import { DuxImageCrop } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下裁剪组件：

- **DuxImageCrop** - 图片裁剪组件

## DuxImageCrop 图片裁剪组件

图片裁剪组件提供了完整的图片裁剪解决方案，支持圆形和方形裁剪，适用于头像上传、图片编辑等场景。

### 属性

| 属性名       | 类型    | 默认值 | 说明           |
| ------------ | ------- | ------ | -------------- |
| value        | string  | ''     | 图片地址       |
| defaultValue | string  | ''     | 默认图片地址   |
| path         | string  | ''     | 上传接口路径   |
| circle       | boolean | true   | 是否为圆形裁剪 |

### 事件

| 事件名       | 类型                    | 说明         |
| ------------ | ----------------------- | ------------ |
| update:value | (value: string) => void | 值更新时触发 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const avatarUrl = ref('')
</script>

<template>
  <!-- 圆形头像裁剪 -->
  <DuxImageCrop
    v-model:value="avatarUrl"
    path="/api/upload"
    circle
  />
</template>
```

### 方形裁剪

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const imageUrl = ref('')
</script>

<template>
  <!-- 方形图片裁剪 -->
  <DuxImageCrop
    v-model:value="imageUrl"
    path="/api/upload"
    :circle="false"
  />
</template>
```

### 默认图片

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const userAvatar = ref('/default-avatar.jpg')
</script>

<template>
  <DuxImageCrop
    v-model:value="userAvatar"
    default-value="/default-avatar.jpg"
    path="/api/upload"
  />
</template>
```

### 表单集成

```vue
<script setup lang="ts">
import { DuxFormItem, DuxFormLayout, DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const profileForm = ref({
  avatar: '',
  cover: ''
})
</script>

<template>
  <DuxFormLayout>
    <DuxFormItem label="用户头像" path="avatar">
      <DuxImageCrop
        v-model:value="profileForm.avatar"
        path="/api/upload/avatar"
        circle
      />
    </DuxFormItem>

    <DuxFormItem label="封面图片" path="cover">
      <DuxImageCrop
        v-model:value="profileForm.cover"
        path="/api/upload/cover"
        :circle="false"
      />
    </DuxFormItem>
  </DuxFormLayout>
</template>
```

### 自定义上传路径

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const avatar = ref('')

// 动态设置上传路径
const uploadPath = ref('/api/upload/user/avatar')
</script>

<template>
  <DuxImageCrop
    v-model:value="avatar"
    :path="uploadPath"
  />
</template>
```

### 批量头像设置

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const teamMembers = ref([
  { id: 1, name: '张三', avatar: '' },
  { id: 2, name: '李四', avatar: '' },
  { id: 3, name: '王五', avatar: '' }
])
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div
      v-for="member in teamMembers"
      :key="member.id"
      class="flex flex-col items-center gap-2"
    >
      <DuxImageCrop
        v-model:value="member.avatar"
        path="/api/upload/team/avatar"
      />
      <div class="text-sm text-center">
        {{ member.name }}
      </div>
    </div>
  </div>
</template>
```

### 裁剪功能说明

图片裁剪组件内置了丰富的裁剪功能：

#### 1. 图片选择

- 点击组件区域打开文件选择器
- 支持常见图片格式（JPG、PNG、GIF、WebP 等）
- 自动预览选择的图片

#### 2. 裁剪操作

- **缩放**：鼠标滚轮或缩放按钮
- **旋转**：左转/右转按钮
- **移动**：鼠标拖拽调整位置
- **重选**：重新选择图片文件

#### 3. 输出设置

- 固定输出格式：PNG
- 自动优化图片质量
- 保持裁剪比例

### 全局配置

```typescript
import { createDux } from '@duxweb/dvha-core'
// 在应用配置中设置上传路径
import { createApp } from 'vue'

const app = createApp(App)

const dux = createDux({
  manage: {
    apiPath: {
      upload: '/api/upload', // 默认上传路径
    }
  }
})

app.use(dux)
```

### 事件处理

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const avatar = ref('')

function handleAvatarChange(url: string) {
  console.log('头像已更新:', url)
  message.success('头像上传成功')
}
</script>

<template>
  <DuxImageCrop
    v-model:value="avatar"
    path="/api/upload"
    @update:value="handleAvatarChange"
  />
</template>
```

### 错误处理

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const avatar = ref('')

// 监听上传状态
function handleUploadError(error: Error) {
  if (error.message.includes('size')) {
    message.error('图片大小超出限制')
  }
  else if (error.message.includes('format')) {
    message.error('不支持的图片格式')
  }
  else {
    message.error('上传失败，请重试')
  }
}
</script>

<template>
  <DuxImageCrop
    v-model:value="avatar"
    path="/api/upload"
  />
</template>
```

### 样式自定义

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const avatar = ref('')
</script>

<template>
  <!-- 自定义尺寸和样式 -->
  <div class="custom-crop-container">
    <DuxImageCrop
      v-model:value="avatar"
      path="/api/upload"
      class="custom-crop"
    />
  </div>
</template>

<style>
.custom-crop-container .custom-crop {
  /* 组件默认是 80px，可以通过 CSS 调整 */
  width: 120px;
  height: 120px;
}

.custom-crop-container .custom-crop .size-80px {
  width: 120px !important;
  height: 120px !important;
}
</style>
```

### 最佳实践

#### 1. 图片格式建议

- 推荐使用 JPG 或 PNG 格式
- 控制图片文件大小（建议 < 5MB）
- 避免使用过大的原始图片

#### 2. 用户体验

- 提供清晰的操作提示
- 合理的加载状态反馈
- 错误信息友好提示

#### 3. 安全考虑

- 服务端验证图片格式
- 限制上传文件大小
- 图片内容安全检测

#### 4. 性能优化

- 图片压缩处理
- CDN 加速访问
- 缓存策略优化

### 常见问题

#### 1. 如何限制图片大小？

图片大小限制需要在服务端配置，组件会自动处理上传错误：

```vue
<script setup lang="ts">
// 服务端返回错误时，组件会自动显示错误信息
// 可以通过全局配置设置默认的文件大小限制
</script>
```

#### 2. 如何自定义裁剪比例？

当前组件使用固定的 1:1 比例裁剪，如需其他比例可以通过修改组件源码实现。

#### 3. 如何支持批量裁剪？

```vue
<script setup lang="ts">
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const images = ref(['', '', ''])
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <DuxImageCrop
      v-for="(image, index) in images"
      :key="index"
      v-model:value="images[index]"
      path="/api/upload"
    />
  </div>
</template>
```
