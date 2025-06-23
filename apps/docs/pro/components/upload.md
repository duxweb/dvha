# 上传组件

上传组件提供了图片上传、文件上传、文件管理等功能，支持本地和云存储。

## 导入

```typescript
import {
  DuxFileManage,
  DuxFileUpload,
  DuxImageUpload
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下上传组件：

- **DuxImageUpload** - 图片上传组件
- **DuxFileUpload** - 文件上传组件
- **DuxFileManage** - 文件管理组件

## DuxImageUpload 图片上传

图片上传组件，支持单张或多张图片上传，提供预览、拖拽排序、文件管理等功能。

### 属性

| 属性名       | 类型               | 默认值   | 说明                 |
| ------------ | ------------------ | -------- | -------------------- |
| path         | string             | 'upload' | 上传接口路径         |
| managePath   | string             | ''       | 文件管理接口路径     |
| maxNum       | number             | -        | 最大上传数量         |
| maxSize      | number             | 5        | 最大文件大小（MB）   |
| multiple     | boolean            | false    | 是否支持多选         |
| manager      | boolean            | false    | 是否显示文件管理按钮 |
| value        | string \| string[] | -        | 上传结果值           |
| defaultValue | string \| string[] | -        | 默认值               |

### 事件

| 事件名       | 类型                                 | 说明         |
| ------------ | ------------------------------------ | ------------ |
| update:value | (value?: string \| string[]) => void | 值更新时触发 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxImageUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const imageUrl = ref('')
const imageUrls = ref<string[]>([])
</script>

<template>
  <!-- 单张图片上传 -->
  <DuxImageUpload
    v-model:value="imageUrl"
    path="/api/upload"
    :max-size="10"
  />

  <!-- 多张图片上传 -->
  <DuxImageUpload
    v-model:value="imageUrls"
    path="/api/upload"
    multiple
    :max-num="5"
    :max-size="10"
  />
</template>
```

### 带文件管理的上传

```vue
<script setup lang="ts">
import { DuxImageUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const images = ref<string[]>([])
</script>

<template>
  <DuxImageUpload
    v-model:value="images"
    path="/api/upload"
    manage-path="/api/files"
    multiple
    manager
    :max-num="10"
    :max-size="5"
  />
</template>
```

## DuxFileUpload 文件上传

文件上传组件，支持各种文件类型上传，提供拖拽上传、进度显示、文件列表等功能。

### 属性

| 属性名       | 类型               | 默认值 | 说明                 |
| ------------ | ------------------ | ------ | -------------------- |
| path         | string             | ''     | 上传接口路径         |
| managePath   | string             | ''     | 文件管理接口路径     |
| maxNum       | number             | -      | 最大上传数量         |
| maxSize      | number             | 5      | 最大文件大小（MB）   |
| multiple     | boolean            | false  | 是否支持多选         |
| manager      | boolean            | false  | 是否显示文件管理按钮 |
| accept       | string             | -      | 接受的文件类型       |
| value        | string \| string[] | -      | 上传结果值           |
| defaultValue | string \| string[] | -      | 默认值               |

### 事件

| 事件名       | 类型                                 | 说明         |
| ------------ | ------------------------------------ | ------------ |
| update:value | (value?: string \| string[]) => void | 值更新时触发 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxFileUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const fileUrl = ref('')
const fileUrls = ref<string[]>([])
</script>

<template>
  <!-- 单文件上传 -->
  <DuxFileUpload
    v-model:value="fileUrl"
    path="/api/upload"
    accept="application/pdf"
    :max-size="20"
  />

  <!-- 多文件上传 -->
  <DuxFileUpload
    v-model:value="fileUrls"
    path="/api/upload"
    multiple
    accept="image/*,application/pdf,.doc,.docx"
    :max-num="10"
    :max-size="50"
  />
</template>
```

### 不同文件类型

```vue
<template>
  <!-- 图片文件 -->
  <DuxFileUpload
    v-model:value="images"
    accept="image/*"
    path="/api/upload"
    multiple
  />

  <!-- 视频文件 -->
  <DuxFileUpload
    v-model:value="videos"
    accept="video/*"
    path="/api/upload"
    :max-size="100"
  />

  <!-- 文档文件 -->
  <DuxFileUpload
    v-model:value="documents"
    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
    path="/api/upload"
    multiple
  />

  <!-- 音频文件 -->
  <DuxFileUpload
    v-model:value="audios"
    accept="audio/*"
    path="/api/upload"
    multiple
  />
</template>
```

### 带文件管理的上传

```vue
<script setup lang="ts">
import { DuxFileUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const files = ref<string[]>([])
</script>

<template>
  <DuxFileUpload
    v-model:value="files"
    path="/api/upload"
    manage-path="/api/files"
    multiple
    manager
    accept="image/*,application/pdf"
    :max-num="20"
    :max-size="10"
  />
</template>
```

## DuxFileManage 文件管理

文件管理组件，提供文件浏览、选择、删除、重命名、新建文件夹等功能。

### 属性

| 属性名       | 类型                                  | 默认值 | 说明             |
| ------------ | ------------------------------------- | ------ | ---------------- |
| path         | string                                | -      | 文件管理接口路径 |
| type         | 'all' \| 'image' \| 'media' \| 'docs' | 'all'  | 文件类型筛选     |
| multiple     | boolean                               | false  | 是否支持多选     |
| page         | boolean                               | true   | 是否为页面模式   |
| handle       | string                                | -      | 拖拽手柄类名     |
| uploadParams | IUploadParams                         | -      | 上传参数配置     |

### 事件

| 事件名  | 类型                                   | 说明           |
| ------- | -------------------------------------- | -------------- |
| confirm | (value: Record<string, any>[]) => void | 确认选择时触发 |
| close   | () => void                             | 关闭时触发     |

### IUploadParams 接口

```typescript
interface IUploadParams {
  path?: string // 上传接口路径
  accept?: string // 接受的文件类型
  multiple?: boolean // 是否支持多选
  maxNum?: number // 最大上传数量
  maxSize?: number // 最大文件大小（MB）
}
```

### 基础用法

```vue
<script setup lang="ts">
import { DuxFileManage } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedFiles = ref<any[]>([])

function handleConfirm(files: any[]) {
  selectedFiles.value = files
  console.log('选择的文件:', files)
}

function handleClose() {
  console.log('关闭文件管理')
}
</script>

<template>
  <DuxFileManage
    path="/api/files"
    type="all"
    multiple
    :upload-params="{
      path: '/api/upload',
      accept: 'image/*,application/pdf',
      maxNum: 10,
      maxSize: 20,
    }"
    @confirm="handleConfirm"
    @close="handleClose"
  />
</template>
```

### 模态框中使用

```vue
<script setup lang="ts">
import { useModal } from '@duxweb/dvha-pro'

const modal = useModal()

function openFileManager() {
  modal.show({
    title: '文件管理',
    width: 800,
    component: () => import('@duxweb/dvha-pro').then(m => m.DuxFileManage),
    componentProps: {
      path: '/api/files',
      multiple: true,
      uploadParams: {
        path: '/api/upload',
        accept: 'image/*',
        maxNum: 5,
        maxSize: 10
      }
    }
  }).then((files) => {
    console.log('选择的文件:', files)
  }).catch(() => {
    console.log('取消选择')
  })
}
</script>

<template>
  <n-button @click="openFileManager">
    选择文件
  </n-button>
</template>
```

## 表单集成

### 在表单中使用图片上传

```vue
<script setup lang="ts">
import { DuxFormItem, DuxImageUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const form = ref({
  avatar: '',
  gallery: []
})
</script>

<template>
  <form>
    <!-- 头像上传 -->
    <DuxFormItem label="头像" path="avatar" rule="required">
      <DuxImageUpload
        v-model:value="form.avatar"
        path="/api/upload"
        :max-size="5"
      />
    </DuxFormItem>

    <!-- 图片库 -->
    <DuxFormItem label="图片库" path="gallery">
      <DuxImageUpload
        v-model:value="form.gallery"
        path="/api/upload"
        multiple
        manager
        :max-num="10"
        :max-size="10"
      />
    </DuxFormItem>
  </form>
</template>
```

### 在表单中使用文件上传

```vue
<script setup lang="ts">
import { DuxFileUpload, DuxFormItem } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const form = ref({
  resume: '',
  attachments: []
})
</script>

<template>
  <form>
    <!-- 简历上传 -->
    <DuxFormItem label="简历" path="resume" rule="required">
      <DuxFileUpload
        v-model:value="form.resume"
        path="/api/upload"
        accept="application/pdf,.doc,.docx"
        :max-size="20"
      />
    </DuxFormItem>

    <!-- 附件上传 -->
    <DuxFormItem label="附件" path="attachments">
      <DuxFileUpload
        v-model:value="form.attachments"
        path="/api/upload"
        multiple
        manager
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
        :max-num="20"
        :max-size="50"
      />
    </DuxFormItem>
  </form>
</template>
```

## 文件类型支持

### 支持的 MIME 类型

```typescript
// 图片类型
accept = 'image/*'
accept = 'image/jpeg,image/png,image/gif,image/webp'

// 视频类型
accept = 'video/*'
accept = 'video/mp4,video/avi,video/mov'

// 音频类型
accept = 'audio/*'
accept = 'audio/mp3,audio/wav,audio/aac'

// 文档类型
accept = 'application/pdf'
accept = 'application/msword'
accept = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

// 表格类型
accept = 'application/vnd.ms-excel'
accept = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

// 演示文稿类型
accept = 'application/vnd.ms-powerpoint'
accept = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

// 文本类型
accept = 'text/*'
accept = 'text/plain,text/csv'

// 混合类型
accept = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx'
```

### 常用文件扩展名

```typescript
// 图片文件
accept = '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg'

// 文档文件
accept = '.pdf,.doc,.docx,.txt,.rtf'

// 表格文件
accept = '.xls,.xlsx,.csv'

// 演示文稿文件
accept = '.ppt,.pptx'

// 压缩文件
accept = '.zip,.rar,.7z,.tar,.gz'

// 音视频文件
accept = '.mp3,.wav,.mp4,.avi,.mov,.wmv'
```

## 上传配置

### 服务端配置

上传组件需要后端提供以下接口：

```typescript
// 文件上传接口
POST /api/upload
Content-Type: multipart/form-data

// 请求参数
{
  file: File,        // 上传的文件
  folder?: string    // 上传到的文件夹
}

// 响应格式
{
  code: 200,
  data: {
    id: string,      // 文件ID
    url: string,     // 文件访问URL
    filename: string, // 文件名
    filesize: number, // 文件大小
    filetype: string, // 文件类型
    mime: string     // MIME类型
  }
}
```

```typescript
// 文件管理接口
GET /api/files
Query: {
  page?: number,     // 页码
  pageSize?: number, // 每页数量
  type?: string,     // 文件类型筛选
  folder?: string    // 文件夹ID
}

// 响应格式
{
  code: 200,
  data: {
    data: Array<{
      id: string,
      name: string,
      url?: string,
      mime?: string,
      filesize?: number,
      type: 'file' | 'folder',
      created_at: string
    }>,
    meta: {
      total: number,
      page: number,
      pageSize: number,
      folder?: string
    }
  }
}
```

### 客户端配置

```typescript
import { createDux } from '@duxweb/dvha-core'
// 在应用配置中设置上传路径
import { createApp } from 'vue'

const app = createApp(App)

app.use(createDux({
  manage: {
    apiPath: {
      upload: '/api/upload', // 上传接口路径
      uploadManage: '/api/files' // 文件管理接口路径
    }
  }
}))
```

## 最佳实践

### 1. 合理设置文件大小限制

```vue
<template>
  <!-- 根据文件类型设置合适的大小限制 -->

  <!-- 头像图片：1-5MB -->
  <DuxImageUpload :max-size="5" />

  <!-- 文档文件：10-50MB -->
  <DuxFileUpload accept="application/pdf" :max-size="50" />

  <!-- 视频文件：100-500MB -->
  <DuxFileUpload accept="video/*" :max-size="500" />
</template>
```

### 2. 提供清晰的文件类型说明

```vue
<template>
  <DuxFormItem
    label="产品图片"
    path="images"
    description="支持 JPG、PNG、GIF 格式，单个文件不超过10MB，最多上传5张"
  >
    <DuxImageUpload
      v-model:value="form.images"
      accept="image/jpeg,image/png,image/gif"
      multiple
      :max-num="5"
      :max-size="10"
    />
  </DuxFormItem>
</template>
```

### 3. 处理上传错误

```vue
<script setup lang="ts">
import { useMessage } from 'naive-ui'

const message = useMessage()

// 监听上传错误
function handleUploadError(error: Error) {
  if (error.message.includes('size')) {
    message.error('文件大小超出限制')
  }
  else if (error.message.includes('type')) {
    message.error('不支持的文件类型')
  }
  else {
    message.error('上传失败，请重试')
  }
}
</script>
```

### 4. 优化用户体验

```vue
<template>
  <!-- 提供文件管理功能 -->
  <DuxFileUpload
    v-model:value="files"
    multiple
    manager
    path="/api/upload"
    manage-path="/api/files"
  />

  <!-- 支持拖拽上传 -->
  <div class="upload-area">
    <p>拖拽文件到此处或点击上传</p>
    <DuxFileUpload v-model:value="files" />
  </div>
</template>
```
