<script setup lang="ts">
import { useList } from '@duxweb/dvha-core'
import { ceil } from 'lodash-es'
import { NButton, NDataTable } from 'naive-ui'
import { computed, h, ref } from 'vue'

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
          onClick: () => {},
        },
        { default: () => '编辑' },
      )
    },
  },
]

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const { data, isLoading } = useList({
  path: 'users',
  pagination: pagination.value,
})

const pageCount = computed(() => {
  return ceil(data?.value?.meta?.total / pagination.value.pageSize)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between items-center">
      <NButton type="primary">
        新增
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
