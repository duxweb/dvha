# useSelect

`useSelect` hook 用于构建选择器组件，支持分页、筛选、搜索和异步选中功能。

## 功能特点

- 🔍 **智能搜索** - 支持关键词搜索，自动重置页码
- ⏱️ **防抖搜索** - 内置防抖机制，避免频繁请求
- 📄 **分页支持** - 可选的分页功能，参数变化自动重置页码
- 🎯 **灵活筛选** - 支持动态筛选条件
- 🔄 **异步选中** - 自动获取已选中但不在当前列表中的项
- 🏷️ **自定义格式** - 灵活的标签和值格式化
- ⚡ **响应式更新** - 参数变化时自动重新查询
- 📱 **自动缓存** - 智能缓存管理，避免重复请求

## 接口关系

该 hook 内部使用 `useCustom` 获取选项列表，使用 `useMany` 获取异步选中项。

```typescript
// 参数接口
interface UseSelectProps {
  defaultValue?: MaybeRef<SelectValue> // 默认选中值
  path?: MaybeRef<string | undefined> // API 路径
  params?: MaybeRef<Record<string, any> | undefined> // 筛选参数
  pagination?: boolean | number // 是否启用分页，传入数字时作为每页大小
  providerName?: MaybeRef<string | undefined> // 数据提供者名称
  optionLabel?: string | ((item: Record<string, any>) => string) // 标签字段或函数，默认 'label'
  optionValue?: string | ((item: Record<string, any>) => string) // 值字段或函数，默认 'value'
  optionField?: string // 用于去重的字段名，默认 'value' | 'id'
  keywordField?: string // 搜索关键词的字段名，默认 'keyword'
  debounce?: number // 搜索防抖延迟时间（毫秒），默认 300
}

// 选项格式
interface SelectOption {
  label: string // 显示文本
  value: string | number // 选项值
  raw: Record<string, any> // 原始数据
}

// 选中值类型
type SelectValue = Array<string | number> | string | number | null | undefined
```

## 基础用法

```js
import { useSelect } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedValue = ref()

const { options, loading, onSearch } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/users',
  optionLabel: 'name',
  optionValue: 'id'
})
```

## 参数说明

| 参数           | 类型                  | 必需 | 默认值      | 说明                                     |
| -------------- | --------------------- | ---- | ----------- | ---------------------------------------- |
| `defaultValue` | `MaybeRef<SelectValue>` | ❌ | -           | 当前选中的值，支持单选和多选             |
| `path`         | `MaybeRef<string \| undefined>` | ❌ | -       | API 资源路径                             |
| `params`       | `MaybeRef<Record<string, any> \| undefined>` | ❌ | - | 筛选参数，变化时自动重置页码 |
| `pagination`   | `boolean \| number`   | ❌   | `false`     | 是否启用分页功能，传入数字时作为每页大小 |
| `providerName` | `MaybeRef<string \| undefined>` | ❌ | `'default'` | 数据提供者名称              |
| `optionLabel`  | `string \| Function`  | ❌   | `'label'`   | 标签字段名或格式化函数                   |
| `optionValue`  | `string \| Function`  | ❌   | `'value'`   | 值字段名或格式化函数                     |
| `optionField`  | `string`              | ❌   | `'value'`   | 用于去重和比较的字段名                   |
| `keywordField` | `string`              | ❌   | `'keyword'` | 搜索关键词的字段名                       |
| `debounce`     | `number`              | ❌   | `300`       | 搜索防抖延迟时间（毫秒）                 |

## 返回值

| 字段       | 类型                       | 说明               |
| ---------- | -------------------------- | ------------------ |
| `options`  | `Ref<SelectOption[]>`      | 格式化后的选项列表 |
| `loading`  | `Ref<boolean>`             | 是否加载中         |
| `meta`     | `Ref<Record<string, any>>` | 分页元数据         |
| `onSearch` | `Function`                 | 搜索函数           |
| `pagination` | `Ref<{ page: number; pageSize: number }>` | 分页配置 |
| `total`    | `Ref<number>`              | 总数               |
| `pageCount`| `Ref<number>`              | 总页数             |

## 使用示例

### 基础选择器

```js
import { useSelect } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedUser = ref()

const { options, loading, onSearch } = useSelect({
  defaultValue: selectedUser.value,
  path: '/api/users',
  optionLabel: 'name',
  optionValue: 'id'
})
```

### 带分页的选择器

```js
const { options, loading, onSearch, pagination, meta } = useSelect({
  defaultValue: selectedUser.value,
  path: '/api/users',
  pagination: true, // 启用分页，默认每页 20 条
  optionLabel: 'name',
  optionValue: 'id'
})

// 分页信息
console.log('当前页:', pagination.value.page)
console.log('总数:', meta.value.total)
```

### 自定义每页大小

```js
const { options, loading, pagination } = useSelect({
  defaultValue: selectedUser.value,
  path: '/api/users',
  pagination: 50, // 启用分页，每页 50 条
  optionLabel: 'name',
  optionValue: 'id'
})

console.log('每页大小:', pagination.value.pageSize) // 输出: 50
```

### 动态筛选

```js
const filters = ref({
  status: 'active',
  department: 'tech'
})

// 使用 computed 来实现动态筛选
const { options, loading } = useSelect({
  defaultValue: selectedUser.value,
  path: '/api/users',
  params: computed(() => filters.value), // 使用 computed 实现响应式筛选
  pagination: true
})

// 修改筛选条件，会自动重置页码并重新查询
filters.value.status = 'inactive'
```

### 自定义标签格式

```js
// 使用函数自定义标签
const { options: productOptions } = useSelect({
  defaultValue: selectedProduct.value,
  path: '/api/products',
  optionLabel: item => `${item.name} - ¥${item.price}`,
  optionValue: 'sku'
})

// 使用字段名
const { options: categoryOptions } = useSelect({
  defaultValue: selectedCategory.value,
  path: '/api/categories',
  optionLabel: 'title', // 使用 title 字段作为标签
  optionValue: 'slug' // 使用 slug 字段作为值
})
```

### 多选支持

```js
const selectedUsers = ref([1, 2, 3]) // 多选值

const { options: userOptions, loading } = useSelect({
  defaultValue: selectedUsers.value,
  path: '/api/users',
  optionLabel: 'name',
  optionValue: 'id'
})

// 已选中的用户会自动显示在选项列表中
```

### 搜索功能

```js
const { options, loading, onSearch } = useSelect({
  defaultValue: selectedUser.value,
  path: '/api/users',
  pagination: true,
  optionLabel: 'name',
  optionValue: 'id',
  keywordField: 'search', // 自定义搜索字段名
  debounce: 500 // 自定义防抖延迟为 500ms
})

// 搜索用户，会自动防抖并重置页码
onSearch('张三') // 500ms 后发起请求
```

**防抖搜索说明：**

- 默认防抖延迟为 300ms，可通过 `debounce` 参数自定义
- 搜索时会自动重置页码到第一页
- 连续输入时只有最后一次输入会触发请求
- 搜索关键词通过 `keywordField` 参数传递给后端，默认为 `'keyword'`

### 自定义防抖延迟

```js
// 快速响应搜索（适合本地数据或快速API）
const { onSearch: fastSearch } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/local-data',
  debounce: 100 // 100ms 防抖
})

// 慢速响应搜索（适合复杂查询或慢速API）
const { onSearch: slowSearch } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/complex-search',
  debounce: 800 // 800ms 防抖
})
```

### 默认字段模式

```js
// 不指定 optionLabel 和 optionValue，使用默认字段
const { options: itemOptions } = useSelect({
  defaultValue: selectedItem.value,
  path: '/api/items'
})

// 默认使用以下字段：
// optionLabel: 'label' (如果不存在则依次尝试 name, title, value, id)
// optionValue: 'value' (如果不存在则尝试 id)
// optionField: 'value' (如果不存在则尝试 id) - 用于去重

// 例如，对于这样的数据：
// { id: 1, label: '选项1', value: 'option1' }
// 会生成：{ label: '选项1', value: 'option1', raw: {...} }
// 去重基于：item.value

// 对于这样的数据：
// { id: 1, name: '用户1' }  // 没有 label 和 value 字段
// 会生成：{ label: '用户1', value: 1, raw: {...} }
// 去重基于：item.id
```

## 高级用法

### 复杂数据格式化

```js
const { options: orderOptions } = useSelect({
  defaultValue: selectedOrder.value,
  path: '/api/orders',
  optionLabel: (item) => {
    const status = item.status === 'paid' ? '✅' : '⏳'
    return `${status} 订单 #${item.number} - ${item.customer.name}`
  },
  optionValue: item => item.id,
  optionField: 'orderNumber' // 使用 orderNumber 字段去重而不是默认的 value/id
})
```

### 条件筛选

```js
const searchForm = ref({
  keyword: '',
  category: '',
  status: 'active'
})

const { options, loading, onSearch } = useSelect({
  defaultValue: selectedProduct.value,
  path: '/api/products',
  params: computed(() => ({
    category: searchForm.value.category,
    status: searchForm.value.status
  })),
  pagination: true,
  optionLabel: item => `${item.name} (库存: ${item.stock})`,
  optionValue: 'id'
})

// 搜索产品名称
function handleSearch(keyword) {
  onSearch(keyword)
}

// 修改分类筛选
function handleCategoryChange(category) {
  searchForm.value.category = category
  // 会自动重置页码并重新查询
}
```

### 异步选中处理

```js
// 当 value 中包含的 ID 不在当前页面时
// hook 会自动调用 useMany 获取这些项并添加到选项列表中

const selectedUsers = ref([1, 2, 999]) // 999 可能不在第一页

const { options: selectedUserOptions } = useSelect({
  defaultValue: selectedUsers.value,
  path: '/api/users',
  pagination: true,
  optionLabel: 'name',
  optionValue: 'id'
})

// ID 为 999 的用户会被自动获取并显示在选项列表顶部
```

## 最佳实践

### 1. 合理使用分页

```js
// 分页默认启用，对于数据量小的接口可以禁用分页
const { options: smallDataOptions } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/small-dataset',
  pagination: false, // 禁用分页，获取全部数据
  optionLabel: 'name',
  optionValue: 'id'
})
```

### 2. 优化搜索体验

```js
import { debounce } from 'lodash-es'

const { onSearch } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/users',
  pagination: true
})

// 使用防抖优化搜索
const debouncedSearch = debounce(onSearch, 300)
```

### 3. 错误处理

```js
const { options: safeOptions, loading } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/users',
  optionLabel: (item) => {
    // 安全的标签格式化
    return item?.name || item?.title || `未知项目 ${item?.id || ''}`
  },
  optionValue: item => item?.id || item?.value
})
```

### 4. 性能优化

```js
// 使用 computed 优化筛选参数
const filters = computed(() => ({
  status: form.value.status,
  category: form.value.category,
  // 只在有值时添加筛选条件
  ...(form.value.keyword && { keyword: form.value.keyword })
}))

const { options: filteredOptions } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/items',
  params: filters,
  pagination: true
})
```

## 注意事项

1. **参数变化重置页码** - `path`、`params`、搜索关键词变化时会自动重置页码为 1
2. **动态参数** - `params` 如需响应式更新，请使用 `computed(() => yourReactiveData.value)`
3. **异步选中限制** - 异步选中功能只在首次加载时执行一次
4. **选项去重** - 使用 `optionField` 字段进行选项去重，默认使用 `id`
5. **类型安全** - 建议为 `value` 提供明确的类型注解
6. **内存管理** - 大量数据时建议启用分页，避免内存占用过高

## 常见问题

### Q: 如何自定义选项的显示格式？

A: 使用 `optionLabel` 函数：

```js
optionLabel: item => `${item.name} (${item.code})`
```

### Q: 如何处理多选场景？

A: 将 `value` 设置为数组：

```js
const selectedIds = ref([1, 2, 3])
const { options } = useSelect({
  defaultValue: selectedIds.value,
  // ...其他配置
})
```

### Q: 如何禁用分页？

A: 设置 `pagination` 为 `false`：

```js
const { options: noPaginationOptions } = useSelect({
  defaultValue: selectedValue.value,
  pagination: false, // 禁用分页
  // ...其他配置
})
```

### Q: 如何实现动态筛选参数？

A: 使用 `computed` 包装响应式数据：

```js
const form = ref({
  status: 'active',
  category: ''
})

const { options } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/items',
  params: computed(() => ({
    status: form.value.status,
    ...(form.value.category && { category: form.value.category })
  }))
})

// 修改 form.value 会自动触发重新查询
form.value.status = 'inactive'
```

### Q: 如何自定义搜索字段名和去重字段？

A: 使用 `keywordField` 和 `optionField` 参数：

```js
const { options, onSearch } = useSelect({
  defaultValue: selectedValue.value,
  path: '/api/products',
  keywordField: 'q', // 搜索参数名改为 'q'
  optionField: 'sku', // 使用 'sku' 字段去重
  optionLabel: 'name',
  optionValue: 'id'
})

// onSearch('手机') 会发送: { page: 1, pageSize: 20, q: '手机' }
// 选项去重会基于 item.sku 而不是默认的 item.value/item.id
```
