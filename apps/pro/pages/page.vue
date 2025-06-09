<script setup lang="ts">
import { useI18n } from '@duxweb/dvha-core'
import { useNaiveTab } from '@duxweb/dvha-naiveui'

const i18n = useI18n()
const { props: tabsProps, tabs } = useNaiveTab()
</script>

<template>
<div class="flex-1 w-auto flex flex-col">
  <div class="flex justify-between items-center border-b-1 border-muted py-3 px-3">
    <div class="flex flex-col">
      <div class="text-default text-base">
        {{ i18n.t('overview') }}
      </div>
    </div>
    <div class="flex items-center gap-2">
      <slot name="actions" />
    </div>
  </div>

  <div class="px-3 py-3 border-b border-muted">
    <n-tabs
      size="small"
      type="card"
      class="layout-tabs"
      tab-style="min-width: 80px;"
      v-bind="tabsProps"
    >
      <n-tab v-for="tab in tabs" :key="tab.path" :name="tab.path" :closable="!tab.meta?.lock">
        {{ tab.label }}
      </n-tab>
    </n-tabs>
  </div>

  <div class="flex-1 h-auto overflow-y-auto p-3">
    <slot />
  </div>
</div>
</template>