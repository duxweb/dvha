# 状态组件

状态组件提供了各种状态展示功能，包括空状态等场景的处理。

## 导入

```typescript
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下状态组件：

- **DuxBlockEmpty** - 空状态组件

## DuxBlockEmpty 空状态组件

空状态组件，用于在数据为空或无内容时显示友好的提示信息，支持简单和详细两种显示模式。

### 属性

| 属性名 | 类型    | 默认值 | 说明                         |
| ------ | ------- | ------ | ---------------------------- |
| text   | string  | -      | 主要提示文本                 |
| desc   | string  | -      | 描述文本                     |
| simple | boolean | false  | 是否使用简单模式（垂直布局） |

### 基础用法

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 默认空状态 -->
  <DuxBlockEmpty />

  <!-- 自定义文本 -->
  <DuxBlockEmpty
    text="暂无数据"
    desc="当前没有任何内容，请稍后再试"
  />

  <!-- 简单模式 -->
  <DuxBlockEmpty
    text="空空如也"
    simple
  />
</template>
```

### 在列表中使用

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const dataList = ref([])
const isLoading = ref(false)
</script>

<template>
  <div class="min-h-[400px] flex flex-col">
    <!-- 数据列表 -->
    <div v-if="dataList.length > 0" class="flex-1">
      <div
        v-for="item in dataList"
        :key="item.id"
        class="p-4 border-b"
      >
        {{ item.name }}
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!isLoading" class="flex-1 flex items-center justify-center">
      <DuxBlockEmpty
        text="暂无数据"
        desc="当前列表为空，请添加一些内容"
      />
    </div>

    <!-- 加载状态 -->
    <div v-else class="flex-1 flex items-center justify-center">
      <div class="text-muted">
        加载中...
      </div>
    </div>
  </div>
</template>
```

### 在表格中使用

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
import { NDataTable } from 'naive-ui'
import { ref } from 'vue'

const tableData = ref([])
const columns = [
  { title: '姓名', key: 'name' },
  { title: '邮箱', key: 'email' },
  { title: '状态', key: 'status' }
]
</script>

<template>
  <NDataTable
    :columns="columns"
    :data="tableData"
    :loading="false"
  >
    <template #empty>
      <DuxBlockEmpty
        text="暂无记录"
        desc="表格中没有数据，请尝试添加一些记录"
      />
    </template>
  </NDataTable>
</template>
```

### 在卡片网格中使用

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
import { NButton, NCard } from 'naive-ui'
import { ref } from 'vue'

const cardList = ref([])

function addCard() {
  cardList.value.push({
    id: Date.now(),
    title: `卡片 ${cardList.value.length + 1}`,
    content: '这是卡片内容'
  })
}

function clearCards() {
  cardList.value = []
}
</script>

<template>
  <div class="space-y-4">
    <!-- 操作按钮 -->
    <div class="flex gap-2">
      <NButton type="primary" @click="addCard">
        添加卡片
      </NButton>
      <NButton @click="clearCards">
        清空卡片
      </NButton>
    </div>

    <!-- 卡片网格 -->
    <div v-if="cardList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NCard
        v-for="card in cardList"
        :key="card.id"
        :title="card.title"
        size="small"
      >
        {{ card.content }}
      </NCard>
    </div>

    <!-- 空状态 -->
    <div v-else class="min-h-[300px] flex items-center justify-center">
      <DuxBlockEmpty
        text="暂无卡片"
        desc="点击上方按钮添加一些卡片内容"
      />
    </div>
  </div>
</template>
```

### 搜索结果为空

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
import { NButton, NInput } from 'naive-ui'
import { computed, ref } from 'vue'

const searchKeyword = ref('')
const allData = ref([
  { id: 1, name: '苹果', category: '水果' },
  { id: 2, name: '香蕉', category: '水果' },
  { id: 3, name: '胡萝卜', category: '蔬菜' }
])

const filteredData = computed(() => {
  if (!searchKeyword.value)
    return allData.value
  return allData.value.filter(item =>
    item.name.includes(searchKeyword.value)
    || item.category.includes(searchKeyword.value)
  )
})

function clearSearch() {
  searchKeyword.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <!-- 搜索框 -->
    <NInput
      v-model:value="searchKeyword"
      placeholder="搜索商品名称或分类..."
      clearable
    />

    <!-- 搜索结果 -->
    <div v-if="filteredData.length > 0" class="space-y-2">
      <div
        v-for="item in filteredData"
        :key="item.id"
        class="p-3 bg-gray-50 rounded"
      >
        <div class="font-medium">
          {{ item.name }}
        </div>
        <div class="text-sm text-gray-500">
          {{ item.category }}
        </div>
      </div>
    </div>

    <!-- 搜索为空 -->
    <div v-else-if="searchKeyword" class="min-h-[200px] flex items-center justify-center">
      <DuxBlockEmpty
        text="未找到相关结果"
        desc="尝试使用不同的关键词搜索"
      >
        <template #action>
          <NButton @click="clearSearch">
            清空搜索
          </NButton>
        </template>
      </DuxBlockEmpty>
    </div>

    <!-- 初始状态 -->
    <div v-else class="min-h-[200px] flex items-center justify-center">
      <DuxBlockEmpty
        text="开始搜索"
        desc="在上方输入框中输入关键词进行搜索"
        simple
      />
    </div>
  </div>
</template>
```

### 不同显示模式对比

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- 标准模式 -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        标准模式
      </h3>
      <div class="min-h-[200px] border rounded-lg flex items-center justify-center">
        <DuxBlockEmpty
          text="暂无内容"
          desc="这里使用标准的水平布局模式"
        />
      </div>
    </div>

    <!-- 简单模式 -->
    <div class="space-y-4">
      <h3 class="text-lg font-medium">
        简单模式
      </h3>
      <div class="min-h-[200px] border rounded-lg flex items-center justify-center">
        <DuxBlockEmpty
          text="暂无内容"
          simple
        />
      </div>
    </div>
  </div>
</template>
```

### 在不同容器中的适配

```vue
<script setup>
import { DuxBlockEmpty } from '@duxweb/dvha-pro'
import { NCard } from 'naive-ui'
</script>

<template>
  <div class="space-y-6">
    <!-- 小容器 -->
    <div class="space-y-2">
      <h4 class="font-medium">
        小容器（高度 150px）
      </h4>
      <div class="h-[150px] border rounded flex items-center justify-center">
        <DuxBlockEmpty text="无数据" simple />
      </div>
    </div>

    <!-- 中等容器 -->
    <div class="space-y-2">
      <h4 class="font-medium">
        中等容器（高度 250px）
      </h4>
      <div class="h-[250px] border rounded flex items-center justify-center">
        <DuxBlockEmpty
          text="暂无数据"
          desc="请添加一些内容"
        />
      </div>
    </div>

    <!-- 大容器 -->
    <div class="space-y-2">
      <h4 class="font-medium">
        大容器（高度 400px）
      </h4>
      <div class="h-[400px] border rounded flex items-center justify-center">
        <DuxBlockEmpty
          text="这里空空如也"
          desc="看起来这里还没有任何内容，您可以开始添加一些数据或内容来填充这个区域"
        />
      </div>
    </div>

    <!-- 卡片容器 -->
    <div class="space-y-2">
      <h4 class="font-medium">
        卡片容器
      </h4>
      <NCard title="数据列表" size="small">
        <div class="min-h-[200px] flex items-center justify-center">
          <DuxBlockEmpty
            text="列表为空"
            desc="当前没有任何数据项"
          />
        </div>
      </NCard>
    </div>
  </div>
</template>
```

## 设计特性

### 视觉设计

- **友好的图标**：使用精心设计的 SVG 图标，支持主题色彩适配
- **动态效果**：图标包含微妙的动画效果，提升用户体验
- **响应式适配**：自动适应不同尺寸的容器
- **主题集成**：完美集成 DVHA Pro 的设计系统

### 布局模式

- **水平布局**：图标和文本水平排列，适合较宽的容器
- **垂直布局**：图标和文本垂直排列，适合较窄或较小的容器
- **自适应**：根据容器大小自动选择最佳布局

## 最佳实践

### 何时使用

- 列表、表格、网格等容器中没有数据时
- 搜索结果为空时
- 加载完成但内容为空时
- 用户首次进入某个功能模块时

### 文案建议

- **简洁明了**：使用简短、清晰的文案
- **积极引导**：提供下一步操作的建议
- **符合场景**：根据具体业务场景定制文案

```vue
<!-- 好的文案示例 -->
<DuxBlockEmpty
  text="暂无文章"
  desc="开始创建您的第一篇文章吧"
/>

<!-- 避免的文案示例 -->
<DuxBlockEmpty
  text="没有数据"
  desc="数据为空"
/>
```

### 容器适配

```vue
<!-- 小容器使用简单模式 -->
<div class="h-32">
  <DuxBlockEmpty text="无内容" simple />
</div>

<!-- 大容器使用标准模式 -->
<div class="min-h-[300px]">
  <DuxBlockEmpty
    text="暂无数据"
    desc="详细的描述信息"
  />
</div>
```

## 常见问题

### 如何自定义空状态图标？

目前组件使用内置的 SVG 图标，如需自定义，可以通过 CSS 覆盖或创建自定义组件：

```vue
<script setup>
import { defineComponent } from 'vue'

const CustomEmpty = defineComponent({
  setup() {
    return () => (
      <div class="flex flex-col items-center gap-4">
        <div class="w-16 h-16">
          <!-- 自定义图标 -->
          <img src="/custom-empty-icon.svg" alt="空状态" />
        </div>
        <div class="text-center">
          <div class="text-lg">自定义空状态</div>
          <div class="text-sm text-muted">这是自定义的空状态组件</div>
        </div>
      </div>
    )
  }
})
</script>
```

### 如何在空状态中添加操作按钮？

可以在空状态组件外层添加操作按钮：

```vue
<div class="flex flex-col items-center gap-4">
  <DuxBlockEmpty
    text="暂无数据"
    desc="还没有任何内容"
  />
  <NButton type="primary" @click="handleAdd">
    添加内容
  </NButton>
</div>
```

### 空状态组件是否支持国际化？

组件本身不内置国际化，但可以通过传入对应语言的文本实现：

```vue
<script setup>
import { useI18n } from '@duxweb/dvha-core'

const { t } = useI18n()
</script>

<template>
  <DuxBlockEmpty
    :text="t('common.empty.title')"
    :desc="t('common.empty.description')"
  />
</template>
```
