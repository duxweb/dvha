<script setup lang="ts">
import type { DataTableColumn } from 'naive-ui'
import { useExport, useExportCsv, useImport, useImportCsv, useList, useOverlay } from '@duxweb/dvha-core'
import { ceil } from 'lodash-es'
import { NButton, NDataTable, NForm, NFormItem, NInput, NPopover, NSelect, useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'
import Page from '../components/pages/page'
import DuxTable from '../components/pages/table'

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

const columns: DataTableColumn[] = [
  {
    type: 'selection',
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
  <Page>
    <template #actions>
      <NButton type="primary" @click="handleCreate">
        <template #icon>
          <div class="i-tabler:plus size-4" />
        </template>
        新增
      </NButton>
    </template>

    <DuxTable
      path="user"
      :columns="columns"
      :filters="filters"
    >
      <template #filters>
        <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索" />
      </template>
    </DuxTable>
  </Page>
</template>

<style scoped>
</style>
