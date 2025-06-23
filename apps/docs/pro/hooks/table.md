# 表格 Hooks

DVHA Pro 提供了表格相关的 Hooks，包括数据管理和列渲染功能。

# useTable - 表格数据管理

`useTable` 是 DVHA Pro 提供的表格数据管理 Hook，基于 `useNaiveTable` 和 `useExtendList` 构建，提供完整的表格功能支持，包括数据获取、分页、排序、过滤、选择、导入导出等功能。

## 特性

- **自动数据获取**: 基于 `useExtendList` 的数据获取和分页
- **列管理**: 支持列的显示/隐藏控制
- **行选择**: 支持单选和多选功能
- **排序过滤**: 支持表格排序和过滤
- **导入导出**: 内置导入导出功能和进度提示
- **国际化支持**: 内置多语言提示信息

## 基础用法

### 导入

```js
import { useTable } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const table = useTable({
  path: '/api/users',
  columns: [
    { title: 'ID', key: 'id', width: 80 },
    { title: '用户名', key: 'username' },
    { title: '邮箱', key: 'email' },
    { title: '状态', key: 'status' }
  ]
})

// 获取表格数据和状态
const {
  list, // 表格数据
  isLoading, // 加载状态
  table, // 表格属性
  tablePagination // 分页属性
} = table
```

## 配置选项

### UseTableProps

继承自 `UseExtendListProps`，并扩展了表格特有的属性：

```typescript
interface UseTableProps extends Omit<UseExtendListProps, 'key'> {
  key?: TableColumnKey
  columns: TableColumn[]
}
```

### 列配置 (columns)

表格列配置，支持 Naive UI DataTable 的所有列类型：

```typescript
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
    show: true, // 控制列显示/隐藏
    sorter: true // 启用排序
  },
  {
    title: '用户名',
    key: 'username',
    render: row => h('span', { class: 'font-semibold' }, row.username)
  },
  {
    title: '状态',
    key: 'status',
    filterOptions: [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' }
    ],
    filter: true
  }
]
```

## 完整示例

### 基础表格示例

```vue
<script setup>
import { useTable } from '@duxweb/dvha-pro'
import { NDataTable, NTag } from 'naive-ui'
import { h } from 'vue'

const table = useTable({
  path: '/api/users',
  columns: [
    {
      title: 'ID',
      key: 'id',
      width: 80,
      sorter: true
    },
    {
      title: '用户名',
      key: 'username',
      sorter: true
    },
    {
      title: '邮箱',
      key: 'email'
    },
    {
      title: '状态',
      key: 'status',
      render: row => h(NTag, {
        type: row.status === 'active' ? 'success' : 'error'
      }, row.status === 'active' ? '启用' : '禁用'),
      filterOptions: [
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      filter: true
    }
  ],
  filters: {
    // 默认过滤条件
    status: 'active'
  }
})

const { table: tableProps, tablePagination } = table
</script>

<template>
  <div>
    <NDataTable
      v-bind="tableProps"
      :pagination="tablePagination"
    />
  </div>
</template>
```

### 带列管理的表格

```vue
<script setup>
import { useTable } from '@duxweb/dvha-pro'
import { NButton, NDataTable, NPopselect } from 'naive-ui'

const table = useTable({
  path: '/api/users',
  columns: [
    { title: 'ID', key: 'id', width: 80 },
    { title: '用户名', key: 'username' },
    { title: '邮箱', key: 'email' },
    { title: '手机号', key: 'phone' },
    { title: '部门', key: 'department' },
    { title: '创建时间', key: 'created_at' }
  ]
})

const {
  table: tableProps,
  tablePagination,
  columnSelected,
  onUpdateColumnSelected,
  columns
} = table

// 列选择选项
const columnOptions = computed(() => {
  return columns.value
    .filter(col => 'title' in col && 'key' in col)
    .map(col => ({
      label: col.title,
      value: col.key
    }))
})
</script>

<template>
  <div>
    <!-- 列管理 -->
    <div class="mb-4 flex justify-end">
      <NPopselect
        v-model:value="columnSelected"
        :options="columnOptions"
        multiple
        @update:value="onUpdateColumnSelected"
      >
        <NButton>
          <template #icon>
            <i class="i-tabler:columns" />
          </template>
          列管理
        </NButton>
      </NPopselect>
    </div>

    <!-- 表格 -->
    <NDataTable
      v-bind="tableProps"
      :pagination="tablePagination"
    />
  </div>
</template>
```

### 带导入导出的表格

```vue
<script setup>
import { useTable } from '@duxweb/dvha-pro'
import { NButton, NDataTable, NSpace } from 'naive-ui'

const table = useTable({
  path: '/api/users',
  columns: [
    { title: 'ID', key: 'id' },
    { title: '用户名', key: 'username' },
    { title: '邮箱', key: 'email' }
  ]
})

const {
  table: tableProps,
  tablePagination,
  isExporting,
  isImporting,
  onExport,
  onImport
} = table

// 导出数据
function handleExport() {
  onExport()
}

// 导入数据
function handleImport(file) {
  onImport(file)
}
</script>

<template>
  <div>
    <!-- 工具栏 -->
    <div class="mb-4">
      <NSpace>
        <NButton
          :loading="isExporting"
          @click="handleExport"
        >
          <template #icon>
            <i class="i-tabler:download" />
          </template>
          导出数据
        </NButton>

        <NButton
          :loading="isImporting"
          @click="handleImport"
        >
          <template #icon>
            <i class="i-tabler:upload" />
          </template>
          导入数据
        </NButton>
      </NSpace>
    </div>

    <!-- 表格 -->
    <NDataTable
      v-bind="tableProps"
      :pagination="tablePagination"
    />
  </div>
</template>
```

## 高级用法

### 自定义过滤器

```typescript
const table = useTable({
  path: '/api/users',
  columns: [...],
  filters: {
    // 默认过滤条件
    status: 'active',
    department: 'tech'
  },
  // 自定义过滤器处理
  onUpdateFilters: (filters) => {
    console.log('过滤器更新:', filters)
  }
})
```

### 自定义排序

```typescript
const table = useTable({
  path: '/api/users',
  columns: [...],
  sorters: {
    // 默认排序
    created_at: 'desc'
  },
  // 自定义排序处理
  onUpdateSorters: (sorters) => {
    console.log('排序更新:', sorters)
  }
})
```

### 行选择处理

```typescript
const table = useTable({
  path: '/api/users',
  columns: [...],
  // 启用行选择
  checkable: true
})

const { checkeds, onUpdateCheckeds } = table

// 监听选择变化
watch(checkeds, (selectedKeys) => {
  console.log('选中的行:', selectedKeys)
})

// 批量操作
function batchDelete() {
  const selectedIds = checkeds.value
  if (selectedIds.length === 0) {
    message.warning('请选择要删除的数据')
    return
  }
  // 执行批量删除
}
```

## API 参考

### UseTableProps

继承 `UseExtendListProps` 的所有属性，并添加：

| 属性    | 类型           | 默认值 | 说明       |
| ------- | -------------- | ------ | ---------- |
| key     | TableColumnKey | -      | 行键字段   |
| columns | TableColumn[]  | []     | 表格列配置 |

### UseTableResult

继承 `useExtendList` 的所有返回值，并添加：

| 字段                   | 类型                           | 说明       |
| ---------------------- | ------------------------------ | ---------- |
| tablePagination        | ComputedRef\<PaginationProps\> | 分页属性   |
| table                  | ComputedRef\<DataTableProps\>  | 表格属性   |
| columns                | Ref\<TableColumn[]\>           | 表格列配置 |
| columnSelected         | ComputedRef\<string[]\>        | 选中的列   |
| onUpdateColumnSelected | (v: string[]) => void          | 更新列选择 |

### 继承的 useExtendList 属性

| 字段             | 类型           | 说明         |
| ---------------- | -------------- | ------------ |
| list             | Ref\<any[]\>   | 数据列表     |
| meta             | Ref\<any\>     | 元数据信息   |
| isLoading        | Ref\<boolean\> | 加载状态     |
| page             | Ref\<number\>  | 当前页码     |
| pageSize         | Ref\<number\>  | 每页大小     |
| pageCount        | Ref\<number\>  | 总页数       |
| checkeds         | Ref\<any[]\>   | 选中的数据   |
| isExporting      | Ref\<boolean\> | 导出状态     |
| isImporting      | Ref\<boolean\> | 导入状态     |
| onUpdatePage     | Function       | 更新页码     |
| onUpdatePageSize | Function       | 更新每页大小 |
| onExport         | Function       | 导出数据     |
| onImport         | Function       | 导入数据     |
| refetch          | Function       | 重新获取数据 |

## 导入导出功能

### 导出进度提示

Hook 内置了导出进度提示功能：

- **导出开始**: 显示圆形进度条和页面计数
- **导出成功**: 显示成功通知和导出数量
- **导出失败**: 显示错误信息

### 导入进度提示

Hook 内置了导入进度提示功能：

- **导入开始**: 显示圆形进度条和处理进度
- **导入成功**: 显示成功通知和处理数量
- **导入失败**: 显示错误信息

### 自定义导入导出

```typescript
const table = useTable({
  path: '/api/users',
  columns: [...],
  // 自定义导出成功回调
  onExportSuccess: (data) => {
    console.log('导出成功:', data)
  },
  // 自定义导出错误回调
  onExportError: (error) => {
    console.error('导出失败:', error)
  },
  // 自定义导入成功回调
  onImportSuccess: (progress) => {
    console.log('导入成功:', progress)
  },
  // 自定义导入错误回调
  onImportError: (error) => {
    console.error('导入失败:', error)
  }
})
```

## 最佳实践

### 1. 合理设计列结构

```typescript
// ✅ 推荐：合理设置列宽和属性
const columns = [
  { title: 'ID', key: 'id', width: 80 }, // 固定宽度
  { title: '用户名', key: 'username', minWidth: 120 }, // 最小宽度
  { title: '邮箱', key: 'email', ellipsis: true }, // 文本省略
  { title: '操作', key: 'actions', width: 150 } // 操作列固定宽度
]
```

### 2. 使用列管理功能

```typescript
// ✅ 推荐：为用户提供列管理功能
const { columnSelected, onUpdateColumnSelected } = table

// 在模板中提供列选择器
<NPopselect
  v-model:value="columnSelected"
  :options="columnOptions"
  multiple
  @update:value="onUpdateColumnSelected"
>
  列管理
</NPopselect>
```

### 3. 合理使用过滤和排序

```typescript
// ✅ 推荐：设置合理的默认过滤和排序
const table = useTable({
  filters: {
    status: 'active' // 默认只显示启用的数据
  },
  sorters: {
    created_at: 'desc' // 默认按创建时间倒序
  }
})
```

### 4. 处理大数据量

```typescript
// ✅ 推荐：设置合适的分页大小
const table = useTable({
  pagination: {
    pageSize: 20, // 适中的分页大小
    pageSizes: [10, 20, 50, 100]
  }
})
```

## 常见问题

### Q: 如何自定义表格的加载状态？

A: 可以通过 `isLoading` 状态自定义加载显示：

```vue
<template>
  <div>
    <div v-if="isLoading" class="text-center p-4">
      自定义加载中...
    </div>
    <NDataTable v-else v-bind="tableProps" />
  </div>
</template>
```

### Q: 如何处理表格的错误状态？

A: 可以监听 `useExtendList` 的错误状态：

```typescript
const { error, isError } = table

watch(isError, (hasError) => {
  if (hasError) {
    message.error('数据加载失败')
  }
})
```

### Q: 如何实现表格数据的实时更新？

A: 可以使用 `refetch` 方法或设置轮询：

```typescript
// 手动刷新
const { refetch } = table
refetch()

// 设置轮询
const table = useTable({
  polling: true,
  pollingInterval: 5000
})
```

### Q: 如何自定义导入导出的文件格式？

A: 可以通过回调函数处理：

```typescript
const table = useTable({
  onExportSuccess: (data) => {
    // 自定义导出数据处理
    const csvData = convertToCSV(data)
    downloadFile(csvData, 'users.csv')
  }
})
```

# useTableColumn - 表格列渲染器

`useTableColumn` 是 DVHA Pro 提供的表格列渲染器 Hook，提供了8种预设的列渲染功能，用于简化表格列的显示和交互逻辑。

## 特性

- **8种渲染器**: 提供媒体、图片、开关、状态、映射、输入、复制、隐藏等渲染器
- **统一管理**: 集中管理所有列渲染器的配置和路径
- **类型安全**: 完整的 TypeScript 类型定义
- **业务集成**: 内置与后端 API 的交互逻辑

## 基础用法

### 导入

```typescript
import { useTableColumn } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const column = useTableColumn({
  path: '/api/users', // API 路径
  rowKey: 'id' // 行键字段
})

const {
  renderMedia, // 媒体渲染器
  renderImage, // 图片渲染器
  renderSwitch, // 开关渲染器
  renderStatus, // 状态渲染器
  renderMap, // 映射渲染器
  renderInput, // 输入渲染器
  renderCopy, // 复制渲染器
  renderHidden // 隐藏渲染器
} = column
```

## 渲染器详解

### renderMedia - 媒体渲染器

用于渲染媒体信息（头像、标题、描述）：

```typescript
const columns = [
  {
    title: '用户信息',
    key: 'user',
    render: renderMedia({
      title: 'name', // 标题字段
      desc: 'email', // 描述字段
      image: 'avatar', // 图片字段
      avatar: true, // 是否显示为头像
      imageWidth: 40, // 图片宽度
      imageHeight: 40 // 图片高度
    })
  }
]
```

### renderImage - 图片渲染器

用于渲染图片列：

```typescript
const columns = [
  {
    title: '头像',
    key: 'avatar',
    render: renderImage({
      key: 'avatar', // 图片字段
      width: 50, // 图片宽度
      height: 50, // 图片高度
      preview: true // 是否支持预览
    })
  }
]
```

### renderSwitch - 开关渲染器

用于渲染可切换的开关控件：

```typescript
const columns = [
  {
    title: '状态',
    key: 'status',
    render: renderSwitch({
      key: 'status', // 状态字段
      onChange: (value, rowData) => {
        console.log('状态切换:', value, rowData)
      }
    })
  }
]
```

### renderStatus - 状态渲染器

用于渲染状态标签：

```typescript
const columns = [
  {
    title: '状态',
    key: 'status',
    render: renderStatus({
      map: {
        active: { label: '启用', type: 'success' },
        inactive: { label: '禁用', type: 'error' },
        pending: { label: '待审核', type: 'warning' }
      }
    })
  }
]
```

### renderMap - 映射渲染器

用于渲染多个映射字段：

```typescript
const columns = [
  {
    title: '详细信息',
    key: 'details',
    render: renderMap({
      maps: [
        {
          key: 'email',
          label: '邮箱',
          icon: 'i-tabler:mail'
        },
        {
          key: 'phone',
          label: '电话',
          icon: 'i-tabler:phone'
        },
        {
          key: 'address',
          label: '地址',
          icon: 'i-tabler:map-pin',
          render: value => value || '未填写'
        }
      ]
    })
  }
]
```

### renderInput - 输入渲染器

用于渲染可编辑的输入框：

```typescript
const columns = [
  {
    title: '备注',
    key: 'remark',
    render: renderInput({
      key: 'remark', // 字段名
      tag: NInput, // 输入组件
      onChange: (value, rowData) => {
        // 处理输入变化
      }
    })
  }
]
```

### renderCopy - 复制渲染器

用于渲染带复制功能的文本：

```typescript
const columns = [
  {
    title: 'ID',
    key: 'id',
    render: renderCopy({
      key: 'id', // 复制的字段
      format: value => `#${value}` // 格式化显示
    })
  }
]
```

### renderHidden - 隐藏渲染器

用于渲染可切换显示的隐藏文本：

```typescript
const columns = [
  {
    title: '密码',
    key: 'password',
    render: renderHidden({
      key: 'password', // 隐藏的字段
      percent: 30 // 显示的字符百分比
    })
  }
]
```

## 完整示例

### 用户管理表格

```vue
<script setup>
import { useTable, useTableColumn } from '@duxweb/dvha-pro'
import { NDataTable } from 'naive-ui'

const column = useTableColumn({
  path: '/api/users',
  rowKey: 'id'
})

const {
  renderMedia,
  renderSwitch,
  renderStatus,
  renderMap,
  renderCopy,
  renderHidden
} = column

const table = useTable({
  path: '/api/users',
  columns: [
    {
      title: 'ID',
      key: 'id',
      width: 80,
      render: renderCopy({ key: 'id' })
    },
    {
      title: '用户信息',
      key: 'user',
      render: renderMedia({
        title: 'name',
        desc: 'email',
        image: 'avatar',
        avatar: true
      })
    },
    {
      title: '联系方式',
      key: 'contact',
      render: renderMap({
        maps: [
          {
            key: 'phone',
            label: '电话',
            icon: 'i-tabler:phone'
          },
          {
            key: 'address',
            label: '地址',
            icon: 'i-tabler:map-pin'
          }
        ]
      })
    },
    {
      title: '状态',
      key: 'status',
      render: renderStatus({
        map: {
          active: { label: '启用', type: 'success' },
          inactive: { label: '禁用', type: 'error' }
        }
      })
    },
    {
      title: '启用',
      key: 'enabled',
      render: renderSwitch({ key: 'enabled' })
    },
    {
      title: '密码',
      key: 'password',
      render: renderHidden({
        key: 'password',
        percent: 20
      })
    }
  ]
})

const { table: tableProps, tablePagination } = table
</script>

<template>
  <NDataTable
    v-bind="tableProps"
    :pagination="tablePagination"
  />
</template>
```

### 商品管理表格

```vue
<script setup>
import { useTable, useTableColumn } from '@duxweb/dvha-pro'
import { NDataTable, NInputNumber } from 'naive-ui'

const column = useTableColumn({
  path: '/api/products',
  rowKey: 'id'
})

const {
  renderImage,
  renderInput,
  renderStatus,
  renderSwitch
} = column

const table = useTable({
  path: '/api/products',
  columns: [
    {
      title: '商品图片',
      key: 'image',
      width: 80,
      render: renderImage({
        key: 'image',
        width: 60,
        height: 60,
        preview: true
      })
    },
    {
      title: '商品名称',
      key: 'name'
    },
    {
      title: '价格',
      key: 'price',
      render: renderInput({
        key: 'price',
        tag: NInputNumber,
        precision: 2,
        min: 0
      })
    },
    {
      title: '状态',
      key: 'status',
      render: renderStatus({
        map: {
          published: { label: '已发布', type: 'success' },
          draft: { label: '草稿', type: 'warning' },
          archived: { label: '已归档', type: 'error' }
        }
      })
    },
    {
      title: '上架',
      key: 'is_active',
      render: renderSwitch({ key: 'is_active' })
    }
  ]
})

const { table: tableProps, tablePagination } = table
</script>

<template>
  <NDataTable
    v-bind="tableProps"
    :pagination="tablePagination"
  />
</template>
```

## API 参考

### UseTableColumnProps

| 属性   | 类型                                                   | 默认值 | 说明     |
| ------ | ------------------------------------------------------ | ------ | -------- |
| rowKey | string                                                 | 'id'   | 行键字段 |
| path   | string | ((rowData: Record<string, any>) => string) | -      | API 路径 |

### UseTableColumnResult

| 方法         | 类型     | 说明       |
| ------------ | -------- | ---------- |
| renderMedia  | Function | 媒体渲染器 |
| renderImage  | Function | 图片渲染器 |
| renderSwitch | Function | 开关渲染器 |
| renderStatus | Function | 状态渲染器 |
| renderMap    | Function | 映射渲染器 |
| renderInput  | Function | 输入渲染器 |
| renderCopy   | Function | 复制渲染器 |
| renderHidden | Function | 隐藏渲染器 |

## 最佳实践

### 1. 合理选择渲染器

```typescript
// ✅ 推荐：根据数据类型选择合适的渲染器
const columns = [
  // 用户信息使用媒体渲染器
  { title: '用户', render: renderMedia({ title: 'name', image: 'avatar' }) },

  // 状态字段使用状态渲染器
  { title: '状态', render: renderStatus({ map: statusMap }) },

  // 开关字段使用开关渲染器
  { title: '启用', render: renderSwitch({ key: 'enabled' }) },

  // 敏感信息使用隐藏渲染器
  { title: '密码', render: renderHidden({ key: 'password' }) }
]
```

### 2. 统一配置管理

```typescript
// ✅ 推荐：统一配置渲染器
const column = useTableColumn({
  path: '/api/users',
  rowKey: 'id'
})

// 复用渲染器配置
const statusRenderer = renderStatus({
  map: {
    active: { label: '启用', type: 'success' },
    inactive: { label: '禁用', type: 'error' }
  }
})
```

### 3. 处理数据更新

```typescript
// ✅ 推荐：正确处理数据更新
const switchRenderer = renderSwitch({
  key: 'enabled',
  onChange: async (value, rowData) => {
    try {
      await updateUserStatus(rowData.id, value)
      message.success('状态更新成功')
      // 刷新表格数据
      table.refetch()
    }
    catch (error) {
      message.error('状态更新失败')
      // 恢复原状态
      rowData.enabled = !value
    }
  }
})
```

## 常见问题

### Q: 如何自定义渲染器的样式？

A: 可以通过 CSS 类或内联样式自定义：

```typescript
const customRenderer = renderStatus({
  map: {
    active: {
      label: '启用',
      type: 'success',
      class: 'custom-status-active'
    }
  }
})
```

### Q: 如何处理渲染器的异步操作？

A: 在回调函数中使用 async/await：

```typescript
const switchRenderer = renderSwitch({
  key: 'enabled',
  onChange: async (value, rowData) => {
    const loading = message.loading('更新中...', 0)
    try {
      await api.updateStatus(rowData.id, value)
      message.success('更新成功')
    }
    catch (error) {
      message.error('更新失败')
      rowData.enabled = !value // 恢复状态
    }
    finally {
      loading.destroy()
    }
  }
})
```

### Q: 如何扩展自定义渲染器？

A: 可以创建自定义的渲染函数：

```typescript
function useCustomRenderer() {
  const renderCustom = (props) => {
    return (rowData, rowIndex) => {
      return h('div', {
        class: 'custom-renderer'
      }, props.format(rowData[props.key]))
    }
  }

  return { renderCustom }
}
```
