<script setup lang="ts">
import type { IMenu } from '@dux-vue/core'
import type { PropType } from 'vue'

defineOptions({
  name: 'TreeMenu',
})

defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  onMenuClick: {
    type: Function as unknown as () => (item: MenuOption) => void,
    default: () => {},
  },
})

export interface MenuOption extends IMenu {
  children?: MenuOption[]
}
</script>

<template>
  <template v-for="item in menuItems as MenuOption[]" :key="item.name">
    <el-sub-menu v-if="item.children && item.children.length" :index="item.name">
      <el-icon v-if="item.icon">
        <div :class="item.icon" />
      </el-icon>
      <template #title>
        {{ item.label }}
      </template>

      <TreeMenu
        :menu-items="item.children"
        :on-menu-click="onMenuClick"
      />
    </el-sub-menu>

    <el-menu-item
      v-else
      :index="item.name"
      @click="onMenuClick(item)"
    >
      <el-icon v-if="item.icon">
        <div :class="item.icon" />
      </el-icon>
      <template #title>
        {{ item.label }}
      </template>
    </el-menu-item>
  </template>
</template>
