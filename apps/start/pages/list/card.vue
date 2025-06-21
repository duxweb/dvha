<script setup lang="ts">
import { DuxCard, DuxCardPage, DuxMedia } from '@duxweb/dvha-pro'
import { NButton, NCheckbox, NInput } from 'naive-ui'
import { ref } from 'vue'

const form = ref({
  title: '',
})
</script>

<template>
  <DuxCardPage

    checkable
    row-key="id"
    path="user"
    :filter="form"
    :filter-schema="[
      {
        tag: NInput,
        label: '姓名',
        attrs: {
          'placeholder': '请输入姓名',
          'v-model:value': [form, 'title'],
        },
      },
    ]"
    :tabs="[
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
    ]"
  >
    <template #default="{ item, isChecked, toggleChecked }">
      <DuxCard :key="item.id" size="none" class="relative group" divide bordered :shadow="false">
        <div class="absolute top-2 left-2 z-10  group-hover:block" :class="[isChecked(item.id) ? 'block' : 'hidden']">
          <NCheckbox :checked="isChecked(item.id)" @update:checked="toggleChecked(item.id)" />
        </div>
        <template #header>
          <div class="flex gap-2 justify-between items-center ">
            <div>
              <DuxMedia
                :image="item.avatar"
                :image-width="38"
                avatar
                :title="item.nickname"
                :desc="item.email"
              />
            </div>
            <div>
              <NButton circle quaternary>
                <template #icon>
                  <i class="i-tabler:dots-vertical" />
                </template>
              </NButton>
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-1 text-muted">
          <div class="flex flex-row gap-2 justify-between">
            <div class="text-sm">
              注册时间
            </div>
            <div class="text-sm">
              2025-01-01
            </div>
          </div>
          <div class="flex flex-row gap-2 justify-between">
            <div class="text-sm">
              登录时间
            </div>
            <div class="text-sm">
              2025-01-01
            </div>
          </div>
        </div>

        <template #footer>
          <div class="grid grid-cols-2 gap-2">
            <NButton secondary>
              资料
            </NButton>
            <NButton secondary type="primary">
              日志
            </NButton>
          </div>
        </template>
      </DuxCard>
    </template>
  </DuxCardPage>
</template>
