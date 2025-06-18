<script setup lang="ts">
import { DuxCard, DuxCardPage } from '@duxweb/dvha-pro'
import { NCheckbox, NDropdown, NInput, NTag, NTooltip } from 'naive-ui'
import { h, ref } from 'vue'

const form = ref({
  title: '',
})
</script>

<template>
  <DuxCardPage
    v-slot="{ item, isChecked, toggleChecked }"
    checkable
    row-key="id"
    path="article"
    :filter="form"
    :filter-schema="[
      {
        tag: NInput,
        label: '姓名',
        attrs: {
          'placeholder': '请输入标题',
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
        label: '发布',
        value: 'enabled',
      },
      {
        label: '草稿',
        value: 'disabled',
      },
    ]"
  >
    <DuxCard :key="item.id" size="none" class="relative group bg-elevated" bordered :shadow="false" divide header-size="none">
      <div class="absolute top-2 left-2 z-10  group-hover:block" :class="[isChecked(item.id) ? 'block' : 'hidden']">
        <NCheckbox :checked="isChecked(item.id)" @update:checked="toggleChecked(item.id)" />
      </div>
      <template #header>
        <div class="h-50 rounded-t overflow-hidden">
          <img :src="`https://picsum.photos/800/800?random=${item.id}`" alt="article" class="w-full h-full object-cover">
        </div>
      </template>

      <div class="flex flex-col gap-2">
        <div class="text-sm text-muted">
          {{ item.created_at }} | 1 分钟前
        </div>
        <div class="text-base font-bold">
          {{ item.title }}
        </div>
        <div class="text-sm text-muted line-clamp-2">
          {{ item.desc }}
        </div>
      </div>

      <template #footer>
        <div class="flex flex-row items-center justify-between gap-2">
          <div>
            <NTag :type="item.status ? 'success' : 'warning'">
              {{ item.status ? '发布' : '草稿' }}
            </NTag>
          </div>
          <div>
            <div class="flex flex-row gap-2">
              <NTooltip>
                <template #trigger>
                  <NButton secondary size="small" circle>
                    <template #icon>
                      <i class="i-tabler:chart-bar" />
                    </template>
                  </NButton>
                </template>
                分析
              </NTooltip>
              <NTooltip>
                <template #trigger>
                  <NButton secondary type="primary" size="small" circle>
                    <template #icon>
                      <i class="i-tabler:eye" />
                    </template>
                  </NButton>
                </template>
                预览
              </NTooltip>
              <NDropdown
                trigger="click"
                :options="[
                  {
                    label: '编辑',
                    key: 'edit',
                    icon: () => h('i', { class: 'i-tabler:edit' }),
                  },
                  {
                    label: '删除',
                    key: 'delete',
                    icon: () => h('i', { class: 'i-tabler:trash' }),
                  },
                ]"
              >
                <NButton secondary size="small" circle>
                  <template #icon>
                    <i class="i-tabler:dots-vertical" />
                  </template>
                </NButton>
              </NDropdown>
            </div>
          </div>
        </div>
      </template>
    </DuxCard>
  </DuxCardPage>
</template>
