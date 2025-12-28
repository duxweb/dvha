# 布局组件

布局组件提供了构建页面结构的基础组件，包含过滤器、列表、表格、工具栏等常用的布局组件。

## 导入

```typescript
import {
  DuxListLayout,
  DuxTableFilter,
  DuxTableLayout,
  DuxTableTools
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下布局组件：

- **DuxTableFilter** - 表格过滤器组件
- **DuxTableTools** - 表格工具栏组件
- **DuxListLayout** - 列表布局组件
- **DuxTableLayout** - 表格布局组件

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
  icon?: string // 图标类名
  onClick?: () => void // 点击事件
  loading?: boolean // 加载状态
  disabled?: boolean // 禁用状态
  type?: 'default' | 'error' | 'success' | 'warning' // 按钮类型
}
```

### 基础用法

```vue
<script setup>
import { DuxTableTools } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedCount = ref(3)

const toolGroups = [
  [
    {
      icon: 'i-tabler:x',
      onClick: () => {
        console.log('取消选择')
      },
    },
  ],
  [
    {
      label: '导出',
      icon: 'i-tabler:file-export',
      onClick: () => {
        console.log('导出选中项')
      },
    },
    {
      label: '删除',
      type: 'error',
      icon: 'i-tabler:trash',
      onClick: () => {
        console.log('删除选中项')
      },
    },
  ],
]
</script>

<template>
  <DuxTableTools
    :number="selectedCount"
    :group="toolGroups"
  />
</template>
```

## DuxListLayout 列表布局

列表布局组件，提供标准的列表页面布局结构，包含筛选、分页、工具栏等功能。

### 属性

| 属性名         | 类型                | 默认值 | 说明         |
| -------------- | ------------------- | ------ | ------------ |
| rowKey         | string              | 'id'   | 行键字段     |
| path           | string              | -      | 数据接口路径 |
| filter         | Record<string, any> | -      | 筛选条件     |
| filterSchema   | JsonSchemaNode[]    | -      | 筛选表单配置 |
| pagination     | boolean/object      | true   | 分页配置     |
| tabs           | TabItem[]           | -      | 标签页配置   |
| tools          | ListPageTools       | -      | 工具栏配置   |
| actions        | UseActionItem[]     | []     | 操作配置     |
| checkable      | boolean             | -      | 是否支持选择 |
| sideLeftTitle  | string              | ''     | 左侧栏标题   |
| sideRightTitle | string              | ''     | 右侧栏标题   |

### 接口定义

```typescript
interface ListPageTools {
  import?: boolean // 是否显示导入按钮
  export?: boolean // 是否显示导出按钮
  refresh?: boolean // 是否显示刷新按钮
}

interface TabItem {
  label: string // 标签文本
  value: string | number // 标签值
}
```

### 插槽

| 插槽名    | 说明         | 参数                  |
| --------- | ------------ | --------------------- |
| default   | 列表内容     | result (列表数据结果) |
| actions   | 操作按钮区域 | -                     |
| tools     | 工具栏扩展   | -                     |
| bottom    | 底部扩展区域 | -                     |
| sideLeft  | 左侧栏内容   | -                     |
| sideRight | 右侧栏内容   | -                     |

### 基础用法

```vue
<script setup>
import { DuxListLayout } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '名称',
    tag: 'NInput',
    attrs: {
      placeholder: '请输入名称',
    },
  },
  {
    title: '状态',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
  },
]

const tabs = [
  { label: '全部', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
]

const actions = [
  {
    label: '新增',
    icon: 'i-tabler:plus',
    onClick: () => {
      console.log('新增')
    }
  }
]
</script>

<template>
  <DuxListLayout
    path="/api/users"
    :filter="filter"
    :filter-schema="filterSchema"
    :tabs="tabs"
    :actions="actions"
    checkable
  >
    <template #default="{ list, isChecked, toggleChecked }">
      <div
        v-for="item in list"
        :key="item.id"
        class="p-4 border rounded-lg flex items-center gap-3"
      >
        <n-checkbox
          :checked="isChecked(item.id)"
          @update:checked="() => toggleChecked(item.id)"
        />
        <div>
          <h3>{{ item.name }}</h3>
          <p class="text-gray-500">
            {{ item.email }}
          </p>
        </div>
      </div>
    </template>
  </DuxListLayout>
</template>
```

## DuxTableLayout 表格布局

表格布局组件，提供标准的表格页面布局结构，包含筛选、分页、列设置等功能。

### 属性

| 属性名         | 类型                          | 默认值  | 说明                                                                 |
| -------------- | ----------------------------- | ------- | -------------------------------------------------------------------- |
| path           | string                        | -       | 数据接口路径                                                         |
| filter         | Record<string, any>           | -       | 筛选条件                                                             |
| filterSchema   | JsonSchemaNode[]              | -       | 筛选表单配置（单个对象代表一行；若某项为数组，则该数组内的筛选项共同占一行） |
| filterType     | `'simple' \| 'multi'`         | simple  | 筛选布局模式，`simple` 为默认单行布局；`multi` 时按行渲染并将查询/重置按钮置于最后一行 |
| columns        | TableColumn[]                 | -       | 表格列配置                                                           |
| pagination     | boolean/object                | -       | 分页配置                                                             |
| tabs           | TabItem[]                     | -       | 标签页配置                                                           |
| actions        | UseActionItem[]               | []      | 操作配置                                                             |
| tools          | TablePageTools                | -       | 工具栏配置                                                           |
| sideLeftTitle  | string                        | ''      | 左侧栏标题                                                           |
| sideRightTitle | string                        | ''      | 右侧栏标题                                                           |

### 接口定义

```typescript
interface TablePageTools {
  import?: boolean // 是否显示导入按钮
  export?: boolean // 是否显示导出按钮
  refresh?: boolean // 是否显示刷新按钮
}
```

### 插槽

| 插槽名    | 说明                                       | 参数                        |
| --------- | ------------------------------------------ | --------------------------- |
| default   | 表格内容                                   | result (表格数据和配置结果) |
| filter    | 自定义筛选区域（包含筛选表单及查询/重置等操作，存在时完全覆盖默认布局） | `{ filter, filterReactive, onSearch, onReset }` |
| actions   | 操作按钮区域                               | -                           |
| tools     | 工具栏扩展                                 | -                           |
| bottom    | 底部扩展区域                               | -                           |
| sideLeft  | 左侧栏内容                                 | -                           |
| sideRight | 右侧栏内容                                 | -                           |

`#filter` 插槽提供 `filter` 与 `filterReactive` 两个对象用于绑定筛选字段，同时提供 `onSearch`、`onReset` 函数，分别等价于默认布局中的查询与重置行为。当定义该插槽时，组件自带的筛选表单、移动端折叠按钮、查询/重置操作等整块布局都会被替换，可完全自定义筛选 UI。

### 多行筛选布局

- 将 `filterType` 设为 `multi` 后，`filterSchema` 会以多行结构展示；
- `filterSchema` 数组中的每个元素默认占据一行；若该元素本身是数组，则数组内的多项会并排位于同一行；
- 查询与重置按钮会固定在多行布局的最后一行，移动端与桌面端表现一致。

### 基础用法

```vue
<script setup>
import { DuxTableLayout } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '用户名',
    tag: 'NInput',
    attrs: {
      placeholder: '请输入用户名',
    },
  },
  {
    title: '状态',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '启用', value: 'active' },
        { label: '禁用', value: 'inactive' }
      ]
    },
  },
]

const columns = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
  },
  {
    key: 'name',
    title: '姓名',
    width: 120,
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row) => {
      return row.status === 'active' ? '启用' : '禁用'
    }
  },
]

const actions = [
  {
    label: '新增用户',
    icon: 'i-tabler:plus',
    onClick: () => {
      console.log('新增用户')
    }
  }
]
</script>

<template>
  <DuxTableLayout
    path="/api/users"
    :filter="filter"
    :filter-schema="filterSchema"
    :columns="columns"
    :actions="actions"
  >
    <template #default="{ table, width }">
      <n-data-table
        remote
        class="h-full"
        :min-height="200"
        table-layout="fixed"
        flex-height
        :row-key="row => row.id"
        :bordered="false"
        :scroll-x="width"
        v-bind="table"
      />
    </template>
  </DuxTableLayout>
</template>
```

## 完整示例

### 带侧边栏的表格页面

```vue
<script setup>
import { DuxTableLayout } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const filter = ref({})
const selectedCategory = ref(null)

const filterSchema = [
  {
    title: '标题',
    tag: 'NInput',
    attrs: {
      placeholder: '请输入文章标题',
    },
  },
]

const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'title', title: '标题', width: 200 },
  { key: 'category', title: '分类', width: 120 },
  { key: 'created_at', title: '创建时间', width: 160 },
]

const categories = [
  { id: 1, name: '技术文章' },
  { id: 2, name: '产品介绍' },
  { id: 3, name: '行业资讯' },
]

function handleCategorySelect(categoryId) {
  selectedCategory.value = categoryId
  filter.value.category_id = categoryId
}
</script>

<template>
  <DuxTableLayout
    path="/api/articles"
    :filter="filter"
    :filter-schema="filterSchema"
    :columns="columns"
    side-left-title="文章分类"
  >
    <!-- 主表格内容 -->
    <template #default="{ table, width }">
      <n-data-table
        remote
        class="h-full"
        :min-height="200"
        table-layout="fixed"
        flex-height
        :row-key="row => row.id"
        :bordered="false"
        :scroll-x="width"
        v-bind="table"
      />
    </template>

    <!-- 左侧栏：分类列表 -->
    <template #sideLeft>
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">
          文章分类
        </h3>
        <div class="space-y-2">
          <div
            v-for="category in categories"
            :key="category.id"
            class="p-2 rounded cursor-pointer hover:bg-gray-100"
            :class="{ 'bg-blue-50 text-blue-600': selectedCategory === category.id }"
            @click="handleCategorySelect(category.id)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>
    </template>

    <!-- 工具栏扩展 -->
    <template #tools>
      <n-button secondary>
        <template #icon>
          <div class="i-tabler:refresh" />
        </template>
        刷新
      </n-button>
    </template>
  </DuxTableLayout>
</template>
```

## 响应式支持

所有布局组件都支持响应式设计：

- **桌面端 (≥1024px)**: 显示完整布局，包含侧边栏
- **平板端 (768px-1023px)**: 自适应布局，部分元素调整
- **移动端 (<768px)**: 侧边栏转为抽屉模式，简化分页组件

## 相关文档

- [表格组件](/pro/components/table) - 了解表格相关组件
- [表单组件](/pro/components/form) - 了解表单相关组件
- [Hooks 文档](/pro/hooks/table) - 了解表格相关 Hooks
