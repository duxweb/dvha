# 编辑器组件

编辑器组件提供了富文本编辑功能，支持AI辅助编辑、Markdown、图片上传等特性。

## 导入

```typescript
import { DuxAiEditor } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下编辑器组件：

- **DuxAiEditor** - AI 富文本编辑器

## DuxAiEditor AI 富文本编辑器

基于 AiEditor 的富文本编辑器组件，集成了 AI 辅助写作、文件上传、主题适配等功能。

### 属性

| 属性名        | 类型                | 默认值  | 说明             |
| ------------- | ------------------- | ------- | ---------------- |
| value         | string              | -       | 编辑器内容       |
| defaultValue  | string              | -       | 默认内容         |
| uploadPath    | string              | -       | 文件上传接口路径 |
| uploadHeaders | Record<string, any> | -       | 上传请求头       |
| aiPath        | string              | -       | AI 接口路径      |
| height        | string              | '500px' | 编辑器高度       |

### 事件

| 事件名       | 类型                    | 说明           |
| ------------ | ----------------------- | -------------- |
| update:value | (value: string) => void | 内容更新时触发 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const content = ref('<p>这是初始内容</p>')
</script>

<template>
  <DuxAiEditor
    v-model:value="content"
    height="400px"
  />
</template>
```

### 自定义上传配置

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const content = ref('')

// 自定义上传配置
const uploadHeaders = {
  'Authorization': 'Bearer your-token',
  'X-Custom-Header': 'custom-value'
}
</script>

<template>
  <DuxAiEditor
    v-model:value="content"
    upload-path="/api/upload"
    :upload-headers="uploadHeaders"
    height="600px"
  />
</template>
```

### AI 辅助写作配置

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const content = ref('')
</script>

<template>
  <DuxAiEditor
    v-model:value="content"
    ai-path="/api/ai/chat"
    upload-path="/api/upload"
    height="500px"
  />
</template>
```

### 表单集成

```vue
<script setup lang="ts">
import { DuxAiEditor, DuxFormItem } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const form = ref({
  title: '',
  content: ''
})
</script>

<template>
  <form>
    <DuxFormItem label="标题" path="title" rule="required">
      <n-input v-model:value="form.title" placeholder="请输入标题" />
    </DuxFormItem>

    <DuxFormItem label="内容" path="content" rule="required">
      <DuxAiEditor
        v-model:value="form.content"
        upload-path="/api/upload"
        ai-path="/api/ai/chat"
        height="400px"
      />
    </DuxFormItem>
  </form>
</template>
```

### 只读模式

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { onMounted, ref } from 'vue'

const content = ref('<p>这是只读内容，无法编辑</p>')
const editorRef = ref()

onMounted(() => {
  // 通过 AiEditor 实例设置只读模式
  if (editorRef.value?.aiEditor) {
    editorRef.value.aiEditor.setEditable(false)
  }
})
</script>

<template>
  <DuxAiEditor
    ref="editorRef"
    v-model:value="content"
    height="300px"
  />
</template>
```

## 功能特性

### 1. 富文本编辑

- **文本格式化**: 支持粗体、斜体、下划线、删除线等文本样式
- **段落格式**: 支持标题、段落、引用、代码块等段落格式
- **列表**: 支持有序列表、无序列表、任务列表
- **表格**: 支持插入和编辑表格
- **链接**: 支持插入和编辑超链接

### 2. 媒体插入

- **图片**: 支持图片上传、粘贴、拖拽插入
- **视频**: 支持视频文件上传和插入
- **附件**: 支持各种文件类型的附件上传

### 3. AI 辅助写作

- **内容生成**: 基于提示词生成文章内容
- **内容优化**: 优化现有文本的表达和结构
- **续写**: 根据上下文自动续写内容
- **摘要**: 自动生成文章摘要

### 4. 主题适配

- **自动切换**: 根据系统主题自动切换编辑器主题
- **深色模式**: 完整支持深色模式界面
- **自定义样式**: 支持自定义编辑器样式

## 配置说明

### 应用配置

在应用配置中设置默认的接口地址：

```typescript
import { createDux } from '@duxweb/dvha-core'
import { createApp } from 'vue'

const app = createApp(App)

app.use(createDux({
  manage: {
    apiPath: {
      upload: '/api/upload', // 文件上传接口
      ai: '/api/ai/chat' // AI 接口
    }
  }
}))
```

### 服务端接口

#### 文件上传接口

```typescript
// 文件上传接口
POST /api/upload
Content-Type: multipart/form-data

// 请求参数
{
  file: File  // 上传的文件
}

// 响应格式
{
  code: 200,
  data: {
    url: string,      // 文件访问URL
    filename: string, // 文件名
    filesize: number, // 文件大小
    filetype: string  // 文件类型
  }
}
```

#### AI 接口

```typescript
// AI 聊天接口
POST /api/ai/chat
Content-Type: application/json
Authorization: Bearer <token>

// 请求参数
{
  prompt: string  // 用户输入的提示词
}

// 响应格式 (Server-Sent Events)
data: {"message": "生成的内容", "number": 1, "status": "generating"}
data: {"message": "完整内容", "number": 2, "status": "completed"}
```

### 上传配置

编辑器支持多种文件类型的上传：

```typescript
// 图片上传配置
image: {
  uploadPath: '/api/upload',
  uploadHeaders: {
    'Authorization': 'Bearer token'
  },
  // 支持的图片格式
  accept: 'image/jpeg,image/png,image/gif,image/webp'
}

// 视频上传配置
video: {
  uploadPath: '/api/upload',
  uploadHeaders: {
    'Authorization': 'Bearer token'
  },
  // 支持的视频格式
  accept: 'video/mp4,video/avi,video/mov'
}

// 附件上传配置
attachment: {
  uploadPath: '/api/upload',
  uploadHeaders: {
    'Authorization': 'Bearer token'
  },
  // 支持的文件格式
  accept: '*/*'
}
```

## 高级用法

### 自定义工具栏

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { onMounted, ref } from 'vue'

const editorRef = ref()
const content = ref('')

onMounted(() => {
  // 通过 AiEditor 实例自定义工具栏
  if (editorRef.value?.aiEditor) {
    const aiEditor = editorRef.value.aiEditor

    // 自定义工具栏配置
    aiEditor.setToolbar([
      'bold',
      'italic',
      'underline',
      '|',
      'heading',
      'paragraph',
      '|',
      'bulletList',
      'orderedList',
      '|',
      'image',
      'video',
      'attachment',
      '|',
      'ai'
    ])
  }
})
</script>

<template>
  <DuxAiEditor
    ref="editorRef"
    v-model:value="content"
    height="500px"
  />
</template>
```

### 监听编辑器事件

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { onMounted, ref } from 'vue'

const editorRef = ref()
const content = ref('')

onMounted(() => {
  if (editorRef.value?.aiEditor) {
    const aiEditor = editorRef.value.aiEditor

    // 监听内容变化
    aiEditor.on('change', (content) => {
      console.log('内容变化:', content)
    })

    // 监听焦点事件
    aiEditor.on('focus', () => {
      console.log('编辑器获得焦点')
    })

    // 监听失焦事件
    aiEditor.on('blur', () => {
      console.log('编辑器失去焦点')
    })
  }
})
</script>

<template>
  <DuxAiEditor
    ref="editorRef"
    v-model:value="content"
    height="500px"
  />
</template>
```

### 动态设置内容

```vue
<script setup lang="ts">
import { DuxAiEditor } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const editorRef = ref()
const content = ref('')

function setContent(html: string) {
  if (editorRef.value?.aiEditor) {
    editorRef.value.aiEditor.setContent(html)
  }
}

function getContent() {
  if (editorRef.value?.aiEditor) {
    return editorRef.value.aiEditor.getHtml()
  }
  return ''
}

function insertContent(html: string) {
  if (editorRef.value?.aiEditor) {
    editorRef.value.aiEditor.insertContent(html)
  }
}
</script>

<template>
  <div>
    <div class="mb-4 space-x-2">
      <n-button @click="setContent('<p>新的内容</p>')">
        设置内容
      </n-button>
      <n-button @click="console.log(getContent())">
        获取内容
      </n-button>
      <n-button @click="insertContent('<p>插入的内容</p>')">
        插入内容
      </n-button>
    </div>

    <DuxAiEditor
      ref="editorRef"
      v-model:value="content"
      height="400px"
    />
  </div>
</template>
```

## 最佳实践

### 1. 合理设置编辑器高度

```vue
<template>
  <!-- 根据使用场景设置合适的高度 -->

  <!-- 简单编辑：300-400px -->
  <DuxAiEditor height="300px" />

  <!-- 标准编辑：400-600px -->
  <DuxAiEditor height="500px" />

  <!-- 长文档编辑：600px+ -->
  <DuxAiEditor height="800px" />

  <!-- 响应式高度 -->
  <DuxAiEditor height="min(60vh, 600px)" />
</template>
```

### 2. 处理文件上传

```vue
<script setup lang="ts">
import { useMessage } from 'naive-ui'

const message = useMessage()

// 自定义上传处理
const uploadHeaders = computed(() => ({
  'Authorization': `Bearer ${token.value}`,
  'X-Upload-Source': 'editor'
}))

function handleUploadError(error: Error) {
  message.error(`上传失败: ${error.message}`)
}
</script>

<template>
  <DuxAiEditor
    v-model:value="content"
    upload-path="/api/upload"
    :upload-headers="uploadHeaders"
    @upload-error="handleUploadError"
  />
</template>
```

### 3. 内容验证

```vue
<script setup lang="ts">
import { computed } from 'vue'

const content = ref('')

// 内容长度验证
const contentLength = computed(() => {
  const text = content.value.replace(/<[^>]*>/g, '')
  return text.length
})

const isContentValid = computed(() => {
  return contentLength.value >= 10 && contentLength.value <= 10000
})
</script>

<template>
  <DuxFormItem
    label="文章内容"
    path="content"
    :rule="isContentValid ? '' : '内容长度应在10-10000字之间'"
  >
    <DuxAiEditor v-model:value="content" />
    <div class="mt-2 text-sm text-gray-500">
      当前字数: {{ contentLength }} / 10000
    </div>
  </DuxFormItem>
</template>
```

### 4. 性能优化

```vue
<script setup lang="ts">
import { debounce } from 'lodash-es'

const content = ref('')

// 防抖保存
const saveContent = debounce((content: string) => {
  // 自动保存逻辑
  console.log('自动保存:', content)
}, 2000)

function handleContentChange(value: string) {
  content.value = value
  saveContent(value)
}
</script>

<template>
  <DuxAiEditor
    :value="content"
    height="500px"
    @update:value="handleContentChange"
  />
</template>
```
