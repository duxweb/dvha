<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 图标 -->
      <div class="mb-8">
        <div class="text-8xl font-bold text-gray-300 mb-4">404</div>
        <div class="i-tabler:face-sad text-6xl text-gray-400 mx-auto"></div>
      </div>

      <!-- 错误信息 -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
        <p class="text-gray-600">抱歉，您访问的页面无法找到</p>
      </div>

      <!-- 操作按钮 -->
      <div class="space-y-3 mb-8">
        <button
          @click="goHome"
          class="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <div class="i-tabler:home mr-2"></div>
          返回首页
        </button>

        <button
          @click="goBack"
          class="w-full flex items-center justify-center px-6 py-3 border text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          <div class="i-tabler:arrow-left mr-2"></div>
          返回上页
        </button>
      </div>

      <!-- 底部信息 -->
      <p class="text-xs text-gray-400">
        错误代码: {{ errorCode }} | {{ currentTime }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const errorCode = ref('ERR_404_NOT_FOUND')

const currentTime = computed(() => {
  return new Date().toLocaleString('zh-CN')
})

const goHome = () => {
  window.location.href = '/'
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    goHome()
  }
}
</script>
