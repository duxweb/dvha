<script setup lang="ts">
import { DuxAppProvider } from '@duxweb/dvha-core'
import { RouterView } from 'vue-router'
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
