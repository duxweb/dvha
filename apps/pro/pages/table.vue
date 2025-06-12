<script setup lang="ts">
import type { TableColumn } from '@duxweb/dvha-naiveui'
import { NButton, NInput } from 'naive-ui'
import { ref } from 'vue'
import Page from '../components/pages/page'
import { DuxTablePage } from '../components/table'
import { useAction, useDialog, useModal } from '../hooks'

const filters = ref({
  keyword: '',
})

const { show } = useModal()

const { confirm } = useDialog()

function handleCreate() {
  confirm({
    title: '新增',
    content: 'Are you sure you want to create?',
  })

  // show({
  //   title: '新增',
  //   component: () => import('./modalForm.vue'),
  //   draggable: true,
  // })
}

const { render } = useAction({
  path: 'user',
  type: 'button',
  items: [
    {
      label: '编辑',
      type: 'modal',
      component: () => import('./modalForm.vue'),
    },
    {
      label: '删除',
      type: 'delete',
    },
  ],
})

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
    render(row, index) {
      return render({
        id: row.id,
        data: row,
        index,
      })
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

const filterSchema = [
  {
    tag: NInput,
    attrs: {
      'placeholder': '请输入关键词搜索',
      'v-model:value': [filters.value, 'keyword'],
    },
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
      :filter="filters"
      :tabs="tabs"
      :filter-schema="filterSchema"
    >
      <template #filters>
        <!-- <DuxTableFilter>
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
        </DuxTableFilter> -->
      </template>
    </DuxTablePage>
  </Page>
</template>

<style scoped>
</style>
