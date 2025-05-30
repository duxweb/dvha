# useExportCsv

`useExportCsv` hook 用于将数据导出为 CSV 文件，基于 `useExport` 并集成了 `json-2-csv` 库，支持自定义 CSV 格式、自动下载等功能。

## 功能特点

- 📦 **批量导出** - 基于 useExport，支持分页数据的批量导出
- 📄 **CSV 格式** - 使用 json-2-csv 库，完全符合 RFC 4180 标准
- 🎯 **自定义表头** - 支持指定特定字段或自定义表头名称
- 🌍 **国际化支持** - 支持 Excel BOM，正确显示中文等非 ASCII 字符
- ⚙️ **格式自定义** - 支持自定义分隔符、引号、行结束符等
- 📥 **自动下载** - 生成后自动触发浏览器下载
- 🔒 **类型安全** - 完整的 TypeScript 类型支持

## 依赖库

该 hook 使用了 [json-2-csv](https://mrodrig.github.io/json-2-csv/) 库进行 JSON 到 CSV 的转换，支持：

- 嵌套对象的展平
- 数组数据的处理
- 自定义字段映射
- RFC 4180 标准兼容

## 使用方法

```js
import { useExportCsv } from '@duxweb/dvha-core'

const { isLoading, trigger } = useExportCsv({
  path: 'users',
  filename: 'users.csv',
  headers: ['name', 'email', 'created_at'],
  csvOptions: {
    delimiter: ',',
    writeBOM: true
  }
})

// 触发导出
trigger()
```

## 常用参数

```js
const { isLoading, trigger } = useExportCsv({
  // 基础配置
  path: 'users', // API 路径
  filename: 'users-export.csv', // 下载文件名

  // 表头配置
  headers: ['id', 'name', 'email', 'status'], // 指定导出字段
  // 或
  headers: true, // 导出所有字段（默认）
  // 或
  headers: false, // 不包含表头行

  // CSV 格式配置
  csvOptions: {
    delimiter: ',', // 字段分隔符，默认逗号
    quote: '"', // 包装字符，默认双引号
    eol: '\n', // 行结束符，默认换行符
    writeBOM: true, // 是否添加 BOM，支持 Excel 中文显示
  },

  // 导出控制（继承自 useExport）
  maxPage: 50, // 最大导出页数
  interval: 500, // 请求间隔

  // 筛选和排序
  filters: {
    status: 'active'
  },
  sorters: {
    created_at: 'desc'
  },

  // 回调函数
  onSuccess: (data) => {
    console.log('CSV 导出成功')
  },
  onError: (error) => {
    console.error('导出失败:', error)
  }
})
```

## 参数说明

### 基础参数

| 参数       | 类型                  | 必需 | 默认值       | 说明         |
| ---------- | --------------------- | ---- | ------------ | ------------ |
| `path`     | `string`              | ✅   | -            | API 资源路径 |
| `filename` | `string`              | ❌   | `export.csv` | 下载的文件名 |
| `headers`  | `string[] \| boolean` | ❌   | `true`       | 表头配置     |

### CSV 格式配置 (csvOptions)

| 参数        | 类型                | 默认值  | 说明                                |
| ----------- | ------------------- | ------- | ----------------------------------- |
| `delimiter` | `string`            | `,`     | 字段分隔符                          |
| `quote`     | `string \| boolean` | `"`     | 包装字符，false 表示不包装          |
| `eol`       | `string`            | `\n`    | 行结束符                            |
| `writeBOM`  | `boolean`           | `false` | 是否添加 BOM，建议中文数据设为 true |

### 继承参数

该 hook 继承了 `useExport` 的所有参数：

| 参数           | 类型                              | 默认值    | 说明           |
| -------------- | --------------------------------- | --------- | -------------- |
| `maxPage`      | `number`                          | `100`     | 最大导出页数   |
| `interval`     | `number`                          | `300`     | 请求间隔毫秒数 |
| `pagination`   | `object`                          | -         | 分页配置       |
| `filters`      | `Record<string, any>`             | -         | 筛选条件       |
| `sorters`      | `Record<string, 'asc' \| 'desc'>` | -         | 排序条件       |
| `meta`         | `Record<string, any>`             | -         | 额外参数       |
| `providerName` | `string`                          | `default` | 数据提供者名称 |

## 返回值

| 字段        | 类型                | 说明           |
| ----------- | ------------------- | -------------- |
| `isLoading` | `Ref<boolean>`      | 是否正在导出中 |
| `trigger`   | `Function`          | 触发导出的方法 |
| `data`      | `Ref<InfiniteData>` | 导出的原始数据 |

## 基本导出示例

```vue
<script setup>
import { useExportCsv } from '@duxweb/dvha-core'

const { isLoading, trigger } = useExportCsv({
  path: 'users',
  filename: 'user-list.csv',
  csvOptions: {
    writeBOM: true // 支持中文显示
  }
})

function handleExport() {
  trigger()
}
</script>

<template>
  <button
    :disabled="isLoading"
    class="btn-primary"
    @click="handleExport"
  >
    {{ isLoading ? '导出中...' : '导出用户数据' }}
  </button>
</template>
```

## 指定字段导出

```js
import { useExportCsv } from '@duxweb/dvha-core'

// 只导出指定字段
const { isLoading, trigger } = useExportCsv({
  path: 'orders',
  filename: 'orders.csv',
  headers: [
    'order_no',
    'customer_name',
    'amount',
    'status',
    'created_at'
  ],
  csvOptions: {
    delimiter: ',',
    writeBOM: true
  }
})
```

## 自定义 CSV 格式

```js
import { useExportCsv } from '@duxweb/dvha-core'

// 使用分号分隔（欧洲地区常用）
const { isLoading, trigger } = useExportCsv({
  path: 'products',
  filename: 'products.csv',
  csvOptions: {
    delimiter: ';', // 分号分隔
    quote: '"', // 双引号包装
    eol: '\r\n', // Windows 行结束符
    writeBOM: true // 支持特殊字符
  }
})
```

## 条件导出示例

```vue
<script setup>
import { useExportCsv } from '@duxweb/dvha-core'
import { ref } from 'vue'

const dateRange = ref({
  start: '2024-01-01',
  end: '2024-12-31'
})

const status = ref('active')

const { isLoading, trigger } = useExportCsv({
  path: 'users',
  filename: `users-${status.value}-${dateRange.value.start}.csv`,
  headers: ['id', 'name', 'email', 'status', 'created_at'],
  filters: {
    status: status.value,
    created_at: {
      gte: dateRange.value.start,
      lte: dateRange.value.end
    }
  },
  pagination: {
    pageSize: 500 // 大页面提高导出效率
  },
  csvOptions: {
    writeBOM: true
  },
  onSuccess: () => {
    console.log('用户数据导出完成')
  },
  onError: (error) => {
    alert(`导出失败: ${error.message}`)
  }
})

function handleExport() {
  trigger()
}
</script>

<template>
  <div class="export-form">
    <!-- 筛选条件 -->
    <div class="filters">
      <select v-model="status">
        <option value="active">
          活跃用户
        </option>
        <option value="inactive">
          非活跃用户
        </option>
        <option value="">
          全部用户
        </option>
      </select>

      <input
        v-model="dateRange.start"
        type="date"
        placeholder="开始日期"
      >
      <input
        v-model="dateRange.end"
        type="date"
        placeholder="结束日期"
      >
    </div>

    <!-- 导出按钮 -->
    <button
      :disabled="isLoading"
      class="export-button"
      @click="handleExport"
    >
      {{ isLoading ? '导出中...' : '导出 CSV' }}
    </button>
  </div>
</template>
```

## 大数据量导出

```js
import { useExportCsv } from '@duxweb/dvha-core'

// 导出大量数据时的优化配置
const { isLoading, trigger } = useExportCsv({
  path: 'big-dataset',
  filename: 'large-export.csv',
  maxPage: 200, // 增加页数限制
  interval: 100, // 减少请求间隔
  pagination: {
    pageSize: 1000 // 增大页面大小
  },
  csvOptions: {
    writeBOM: true
  },
  onSuccess: () => {
    console.log('大数据集导出完成')
  },
  onError: (error) => {
    console.error('导出失败:', error)
  }
})
```

## 错误处理

```js
import { useExportCsv } from '@duxweb/dvha-core'

const { isLoading, trigger } = useExportCsv({
  path: 'users',
  filename: 'users.csv',
  onError: (error) => {
    // 处理不同类型的错误
    switch (error.status) {
      case 400:
        alert('没有数据可导出')
        break
      case 500:
        alert('CSV 生成失败，请重试')
        break
      default:
        alert(`导出失败: ${error.message}`)
    }
  }
})
```

## 注意事项

1. **中文支持**：设置 `csvOptions.writeBOM: true` 以确保 Excel 正确显示中文
2. **大数据量**：适当增加 `pagination.pageSize` 和调整 `interval` 来优化性能
3. **字段选择**：使用 `headers` 参数可以显著减小文件大小
4. **文件命名**：建议在文件名中包含时间戳以避免重复
5. **错误处理**：务必提供 `onError` 回调来处理导出失败的情况

## 最佳实践

```js
// 推荐的配置示例
const { isLoading, trigger } = useExportCsv({
  path: 'users',
  filename: `users-${new Date().toISOString().split('T')[0]}.csv`,
  headers: ['id', 'name', 'email', 'status', 'created_at'], // 明确指定字段
  pagination: {
    pageSize: 500 // 平衡性能和内存使用
  },
  csvOptions: {
    writeBOM: true, // 支持中文
    delimiter: ',', // 标准分隔符
  },
  onSuccess: () => {
    // 导出成功提示
    showNotification('数据导出成功', 'success')
  },
  onError: (error) => {
    // 统一错误处理
    showNotification(`导出失败: ${error.message}`, 'error')
  }
})
```
