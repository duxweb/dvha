# useImport

`useImport` hook 用于批量导入数据，支持分批处理和进度追踪。

## 功能特点

- 📥 **批量导入** - 支持大量数据的批量导入操作
- 🔄 **分批处理** - 自动将数据分批发送，避免服务器压力
- 📊 **进度追踪** - 实时显示导入进度和状态信息
- ⏱️ **间隔控制** - 支持批次间隔时间控制，防止请求过于频繁
- 🛡️ **错误处理** - 任何批次失败时自动停止并提供错误信息
- 🎯 **灵活配置** - 支持自定义批次大小和处理间隔
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook内部使用 `useCustomMutation` 执行批量数据导入操作。

```typescript
// 参数接口
interface IUseImportProps extends IDataProviderCustomOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCustomOptions>
  onComplete?: (progress: IImportProgress) => void // 完成回调
  onProgress?: (progress: IImportProgress) => void // 进度回调
  onError?: (error: IDataProviderError) => void // 错误回调
  interval?: number // 批次间隔时间(ms)
  chunkSize?: number // 每批数量
}

// 进度接口
interface IImportProgress {
  totalItems: number // 总条数
  processedItems: number // 处理条数
  totalBatches: number // 总批次
  processedBatches: number // 处理批次
  percentage: number // 百分比
}

// 返回值接口
interface IUseImportReturn {
  isLoading: ComputedRef<boolean> // 是否正在导入
  progress: ComputedRef<IImportProgress> // 导入进度
  trigger: (data: Record<string, any>[]) => Promise<void> // 触发导入
}
```

## 使用方法

```js
import { useImport } from '@duxweb/dvha-core'

const { isLoading, progress, trigger } = useImport({
  path: 'users/import',
  chunkSize: 100,
  interval: 200
})

// 执行导入
const userData = [
  { name: '张三', email: 'zhangsan@example.com' },
  { name: '李四', email: 'lisi@example.com' },
  // ... 更多数据
]

trigger(userData)
```

## 常用参数

```js
const { isLoading, progress, trigger } = useImport({
  // 必需参数
  path: 'users/import', // API 路径

  // 可选参数
  chunkSize: 50, // 每批处理数量，默认为 100
  interval: 300, // 批次间隔时间(ms)，默认为 100
  providerName: 'default', // 数据提供者名称，默认为 'default'

  // 回调函数
  onProgress: (progress) => { // 进度回调
    console.log(`导入进度: ${progress.percentage}%`)
    console.log(`${progress.processedItems}/${progress.totalItems} 条数据`)
    console.log(`${progress.processedBatches}/${progress.totalBatches} 批次`)
  },
  onComplete: (progress) => { // 完成回调
    console.log('导入完成!', progress)
    alert('数据导入成功!')
  },
  onError: (error) => { // 错误回调
    console.error('导入失败:', error.message)
    alert('导入失败，请重试')
  }
})
```

## 参数说明

| 参数           | 类型                                  | 必需 | 默认值    | 说明                         |
| -------------- | ------------------------------------- | ---- | --------- | ---------------------------- |
| `path`         | `string`                              | ❌   | -         | API 路径                     |
| `chunkSize`    | `number`                              | ❌   | `100`     | 每批处理的数据量             |
| `interval`     | `number`                              | ❌   | `100`     | 批次间隔时间(毫秒)           |
| `method`       | `string`                              | ❌   | `POST`    | HTTP 请求方法                |
| `headers`      | `Record<string, string>`              | ❌   | -         | 自定义请求头                 |
| `meta`         | `Record<string, any>`                 | ❌   | -         | 额外参数                     |
| `providerName` | `string`                              | ❌   | `default` | 数据提供者名称               |
| `onProgress`   | `(progress: IImportProgress) => void` | ❌   | -         | 进度回调函数                 |
| `onComplete`   | `(progress: IImportProgress) => void` | ❌   | -         | 完成回调函数                 |
| `onError`      | `(error: IDataProviderError) => void` | ❌   | -         | 错误回调函数                 |
| `options`      | `UseMutationOptions`                  | ❌   | -         | TanStack Query Mutation 选项 |

## 返回值

| 字段        | 类型                           | 说明           |
| ----------- | ------------------------------ | -------------- |
| `isLoading` | `ComputedRef<boolean>`         | 是否正在导入中 |
| `progress`  | `ComputedRef<IImportProgress>` | 导入进度信息   |
| `trigger`   | `Function`                     | 触发导入的函数 |

## 基本导入示例

```js
import { useImport } from '@duxweb/dvha-core'
import { ref } from 'vue'

const importData = ref([])

const { isLoading, progress, trigger } = useImport({
  path: 'users/import',
  chunkSize: 100,
  interval: 200,
  onProgress: (progress) => {
    console.log(`导入进度: ${progress.percentage}%`)
  },
  onComplete: (progress) => {
    console.log('导入完成!', progress)
    importData.value = []
  },
  onError: (error) => {
    console.error('导入失败:', error)
  }
})

function handleImport() {
  if (importData.value.length === 0) {
    alert('请先添加要导入的数据')
    return
  }

  trigger(importData.value)
}
```

## 文件导入示例

```js
import { useImport } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedFile = ref(null)

const { isLoading, progress, trigger } = useImport({
  path: 'products/import',
  chunkSize: 50,
  interval: 500,
  onProgress: (progress) => {
    updateProgressBar(progress.percentage)
  },
  onComplete: (progress) => {
    showSuccessMessage(`成功导入 ${progress.totalItems} 条产品数据`)
  },
  onError: (error) => {
    showErrorMessage(`导入失败: ${error.message}`)
  }
})

async function handleFileImport() {
  if (!selectedFile.value)
    return

  // 解析 CSV 或 Excel 文件
  const data = await parseFile(selectedFile.value)

  // 数据格式转换
  const formattedData = data.map(row => ({
    name: row['产品名称'],
    price: Number.parseFloat(row['价格']),
    category: row['分类'],
    description: row['描述']
  }))

  trigger(formattedData)
}

function parseFile(file) {
  return new Promise((resolve) => {
    // 使用 CSV 解析库或 Excel 解析库
    // 这里是示例代码
    const reader = new FileReader()
    reader.onload = (e) => {
      const csvData = parseCSV(e.target.result)
      resolve(csvData)
    }
    reader.readAsText(file)
  })
}
```

## 高级配置示例

```js
import { useImport } from '@duxweb/dvha-core'

const { isLoading, progress, trigger } = useImport({
  path: 'orders/bulk-import',
  chunkSize: 25, // 较小批次，处理复杂数据
  interval: 1000, // 较长间隔，避免服务器压力
  headers: {
    'Content-Type': 'application/json',
    'X-Import-Source': 'external-system'
  },
  meta: {
    validateData: true,
    sendNotification: true,
    source: 'csv_upload'
  },
  providerName: 'orderService',
  onProgress: (progress) => {
    // 更新进度条
    document.getElementById('progress-bar').style.width = `${progress.percentage}%`
    document.getElementById('progress-text').textContent
      = `${progress.processedItems}/${progress.totalItems} (${progress.percentage}%)`
  },
  onComplete: (progress) => {
    // 导入完成后的操作
    console.log('导入统计:', progress)

    // 刷新相关数据
    refreshOrderList()

    // 显示成功通知
    showNotification('success', `成功导入 ${progress.totalItems} 条订单数据`)

    // 记录操作日志
    logImportActivity('orders', progress.totalItems)
  },
  onError: (error) => {
    console.error('订单导入失败:', error)

    // 显示详细错误信息
    showNotification('error', `导入失败: ${error.message}`)

    // 记录错误日志
    logError('import_failed', error)
  }
})

function handleBulkImport(orderData) {
  // 数据预处理和验证
  const validatedData = orderData
    .filter(order => order.customer_id && order.amount)
    .map(order => ({
      ...order,
      amount: Number.parseFloat(order.amount),
      created_at: new Date().toISOString()
    }))

  trigger(validatedData)
}
```

## 进度显示示例

```vue
<script setup lang="ts">
import { useImport } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedFile = ref(null)
const importResult = ref(null)

const { isLoading, progress, trigger } = useImport({
  path: 'users/import',
  chunkSize: 100,
  interval: 200,
  onProgress: (progress) => {
    console.log('导入进度更新:', progress)
  },
  onComplete: (progress) => {
    importResult.value = {
      success: true,
      totalItems: progress.totalItems
    }
  },
  onError: (error) => {
    importResult.value = {
      success: false,
      error: error.message
    }
  }
})

function handleFileSelect(event) {
  selectedFile.value = event.target.files[0]
  importResult.value = null
}

async function handleImport() {
  if (!selectedFile.value)
    return

  try {
    const data = await parseFileData(selectedFile.value)
    trigger(data)
  }
  catch (error) {
    importResult.value = {
      success: false,
      error: '文件解析失败'
    }
  }
}

async function parseFileData(file) {
  // 文件解析逻辑
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        // 这里应该根据文件类型进行相应的解析
        const data = JSON.parse(e.target.result)
        resolve(data)
      }
      catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
</script>

<template>
  <div class="import-container">
    <div class="file-upload">
      <input
        type="file"
        accept=".csv,.xlsx"
        :disabled="isLoading"
        @change="handleFileSelect"
      >

      <button
        :disabled="!selectedFile || isLoading"
        class="import-button"
        @click="handleImport"
      >
        {{ isLoading ? '导入中...' : '开始导入' }}
      </button>
    </div>

    <!-- 进度显示 -->
    <div v-if="isLoading" class="progress-container">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>

      <div class="progress-info">
        <p>导入进度: {{ progress.percentage }}%</p>
        <p>数据条数: {{ progress.processedItems }}/{{ progress.totalItems }}</p>
        <p>批次进度: {{ progress.processedBatches }}/{{ progress.totalBatches }}</p>
      </div>
    </div>

    <!-- 结果显示 -->
    <div v-if="importResult" class="result-container">
      <div v-if="importResult.success" class="success-message">
        ✅ 导入成功! 共处理 {{ importResult.totalItems }} 条数据
      </div>
      <div v-else class="error-message">
        ❌ 导入失败: {{ importResult.error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.progress-info {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.success-message {
  color: #4caf50;
  font-weight: bold;
}

.error-message {
  color: #f44336;
  font-weight: bold;
}
</style>
```

## 多数据源导入示例

```js
import { useImport } from '@duxweb/dvha-core'

// 用户数据导入
const userImport = useImport({
  path: 'users/import',
  providerName: 'default',
  chunkSize: 100,
  onComplete: (progress) => {
    console.log('用户导入完成:', progress.totalItems)
  }
})

// 产品数据导入
const productImport = useImport({
  path: 'products/import',
  providerName: 'inventory',
  chunkSize: 50,
  interval: 500,
  onComplete: (progress) => {
    console.log('产品导入完成:', progress.totalItems)
  }
})

// 订单数据导入
const orderImport = useImport({
  path: 'orders/import',
  providerName: 'orderService',
  chunkSize: 25,
  interval: 1000,
  onComplete: (progress) => {
    console.log('订单导入完成:', progress.totalItems)
  }
})

// 执行不同的导入操作
function handleUserImport(userData) {
  userImport.trigger(userData)
}

function handleProductImport(productData) {
  productImport.trigger(productData)
}

function handleOrderImport(orderData) {
  orderImport.trigger(orderData)
}
```

## 工作流程

1. **数据准备**: 将要导入的数据按 `chunkSize` 分批
2. **初始化进度**: 设置总条数、总批次等初始值
3. **批次处理**: 逐批发送数据到服务器
4. **进度更新**: 每完成一批后更新进度信息
5. **间隔控制**: 在批次间等待指定时间
6. **完成或错误**: 所有批次完成后触发完成回调，或在错误时停止并触发错误回调

## 注意事项

- 导入过程中会阻止重复触发，需要等待当前导入完成
- 任何批次失败都会立即停止导入并触发错误回调
- 建议根据服务器性能和数据复杂度调整 `chunkSize` 和 `interval`
- 支持自定义请求头和额外参数，适应不同的后端接口需求
- 进度信息是响应式的，可直接在模板中使用
- 大文件导入时建议适当增加间隔时间，避免服务器压力过大
