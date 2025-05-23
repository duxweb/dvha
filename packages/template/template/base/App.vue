<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DuxAppProvider } from '@duxweb/dvha-core'
</script>

<template>
  <DuxAppProvider>
    <RouterView />
  </DuxAppProvider>
</template>

<style scoped>
</style>
