<script setup lang="ts">
import { useGetAuth, useLogout, useManage } from '@duxweb/dvha-core'
import { onMounted, onUnmounted, ref } from 'vue'
import Sidebar from './menu.vue'

const manage = useManage()
const user = useGetAuth()

const { mutate: logout } = useLogout({
  onSuccess: () => console.log('退出成功'),
  onError: error => console.error('退出失败:', error),
})

const sidebarOpen = ref(false)
const showUserMenu = ref(false)

const getUserName = () => user?.info?.name || user?.info?.username || 'Admin'
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const handleLogout = () => logout()

function closeDropdowns(event: Event) {
  if (!(event.target as HTMLElement).closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdowns))
onUnmounted(() => document.removeEventListener('click', closeDropdowns))
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 头部 -->
    <header class="bg-white shadow-sm border-b fixed w-full top-0 z-50">
      <div class="flex items-center justify-between h-16 px-4">
        <div class="flex items-center">
          <button class="p-2 rounded hover:bg-gray-100 lg:hidden" @click="toggleSidebar">
            <div class="i-tabler:menu-2 text-xl" />
          </button>
          <div class="flex items-center ml-4 lg:ml-0">
            <div class="i-tabler:brand-vue text-2xl text-blue-600 mr-3" />
            <h1 class="text-xl font-bold">
              {{ manage.config?.title || 'Dux Admin' }}
            </h1>
          </div>
        </div>

        <!-- 用户菜单 -->
        <div class="relative">
          <button class="flex items-center p-2 rounded hover:bg-gray-100" @click="showUserMenu = !showUserMenu">
            <div class="i-tabler:user-circle text-xl mr-2" />
            <span class="hidden md:block text-sm font-medium">{{ getUserName() }}</span>
            <div class="i-tabler:chevron-down text-sm ml-1 hidden md:block" />
          </button>

          <div v-if="showUserMenu" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50">
            <div class="py-1">
              <button class="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100" @click="handleLogout">
                <div class="i-tabler:logout mr-3" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex pt-16 flex-1">
      <!-- 侧边栏 -->
      <Sidebar :sidebar-open="sidebarOpen" />

      <!-- 遮罩层 -->
      <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" @click="toggleSidebar" />

      <!-- 主内容 -->
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>
