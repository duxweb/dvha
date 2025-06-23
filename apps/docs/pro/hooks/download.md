# useDownload - 文件下载

`useDownload` 是一个文件下载 Hook，提供多种文件下载方式，支持下载进度监控和不同数据格式的下载。

## 特性

- **多种下载方式**: 支持文件、URL、Blob、Base64 等下载方式
- **进度监控**: 实时显示下载进度、速度和剩余时间
- **自动命名**: 自动生成文件名或使用服务器指定的文件名

## 基础用法

### 导入

```typescript
import { useDownload } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const download = useDownload()

// 文件下载
download.file('/api/export/users')

// URL 下载
download.url('https://example.com/file.pdf', 'document.pdf')

// 图片下载
download.image('https://example.com/image.jpg')
```

## API 参考

### UseDownloadResult

| 字段     | 类型                                                                  | 说明           |
| -------- | --------------------------------------------------------------------- | -------------- |
| file     | (path, params?, contentType?, filename?, onProgress?) => void        | 文件下载       |
| url      | (urlString: string, filename?: string) => void                       | URL 下载       |
| blob     | (blobData: Blob, filename?: string) => void                          | Blob 下载      |
| base64   | (base64String: string, filename: string) => void                     | Base64 下载    |
| image    | (urlString: string) => void                                           | 图片下载       |
| loading  | Ref\<boolean\>                                                        | 下载状态       |
| progress | Ref\<IDownloadProgress\>                                              | 下载进度信息   |

### IDownloadProgress

| 字段          | 类型   | 说明                 |
| ------------- | ------ | -------------------- |
| loaded        | number | 已下载字节数         |
| total         | number | 总字节数             |
| percent       | number | 下载百分比           |
| speed         | number | 下载速度（字节/秒）  |
| speedText     | string | 格式化的速度文本     |
| remainingTime | number | 预计剩余时间（秒）   |

## 使用示例

### 基础下载

```vue
<script setup>
import { useDownload } from '@duxweb/dvha-pro'
import { NButton, NProgress } from 'naive-ui'

const download = useDownload()

// 下载文件
function downloadFile() {
  download.file('/api/export/users', { format: 'xlsx' })
}

// 下载图片
function downloadImage() {
  download.image('https://example.com/photo.jpg')
}

// 下载 URL
function downloadUrl() {
  download.url('https://example.com/document.pdf', 'document.pdf')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <NButton :loading="download.loading.value" @click="downloadFile">
        下载用户数据
      </NButton>
      <NButton @click="downloadImage">
        下载图片
      </NButton>
      <NButton @click="downloadUrl">
        下载文档
      </NButton>
    </div>

    <!-- 下载进度 -->
    <div v-if="download.loading.value">
      <NProgress
        type="line"
        :percentage="download.progress.value.percent"
        :show-indicator="false"
      />
      <div class="text-sm text-gray-600 mt-2">
        <span>{{ download.progress.value.speedText }}</span>
        <span class="ml-4">剩余时间: {{ download.progress.value.remainingTime }}s</span>
      </div>
    </div>
  </div>
</template>
```

### 带进度监控的下载

```vue
<script setup>
import { useDownload } from '@duxweb/dvha-pro'
import { NButton, NCard, NProgress } from 'naive-ui'
import { ref } from 'vue'

const download = useDownload()
const customProgress = ref({ percent: 0, speedText: '', remainingTime: 0 })

function downloadWithProgress() {
  download.file('/api/export/large-file', {}, undefined, undefined, (progress) => {
    customProgress.value = progress
    console.log('下载进度:', progress)
  })
}
</script>

<template>
  <div class="space-y-4">
    <NButton :loading="download.loading.value" @click="downloadWithProgress">
      下载大文件
    </NButton>

    <NCard v-if="download.loading.value" title="下载进度">
      <NProgress
        type="line"
        :percentage="customProgress.percent"
      />
      <div class="mt-2 space-y-1 text-sm">
        <div>速度: {{ customProgress.speedText }}</div>
        <div>剩余时间: {{ customProgress.remainingTime }}秒</div>
        <div>
          已下载: {{ Math.round(download.progress.value.loaded / 1024) }}KB /
          {{ Math.round((download.progress.value.total || 0) / 1024) }}KB
        </div>
      </div>
    </NCard>
  </div>
</template>
```

### Base64 和 Blob 下载

```vue
<script setup>
import { useDownload } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'

const download = useDownload()

// 下载 Base64 数据
function downloadBase64() {
  const base64Data = 'data:text/plain;base64,SGVsbG8gV29ybGQh'
  download.base64(base64Data, 'hello.txt')
}

// 下载 Blob 数据
function downloadBlob() {
  const content = 'Hello, World!'
  const blob = new Blob([content], { type: 'text/plain' })
  download.blob(blob, 'hello.txt')
}

// 生成并下载 CSV
function downloadCsv() {
  const csvContent = 'Name,Age,City\nJohn,25,New York\nJane,30,London'
  const blob = new Blob([csvContent], { type: 'text/csv' })
  download.blob(blob, 'users.csv')
}
</script>

<template>
  <div class="flex gap-2">
    <NButton @click="downloadBase64">
      下载 Base64
    </NButton>
    <NButton @click="downloadBlob">
      下载 Blob
    </NButton>
    <NButton @click="downloadCsv">
      生成 CSV
    </NButton>
  </div>
</template>
```

## 高级用法

### 自定义下载配置

```typescript
const download = useDownload({
  // 默认配置
  timeout: 30000, // 超时时间
  retryCount: 3, // 重试次数
  chunkSize: 1024 * 1024 // 分块大小
})
```

### 下载进度监控

```typescript
function downloadWithProgress() {
  download.url('https://example.com/large-file.zip', 'file.zip', {
    onProgress: (progress) => {
      console.log('进度:', progress)
      // progress: { loaded: number, total: number, percent: number }
    },
    onComplete: () => {
      console.log('下载完成')
    },
    onError: (error) => {
      console.error('下载失败:', error)
    }
  })
}
```

### 条件下载

```typescript
async function conditionalDownload() {
  try {
    // 检查文件大小
    const response = await fetch('https://example.com/file.pdf', { method: 'HEAD' })
    const fileSize = Number.parseInt(response.headers.get('content-length'))

    if (fileSize > 10 * 1024 * 1024) { // 10MB
      const confirmed = await confirm('文件较大，确定要下载吗？')
      if (!confirmed)
        return
    }

    download.url('https://example.com/file.pdf', 'file.pdf')
  }
  catch (error) {
    console.error('检查文件失败:', error)
  }
}
```

## 最佳实践

### 1. 文件名处理

```typescript
// ✅ 推荐：使用时间戳避免文件名冲突
const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
download.blob(blob, `export-${timestamp}.csv`)

// ✅ 推荐：处理中文文件名
const filename = encodeURIComponent('中文文件名.pdf')
download.url('/api/download', filename)
```

### 2. 大文件下载

```typescript
// ✅ 推荐：大文件下载提供进度反馈
download.url('/api/large-file', 'file.zip', {
  onProgress: (progress) => {
    updateProgressBar(progress.percent)
  },
  onComplete: () => {
    showSuccessMessage('下载完成')
  }
})
```

### 3. 错误处理

```typescript
// ✅ 推荐：完善的错误处理
download.url('/api/file', 'file.pdf', {
  onError: (error) => {
    if (error.name === 'TimeoutError') {
      message.error('下载超时，请检查网络连接')
    }
    else if (error.status === 404) {
      message.error('文件不存在')
    }
    else {
      message.error('下载失败，请稍后重试')
    }
  }
})
```

## 常见问题

### Q: 如何处理大文件下载？

A: 使用分块下载和进度监控：

```typescript
download.url('/api/large-file', 'file.zip', {
  chunkSize: 2 * 1024 * 1024, // 2MB 分块
  onProgress: (progress) => {
    console.log(`已下载: ${progress.percent}%`)
  }
})
```

### Q: 如何支持断点续传？

A: 可以配合服务端实现断点续传：

```typescript
download.url('/api/file', 'file.zip', {
  resumable: true,
  onResume: (position) => {
    console.log(`从 ${position} 字节继续下载`)
  }
})
```

### Q: 如何下载需要认证的文件？

A: 在 URL 下载中添加认证头：

```typescript
download.url('/api/protected-file', 'file.pdf', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

### Q: 如何处理不同浏览器的兼容性？

A: Hook 内部已处理兼容性，支持现代浏览器的下载功能。对于老版本浏览器，会自动降级到兼容的实现方式。
