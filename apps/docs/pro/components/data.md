# 数据组件

数据组件提供了动态数据表格和选择功能，支持根据 API 数据动态生成表格列和选择选项。

## 导入

```typescript
import {
  DuxDynamicData,
  DuxDynamicSelect
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下数据组件：

- **DuxDynamicData** - 动态数据表格组件
- **DuxDynamicSelect** - 动态数据选择组件

## DuxDynamicData 动态数据表格

动态数据表格组件，支持行内编辑、拖拽排序、数据增删等功能。

### 属性

| 属性名         | 类型                                   | 默认值 | 说明             |
| -------------- | -------------------------------------- | ------ | ---------------- |
| createAction   | boolean                                | true   | 是否显示创建按钮 |
| deleteAction   | boolean                                | true   | 是否显示删除按钮 |
| columns        | DuxDynamicDataColumn[]                 | -      | 列配置           |
| createCallback | (value: Record<string, any>[]) => void | -      | 创建行回调函数   |
| onCreate       | Function                               | -      | 自定义创建处理   |
| value          | Record<string, any>[]                  | []     | 表格数据         |
| defaultValue   | Record<string, any>[]                  | []     | 默认数据         |

### 事件

| 事件名       | 类型                                   | 说明           |
| ------------ | -------------------------------------- | -------------- |
| update:value | (value: Record<string, any>[]) => void | 数据更新时触发 |

### DuxDynamicDataColumn 接口

```typescript
interface DuxDynamicDataColumn {
  key: string // 字段键名
  title?: string // 列标题
  copy?: boolean // 是否显示复制按钮
  width?: number // 列宽度
  render?: ( // 自定义渲染函数
    cell: Record<string, any>,
    rowIndex: number
  ) => VNode
  schema?: JsonSchemaNode | JsonSchemaNode[] // JSON Schema 配置
}
```

### 基础用法

```vue
<script setup lang="ts">
import { DuxDynamicData } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhang@example.com' },
  { id: 2, name: '李四', age: 30, email: 'li@example.com' }
])

const columns = ref([
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'age',
    title: '年龄',
    width: 80
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  }
])
</script>

<template>
  <DuxDynamicData
    v-model:value="tableData"
    :columns="columns"
  />
</template>
```

### 使用 JSON Schema 进行行内编辑

```vue
<script setup lang="ts">
import { DuxDynamicData } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '产品A', price: 100, category: 'electronics' },
  { id: 2, name: '产品B', price: 200, category: 'books' }
])

const columns = ref([
  {
    key: 'name',
    title: '产品名称',
    width: 150,
    schema: {
      tag: 'n-input',
      attrs: {
        'v-model:value': 'row.name',
        'placeholder': '请输入产品名称'
      }
    }
  },
  {
    key: 'price',
    title: '价格',
    width: 120,
    schema: {
      tag: 'n-input-number',
      attrs: {
        'v-model:value': 'row.price',
        'min': 0,
        'placeholder': '价格'
      }
    }
  },
  {
    key: 'category',
    title: '分类',
    width: 150,
    schema: {
      tag: 'n-select',
      attrs: {
        'v-model:value': 'row.category',
        'options': [
          { label: '电子产品', value: 'electronics' },
          { label: '图书', value: 'books' },
          { label: '服装', value: 'clothing' }
        ]
      }
    }
  }
])
</script>

<template>
  <DuxDynamicData
    v-model:value="tableData"
    :columns="columns"
  />
</template>
```

### 自定义渲染

```vue
<script setup lang="ts">
import { DuxDynamicData } from '@duxweb/dvha-pro'
import { NBadge, NTag } from 'naive-ui'
import { h, ref } from 'vue'

const tableData = ref([
  { id: 1, name: '任务A', status: 'active', priority: 'high' },
  { id: 2, name: '任务B', status: 'completed', priority: 'medium' }
])

const columns = ref([
  {
    key: 'name',
    title: '任务名称',
    width: 150
  },
  {
    key: 'status',
    title: '状态',
    width: 100,
    render: (row) => {
      const statusMap = {
        active: { label: '进行中', type: 'info' },
        completed: { label: '已完成', type: 'success' },
        pending: { label: '待处理', type: 'warning' }
      }
      const status = statusMap[row.status]
      return h(NTag, { type: status.type }, () => status.label)
    }
  },
  {
    key: 'priority',
    title: '优先级',
    width: 100,
    render: (row) => {
      const priorityMap = {
        high: { label: '高', color: 'red' },
        medium: { label: '中', color: 'orange' },
        low: { label: '低', color: 'green' }
      }
      const priority = priorityMap[row.priority]
      return h(NBadge, { color: priority.color }, () => priority.label)
    }
  }
])
</script>

<template>
  <DuxDynamicData
    v-model:value="tableData"
    :columns="columns"
  />
</template>
```

### 复制功能

```vue
<script setup lang="ts">
import { DuxDynamicData } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '项目A', description: '这是项目A的描述' },
  { id: 2, name: '项目B', description: '这是项目B的描述' }
])

const columns = ref([
  {
    key: 'name',
    title: '项目名称',
    width: 150,
    copy: true // 显示复制按钮，可以将第一行的值复制到所有行
  },
  {
    key: 'description',
    title: '描述',
    width: 300,
    schema: {
      tag: 'n-input',
      attrs: {
        'v-model:value': 'row.description',
        'type': 'textarea',
        'rows': 2
      }
    }
  }
])
</script>

<template>
  <DuxDynamicData
    v-model:value="tableData"
    :columns="columns"
  />
</template>
```

### 自定义创建处理

```vue
<script setup lang="ts">
import { DuxDynamicData } from '@duxweb/dvha-pro'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const tableData = ref([])

const columns = ref([
  { key: 'name', title: '名称', width: 150 },
  { key: 'value', title: '值', width: 100 }
])

function handleCreate() {
  // 自定义创建逻辑
  const newItem = {
    id: Date.now(),
    name: `新项目 ${tableData.value.length + 1}`,
    value: 0
  }
  tableData.value.push(newItem)
  message.success('添加成功')
}

function createCallback(currentData) {
  // 创建新行时的默认数据
  return {
    id: Date.now(),
    name: `项目 ${currentData.length + 1}`,
    value: 100
  }
}
</script>

<template>
  <!-- 使用自定义创建处理 -->
  <DuxDynamicData
    v-model:value="tableData"
    :columns="columns"
    :on-create="handleCreate"
  />

  <!-- 使用创建回调 -->
  <DuxDynamicData
    v-model:value="tableData"
    :columns="columns"
    :create-callback="createCallback"
  />
</template>
```

## DuxDynamicSelect 动态数据选择

动态数据选择组件，支持从远程数据源选择数据并进行管理。

### 属性

| 属性名        | 类型                   | 默认值 | 说明                 |
| ------------- | ---------------------- | ------ | -------------------- |
| rowKey        | string                 | 'id'   | 行数据的唯一标识字段 |
| path          | string                 | -      | 数据接口路径         |
| columns       | DuxDynamicDataColumn[] | -      | 显示列配置           |
| filterColumns | TableColumn[]          | -      | 选择弹窗的列配置     |
| filterSchema  | JsonSchemaNode[]       | -      | 筛选表单配置         |
| value         | Record<string, any>[]  | []     | 选中的数据           |
| defaultValue  | Record<string, any>[]  | []     | 默认选中的数据       |

### 事件

| 事件名       | 类型                                   | 说明           |
| ------------ | -------------------------------------- | -------------- |
| update:value | (value: Record<string, any>[]) => void | 数据更新时触发 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxDynamicSelect } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedUsers = ref([])

// 显示列配置
const displayColumns = ref([
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'department',
    title: '部门',
    width: 150
  }
])

// 选择弹窗的列配置
const selectColumns = ref([
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  },
  {
    key: 'department',
    title: '部门',
    width: 150
  },
  {
    key: 'status',
    title: '状态',
    width: 100
  }
])
</script>

<template>
  <DuxDynamicSelect
    v-model:value="selectedUsers"
    path="/api/users"
    :columns="displayColumns"
    :filter-columns="selectColumns"
  />
</template>
```

### 带筛选功能

```vue
<script setup lang="ts">
import { DuxDynamicSelect } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedProducts = ref([])

const displayColumns = ref([
  {
    key: 'name',
    title: '产品名称',
    width: 150
  },
  {
    key: 'price',
    title: '价格',
    width: 100,
    render: row => `¥${row.price}`
  },
  {
    key: 'category',
    title: '分类',
    width: 120
  }
])

const selectColumns = ref([
  {
    key: 'name',
    title: '产品名称',
    width: 150
  },
  {
    key: 'price',
    title: '价格',
    width: 100
  },
  {
    key: 'category',
    title: '分类',
    width: 120
  },
  {
    key: 'stock',
    title: '库存',
    width: 100
  }
])

// 筛选表单配置
const filterSchema = ref([
  {
    tag: 'n-input',
    attrs: {
      'v-model:value': 'filter.keyword',
      'placeholder': '搜索产品名称'
    }
  },
  {
    tag: 'n-select',
    attrs: {
      'v-model:value': 'filter.category',
      'placeholder': '选择分类',
      'options': [
        { label: '电子产品', value: 'electronics' },
        { label: '图书', value: 'books' },
        { label: '服装', value: 'clothing' }
      ]
    }
  },
  {
    tag: 'n-input-number',
    attrs: {
      'v-model:value': 'filter.minPrice',
      'placeholder': '最低价格',
      'min': 0
    }
  },
  {
    tag: 'n-input-number',
    attrs: {
      'v-model:value': 'filter.maxPrice',
      'placeholder': '最高价格',
      'min': 0
    }
  }
])
</script>

<template>
  <DuxDynamicSelect
    v-model:value="selectedProducts"
    path="/api/products"
    :columns="displayColumns"
    :filter-columns="selectColumns"
    :filter-schema="filterSchema"
  />
</template>
```

### 自定义行键

```vue
<script setup lang="ts">
import { DuxDynamicSelect } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedItems = ref([])

const columns = ref([
  {
    key: 'title',
    title: '标题',
    width: 200
  },
  {
    key: 'code',
    title: '编码',
    width: 120
  }
])
</script>

<template>
  <DuxDynamicSelect
    v-model:value="selectedItems"
    path="/api/items"
    row-key="code"
    :columns="columns"
    :filter-columns="columns"
  />
</template>
```

## 表单集成

### 在表单中使用动态数据

```vue
<script setup lang="ts">
import { DuxDynamicData, DuxFormItem } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const form = ref({
  title: '',
  items: [
    { name: '项目1', quantity: 1, price: 100 },
    { name: '项目2', quantity: 2, price: 200 }
  ]
})

const itemColumns = ref([
  {
    key: 'name',
    title: '项目名称',
    width: 150,
    schema: {
      tag: 'n-input',
      attrs: {
        'v-model:value': 'row.name',
        'placeholder': '请输入项目名称'
      }
    }
  },
  {
    key: 'quantity',
    title: '数量',
    width: 100,
    schema: {
      tag: 'n-input-number',
      attrs: {
        'v-model:value': 'row.quantity',
        'min': 1
      }
    }
  },
  {
    key: 'price',
    title: '单价',
    width: 120,
    schema: {
      tag: 'n-input-number',
      attrs: {
        'v-model:value': 'row.price',
        'min': 0,
        'precision': 2
      }
    }
  },
  {
    key: 'total',
    title: '小计',
    width: 120,
    render: row => `¥${(row.quantity * row.price).toFixed(2)}`
  }
])
</script>

<template>
  <form>
    <DuxFormItem label="标题" path="title" rule="required">
      <n-input v-model:value="form.title" placeholder="请输入标题" />
    </DuxFormItem>

    <DuxFormItem label="项目明细" path="items">
      <DuxDynamicData
        v-model:value="form.items"
        :columns="itemColumns"
      />
    </DuxFormItem>
  </form>
</template>
```

### 在表单中使用数据选择

```vue
<script setup lang="ts">
import { DuxDynamicSelect, DuxFormItem } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const form = ref({
  name: '',
  members: []
})

const memberColumns = ref([
  {
    key: 'name',
    title: '姓名',
    width: 120
  },
  {
    key: 'role',
    title: '角色',
    width: 100
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200
  }
])
</script>

<template>
  <form>
    <DuxFormItem label="项目名称" path="name" rule="required">
      <n-input v-model:value="form.name" placeholder="请输入项目名称" />
    </DuxFormItem>

    <DuxFormItem label="项目成员" path="members">
      <DuxDynamicSelect
        v-model:value="form.members"
        path="/api/users"
        :columns="memberColumns"
        :filter-columns="memberColumns"
      />
    </DuxFormItem>
  </form>
</template>
```

## 服务端接口

### 数据选择接口

```typescript
// 数据列表接口
GET /api/users
Query: {
  page?: number,      // 页码
  pageSize?: number,  // 每页数量
  keyword?: string,   // 搜索关键词
  ids?: string,       // 指定ID列表（逗号分隔）
  ...filters         // 其他筛选条件
}

// 响应格式
{
  code: 200,
  data: Array<{
    id: string,
    name: string,
    email: string,
    department: string,
    // ...其他字段
  }>,
  meta: {
    total: number,
    page: number,
    pageSize: number
  }
}
```

## 最佳实践

### 1. 合理设置列宽

```vue
<script setup lang="ts">
const columns = ref([
  { key: 'id', title: 'ID', width: 80 }, // 短文本
  { key: 'name', title: '姓名', width: 120 }, // 中等文本
  { key: 'email', title: '邮箱', width: 200 }, // 长文本
  { key: 'status', title: '状态', width: 100 }, // 标签/状态
  { key: 'actions', title: '操作', width: 150 } // 操作按钮
])
</script>
```

### 2. 优化大数据量性能

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'

// 使用 shallowRef 避免深度响应式
const tableData = shallowRef([])

// 分页显示
const pageSize = 50
const currentPage = ref(1)

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return tableData.value.slice(start, start + pageSize)
})
</script>
```

### 3. 表单验证

```vue
<script setup lang="ts">
import { computed } from 'vue'

const tableData = ref([])

// 验证表格数据
const isTableValid = computed(() => {
  return tableData.value.every((row) => {
    return row.name && row.name.trim() !== ''
      && row.quantity > 0
      && row.price >= 0
  })
})

const tableErrors = computed(() => {
  return tableData.value.map((row, index) => {
    const errors = []
    if (!row.name || row.name.trim() === '') {
      errors.push(`第${index + 1}行：名称不能为空`)
    }
    if (row.quantity <= 0) {
      errors.push(`第${index + 1}行：数量必须大于0`)
    }
    if (row.price < 0) {
      errors.push(`第${index + 1}行：价格不能为负数`)
    }
    return errors
  }).flat()
})
</script>

<template>
  <DuxFormItem
    label="项目明细"
    path="items"
    :rule="isTableValid ? '' : '表格数据有误'"
  >
    <DuxDynamicData
      v-model:value="tableData"
      :columns="columns"
    />
    <div v-if="tableErrors.length > 0" class="mt-2">
      <div
        v-for="error in tableErrors"
        :key="error"
        class="text-red-500 text-sm"
      >
        {{ error }}
      </div>
    </div>
  </DuxFormItem>
</template>
```

### 4. 数据持久化

```vue
<script setup lang="ts">
import { watch } from 'vue'

const tableData = ref([])

// 自动保存到本地存储
watch(tableData, (newData) => {
  localStorage.setItem('tableData', JSON.stringify(newData))
}, { deep: true })

// 从本地存储恢复数据
onMounted(() => {
  const savedData = localStorage.getItem('tableData')
  if (savedData) {
    try {
      tableData.value = JSON.parse(savedData)
    }
    catch (error) {
      console.error('恢复数据失败:', error)
    }
  }
})
</script>
```
