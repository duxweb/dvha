# useTree

`useTree` hook 用于构建树形选择器和树形数据展示，支持平铺数据转换为树形结构，以及树形数据的展开状态管理。

## 功能特点

- 🌳 **树形转换** - 自动将平铺数据转换为树形结构
- 📋 **数据获取** - 内置列表数据获取功能
- 🔄 **自动缓存** - 智能缓存管理，避免重复请求
- 🎯 **多数据源** - 支持指定不同的数据提供者
- 📱 **灵活配置** - 支持自定义树形结构的各种参数
- 🔍 **展开管理** - 自动生成所有节点的展开状态数组

## 接口关系

该 hook 内部使用 `useList` 获取列表数据，然后使用 `arrayToTree` 和 `treeToArr` 工具函数进行树形数据处理。

```typescript
// 参数接口
interface IUseTreeProps {
  path?: MaybeRef<string | undefined> // API 路径
  params?: MaybeRef<Record<string, any> | undefined> // 请求参数
  treeOptions?: { // 树形配置选项
    valueKey?: string // 节点值字段名，默认 'id'
    parentKey?: string // 父节点字段名，默认 'parentId'
    sortKey?: string // 排序字段名，默认 'sort'
    childrenKey?: string // 子节点字段名，默认 'children'
  }
  converTree?: boolean // 是否转换为树形结构，默认 false
  providerName?: MaybeRef<string | undefined> // 数据提供者名称，默认 'default'
}

// 树形节点接口
interface TreeNode {
  [key: string]: any
  children?: TreeNode[] // 子节点数组
}
```

## 基础用法

```js
import { useTree } from '@duxweb/dvha-core'

// 获取平铺数据（不转换为树形）
const { options, loading } = useTree({
  path: '/api/categories'
})

// 获取并转换为树形数据
const { options: treeData, loading: treeLoading } = useTree({
  path: '/api/categories',
  converTree: true
})
```

## 参数说明

| 参数           | 类型                  | 必需 | 默认值      | 说明                         |
| -------------- | --------------------- | ---- | ----------- | ---------------------------- |
| `path`         | `MaybeRef<string \| undefined>` | ❌ | -       | API 资源路径                 |
| `params`       | `MaybeRef<Record<string, any> \| undefined>` | ❌ | - | 请求参数和筛选条件 |
| `treeOptions`  | `object`              | ❌   | -           | 树形结构配置选项             |
| `converTree`   | `boolean`             | ❌   | `false`     | 是否将平铺数据转换为树形结构 |
| `providerName` | `MaybeRef<string \| undefined>` | ❌ | `'default'` | 数据提供者名称 |

### treeOptions 配置

| 参数          | 类型     | 默认值       | 说明         |
| ------------- | -------- | ------------ | ------------ |
| `valueKey`    | `string` | `'id'`       | 节点值字段名 |
| `parentKey`   | `string` | `'parent_id'` | 父节点字段名 |
| `sortKey`     | `string` | `'sort'`     | 排序字段名   |
| `childrenKey` | `string` | `'children'` | 子节点字段名 |

## 返回值

| 字段       | 类型              | 说明                                     |
| ---------- | ----------------- | ---------------------------------------- |
| `options`  | `Ref<TreeNode[]>` | 处理后的树形数据或原始列表数据           |
| `loading`  | `Ref<boolean>`    | 是否加载中                               |
| `expanded` | `Ref<any[]>`      | 所有节点的展开状态数组（包含所有节点ID） |

## 使用示例

### 基础树形数据

```js
import { useTree } from '@duxweb/dvha-core'

// 获取分类树形数据
const { options, loading, expanded } = useTree({
  path: '/api/categories',
  converTree: true, // 启用树形转换
  treeOptions: {
    valueKey: 'id',
    parentKey: 'parent_id',
    sortKey: 'sort_order',
    childrenKey: 'children'
  }
})

console.log('树形数据:', options.value)
console.log('所有节点ID:', expanded.value)
```

### 部门组织架构

```js
import { useTree } from '@duxweb/dvha-core'

const { options: departments, loading } = useTree({
  path: '/api/departments',
  converTree: true,
  treeOptions: {
    valueKey: 'dept_id',
    parentKey: 'parent_dept_id',
    sortKey: 'order_num',
    childrenKey: 'sub_departments'
  }
})

// 用于组织架构选择器
const departmentOptions = computed(() => {
  return departments.value?.map(dept => ({
    label: dept.dept_name,
    value: dept.dept_id,
    children: dept.sub_departments
  }))
})
```

### 权限菜单树

```js
import { useTree } from '@duxweb/dvha-core'

const { options: menuTree, loading, expanded } = useTree({
  path: '/api/permissions/menus',
  params: {
    status: 'active'
  },
  converTree: true,
  treeOptions: {
    valueKey: 'menu_id',
    parentKey: 'parent_menu_id',
    sortKey: 'menu_sort',
    childrenKey: 'sub_menus'
  }
})

// 获取所有菜单ID，用于全选功能
const allMenuIds = expanded.value
```

### 地区级联选择

```js
import { useTree } from '@duxweb/dvha-core'

const { options: regions, loading } = useTree({
  path: '/api/regions',
  converTree: true,
  treeOptions: {
    valueKey: 'region_code',
    parentKey: 'parent_code',
    sortKey: 'display_order'
  }
})

// 格式化为级联选择器数据
const cascaderOptions = computed(() => {
  const formatNode = node => ({
    label: node.region_name,
    value: node.region_code,
    children: node.children?.map(formatNode)
  })
  return regions.value?.map(formatNode)
})
```

### 带筛选的树形数据

```js
import { useTree } from '@duxweb/dvha-core'
import { computed, ref } from 'vue'

const searchKeyword = ref('')
const selectedType = ref('all')

const { options, loading } = useTree({
  path: '/api/categories',
  params: computed(() => ({
    keyword: searchKeyword.value,
    type: selectedType.value === 'all' ? undefined : selectedType.value
  })),
  converTree: true
})

// useTree 内部会自动响应 params 变化
```

### 不转换树形的用法

```js
import { useTree } from '@duxweb/dvha-core'

// 获取平铺列表数据，不进行树形转换
const { options: flatList, loading } = useTree({
  path: '/api/categories',
  converTree: false // 或者不设置此参数，默认为 false
})

// 此时 options 返回的是原始的平铺数组数据
console.log('平铺数据:', flatList.value)
```

### 自定义数据提供者

```js
import { useTree } from '@duxweb/dvha-core'

// 使用自定义数据提供者
const { options, loading } = useTree({
  path: '/api/org/departments',
  converTree: true,
  providerName: 'organization', // 使用组织架构数据提供者
  treeOptions: {
    valueKey: 'org_id',
    parentKey: 'parent_org_id'
  }
})
```

## 数据格式示例

### 输入数据格式（平铺）

```js
// API 返回的平铺数据
const flatData = [
  { id: 1, name: '根分类', parent_id: null, sort: 1 },
  { id: 2, name: '子分类1', parent_id: 1, sort: 1 },
  { id: 3, name: '子分类2', parent_id: 1, sort: 2 },
  { id: 4, name: '孙分类1', parent_id: 2, sort: 1 }
]
```

### 输出数据格式（树形）

```js
// converTree: true 时的输出
const treeData = [
  {
    id: 1,
    name: '根分类',
    parent_id: null,
    sort: 1,
    children: [
      {
        id: 2,
        name: '子分类1',
        parent_id: 1,
        sort: 1,
        children: [
          {
            id: 4,
            name: '孙分类1',
            parent_id: 2,
            sort: 1
          }
        ]
      },
      {
        id: 3,
        name: '子分类2',
        parent_id: 1,
        sort: 2
      }
    ]
  }
]

// expanded 返回所有节点ID
const expandedIds = [1, 2, 3, 4]
```

## 注意事项

1. **数据结构要求**：使用 `converTree: true` 时，确保数据包含父子关系字段
2. **排序逻辑**：树形转换时会根据 `sortKey` 字段进行排序
3. **性能考虑**：大量数据时，树形转换可能影响性能，建议在后端处理
4. **展开状态**：`expanded` 返回的是所有节点的ID数组，可用于树形组件的展开控制

## 与其他 hooks 的配合使用

```js
import { useSelect, useTree } from '@duxweb/dvha-core'

// 结合 useSelect 实现树形选择器
const { options: treeOptions } = useTree({
  path: '/api/categories',
  converTree: true
})

// 如果需要选择器功能，建议直接使用 useSelect
const { options: selectOptions } = useSelect({
  path: '/api/categories',
  optionLabel: 'name',
  optionValue: 'id'
})
```
