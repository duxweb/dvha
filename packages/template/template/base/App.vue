<script setup lang="ts">
import { DuxAppProvider } from '@duxweb/dvha-core'
import { RouterView } from 'vue-router'
</script>

<template>
  <DuxAppProvider>
    <RouterView />
  </DuxAppProvider>
</template>

<style scoped>
</style>
