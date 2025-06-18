<script setup lang="ts">
import { DuxCard, DuxListPage, DuxMedia } from '@duxweb/dvha-pro'
import { NButton, NInput, NTag } from 'naive-ui'
import { ref } from 'vue'

const form = ref({
  title: '',
})
</script>

<template>
  <DuxListPage
    v-slot="{ item }"
    checkable
    row-key="id"
    path="order"
    :filter="form"
    :filter-schema="[
      {
        tag: NInput,
        label: '项目名称',
        attrs: {
          'placeholder': '请输入项目名称',
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
        label: '进行中',
        value: 'in_progress',
      },
      {
        label: '已完成',
        value: 'completed',
      },
      {
        label: '已中止',
        value: 'aborted',
      },
    ]"
  >
    <DuxCard divide>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex flex-col">
            <div class="flex gap-2 items-center">
              <div class="text-base font-bold">
                订单号：# {{ item.order_no }}
              </div>
              <NTag type="success" size="small">
                已付款
              </NTag>
            </div>
            <div class="text-sm text-muted">
              {{ item.products.length }} 个商品 | {{ item.username }} | {{ item.city }} | {{ item.created_at }}
            </div>
          </div>

          <div class="flex justify-end items-center gap-2">
            <NButton>
              <template #icon>
                <div class="i-tabler:eye" />
              </template>
              下载账单
            </NButton>
            <div class="flex items-center gap-2">
              <NButton>
                <template #icon>
                  <div class="i-tabler:dots-vertical" />
                </template>
              </NButton>
            </div>
          </div>
        </div>
      </template>

      <div class="grid gap-4" :style="{ 'grid-template-columns': `repeat(auto-fit, minmax(250px, 250px))` }">
        <DuxMedia
          v-for="product in item.products"
          :key="product.id"
          :title="product.title"
          :image="`https://picsum.photos/800/800?random=${item.id}-${product.id}`"
          :image-width="60"
          :desc="[
            `数量：${product.num}x ${product.price}元`,
            `颜色：${product.color}`,
          ]"
        />
      </div>
    </DuxCard>
  </DuxListPage>
</template>
