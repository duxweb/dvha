# useEchart - 图表处理

`useEchart` 是一个 ECharts 图表处理 Hook，提供图表的配置和管理功能，简化图表的使用和维护。

## 特性

- **自动初始化**: 自动初始化 ECharts 实例
- **响应式更新**: 支持数据和配置的响应式更新
- **主题支持**: 支持多种图表主题
- **自适应大小**: 自动适应容器大小变化
- **事件处理**: 支持图表事件监听

## 基础用法

### 导入

```typescript
import { useEchart } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const chartRef = ref()

const chart = useEchart(chartRef, {
  title: {
    text: '示例图表'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
  }]
})

// 更新图表数据
chart.updateData({
  series: [{
    data: [150, 230, 180, 100, 90, 140, 160],
    type: 'bar'
  }]
})
```

## API 参考

### UseEchartProps

| 属性    | 类型   | 默认值 | 说明         |
| ------- | ------ | ------ | ------------ |
| element | Ref    | -      | DOM 元素引用 |
| options | Object | {}     | 图表配置     |
| theme   | string | -      | 图表主题     |

### UseEchartResult

| 字段        | 类型     | 说明         |
| ----------- | -------- | ------------ |
| instance    | Object   | ECharts 实例 |
| updateData  | Function | 更新数据     |
| updateTheme | Function | 更新主题     |
| resize      | Function | 调整大小     |

## 使用示例

```vue
<script setup>
import { useEchart } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const chartRef = ref()

const chart = useEchart(chartRef, {
  title: { text: '销售数据' },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: { type: 'value' },
  series: [{
    name: '销售额',
    type: 'line',
    data: [120, 132, 101, 134, 90, 230]
  }]
})
</script>

<template>
  <div ref="chartRef" style="width: 100%; height: 400px;" />
</template>
```
