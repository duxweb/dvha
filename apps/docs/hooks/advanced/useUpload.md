# useUpload

`useUpload` hook 用于处理文件上传功能，提供完整的文件选择、上传、进度监控和状态管理。支持多种上传驱动和文件格式。

## 功能特点

- 📁 **文件选择** - 集成 useFileDialog，支持文件对话框选择
- 📤 **多种上传格式** - 支持 File、Blob、Base64、ArrayBuffer 等格式
- 🔄 **上传驱动** - 支持本地上传和 S3 等云存储驱动
- 📊 **进度监控** - 实时显示上传进度、速度和剩余时间
- 🎯 **状态管理** - 完整的文件状态跟踪（pending/uploading/success/error/cancelled）
- 🚫 **限制控制** - 支持文件大小和数量限制
- ⚡ **自动上传** - 可选择文件后自动开始上传
- 📋 **批量操作** - 支持批量上传、取消和删除
- 🛡️ **错误处理** - 完善的错误处理和状态恢复
- 📦 **数据管理** - 支持添加已存在的文件数据

## 接口关系

该hook支持多种上传驱动，默认使用本地上传驱动，也支持 S3 等云存储驱动。

```typescript
// 参数接口
interface IUseUploadProps extends Omit<IDataProviderCustomOptions, 'onUploadProgress' | 'onDownloadProgress'> {
  method?: 'POST' | 'PUT' // HTTP 方法
  maxFileSize?: number // 最大文件大小（字节）
  maxFileCount?: number // 最大文件数量
  accept?: string // 接受的文件类型
  multiple?: boolean // 是否支持多选
  autoUpload?: boolean // 是否自动上传
  driver?: IUploadDriver // 上传驱动实例

  // 回调函数
  onSuccess?: (data: IDataProviderResponse) => void // 单个文件成功回调
  onError?: (error: IDataProviderError) => void // 错误回调
  onProgress?: (progress: IOverallProgress) => void // 整体进度回调
  onCancel?: (id: string) => void // 取消回调
  onComplete?: (data: IUseUploadFile[]) => void // 全部完成回调
  onDataCallback?: (data: IDataProviderResponse, file: IUseUploadFile) => Partial<IUseUploadFileData> // 数据处理回调
}

// 上传文件类型
export type IUseUploadType = 'file' | 'blob' | 'base64' | 'arrayBuffer'
export type IUseUploadPayload = File | Blob | string | ArrayBuffer

// 文件数据接口
interface IUseUploadFileData {
  url?: string // 文件访问URL
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
  status?: 'pending' | 'uploading' | 'success' | 'error' | 'cancelled' // 状态
  error?: string // 错误信息
  data?: IDataProviderResponse // 服务器响应数据
}

// 单文件进度接口
interface IUploadProgress {
  loaded: number // 已上传字节数
  total?: number // 总字节数
  percent?: number // 上传百分比
  speed?: number // 上传速度（字节/秒）
  speedText?: string // 格式化的上传速度
  uploadTime?: number // 已用时间（毫秒）
  remainingTime?: number // 剩余时间（毫秒）
}

// 整体进度接口
interface IOverallProgress {
  index: number // 当前上传文件索引（从1开始）
  totalFiles: number // 总文件数
  currentFile?: IUseUploadFile // 当前上传的文件
  totalPercent: number // 整体完成百分比
  totalLoaded: number // 总已上传字节数
  totalSize: number // 总文件大小
}

// 返回值接口
interface IUseUploadReturn {
  isUploading: Ref<boolean> // 是否正在上传
  uploadFiles: Ref<IUseUploadFile[]> // 完整的上传文件列表
  dataFiles: ComputedRef<IUseUploadFileData[]> // 成功上传的文件数据
  overallProgress: ComputedRef<IOverallProgress> // 整体上传进度

  // 文件对话框相关
  open: () => void // 打开文件选择对话框
  resetFiles: () => void // 重置文件选择状态
  files: Ref<FileList | null> // 选中的文件列表

  // 上传控制
  trigger: () => Promise<void> // 手动触发上传
  clearFiles: () => void // 清空所有文件
  removeFile: (id: string) => void // 删除单个文件
  removeFiles: (ids?: string[]) => void // 删除多个文件
  cancelFile: (id: string) => void // 取消单个文件上传
  cancelFiles: (ids?: string[]) => void // 取消多个文件上传

  // 文件添加
  addFile: (payload: IUseUploadPayload, type: IUseUploadType, filename?: string) => Promise<IUseUploadFile> // 添加单个文件
  addFiles: (files: IUseUploadPayload[], type?: IUseUploadType) => Promise<void> // 添加多个文件
  addDataFiles: (dataFiles: IUseUploadFileData[]) => void // 添加已存在的文件数据
  createFileFromData: (fileData: IUseUploadFileData) => IUseUploadFile // 从数据创建文件对象
}
```

## 使用方法

```js
import { useUpload } from '@duxweb/dvha-core'

const { uploadFiles, open, trigger, overallProgress } = useUpload({
  path: 'upload',
  maxFileCount: 5,
  autoUpload: true
})
```

## 常用参数

```js
const { uploadFiles, dataFiles, open, addDataFiles, isUploading } = useUpload({
  // 基础配置
  path: 'upload', // 上传接口路径
  method: 'POST', // HTTP 方法，默认 'POST'

  // 文件限制
  maxFileSize: 10 * 1024 * 1024, // 最大 10MB
  maxFileCount: 5, // 最多 5 个文件
  accept: 'image/*,.pdf,.doc,.docx', // 接受的文件类型
  multiple: true, // 支持多选

  // 上传行为
  autoUpload: true, // 选择文件后自动上传

  // 回调函数
  onSuccess: (data) => {
    console.log('单个文件上传成功:', data)
  },
  onError: (error) => {
    console.error('上传失败:', error.message)
  },
  onProgress: (progress) => {
    console.log(`整体进度: ${progress.totalPercent}%`)
    console.log(`当前文件: ${progress.currentFile?.filename}`)
  },
  onComplete: (files) => {
    console.log('所有文件上传完成:', files)
  },
  onCancel: (id) => {
    console.log('文件被取消:', id)
  },

  // 数据处理
  onDataCallback: (response, file) => {
    // 自定义处理服务器返回的数据
    return {
      url: response.data.fileUrl,
      filename: response.data.originalName,
      filesize: file.file?.size,
      filetype: file.file?.type
    }
  }
})
```

## 参数说明

| 参数             | 类型              | 必需 | 说明                     |
| ---------------- | ----------------- | ---- | ------------------------ |
| `path`           | `string`          | ✅   | 上传接口路径             |
| `method`         | `'POST' \| 'PUT'` | ❌   | HTTP 方法，默认 'POST'   |
| `maxFileSize`    | `number`          | ❌   | 最大文件大小（字节）     |
| `maxFileCount`   | `number`          | ❌   | 最大文件数量             |
| `accept`         | `string`          | ❌   | 接受的文件类型           |
| `multiple`       | `boolean`         | ❌   | 是否支持多选，默认 false |
| `autoUpload`     | `boolean`         | ❌   | 是否自动上传，默认 false |
| `driver`         | `IUploadDriver`   | ❌   | 上传驱动实例             |
| `onSuccess`      | `Function`        | ❌   | 单个文件上传成功回调     |
| `onError`        | `Function`        | ❌   | 错误处理回调             |
| `onProgress`     | `Function`        | ❌   | 整体进度更新回调         |
| `onCancel`       | `Function`        | ❌   | 文件取消回调             |
| `onComplete`     | `Function`        | ❌   | 所有文件完成回调         |
| `onDataCallback` | `Function`        | ❌   | 数据处理回调             |

## 返回值

| 字段              | 类型                                | 说明                 |
| ----------------- | ----------------------------------- | -------------------- |
| `isUploading`     | `Ref<boolean>`                      | 是否正在上传         |
| `uploadFiles`     | `Ref<IUseUploadFile[]>`             | 完整的上传文件列表   |
| `dataFiles`       | `ComputedRef<IUseUploadFileData[]>` | 成功上传的文件数据   |
| `overallProgress` | `ComputedRef<IOverallProgress>`     | 整体上传进度信息     |
| `open`            | `Function`                          | 打开文件选择对话框   |
| `resetFiles`      | `Function`                          | 重置文件选择状态     |
| `files`           | `Ref<FileList \| null>`             | 选中的文件列表       |
| `trigger`         | `Function`                          | 手动触发上传         |
| `clearFiles`      | `Function`                          | 清空所有文件         |
| `removeFile`      | `Function`                          | 删除单个文件         |
| `removeFiles`     | `Function`                          | 删除多个文件         |
| `cancelFile`      | `Function`                          | 取消单个文件上传     |
| `cancelFiles`     | `Function`                          | 取消多个文件上传     |
| `addFile`         | `Function`                          | 添加单个文件         |
| `addFiles`        | `Function`                          | 添加多个文件         |
| `addDataFiles`    | `Function`                          | 添加已存在的文件数据 |

## 基础上传示例

```js
import { useUpload } from '@duxweb/dvha-core'

const { uploadFiles, open, trigger, isUploading, overallProgress } = useUpload({
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
  if (uploadFiles.value.length === 0) {
    alert('请先选择文件')
    return
  }
  trigger()
}

// 监听进度
watchEffect(() => {
  const progress = overallProgress.value
  console.log(`进度: ${progress.totalPercent}% (${progress.index}/${progress.totalFiles})`)
})
```

## 自动上传示例

```js
import { useUpload } from '@duxweb/dvha-core'

const { uploadFiles, open, dataFiles } = useUpload({
  path: 'upload',
  autoUpload: true, // 选择后自动上传
  accept: 'image/*', // 只接受图片
  multiple: true,
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.totalPercent}%`)
    if (progress.currentFile) {
      console.log(`当前文件: ${progress.currentFile.filename}`)
    }
  },
  onComplete: (files) => {
    console.log('所有图片上传完成:', files)
    // 可以更新表单数据等
  }
})

// 选择图片后会自动开始上传
function selectImages() {
  open()
}

// 获取成功上传的文件数据
function getUploadedFiles() {
  return dataFiles.value // 只包含成功上传的文件
}
```

## 进度监控示例

```js
import { useUpload } from '@duxweb/dvha-core'
import { computed } from 'vue'

const {
  uploadFiles,
  overallProgress,
  isUploading,
  open,
  trigger,
  cancelFiles
} = useUpload({
  path: 'upload',
  multiple: true,
  onProgress: (progress) => {
    console.log('整体进度更新:', progress)
  }
})

// 格式化进度信息
const progressText = computed(() => {
  const progress = overallProgress.value
  return `${progress.index}/${progress.totalFiles} 文件，${progress.totalPercent}% 完成`
})

// 当前文件进度
const currentFileProgress = computed(() => {
  const current = overallProgress.value.currentFile
  if (!current?.progress)
    return ''

  return `${current.filename}: ${current.progress.percent}% (${current.progress.speedText})`
})

// 取消所有上传
function cancelAll() {
  cancelFiles()
}
```

## 文件管理示例

```js
import { useUpload } from '@duxweb/dvha-core'

const {
  uploadFiles,
  addFiles,
  addDataFiles,
  removeFile,
  removeFiles,
  cancelFile,
  clearFiles
} = useUpload({
  path: 'upload',
  autoUpload: false
})

// 通过代码添加不同类型的文件
async function addFileFromBlob(blob, filename) {
  try {
    await addFile(blob, 'blob', filename)
    console.log('Blob 文件添加成功')
  }
  catch (error) {
    console.error('添加文件失败:', error)
  }
}

async function addFileFromBase64(base64Data, filename) {
  try {
    await addFile(base64Data, 'base64', filename)
    console.log('Base64 文件添加成功')
  }
  catch (error) {
    console.error('添加文件失败:', error)
  }
}

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

// 删除指定文件
function removeFileById(fileId) {
  removeFile(fileId)
}

// 取消上传中的文件
function cancelFileById(fileId) {
  cancelFile(fileId)
}

// 清空所有文件
function clearAllFiles() {
  clearFiles()
}
```

## 上传驱动示例

```js
import { createS3UploadDriver, useUpload } from '@duxweb/dvha-core'

// 使用 S3 上传驱动
const s3Driver = createS3UploadDriver({
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  region: 'us-east-1',
  bucket: 'your-bucket-name'
})

const { uploadFiles, open } = useUpload({
  path: 'upload',
  driver: s3Driver, // 使用 S3 驱动
  onSuccess: (data) => {
    console.log('文件上传到 S3 成功:', data)
  }
})

// 自定义上传驱动
const customDriver = {
  async upload(file, options) {
    // 自定义上传逻辑
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/custom-upload', {
      method: 'POST',
      body: formData,
      onUploadProgress: options.onProgress
    })

    return await response.json()
  }
}

const { uploadFiles: customFiles } = useUpload({
  path: 'upload',
  driver: customDriver
})
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
  overallProgress,
  open,
  trigger,
  removeFile,
  cancelFile,
  clearFiles
} = useUpload({
  path: 'upload',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFileCount: 5,
  accept: 'image/*,application/pdf',
  multiple: true,
  autoUpload: false,

  onSuccess: (data) => {
    console.log('文件上传成功:', data)
  },
  onError: (error) => {
    console.error('上传失败:', error.message)
  },
  onProgress: (progress) => {
    console.log(`上传进度: ${progress.totalPercent}%`)
  },
  onComplete: (files) => {
    console.log('所有文件上传完成:', files.length)
  }
})

// 计算属性
const hasFiles = computed(() => uploadFiles.value.length > 0)
const uploadDisabled = computed(() => isUploading.value || !hasFiles.value)
const successCount = computed(() => dataFiles.value.length)

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 获取状态文本
function getStatusText(status) {
  const statusMap = {
    pending: '等待上传',
    uploading: '上传中',
    success: '上传成功',
    error: '上传失败',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知状态'
}

// 获取状态样式
function getStatusClass(status) {
  return {
    'text-gray-500': status === 'pending',
    'text-blue-500': status === 'uploading',
    'text-green-500': status === 'success',
    'text-red-500': status === 'error',
    'text-yellow-500': status === 'cancelled'
  }
}
</script>

<template>
  <div class="upload-container">
    <!-- 操作按钮 -->
    <div class="upload-actions">
      <button class="btn btn-primary" @click="open">
        选择文件
      </button>
      <button
        :disabled="uploadDisabled"
        class="btn btn-success"
        @click="trigger"
      >
        {{ isUploading ? '上传中...' : '开始上传' }}
      </button>
      <button
        :disabled="!hasFiles"
        class="btn btn-danger"
        @click="clearFiles"
      >
        清空文件
      </button>
    </div>

    <!-- 整体进度 -->
    <div v-if="hasFiles" class="overall-progress">
      <div class="progress-info">
        <span>整体进度: {{ overallProgress.totalPercent }}%</span>
        <span>({{ overallProgress.index }}/{{ overallProgress.totalFiles }})</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${overallProgress.totalPercent}%` }"
        />
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="hasFiles" class="file-list">
      <div
        v-for="file in uploadFiles"
        :key="file.id"
        class="file-item"
      >
        <div class="file-info">
          <div class="file-name">
            {{ file.filename }}
          </div>
          <div class="file-meta">
            <span>{{ formatFileSize(file.filesize || 0) }}</span>
            <span
              :class="getStatusClass(file.status)"
              class="file-status"
            >
              {{ getStatusText(file.status) }}
            </span>
          </div>
        </div>

        <!-- 文件进度条 -->
        <div v-if="file.progress" class="file-progress">
          <div class="progress-bar small">
            <div
              class="progress-fill"
              :style="{ width: `${file.progress.percent || 0}%` }"
            />
          </div>
          <span class="progress-text">
            {{ file.progress.percent || 0 }}%
            <span v-if="file.progress.speedText">
              ({{ file.progress.speedText }})
            </span>
          </span>
        </div>

        <!-- 错误信息 -->
        <div v-if="file.error" class="file-error">
          {{ file.error }}
        </div>

        <!-- 操作按钮 -->
        <div class="file-actions">
          <button
            v-if="file.status === 'uploading'"
            class="btn btn-sm btn-warning"
            @click="cancelFile(file.id)"
          >
            取消
          </button>
          <button
            v-if="file.status !== 'uploading'"
            class="btn btn-sm btn-danger"
            @click="removeFile(file.id)"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 上传结果 -->
    <div v-if="successCount > 0" class="upload-result">
      <h3>上传成功的文件 ({{ successCount }} 个):</h3>
      <div class="success-files">
        <div
          v-for="file in dataFiles"
          :key="file.url"
          class="success-file"
        >
          <a :href="file.url" target="_blank">
            {{ file.filename }}
          </a>
          <span class="file-size">
            ({{ formatFileSize(file.filesize || 0) }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.upload-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}
.btn-success {
  background: #28a745;
  color: white;
}
.btn-danger {
  background: #dc3545;
  color: white;
}
.btn-warning {
  background: #ffc107;
  color: black;
}
.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.overall-progress {
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
}

.progress-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar.small {
  height: 4px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

.file-list {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
}

.file-item {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.file-name {
  font-weight: 500;
  flex: 1;
  margin-right: 10px;
  word-break: break-all;
}

.file-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #6c757d;
}

.file-status {
  font-weight: 500;
}

.file-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.progress-text {
  font-size: 12px;
  min-width: 100px;
}

.file-error {
  color: #dc3545;
  font-size: 12px;
  margin-bottom: 10px;
}

.file-actions {
  display: flex;
  gap: 5px;
}

.upload-result {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.success-files {
  margin-top: 10px;
}

.success-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.success-file a {
  color: #007bff;
  text-decoration: none;
  flex: 1;
}

.success-file a:hover {
  text-decoration: underline;
}

.file-size {
  font-size: 12px;
  color: #6c757d;
}
</style>
```

## 工作流程

1. **文件选择**: 通过文件对话框选择文件或通过代码添加文件
2. **文件验证**: 检查文件大小、数量等限制条件
3. **文件添加**: 将文件添加到上传队列，生成唯一ID
4. **上传执行**: 按顺序上传文件，实时更新进度
5. **状态管理**: 跟踪每个文件的上传状态和进度
6. **错误处理**: 处理上传失败的文件，提供重试机制
7. **完成处理**: 收集成功上传的文件数据

## 注意事项

- 默认使用本地上传驱动，可通过 `driver` 参数自定义
- 文件大小和数量限制在客户端验证，服务端也应该验证
- `autoUpload: true` 时，选择文件后会立即开始上传
- `onDataCallback` 可以自定义处理服务器返回的文件信息
- 支持多种文件类型：File、Blob、Base64、ArrayBuffer
- 上传过程中可以取消单个或多个文件
- `dataFiles` 只包含成功上传的文件数据，适合表单提交
- 进度监控包括单文件进度和整体进度
- 错误状态会保留在文件列表中，便于查看和重试
