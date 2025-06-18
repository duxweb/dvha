<script setup lang="ts">
import type { TableColumn } from '@duxweb/dvha-naiveui'
import type { UseActionItem } from '@duxweb/dvha-pro'
import { DuxTablePage, useAction, useDialog, useModal, useTableColumn } from '@duxweb/dvha-pro'
import { NInput } from 'naive-ui'
import { ref } from 'vue'

const filters = ref({
  keyword: '',
})

const { show } = useModal()

const { confirm } = useDialog()

function handleCreate() {
  // confirm({
  //   title: '新增',
  //   content: 'Are you sure you want to create?',
  // })

  show({
    title: '新增',
    component: () => import('./form/modal.vue'),
  })
}

const { renderTable, renderAction } = useAction()

const { renderMedia, renderSwitch, renderStatus, renderMap, renderInput, renderCopy, renderHidden } = useTableColumn()

const columns: TableColumn[] = [
  {
    type: 'selection',
    key: 'selection',
    width: 50,
  },
  {
    title: 'ID',
    key: 'id',
    width: 100,
  },
  {
    title: '昵称',
    key: 'nickname',
    minWidth: 100,
    render: renderInput({
      key: 'nickname',
      tag: NInput,
    }),
  },
  {
    title: '邮箱',
    key: 'email',
    minWidth: 200,
    render: renderCopy({
      key: 'email',
    }),
  },
  {
    title: '电话',
    key: 'phone',
    minWidth: 150,
    render: renderHidden({
      key: 'phone',
    }),
  },
  {
    title: '用户',
    key: 'nickname',
    minWidth: 150,
    render: renderMedia({
      image: 'avatar',
      title: 'nickname',
      desc: 'email',
      avatar: true,
      imageWidth: 36,
      imageHeight: 36,
    }),
  },
  {
    title: '联系',
    key: 'info',
    width: 300,
    render: renderMap({
      maps: [
        {
          key: 'email',
          label: '邮箱',
          icon: 'i-tabler:mail',
        },
        {
          key: 'phone',
          label: '手机',
          icon: 'i-tabler:phone',
        },
      ],
    }),
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
    render: renderStatus({
      key: 'status',
      maps: {
        success: {
          label: '正常',
          value: true,
        },
        error: {
          label: '禁用',
          value: false,
        },
      },
    }),
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
    render: renderSwitch({
      key: 'status',
    }),
  },
  {
    title: 'Action',
    key: 'actions',
    fixed: 'right',
    width: 130,
    align: 'center',
    render: renderTable({
      type: 'dropdown',
      text: true,
      align: 'center',
      items: [
        {
          label: '编辑',
          type: 'modal',
          component: () => import('./form/modal.vue'),
        },
        {
          label: '删除',
          type: 'delete',
        },
      ],
    }),
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

const actions = ref<UseActionItem[]>([
  {
    label: '新增',
    type: 'modal',
    component: () => import('./form/modal.vue'),
  },
])
</script>

<template>
  <DuxTablePage
    path="user"
    :columns="columns"
    :filter="filters"
    :tabs="tabs"
    :filter-schema="filterSchema"
    :actions="actions"
    pagination
  />
</template>

<style scoped>
</style>
