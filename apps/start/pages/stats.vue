<script setup lang="ts">
import { DuxCard, DuxChart, DuxMedia, DuxPage, DuxStatsNumber, DuxStatsRealTime } from '@duxweb/dvha-pro'
import { NAlert, NButton, NDatePicker } from 'naive-ui'
import { ref } from 'vue'

// 实时数据卡片
const realTimeCards = ref([
  {
    label: '待付款',
    value: 639,
    color: 'text-warning',
  },
  {
    label: '待发货',
    value: 320,
    color: 'text-info',
  },
  {
    label: '待售后',
    value: 178,
    color: 'text-primary',
  },
  {
    label: '待评价',
    value: 245,
    color: 'text-success',
  },
  {
    label: '待处理投诉',
    value: 8,
    color: 'text-error',
  },
  {
    label: '违规商品',
    value: 13,
    color: 'text-error',
  },
])

// 实时数据图表（双图表）
const realTimeCharts = ref([
  {
    title: '交易金额(元)',
    value: '2,434.23',
    subtitle: '较昨日',
    change: 0.9,
    changeType: 'up' as const,
    data: [2100, 2200, 2150, 2400, 2300, 2500, 2434],
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  {
    title: '订单数',
    value: 894,
    subtitle: '较昨日',
    change: 0.9,
    changeType: 'down' as const,
    data: [800, 850, 920, 880, 900, 870, 894],
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
])

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
      value: [4.9, 4.8, 4.9, 4.7, 4.6, 4.8],
    },
  ],
})

// 转化漏斗数据
const funnelData = ref([
  {
    name: '查看商品',
    rate: '100%',
    metrics: [
      { label: '浏览人数', value: '3400' },
      { label: '访问量', value: '14' },
      { label: '人均访问次数', value: '817' },
    ],
  },
  {
    name: '查看详情',
    rate: '79.21%',
    metrics: [
      { label: '详情人数', value: '2346' },
      { label: '详情访问量', value: '190' },
      { label: '人均访问详情次数', value: '129' },
    ],
  },
  {
    name: '加购',
    rate: '45.18%',
    metrics: [
      { label: '加购人数', value: '835' },
      { label: '加购商品量', value: '993' },
      { label: '人均加购数量', value: '71' },
    ],
  },
  {
    name: '下单',
    rate: '12.31%',
    metrics: [
      { label: '下单人数', value: '380' },
      { label: '下单商品量', value: '690' },
      { label: '人均下单金额', value: '234,245' },
    ],
  },
])

// 随机生成数据的函数
function generateRandomFunnelData() {
  const baseVisitors = Math.floor(Math.random() * 2000) + 2000 // 2000-4000之间

  // 生成递减的转化率
  const detailRate = Math.floor(Math.random() * 30) + 60 // 60-90%
  const cartRate = Math.floor(Math.random() * 25) + 30 // 30-55%
  const orderRate = Math.floor(Math.random() * 15) + 8 // 8-23%

  funnelData.value = [
    {
      name: '查看商品',
      rate: '100%',
      metrics: [
        { label: '浏览人数', value: baseVisitors.toLocaleString() },
        { label: '访问量', value: Math.floor(Math.random() * 20 + 10).toString() },
        { label: '人均访问次数', value: Math.floor(Math.random() * 500 + 300).toString() },
      ],
    },
    {
      name: '查看详情',
      rate: `${detailRate.toFixed(2)}%`,
      metrics: [
        { label: '详情人数', value: Math.floor(baseVisitors * detailRate / 100).toLocaleString() },
        { label: '详情访问量', value: Math.floor(Math.random() * 100 + 100).toString() },
        { label: '人均访问详情次数', value: Math.floor(Math.random() * 100 + 80).toString() },
      ],
    },
    {
      name: '加购',
      rate: `${cartRate.toFixed(2)}%`,
      metrics: [
        { label: '加购人数', value: Math.floor(baseVisitors * cartRate / 100).toLocaleString() },
        { label: '加购商品量', value: Math.floor(baseVisitors * cartRate / 100 * 1.2).toLocaleString() },
        { label: '人均加购数量', value: Math.floor(Math.random() * 50 + 30).toString() },
      ],
    },
    {
      name: '下单',
      rate: `${orderRate.toFixed(2)}%`,
      metrics: [
        { label: '下单人数', value: Math.floor(baseVisitors * orderRate / 100).toLocaleString() },
        { label: '下单商品量', value: Math.floor(baseVisitors * orderRate / 100 * 1.8).toLocaleString() },
        { label: '人均下单金额', value: (Math.floor(Math.random() * 100000) + 50000).toLocaleString() },
      ],
    },
  ]
}

// 初始化时生成随机数据
generateRandomFunnelData()

// 可以定时刷新数据（可选）
// setInterval(generateRandomFunnelData, 30000) // 每30秒刷新一次
</script>

<template>
  <DuxPage :card="false">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 min-w-0 flex flex-col gap-4">
        <DuxStatsRealTime
          title="实时数据"
          subtitle="截止至 2022/06/30 12:00"
          :cards="realTimeCards"
          :charts="realTimeCharts"
          style="min-height: 300px;"
        />

        <DuxCard title="店铺数据" content-class="flex flex-col gap-4" footer-bordered>
          <NAlert type="info">
            欢迎使用 Dux Vue Headless Admin 管理后台
          </NAlert>

          <div class="flex flex-col lg:flex-row gap-4 p-4">
            <div class="flex flex-col w-40">
              <div class="flex gap-1 items-center text-muted">
                店铺等级

                <div class="flex gap-1">
                  <div class="size-3 rounded bg-warning" />
                  <div class="size-3 rounded bg-warning" />
                  <div class="size-3 rounded bg-warning" />
                  <div class="size-3 rounded bg-elevated" />
                  <div class="size-3 rounded bg-elevated" />
                </div>
              </div>
              <div>当前 <span class="text-error text-3xl font-bold">1</span> 级</div>
              <div class="text-muted">
                <span class="text-error">1</span> 级可享受普通店铺特权
              </div>
            </div>
            <div class="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 overflow-hidden h-20">
              <DuxStatsNumber
                title="支付转化率"
                value="10.00%"
                subtitle="较昨日"
                :change="10"
                change-type="up"
              />
              <DuxStatsNumber
                title="支付转化率"
                value="10.00%"
                subtitle="较昨日"
                :change="10"
                change-type="up"
              />
              <DuxStatsNumber
                title="支付转化率"
                value="10.00%"
                subtitle="较昨日"
                :change="10"
                change-type="up"
              />
              <DuxStatsNumber
                title="支付转化率"
                value="10.00%"
                subtitle="较昨日"
                :change="10"
                change-type="up"
              />
            </div>
          </div>

          <template #footer>
            <div class="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 overflow-hidden h-12">
              <DuxMedia title="实时访客" desc="2022/06/30 12:00">
                <template #image>
                  <div class="p-2 bg-primary/10 rounded-full text-primary">
                    <div class="i-tabler:user size-6" />
                  </div>
                </template>
              </DuxMedia>

              <DuxMedia title="流量贡献 No.1" desc="昨日移动端访问 1200 次">
                <template #image>
                  <div class="p-2 bg-info/10 rounded-full text-info">
                    <div class="i-tabler:smart-home size-6" />
                  </div>
                </template>
              </DuxMedia>

              <DuxMedia title="商品排行 No.1" desc="昨日您的 Iphone 15 销量 1200 件">
                <template #image>
                  <div class="p-2 bg-warning/10 rounded-full text-warning">
                    <div class="i-tabler:crown size-6" />
                  </div>
                </template>
              </DuxMedia>

              <DuxMedia title="用户排行 No.1" desc="昨日 张三 购买 100 件">
                <template #image>
                  <div class="p-2 bg-success/10 rounded-full text-success">
                    <div class="i-tabler:user-circle size-6" />
                  </div>
                </template>
              </DuxMedia>
            </div>
          </template>
        </DuxCard>
      </div>
      <div class="lg:w-100 flex flex-col gap-4">
        <dux-stats-store title="官方自营旗舰店" avatar="https://picsum.photos/200/300" desc="店铺描述" style="height: 300px;">
          <template #header>
            <div>店铺评分</div>
            <div>描述 <span class="text-default">4.9</span> 服务 <span class="text-default">4.9</span> 物流 <span class="text-default">4.9</span></div>
          </template>
          <template #extra>
            <NButton>
              进入店铺
            </NButton>
          </template>
          <dux-stats-store-item label="可用余额" value="3000.00" />
          <dux-stats-store-item label="冻结金额" value="1000.00" />
          <dux-stats-store-item label="总余额" value="4000.00" />
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
        </dux-stats-store>

        <DuxCard title="店铺报告" content-size="none">
          <DuxChart type="radar" :option="chartOptions" height="285px" />
        </DuxCard>
      </div>
    </div>
    <div class="mt-4">
      <DuxCard title="转换详情">
        <template #headerExtra>
          <NDatePicker />
        </template>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div class="col-span-1 flex flex-col items-center gap-2 lg:gap-3.5 pt-6">
            <div class="bg-primary/30 shadow rounded w-full h-8" />
            <div class="text-muted">
              ↓ 80%
            </div>
            <div class="bg-primary/50 shadow rounded h-8" style="width: 80%;" />
            <div class="text-muted">
              ↓ 50%
            </div>
            <div class="bg-primary/70 shadow rounded h-8" style="width: 70%;" />
            <div class="text-muted">
              ↓ 20%
            </div>
            <div class="bg-primary/100 shadow rounded h-8" style="width: 50%;" />
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
