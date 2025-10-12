# 表格组件

表格组件提供了完整的表格解决方案，基于 Naive UI 的 DataTable 组件进行封装，提供高级功能如数据管理、导入导出、选择等。

## 导入

```typescript
import {
  DuxTable,
  DuxTablePage,
  DuxTableFilter,
  DuxTableLayout,
  DuxTableTools
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下表格组件：

- **DuxTable** - 基础表格组件
- **DuxTablePage** - 完整的表格页面组件
- **DuxTableLayout** - 表格布局组件
- **DuxTableFilter** - 表格过滤器组件
- **DuxTableTools** - 表格工具栏组件

## DuxTable 基础表格

基础表格组件，提供数据绑定和分页功能。

### 属性

| 属性名     | 类型                               | 默认值 | 说明           |
| ---------- | ---------------------------------- | ------ | -------------- |
| path       | string                             | -      | 数据接口路径   |
| filter     | Record<string, any>                | -      | 筛选条件       |
| columns    | TableColumn[]                      | -      | 表格列配置     |
| pagination | boolean \| TablePagination         | true   | 分页配置       |

**继承自 NDataTable 的所有属性**

### 基础用法

```vue
<script setup>
import { DuxTable } from '@duxweb/dvha-pro'

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' }
]
</script>

<template>
  <DuxTable
    path="/api/users"
    :columns="columns"
    :pagination="{ pageSize: 10 }"
  />
</template>
```

### 实时筛选：filterReactive

当需要外部筛选变更即刻生效（无需点击查询按钮）时，使用 `filterReactive`。当该对象的值变化时：

- 将其键浅合并到已生效的筛选条件中；
- 当某键值为 `null`、`undefined` 或空字符串 `''` 时，会移除该筛选键；
- 重置页码到 1 并自动刷新数据；
- 查询/重置按钮会先应用 `filter`，再叠加 `filterReactive`，以确保实时筛选始终有效。

示例：

```vue
<script setup>
import { DuxTableLayout } from '@duxweb/dvha-pro'
import { NDataTable, NInput, NSelect } from 'naive-ui'
import { ref } from 'vue'

// 需要点击“查询”后才生效的筛选
const filter = ref({ keyword: '' })

// 实时生效的筛选（例如状态、组织联动等）
const filterReactive = ref({ status: '', orgId: undefined })

const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名', width: 150 },
]

const filterSchema = [
  {
    tag: NInput,
    title: '关键词',
    attrs: {
      'v-model:value': [filter.value, 'keyword'],
      placeholder: '请输入关键词'
    }
  },
  {
    tag: NSelect,
    title: '状态',
    attrs: {
      'v-model:value': [filterReactive.value, 'status'],
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]
</script>

<template>
  <DuxTableLayout
    path="/api/users"
    :filter="filter"
    :filter-reactive="filterReactive"
    :filter-schema="filterSchema"
    :columns="columns"
  >
    <template #default="{ table, width }">
      <NDataTable v-bind="table" :scroll-x="width" />
    </template>
  </DuxTableLayout>
</template>
```

## DuxTablePage 表格页面

完整的表格页面组件，内置了表格布局、分页、筛选、操作等功能。

### 属性

| 属性名     | 类型           | 默认值 | 说明                  |
| ---------- | -------------- | ------ | --------------------- |
| tableProps | DataTableProps | -      | Naive UI 表格组件属性 |

**继承自 DuxTableLayout 的所有属性**

### 插槽

| 插槽名    | 说明     | 参数                 |
| --------- | -------- | -------------------- |
| default   | 表格内容 | `TablePageSlotProps` |
| bottom    | 底部内容 | -                    |
| tools     | 工具栏   | -                    |
| actions   | 操作按钮 | -                    |
| sideLeft  | 左侧边栏 | -                    |
| sideRight | 右侧边栏 | -                    |

### TablePageSlotProps 接口

该接口继承自表格布局的所有属性，包含表格操作相关的方法和状态。

```typescript
interface TablePageSlotProps {
  // 数据相关
  list: any[] // 表格数据
  meta: any // 分页信息
  isLoading: boolean // 加载状态

  // 分页相关
  page: number // 当前页码
  pageSize: number // 每页数量
  pageCount: number // 总页数
  pageSizes: number[] // 页面大小选项
  onUpdatePage: (page: number) => void
  onUpdatePageSize: (size: number) => void

  // 选择相关
  checkeds: any[] // 选中项
  onUpdateChecked: (keys: any[]) => void

  // 列相关
  columns: TableColumn[] // 表格列配置
  columnSelected: string[] // 选中的列
  onUpdateColumnSelected: (keys: string[]) => void

  // 导入导出
  isExporting: boolean // 导出状态
  isExportingRows: boolean // 导出选中行状态
  isImporting: boolean // 导入状态
  onExport: () => void // 导出全部
  onExportRows: () => void // 导出选中行
  onImport: () => void // 导入数据

  // 刷新相关
  autoRefetch: boolean // 自动刷新状态
  autoCountdown: number // 自动刷新倒计时
  onAutoRefetch: () => void // 切换自动刷新

  // 表格属性
  table: DataTableProps // Naive UI 表格属性
  tablePagination: PaginationProps // 分页属性
  width: number // 表格宽度
}
```

### 基础用法

```vue
<script setup>
import { DuxTablePage } from '@duxweb/dvha-pro'
import { NInput, NSelect } from 'naive-ui'
import { ref } from 'vue'

const filters = ref({
  status: '',
  keyword: ''
})

const columns = [
  {
    key: 'id',
    title: 'ID',
    width: 80
  },
  {
    key: 'name',
    title: '姓名',
    width: 150
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (rowData) => {
      return rowData.status === 'active' ? '启用' : '禁用'
    }
  }
]

const filterSchema = [
  {
    tag: NInput,
    title: '关键词',
    attrs: {
      'v-model:value': [filters.value, 'keyword'],
      'placeholder': '请输入关键词'
    }
  },
  {
    tag: NSelect,
    title: '状态',
    attrs: {
      'v-model:value': [filters.value, 'status'],
      'options': [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    }
  }
]

const actions = [
  {
    label: '创建用户',
    type: 'link',
    path: '/users/create',
    icon: 'i-tabler:plus'
  }
]
</script>

<template>
  <DuxTablePage
    path="/api/users"
    :filter="filters"
    :filter-schema="filterSchema"
    :columns="columns"
    :actions="actions"
    :pagination="true"
  />
</template>
```

### 自定义表格内容

```vue
<template>
  <DuxTablePage
    path="/api/users"
    :filter="filters"
    :filter-schema="filterSchema"
    :columns="columns"
    :actions="actions"
  >
    <template #default="{ list, isLoading, checkeds, onUpdateChecked }">
      <!-- 自定义表格渲染 -->
      <n-data-table
        :data="list"
        :columns="columns"
        :loading="isLoading"
        :checked-row-keys="checkeds"
        row-key="id"
        remote
        @update:checked-row-keys="onUpdateChecked"
      />
    </template>

    <template #tools>
      <n-button secondary>
        <template #icon>
          <i class="i-tabler:download" />
        </template>
        导出报告
      </n-button>
    </template>
  </DuxTablePage>
</template>
```

## DuxTableLayout 表格布局

表格布局组件，提供标准的表格页面布局结构，包含筛选、分页、列设置等功能。

### 属性

| 属性名         | 类型                | 默认值 | 说明                                   |
| -------------- | ------------------- | ------ | -------------------------------------- |
| path           | string              | -      | 数据接口路径                           |
| filter         | Record<string, any> | -      | 筛选条件（点击“查询”后生效）           |
| filterReactive | Record<string, any> | -      | 实时生效的筛选（变更即触发刷新）       |
| filterSchema   | JsonSchemaNode[]    | -      | 筛选表单配置                           |
| columns        | TableColumn[]       | -      | 表格列配置                             |
| pagination     | boolean/object      | -      | 分页配置                               |
| tabs           | TabItem[]           | -      | 标签页配置                             |
| actions        | UseActionItem[]     | []     | 操作配置                               |
| tools          | TablePageTools      | -      | 工具栏配置                             |
| sideLeftTitle  | string              | ''     | 左侧栏标题                             |
| sideRightTitle | string              | ''     | 右侧栏标题                             |

### 接口定义

```typescript
interface TablePageTools {
  import?: boolean // 是否显示导入按钮
  export?: boolean // 是否显示导出按钮
  refresh?: boolean // 是否显示刷新按钮
}

interface TabItem {
  label: string // 标签文本
  value: string | number // 标签值
}

interface UseActionItem {
  label?: string // 操作文本
  icon?: string // 操作图标
  type?: 'link' | 'callback' // 操作类型
  path?: string // 链接路径
  callback?: Function // 回调函数
}

// 筛选配置接口（基于 JsonSchemaNode）
interface JsonSchemaNode {
  tag: string | Component // 组件标签名或组件对象
  title?: string // 筛选器标签
  attrs?: Record<string, any> // 组件属性
  children?: JsonSchemaNode | JsonSchemaNode[] | string // 子节点
  slots?: Record<string, any> // 插槽配置
}
```

### 插槽

| 插槽名    | 说明     | 参数                 |
| --------- | -------- | -------------------- |
| default   | 表格内容 | 表格相关的状态和方法 |
| bottom    | 底部内容 | -                    |
| tools     | 工具栏   | -                    |
| actions   | 操作按钮 | -                    |
| sideLeft  | 左侧边栏 | -                    |
| sideRight | 右侧边栏 | -                    |

### 基础用法

```vue
<script setup>
import { DuxTableLayout } from '@duxweb/dvha-pro'
import { NDataTable, NInput } from 'naive-ui'
import { ref } from 'vue'

const filters = ref({})
const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '姓名', width: 150 },
  { key: 'email', title: '邮箱', width: 200 }
]

const filterSchema = [
  {
    tag: NInput,
    title: '搜索',
    attrs: {
      'v-model:value': [filters.value, 'keyword'],
      'placeholder': '请输入搜索关键词'
    }
  }
]

const tools = {
  import: true,
  export: true,
  refresh: true
}
</script>

<template>
  <DuxTableLayout
    path="/api/users"
    :filter="filters"
    :filter-schema="filterSchema"
    :columns="columns"
    :tools="tools"
  >
    <template #default="{ table, width }">
      <NDataTable
        v-bind="table"
        :scroll-x="width"
        class="h-full"
      />
    </template>
  </DuxTableLayout>
</template>
```

### 带侧边栏的表格

```vue
<template>
  <DuxTableLayout
    path="/api/users"
    :filter="filters"
    :filter-schema="filterSchema"
    :columns="columns"
    side-left-title="分类筛选"
    side-right-title="快速操作"
  >
    <template #sideLeft>
      <div class="p-4">
        <h3 class="mb-4">
          用户分类
        </h3>
        <n-tree
          :data="categoryData"
          key-field="id"
          label-field="name"
          @update:selected-keys="handleCategorySelect"
        />
      </div>
    </template>

    <template #sideRight>
      <div class="p-4">
        <h3 class="mb-4">
          快速操作
        </h3>
        <div class="flex flex-col gap-2">
          <n-button block>
            批量导入
          </n-button>
          <n-button block>
            数据统计
          </n-button>
          <n-button block>
            操作日志
          </n-button>
        </div>
      </div>
    </template>

    <template #default="{ table, width }">
      <NDataTable v-bind="table" :scroll-x="width" />
    </template>
  </DuxTableLayout>
</template>
```

## DuxTableFilter 表格过滤器

表格过滤器组件，用于为表格提供筛选功能的布局容器。

### 属性

| 属性名 | 类型   | 默认值 | 说明           |
| ------ | ------ | ------ | -------------- |
| label  | string | ''     | 过滤器标签文本 |

### 插槽

| 插槽名  | 说明       |
| ------- | ---------- |
| default | 过滤器内容 |

### 基础用法

```vue
<script setup>
import { DuxTableFilter } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const status = ref('')
const statusOptions = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
]
</script>

<template>
  <DuxTableFilter label="状态">
    <n-select v-model:value="status" :options="statusOptions" />
  </DuxTableFilter>
</template>
```

## DuxTableTools 表格工具栏

表格工具栏组件，当有选中项时显示在页面底部的操作工具栏。

### 属性

| 属性名   | 类型                  | 默认值 | 说明         |
| -------- | --------------------- | ------ | ------------ |
| number   | number                | -      | 选中项数量   |
| options  | DuxToolOptionItem[]   | -      | 工具选项     |
| group    | DuxToolOptionItem[][] | -      | 分组工具选项 |
| dropdown | DropdownOption[]      | -      | 下拉菜单选项 |

### DuxToolOptionItem 接口

```typescript
interface DuxToolOptionItem {
  label?: string // 按钮文本
  icon?: string // 按钮图标
  loading?: boolean // 加载状态
  disabled?: boolean // 禁用状态
  type?: 'default' | 'primary' | 'error' | 'success' | 'warning' // 按钮类型
  onClick?: () => void // 点击回调
}
```

### 基础用法

```vue
<script setup>
import { DuxTableTools } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedCount = ref(0)

const toolOptions = [
  {
    label: '批量导出',
    icon: 'i-tabler:file-export',
    onClick: () => {
      console.log('批量导出')
    }
  },
  {
    label: '批量删除',
    icon: 'i-tabler:trash',
    type: 'error',
    onClick: () => {
      console.log('批量删除')
    }
  }
]

const toolGroups = [
  [
    {
      icon: 'i-tabler:x',
      onClick: () => {
        selectedCount.value = 0
      }
    }
  ],
  toolOptions
]
</script>

<template>
  <DuxTableTools
    :number="selectedCount"
    :group="toolGroups"
  />
</template>
```

## 筛选配置详解

`filterSchema` 使用基于 JSON Schema 的动态渲染系统，支持 Vue 指令语法和响应式数据绑定。

### 基础筛选配置

```javascript
import { NDatePicker, NInput, NSelect } from 'naive-ui'

const filters = ref({
  keyword: '',
  status: '',
  dateRange: []
})

const filterSchema = [
  {
    tag: NInput,
    title: '关键词',
    attrs: {
      'v-model:value': [filters.value, 'keyword'],
      'placeholder': '请输入关键词',
      'clearable': true
    }
  },
  {
    tag: NSelect,
    title: '状态',
    attrs: {
      'v-model:value': [filters.value, 'status'],
      'options': [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ],
      'clearable': true
    }
  },
  {
    tag: NDatePicker,
    title: '日期范围',
    attrs: {
      'v-model:value': [filters.value, 'dateRange'],
      'type': 'daterange',
      'clearable': true
    }
  }
]
```

### 高级筛选配置

```javascript
import { NSelect } from 'naive-ui'

// 支持条件显示
const filterSchema = [
  {
    tag: NSelect,
    title: '用户类型',
    attrs: {
      'v-model:value': [filters.value, 'userType'],
      'options': [
        { label: '普通用户', value: 'normal' },
        { label: 'VIP用户', value: 'vip' }
      ]
    }
  },
  {
    tag: NSelect,
    title: 'VIP等级',
    attrs: {
      'v-model:value': [filters.value, 'vipLevel'],
      'v-if': 'userType === "vip"', // 条件显示
      'options': [
        { label: '银卡', value: 'silver' },
        { label: '金卡', value: 'gold' },
        { label: '钻石卡', value: 'diamond' }
      ]
    }
  }
]
```

### 自定义组件筛选

```javascript
import { DuxFormItem } from '@duxweb/dvha-pro'
import { NInput } from 'naive-ui'

// 使用自定义组件
const filterSchema = [
  {
    tag: DuxFormItem,
    title: '自定义筛选',
    attrs: {
      labelPlacement: 'top'
    },
    children: {
      tag: 'div',
      attrs: {
        class: 'flex gap-2'
      },
      children: [
        {
          tag: NInput,
          attrs: {
            'v-model:value': [filters.value, 'minPrice'],
            'placeholder': '最低价格'
          }
        },
        {
          tag: 'span',
          children: '至'
        },
        {
          tag: NInput,
          attrs: {
            'v-model:value': [filters.value, 'maxPrice'],
            'placeholder': '最高价格'
          }
        }
      ]
    }
  }
]
```

## 表格列配置

表格支持丰富的列配置选项，提供多种内置渲染器。

### 基础列配置

```javascript
const columns = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
    fixed: 'left'
  },
  {
    key: 'name',
    title: '姓名',
    width: 150,
    sorter: true,
    filter: true
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
    ellipsis: {
      tooltip: true
    }
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (rowData) => {
      return rowData.status === 'active'
        ? h('span', { class: 'text-green-500' }, '启用')
        : h('span', { class: 'text-red-500' }, '禁用')
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (rowData) => {
      return h('div', { class: 'flex gap-2' }, [
        h(NButton, {
          size: 'small',
          onClick: () => handleEdit(rowData.id)
        }, '编辑'),
        h(NButton, {
          size: 'small',
          type: 'error',
          onClick: () => handleDelete(rowData.id)
        }, '删除')
      ])
    }
  }
]
```

### 内置列渲染器

DVHA Pro 提供了多种内置的列渲染器：

```javascript
import { useTableColumn } from '@duxweb/dvha-pro'

const {
  renderMedia, // 媒体渲染器（头像+文本）
  renderImage, // 图片渲染器
  renderSwitch, // 开关渲染器
  renderStatus, // 状态渲染器
  renderMap, // 映射渲染器
  renderInput, // 输入框渲染器
  renderCopy, // 复制渲染器
  renderHidden // 隐藏渲染器
} = useTableColumn({
  path: '/api/users',
  rowKey: 'id'
})

const columns = [
  {
    key: 'avatar',
    title: '用户信息',
    width: 200,
    render: renderMedia({
      title: 'name',
      desc: 'email',
      image: 'avatar',
      avatar: true
    })
  },
  {
    key: 'images',
    title: '图片',
    width: 120,
    render: renderImage({
      key: 'images',
      imageWidth: 40,
      imageHeight: 40
    })
  },
  {
    key: 'status',
    title: '状态',
    width: 80,
    render: renderSwitch({
      key: 'status'
    })
  },
  {
    key: 'secret',
    title: '密钥',
    width: 150,
    render: renderHidden({
      key: 'secret',
      percent: 50
    })
  }
]
```

## 数据导入导出

表格组件内置了数据导入导出功能。

### 导出配置

```vue
<script setup>
function handleExportSuccess(data) {
  console.log(`导出成功，共导出 ${data.total} 条数据`)
}

function handleExportError(error) {
  console.error('导出失败:', error.message)
}
</script>

<template>
  <DuxTablePage
    path="/api/users"
    :columns="columns"
    :tools="{ export: true, import: true }"
    @export-success="handleExportSuccess"
    @export-error="handleExportError"
  />
</template>
```

### 自定义导入导出

```vue
<script setup>
const { onExport, onImport, isExporting, isImporting } = useTable({
  path: '/api/users',
  columns,
  exportFilename: 'users-export',
  exportMaxPage: 10
})

function handleCustomExport() {
  onExport()
}

function handleCustomImport() {
  // 自定义导入逻辑
  onImport()
}
</script>

<template>
  <DuxTableLayout path="/api/users" :columns="columns">
    <template #tools>
      <n-button :loading="isExporting" @click="handleCustomExport">
        <template #icon>
          <i class="i-tabler:download" />
        </template>
        自定义导出
      </n-button>
      <n-button :loading="isImporting" @click="handleCustomImport">
        <template #icon>
          <i class="i-tabler:upload" />
        </template>
        自定义导入
      </n-button>
    </template>

    <template #default="{ table, width }">
      <NDataTable v-bind="table" :scroll-x="width" />
    </template>
  </DuxTableLayout>
</template>
```

## 表格 Hooks

### useTable

Pro 版本的 `useTable` hook 提供了完整的表格数据管理功能。

```javascript
import { useTable } from '@duxweb/dvha-pro'

const {
  // 数据相关
  list,
  meta,
  isLoading,

  // 分页相关
  page,
  pageSize,
  pageCount,
  onUpdatePage,
  onUpdatePageSize,

  // 选择相关
  checkeds,
  onUpdateChecked,

  // 导入导出
  isExporting,
  isImporting,
  onExport,
  onImport,

  // 表格属性
  table,
  tablePagination,
  columns
} = useTable({
  path: '/api/users',
  columns: [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '姓名' }
  ],
  filters: {
    status: 'active'
  },
  pagination: {
    page: 1,
    pageSize: 20
  }
})
```

### useTableColumn

提供表格列渲染器的 hook。

```javascript
import { useTableColumn } from '@duxweb/dvha-pro'

const {
  renderMedia,
  renderImage,
  renderSwitch,
  renderStatus,
  renderMap,
  renderInput,
  renderCopy,
  renderHidden
} = useTableColumn({
  path: '/api/users',
  rowKey: 'id'
})
```
