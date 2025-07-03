<script setup lang="ts">
import { DuxPosterEditor } from '@duxweb/dvha-pro'
import { ref, watch } from 'vue'

const posterData = ref('')

// 监听数据变化
watch(() => posterData.value, (newValue) => {
  if (newValue) {
    // 数据更新时的处理逻辑
  }
})
</script>

<template>
  <DuxPosterEditor
    v-model:value="posterData"
    :width="750"
    :height="1000"
    background-color="#ffffff"
  />
</template>
