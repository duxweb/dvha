<script setup lang="ts">
import { DuxCard } from '@duxweb/dvha-pro'
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
  <div class="space-y-4">
    <!-- 欢迎区域 -->
    <DuxCard>
      <div class="text-center py-8">
        <div class="i-tabler:brand-vue text-4xl text-blue-600 mx-auto mb-4" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          欢迎使用 Dux Pro
        </h1>
        <p class="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          基于 Vue 3 + Naive UI + Dux Pro 组件库构建的现代化管理后台，提供丰富的业务组件和开箱即用的功能
        </p>
      </div>
    </DuxCard>

    <!-- Dux Pro 特性展示 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:components text-4xl text-purple-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            远程渲染
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            支持字符串渲染为 Vue 页面，远程组件动态加载
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:chart-bar text-4xl text-green-600 mb-6 mx-auto" />
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
          <div class="i-tabler:layout-dashboard text-4xl text-blue-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            动态渲染
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            页面布局支持动态渲染，运行时 UnoCSS 样式生成
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:forms text-4xl text-orange-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            表单组件
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            强大的表单构建器，支持各种表单验证
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:table text-4xl text-indigo-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            数据表格
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            功能完整的数据表格，支持排序、筛选、分页
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:palette text-4xl text-pink-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            主题定制
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            灵活的主题配置，支持深色模式和自定义色彩
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:shield-check text-4xl text-red-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            权限管理
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            完善的权限控制系统，角色和权限精细化管理
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:rocket text-4xl text-cyan-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            高性能
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            基于 Vue 3 构建，享受最新技术带来的性能提升
          </p>
        </div>
      </DuxCard>

      <DuxCard>
        <div class="text-center p-4">
          <div class="i-tabler:devices text-4xl text-teal-600 mb-6 mx-auto" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            响应式设计
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            完美适配桌面、平板、手机等各种设备
          </p>
        </div>
      </DuxCard>
    </div>

    <!-- 开始使用 -->
    <div class="bg-primary-50 dark:bg-primary-950 rounded-lg border border-primary/50 p-8 text-center">
      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        开始构建您的 Pro 应用
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Dux Pro 为您提供了构建现代化管理系统所需的所有专业组件
      </p>
      <div class="flex justify-center space-x-4">
        <a
          href="https://github.com/duxweb/dvha" target="_blank"
          class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
        >
          <div class="i-tabler:brand-github mr-2" />
          查看源码
        </a>
        <a
          href="https://duxweb.dux.plus/dvha/" target="_blank"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
        >
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
