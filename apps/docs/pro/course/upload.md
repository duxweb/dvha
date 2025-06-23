# 文件上传与管理

本教程将教你如何在 DVHA Pro 中实现完整的文件上传和管理功能，包括图片上传、文件上传、文件管理器等。

## 📋 前置条件

- 已完成 [登录与鉴权](/pro/course/login) 教程
- 已完成 [自定义数据接口](/pro/course/api) 教程
- 了解文件上传的基本概念

## 🎯 目标效果

完成本教程后，你将能够：
- 📸 实现图片上传和预览功能
- 📄 实现文件上传和管理功能
- 🗂️ 使用文件管理器选择文件
- 📝 在表单中集成上传组件

## 💡 上传功能特点

DVHA Pro 的上传组件具有以下特点：

- **多种上传组件**：图片上传、文件上传、裁剪上传
- **文件管理器**：支持文件浏览、选择、删除、重命名
- **拖拽上传**：支持拖拽文件到上传区域
- **进度显示**：实时显示上传进度和状态
- **类型限制**：支持文件类型和大小限制

## 🔧 第一步：配置上传接口

修改 `src/dataProvider.ts`，配置上传相关的接口：

```typescript{20-25}
import { simpleDataProvider } from '@duxweb/dvha-core'

export const dataProvider = simpleDataProvider({
  apiUrl: 'http://localhost:3000/api',

  // 自定义回调处理
  successCallback: (res: any) => {
    const result = res.data

    return {
      data: result.data || result.list || result,
      meta: {
        total: result.total || result.pagination?.total || 0,
        page: result.page || result.pagination?.current || 1,
        pageSize: result.pageSize || result.pagination?.pageSize || 10,
      },
      raw: result,
    }
  },

  // 配置上传路径
  apiPath: {
    upload: '/upload',           // 文件上传接口
    uploadManage: '/files'       // 文件管理接口
  }
})
```

## 📸 第二步：图片上传功能

创建 `src/pages/upload/image.vue` 页面，实现图片上传：

```vue
<script setup>
import { DuxCard, DuxImageUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

// 单张图片上传
const avatar = ref('')

// 多张图片上传
const gallery = ref([])

// 监听上传结果
function handleAvatarChange(value) {
  console.log('头像上传结果:', value)
}

function handleGalleryChange(value) {
  console.log('图片库上传结果:', value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 单张图片上传 -->
    <DuxCard title="头像上传" description="上传单张头像图片">
      <div class="max-w-md">
        <DuxImageUpload
          v-model:value="avatar"
          path="/api/upload"
          :max-size="5"
          @update:value="handleAvatarChange"
        />
        <p class="mt-2 text-sm text-gray-500">
          支持 JPG、PNG、GIF 格式，最大 5MB
        </p>
      </div>
    </DuxCard>

    <!-- 多张图片上传 -->
    <DuxCard title="图片库" description="上传多张图片并支持拖拽排序">
      <div class="max-w-2xl">
        <DuxImageUpload
          v-model:value="gallery"
          path="/api/upload"
          multiple
          :max-num="8"
          :max-size="10"
          manager
          @update:value="handleGalleryChange"
        />
        <p class="mt-2 text-sm text-gray-500">
          支持 JPG、PNG、GIF 格式，最大 10MB，最多 8 张图片
        </p>
      </div>
    </DuxCard>

    <!-- 上传结果展示 -->
    <DuxCard title="上传结果">
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">
            头像URL:
          </h4>
          <p class="text-sm text-gray-600">
            {{ avatar || '未上传' }}
          </p>
        </div>
        <div>
          <h4 class="font-medium">
            图片库URLs:
          </h4>
          <div class="text-sm text-gray-600">
            <div v-if="gallery.length === 0">
              未上传
            </div>
            <div v-for="(url, index) in gallery" :key="index">
              {{ index + 1 }}. {{ url }}
            </div>
          </div>
        </div>
      </div>
    </DuxCard>
  </div>
</template>
```

## 📄 第三步：文件上传功能

创建 `src/pages/upload/file.vue` 页面，实现文件上传：

```vue
<script setup>
import { DuxCard, DuxFileUpload } from '@duxweb/dvha-pro'
import { ref } from 'vue'

// 单文件上传
const document = ref('')

// 多文件上传
const attachments = ref([])

// 不同类型的文件上传
const pdfFiles = ref([])
const imageFiles = ref([])
const videoFiles = ref([])
</script>

<template>
  <div class="space-y-6">
    <!-- 单文件上传 -->
    <DuxCard title="文档上传" description="上传单个文档文件">
      <div class="max-w-md">
        <DuxFileUpload
          v-model:value="document"
          path="/api/upload"
          accept="application/pdf,.doc,.docx"
          :max-size="20"
        />
        <p class="mt-2 text-sm text-gray-500">
          支持 PDF、DOC、DOCX 格式，最大 20MB
        </p>
      </div>
    </DuxCard>

    <!-- 多文件上传 -->
    <DuxCard title="附件上传" description="上传多个附件文件">
      <div class="max-w-2xl">
        <DuxFileUpload
          v-model:value="attachments"
          path="/api/upload"
          multiple
          manager
          :max-num="10"
          :max-size="50"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
        />
        <p class="mt-2 text-sm text-gray-500">
          支持图片、PDF、Office 文档，最大 50MB，最多 10 个文件
        </p>
      </div>
    </DuxCard>

    <!-- 分类文件上传 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- PDF 文件 -->
      <DuxCard title="PDF 文件">
        <DuxFileUpload
          v-model:value="pdfFiles"
          path="/api/upload"
          accept="application/pdf"
          multiple
          :max-num="5"
          :max-size="30"
        />
      </DuxCard>

      <!-- 图片文件 -->
      <DuxCard title="图片文件">
        <DuxFileUpload
          v-model:value="imageFiles"
          path="/api/upload"
          accept="image/*"
          multiple
          :max-num="10"
          :max-size="10"
        />
      </DuxCard>

      <!-- 视频文件 -->
      <DuxCard title="视频文件">
        <DuxFileUpload
          v-model:value="videoFiles"
          path="/api/upload"
          accept="video/*"
          multiple
          :max-num="3"
          :max-size="200"
        />
      </DuxCard>
    </div>

    <!-- 上传结果展示 -->
    <DuxCard title="上传结果">
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">
            文档:
          </h4>
          <p class="text-sm text-gray-600">
            {{ document || '未上传' }}
          </p>
        </div>
        <div>
          <h4 class="font-medium">
            附件 ({{ attachments.length }}):
          </h4>
          <div class="text-sm text-gray-600 space-y-1">
            <div v-if="attachments.length === 0">
              未上传
            </div>
            <div v-for="(url, index) in attachments" :key="index">
              {{ index + 1 }}. {{ url.split('/').pop() }}
            </div>
          </div>
        </div>
      </div>
    </DuxCard>
  </div>
</template>
```

## 🗂️ 第四步：文件管理器

创建 `src/pages/upload/manager.vue` 页面，展示文件管理器的使用：

```vue
<script setup>
import { DuxCard, DuxFileManage } from '@duxweb/dvha-pro'
import { useModal } from '@duxweb/dvha-pro'
import { NButton, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const modal = useModal()

const selectedFiles = ref([])

// 打开文件管理器
function openFileManager() {
  modal.show({
    title: '文件管理器',
    width: 800,
    component: DuxFileManage,
    componentProps: {
      path: '/api/files',
      multiple: true,
      uploadParams: {
        path: '/api/upload',
        accept: 'image/*,application/pdf',
        maxNum: 10,
        maxSize: 20
      }
    }
  }).then((files) => {
    selectedFiles.value = files
    message.success(`选择了 ${files.length} 个文件`)
  }).catch(() => {
    console.log('取消选择')
  })
}

// 打开图片选择器
function openImageSelector() {
  modal.show({
    title: '选择图片',
    width: 800,
    component: DuxFileManage,
    componentProps: {
      path: '/api/files',
      type: 'image',
      multiple: true,
      uploadParams: {
        path: '/api/upload',
        accept: 'image/*',
        maxNum: 5,
        maxSize: 10
      }
    }
  }).then((files) => {
    selectedFiles.value = files
    message.success(`选择了 ${files.length} 张图片`)
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- 文件管理器操作 -->
    <DuxCard title="文件管理器" description="打开文件管理器选择文件">
      <div class="space-x-4">
        <NButton type="primary" @click="openFileManager">
          <template #icon>
            <i class="i-tabler:folder" />
          </template>
          打开文件管理器
        </NButton>

        <NButton type="default" @click="openImageSelector">
          <template #icon>
            <i class="i-tabler:photo" />
          </template>
          选择图片
        </NButton>
      </div>
    </DuxCard>

    <!-- 选择结果 -->
    <DuxCard v-if="selectedFiles.length > 0" title="选择结果">
      <div class="space-y-2">
        <p class="font-medium">
          已选择 {{ selectedFiles.length }} 个文件:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="file in selectedFiles"
            :key="file.id"
            class="p-3 border rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <img
                v-if="file.mime?.startsWith('image/')"
                :src="file.url"
                class="w-12 h-12 object-cover rounded"
              >
              <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <i class="i-tabler:file text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">
                  {{ file.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ file.filesize }} bytes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DuxCard>

    <!-- 内嵌文件管理器 -->
    <DuxCard title="内嵌文件管理器" description="直接在页面中使用文件管理器">
      <div style="height: 400px;">
        <DuxFileManage
          path="/api/files"
          :page="false"
          :upload-params="{
            path: '/api/upload',
            accept: 'image/*,application/pdf',
            maxSize: 10,
          }"
          @confirm="(files) => {
            selectedFiles = files
            message.success(`选择了 ${files.length} 个文件`)
          }"
        />
      </div>
    </DuxCard>
  </div>
</template>
```

## 📝 第五步：表单集成

创建 `src/pages/upload/form.vue` 页面，展示在表单中使用上传组件：

```vue
<script setup>
import {
  DuxCard,
  DuxFileUpload,
  DuxFormItem,
  DuxFormLayout,
  DuxImageUpload
} from '@duxweb/dvha-pro'
import { NButton, NForm, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()

// 表单数据
const form = ref({
  title: '',
  avatar: '',
  cover: '',
  gallery: [],
  attachments: [],
  resume: ''
})

// 表单验证规则
const rules = {
  title: { required: true, message: '请输入标题' },
  avatar: { required: true, message: '请上传头像' },
  cover: { required: true, message: '请上传封面图' }
}

// 提交表单
function handleSubmit() {
  console.log('表单数据:', form.value)
  message.success('提交成功')
}

// 重置表单
function handleReset() {
  form.value = {
    title: '',
    avatar: '',
    cover: '',
    gallery: [],
    attachments: [],
    resume: ''
  }
  message.info('表单已重置')
}
</script>

<template>
  <DuxCard title="用户资料表单" description="包含各种上传组件的完整表单示例">
    <div class="max-w-2xl">
      <NForm :model="form" :rules="rules" label-placement="top">
        <DuxFormLayout>
          <!-- 基本信息 -->
          <DuxFormItem label="标题" path="title" required>
            <n-input v-model:value="form.title" placeholder="请输入标题" />
          </DuxFormItem>

          <!-- 头像上传 -->
          <DuxFormItem label="用户头像" path="avatar" required>
            <DuxImageUpload
              v-model:value="form.avatar"
              path="/api/upload"
              :max-size="5"
            />
            <template #extra>
              <span class="text-sm text-gray-500">
                建议尺寸 200x200，支持 JPG、PNG 格式，最大 5MB
              </span>
            </template>
          </DuxFormItem>

          <!-- 封面图上传 -->
          <DuxFormItem label="封面图片" path="cover" required>
            <DuxImageUpload
              v-model:value="form.cover"
              path="/api/upload"
              :max-size="10"
              manager
            />
            <template #extra>
              <span class="text-sm text-gray-500">
                建议尺寸 1200x600，支持 JPG、PNG 格式，最大 10MB
              </span>
            </template>
          </DuxFormItem>

          <!-- 图片库 -->
          <DuxFormItem label="相册图片" path="gallery">
            <DuxImageUpload
              v-model:value="form.gallery"
              path="/api/upload"
              multiple
              manager
              :max-num="10"
              :max-size="8"
            />
            <template #extra>
              <span class="text-sm text-gray-500">
                最多上传 10 张图片，每张最大 8MB
              </span>
            </template>
          </DuxFormItem>

          <!-- 简历上传 -->
          <DuxFormItem label="个人简历" path="resume">
            <DuxFileUpload
              v-model:value="form.resume"
              path="/api/upload"
              accept="application/pdf,.doc,.docx"
              :max-size="20"
            />
            <template #extra>
              <span class="text-sm text-gray-500">
                支持 PDF、DOC、DOCX 格式，最大 20MB
              </span>
            </template>
          </DuxFormItem>

          <!-- 附件上传 -->
          <DuxFormItem label="相关附件" path="attachments">
            <DuxFileUpload
              v-model:value="form.attachments"
              path="/api/upload"
              multiple
              manager
              :max-num="5"
              :max-size="30"
              accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
            />
            <template #extra>
              <span class="text-sm text-gray-500">
                支持图片、PDF、Office 文档，最多 5 个文件，每个最大 30MB
              </span>
            </template>
          </DuxFormItem>

          <!-- 操作按钮 -->
          <DuxFormItem>
            <div class="space-x-4">
              <NButton type="primary" @click="handleSubmit">
                提交表单
              </NButton>
              <NButton @click="handleReset">
                重置表单
              </NButton>
            </div>
          </DuxFormItem>
        </DuxFormLayout>
      </NForm>
    </div>
  </DuxCard>
</template>
```

## 🔒 第六步：后端接口实现

你的后端需要提供以下接口：

### 文件上传接口 `/api/upload`

```typescript
// 请求格式（multipart/form-data）
{
  file: File,           // 上传的文件
  folder?: string       // 可选：指定上传到的文件夹
}

// 响应格式
{
  code: 200,
  message: "上传成功",
  data: {
    id: "12345",
    url: "https://cdn.example.com/uploads/2024/01/image.jpg",
    filename: "image.jpg",
    filesize: 102400,
    filetype: "image/jpeg",
    mime: "image/jpeg",
    created_at: "2024-01-15T10:30:00Z"
  }
}
```

### 文件管理接口 `/api/files`

```typescript
// 请求参数
GET /api/files?page=1&pageSize=20&type=image&folder=123

// 响应格式
{
  code: 200,
  data: {
    data: [
      {
        id: "1",
        name: "image.jpg",
        url: "https://cdn.example.com/uploads/image.jpg",
        mime: "image/jpeg",
        filesize: 102400,
        type: "file",
        created_at: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        name: "documents",
        type: "folder",
        created_at: "2024-01-15T09:00:00Z"
      }
    ],
    meta: {
      total: 50,
      page: 1,
      pageSize: 20,
      folder: null
    }
  }
}
```

## 🧪 第七步：测试上传功能

1. 启动项目并访问上传页面
2. 测试图片上传：拖拽图片到上传区域
3. 测试文件上传：选择不同类型的文件
4. 测试文件管理器：浏览、选择、删除文件
5. 测试表单集成：在表单中使用上传组件

```bash
npm run dev
```

## 💡 高级功能

### 图片裁剪上传

```vue
<script setup>
import { DuxImageCrop } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const croppedImage = ref('')
</script>

<template>
  <DuxImageCrop
    v-model:value="croppedImage"
    path="/api/upload"
    :aspect-ratio="1"
    circle
  />
</template>
```

### 自定义上传驱动

```typescript
import { createS3UploadDriver } from '@duxweb/dvha-core'

// 配置 S3 上传驱动
const s3Driver = createS3UploadDriver({
  signPath: '/api/upload/sign', // 签名接口
  region: 'us-east-1',
  bucket: 'my-bucket'
})

// 在上传组件中使用
const upload = useUpload({
  path: '/api/upload',
  driver: s3Driver
})
```

## 💡 常见问题

::: details 上传失败怎么办？
检查文件大小、格式是否符合限制，确认后端接口是否正常工作。
:::

::: details 如何限制文件类型？
使用 `accept` 属性指定允许的文件类型，如 `accept="image/*"` 或 `accept=".pdf,.doc,.docx"`。
:::

::: details 如何自定义上传样式？
上传组件支持通过 CSS 类名自定义样式，也可以使用插槽自定义内容。
:::

::: details 文件管理器如何分类显示？
使用 `type` 属性指定文件类型筛选，如 `type="image"` 只显示图片文件。
:::

## 🎯 总结

通过本教程，你学会了：

✅ **配置上传接口**，设置文件上传和管理的 API 路径
✅ **使用图片上传组件**，支持单张和多张图片上传
✅ **使用文件上传组件**，支持各种文件类型上传
✅ **使用文件管理器**，实现文件浏览和选择功能
✅ **在表单中集成上传**，构建完整的数据录入界面

DVHA Pro 的上传系统功能强大且易于使用，支持拖拽上传、进度显示、文件管理等高级功能，能够满足各种文件上传需求。
