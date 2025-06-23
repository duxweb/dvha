# 统计组件

统计组件提供了各种数据统计的展示组件，包括数字统计、实时数据、店铺统计等。

## 导入

```typescript
import {
  DuxStatsNumber,
  DuxStatsRealTime,
  DuxStatsStore,
  DuxStatsStoreItem
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下统计组件：

- **DuxStatsNumber** - 数字统计组件
- **DuxStatsRealTime** - 实时数据组件
- **DuxStatsStore** - 店铺统计组件
- **DuxStatsStoreItem** - 店铺统计项组件

## DuxStatsNumber 数字统计组件

数字统计组件用于展示关键指标数据，支持变化趋势显示。

### 属性

| 属性名     | 类型             | 默认值 | 说明         |
| ---------- | ---------------- | ------ | ------------ |
| title      | string           | ''     | 统计标题     |
| subtitle   | string           | ''     | 副标题       |
| value      | number \| string | 0      | 统计数值     |
| change     | number           | 0      | 变化百分比   |
| changeType | 'up' \| 'down'   | 'up'   | 变化趋势类型 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxStatsNumber } from '@duxweb/dvha-pro'
</script>

<template>
  <!-- 基础数字统计 -->
  <DuxStatsNumber
    title="总销售额"
    value="128,500"
    subtitle="本月"
    :change="12.5"
    change-type="up"
  />
</template>
```

### 多个统计指标

```vue
<script setup lang="ts">
import { DuxStatsNumber } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const stats = ref([
  {
    title: '总用户数',
    value: 25680,
    subtitle: '累计注册',
    change: 8.2,
    changeType: 'up'
  },
  {
    title: '活跃用户',
    value: 12450,
    subtitle: '本周活跃',
    change: -2.1,
    changeType: 'down'
  },
  {
    title: '新增订单',
    value: 1580,
    subtitle: '今日新增',
    change: 15.8,
    changeType: 'up'
  },
  {
    title: '转化率',
    value: '68.5%',
    subtitle: '本月平均',
    change: 3.2,
    changeType: 'up'
  }
])
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <DuxStatsNumber
      v-for="stat in stats"
      :key="stat.title"
      :title="stat.title"
      :value="stat.value"
      :subtitle="stat.subtitle"
      :change="stat.change"
      :change-type="stat.changeType as any"
    />
  </div>
</template>
```

## DuxStatsRealTime 实时数据组件

实时数据组件用于展示实时更新的统计数据，支持卡片和图表组合展示。

### 属性

| 属性名   | 类型             | 默认值 | 说明       |
| -------- | ---------------- | ------ | ---------- |
| title    | string           | ''     | 组件标题   |
| subtitle | string           | ''     | 组件副标题 |
| cards    | StatsCardItem[]  | []     | 卡片数据   |
| charts   | StatsChartItem[] | []     | 图表数据   |

### StatsCardItem 接口

```typescript
interface StatsCardItem {
  label: string // 标签
  value: number | string // 数值
  color?: string // 颜色
}
```

### StatsChartItem 接口

```typescript
interface StatsChartItem {
  title: string // 图表标题
  value: number | string // 当前值
  subtitle?: string // 副标题
  change?: number // 变化百分比
  changeType?: 'up' | 'down' // 变化类型
  labels?: string[] // 图表标签
  data: number[] // 图表数据
  color?: string // 图表颜色
}
```

### 基础用法

```vue
<script setup lang="ts">
import { DuxStatsRealTime } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const cards = ref([
  { label: '今日订单', value: 245 },
  { label: '待处理', value: 12 },
  { label: '已完成', value: 233 },
  { label: '退款申请', value: 3 }
])

const charts = ref([
  {
    title: '订单趋势',
    value: 245,
    subtitle: '今日订单',
    change: 12.5,
    changeType: 'up',
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    data: [20, 35, 45, 60, 55, 65]
  }
])
</script>

<template>
  <DuxStatsRealTime
    title="实时数据"
    subtitle="数据每5分钟更新一次"
    :cards="cards"
    :charts="charts"
  />
</template>
```

### 多图表展示

```vue
<script setup lang="ts">
import { DuxStatsRealTime } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const realTimeData = ref({
  cards: [
    { label: '在线用户', value: 1580 },
    { label: '今日访问', value: 12450 },
    { label: '页面浏览', value: 25680 },
    { label: '跳出率', value: '32.5%' }
  ],
  charts: [
    {
      title: '访问量',
      value: 12450,
      subtitle: '今日访问',
      change: 8.2,
      changeType: 'up',
      labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
      data: [100, 120, 150, 180, 160, 200]
    },
    {
      title: '转化率',
      value: '68.5%',
      subtitle: '实时转化',
      change: -2.1,
      changeType: 'down',
      labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
      data: [70, 68, 72, 69, 65, 68]
    }
  ]
})
</script>

<template>
  <DuxStatsRealTime
    title="网站分析"
    :subtitle="`更新时间: ${new Date().toLocaleTimeString()}`"
    :cards="realTimeData.cards"
    :charts="realTimeData.charts"
  />
</template>
```

## DuxStatsStore 店铺统计组件

店铺统计组件用于展示店铺相关的统计信息，支持头像、描述和统计项展示。

### 属性

| 属性名 | 类型   | 默认值 | 说明     |
| ------ | ------ | ------ | -------- |
| title  | string | -      | 店铺名称 |
| avatar | string | -      | 店铺头像 |
| desc   | string | -      | 店铺描述 |

### 插槽

| 插槽名  | 说明         |
| ------- | ------------ |
| extra   | 头部额外内容 |
| header  | 头部统计内容 |
| default | 主要统计内容 |
| footer  | 底部内容     |

### 基础用法

```vue
<script setup lang="ts">
import { DuxStatsStore, DuxStatsStoreItem } from '@duxweb/dvha-pro'
</script>

<template>
  <DuxStatsStore
    title="我的店铺"
    avatar="/store-avatar.jpg"
    desc="专业的数码产品销售"
  >
    <template #extra>
      <div class="text-sm text-success">
        营业中
      </div>
    </template>

    <template #header>
      <div class="text-sm text-muted">
        店铺等级：5级 | 信誉度：98.5%
      </div>
    </template>

    <DuxStatsStoreItem label="总销售额" value="¥128,500" />
    <DuxStatsStoreItem label="订单数量" value="1,580" />
    <DuxStatsStoreItem label="商品数量" value="245" />
    <DuxStatsStoreItem label="好评率" value="99.2%" />

    <template #footer>
      <div class="text-center text-sm text-muted">
        最后更新：2024-01-15 14:30
      </div>
    </template>
  </DuxStatsStore>
</template>
```

## DuxStatsStoreItem 店铺统计项组件

店铺统计项组件用于在店铺统计组件中展示具体的统计数据。

### 属性

| 属性名 | 类型   | 默认值 | 说明     |
| ------ | ------ | ------ | -------- |
| label  | string | -      | 统计标签 |
| value  | string | -      | 统计数值 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxStatsStoreItem } from '@duxweb/dvha-pro'
</script>

<template>
  <DuxStatsStoreItem label="销售额" value="¥50,000" />
</template>
```

### 综合示例

```vue
<script setup lang="ts">
import { DuxStatsNumber, DuxStatsRealTime, DuxStatsStore, DuxStatsStoreItem } from '@duxweb/dvha-pro'
import { onMounted, ref } from 'vue'

// 关键指标数据
const keyMetrics = ref([
  {
    title: '总收入',
    value: '¥128,500',
    subtitle: '本月收入',
    change: 12.5,
    changeType: 'up'
  },
  {
    title: '新增用户',
    value: 1580,
    subtitle: '本周新增',
    change: 8.2,
    changeType: 'up'
  },
  {
    title: '活跃度',
    value: '68.5%',
    subtitle: '用户活跃',
    change: -2.1,
    changeType: 'down'
  },
  {
    title: '转化率',
    value: '15.8%',
    subtitle: '订单转化',
    change: 3.2,
    changeType: 'up'
  }
])

// 实时数据
const realTimeStats = ref({
  cards: [
    { label: '在线用户', value: 245 },
    { label: '今日订单', value: 58 },
    { label: '待处理', value: 12 },
    { label: '已完成', value: 46 }
  ],
  charts: [
    {
      title: '实时访问',
      value: 1245,
      subtitle: '当前在线',
      change: 15.2,
      changeType: 'up',
      labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
      data: [100, 120, 150, 180, 160, 200]
    }
  ]
})

// 店铺数据
const storeStats = ref({
  title: '官方旗舰店',
  avatar: '/store-logo.jpg',
  desc: '专业的电子产品销售商',
  metrics: [
    { label: '店铺评分', value: '4.9' },
    { label: '商品数量', value: '1,245' },
    { label: '粉丝数量', value: '25,680' },
    { label: '好评率', value: '99.2%' }
  ]
})

// 模拟数据更新
onMounted(() => {
  setInterval(() => {
    // 更新实时数据
    realTimeStats.value.cards[0].value = Math.floor(Math.random() * 100) + 200
    realTimeStats.value.charts[0].value = Math.floor(Math.random() * 500) + 1000
  }, 5000)
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- 关键指标 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <DuxStatsNumber
        v-for="metric in keyMetrics"
        :key="metric.title"
        :title="metric.title"
        :value="metric.value"
        :subtitle="metric.subtitle"
        :change="metric.change"
        :change-type="metric.changeType as any"
      />
    </div>

    <!-- 实时数据 -->
    <DuxStatsRealTime
      title="实时数据监控"
      :subtitle="`最后更新: ${new Date().toLocaleTimeString()}`"
      :cards="realTimeStats.cards"
      :charts="realTimeStats.charts"
    />

    <!-- 店铺统计 -->
    <DuxStatsStore
      :title="storeStats.title"
      :avatar="storeStats.avatar"
      :desc="storeStats.desc"
    >
      <template #extra>
        <div class="text-sm text-success">
          营业中
        </div>
      </template>

      <template #header>
        <div class="text-sm text-muted">
          开店时间：2020年3月 | 认证商家
        </div>
      </template>

      <DuxStatsStoreItem
        v-for="metric in storeStats.metrics"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
      />

      <template #footer>
        <div class="text-center">
          <button class="text-primary text-sm hover:underline">
            查看详细数据
          </button>
        </div>
      </template>
    </DuxStatsStore>
  </div>
</template>
```

### 最佳实践

#### 1. 数据展示

- 使用合适的数值格式化
- 突出重要指标
- 提供对比数据（环比、同比）

#### 2. 实时更新

- 合理设置更新频率
- 显示最后更新时间
- 处理网络异常情况

#### 3. 视觉设计

- 保持统计卡片样式一致
- 合理使用颜色区分趋势
- 响应式布局适配

#### 4. 用户体验

- 提供数据钻取功能
- 支持时间范围选择
- 加载状态友好提示

### 常见问题

#### 1. 如何实现数据自动刷新？

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let timer: NodeJS.Timeout

async function refreshData() {
  // 获取最新数据
  const response = await fetch('/api/stats/realtime')
  const data = await response.json()
  // 更新数据
}

onMounted(() => {
  timer = setInterval(refreshData, 30000) // 30秒刷新一次
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>
```

#### 2. 如何处理大数值显示？

```vue
<script setup lang="ts">
function formatNumber(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}
</script>
```

#### 3. 如何自定义统计卡片样式？

```vue
<template>
  <div class="custom-stats">
    <DuxStatsNumber
      title="自定义样式"
      value="12,345"
      class="custom-stat-card"
    />
  </div>
</template>

<style>
.custom-stats .custom-stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
}
</style>
```
