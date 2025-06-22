<script setup lang="ts">
import { DuxCard, DuxChart, DuxMedia, DuxPage, DuxStatsNumber, DuxStatsRealTime, DuxStatsStore, DuxStatsStoreItem } from '@duxweb/dvha-pro'
import { NAlert, NButton, NDatePicker, NScrollbar } from 'naive-ui'
import { onMounted, ref } from 'vue'

// 生成随机数的工具函数
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals))
}

// 实时数据卡片
const realTimeCards = ref([
  {
    label: '今日订单',
    value: randomBetween(150, 500),
    color: 'text-primary',
  },
  {
    label: '待付款',
    value: randomBetween(30, 120),
    color: 'text-warning',
  },
  {
    label: '待发货',
    value: randomBetween(20, 80),
    color: 'text-info',
  },
  {
    label: '待收货',
    value: randomBetween(40, 150),
    color: 'text-success',
  },
  {
    label: '退款申请',
    value: randomBetween(2, 15),
    color: 'text-error',
  },
  {
    label: '库存预警',
    value: randomBetween(5, 25),
    color: 'text-error',
  },
])

// 实时数据图表（双图表）
const realTimeCharts = ref([
  {
    title: '今日销售额(元)',
    value: (randomBetween(50000, 200000)).toLocaleString(),
    subtitle: '较昨日',
    change: randomFloat(-15, 25, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
    data: Array.from({ length: 7 }, () => randomBetween(40000, 180000)),
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  {
    title: '今日订单数',
    value: randomBetween(200, 800),
    subtitle: '较昨日',
    change: randomFloat(-10, 30, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
    data: Array.from({ length: 7 }, () => randomBetween(150, 700)),
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
])

// 店铺数据统计
const storeStats = ref([
  {
    title: '支付转化率',
    value: `${randomFloat(8, 15, 2)}%`,
    subtitle: '较昨日',
    change: randomFloat(-5, 8, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
  },
  {
    title: '访客数',
    value: randomBetween(2000, 8000).toLocaleString(),
    subtitle: '较昨日',
    change: randomFloat(-20, 35, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
  },
  {
    title: '浏览量',
    value: randomBetween(15000, 50000).toLocaleString(),
    subtitle: '较昨日',
    change: randomFloat(-15, 40, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
  },
  {
    title: '客单价',
    value: `¥${randomFloat(180, 680, 2)}`,
    subtitle: '较昨日',
    change: randomFloat(-12, 25, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
  },
  {
    title: '复购率',
    value: `${randomFloat(25, 45, 2)}%`,
    subtitle: '较昨日',
    change: randomFloat(-8, 12, 1),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
  },
  {
    title: '商品评分',
    value: randomFloat(4.2, 4.9, 1),
    subtitle: '较昨日',
    change: randomFloat(-0.5, 0.3, 2),
    changeType: Math.random() > 0.5 ? 'up' : 'down' as const,
  },
])

// 店铺等级
const storeLevel = ref(randomBetween(1, 5))

// 店铺余额信息
const storeBalance = ref({
  available: randomFloat(50000, 200000, 2),
  frozen: randomFloat(5000, 30000, 2),
})

// 店铺报告雷达图配置
const chartOptions = ref({
  indicator: [
    { name: '商品描述', max: 5 },
    { name: '服务态度', max: 5 },
    { name: '物流速度', max: 5 },
    { name: '商品质量', max: 5 },
    { name: '售后服务', max: 5 },
    { name: '购物体验', max: 5 },
  ],
  data: [
    {
      name: '当前评分',
      value: Array.from({ length: 6 }, () => randomFloat(4.0, 5.0, 1)),
    },
  ],
})

// 转化漏斗数据
const funnelData = ref([
  {
    name: '商品浏览',
    rate: '100%',
    metrics: [
      { label: '浏览人数', value: '0' },
      { label: '浏览次数', value: '0' },
      { label: '平均停留时间', value: '0' },
    ],
  },
  {
    name: '商品详情',
    rate: '0%',
    metrics: [
      { label: '详情人数', value: '0' },
      { label: '详情访问量', value: '0' },
      { label: '跳出率', value: '0' },
    ],
  },
  {
    name: '加入购物车',
    rate: '0%',
    metrics: [
      { label: '加购人数', value: '0' },
      { label: '加购商品数', value: '0' },
      { label: '加购转化率', value: '0' },
    ],
  },
  {
    name: '下单支付',
    rate: '0%',
    metrics: [
      { label: '下单人数', value: '0' },
      { label: '订单金额', value: '0' },
      { label: '支付成功率', value: '0' },
    ],
  },
])

// 随机生成转化漏斗数据的函数
function generateRandomFunnelData() {
  const baseVisitors = randomBetween(8000, 25000) // 基础访问量

  // 生成递减的转化率
  const detailRate = randomFloat(60, 85)
  const cartRate = randomFloat(15, 35)
  const orderRate = randomFloat(5, 18)

  const detailVisitors = Math.floor(baseVisitors * detailRate / 100)
  const cartVisitors = Math.floor(baseVisitors * cartRate / 100)
  const orderVisitors = Math.floor(baseVisitors * orderRate / 100)

  funnelData.value = [
    {
      name: '商品浏览',
      rate: '100%',
      metrics: [
        { label: '浏览人数', value: baseVisitors.toLocaleString() },
        { label: '浏览次数', value: Math.floor(baseVisitors * randomFloat(2.5, 4.5)).toLocaleString() },
        { label: '平均停留时间', value: `${randomFloat(1.5, 4.5, 1)}分钟` },
      ],
    },
    {
      name: '商品详情',
      rate: `${detailRate.toFixed(1)}%`,
      metrics: [
        { label: '详情人数', value: detailVisitors.toLocaleString() },
        { label: '详情访问量', value: Math.floor(detailVisitors * randomFloat(1.2, 2.8)).toLocaleString() },
        { label: '跳出率', value: `${randomFloat(35, 65, 1)}%` },
      ],
    },
    {
      name: '加入购物车',
      rate: `${cartRate.toFixed(1)}%`,
      metrics: [
        { label: '加购人数', value: cartVisitors.toLocaleString() },
        { label: '加购商品数', value: Math.floor(cartVisitors * randomFloat(1.3, 2.5)).toLocaleString() },
        { label: '加购转化率', value: `${(cartRate / detailRate * 100).toFixed(1)}%` },
      ],
    },
    {
      name: '下单支付',
      rate: `${orderRate.toFixed(1)}%`,
      metrics: [
        { label: '下单人数', value: orderVisitors.toLocaleString() },
        { label: '订单金额', value: `¥${(orderVisitors * randomFloat(200, 800)).toLocaleString()}` },
        { label: '支付成功率', value: `${randomFloat(88, 96, 1)}%` },
      ],
    },
  ]
}

// 刷新所有数据
function refreshAllData() {
  // 刷新实时数据卡片
  realTimeCards.value.forEach((card) => {
    switch (card.label) {
      case '今日订单':
        card.value = randomBetween(150, 500)
        break
      case '待付款':
        card.value = randomBetween(30, 120)
        break
      case '待发货':
        card.value = randomBetween(20, 80)
        break
      case '待收货':
        card.value = randomBetween(40, 150)
        break
      case '退款申请':
        card.value = randomBetween(2, 15)
        break
      case '库存预警':
        card.value = randomBetween(5, 25)
        break
    }
  })

  // 刷新实时图表数据
  realTimeCharts.value.forEach((chart) => {
    if (chart.title === '今日销售额(元)') {
      chart.value = randomBetween(50000, 200000).toLocaleString()
      chart.data = Array.from({ length: 7 }, () => randomBetween(40000, 180000))
    }
    else if (chart.title === '今日订单数') {
      chart.value = randomBetween(200, 800)
      chart.data = Array.from({ length: 7 }, () => randomBetween(150, 700))
    }
    chart.change = randomFloat(-15, 25, 1)
    chart.changeType = Math.random() > 0.5 ? 'up' : 'down'
  })

  // 刷新店铺统计数据
  storeStats.value.forEach((stat) => {
    stat.change = randomFloat(-15, 25, 1)
    stat.changeType = Math.random() > 0.5 ? 'up' : 'down'

    switch (stat.title) {
      case '支付转化率':
        stat.value = `${randomFloat(8, 15, 2)}%`
        break
      case '访客数':
        stat.value = randomBetween(2000, 8000).toLocaleString()
        break
      case '浏览量':
        stat.value = randomBetween(15000, 50000).toLocaleString()
        break
      case '客单价':
        stat.value = `¥${randomFloat(180, 680, 2)}`
        break
      case '复购率':
        stat.value = `${randomFloat(25, 45, 2)}%`
        break
      case '商品评分':
        stat.value = randomFloat(4.2, 4.9, 1)
        break
    }
  })

  // 刷新店铺余额
  storeBalance.value = {
    available: randomFloat(50000, 200000, 2),
    frozen: randomFloat(5000, 30000, 2),
  }

  // 刷新雷达图数据
  chartOptions.value.data[0].value = Array.from({ length: 6 }, () => randomFloat(4.0, 5.0, 1))

  // 刷新转化漏斗数据
  generateRandomFunnelData()
}

// 初始化时生成随机数据
onMounted(() => {
  generateRandomFunnelData()
})

// 定时刷新数据（每60秒）
// setInterval(refreshAllData, 60000)
</script>

<template>
  <DuxPage :card="false">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 min-w-0 flex flex-col gap-4">
        <DuxStatsRealTime
          title="实时数据"
          :subtitle="`截止至 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`"
          :cards="realTimeCards"
          :charts="realTimeCharts"
          style="min-height: 300px;"
        />

        <DuxCard title="店铺数据" content-class="flex flex-col gap-4" footer-bordered>
          <NAlert type="info">
            欢迎使用商城管理系统，实时掌握店铺运营数据
          </NAlert>

          <div class="flex flex-col lg:flex-row gap-4 py-4">
            <div class="flex flex-col w-40">
              <div class="flex gap-1 items-center text-muted">
                店铺等级

                <div class="flex gap-1">
                  <div
                    v-for="i in 5" :key="i" class="size-3 rounded" :class="[
                      i <= storeLevel ? 'bg-warning' : 'bg-elevated',
                    ]"
                  />
                </div>
              </div>
              <div>当前 <span class="text-warning text-3xl font-bold">{{ storeLevel }}</span> 级</div>
              <div class="text-muted">
                <span class="text-warning">{{ storeLevel }}</span> 级店铺享受{{ storeLevel > 3 ? '高级' : '普通' }}特权
              </div>
            </div>
            <div class="h-20 flex-1 min-w-0">
              <NScrollbar x-scrollable>
                <div class="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
                  <DuxStatsNumber
                    v-for="stat in storeStats"
                    :key="stat.title"
                    :title="stat.title"
                    :value="stat.value"
                    :subtitle="stat.subtitle"
                    :change="stat.change"
                    :change-type="stat.changeType"
                  />
                </div>
              </NScrollbar>
            </div>
          </div>

          <template #footer>
            <div class="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 overflow-hidden h-12">
              <DuxMedia title="实时在线" :desc="`当前 ${randomBetween(180, 520)} 人在线购物`">
                <template #image>
                  <div class="p-2 bg-primary/10 rounded-full text-primary">
                    <div class="i-tabler:users size-6" />
                  </div>
                </template>
              </DuxMedia>

              <DuxMedia title="热销商品" :desc="`今日热销 ${randomBetween(50, 200)} 件商品`">
                <template #image>
                  <div class="p-2 bg-info/10 rounded-full text-info">
                    <div class="i-tabler:flame size-6" />
                  </div>
                </template>
              </DuxMedia>

              <DuxMedia title="新增会员" :desc="`今日新增 ${randomBetween(20, 80)} 位会员`">
                <template #image>
                  <div class="p-2 bg-warning/10 rounded-full text-warning">
                    <div class="i-tabler:user-plus size-6" />
                  </div>
                </template>
              </DuxMedia>

              <DuxMedia title="好评率" :desc="`本月好评率 ${randomFloat(95, 99, 1)}%`">
                <template #image>
                  <div class="p-2 bg-success/10 rounded-full text-success">
                    <div class="i-tabler:thumb-up size-6" />
                  </div>
                </template>
              </DuxMedia>
            </div>
          </template>
        </DuxCard>
      </div>
      <div class="lg:w-100 flex flex-col gap-4">
        <DuxStatsStore
          title="官方自营旗舰店"
          avatar="https://picsum.photos/200/300"
          desc="优质商品，诚信经营"
          style="height: 300px;"
        >
          <template #header>
            <div>店铺评分</div>
            <div>
              描述 <span class="text-default">{{ chartOptions.data[0].value[0] }}</span>
              服务 <span class="text-default">{{ chartOptions.data[0].value[1] }}</span>
              物流 <span class="text-default">{{ chartOptions.data[0].value[2] }}</span>
            </div>
          </template>
          <template #extra>
            <NButton @click="refreshAllData">
              刷新数据
            </NButton>
          </template>
          <DuxStatsStoreItem label="可用余额" :value="`¥${storeBalance.available.toLocaleString()}`" />
          <DuxStatsStoreItem label="冻结金额" :value="`¥${storeBalance.frozen.toLocaleString()}`" />
          <DuxStatsStoreItem label="总余额" :value="`¥${(storeBalance.available + storeBalance.frozen).toLocaleString()}`" />
          <template #footer>
            <div class="flex gap-2">
              <div class="flex-1">
                <NButton secondary block>
                  提现
                </NButton>
              </div>
              <div class="flex-1">
                <NButton secondary block type="primary">
                  充值
                </NButton>
              </div>
            </div>
          </template>
        </DuxStatsStore>

        <DuxCard title="店铺报告" content-size="none">
          <DuxChart type="radar" :option="chartOptions" height="285px" />
        </DuxCard>
      </div>
    </div>
    <div class="mt-4">
      <DuxCard title="销售转化漏斗">
        <template #headerExtra>
          <div class="flex gap-2">
            <NDatePicker />
            <NButton secondary @click="generateRandomFunnelData">
              刷新数据
            </NButton>
          </div>
        </template>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div class="col-span-1 flex flex-col items-center gap-2 lg:gap-3.5 pt-6">
            <div class="bg-primary/30 shadow rounded w-full h-8" />
            <div class="text-muted">
              ↓ {{ funnelData[1]?.rate }}
            </div>
            <div class="bg-primary/50 shadow rounded h-8" :style="`width: ${parseFloat(funnelData[1]?.rate)}%;`" />
            <div class="text-muted">
              ↓ {{ funnelData[2]?.rate }}
            </div>
            <div class="bg-primary/70 shadow rounded h-8" :style="`width: ${parseFloat(funnelData[2]?.rate)}%;`" />
            <div class="text-muted">
              ↓ {{ funnelData[3]?.rate }}
            </div>
            <div class="bg-primary/100 shadow rounded h-8" :style="`width: ${parseFloat(funnelData[3]?.rate)}%;`" />
          </div>
          <div class="col-span-2 flex flex-col divide-y divide-muted">
            <div v-for="item in funnelData" :key="item.name" class="flex gap-2 items-center py-4">
              <div class="flex-none w-20">
                {{ item.name }}
              </div>
              <div class="flex-none w-20 text-2xl">
                {{ item.rate }}
              </div>
              <div class="flex-1 min-w-0 items-center grid grid-cols-3">
                <div v-for="metric in item.metrics" :key="metric.label" class="flex flex-col gap-1 items-center">
                  <div class="text-muted">
                    {{ metric.label }}
                    <div class="i-tabler:help-circle-filled size-4 inline ml-1 text-muted/50" />
                  </div>
                  <div class="text-default">
                    {{ metric.value }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DuxCard>
    </div>
  </DuxPage>
</template>
