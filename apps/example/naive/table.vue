<script setup lang="ts">
import { useExport, useExportCsv, useImport, useImportCsv, useList, useOverlay } from '@duxweb/dvha-core'
import { ceil } from 'lodash-es'
import { NButton, NDataTable, NForm, NFormItem, NInput, NPopover, NSelect, useMessage } from 'naive-ui'
import { computed, h, ref } from 'vue'
import Page from './page.vue'

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

const { trigger, isLoading: isExporting } = useExportCsv({
  path: 'user',
  filters: filters.value,
  maxPage: 2,
  filename: 'user.csv',
  onSuccess: (data) => {
    message.success('导出成功，请在控制台查看')
    console.log('export data', data)
  },
})

function handleExport() {
  trigger()
}

const { open, isLoading: isImporting } = useImportCsv({
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
  open()
}

const columns = [
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

    <div class="flex flex-col gap-3">
      <div class="flex gap-2 justify-between">
        <div class="flex gap-2">
          <NInput v-model:value="filters.keyword" placeholder="请输入关键词搜索">
            <template #prefix>
              <div class="i-tabler:search size-4" />
            </template>
          </NInput>

          <NSelect
            class="min-w-30"
            :options="[
              {
                label: '正常',
                value: 'normal',
              },
              {
                label: '禁用',
                value: 'disabled',
              },
            ]" placeholder="请选择状态"
          />
        </div>
        <div class="flex gap-2">
          <n-badge :value="5">
            <NButton :loading="isExporting" ghost type="error" @click="handleExport">
              <template #icon>
                <div class="i-tabler:trash size-4" />
              </template>
              删除
            </NButton>
          </n-badge>

          <NButton icon-placement="right">
            筛选
            <template #icon>
              <div class="i-tabler:settings size-4" />
            </template>
          </NButton>

          <NDropdown
            :options="[
              {
                label: '导出',
                value: 'export',
              },
              {
                label: '导入',
                value: 'import',
              },
            ]"
            placement="bottom-start"
            trigger="click"
          >
            <NButton icon-placement="right">
              列配置
              <template #icon>
                <div class="i-tabler:settings size-4" />
              </template>
            </NButton>
          </NDropdown>

          <!-- <NButton :loading="isExporting" @click="handleExport">
            导出
          </NButton>
          <NButton :loading="isImporting" @click="handleImport">
            导入
          </NButton> -->
        </div>
      </div>
      <NDataTable
        remote
        :row-key="(row) => row.id"
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
  </Page>
</template>

<style scoped>
</style>
