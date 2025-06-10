<script setup lang="ts">
import type { TableColumn } from '@duxweb/dvha-naiveui'
import { useOverlay } from '@duxweb/dvha-core'
import { NButton, NInput } from 'naive-ui'
import { h, ref } from 'vue'
import Page from '../components/pages/page'
import { DuxTableFilter, DuxTablePage } from '../components/table'

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const filters = ref({
  keyword: '',
})

const { show } = useOverlay()

function handleCreate() {
  show({
    component: () => import('./modalForm.vue'),
  })
}

const columns: TableColumn[] = [
  {
    type: 'selection',
    key: 'selection',
  },
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
    fixed: 'right',
    width: 100,
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

const tabs = ref([
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '已启用',
    value: 'enabled',
  },
  {
    label: '已禁用',
    value: 'disabled',
  },
])

const filterOptions = [
  {
    label: '状态',
    value: 'status',
  },
]
</script>

<template>
  <Page>
    <template #actions>
      <NButton type="primary" @click="handleCreate">
        <template #icon>
          <div class="i-tabler:plus size-4" />
        </template>
        新增
      </NButton>
    </template>

    <DuxTablePage
      path="user"
      :columns="columns"
      :filters="filters"
      :tabs="tabs"
    >
      <template #filters>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
        <DuxTableFilter>
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
        </DuxTableFilter>
      </template>
    </DuxTablePage>
  </Page>
</template>

<style scoped>
</style>
