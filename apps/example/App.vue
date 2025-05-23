<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DuxAppProvider } from '@dux-vue/core'
</script>

<template>
  <n-message-provider>
    <DuxAppProvider>
      <RouterView />
    </DuxAppProvider>
  </n-message-provider>
</template>

<style scoped>
</style>
