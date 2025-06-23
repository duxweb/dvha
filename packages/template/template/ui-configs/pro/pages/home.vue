<script setup lang="ts">
import { DuxCard, DuxChart, DuxDashboardQuick } from '@duxweb/dvha-pro'
import { NButton, NGi, NGrid } from 'naive-ui'
import { computed, ref } from 'vue'

// 基本统计数据
const stats = ref([
  {
    label: '总订单',
    icon: 'i-tabler:shopping-cart',
    value: 126,
  },
  {
    label: '总用户',
    icon: 'i-tabler:users',
    value: 89,
  },
  {
    label: '总收入',
    icon: 'i-tabler:currency-dollar',
    value: '¥12,543',
  },
])

// 图表数据
const chartData = computed(() => ({
  labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  data: [
    {
      name: '访问量',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
      color: '#18a058',
    },
  ],
}))
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- 欢迎区域 -->
    <DuxCard>
      <div class="text-center py-8">
        <div class="i-tabler:brand-vue text-6xl text-blue-600 mx-auto mb-6" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          欢迎使用 Dux Pro
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          基于 Vue 3 + Naive UI + Dux Pro 组件库构建的现代化管理后台，提供丰富的业务组件和开箱即用的功能
        </p>
      </div>
    </DuxCard>

    <!-- 统计卡片 -->
    <NGrid :cols="3" :x-gap="16">
      <NGi v-for="item in stats" :key="item.label">
        <DuxDashboardQuick
          :label="item.label"
          :icon="item.icon"
          :value="item.value"
        />
      </NGi>
    </NGrid>

    <!-- 图表区域 -->
    <DuxCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            数据概览
          </h3>
          <NButton size="small" type="primary">
            查看详情
          </NButton>
        </div>
      </template>
      <DuxChart :option="chartData" style="height: 300px;" />
    </DuxCard>

    <!-- Dux Pro 特性展示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:components text-4xl text-purple-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            丰富组件
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            提供丰富的业务组件，快速构建管理后台
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:chart-bar text-4xl text-green-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            数据可视化
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            内置图表组件，轻松展示数据分析结果
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:layout-dashboard text-4xl text-blue-600 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            页面布局
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            灵活的布局组件，适应各种业务场景
          </p>
        </div>
      </DuxCard>
    </div>

    <!-- 快速操作 -->
    <DuxCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          快速操作
        </h3>
      </template>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NButton block type="primary">
          <template #icon>
            <div class="i-tabler:plus" />
          </template>
          创建订单
        </NButton>
        <NButton block>
          <template #icon>
            <div class="i-tabler:users" />
          </template>
          用户管理
        </NButton>
        <NButton block>
          <template #icon>
            <div class="i-tabler:chart-bar" />
          </template>
          数据统计
        </NButton>
        <NButton block>
          <template #icon>
            <div class="i-tabler:settings" />
          </template>
          系统设置
        </NButton>
      </div>
    </DuxCard>

    <!-- 开始使用 -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border p-8 text-center">
      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        开始构建您的 Pro 应用
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Dux Pro 为您提供了构建现代化管理系统所需的所有专业组件
      </p>
      <div class="flex justify-center space-x-4">
        <a
          href="https://github.com/duxweb/dvha" target="_blank"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <div class="i-tabler:brand-github mr-2" />
          查看源码
        </a>
        <a href="#" class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium">
          <div class="i-tabler:book mr-2" />
          查看文档
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style>
