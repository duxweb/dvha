# 层级组件

层级组件提供了多级联动选择功能，适用于地区选择、分类选择等场景。

## 导入

```typescript
import { DuxLevel } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下层级组件：

- **DuxLevel** - 多级联动选择组件

## DuxLevel 多级联动选择

多级联动选择组件，支持省市区、分类等多级数据的级联选择，具有自动加载下级数据的能力。

### 属性

| 属性名     | 类型     | 默认值  | 说明                         |
| ---------- | -------- | ------- | ---------------------------- |
| value      | string[] | []      | 选中的值数组                 |
| path       | string   | 'area'  | API 接口路径                 |
| maxLevel   | number   | 4       | 最大层级数（0 表示无限层级） |
| nameField  | string   | 'name'  | 用于查询下级数据的字段名     |
| labelField | string   | 'name'  | 显示标签的字段名             |
| valueField | string   | 'value' | 选项值的字段名               |

### 事件

| 事件名       | 类型                      | 说明         |
| ------------ | ------------------------- | ------------ |
| update:value | (value: string[]) => void | 值更新时触发 |

### 基础用法

```vue
<script setup>
import { DuxLevel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const selectedRegion = ref([])

function handleRegionChange(value) {
  console.log('选中的地区:', value)
}
</script>

<template>
  <DuxLevel
    v-model:value="selectedRegion"
    path="/api/regions"
    :max-level="3"
    @update:value="handleRegionChange"
  />
</template>
```

### 地区选择示例

```vue
<script setup>
import { DuxLevel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const address = ref({
  province: '',
  city: '',
  district: '',
  region: []
})

function handleRegionChange(value) {
  address.value.region = value
  // 根据选择的层级设置对应的值
  address.value.province = value[0] || ''
  address.value.city = value[1] || ''
  address.value.district = value[2] || ''
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">选择地区</label>
      <DuxLevel
        v-model:value="address.region"
        path="/api/area"
        :max-level="3"
        name-field="code"
        label-field="name"
        value-field="code"
        @update:value="handleRegionChange"
      />
    </div>

    <!-- 显示选择结果 -->
    <div v-if="address.region.length > 0" class="p-4 bg-gray-50 rounded">
      <h4 class="font-medium mb-2">
        选择结果：
      </h4>
      <div class="space-y-1 text-sm">
        <div>省份：{{ address.province }}</div>
        <div>城市：{{ address.city }}</div>
        <div>区县：{{ address.district }}</div>
        <div>完整路径：{{ address.region.join(' / ') }}</div>
      </div>
    </div>
  </div>
</template>
```

### 分类选择示例

```vue
<script setup>
import { DuxLevel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const productCategory = ref([])

function handleCategoryChange(value) {
  console.log('选中的分类路径:', value)
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">选择商品分类</label>
      <DuxLevel
        v-model:value="productCategory"
        path="/api/categories"
        :max-level="4"
        name-field="id"
        label-field="title"
        value-field="id"
        @update:value="handleCategoryChange"
      />
    </div>

    <!-- 面包屑导航 -->
    <div v-if="productCategory.length > 0" class="flex items-center space-x-2 text-sm">
      <span class="text-gray-500">当前位置：</span>
      <template v-for="(item, index) in productCategory" :key="index">
        <span v-if="index > 0" class="text-gray-400">/</span>
        <span class="text-blue-600">{{ item }}</span>
      </template>
    </div>
  </div>
</template>
```

### 表单集成

```vue
<script setup>
import { DuxFormItem, DuxFormLayout, DuxLevel } from '@duxweb/dvha-pro'
import { NButton, NInput } from 'naive-ui'
import { ref } from 'vue'

const form = ref({
  name: '',
  address: {
    region: [],
    detail: ''
  },
  category: []
})

function handleSubmit() {
  console.log('表单数据:', form.value)
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-xl font-bold mb-6">
      商品信息
    </h2>

    <DuxFormLayout label-placement="top" divider>
      <DuxFormItem label="商品名称" path="name" rule="required">
        <NInput v-model:value="form.name" placeholder="请输入商品名称" />
      </DuxFormItem>

      <DuxFormItem label="商品分类" path="category" rule="required">
        <DuxLevel
          v-model:value="form.category"
          path="/api/categories"
          :max-level="3"
          placeholder="请选择商品分类"
        />
      </DuxFormItem>

      <DuxFormItem label="发货地区" path="address.region" rule="required">
        <DuxLevel
          v-model:value="form.address.region"
          path="/api/area"
          :max-level="3"
          placeholder="请选择发货地区"
        />
      </DuxFormItem>

      <DuxFormItem label="详细地址" path="address.detail" rule="required">
        <NInput
          v-model:value="form.address.detail"
          placeholder="请输入详细地址"
          type="textarea"
          :rows="3"
        />
      </DuxFormItem>
    </DuxFormLayout>

    <div class="mt-6 flex justify-end">
      <NButton type="primary" @click="handleSubmit">
        保存商品
      </NButton>
    </div>
  </div>
</template>
```

### 自定义字段映射

```vue
<script setup>
import { DuxLevel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

// 适配不同的 API 数据结构
const organizationPath = ref([])
</script>

<template>
  <div class="space-y-6">
    <!-- 标准地区选择 -->
    <div>
      <h3 class="font-medium mb-2">
        地区选择（标准字段）
      </h3>
      <DuxLevel
        v-model:value="organizationPath"
        path="/api/area"
        name-field="code"
        label-field="name"
        value-field="code"
      />
    </div>

    <!-- 组织架构选择 -->
    <div>
      <h3 class="font-medium mb-2">
        组织架构（自定义字段）
      </h3>
      <DuxLevel
        v-model:value="organizationPath"
        path="/api/organizations"
        name-field="org_id"
        label-field="org_name"
        value-field="org_id"
        :max-level="5"
      />
    </div>

    <!-- 商品分类选择 -->
    <div>
      <h3 class="font-medium mb-2">
        商品分类（ID字段）
      </h3>
      <DuxLevel
        v-model:value="organizationPath"
        path="/api/product-categories"
        name-field="id"
        label-field="title"
        value-field="id"
        :max-level="4"
      />
    </div>
  </div>
</template>
```

### 无限层级示例

```vue
<script setup>
import { DuxLevel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const unlimitedPath = ref([])
</script>

<template>
  <div>
    <h3 class="font-medium mb-2">
      无限层级选择
    </h3>
    <p class="text-sm text-gray-600 mb-4">
      设置 max-level 为 0 可以支持无限层级的数据选择
    </p>

    <DuxLevel
      v-model:value="unlimitedPath"
      path="/api/unlimited-categories"
      :max-level="0"
      name-field="id"
      label-field="name"
      value-field="id"
    />

    <!-- 显示完整路径 -->
    <div v-if="unlimitedPath.length > 0" class="mt-4 p-3 bg-blue-50 rounded">
      <div class="text-sm">
        <strong>选择路径：</strong>
        {{ unlimitedPath.join(' → ') }}
      </div>
      <div class="text-xs text-gray-600 mt-1">
        层级深度：{{ unlimitedPath.length }}
      </div>
    </div>
  </div>
</template>
```

## API 接口规范

### 请求参数

组件会向指定的 API 路径发送 GET 请求，请求参数如下：

```typescript
interface LevelApiParams {
  level: number // 当前层级（从 0 开始）
  [nameField]: string // 上级选中的值（第一级时不传）
}
```

### 响应格式

API 应返回符合以下格式的数据：

```typescript
interface LevelApiResponse {
  data: Array<{
    [labelField]: string // 显示文本
    [valueField]: string // 选项值
    // 其他字段...
  }>
}
```

### 示例接口

```javascript
// GET /api/area?level=0
{
  "data": [
    { "code": "110000", "name": "北京市" },
    { "code": "120000", "name": "天津市" },
    { "code": "130000", "name": "河北省" }
  ]
}

// GET /api/area?level=1&code=130000
{
  "data": [
    { "code": "130100", "name": "石家庄市" },
    { "code": "130200", "name": "唐山市" },
    { "code": "130300", "name": "秦皇岛市" }
  ]
}
```

## 最佳实践

### 性能优化

```vue
<script setup>
import { ref, watch } from 'vue'

const region = ref([])

// 监听变化，实现业务逻辑
watch(region, (newValue, oldValue) => {
  // 只在完整选择后触发业务逻辑
  if (newValue.length === 3) {
    // 执行相关业务操作
    console.log('地区选择完成:', newValue)
  }
}, { deep: true })
</script>
```

### 错误处理

```vue
<script setup>
import { DuxLevel } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const region = ref([])
const error = ref('')

function handleError(err) {
  error.value = '加载数据失败，请重试'
  console.error('Level component error:', err)
}
</script>

<template>
  <div>
    <DuxLevel
      v-model:value="region"
      path="/api/area"
      @error="handleError"
    />
    <div v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>
```

## 常见问题

### 如何处理数据加载失败？

组件内部已集成错误处理，可以通过监听 error 事件来处理加载失败的情况。

### 如何设置默认选中值？

通过 v-model:value 绑定初始值数组即可：

```vue
<script setup>
const defaultRegion = ref(['130000', '130100', '130102'])
</script>

<template>
  <DuxLevel v-model:value="defaultRegion" path="/api/area" />
</template>
```

### 如何自定义样式？

组件使用 UnoCSS 类名，可以通过 CSS 覆盖或使用 class 属性自定义样式：

```vue
<DuxLevel
  v-model:value="region"
  path="/api/area"
  class="custom-level-component"
/>
```

### 组件是否支持异步数据？

是的，组件内部使用 TanStack Query 进行数据管理，支持异步加载、缓存、错误重试等功能。
