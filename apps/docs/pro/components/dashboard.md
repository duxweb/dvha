# 仪表盘组件

仪表盘组件提供了首页仪表盘常用的组件，包括欢迎横幅、快捷功能等。

## 导入

```typescript
import {
  DuxDashboardHello,
  DuxDashboardHelloBig,
  DuxDashboardQuick
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下仪表盘组件：

- **DuxDashboardHello** - 欢迎横幅组件
- **DuxDashboardHelloBig** - 大型欢迎横幅组件
- **DuxDashboardQuick** - 快捷功能组件

## DuxDashboardHello 欢迎横幅组件

紧凑型欢迎横幅组件，适用于显示简要的欢迎信息和关键数据统计。

### 属性

| 属性名 | 类型                           | 默认值 | 说明         |
| ------ | ------------------------------ | ------ | ------------ |
| title  | string                         | -      | 主标题       |
| desc   | string                         | -      | 描述文本     |
| data   | Array\<DuxDashboardHelloData\> | -      | 统计数据数组 |

### 数据类型

```typescript
interface DuxDashboardHelloData {
  label: string // 数据标签
  value?: string // 数据值
  onClick?: () => void // 点击事件
}
```

### 基础用法

```vue
<script setup>
import { DuxDashboardHello } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const statsData = ref([
  {
    label: '今日订单',
    value: '128',
    onClick: () => {
      console.log('查看今日订单')
    }
  },
  {
    label: '总用户',
    value: '1,234',
    onClick: () => {
      console.log('查看用户列表')
    }
  },
  {
    label: '总收入',
    value: '¥45,678',
    onClick: () => {
      console.log('查看收入报表')
    }
  }
])
</script>

<template>
  <DuxDashboardHello
    title="欢迎回来！"
    desc="今天也要加油工作哦"
    :data="statsData"
  />
</template>
```

### 电商仪表盘示例

```vue
<script setup>
import { DuxDashboardHello } from '@duxweb/dvha-pro'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ecommerceStats = ref([
  {
    label: '待处理订单',
    value: '23',
    onClick: () => {
      router.push('/orders?status=pending')
    }
  },
  {
    label: '库存预警',
    value: '5',
    onClick: () => {
      router.push('/inventory/alerts')
    }
  },
  {
    label: '今日销售额',
    value: '¥12,345',
    onClick: () => {
      router.push('/reports/sales')
    }
  }
])
</script>

<template>
  <DuxDashboardHello
    title="店长，早上好！"
    desc="您的店铺运营概况"
    :data="ecommerceStats"
  />
</template>
```

## DuxDashboardHelloBig 大型欢迎横幅组件

大型欢迎横幅组件，提供更丰富的视觉效果和更多的信息展示空间，支持诗词API集成。

### 属性

| 属性名 | 类型                              | 默认值 | 说明                           |
| ------ | --------------------------------- | ------ | ------------------------------ |
| title  | string                            | -      | 主标题                         |
| desc   | string                            | -      | 描述文本（为空时自动获取诗词） |
| data   | Array\<DuxDashboardHelloBigData\> | -      | 统计数据数组                   |

### 数据类型

```typescript
interface DuxDashboardHelloBigData {
  label: string // 数据标签
  value?: string // 数据值
  icon?: string // 图标类名
  color?: ButtonProps['type'] // 颜色类型
  onClick?: () => void // 点击事件
}
```

### 基础用法

```vue
<script setup>
import { DuxDashboardHelloBig } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const bigStatsData = ref([
  {
    label: '总订单',
    value: '2,345',
    icon: 'i-tabler:shopping-cart',
    color: 'primary',
    onClick: () => {
      console.log('查看所有订单')
    }
  },
  {
    label: '活跃用户',
    value: '1,567',
    icon: 'i-tabler:users',
    color: 'success',
    onClick: () => {
      console.log('查看用户统计')
    }
  },
  {
    label: '月收入',
    value: '¥89,012',
    icon: 'i-tabler:currency-dollar',
    color: 'warning',
    onClick: () => {
      console.log('查看收入报表')
    }
  }
])
</script>

<template>
  <DuxDashboardHelloBig
    title="HELLO，管理员"
    desc="愿你的每一天都充满阳光与希望"
    :data="bigStatsData"
  />
</template>
```

### 自动诗词横幅

```vue
<script setup>
import { DuxDashboardHelloBig } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const systemStats = ref([
  {
    label: '系统状态',
    value: '正常',
    icon: 'i-tabler:check',
    color: 'success'
  },
  {
    label: '在线用户',
    value: '234',
    icon: 'i-tabler:user-check',
    color: 'info'
  },
  {
    label: '今日访问',
    value: '5,678',
    icon: 'i-tabler:eye',
    color: 'primary'
  }
])
</script>

<template>
  <!-- 不传入 desc 属性，组件会自动获取诗词 -->
  <DuxDashboardHelloBig
    title="欢迎使用管理系统"
    :data="systemStats"
  />
</template>
```

### 项目概览横幅

```vue
<script setup>
import { DuxDashboardHelloBig } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const projectStats = ref([
  {
    label: '进行中项目',
    value: '12',
    icon: 'i-tabler:briefcase',
    color: 'primary',
    onClick: () => {
      console.log('查看进行中项目')
    }
  },
  {
    label: '已完成',
    value: '45',
    icon: 'i-tabler:check-circle',
    color: 'success',
    onClick: () => {
      console.log('查看已完成项目')
    }
  },
  {
    label: '团队成员',
    value: '23',
    icon: 'i-tabler:users-group',
    color: 'info',
    onClick: () => {
      console.log('查看团队成员')
    }
  },
  {
    label: '待办任务',
    value: '67',
    icon: 'i-tabler:list-check',
    color: 'warning',
    onClick: () => {
      console.log('查看待办任务')
    }
  }
])
</script>

<template>
  <DuxDashboardHelloBig
    title="项目管理中心"
    desc="高效协作，成就卓越团队"
    :data="projectStats"
  />
</template>
```

## DuxDashboardQuick 快捷功能组件

快捷功能组件，用于展示常用功能的快速入口，支持自定义列数和颜色。

### 属性

| 属性名 | 类型                                | 默认值 | 说明                   |
| ------ | ----------------------------------- | ------ | ---------------------- |
| data   | Array\<DuxDashboardQuickItemProps\> | -      | 快捷功能数据数组       |
| col    | number                              | 6      | 列数（响应式自动调整） |

### 数据类型

```typescript
interface DuxDashboardQuickItemProps {
  icon?: string // 图标类名
  title?: string // 功能标题
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error' // 颜色类型
  onClick?: () => void // 点击事件
}
```

### 基础用法

```vue
<script setup>
import { DuxDashboardQuick } from '@duxweb/dvha-pro'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const quickActions = ref([
  {
    icon: 'i-tabler:plus',
    title: '新增用户',
    onClick: () => {
      router.push('/users/create')
    }
  },
  {
    icon: 'i-tabler:file-text',
    title: '订单管理',
    onClick: () => {
      router.push('/orders')
    }
  },
  {
    icon: 'i-tabler:package',
    title: '商品管理',
    onClick: () => {
      router.push('/products')
    }
  },
  {
    icon: 'i-tabler:chart-bar',
    title: '数据统计',
    onClick: () => {
      router.push('/analytics')
    }
  },
  {
    icon: 'i-tabler:settings',
    title: '系统设置',
    onClick: () => {
      router.push('/settings')
    }
  },
  {
    icon: 'i-tabler:help',
    title: '帮助中心',
    onClick: () => {
      router.push('/help')
    }
  }
])
</script>

<template>
  <DuxDashboardQuick
    :data="quickActions"
    :col="6"
  />
</template>
```

### 电商快捷功能

```vue
<script setup>
import { DuxDashboardQuick } from '@duxweb/dvha-pro'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const ecommerceFeatures = ref([
  {
    icon: 'i-tabler:shopping-cart-plus',
    title: '新增商品',
    onClick: () => {
      router.push('/products/create')
    }
  },
  {
    icon: 'i-tabler:truck-delivery',
    title: '订单发货',
    onClick: () => {
      router.push('/orders/shipping')
    }
  },
  {
    icon: 'i-tabler:discount-2',
    title: '优惠券',
    onClick: () => {
      router.push('/coupons')
    }
  },
  {
    icon: 'i-tabler:speakerphone',
    title: '营销活动',
    onClick: () => {
      router.push('/marketing')
    }
  }
])
</script>

<template>
  <DuxDashboardQuick
    :data="ecommerceFeatures"
    :col="4"
  />
</template>
```

### 管理系统快捷功能

```vue
<script setup>
import { DuxDashboardQuick } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const adminFeatures = ref([
  {
    icon: 'i-tabler:user-plus',
    title: '添加用户',
    onClick: () => {
      console.log('添加用户')
    }
  },
  {
    icon: 'i-tabler:folder-plus',
    title: '创建项目',
    onClick: () => {
      console.log('创建项目')
    }
  },
  {
    icon: 'i-tabler:mail',
    title: '发送通知',
    onClick: () => {
      console.log('发送通知')
    }
  },
  {
    icon: 'i-tabler:database',
    title: '数据备份',
    onClick: () => {
      console.log('数据备份')
    }
  },
  {
    icon: 'i-tabler:shield-check',
    title: '权限管理',
    onClick: () => {
      console.log('权限管理')
    }
  },
  {
    icon: 'i-tabler:report',
    title: '生成报表',
    onClick: () => {
      console.log('生成报表')
    }
  },
  {
    icon: 'i-tabler:bell',
    title: '系统通知',
    onClick: () => {
      console.log('系统通知')
    }
  },
  {
    icon: 'i-tabler:tools',
    title: '系统维护',
    onClick: () => {
      console.log('系统维护')
    }
  }
])
</script>

<template>
  <DuxDashboardQuick
    :data="adminFeatures"
    :col="8"
  />
</template>
```

### 完整仪表盘示例

```vue
<script setup>
import {
  DuxCard,
  DuxDashboardHello,
  DuxDashboardHelloBig,
  DuxDashboardQuick
} from '@duxweb/dvha-pro'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 顶部统计数据
const topStats = ref([
  {
    label: '今日订单',
    value: '156',
    onClick: () => router.push('/orders?date=today')
  },
  {
    label: '待处理',
    value: '23',
    onClick: () => router.push('/orders?status=pending')
  },
  {
    label: '今日销售额',
    value: '¥15,678',
    onClick: () => router.push('/sales/today')
  }
])

// 大横幅统计数据
const bigStats = ref([
  {
    label: '总订单',
    value: '12,345',
    icon: 'i-tabler:shopping-cart',
    color: 'primary'
  },
  {
    label: '总用户',
    value: '8,901',
    icon: 'i-tabler:users',
    color: 'success'
  },
  {
    label: '月收入',
    value: '¥234,567',
    icon: 'i-tabler:currency-dollar',
    color: 'warning'
  }
])

// 快捷功能
const quickFeatures = ref([
  {
    icon: 'i-tabler:plus',
    title: '新增商品',
    onClick: () => router.push('/products/create')
  },
  {
    icon: 'i-tabler:truck',
    title: '订单管理',
    onClick: () => router.push('/orders')
  },
  {
    icon: 'i-tabler:users',
    title: '用户管理',
    onClick: () => router.push('/users')
  },
  {
    icon: 'i-tabler:chart-bar',
    title: '销售报表',
    onClick: () => router.push('/reports')
  },
  {
    icon: 'i-tabler:discount',
    title: '优惠活动',
    onClick: () => router.push('/promotions')
  },
  {
    icon: 'i-tabler:settings',
    title: '系统设置',
    onClick: () => router.push('/settings')
  }
])
</script>

<template>
  <div class="space-y-4">
    <!-- 紧凑型欢迎横幅 -->
    <DuxDashboardHello
      title="欢迎回来！"
      desc="今天也要努力工作哦"
      :data="topStats"
    />

    <!-- 大型欢迎横幅 -->
    <DuxDashboardHelloBig
      title="电商管理中心"
      desc="专业、高效、可靠的电商管理平台"
      :data="bigStats"
    />

    <!-- 快捷功能卡片 -->
    <DuxCard title="常用功能" divide>
      <DuxDashboardQuick
        :data="quickFeatures"
        :col="6"
      />
    </DuxCard>
  </div>
</template>
```

## 设计特性

### 视觉层次

- **渐变背景** - 使用主题色渐变创建视觉焦点
- **装饰元素** - 添加圆形装饰元素增强设计感
- **图标系统** - 统一的图标风格和颜色体系
- **响应式布局** - 自适应不同屏幕尺寸

### 交互体验

- **点击反馈** - 所有可交互元素提供明确的点击反馈
- **悬停效果** - 鼠标悬停时的视觉变化
- **色彩编码** - 使用不同颜色表示不同类型的数据
- **快速导航** - 一键跳转到相关功能页面

### 数据展示

- **实时更新** - 支持数据的实时刷新和更新
- **格式化显示** - 自动格式化数字、货币等数据
- **状态指示** - 通过颜色和图标表示不同状态
- **趋势展示** - 可配合图表组件显示数据趋势

## 最佳实践

### 内容组织

- **信息优先级** - 重要信息放在显眼位置
- **功能分组** - 相关功能放在一起便于查找
- **简洁文案** - 使用简短清晰的标题和描述

### 数据展示

- **关键指标** - 选择最重要的业务指标展示
- **实时性** - 确保数据的及时性和准确性
- **可操作性** - 为数据提供相应的操作入口

### 用户体验

- **加载状态** - 为数据加载提供适当的状态指示
- **错误处理** - 优雅处理数据获取失败的情况
- **个性化** - 支持用户自定义仪表盘内容

## 常见问题

### Q: 如何自定义快捷功能的颜色？

A: DuxDashboardQuick 组件会自动循环使用预设的颜色方案，也可以在数据中指定 `color` 属性。

### Q: 诗词API获取失败怎么办？

A: DuxDashboardHelloBig 组件在诗词API获取失败时会显示传入的 `desc` 属性，建议总是提供备用描述文本。

### Q: 如何实现数据的实时更新？

A: 可以使用定时器或WebSocket等方式定期更新数据，组件会自动响应数据变化。

### Q: 如何调整快捷功能的布局？

A: 通过 `col` 属性控制列数，组件会自动处理响应式布局，在小屏幕上会减少列数。
