<script setup lang="ts">
import { useOverlay } from '@dux-vue/core';



const overlay = useOverlay()

const handleOpen = () => {
  overlay.show({
  component: () => import('./setting.vue')
})
}

</script>

<template>
<n-card
      style="width: 600px"
      title="模态框"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        噢！
      </template>
      <n-button @click="handleOpen">打开</n-button>
      <template #footer>
        尾部
      </template>
    </n-card>
</template>