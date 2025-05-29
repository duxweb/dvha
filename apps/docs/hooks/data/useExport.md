# useExport

`useExport` hook 用于批量导出数据，支持分页获取和间隔控制，适用于大数据量的导出场景。

## 功能特点

- 📦 **批量导出** - 自动获取多页数据并合并导出
- ⏱️ **间隔控制** - 支持设置请求间隔，避免服务器压力
- 📄 **页数限制** - 可设置最大导出页数，控制数据量
- 🔄 **自动分页** - 基于 useInfiniteList，自动处理分页逻辑
- ⚡ **状态管理** - 提供导出状态和加载状态
- 🎯 **多数据源** - 支持指定不同的数据提供者
- 🚫 **重复防护** - 自动防止重复触发导出

## 接口关系

该hook基于 `useInfiniteList`，调用数据提供者的 `getList(options, manage, auth)` 方法获取分页数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  getList: (
    options: IDataProviderListOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderListOptions {
  path: string // API 路径
  pagination?: { // 分页配置
    page?: number
    pageSize?: number
  }
  filters?: Record<string, any> // 筛选条件
  sorters?: Record<string, 'asc' | 'desc'> // 排序配置
  meta?: Record<string, any> // 额外参数
}

// 响应数据接口
interface IDataProviderResponse {
  message?: string // 响应消息
  data?: any // 响应数据
  meta?: Record<string, any> // 元数据信息
  [key: string]: any // 其他自定义字段
}
```

## 使用方法

```js
import { useExport } from '@duxweb/dvha-core'

const { data, isLoading, trigger } = useExport({
  path: 'users',
  maxPage: 10,
  interval: 1000,
  onSuccess: (data) => {
    console.log('导出完成:', data)
  }
})
```

## 常用参数

```js
const { data, isLoading, trigger } = useExport({
  // 必需参数
  path: 'users', // API 路径

  // 导出控制参数
  maxPage: 50, // 最大导出页数，默认为 100
  interval: 500, // 请求间隔毫秒数，默认为 300ms

  // 回调函数
  onSuccess: (data) => { // 导出完成回调
    // 处理导出的数据
    console.log('导出数据:', data)
    downloadExcel(data)
  },

  // 可选参数（继承自 useInfiniteList）
  pagination: { // 分页配置
    pageSize: 100 // 每页数量，建议设置较大值提高效率
  },
  filters: { // 筛选条件
    status: 'active',
    role: 'admin'
  },
  sorters: { // 排序
    created_at: 'desc',
    name: 'asc'
  },
  meta: { // 额外参数
    include: 'profile,permissions'
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onError: (err) => { // 错误回调
    console.error('导出失败:', err)
  }
})
```

## 参数说明

| 参数           | 类型                                              | 必需 | 默认值    | 说明                             |
| -------------- | ------------------------------------------------- | ---- | --------- | -------------------------------- |
| `path`         | `string`                                          | ✅   | -         | API 资源路径                     |
| `maxPage`      | `number`                                          | ❌   | `100`     | 最大导出页数                     |
| `interval`     | `number`                                          | ❌   | `300`     | 请求间隔毫秒数                   |
| `onSuccess`    | `(data: InfiniteData) => void`                    | ❌   | -         | 导出完成回调函数                 |
| `pagination`   | `object`                                          | ❌   | -         | 分页配置                         |
| `filters`      | `Record<string, any>`                             | ❌   | -         | 筛选条件                         |
| `sorters`      | `Record<string, 'asc' \| 'desc'>`                 | ❌   | -         | 排序条件                         |
| `meta`         | `Record<string, any>`                             | ❌   | -         | 传递给 API 的额外参数            |
| `providerName` | `string`                                          | ❌   | `default` | 数据提供者名称                   |
| `onError`      | `(error: any) => void`                            | ❌   | -         | 错误处理回调                     |
| `options`      | `IDataQueryOptionsInfinite`                       | ❌   | -         | TanStack Query 无限查询选项      |

## 返回值

| 字段        | 类型                | 说明                 |
| ----------- | ------------------- | -------------------- |
| `data`      | `Ref<InfiniteData>` | 导出的数据对象       |
| `isLoading` | `Ref<boolean>`      | 是否正在导出中       |
| `trigger`   | `Function`          | 触发导出的方法       |

## 基本导出示例

```vue
<script setup>
import { useExport } from '@duxweb/dvha-core'

const { isLoading, trigger } = useExport({
  path: 'users',
  maxPage: 20,
  interval: 800,
  onSuccess: (data) => {
    // 合并所有页面的数据
    const allUsers = data.pages.flatMap(page => page.data)

    // 导出为 CSV
    exportToCSV(allUsers, 'users.csv')

    // 或导出为 Excel
    exportToExcel(allUsers, 'users.xlsx')
  },
  onError: (error) => {
    console.error('导出失败:', error)
    alert('导出失败，请重试')
  }
})

// 触发导出
function handleExport() {
  trigger()
}
</script>

<template>
  <button
    :disabled="isLoading"
    @click="handleExport"
    class="export-button"
  >
    {{ isLoading ? '导出中...' : '导出数据' }}
  </button>
</template>
```

## 条件导出示例

```js
import { useExport } from '@duxweb/dvha-core'
import { ref } from 'vue'

const dateRange = ref({ start: '', end: '' })
const selectedStatus = ref('all')

const { isLoading, trigger } = useExport({
  path: 'orders',
  maxPage: 100,
  interval: 500,
  filters: {
    created_at: {
      gte: dateRange.value.start,
      lte: dateRange.value.end
    },
    status: selectedStatus.value === 'all' ? undefined : selectedStatus.value
  },
  pagination: {
    pageSize: 200 // 大页面提高效率
  },
  onSuccess: (data) => {
    const orders = data.pages.flatMap(page => page.data)
    exportOrdersToExcel(orders)
  }
})

// 根据条件导出
function exportWithConditions() {
  trigger()
}
```

## Excel 导出示例

```js
import { useExport } from '@duxweb/dvha-core'
import * as XLSX from 'xlsx'

const { isLoading, trigger } = useExport({
  path: 'products',
  maxPage: 50,
  interval: 1000, // 较大间隔避免服务器压力
  onSuccess: (data) => {
    // 合并所有页面数据
    const products = data.pages.flatMap(page => page.data)

    // 转换为 Excel 格式
    const worksheet = XLSX.utils.json_to_sheet(products.map(product => ({
      '产品名称': product.name,
      '价格': product.price,
      '库存': product.stock,
      '分类': product.category?.name,
      '创建时间': new Date(product.created_at).toLocaleDateString()
    })))

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '产品列表')

    // 下载文件
    XLSX.writeFile(workbook, `产品列表_${new Date().toISOString().split('T')[0]}.xlsx`)
  },
  onError: (error) => {
    console.error('导出失败:', error)
  }
})
```

## 多数据源导出示例

```js
import { useExport } from '@duxweb/dvha-core'

// 导出用户数据
const userExport = useExport({
  path: 'users',
  providerName: 'default',
  maxPage: 30,
  onSuccess: (data) => {
    const users = data.pages.flatMap(page => page.data)
    exportUsersToCSV(users)
  }
})

// 导出分析数据
const analyticsExport = useExport({
  path: 'reports',
  providerName: 'analytics',
  maxPage: 10,
  interval: 2000, // 分析服务可能需要更大间隔
  onSuccess: (data) => {
    const reports = data.pages.flatMap(page => page.data)
    exportReportsToExcel(reports)
  }
})

// 导出交易数据
const transactionExport = useExport({
  path: 'transactions',
  providerName: 'payment',
  maxPage: 100,
  interval: 500,
  onSuccess: (data) => {
    const transactions = data.pages.flatMap(page => page.data)
    exportTransactionsToCSV(transactions)
  }
})
```

## 大数据量导出示例

```js
import { useExport } from '@duxweb/dvha-core'

const { isLoading, trigger } = useExport({
  path: 'logs',
  maxPage: 500, // 大量数据
  interval: 2000, // 较大间隔保护服务器
  pagination: {
    pageSize: 500 // 大页面减少请求次数
  },
  onSuccess: (data) => {
    console.log('导出完成，总页数:', data.pages.length)

    // 分批处理大数据
    const allLogs = data.pages.flatMap(page => page.data)

    // 如果数据量很大，可以分文件导出
    const chunkSize = 10000
    for (let i = 0; i < allLogs.length; i += chunkSize) {
      const chunk = allLogs.slice(i, i + chunkSize)
      const fileName = `logs_part_${Math.floor(i / chunkSize) + 1}.csv`
      exportToCSV(chunk, fileName)
    }
  },
  onError: (error) => {
    console.error('大数据导出失败:', error)
  }
})
```

## 注意事项

### 🚨 **性能优化**

- **合理设置页面大小**：建议 `pageSize` 设置为 100-500，减少请求次数
- **控制最大页数**：根据实际需求设置 `maxPage`，避免导出过多数据
- **设置请求间隔**：使用 `interval` 参数避免对服务器造成压力

### ⚠️ **服务器友好**

```js
// 推荐配置
const { trigger } = useExport({
  path: 'data',
  maxPage: 50,        // 限制最大页数
  interval: 1000,     // 1秒间隔
  pagination: {
    pageSize: 200     // 大页面减少请求次数
  }
})
```

### 🔒 **错误处理**

```js
const { isLoading, trigger } = useExport({
  path: 'sensitive-data',
  onSuccess: (data) => {
    // 导出成功处理
  },
  onError: (error) => {
    // 根据错误类型进行处理
    if (error.status === 403) {
      alert('权限不足，无法导出')
    } else if (error.status === 429) {
      alert('请求过于频繁，请稍后重试')
    } else {
      alert('导出失败，请联系管理员')
    }
  }
})
```

### 💡 **最佳实践**

1. **数据量评估**：导出前评估数据量，设置合理的页数限制
2. **用户体验**：显示导出进度，提供取消功能
3. **文件命名**：使用时间戳或其他标识避免文件名冲突
4. **内存管理**：大数据量时考虑分批处理，避免内存溢出

```js
// 带进度显示的导出
const exportProgress = ref(0)

const { trigger } = useExport({
  path: 'large-dataset',
  maxPage: 100,
  onProgress: (current, total) => {
    exportProgress.value = Math.floor((current / total) * 100)
  },
  onSuccess: (data) => {
    exportProgress.value = 100
    // 处理导出完成
  }
})
```