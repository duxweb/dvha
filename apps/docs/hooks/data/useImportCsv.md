# useImportCsv

`useImportCsv` hook 用于从 CSV 文件导入数据，基于 `useImport` 并集成了 `json-2-csv` 库和 `useFileDialog`，支持文件选择、CSV 解析、批量导入等功能。

## 功能特点

- 📂 **文件选择** - 集成 useFileDialog，提供友好的文件选择界面
- 📄 **CSV 解析** - 使用 json-2-csv 库，支持标准 CSV 格式解析
- 📊 **批量导入** - 基于 useImport，支持分批处理大量数据
- ⚡ **进度跟踪** - 实时显示导入进度和状态
- 🎯 **灵活调用** - 支持弹窗选择文件或直接传入文件对象
- 🔧 **格式自定义** - 支持自定义分隔符、编码、表头等
- 🌍 **编码支持** - 支持 Excel BOM，正确处理中文等非 ASCII 字符
- 🔒 **类型安全** - 完整的 TypeScript 类型支持

## 依赖库

该 hook 集成了以下库：

- [json-2-csv](https://mrodrig.github.io/json-2-csv/) - CSV 解析
- [@vueuse/core](https://vueuse.org/) - useFileDialog 文件选择
- 基于 `useImport` - 批量导入逻辑

## 使用方法

```js
import { useImportCsv } from '@duxweb/dvha-core'

const { isLoading, progress, open, readFile } = useImportCsv({
  path: 'users/import',
  csvOptions: {
    delimiter: ',',
    excelBOM: true
  },
  onProgress: (progress) => {
    console.log(`导入进度: ${progress.percentage}%`)
  },
  onComplete: () => {
    console.log('导入完成')
  }
})

// 方式1: 打开文件选择弹窗
open()

// 方式2: 直接处理文件
readFile(file)
```

## 常用参数

```js
const { isLoading, progress, open, readFile } = useImportCsv({
  // 基础配置
  path: 'users/import', // API 路径

  // CSV 解析配置
  csvOptions: {
    delimiter: ',', // 字段分隔符，默认逗号
    wrap: '"', // 包装字符，默认双引号
    eol: '\n', // 行结束符，默认换行符
    excelBOM: true, // 是否处理 BOM，支持中文
    headerFields: ['name', 'email', 'phone'], // 自定义表头字段
    keys: ['name', 'email'], // 指定要导入的字段
    trimHeaderFields: true, // 去除表头空格
    trimFieldValues: true, // 去除字段值空格
  },

  // 导入控制（继承自 useImport）
  chunkSize: 100, // 每批处理数量
  interval: 500, // 批次间隔毫秒数

  // 回调函数
  onProgress: (progress) => {
    console.log(`已处理: ${progress.processedItems}/${progress.totalItems}`)
  },
  onComplete: (progress) => {
    console.log('导入完成:', progress)
  },
  onError: (error) => {
    console.error('导入失败:', error)
  }
})
```

## 参数说明

### 基础参数

| 参数   | 类型     | 必需 | 默认值 | 说明         |
| ------ | -------- | ---- | ------ | ------------ |
| `path` | `string` | ✅   | -      | API 资源路径 |

### CSV 解析配置 (csvOptions)

| 参数               | 类型       | 默认值  | 说明                                |
| ------------------ | ---------- | ------- | ----------------------------------- |
| `delimiter`        | `string`   | `,`     | 字段分隔符                          |
| `wrap`             | `string`   | `"`     | 包装字符                            |
| `eol`              | `string`   | `\n`    | 行结束符                            |
| `excelBOM`         | `boolean`  | `false` | 是否处理 BOM，建议中文文件设为 true |
| `headerFields`     | `string[]` | -       | 自定义表头字段名                    |
| `keys`             | `string[]` | -       | 指定要转换的字段                    |
| `trimHeaderFields` | `boolean`  | `false` | 是否去除表头字段的空格              |
| `trimFieldValues`  | `boolean`  | `false` | 是否去除字段值的空格                |

### 继承参数

该 hook 继承了 `useImport` 的所有参数：

| 参数           | 类型                 | 默认值    | 说明           |
| -------------- | -------------------- | --------- | -------------- |
| `chunkSize`    | `number`             | `100`     | 每批处理数量   |
| `interval`     | `number`             | `100`     | 批次间隔毫秒数 |
| `providerName` | `string`             | `default` | 数据提供者名称 |
| `onProgress`   | `(progress) => void` | -         | 进度回调       |
| `onComplete`   | `(progress) => void` | -         | 完成回调       |
| `onError`      | `(error) => void`    | -         | 错误回调       |

## 返回值

| 字段        | 类型            | 说明             |
| ----------- | --------------- | ---------------- |
| `isLoading` | `Ref<boolean>`  | 是否正在导入中   |
| `progress`  | `Ref<Progress>` | 导入进度信息     |
| `open`      | `Function`      | 打开文件选择弹窗 |
| `readFile`  | `Function`      | 直接处理文件对象 |

### Progress 对象结构

```typescript
interface IImportProgress {
  totalItems: number // 总条数
  processedItems: number // 已处理条数
  totalBatches: number // 总批次
  processedBatches: number // 已处理批次
  percentage: number // 完成百分比
}
```

## 基本导入示例

```vue
<script setup>
import { useImportCsv } from '@duxweb/dvha-core'

const { isLoading, progress, open } = useImportCsv({
  path: 'users/import',
  csvOptions: {
    excelBOM: true, // 支持中文
    trimFieldValues: true
  },
  onProgress: (progress) => {
    console.log(`导入进度: ${progress.percentage}%`)
  },
  onComplete: () => {
    alert('用户数据导入完成！')
  },
  onError: (error) => {
    alert(`导入失败: ${error.message}`)
  }
})

function handleImport() {
  open()
}
</script>

<template>
  <div class="import-section">
    <button
      :disabled="isLoading"
      class="btn-primary"
      @click="handleImport"
    >
      {{ isLoading ? '导入中...' : '导入用户数据' }}
    </button>

    <!-- 进度条 -->
    <div v-if="isLoading" class="progress-bar">
      <div class="progress-text">
        导入进度: {{ progress.percentage }}%
        ({{ progress.processedItems }}/{{ progress.totalItems }})
      </div>
      <div class="progress-bg">
        <div
          class="progress-fill"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
    </div>
  </div>
</template>
```

## 自定义字段映射

```js
import { useImportCsv } from '@duxweb/dvha-core'

// 指定 CSV 表头字段名和要导入的字段
const { isLoading, open } = useImportCsv({
  path: 'products/import',
  csvOptions: {
    headerFields: ['产品名称', '价格', '库存', '分类'], // CSV 文件的表头
    keys: ['name', 'price', 'stock', 'category'], // 对应的 API 字段
    delimiter: ',',
    excelBOM: true
  },
  onComplete: () => {
    console.log('产品数据导入完成')
  }
})
```

## 处理拖拽文件

```vue
<script setup>
import { useImportCsv } from '@duxweb/dvha-core'

const { isLoading, progress, readFile } = useImportCsv({
  path: 'orders/import',
  csvOptions: {
    excelBOM: true
  },
  onComplete: () => {
    console.log('订单导入完成')
  }
})

// 处理文件拖拽
function handleDrop(event) {
  event.preventDefault()
  const files = event.dataTransfer.files

  if (files.length > 0 && files[0].type === 'text/csv') {
    readFile(files[0])
  }
  else {
    alert('请选择 CSV 文件')
  }
}

function handleDragOver(event) {
  event.preventDefault()
}
</script>

<template>
  <div
    class="drop-zone"
    :class="{ 'is-loading': isLoading }"
    @drop="handleDrop"
    @dragover="handleDragOver"
  >
    <div v-if="!isLoading">
      <p>拖拽 CSV 文件到此处</p>
      <p>
        或 <button @click="open">
          点击选择文件
        </button>
      </p>
    </div>

    <div v-else class="loading-state">
      <p>正在导入中...</p>
      <div class="progress">
        {{ progress.percentage }}%
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-zone {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: border-color 0.3s;
}

.drop-zone:hover {
  border-color: #007bff;
}

.is-loading {
  border-color: #28a745;
  background-color: #f8f9fa;
}
</style>
```

## 批量导入优化

```js
import { useImportCsv } from '@duxweb/dvha-core'

// 针对大文件的优化配置
const { isLoading, progress, open } = useImportCsv({
  path: 'bulk-import',
  chunkSize: 500, // 增大批次处理数量
  interval: 200, // 减少批次间隔
  csvOptions: {
    excelBOM: true,
    trimFieldValues: true, // 清理数据
    keys: ['name', 'email', 'phone'] // 只导入必要字段
  },
  onProgress: (progress) => {
    // 详细的进度显示
    console.log(`
      批次进度: ${progress.processedBatches}/${progress.totalBatches}
      记录进度: ${progress.processedItems}/${progress.totalItems}
      完成度: ${progress.percentage}%
    `)
  },
  onComplete: () => {
    console.log('批量导入完成')
  },
  onError: (error) => {
    console.error('批量导入失败:', error)
  }
})
```

## 错误处理和验证

```vue
<script setup>
import { useImportCsv } from '@duxweb/dvha-core'
import { ref } from 'vue'

const errorMessage = ref('')
const isValidating = ref(false)

const { isLoading, progress, readFile } = useImportCsv({
  path: 'users/import',
  csvOptions: {
    excelBOM: true,
    keys: ['name', 'email', 'phone']
  },
  onError: (error) => {
    // 详细的错误处理
    switch (error.status) {
      case 400:
        if (error.message.includes('CSV 文件为空')) {
          errorMessage.value = '选择的 CSV 文件为空，请检查文件内容'
        }
        else {
          errorMessage.value = '文件格式不正确，请确保是有效的 CSV 文件'
        }
        break
      case 500:
        if (error.message.includes('CSV 解析错误')) {
          errorMessage.value = 'CSV 文件解析失败，请检查文件格式和编码'
        }
        else {
          errorMessage.value = '服务器处理失败，请稍后重试'
        }
        break
      default:
        errorMessage.value = `导入失败: ${error.message}`
    }
  },
  onComplete: () => {
    errorMessage.value = ''
    alert('导入成功完成！')
  }
})

// 文件预验证
async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file)
    return

  errorMessage.value = ''

  // 基本验证
  if (!file.name.toLowerCase().endsWith('.csv')) {
    errorMessage.value = '请选择 CSV 文件'
    return
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    errorMessage.value = '文件过大，请选择小于 10MB 的文件'
    return
  }

  // 简单内容验证
  isValidating.value = true
  try {
    const text = await file.text()
    if (text.trim().length === 0) {
      errorMessage.value = '文件内容为空'
      return
    }

    // 检查是否有基本的 CSV 结构
    const lines = text.split('\n')
    if (lines.length < 2) {
      errorMessage.value = '文件至少应包含表头和一行数据'
      return
    }

    // 开始导入
    readFile(file)
  }
  catch (error) {
    errorMessage.value = '文件读取失败，请检查文件是否损坏'
  }
  finally {
    isValidating.value = false
  }
}
</script>

<template>
  <div class="import-form">
    <input
      type="file"
      accept=".csv"
      :disabled="isLoading || isValidating"
      @change="handleFileSelect"
    >

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <!-- 进度显示 -->
    <div v-if="isLoading" class="import-progress">
      <h4>正在导入数据...</h4>
      <div class="progress-details">
        <p>总共 {{ progress.totalItems }} 条记录</p>
        <p>已处理 {{ progress.processedItems }} 条</p>
        <p>完成度: {{ progress.percentage }}%</p>
      </div>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
    </div>

    <!-- 验证状态 -->
    <div v-if="isValidating" class="validating">
      正在验证文件...
    </div>
  </div>
</template>
```

## 自定义 CSV 格式

```js
import { useImportCsv } from '@duxweb/dvha-core'

// 处理特殊格式的 CSV
const { isLoading, open } = useImportCsv({
  path: 'special-import',
  csvOptions: {
    delimiter: ';', // 分号分隔（欧洲格式）
    wrap: '\'', // 单引号包装
    eol: '\r\n', // Windows 行结束符
    excelBOM: true, // 处理 BOM
    trimHeaderFields: true, // 清理表头
    trimFieldValues: true, // 清理数据
    headerFields: ['姓名', '邮箱', '电话'], // 中文表头
  },
  onComplete: () => {
    console.log('特殊格式 CSV 导入完成')
  }
})
```

## 注意事项

1. **文件编码**：设置 `csvOptions.excelBOM: true` 以正确处理包含中文的 Excel 导出文件
2. **文件大小**：大文件建议增加 `chunkSize` 并适当调整 `interval`
3. **字段映射**：使用 `headerFields` 和 `keys` 进行字段映射时，数组长度应该一致
4. **错误处理**：务必提供 `onError` 回调来处理各种导入失败的情况
5. **进度跟踪**：使用 `onProgress` 回调提供良好的用户体验
6. **文件验证**：建议在导入前进行基本的文件格式验证

## 最佳实践

```js
// 推荐的配置示例
const { isLoading, progress, open, readFile } = useImportCsv({
  path: 'users/import',
  chunkSize: 200, // 适中的批次大小
  interval: 300, // 适中的间隔时间
  csvOptions: {
    excelBOM: true, // 支持中文
    trimFieldValues: true, // 清理数据
    delimiter: ',', // 标准分隔符
  },
  onProgress: (progress) => {
    // 提供实时反馈
    updateProgressUI(progress)
  },
  onComplete: (progress) => {
    // 成功提示和页面刷新
    showNotification(`成功导入 ${progress.totalItems} 条记录`, 'success')
    refreshDataList()
  },
  onError: (error) => {
    // 统一错误处理
    showNotification(`导入失败: ${error.message}`, 'error')
    logError('CSV Import Error', error)
  }
})
```
