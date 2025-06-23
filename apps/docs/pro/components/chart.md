# 图表组件

图表组件基于 ECharts 封装，提供了简单易用的图表渲染功能，支持主题适配和响应式布局。

## 导入

```typescript
import { DuxChart } from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下图表组件：

- **DuxChart** - 通用图表组件

## DuxChart 通用图表组件

基于 ECharts 的通用图表组件，支持多种图表类型，包括柱状图、折线图、饼图、雷达图等。

### 属性

| 属性名 | 类型    | 默认值 | 说明             |
| ------ | ------- | ------ | ---------------- |
| height | string  | '50px' | 图表高度         |
| min    | boolean | false  | 是否为最小化模式 |
| type   | string  | 'bar'  | 图表类型         |
| option | object  | {}     | 图表配置选项     |
| class  | string  | ''     | 自定义样式类名   |

### 图表类型

| 类型    | 说明     |
| ------- | -------- |
| bar     | 柱状图   |
| line    | 折线图   |
| pie     | 饼图     |
| ring    | 环形图   |
| rose    | 玫瑰图   |
| radar   | 雷达图   |
| map     | 地图     |
| funnel  | 漏斗图   |
| treemap | 矩形树图 |

### 基础用法

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

// 柱状图数据
const barData = ref([
  { name: '周一', value: 120 },
  { name: '周二', value: 200 },
  { name: '周三', value: 150 },
  { name: '周四', value: 80 },
  { name: '周五', value: 70 }
])
</script>

<template>
  <!-- 基础柱状图 -->
  <DuxChart
    type="bar"
    height="300px"
    :option="{ data: barData }"
  />
</template>
```

## 图表类型详解

### 柱状图 (bar)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

// 单系列数据
const singleData = ref([
  { name: '产品A', value: 320 },
  { name: '产品B', value: 240 },
  { name: '产品C', value: 149 },
  { name: '产品D', value: 100 }
])

// 多系列数据
const multiData = ref([
  { name: '销售额', data: [320, 240, 149, 100, 80] },
  { name: '利润', data: [120, 80, 70, 40, 30] }
])

const labels = ref(['1月', '2月', '3月', '4月', '5月'])
</script>

<template>
  <!-- 基础柱状图 -->
  <DuxChart
    type="bar"
    height="300px"
    :option="{ data: singleData }"
  />

  <!-- 多系列柱状图 -->
  <DuxChart
    type="bar"
    height="300px"
    :option="{
      data: multiData,
      labels,
    }"
  />

  <!-- 水平柱状图 -->
  <DuxChart
    type="bar"
    height="300px"
    :option="{
      data: singleData,
      horizontal: true,
    }"
  />

  <!-- 堆叠柱状图 -->
  <DuxChart
    type="bar"
    height="300px"
    :option="{
      data: multiData,
      labels,
      stack: 'total',
    }"
  />
</template>
```

### 折线图 (line)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const lineData = ref([
  { name: '访问量', data: [120, 132, 101, 134, 90, 230, 210] },
  { name: '下载量', data: [220, 182, 191, 234, 290, 330, 310] }
])

const labels = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
</script>

<template>
  <!-- 基础折线图 -->
  <DuxChart
    type="line"
    height="300px"
    :option="{
      data: lineData,
      labels,
    }"
  />

  <!-- 平滑折线图 -->
  <DuxChart
    type="line"
    height="300px"
    :option="{
      data: lineData,
      labels,
      smooth: true,
    }"
  />

  <!-- 面积图 -->
  <DuxChart
    type="line"
    height="300px"
    :option="{
      data: lineData,
      labels,
      stack: 'total',
    }"
  />
</template>
```

### 饼图 (pie)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const pieData = ref([
  { name: 'Chrome', value: 335 },
  { name: 'Safari', value: 310 },
  { name: 'Firefox', value: 234 },
  { name: 'Edge', value: 135 },
  { name: 'Others', value: 48 }
])
</script>

<template>
  <!-- 基础饼图 -->
  <DuxChart
    type="pie"
    height="300px"
    :option="{ data: pieData }"
  />

  <!-- 最小化饼图 -->
  <DuxChart
    type="pie"
    height="150px"
    min
    :option="{ data: pieData }"
  />
</template>
```

### 环形图 (ring)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const ringData = ref([
  { name: '完成', value: 75 },
  { name: '进行中', value: 15 },
  { name: '待开始', value: 10 }
])
</script>

<template>
  <!-- 环形图 -->
  <DuxChart
    type="ring"
    height="300px"
    :option="{
      data: ringData,
      ringLabel: '项目进度',
    }"
  />
</template>
```

### 雷达图 (radar)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const radarData = ref([
  { name: '产品A', value: [4300, 10000, 28000, 35000, 50000, 19000] },
  { name: '产品B', value: [5000, 14000, 28000, 31000, 42000, 21000] }
])

const indicator = ref([
  { name: '销售', max: 6500 },
  { name: '管理', max: 16000 },
  { name: '信息技术', max: 30000 },
  { name: '客服', max: 38000 },
  { name: '研发', max: 52000 },
  { name: '市场', max: 25000 }
])
</script>

<template>
  <!-- 雷达图 -->
  <DuxChart
    type="radar"
    height="300px"
    :option="{
      data: radarData,
      indicator,
    }"
  />
</template>
```

### 漏斗图 (funnel)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const funnelData = ref([
  { name: '访问', value: 60 },
  { name: '咨询', value: 40 },
  { name: '订单', value: 20 },
  { name: '点击', value: 80 },
  { name: '展现', value: 100 }
])
</script>

<template>
  <!-- 漏斗图 -->
  <DuxChart
    type="funnel"
    height="300px"
    :option="{ data: funnelData }"
  />
</template>
```

### 矩形树图 (treemap)

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const treeMapData = ref([
  {
    name: '技术部',
    value: 100,
    children: [
      { name: '前端', value: 40 },
      { name: '后端', value: 35 },
      { name: '测试', value: 25 }
    ]
  },
  {
    name: '产品部',
    value: 80,
    children: [
      { name: '产品经理', value: 50 },
      { name: '设计师', value: 30 }
    ]
  }
])
</script>

<template>
  <!-- 矩形树图 -->
  <DuxChart
    type="treemap"
    height="300px"
    :option="{ data: treeMapData }"
  />
</template>
```

## 配置选项

### 通用配置

```vue
<script setup lang="ts">
const commonOptions = ref({
  // 是否显示图例
  showLegend: true,
  // 是否显示网格线
  showGridLine: true,
  // 是否显示 X 轴标签
  showXAxisLabel: true,
  // 是否显示 Y 轴标签
  showYAxisLabel: true,
  // 是否显示 X 轴线
  showXAxisLine: true,
  // 是否显示 Y 轴线
  showYAxisLine: true,
  // 是否显示分割区域
  showSplitArea: false
})
</script>

<template>
  <DuxChart
    type="bar"
    height="300px"
    :option="{
      data: chartData,
      ...commonOptions,
    }"
  />
</template>
```

### 最小化模式

```vue
<template>
  <!-- 最小化模式，适用于仪表盘等场景 -->
  <DuxChart
    type="line"
    height="80px"
    min
    :option="{ data: miniData }"
  />
</template>
```

### 自定义 ECharts 配置

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const customOption = ref({
  data: chartData,
  // 自定义颜色
  color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
  // 自定义标题
  title: {
    text: '自定义图表',
    left: 'center'
  },
  // 自定义工具箱
  toolbox: {
    show: true,
    feature: {
      saveAsImage: {}
    }
  }
})
</script>

<template>
  <DuxChart
    type="bar"
    height="400px"
    :option="customOption"
  />
</template>
```

## 响应式设计

### 自适应容器

```vue
<template>
  <div class="chart-container">
    <!-- 图表会自动适应容器大小 -->
    <DuxChart
      type="line"
      height="100%"
      :option="{ data: chartData }"
    />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  min-height: 200px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
}
</style>
```

### 响应式配置

```vue
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

const { width } = useWindowSize()

const responsiveOption = computed(() => ({
  data: chartData.value,
  showLegend: width.value > 768,
  showXAxisLabel: width.value > 480,
  showYAxisLabel: width.value > 480
}))
</script>

<template>
  <DuxChart
    type="bar"
    :height="width > 768 ? '400px' : '300px'"
    :option="responsiveOption"
  />
</template>
```

## 实时数据

### 动态更新

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { onMounted, onUnmounted, ref } from 'vue'

const realtimeData = ref([
  { name: '实时数据', data: [] }
])

let timer: NodeJS.Timeout

function updateData() {
  const newValue = Math.floor(Math.random() * 100)
  const currentData = realtimeData.value[0].data

  currentData.push(newValue)

  // 保持最多 20 个数据点
  if (currentData.length > 20) {
    currentData.shift()
  }
}

onMounted(() => {
  timer = setInterval(updateData, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<template>
  <DuxChart
    type="line"
    height="300px"
    :option="{
      data: realtimeData,
      labels: Array.from({ length: 20 }, (_, i) => i + 1),
    }"
  />
</template>
```

## 事件处理

### 图表交互

```vue
<script setup lang="ts">
import { DuxChart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const chartRef = ref()

function handleChartClick(params: any) {
  console.log('图表点击事件:', params)
}

function handleLegendClick(params: any) {
  console.log('图例点击事件:', params)
}

onMounted(() => {
  if (chartRef.value) {
    // 绑定事件
    chartRef.value.on('click', handleChartClick)
    chartRef.value.on('legendselectchanged', handleLegendClick)
  }
})
</script>

<template>
  <DuxChart
    ref="chartRef"
    type="pie"
    height="300px"
    :option="{ data: pieData }"
  />
</template>
```

## 主题定制

### 内置主题

```vue
<template>
  <!-- 图表会自动适配系统主题 -->
  <DuxChart
    type="bar"
    height="300px"
    :option="{ data: chartData }"
  />
</template>
```

### 自定义主题

```vue
<script setup lang="ts">
// 自定义主题色彩
const customTheme = {
  color: [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FECA57',
    '#FF9FF3',
    '#54A0FF',
    '#5F27CD'
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#333'
  }
}
</script>

<template>
  <DuxChart
    type="pie"
    height="300px"
    :option="{
      data: chartData,
      ...customTheme,
    }"
  />
</template>
```

## 最佳实践

### 1. 合理选择图表类型

```vue
<template>
  <!-- 数值比较 - 使用柱状图 -->
  <DuxChart type="bar" :option="{ data: comparisonData }" />

  <!-- 趋势变化 - 使用折线图 -->
  <DuxChart type="line" :option="{ data: trendData }" />

  <!-- 比例关系 - 使用饼图 -->
  <DuxChart type="pie" :option="{ data: proportionData }" />

  <!-- 多维度分析 - 使用雷达图 -->
  <DuxChart type="radar" :option="{ data: radarData }" />
</template>
```

### 2. 优化性能

```vue
<script setup lang="ts">
import { computed, shallowRef } from 'vue'

// 使用 shallowRef 避免深度响应式
const chartData = shallowRef([])

// 使用 computed 缓存配置
const chartOption = computed(() => ({
  data: chartData.value,
  showLegend: true
}))

// 大数据集分页显示
const pagedData = computed(() => {
  const pageSize = 100
  return chartData.value.slice(0, pageSize)
})
</script>
```

### 3. 无障碍访问

```vue
<template>
  <div role="img" aria-label="销售数据图表">
    <DuxChart
      type="bar"
      height="300px"
      :option="{
        data: salesData,
        aria: {
          enabled: true,
          decal: {
            show: true,
          },
        },
      }"
    />
  </div>
</template>
```

### 4. 错误处理

```vue
<script setup lang="ts">
import { computed } from 'vue'

const safeChartData = computed(() => {
  try {
    return processChartData(rawData.value)
  }
  catch (error) {
    console.error('图表数据处理错误:', error)
    return []
  }
})

const hasData = computed(() => {
  return safeChartData.value && safeChartData.value.length > 0
})
</script>

<template>
  <div v-if="hasData">
    <DuxChart
      type="bar"
      height="300px"
      :option="{ data: safeChartData }"
    />
  </div>
  <div v-else class="text-center text-gray-500 py-8">
    暂无数据
  </div>
</template>
```
