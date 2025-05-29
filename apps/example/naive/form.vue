<script setup lang="ts">
import { useSelect } from '@duxweb/dvha-core'
import { ref } from 'vue'

const model = ref({
  name: '',
  asyncSelect: 40,
})

const { options, onSearch } = useSelect({
  path: '/user',
  optionLabel: 'nickname',
  defaultValue: model.value.asyncSelect,
})

function handleSearch(value: string) {
  onSearch(value)
}
</script>

<template>
  <div class="p-4">
    <n-form
      :model="model"
      label-placement="left"
      :label-width="160"
    >
      <n-form-item label="文本框" path="name">
        <n-input v-model:value="model.name" />
      </n-form-item>

      <n-form-item label="异步选择器" path="async-select">
        <n-select v-model:value="model.asyncSelect" :options="options" placeholder="请选择用户" clearable filterable remote @search="handleSearch" />
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
</style>
