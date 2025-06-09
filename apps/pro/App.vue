<script setup lang="ts">
import { DuxAppProvider } from '@duxweb/dvha-core'
import { RouterView } from 'vue-router'
</script>

<template>
  <n-notification-provider>
    <n-message-provider>
      <DuxAppProvider>
        <RouterView />
      </DuxAppProvider>
    </n-message-provider>
  </n-notification-provider>
</template>

<style scoped>
</style>
