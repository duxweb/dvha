<script setup lang="ts">
import { NCard, NGrid, NGridItem } from 'naive-ui'

// 基础柱状图
const barData = {
  data: [
    { name: '一月', value: 120 },
    { name: '二月', value: 200 },
    { name: '三月', value: 150 },
    { name: '四月', value: 180 },
    { name: '五月', value: 220 },
    { name: '六月', value: 300 },
  ],
  name: '销售额',
}

// 堆叠柱状图
const stackBarData = {
  labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
  data: [
    { name: '产品A', data: [100, 150, 120, 180, 200, 250], stack: 'total' },
    { name: '产品B', data: [80, 120, 100, 140, 160, 200], stack: 'total' },
    { name: '产品C', data: [60, 90, 80, 110, 130, 150], stack: 'total' },
  ],
}

// 多系列柱状图
const multiBarData = {
  labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
  data: [
    { name: '销售额', data: [120, 200, 150, 180, 220, 300] },
    { name: '利润', data: [60, 100, 75, 90, 110, 150] },
    { name: '成本', data: [40, 80, 60, 70, 85, 120] },
  ],
}

// 水平柱状图
const horizontalBarData = {
  data: [
    { name: '产品A', value: 300 },
    { name: '产品B', value: 250 },
    { name: '产品C', value: 200 },
    { name: '产品D', value: 180 },
    { name: '产品E', value: 150 },
  ],
  horizontal: true,
}

// 基础折线图
const lineData = {
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [
    { name: '访问量', data: [120, 132, 101, 134, 90, 230, 210] },
    { name: '下载量', data: [220, 182, 191, 234, 290, 330, 310] },
  ],
  smooth: true,
}

// 堆叠面积图
const stackLineData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  data: [
    { name: '邮件营销', data: [120, 132, 101, 134, 90, 230], stack: 'total' },
    { name: '联盟广告', data: [220, 182, 191, 234, 290, 330], stack: 'total' },
    { name: '视频广告', data: [150, 232, 201, 154, 190, 330], stack: 'total' },
    { name: '直接访问', data: [320, 332, 301, 334, 390, 330], stack: 'total' },
  ],
}

// 饼图
const pieData = {
  data: [
    { name: 'Chrome', value: 335 },
    { name: 'Safari', value: 310 },
    { name: 'Firefox', value: 234 },
    { name: 'Edge', value: 135 },
    { name: 'Opera', value: 48 },
  ],
}

// 环形图
const ringData = {
  data: [
    { name: '完成', value: 75 },
    { name: '进行中', value: 15 },
    { name: '未开始', value: 10 },
  ],
  ringLabel: '项目进度',
}

// 玫瑰图
const roseData = {
  data: [
    { name: '玫瑰1', value: 40 },
    { name: '玫瑰2', value: 38 },
    { name: '玫瑰3', value: 32 },
    { name: '玫瑰4', value: 30 },
    { name: '玫瑰5', value: 28 },
  ],
}

// 雷达图
const radarData = {
  indicator: [
    { name: '销售', max: 100 },
    { name: '管理', max: 100 },
    { name: '信息技术', max: 100 },
    { name: '客服', max: 100 },
    { name: '研发', max: 100 },
    { name: '市场', max: 100 },
  ],
  data: [
    {
      value: [80, 70, 60, 80, 90, 70],
      name: '预算分配',
    },
    {
      value: [90, 80, 70, 70, 80, 80],
      name: '实际开销',
    },
  ],
}

// 漏斗图
const funnelData = {
  data: [
    { name: '访问', value: 60 },
    { name: '咨询', value: 40 },
    { name: '订单', value: 20 },
    { name: '点击', value: 80 },
    { name: '付款', value: 12 },
  ],
}

// 矩形树图
const treeMapData = {
  name: ['公司组织架构', '项目分布情况'],
  data: [
    [
      {
        name: '技术部',
        value: 100,
        children: [
          { name: '前端', value: 40 },
          { name: '后端', value: 35 },
          { name: 'UI设计', value: 25 },
        ],
      },
      {
        name: '销售部',
        value: 80,
        children: [
          { name: '华北', value: 30 },
          { name: '华南', value: 25 },
          { name: '华东', value: 25 },
        ],
      },
      {
        name: '市场部',
        value: 60,
        children: [
          { name: '推广', value: 35 },
          { name: '运营', value: 25 },
        ],
      },
    ],
    [
      {
        name: '移动端项目',
        value: 120,
        children: [
          { name: 'iOS应用', value: 50 },
          { name: 'Android应用', value: 45 },
          { name: '小程序', value: 25 },
        ],
      },
      {
        name: 'Web项目',
        value: 90,
        children: [
          { name: '管理后台', value: 35 },
          { name: '官网', value: 30 },
          { name: '商城', value: 25 },
        ],
      },
      {
        name: '数据项目',
        value: 70,
        children: [
          { name: '数据分析', value: 40 },
          { name: '报表系统', value: 30 },
        ],
      },
    ],
  ],
}

// 12色彩调试柱状图
const colorDebugBarData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  data: [
    { name: '红色系', data: [120, 132, 101, 134, 90, 230, 210, 180, 160, 140, 120, 100] },
    { name: '橙色系', data: [220, 182, 191, 234, 290, 330, 310, 280, 260, 240, 220, 200] },
    { name: '黄色系', data: [150, 232, 201, 154, 190, 330, 280, 250, 230, 210, 190, 170] },
    { name: '黄绿系', data: [320, 332, 301, 334, 390, 330, 350, 320, 300, 280, 260, 240] },
    { name: '绿色系', data: [180, 200, 180, 200, 220, 250, 230, 210, 190, 170, 150, 130] },
    { name: '青绿系', data: [280, 300, 280, 300, 320, 350, 330, 310, 290, 270, 250, 230] },
    { name: '青色系', data: [160, 180, 160, 180, 200, 230, 210, 190, 170, 150, 130, 110] },
    { name: '蓝色系', data: [240, 260, 240, 260, 280, 310, 290, 270, 250, 230, 210, 190] },
    { name: '蓝紫系', data: [200, 220, 200, 220, 240, 270, 250, 230, 210, 190, 170, 150] },
    { name: '紫色系', data: [300, 320, 300, 320, 340, 370, 350, 330, 310, 290, 270, 250] },
    { name: '紫红系', data: [140, 160, 140, 160, 180, 210, 190, 170, 150, 130, 110, 90] },
    { name: '深红系', data: [260, 280, 260, 280, 300, 330, 310, 290, 270, 250, 230, 210] },
  ],
}

// 迷你图表数据
const miniBarData = {
  data: [
    { name: 'A', value: 100 },
    { name: 'B', value: 200 },
    { name: 'C', value: 150 },
    { name: 'D', value: 180 },
    { name: 'E', value: 120 },
  ],
  min: true,
}

const miniStackBarData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  data: [
    { name: '收入', data: [100, 120, 110, 140], stack: 'total' },
    { name: '支出', data: [80, 90, 85, 100], stack: 'total' },
  ],
  min: true,
}

const miniHorizontalBarData = {
  data: [
    { name: '产品A', value: 85 },
    { name: '产品B', value: 92 },
    { name: '产品C', value: 78 },
  ],
  horizontal: true,
  min: true,
}

const miniLineData = {
  labels: ['1', '2', '3', '4', '5', '6', '7'],
  data: [{ name: '趋势', data: [10, 20, 15, 25, 30, 22, 28] }],
  min: true,
}

const miniSmoothLineData = {
  labels: ['周一', '周二', '周三', '周四', '周五'],
  data: [{ name: '访问量', data: [120, 180, 150, 200, 170] }],
  smooth: true,
  min: true,
}

const miniStackLineData = {
  labels: ['1月', '2月', '3月', '4月'],
  data: [
    { name: '线上', data: [50, 60, 55, 70], stack: 'total' },
    { name: '线下', data: [30, 40, 35, 50], stack: 'total' },
  ],
  min: true,
}

const miniPieData = {
  data: [
    { name: '成功', value: 70 },
    { name: '失败', value: 30 },
  ],
  min: true,
}

const miniRingData = {
  data: [
    { name: '已完成', value: 85 },
    { name: '进行中', value: 15 },
  ],
  ringLabel: '进度',
  min: true,
}

const miniRoseData = {
  data: [
    { name: '类型A', value: 25 },
    { name: '类型B', value: 35 },
    { name: '类型C', value: 40 },
  ],
  min: true,
}

const miniRadarData = {
  indicator: [
    { name: '速度', max: 100 },
    { name: '质量', max: 100 },
    { name: '效率', max: 100 },
    { name: '稳定', max: 100 },
  ],
  data: [
    {
      value: [80, 90, 85, 75],
      name: '指标',
    },
  ],
  min: true,
}

const miniFunnelData = {
  data: [
    { name: '浏览', value: 100 },
    { name: '点击', value: 80 },
    { name: '购买', value: 60 },
    { name: '支付', value: 40 },
  ],
  min: true,
}

const miniTreeMapData = {
  data: [
    {
      name: '技术',
      value: 60,
      children: [
        { name: '前端', value: 30 },
        { name: '后端', value: 30 },
      ],
    },
    {
      name: '产品',
      value: 40,
      children: [
        { name: '设计', value: 20 },
        { name: '运营', value: 20 },
      ],
    },
  ],
  min: true,
}
</script>

<template>
  <dux-page :card="false">
    <NGrid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <!-- 基础柱状图 -->
      <NGridItem>
        <NCard title="基础柱状图" size="small">
          <dux-chart
            type="bar"
            class="h-250px"
            :option="barData"
          />
        </NCard>
      </NGridItem>

      <!-- 堆叠柱状图 -->
      <NGridItem>
        <NCard title="堆叠柱状图" size="small">
          <dux-chart
            type="bar"
            class="h-250px"
            :option="stackBarData"
          />
        </NCard>
      </NGridItem>

      <!-- 多系列柱状图 -->
      <NGridItem>
        <NCard title="多系列柱状图" size="small">
          <dux-chart
            type="bar"
            class="h-250px"
            :option="multiBarData"
          />
        </NCard>
      </NGridItem>

      <!-- 水平柱状图 -->
      <NGridItem>
        <NCard title="水平柱状图" size="small">
          <dux-chart
            type="bar"
            class="h-250px"
            :option="horizontalBarData"
          />
        </NCard>
      </NGridItem>

      <!-- 基础折线图 -->
      <NGridItem>
        <NCard title="基础折线图" size="small">
          <dux-chart
            type="line"
            class="h-250px"
            :option="lineData"
          />
        </NCard>
      </NGridItem>

      <!-- 堆叠面积图 -->
      <NGridItem>
        <NCard title="堆叠面积图" size="small">
          <dux-chart
            type="line"
            class="h-250px"
            :option="stackLineData"
          />
        </NCard>
      </NGridItem>

      <!-- 饼图 -->
      <NGridItem>
        <NCard title="饼图" size="small">
          <dux-chart
            type="pie"
            class="h-250px"
            :option="pieData"
          />
        </NCard>
      </NGridItem>

      <!-- 环形图 -->
      <NGridItem>
        <NCard title="环形图" size="small">
          <dux-chart
            type="ring"
            class="h-250px"
            :option="ringData"
          />
        </NCard>
      </NGridItem>

      <!-- 玫瑰图 -->
      <NGridItem>
        <NCard title="玫瑰图" size="small">
          <dux-chart
            type="rose"
            class="h-250px"
            :option="roseData"
          />
        </NCard>
      </NGridItem>

      <!-- 雷达图 -->
      <NGridItem>
        <NCard title="雷达图" size="small">
          <dux-chart
            type="radar"
            class="h-250px"
            :option="radarData"
          />
        </NCard>
      </NGridItem>

      <!-- 漏斗图 -->
      <NGridItem>
        <NCard title="漏斗图" size="small">
          <dux-chart
            type="funnel"
            class="h-250px"
            :option="funnelData"
          />
        </NCard>
      </NGridItem>

      <!-- 矩形树图 -->
      <NGridItem>
        <NCard title="矩形树图" size="small">
          <dux-chart
            type="treemap"
            class="h-250px"
            :option="treeMapData"
          />
        </NCard>
      </NGridItem>

      <!-- 12色彩调试柱状图 -->
      <NGridItem span="1 s:2 m:3 l:4">
        <NCard title="12色彩调试柱状图" size="small">
          <dux-chart
            type="bar"
            class="h-400px"
            :option="colorDebugBarData"
          />
        </NCard>
      </NGridItem>

      <!-- 迷你图表 -->
      <NGridItem span="1 s:2 m:3 l:4">
        <NCard title="迷你图表" size="small">
          <div class="grid grid-cols-4 gap-4">
            <!-- 第一行 -->
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                柱状图
              </div>
              <dux-chart
                type="bar"
                class="h-60px"
                :option="miniBarData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                堆叠柱状图
              </div>
              <dux-chart
                type="bar"
                class="h-60px"
                :option="miniStackBarData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                水平柱状图
              </div>
              <dux-chart
                type="bar"
                class="h-60px"
                :option="miniHorizontalBarData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                折线图
              </div>
              <dux-chart
                type="line"
                class="h-60px"
                :option="miniLineData"
              />
            </div>

            <!-- 第二行 -->
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                平滑折线图
              </div>
              <dux-chart
                type="line"
                class="h-60px"
                :option="miniSmoothLineData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                堆叠面积图
              </div>
              <dux-chart
                type="line"
                class="h-60px"
                :option="miniStackLineData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                饼图
              </div>
              <dux-chart
                type="pie"
                class="h-60px"
                :option="miniPieData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                环形图
              </div>
              <dux-chart
                type="ring"
                class="h-60px"
                :option="miniRingData"
              />
            </div>

            <!-- 第三行 -->
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                玫瑰图
              </div>
              <dux-chart
                type="rose"
                class="h-60px"
                :option="miniRoseData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                雷达图
              </div>
              <dux-chart
                type="radar"
                class="h-60px"
                :option="miniRadarData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                漏斗图
              </div>
              <dux-chart
                type="funnel"
                class="h-60px"
                :option="miniFunnelData"
              />
            </div>
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">
                矩形树图
              </div>
              <dux-chart
                type="treemap"
                class="h-60px"
                :option="miniTreeMapData"
              />
            </div>
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
  </dux-page>
</template>
