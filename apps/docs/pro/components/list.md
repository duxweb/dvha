# 列表组件

列表组件提供了完整的列表页面解决方案，包括传统列表和卡片网格两种展示方式。

## 导入

```typescript
import {
  DuxCardPage,
  DuxListPage
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下列表组件：

- **DuxListPage** - 传统列表页面组件
- **DuxCardPage** - 卡片网格页面组件

## DuxListPage 传统列表页面

传统列表页面组件，基于 DuxListLayout 扩展，提供垂直排列的列表布局，适用于文章列表、订单列表等场景。

### 属性

DuxListPage 继承了 DuxListLayout 的所有属性：

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

### 插槽

| 插槽名    | 说明         | 参数                                 |
| --------- | ------------ | ------------------------------------ |
| default   | 列表项内容   | `{ item, isChecked, toggleChecked }` |
| actions   | 操作按钮区域 | -                                    |
| tools     | 工具栏扩展   | -                                    |
| bottom    | 底部扩展区域 | -                                    |
| sideLeft  | 左侧栏内容   | -                                    |
| sideRight | 右侧栏内容   | -                                    |

### 基础用法

```vue
<script setup>
import { DuxListPage } from '@duxweb/dvha-pro'
import { NButton, NCheckbox, NTag } from 'naive-ui'
import { ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '状态',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '已发布', value: 'published' },
        { label: '草稿', value: 'draft' }
      ]
    }
  }
]

const actions = [
  {
    label: '新增文章',
    icon: 'i-tabler:plus',
    onClick: () => {
      console.log('新增文章')
    }
  }
]
</script>

<template>
  <DuxListPage
    path="/api/articles"
    :filter="filter"
    :filter-schema="filterSchema"
    :actions="actions"
    checkable
  >
    <template #default="{ item, isChecked, toggleChecked }">
      <div class="p-4 border rounded-lg flex items-center gap-4">
        <NCheckbox
          :checked="isChecked(item.id)"
          @update:checked="() => toggleChecked(item.id)"
        />

        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="text-lg font-medium">
              {{ item.title }}
            </h3>
            <NTag :type="item.status === 'published' ? 'success' : 'warning'">
              {{ item.status === 'published' ? '已发布' : '草稿' }}
            </NTag>
          </div>

          <p class="text-gray-600 mb-2">
            {{ item.description }}
          </p>

          <div class="text-sm text-gray-500">
            作者：{{ item.author }} | 发布时间：{{ item.publishedAt }}
          </div>
        </div>

        <div class="flex gap-2">
          <NButton size="small">
            编辑
          </NButton>
          <NButton size="small" type="primary">
            查看
          </NButton>
        </div>
      </div>
    </template>
  </DuxListPage>
</template>
```

### 订单列表示例

```vue
<script setup>
import { DuxCard, DuxListPage, DuxMedia } from '@duxweb/dvha-pro'
import { NButton, NCheckbox, NTag } from 'naive-ui'
import { ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '订单状态',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '待付款', value: 'pending' },
        { label: '已付款', value: 'paid' },
        { label: '已发货', value: 'shipped' },
        { label: '已完成', value: 'completed' }
      ]
    }
  }
]
</script>

<template>
  <DuxListPage
    path="/api/orders"
    :filter="filter"
    :filter-schema="filterSchema"
    checkable
  >
    <template #default="{ item, isChecked, toggleChecked }">
      <DuxCard divide>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <NCheckbox
                :checked="isChecked(item.id)"
                @update:checked="() => toggleChecked(item.id)"
              />

              <div class="flex flex-col">
                <div class="flex gap-2 items-center">
                  <div class="text-base font-bold">
                    订单号：# {{ item.orderNo }}
                  </div>
                  <NTag type="success" size="small">
                    已付款
                  </NTag>
                </div>
                <div class="text-sm text-muted">
                  {{ item.products.length }} 个商品 | {{ item.customerName }} | {{ item.createdAt }}
                </div>
              </div>
            </div>

            <div class="flex gap-2">
              <NButton>下载账单</NButton>
              <NButton type="primary">
                查看详情
              </NButton>
            </div>
          </div>
        </template>

        <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(250px, 250px))">
          <DuxMedia
            v-for="product in item.products"
            :key="product.id"
            :title="product.title"
            :image="product.image"
            :image-width="60"
            :desc="[
              `数量：${product.quantity}x ${product.price}元`,
              `颜色：${product.color}`,
            ]"
          />
        </div>
      </DuxCard>
    </template>
  </DuxListPage>
</template>
```

## DuxCardPage 卡片网格页面

卡片网格页面组件，基于 DuxListLayout 扩展，提供响应式网格布局，适用于商品展示、用户卡片、文章卡片等场景。

### 属性

DuxCardPage 在 DuxListLayout 基础上增加了以下属性：

| 属性名         | 类型   | 默认值 | 说明               |
| -------------- | ------ | ------ | ------------------ |
| colWidth       | number | 320    | 卡片最小宽度（px） |
| rows           | number | 4      | 基础行数           |
| maxRows        | number | 10     | 最大行数           |
| sideLeftTitle  | string | ''     | 左侧栏标题         |
| sideRightTitle | string | ''     | 右侧栏标题         |

其他属性继承自 DuxListLayout。

### 插槽

| 插槽名    | 说明         | 参数                                 |
| --------- | ------------ | ------------------------------------ |
| default   | 卡片内容     | `{ item, isChecked, toggleChecked }` |
| actions   | 操作按钮区域 | -                                    |
| tools     | 工具栏扩展   | -                                    |
| bottom    | 底部扩展区域 | -                                    |
| sideLeft  | 左侧栏内容   | -                                    |
| sideRight | 右侧栏内容   | -                                    |

### 基础用法

```vue
<script setup>
import { DuxCardPage } from '@duxweb/dvha-pro'
import { NButton, NCard, NCheckbox, NTag } from 'naive-ui'
import { ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '分类',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择分类',
      options: [
        { label: '全部', value: '' },
        { label: '电子产品', value: 'electronics' },
        { label: '服装', value: 'clothing' },
        { label: '家居', value: 'home' }
      ]
    }
  }
]
</script>

<template>
  <DuxCardPage
    path="/api/products"
    :filter="filter"
    :filter-schema="filterSchema"
    :col-width="280"
    :rows="3"
    checkable
  >
    <template #default="{ item, isChecked, toggleChecked }">
      <NCard size="small" hoverable>
        <template #header>
          <div class="flex items-center justify-between">
            <NCheckbox
              :checked="isChecked(item.id)"
              @update:checked="() => toggleChecked(item.id)"
            />
            <NTag size="small">
              {{ item.category }}
            </NTag>
          </div>
        </template>

        <div class="space-y-3">
          <img
            :src="item.image"
            :alt="item.name"
            class="w-full h-40 object-cover rounded"
          >

          <div>
            <h3 class="font-medium truncate">
              {{ item.name }}
            </h3>
            <p class="text-sm text-gray-500 line-clamp-2">
              {{ item.description }}
            </p>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-lg font-bold text-red-500">¥{{ item.price }}</span>
            <NButton size="small" type="primary">
              加入购物车
            </NButton>
          </div>
        </div>
      </NCard>
    </template>
  </DuxCardPage>
</template>
```

### 用户卡片示例

```vue
<script setup>
import { DuxCard, DuxCardPage, DuxMedia } from '@duxweb/dvha-pro'
import { NButton, NCheckbox } from 'naive-ui'
import { ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '用户状态',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '活跃', value: 'active' },
        { label: '禁用', value: 'disabled' }
      ]
    }
  }
]
</script>

<template>
  <DuxCardPage
    path="/api/users"
    :filter="filter"
    :filter-schema="filterSchema"
    :col-width="300"
    checkable
  >
    <template #default="{ item, isChecked, toggleChecked }">
      <DuxCard size="none" class="relative group" divide bordered :shadow="false">
        <div class="absolute top-2 left-2 z-10 group-hover:block" :class="[isChecked(item.id) ? 'block' : 'hidden']">
          <NCheckbox :checked="isChecked(item.id)" @update:checked="() => toggleChecked(item.id)" />
        </div>

        <template #header>
          <div class="flex gap-2 justify-between items-center">
            <DuxMedia
              :image="item.avatar"
              :image-width="38"
              avatar
              :title="item.nickname"
              :desc="item.email"
            />
            <NButton circle quaternary>
              <template #icon>
                <i class="i-tabler:dots-vertical" />
              </template>
            </NButton>
          </div>
        </template>

        <div class="flex flex-col gap-1 text-muted">
          <div class="flex flex-row gap-2 justify-between">
            <div class="text-sm">
              注册时间
            </div>
            <div class="text-sm">
              {{ item.registeredAt }}
            </div>
          </div>
          <div class="flex flex-row gap-2 justify-between">
            <div class="text-sm">
              登录时间
            </div>
            <div class="text-sm">
              {{ item.lastLoginAt }}
            </div>
          </div>
        </div>

        <template #footer>
          <div class="grid grid-cols-2 gap-2">
            <NButton secondary>
              资料
            </NButton>
            <NButton secondary type="primary">
              日志
            </NButton>
          </div>
        </template>
      </DuxCard>
    </template>
  </DuxCardPage>
</template>
```

### 文章卡片示例

```vue
<script setup>
import { DuxCard, DuxCardPage } from '@duxweb/dvha-pro'
import { NButton, NCheckbox, NDropdown, NTag, NTooltip } from 'naive-ui'
import { h, ref } from 'vue'

const filter = ref({})

const filterSchema = [
  {
    title: '文章状态',
    tag: 'NSelect',
    attrs: {
      placeholder: '请选择状态',
      options: [
        { label: '全部', value: '' },
        { label: '已发布', value: 'published' },
        { label: '草稿', value: 'draft' }
      ]
    }
  }
]

const dropdownOptions = [
  {
    label: '编辑',
    key: 'edit',
    icon: () => h('i', { class: 'i-tabler:edit' }),
  },
  {
    label: '删除',
    key: 'delete',
    icon: () => h('i', { class: 'i-tabler:trash' }),
  },
]
</script>

<template>
  <DuxCardPage
    path="/api/articles"
    :filter="filter"
    :filter-schema="filterSchema"
    :col-width="350"
    checkable
  >
    <template #default="{ item, isChecked, toggleChecked }">
      <DuxCard
        :key="item.id"
        size="none"
        class="relative group bg-elevated"
        bordered
        :shadow="false"
        divide
        header-size="none"
      >
        <div class="absolute top-2 left-2 z-10 group-hover:block" :class="[isChecked(item.id) ? 'block' : 'hidden']">
          <NCheckbox :checked="isChecked(item.id)" @update:checked="() => toggleChecked(item.id)" />
        </div>

        <template #header>
          <div class="h-50 rounded-t overflow-hidden">
            <img :src="item.coverImage" :alt="item.title" class="w-full h-full object-cover">
          </div>
        </template>

        <div class="flex flex-col gap-2">
          <div class="text-sm text-muted">
            {{ item.createdAt }} | {{ item.readTime }} 分钟阅读
          </div>
          <div class="text-base font-bold">
            {{ item.title }}
          </div>
          <div class="text-sm text-muted line-clamp-2">
            {{ item.description }}
          </div>
        </div>

        <template #footer>
          <div class="flex flex-row items-center justify-between gap-2">
            <div>
              <NTag :type="item.status === 'published' ? 'success' : 'warning'">
                {{ item.status === 'published' ? '发布' : '草稿' }}
              </NTag>
            </div>
            <div class="flex flex-row gap-2">
              <NTooltip>
                <template #trigger>
                  <NButton secondary size="small" circle>
                    <template #icon>
                      <i class="i-tabler:chart-bar" />
                    </template>
                  </NButton>
                </template>
                分析
              </NTooltip>
              <NTooltip>
                <template #trigger>
                  <NButton secondary type="primary" size="small" circle>
                    <template #icon>
                      <i class="i-tabler:eye" />
                    </template>
                  </NButton>
                </template>
                预览
              </NTooltip>
              <NDropdown
                trigger="click"
                :options="dropdownOptions"
              >
                <NButton secondary size="small" circle>
                  <template #icon>
                    <i class="i-tabler:dots-vertical" />
                  </template>
                </NButton>
              </NDropdown>
            </div>
          </div>
        </template>
      </DuxCard>
    </template>
  </DuxCardPage>
</template>
```

## 设计特性

### 响应式布局

两种列表组件都具有良好的响应式特性：

- **DuxListPage** - 在小屏幕上自动调整布局，隐藏不重要的元素
- **DuxCardPage** - 根据屏幕宽度自动调整列数，确保卡片始终保持合适的尺寸

### 数据管理

- 内置分页功能，支持自定义分页配置
- 支持筛选和搜索功能
- 提供选择和批量操作能力
- 自动处理加载状态和空状态

### 交互体验

- 支持键盘导航和快捷键
- 提供丰富的操作按钮和工具栏
- 支持侧边栏扩展功能
- 响应式设计，适配各种设备

## 最佳实践

### 选择合适的列表类型

- **使用 DuxListPage** 当需要展示详细信息，如订单列表、用户管理、文章管理等
- **使用 DuxCardPage** 当需要展示图片或卡片式内容，如商品展示、用户头像、相册等

### 性能优化

- 合理设置分页大小，避免一次加载过多数据
- 使用虚拟滚动处理大量数据（可配合第三方库）
- 对图片进行懒加载处理

### 用户体验

- 提供清晰的筛选和搜索功能
- 保持一致的卡片尺寸和间距
- 使用合适的加载状态指示器
- 提供批量操作功能以提高效率

## 常见问题

### Q: 如何自定义卡片的列数？

A: 通过设置 `colWidth` 属性来控制卡片的最小宽度，系统会根据容器宽度自动计算列数。

### Q: 如何处理空数据状态？

A: 组件内置了空数据处理，会自动显示 `DuxPageEmpty` 组件。你也可以通过插槽自定义空状态。

### Q: 如何实现无限滚动？

A: 可以监听滚动事件，当接近底部时调用 `fetchNextPage` 方法加载更多数据。

### Q: 如何自定义筛选表单？

A: 通过 `filterSchema` 属性配置筛选表单，支持各种表单组件和验证规则。
