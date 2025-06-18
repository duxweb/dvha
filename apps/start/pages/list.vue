<script setup lang="ts">
import { useInfiniteList } from '@duxweb/dvha-core'
import { NInfiniteScroll } from 'naive-ui'
import { ref } from 'vue'

const pagination = ref({
  page: 1,
  pageSize: 20,
})

const filters = ref({
  keyword: '',
})

const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteList({
  path: 'user',
  pagination: pagination.value,
  filters: filters.value,
})

function handleLoad() {
  if (hasNextPage.value) {
    fetchNextPage()
  }
}
</script>

<template>
  <div class="h-full flex flex-col gap-2">
    <div class="flex gap-4 items-center">
      <NInput v-model:value="filters.keyword" placeholder="搜索" />
    </div>

    <NInfiniteScroll :distance="10" class="flex-1 h-auto" @load="handleLoad">
      <template v-for="(page, key) in data?.pages" :key="key">
        <div
          v-for="(item, index) in page?.data || []"
          :key="index"
          class="flex gap-2 items-center my-2 p-4 bg-gray-9"
        >
          <img :src="item.avatar" class="size-10">
          <div class="flex flex-col gap-1">
            <div class="text-sm">
              {{ item.nickname }}
            </div>
            <div class="text-xs text-gray-500">
              {{ item.email }}
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="text-center">
          加载中...
        </div>
        <div v-if="!hasNextPage" class="text-center">
          没有更多了 🤪
        </div>
      </template>
    </NInfiniteScroll>
  </div>
</template>

<style scoped>
</style>
