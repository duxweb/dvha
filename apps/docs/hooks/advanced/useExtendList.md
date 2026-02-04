# useExtendList

`useExtendList` hook 是 `useList` 的扩展版本，在基础列表功能基础上增加了选中管理、批量导出、批量导入等高级功能。

## 功能特点

- 📋 **完整列表功能** - 继承 `useList` 的所有功能
- ✅ **选中管理** - 提供行选中、全选、反选功能
- 📤 **批量导出** - 支持导出全部数据或选中数据
- 📥 **批量导入** - 支持 CSV 文件导入功能
- 🧩 **批量操作** - 内置批量接口调用封装
- ⏱️ **自动刷新** - 内置自动刷新倒计时
- 📄 **智能分页** - 动态计算分页大小选项
- 🔄 **状态管理** - 提供完整的加载、选中状态管理
- ⚡ **进度反馈** - 导入导出进度实时反馈

## 接口关系

该hook内部使用 `useList`、`useExportCsv` 和 `useImportCsv` hooks。

```typescript
// 参数接口
interface UseExtendListProps {
  path: string // API 路径
  key?: string | number // 数据项唯一标识字段
  totalField?: string // 总数字段名
  filters?: MaybeRef<Record<string, any>> // 筛选条件
  sorters?: MaybeRef<Record<string, 'asc' | 'desc'>> // 排序条件
  expanded?: boolean // 是否展开
  pagination?: boolean | IListPagination // 分页配置
  exportFilename?: string // 导出文件名
  exportMaxPage?: number // 导出最大页数
  batchPath?: string // 批量接口路径
  total?: (data?: IDataProviderResponse) => number // 总数计算函数
  onExportSuccess?: (data?: IDataProviderResponse) => void // 导出成功回调
  onExportProgress?: (data?: IDataProviderPagination) => void // 导出进度回调
  onExportError?: (error?: IDataProviderError) => void // 导出错误回调
  onImportSuccess?: (progress?: IImportProgress) => void // 导入成功回调
  onImportProgress?: (progress?: IImportProgress) => void // 导入进度回调
  onImportError?: (error?: IDataProviderError) => void // 导入错误回调
  onBatchSuccess?: (data?: IDataProviderResponse) => void // 批量操作成功回调
  onBatchError?: (error?: IDataProviderError) => void // 批量操作错误回调
}

// 分页接口
interface IListPagination {
  page: number // 当前页码
  pageSize: number // 每页数量
}
```

## 使用方法

```js
import { useExtendList } from '@duxweb/dvha-core'

const {
  list,
  isLoading,
  checkeds,
  onExport,
  onImport,
  toggleChecked
} = useExtendList({
  path: 'users'
})
```

## 常用参数

```js
const {
  list,
  isLoading,
  checkeds,
  isAllChecked,
  onExport,
  onImport,
  onRefresh
} = useExtendList({
  // 基础配置
  path: 'users', // API 路径
  key: 'id', // 数据项唯一标识，默认为 'id'
  totalField: 'total', // 总数字段名，默认为 'total'

  // 查询配置
  filters: { // 筛选条件
    status: 'active',
    role: 'user'
  },
  sorters: { // 排序条件
    created_at: 'desc'
  },

  // 分页配置
  pagination: { // 分页设置
    page: 1,
    pageSize: 20
  },

  // 导出配置
  exportFilename: 'users.csv', // 导出文件名
  exportMaxPage: 10, // 导出最大页数

  // 回调函数
  onExportSuccess: (data) => { // 导出成功
    console.log('导出成功:', data)
  },
  onExportProgress: (progress) => { // 导出进度
    console.log('导出进度:', progress)
  },
  onImportSuccess: (progress) => { // 导入成功
    console.log('导入成功:', progress)
    onRefresh() // 刷新列表
  }
})
```

## 参数说明

| 参数               | 类型                              | 必需 | 说明                     |
| ------------------ | --------------------------------- | ---- | ------------------------ |
| `path`             | `string`                          | ✅   | API 资源路径             |
| `key`              | `string \| number`                | ❌   | 数据项唯一标识，默认'id' |
| `totalField`       | `string`                          | ❌   | 总数字段名，默认'total'  |
| `filters`          | `Record<string, any>`             | ❌   | 筛选条件                 |
| `sorters`          | `Record<string, 'asc' \| 'desc'>` | ❌   | 排序条件                 |
| `pagination`       | `boolean \| IListPagination`      | ❌   | 分页配置                 |
| `exportFilename`   | `string`                          | ❌   | 导出文件名               |
| `exportMaxPage`    | `number`                          | ❌   | 导出最大页数             |
| `batchPath`        | `string`                          | ❌   | 批量接口路径             |
| `onExportSuccess`  | `Function`                        | ❌   | 导出成功回调             |
| `onExportProgress` | `Function`                        | ❌   | 导出进度回调             |
| `onExportError`    | `Function`                        | ❌   | 导出错误回调             |
| `onImportSuccess`  | `Function`                        | ❌   | 导入成功回调             |
| `onImportProgress` | `Function`                        | ❌   | 导入进度回调             |
| `onImportError`    | `Function`                        | ❌   | 导入错误回调             |
| `onBatchSuccess`   | `Function`                        | ❌   | 批量操作成功回调         |
| `onBatchError`     | `Function`                        | ❌   | 批量操作错误回调         |

## 返回值

| 字段              | 类型                   | 说明                 |
| ----------------- | ---------------------- | -------------------- |
| `list`            | `ComputedRef<any[]>`   | 列表数据             |
| `meta`            | `ComputedRef<object>`  | 元数据信息           |
| `total`           | `ComputedRef<number>`  | 总数                 |
| `isLoading`       | `Ref<boolean>`         | 是否加载中           |
| `checkeds`        | `Ref<Array>`           | 已选中的项目ID列表   |
| `isAllChecked`    | `ComputedRef<boolean>` | 是否全选             |
| `isIndeterminate` | `ComputedRef<boolean>` | 是否部分选中         |
| `pagination`      | `Ref<object>`          | 分页配置             |
| `pageCount`       | `ComputedRef<number>`  | 总页数               |
| `page`            | `ComputedRef<number>`  | 当前页码             |
| `pageSize`        | `ComputedRef<number>`  | 当前每页数量         |
| `pageSizes`       | `number[]`             | 可选分页数           |
| `onUpdatePage`    | `Function`             | 更新当前页           |
| `onUpdatePageSize`| `Function`             | 更新每页数量         |
| `toggleChecked`   | `Function`             | 切换项目选中状态     |
| `toggleSelectAll` | `Function`             | 切换全选状态         |
| `isChecked`       | `Function`             | 检查项目是否选中     |
| `onUpdateChecked` | `Function`             | 更新选中列表         |
| `onRefresh`       | `Function`             | 刷新列表             |
| `onExport`        | `Function`             | 导出全部数据         |
| `onExportRows`    | `Function`             | 导出选中数据         |
| `onImport`        | `Function`             | 打开导入文件选择器   |
| `isExporting`     | `Ref<boolean>`         | 是否正在导出全部数据 |
| `isExportingRows` | `Ref<boolean>`         | 是否正在导出选中数据 |
| `isImporting`     | `Ref<boolean>`         | 是否正在导入         |
| `autoRefetch`     | `Ref<boolean>`         | 是否自动刷新         |
| `onAutoRefetch`   | `Function`             | 切换自动刷新         |
| `autoCountdown`   | `Ref<number>`          | 自动刷新倒计时       |
| `onBatch`         | `Function`             | 批量操作方法         |
| `isBatching`      | `Ref<boolean>`         | 是否正在批量操作     |

## 基础使用示例

```js
import { useExtendList } from '@duxweb/dvha-core'

const {
  list,
  isLoading,
  checkeds,
  isAllChecked,
  toggleChecked,
  toggleSelectAll,
  onRefresh
} = useExtendList({
  path: 'users',
  pagination: {
    page: 1,
    pageSize: 20
  }
})

// 处理行选中
function handleRowCheck(id) {
  toggleChecked(id)
}

// 处理全选
function handleSelectAll() {
  toggleSelectAll()
}

// 刷新列表
function handleRefresh() {
  onRefresh()
}
```

## 导出功能示例

```js
import { useExtendList } from '@duxweb/dvha-core'
import { ElMessage } from 'element-plus'

const {
  list,
  checkeds,
  onExport,
  onExportRows,
  isExporting,
  isExportingRows
} = useExtendList({
  path: 'users',
  exportFilename: 'users.csv',
  exportMaxPage: 20,
  onExportSuccess: (data) => {
    ElMessage.success('导出成功')
  },
  onExportProgress: (progress) => {
    console.log(`导出进度: ${progress.page}/${progress.totalPage}`)
  },
  onExportError: (error) => {
    ElMessage.error(`导出失败: ${error.message}`)
  }
})

// 导出全部数据
function handleExportAll() {
  onExport()
}

// 导出选中数据
function handleExportSelected() {
  if (checkeds.value.length === 0) {
    ElMessage.warning('请先选择要导出的数据')
    return
  }
  onExportRows()
}
```

## 导入功能示例

```js
import { useExtendList } from '@duxweb/dvha-core'
import { ElMessage } from 'element-plus'

const {
  onImport,
  onRefresh,
  isImporting
} = useExtendList({
  path: 'users',
  onImportSuccess: (progress) => {
    ElMessage.success(`导入成功，共处理 ${progress.processed} 条记录`)
    onRefresh() // 刷新列表
  },
  onImportProgress: (progress) => {
    console.log(`导入进度: ${progress.processed}/${progress.total}`)
  },
  onImportError: (error) => {
    ElMessage.error(`导入失败: ${error.message}`)
  }
})

// 打开文件选择器导入
function handleImport() {
  onImport()
}
```

## 搜索筛选示例

```js
import { useExtendList } from '@duxweb/dvha-core'
import { ref, watch } from 'vue'

const searchForm = ref({
  name: '',
  status: '',
  role: ''
})

const {
  list,
  isLoading,
  onUpdateFilters,
  onRefresh
} = useExtendList({
  path: 'users',
  filters: searchForm.value
})

// 监听搜索条件变化
watch(searchForm, (newFilters) => {
  onUpdateFilters(newFilters)
}, { deep: true })

// 重置搜索
function handleReset() {
  searchForm.value = {
    name: '',
    status: '',
    role: ''
  }
}
```

## 分页管理示例

```js
import { useExtendList } from '@duxweb/dvha-core'

const {
  list,
  pagination,
  pageCount,
  total,
  currentPageSizes,
  onUpdatePage,
  onUpdatePageSize
} = useExtendList({
  path: 'users',
  pagination: {
    page: 1,
    pageSize: 20
  }
})

// 切换页码
function handlePageChange(page) {
  onUpdatePage(page)
}

// 切换每页数量
function handlePageSizeChange(pageSize) {
  onUpdatePageSize(pageSize)
}
```

## 完整示例

```vue
<script setup lang="ts">
import { useExtendList } from '@duxweb/dvha-core'
import { ref } from 'vue'

const searchForm = ref({
  name: '',
  status: 'all'
})

const {
  list,
  isLoading,
  checkeds,
  isAllChecked,
  isIndeterminate,
  pagination,
  total,
  pageCount,
  toggleChecked,
  toggleSelectAll,
  isChecked,
  onUpdateFilters,
  onUpdatePage,
  onUpdatePageSize,
  onRefresh,
  onExport,
  onExportRows,
  onImport,
  isExporting,
  isExportingRows,
  isImporting
} = useExtendList({
  path: 'users',
  pagination: {
    page: 1,
    pageSize: 20
  },
  exportFilename: 'users.csv',
  onExportSuccess: () => {
    console.log('导出成功')
  },
  onImportSuccess: () => {
    console.log('导入成功')
    onRefresh()
  }
})

function handleSearch() {
  onUpdateFilters(searchForm.value)
}

function handleExportSelected() {
  if (checkeds.value.length === 0) {
    alert('请选择要导出的数据')
    return
  }
  onExportRows()
}
</script>

<template>
  <div>
    <!-- 搜索表单 -->
    <div class="search-form">
      <input v-model="searchForm.name" placeholder="搜索姓名">
      <select v-model="searchForm.status">
        <option value="all">
          全部状态
        </option>
        <option value="active">
          激活
        </option>
        <option value="inactive">
          未激活
        </option>
      </select>
      <button @click="handleSearch">
        搜索
      </button>
      <button @click="onRefresh">
        刷新
      </button>
    </div>

    <!-- 操作栏 -->
    <div class="toolbar">
      <button
        :disabled="isExporting"
        @click="onExport"
      >
        {{ isExporting ? '导出中...' : '导出全部' }}
      </button>
      <button
        :disabled="isExportingRows || checkeds.length === 0"
        @click="handleExportSelected"
      >
        {{ isExportingRows ? '导出中...' : '导出选中' }}
      </button>
      <button
        :disabled="isImporting"
        @click="onImport"
      >
        {{ isImporting ? '导入中...' : '导入数据' }}
      </button>
      <span>已选择 {{ checkeds.length }} 项</span>
    </div>

    <!-- 数据表格 -->
    <table v-loading="isLoading">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              :checked="isAllChecked"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
            >
          </th>
          <th>ID</th>
          <th>姓名</th>
          <th>邮箱</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>
            <input
              type="checkbox"
              :checked="isChecked(item.id)"
              @change="() => toggleChecked(item.id)"
            >
          </td>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div class="pagination">
      <span>共 {{ total }} 条记录</span>
      <button
        v-for="page in pageCount"
        :key="page"
        :class="{ active: pagination.page === page }"
        @click="() => onUpdatePage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>
```
