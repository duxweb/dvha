<script setup lang="ts">
import { DuxCard, DuxCarousel, DuxChart, DuxDashboardQuick, DuxMedia, DuxWidgetConnect } from '@duxweb/dvha-pro'
import { NAvatar, NButton, NCalendar, NCard, NScrollbar, NTabPane, NTabs, NTag } from 'naive-ui'
import { computed, ref } from 'vue'

// 生成随机数的工具函数
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

// 顶部统计数据
const topStats = ref([
  {
    label: '今日订单',
    icon: 'i-tabler:shopping-cart',
    value: randomBetween(45, 180),
  },
  {
    label: '待发货',
    icon: 'i-tabler:truck',
    value: randomBetween(15, 65),
  },
  {
    label: '待处理售后',
    icon: 'i-tabler:headset',
    value: randomBetween(3, 18),
  },
])

// 订单趋势图表数据
const orderTrendData = ref({
  title: '近7天订单趋势',
  labels: ['12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08'],
  data: [
    {
      name: '订单量',
      type: 'bar',
      data: Array.from({ length: 7 }, () => randomBetween(80, 200)),
      color: '#18a058',
    },
    {
      name: '销售额(万)',
      type: 'line',
      data: Array.from({ length: 7 }, () => randomFloat(15, 45, 1)),
      color: '#2080f0',
    },
  ],
})

// 图表配置对象
const chartOption = computed(() => ({
  labels: orderTrendData.value.labels,
  data: orderTrendData.value.data,
  showLegend: true,
  showGrid: true,
  showXAxisLabel: true,
  showYAxisLabel: true,
}))

// 销售统计数据
const salesStats = ref([
  {
    title: '今日销售额',
    value: `¥${randomBetween(50000, 120000).toLocaleString()}`,
    change: randomFloat(-15, 25, 1),
    changeType: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
  },
  {
    title: '今日订单数',
    value: randomBetween(150, 350),
    change: randomFloat(-10, 30, 1),
    changeType: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
  },
  {
    title: '平均客单价',
    value: `¥${randomFloat(280, 580, 0)}`,
    change: randomFloat(-8, 15, 1),
    changeType: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
  },
  {
    title: '转化率',
    value: `${randomFloat(8, 18, 2)}%`,
    change: randomFloat(-3, 6, 1),
    changeType: (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down',
  },
])

// 订单数据（原任务数据）
const orderData = ref([
  {
    title: '苹果iPhone 15 Pro 256GB 天然钛色',
    section: '订单号：2024120800001',
    nickname: '张先生',
    status: 1,
    date: '12-08',
    amount: '¥8999',
  },
  {
    title: '小米14 Ultra 16GB+1TB 黑色',
    section: '订单号：2024120800002',
    nickname: '李女士',
    status: 2,
    date: '12-08',
    amount: '¥6999',
  },
  {
    title: '华为Mate60 Pro 12GB+256GB 雅川青',
    section: '订单号：2024120800003',
    nickname: '王先生',
    status: 3,
    date: '12-07',
    amount: '¥6999',
  },
  {
    title: '戴森V15 Detect 无绳吸尘器',
    section: '订单号：2024120800004',
    nickname: '赵女士',
    status: 1,
    date: '12-07',
    amount: '¥4990',
  },
  {
    title: 'Apple MacBook Pro 14英寸 M3芯片',
    section: '订单号：2024120800005',
    nickname: '刘先生',
    status: 2,
    date: '12-06',
    amount: '¥14999',
  },
  {
    title: 'Nike Air Jordan 1 Retro High OG',
    section: '订单号：2024120800006',
    nickname: '陈女士',
    status: 3,
    date: '12-06',
    amount: '¥1299',
  },
  {
    title: '海尔冰箱 BCD-452WDPCU1',
    section: '订单号：2024120800007',
    nickname: '孙先生',
    status: 1,
    date: '12-05',
    amount: '¥3299',
  },
  {
    title: '索尼WH-1000XM5 头戴式降噪耳机',
    section: '订单号：2024120800008',
    nickname: '周女士',
    status: 2,
    date: '12-05',
    amount: '¥2399',
  },
  {
    title: 'Levi\'s 501 经典直筒牛仔裤',
    section: '订单号：2024120800009',
    nickname: '吴先生',
    status: 3,
    date: '12-04',
    amount: '¥699',
  },
  {
    title: '美的空调 KFR-35GW/BP3DN8Y-PH200',
    section: '订单号：2024120800010',
    nickname: '郑女士',
    status: 1,
    date: '12-04',
    amount: '¥2899',
  },
  {
    title: 'SK-II 神仙水 230ml',
    section: '订单号：2024120800011',
    nickname: '何女士',
    status: 1,
    date: '12-03',
    amount: '¥1690',
  },
  {
    title: '小鹏汽车G9 智能座舱版',
    section: '订单号：2024120800012',
    nickname: '林先生',
    status: 2,
    date: '12-02',
    amount: '¥289999',
  },
  {
    title: 'Hermès Kelly 28 手袋 金棕色',
    section: '订单号：2024120800013',
    nickname: '王女士',
    status: 3,
    date: '12-01',
    amount: '¥89999',
  },
])

// 当前选中的tab
const currentTab = ref('1')

// 根据tab过滤数据
const filteredOrderData = computed(() => {
  const statusMap = {
    1: 1, // 待发货
    2: 2, // 配送中
    3: 3, // 已完成
  }
  return orderData.value.filter(item => item.status === statusMap[currentTab.value])
})

// 电商功能列表
const ecommerceFeatures = [
  {
    title: '商品管理',
    icon: 'i-tabler:package',
  },
  {
    title: '订单管理',
    icon: 'i-tabler:clipboard-list',
  },
  {
    title: '库存管理',
    icon: 'i-tabler:packages',
  },
  {
    title: '客户管理',
    icon: 'i-tabler:users',
  },
  {
    title: '营销活动',
    icon: 'i-tabler:speakerphone',
  },
  {
    title: '数据分析',
    icon: 'i-tabler:chart-bar',
  },
  {
    title: '财务管理',
    icon: 'i-tabler:coins',
  },
  {
    title: '客服中心',
    icon: 'i-tabler:headset',
  },
]

// 系统公告数据
const announcements = [
  {
    type: 'success' as const,
    tag: '活动',
    content: '双12购物节活动即将开始，优惠力度空前',
  },
  {
    type: 'info' as const,
    tag: '系统',
    content: '订单管理系统升级完成，新增批量处理功能',
  },
  {
    type: 'warning' as const,
    tag: '提醒',
    content: '部分商品库存紧张，请及时补货',
  },
  {
    type: 'info' as const,
    tag: '通知',
    content: '新增支付方式：支持微信分付、花呗分期',
  },
  {
    type: 'success' as const,
    tag: '活动',
    content: '新用户注册送100元优惠券活动进行中',
  },
  {
    type: 'info' as const,
    tag: '系统',
    content: '物流跟踪系统优化，支持实时位置查询',
  },
]

// 轮播图数据
const carouselData = [
  'https://picsum.photos/400/200?random=1',
  'https://picsum.photos/400/200?random=2',
  'https://picsum.photos/400/200?random=3',
  'https://picsum.photos/400/200?random=4',
]

// 刷新数据
function refreshData() {
  topStats.value.forEach((stat) => {
    switch (stat.label) {
      case '今日订单':
        stat.value = randomBetween(45, 180)
        break
      case '待发货':
        stat.value = randomBetween(15, 65)
        break
      case '待处理售后':
        stat.value = randomBetween(3, 18)
        break
    }
  })

  // 刷新图表数据
  orderTrendData.value.data[0].data = Array.from({ length: 7 }, () => randomBetween(80, 200))
  orderTrendData.value.data[1].data = Array.from({ length: 7 }, () => randomFloat(15, 45, 1))

  // 刷新销售统计数据
  salesStats.value.forEach((stat) => {
    stat.change = randomFloat(-15, 25, 1)
    stat.changeType = (Math.random() > 0.5 ? 'up' : 'down') as 'up' | 'down'

    switch (stat.title) {
      case '今日销售额':
        stat.value = `¥${randomBetween(50000, 120000).toLocaleString()}`
        break
      case '今日订单数':
        stat.value = randomBetween(150, 350)
        break
      case '平均客单价':
        stat.value = `¥${randomFloat(280, 580, 0)}`
        break
      case '转化率':
        stat.value = `${randomFloat(8, 18, 2)}%`
        break
    }
  })
}

// 获取订单状态显示
function getOrderStatusDisplay(status: number) {
  switch (status) {
    case 1:
      return { text: '待发货', class: 'text-warning bg-warning/10' }
    case 2:
      return { text: '配送中', class: 'text-info bg-info/10' }
    case 3:
      return { text: '已完成', class: 'text-success bg-success/10' }
    default:
      return { text: '未知', class: 'text-gray bg-gray/10' }
  }
}

// 获取变化指示器样式
function getChangeIndicator(change: number, changeType: 'up' | 'down') {
  const isPositive = changeType === 'up'
  return {
    icon: isPositive ? 'i-tabler:arrow-up' : 'i-tabler:arrow-down',
    class: isPositive ? 'text-success' : 'text-error',
    text: `${isPositive ? '+' : ''}${change}%`,
  }
}
</script>

<template>
  <DuxPage :card="false">
    <div class="flex gap-2 flex-col lg:flex-row">
      <div class="flex-1 flex flex-col gap-2 lg:w-1">
        <DuxDashboardHelloBig
          title="HELLO，店长"
          :data="topStats"
        />

        <div class="bg-primary rounded-sm text-white px-10 py-6 relative overflow-hidden flex justify-between">
          <div>
            <div class="text-xl">
              电商管理平台
            </div>
            <div class="text-sm opacity-60">
              基于 Vue3 和 Naive UI 的电商管理系统
            </div>
          </div>

          <div class="flex items-center text-lg italic">
            专业、高效、可靠
          </div>

          <div class="absolute top-7 -right-20 rounded-full size-40 bg-white/8" />
          <div class="absolute top-0 -right-20 rounded-full size-50 bg-white/8" />
          <div class="absolute -top-7 -right-18 rounded-full size-60 bg-white/8" />
        </div>

        <!-- 新增：订单趋势图表卡片 -->
        <DuxCard title="数据概览" content-class="flex flex-col gap-4">
          <template #headerExtra>
            <NButton size="small" text @click="refreshData">
              <template #icon>
                <div class="i-tabler:refresh size-4" />
              </template>
              刷新
            </NButton>
          </template>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="stat in salesStats" :key="stat.title" class="flex flex-col gap-2 p-4 rounded-lg bg-muted/30">
              <div class="text-sm text-muted">
                {{ stat.title }}
              </div>
              <div class="text-2xl font-bold text-default">
                {{ stat.value }}
              </div>
              <div class="flex items-center gap-1 text-xs">
                <div class="size-3" :class="[getChangeIndicator(stat.change, stat.changeType).icon, getChangeIndicator(stat.change, stat.changeType).class]" />
                <span :class="getChangeIndicator(stat.change, stat.changeType).class">
                  {{ getChangeIndicator(stat.change, stat.changeType).text }}
                </span>
                <span class="text-muted">较昨日</span>
              </div>
            </div>
          </div>

          <div class="h-80">
            <DuxChart
              type="bar"
              height="320px"
              :option="chartOption"
            />
          </div>
        </DuxCard>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-2">
          <div>
            <NCard
              class="shadow-sm"
              :bordered="false"
              title="订单管理"
              content-class="!p-0"
              :segmented="{
                content: true,
              }"
              size="small"
            >
              <template #header-extra>
                <NTabs v-model:value="currentTab" pane-class="!p-0" type="segment" size="small" animated class="!w-50">
                  <NTabPane name="1" tab="待发货" />
                  <NTabPane name="2" tab="配送中" />
                  <NTabPane name="3" tab="已完成" />
                </NTabs>
              </template>
              <NScrollbar>
                <div class="flex flex-col gap-4 p-4">
                  <DuxMedia v-for="(item, key) in filteredOrderData" :key="key">
                    {{ item.title }}
                    <template #image>
                      <NAvatar round class="!bg-primary">
                        {{ item.nickname.charAt(0) }}
                      </NAvatar>
                    </template>
                    <template #desc>
                      <div>{{ item.section }} <span class="text-primary">{{ item.nickname }}</span></div>
                    </template>
                    <template #extend>
                      <div class="flex items-center justify-center h-10 w-16 rounded" :class="getOrderStatusDisplay(item.status).class">
                        {{ getOrderStatusDisplay(item.status).text }}
                      </div>
                      <div class="text-success bg-success/10 flex flex-col gap-0 items-center justify-center h-10 w-16 rounded text-xs">
                        <div>{{ item.amount }}</div>
                        <div>{{ item.date }}</div>
                      </div>
                    </template>
                  </DuxMedia>
                </div>
              </NScrollbar>
            </NCard>
          </div>

          <div class="flex flex-col gap-4">
            <NCard
              class="shadow-sm"
              :bordered="false"
              size="small"
              title="营销日历"
              :segmented="{
                content: true,
              }"
            >
              <div>
                <NCalendar class="!h-92" />
              </div>
            </NCard>
          </div>
        </div>
      </div>
      <div class="flex-none flex flex-col gap-2 lg:w-86">
        <DuxCarousel
          :height="200"
          :data="carouselData"
        />
        <NCard
          class="shadow-sm"
          :bordered="false"
          title="平台公告"
          size="small"
          :segmented="{
            content: true,
          }"
        >
          <template #header-extra>
            <NButton size="small" text @click="refreshData">
              刷新
            </NButton>
          </template>
          <div class="flex flex-col gap-2">
            <DuxMedia v-for="(item, index) in announcements" :key="index" @click="() => {}">
              <template #prefix>
                <NTag :type="item.type" size="small">
                  {{ item.tag }}
                </NTag>
              </template>
              {{ item.content }}
            </DuxMedia>
          </div>
        </NCard>

        <NCard
          class="shadow-sm"
          :bordered="false"
          size="small"
          title="常用功能"
          :segmented="{
            content: true,
          }"
        >
          <DuxDashboardQuick
            :col="4"
            :data="ecommerceFeatures"
          />
        </NCard>

        <DuxWidgetConnect title="电商服务升级" desc="助力商家提升销售业绩">
          <NButton type="primary" size="small">
            了解更多
          </NButton>
        </DuxWidgetConnect>
      </div>
    </div>
  </DuxPage>
</template>
