<template>
  <div class="p-6">
    <!-- 欢迎区域 -->
    <div class="bg-white rounded-lg shadow-sm border p-8 mb-8">
      <div class="text-center">
        <div class="i-tabler:home text-5xl text-blue-600 mx-auto mb-4"></div>
        <h1 class="text-3xl font-bold text-gray-900 mb-4">欢迎使用 DVHA</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          基于 Vue 3 + UnoCSS + @duxweb/dvha-core 构建的现代化管理系统
        </p>
      </div>
    </div>

    <!-- @duxweb/dvha-core 特点展示 -->
    <div class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="i-tabler:brand-vue text-3xl text-green-600 mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Vue 3 支持</h3>
          <p class="text-gray-600 text-sm">基于最新的 Vue 3 Composition API，提供现代化的开发体验</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="i-tabler:brand-typescript text-3xl text-blue-600 mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">TypeScript</h3>
          <p class="text-gray-600 text-sm">完整的 TypeScript 支持，提供类型安全和更好的开发体验</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="i-tabler:layout-dashboard text-3xl text-purple-600 mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">多管理端</h3>
          <p class="text-gray-600 text-sm">支持多个独立的管理端，每个管理端可以有不同的配置</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="i-tabler:database text-3xl text-orange-600 mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">数据提供者</h3>
          <p class="text-gray-600 text-sm">灵活的数据提供者模式，支持各种 API 和数据源</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="i-tabler:shield-check text-3xl text-red-600 mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">认证系统</h3>
          <p class="text-gray-600 text-sm">内置完整的认证和权限管理系统，支持多种认证方式</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="i-tabler:route text-3xl text-indigo-600 mb-4"></div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">路由管理</h3>
          <p class="text-gray-600 text-sm">智能的路由和菜单管理，支持动态路由和权限控制</p>
        </div>
      </div>
    </div>

    <!-- 开始使用 -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border p-8 text-center">
      <h3 class="text-xl font-bold text-gray-900 mb-4">开始构建您的管理系统</h3>
      <p class="text-gray-600 mb-6">@duxweb/dvha-core 为您提供了构建现代化管理系统所需的所有工具</p>
      <div class="flex justify-center space-x-4">
        <a href="https://github.com/duxweb/dvha" target="_blank"
           class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <div class="i-tabler:brand-github mr-2"></div>
          查看源码
        </a>
        <a href="#" class="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
          <div class="i-tabler:book mr-2"></div>
          查看文档
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 首页逻辑
console.log('首页已加载')
</script>
