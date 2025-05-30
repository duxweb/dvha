<script setup lang="ts">
import { useExport, useImport, useList, useOverlay } from '@duxweb/dvha-core'
import { ceil } from 'lodash-es'
import { NButton, NDataTable, NInput, useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const filters = ref({
  keyword: '',
})

const { data, isLoading } = useList({
  path: 'user',
  pagination: pagination.value,
  filters: filters.value,
})

const pageCount = computed(() => {
  return ceil(data?.value?.meta?.total / pagination.value.pageSize)
})

const { show } = useOverlay()

function handleCreate() {
  show({
    component: () => import('./modalForm.vue'),
  })
}

const message = useMessage()

const { trigger, isLoading: isExporting } = useExport({
  path: 'user',
  filters: filters.value,
  maxPage: 2,
  onSuccess: (data) => {
    message.success('导出成功，请在控制台查看')
    console.log('export data', data)
  },
})

function handleExport() {
  trigger()
}

const { trigger: onImport, isLoading: isImporting } = useImport({
  path: 'user',
  onComplete: (data) => {
    message.success('导入成功，请在控制台查看')
    console.log('import data', data)
  },
  onProgress: (data) => {
    console.log('import progress', data)
  },
  onError: (error) => {
    message.error('导入失败，请在控制台查看')
    console.log('import error', error)
  },
})

function handleImport() {
  onImport(data?.value?.data || [])
}

const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '昵称',
    key: 'nickname',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '手机号',
    key: 'phone',
  },
  {
    title: '状态',
    key: 'status',
  },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => {
            show({
              component: () => import('./modalForm.vue'),
              componentProps: {
                id: row.id,
              },
            })
          },
        },
        { default: () => '编辑' },
      )
    },
  },
]
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-4 items-center">
      <NInput v-model:value="filters.keyword" placeholder="搜索" />
      <NButton type="primary" @click="handleCreate">
        新增
      </NButton>
      <NButton type="primary" :loading="isExporting" @click="handleExport">
        导出
      </NButton>
      <NButton type="primary" :loading="isImporting" @click="handleImport">
        导入
      </NButton>
    </div>
    <NDataTable
      remote
      :loading="isLoading"
      :columns="columns"
      :data="data?.data"
      :pagination="{
        ...pagination,
        pageCount,
        onUpdatePage: (page) => {
          pagination.page = page
        },
        onUpdatePageSize: (pageSize) => {
          pagination.pageSize = pageSize
          pagination.page = 1
        },
      }"
      :bordered="false"
    />
  </div>
</template>

<style scoped>
</style>
