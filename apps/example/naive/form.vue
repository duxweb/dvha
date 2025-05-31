<script setup lang="ts">
import { createS3UploadDriver, useSelect, useUpload } from '@duxweb/dvha-core'
import { NButton, NDataTable, useMessage } from 'naive-ui'
import { h, onMounted, ref } from 'vue'

const model = ref({
  name: '',
  asyncSelect: 40,
})

const { options, onSearch } = useSelect({
  path: 'user',
  optionLabel: 'nickname',
  defaultValue: model.value.asyncSelect,
})

function handleSearch(value: string) {
  onSearch(value)
}

const message = useMessage()

const { trigger, uploadFiles, open, removeFiles, cancelFiles, progress, clearFiles, addDataFiles } = useUpload({
  path: 'upload',
  method: 'POST',
  multiple: true,
  driver: createS3UploadDriver({
    signPath: 'uploadSign',
  }),
  onError: (error) => {
    message.error(error.message || '上传失败')
  },
})

onMounted(() => {
  addDataFiles([
    {
      url: 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png',
      filename: 'test.png',
      filetype: 'image/png',
      filesize: 1000,
    },
  ])
})
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

      <n-form-item label="上传" path="upload">
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-2">
            <NButton @click="open">
              选择文件
            </NButton>
            <NButton @click="trigger">
              上传 {{ progress.totalPercent }}%
            </NButton>
            <NButton @click="clearFiles">
              清空
            </NButton>
          </div>
          <div class="flex flex-col gap-2">

            <NDataTable
              :bordered="true"
              :columns="[
                {
                  key: 'filename',
                  title: '文件名',
                },
                {
                  key: 'filesizeText',
                  title: '大小',
                },
                {
                  key: 'filetype',
                  title: '类型',
                },
                {
                  key: 'status',
                  title: '状态',
                  render: (row) => {
                    return h('div', {
                      class: 'flex flex-col gap-2',
                    }, [
                      h('div', {}, row.status),
                      h('div', { class: 'text-red-500' }, row?.error),
                    ])
                  },
                },
                {
                  key: 'progress.percent',
                  title: '进度',
                  render: (row) => {
                    return `${row.progress?.percent}%`
                  },
                },
                {
                  key: 'progress.speedText',
                  title: '速度',
                },
                {
                  key: 'progress.uploadTime',
                  title: '上传时间',
                  render: (row) => {
                    return `${row.progress?.uploadTime} seconds`
                  },
                },
                {
                  key: 'progress.remainingTime',
                  title: '剩余时间',
                  render: (row) => {
                    return `${row.progress?.remainingTime} seconds`
                  },
                },
                {
                  key: 'actions',
                  title: '操作',
                  render: (row) => {
                    return h('div', {
                      class: 'flex items-center gap-2',
                    }, [
                      h(NButton, {
                        type: 'warning',
                        size: 'small',
                        disabled: row.status === 'success' || row.status === 'error' || row.status === 'cancelled',
                        onClick: () => {
                          cancelFiles([row.id])
                        },
                      }, { default: () => '取消' }),
                      h(NButton, {
                        type: 'error',
                        size: 'small',
                        onClick: () => {
                          removeFiles([row.id])
                        },
                      }, { default: () => '删除' }),
                    ])
                  },
                },
              ]"
              :data="uploadFiles"
            />

          </div>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
</style>
