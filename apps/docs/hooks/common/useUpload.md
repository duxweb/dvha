# useUpload

`useUpload` hook 用于处理文件上传功能，提供完整的文件选择、上传、进度监控和状态管理。

## 功能特点

- 📁 **文件选择** - 支持文件对话框选择和拖拽上传
- 📤 **多种上传方式** - 支持 File、Blob、Base64、ArrayBuffer 等格式
- 📊 **进度监控** - 实时显示上传进度、速度和剩余时间
- 🎯 **状态管理** - 完整的文件状态跟踪（pending/uploading/success/error/cancelled）
- 🚫 **限制控制** - 支持文件大小和数量限制
- ⚡ **自动上传** - 可选择文件后自动开始上传
- 🔄 **驱动支持** - 支持本地上传和 S3 等云存储
- 📋 **批量操作** - 支持批量上传、取消和删除
- 🛡️ **错误处理** - 完善的错误处理和状态恢复
- 📦 **数据管理** - 支持添加已存在的文件数据

## 接口关系

该hook支持多种上传驱动，默认使用本地上传驱动，也支持 S3 等云存储驱动。

```typescript
// 参数接口
interface IUseUploadProps {
  method?: 'POST' | 'PUT' // HTTP 方法
  maxFileSize?: number // 最大文件大小（字节）
  maxFileCount?: number // 最大文件数量
  accept?: string // 接受的文件类型
  multiple?: boolean // 是否支持多选
  autoUpload?: boolean // 是否自动上传
  driver?: IUploadDriver // 上传驱动实例
  onSuccess?: (data: IDataProviderResponse) => void // 成功回调
  onError?: (error: IDataProviderError) => void // 错误回调
  onProgress?: (progress: IOverallProgress) => void // 进度回调
  onCancel?: (id: string) => void // 取消回调
  onComplete?: (data: IUseUploadFile[]) => void // 完成回调
  onDataCallback?: (data: IDataProviderResponse, file: IUseUploadFile) => Partial<IUseUploadFileData> // 数据处理回调
}

// 返回值接口
interface IUseUploadReturn {
  isUploading: Ref<boolean> // 是否正在上传
  uploadFiles: Ref<IUseUploadFile[]> // 上传文件列表
  dataFiles: ComputedRef<IUseUploadFileData[]> // 成功上传的文件数据
  progress: ComputedRef<IOverallProgress> // 整体上传进度
  open: () => void // 打开文件选择对话框
  trigger: () => Promise<void> // 手动触发上传
  resetFiles: () => void // 重置文件选择
  clearFiles: () => void // 清空所有文件
  removeFiles: (ids?: string[]) => void // 删除指定文件
  addFiles: (files: IUseUploadPayload[], type?: IUseUploadType) => Promise<void> // 添加文件
  addDataFiles: (dataFiles: IUseUploadFileData[]) => void // 添加数据文件
  cancelFiles: (ids?: string[]) => void // 取消上传
}
```

## 使用方法

```js
import { useUpload } from '@duxweb/dvha-core'

const { uploadFiles, open, trigger, progress } = useUpload({
  path: 'upload',
  maxFileCount: 5,
  autoUpload: true
})
```

## 常用参数

```js
const { uploadFiles, dataFiles, open, addDataFiles } = useUpload({
  // 基础配置
  path: 'upload', // 上传接口路径
  method: 'POST', // HTTP 方法，默认 'POST'

  // 文件限制
  maxFileSize: 10 * 1024 * 1024, // 最大 10MB
  maxFileCount: 5, // 最多 5 个文件
  accept: 'image/*,.pdf', // 接受图片和 PDF
  multiple: true, // 支持多选

  // 上传行为
  autoUpload: true, // 选择文件后自动上传

  // 回调函数
  onSuccess: (data) => {
    console.log('单个文件上传成功:', data)
  },
  onError: (error) => {
    console.error('上传失败:', error)
  },
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.totalPercent}%`)
  },
  onComplete: (files) => {
    console.log('所有文件上传完成:', files)
  },

  // 数据处理
  onDataCallback: (response, file) => {
    // 自定义处理服务器返回的数据
    return {
      url: response.data.fileUrl,
      filename: response.data.originalName
    }
  }
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | 上传接口路径 |
| `method` | `'POST' \| 'PUT'` | ❌ | HTTP 方法，默认 'POST' |
| `maxFileSize` | `number` | ❌ | 最大文件大小（字节） |
| `maxFileCount` | `number` | ❌ | 最大文件数量 |
| `accept` | `string` | ❌ | 接受的文件类型 |
| `multiple` | `boolean` | ❌ | 是否支持多选，默认 false |
| `autoUpload` | `boolean` | ❌ | 是否自动上传，默认 false |
| `driver` | `IUploadDriver` | ❌ | 上传驱动实例 |
| `onSuccess` | `Function` | ❌ | 单个文件上传成功回调 |
| `onError` | `Function` | ❌ | 错误处理回调 |
| `onProgress` | `Function` | ❌ | 进度更新回调 |
| `onCancel` | `Function` | ❌ | 文件取消回调 |
| `onComplete` | `Function` | ❌ | 所有文件完成回调 |
| `onDataCallback` | `Function` | ❌ | 数据处理回调 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `isUploading` | `Ref<boolean>` | 是否正在上传 |
| `uploadFiles` | `Ref<IUseUploadFile[]>` | 完整的上传文件列表 |
| `dataFiles` | `ComputedRef<IUseUploadFileData[]>` | 成功上传的文件数据 |
| `progress` | `ComputedRef<IOverallProgress>` | 整体上传进度信息 |
| `open` | `Function` | 打开文件选择对话框 |
| `trigger` | `Function` | 手动触发上传 |
| `resetFiles` | `Function` | 重置文件选择状态 |
| `clearFiles` | `Function` | 清空所有文件 |
| `removeFiles` | `Function` | 删除指定文件 |
| `addFiles` | `Function` | 添加文件到上传列表 |
| `addDataFiles` | `Function` | 添加已存在的文件数据 |
| `cancelFiles` | `Function` | 取消指定文件上传 |

## 基础上传示例

```js
import { useUpload } from '@duxweb/dvha-core'
import { ref } from 'vue'

const { uploadFiles, open, trigger, isUploading, progress } = useUpload({
  path: 'upload',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFileCount: 3,
  multiple: true,
  autoUpload: false, // 手动控制上传
  onSuccess: (data) => {
    console.log('文件上传成功:', data)
  },
  onError: (error) => {
    console.error('上传失败:', error.message)
  }
})

// 选择文件
function selectFiles() {
  open()
}

// 开始上传
function startUpload() {
  trigger()
}
```

## 自动上传示例

```js
import { useUpload } from '@duxweb/dvha-core'

const { uploadFiles, open, dataFiles } = useUpload({
  path: 'upload',
  autoUpload: true, // 选择后自动上传
  accept: 'image/*', // 只接受图片
  multiple: true,
  onComplete: (files) => {
    console.log('所有图片上传完成:', files)
    // 可以更新表单数据等
  }
})

// 选择图片后会自动开始上传
function selectImages() {
  open()
}
```

## 进度监控示例

```js
import { useUpload } from '@duxweb/dvha-core'
import { ref } from 'vue'

const uploadStatus = ref('')

const { uploadFiles, open, progress } = useUpload({
  path: 'upload',
  autoUpload: true,
  onProgress: (progressData) => {
    const { index, totalFiles, totalPercent, currentFile } = progressData
    uploadStatus.value = `正在上传第 ${index}/${totalFiles} 个文件: ${currentFile?.filename} - ${totalPercent}%`
  },
  onComplete: () => {
    uploadStatus.value = '所有文件上传完成！'
  }
})
```

## S3 上传示例

```js
import { useUpload, createS3UploadDriver } from '@duxweb/dvha-core'

const { uploadFiles, open } = useUpload({
  driver: createS3UploadDriver({
    signPath: 'upload/sign', // S3 签名接口
    signCallback: (response) => ({
      uploadUrl: response.data.uploadUrl,
      url: response.data.fileUrl,
      params: response.data.formData
    })
  }),
  autoUpload: true,
  onSuccess: (data) => {
    console.log('S3 上传成功:', data)
  }
})
```

## 添加已存在文件示例

```js
import { useUpload } from '@duxweb/dvha-core'

const { uploadFiles, addDataFiles, dataFiles } = useUpload({
  path: 'upload'
})

// 添加已存在的文件数据（比如从服务器获取的）
function loadExistingFiles() {
  addDataFiles([
    {
      url: 'https://example.com/file1.jpg',
      filename: 'photo1.jpg',
      filesize: 102400,
      filetype: 'image/jpeg'
    },
    {
      url: 'https://example.com/file2.pdf',
      filename: 'document.pdf',
      filesize: 204800,
      filetype: 'application/pdf'
    }
  ])
}

// 获取所有成功的文件数据（用于表单提交等）
function getFileData() {
  return dataFiles.value // 返回 IUseUploadFileData[]
}
```

## 手动文件管理示例

```js
import { useUpload } from '@duxweb/dvha-core'
import { ref } from 'vue'

const { uploadFiles, addFiles, removeFiles, cancelFiles } = useUpload({
  path: 'upload',
  autoUpload: false
})

// 通过代码添加文件
async function addFileFromBlob(blob, filename) {
  try {
    await addFiles([blob], 'blob', filename)
  } catch (error) {
    console.error('添加文件失败:', error)
  }
}

// 删除指定文件
function removeFile(fileId) {
  removeFiles([fileId])
}

// 取消所有上传
function cancelAllUploads() {
  cancelFiles()
}

// 清空所有文件
function clearAllFiles() {
  clearFiles()
}
```

## Vue 组件完整示例

```vue
<script setup lang="ts">
import { useUpload } from '@duxweb/dvha-core'
import { computed } from 'vue'

const {
  uploadFiles,
  dataFiles,
  isUploading,
  progress,
  open,
  trigger,
  removeFiles,
  cancelFiles
} = useUpload({
  path: 'upload',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFileCount: 5,
  accept: 'image/*,.pdf,.doc,.docx',
  multiple: true,
  autoUpload: false,
  onSuccess: (data) => {
    console.log('文件上传成功:', data)
  },
  onError: (error) => {
    console.error('上传失败:', error.message)
  },
  onComplete: (files) => {
    console.log('所有文件上传完成，共', files.length, '个文件')
  }
})

// 计算上传状态文本
const statusText = computed(() => {
  if (isUploading.value) {
    return `上传中... ${progress.value.totalPercent}%`
  }
  return `共 ${uploadFiles.value.length} 个文件`
})

// 删除文件
function handleRemove(file) {
  removeFiles([file.id])
}

// 取消上传
function handleCancel(file) {
  cancelFiles([file.id])
}
</script>

<template>
  <div class="upload-component">
    <!-- 上传按钮 -->
    <button @click="open" :disabled="isUploading">
      选择文件
    </button>

    <!-- 手动上传按钮 -->
    <button
      @click="trigger"
      :disabled="isUploading || uploadFiles.length === 0"
    >
      开始上传
    </button>

    <!-- 状态显示 -->
    <div class="status">{{ statusText }}</div>

    <!-- 进度条 -->
    <div v-if="isUploading" class="progress">
      <div class="progress-bar" :style="{ width: progress.totalPercent + '%' }"></div>
    </div>

    <!-- 文件列表 -->
    <div class="file-list">
      <div
        v-for="file in uploadFiles"
        :key="file.id"
        class="file-item"
        :class="file.status"
      >
        <span class="filename">{{ file.filename }}</span>
        <span class="filesize">{{ file.filesizeText }}</span>
        <span class="status">{{ file.status }}</span>

        <!-- 进度 -->
        <div v-if="file.status === 'uploading'" class="file-progress">
          {{ file.progress?.percent }}% - {{ file.progress?.speedText }}
        </div>

        <!-- 操作按钮 -->
        <div class="actions">
          <button
            v-if="file.status === 'uploading'"
            @click="handleCancel(file)"
          >
            取消
          </button>
          <button
            v-else-if="file.status !== 'uploading'"
            @click="handleRemove(file)"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 成功文件数据 -->
    <div class="data-files">
      <h3>上传成功的文件：</h3>
      <pre>{{ JSON.stringify(dataFiles, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
.upload-component {
  padding: 20px;
}

.progress {
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-bar {
  height: 100%;
  background: #1890ff;
  transition: width 0.3s;
}

.file-list {
  margin-top: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.file-item.success {
  border-color: #52c41a;
  background: #f6ffed;
}

.file-item.error {
  border-color: #ff4d4f;
  background: #fff2f0;
}

.file-item.uploading {
  border-color: #1890ff;
  background: #e6f7ff;
}
</style>
```

## 类型定义

```typescript
// 文件状态类型
type FileStatus = 'pending' | 'uploading' | 'success' | 'error' | 'cancelled'

// 上传类型
type IUseUploadType = 'file' | 'blob' | 'base64' | 'arrayBuffer'

// 上传载荷
type IUseUploadPayload = File | Blob | string | ArrayBuffer

// 文件数据接口
interface IUseUploadFileData {
  url?: string // 文件访问地址
  filename?: string // 文件名
  filesize?: number // 文件大小
  filetype?: string // 文件类型
}

// 完整文件信息接口
interface IUseUploadFile extends IUseUploadFileData {
  id: string // 唯一标识
  progress?: IUploadProgress // 上传进度
  file?: File // 原始文件对象
  filesizeText?: string // 格式化的文件大小
  status?: FileStatus // 文件状态
  error?: string // 错误信息
  data?: IDataProviderResponse // 服务器响应数据
}

// 进度信息接口
interface IUploadProgress {
  loaded: number // 已上传字节数
  total?: number // 总字节数
  percent?: number // 上传百分比
  speed?: number // 上传速度（字节/秒）
  speedText?: string // 格式化的速度文本
  uploadTime?: number // 已用时间（秒）
  remainingTime?: number // 剩余时间（秒）
}

// 整体进度接口
interface IOverallProgress {
  index: number // 当前文件索引（从1开始）
  totalFiles: number // 总文件数
  currentFile?: IUseUploadFile // 当前上传的文件
  totalPercent: number // 整体进度百分比
  totalLoaded: number // 总已上传字节数
  totalSize: number // 总文件大小
}
```