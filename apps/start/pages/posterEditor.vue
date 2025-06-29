<script setup lang="ts">
import { ref, watch } from 'vue'
import { DuxPosterEditor } from '../../../packages/pro/src/components/image/posterEditor'

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
