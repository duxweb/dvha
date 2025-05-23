<template>
  <aside
    :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    class="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r pt-16 transition-transform lg:translate-x-0 lg:static lg:inset-0"
  >
    <div class="h-full overflow-y-auto p-4">
      <nav class="space-y-2">
        <router-link
          v-for="menu in menuList"
          :key="menu.name"
          :to="menu.path"
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
          :class="active === menu.name ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
        >
          <div :class="[menu.icon, 'mr-3']"></div>
          {{ menu.label }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useMenu } from '@duxweb/dvha-core'

defineProps<{
  sidebarOpen: boolean
}>()

const { data: menuList,active } = useMenu()

</script>