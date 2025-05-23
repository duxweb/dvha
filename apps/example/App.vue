<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DuxAppProvider } from '@duxweb/dvha-core'
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
