<script setup lang="ts">
import { DuxFormItem, DuxModalForm } from '@duxweb/dvha-pro'
import { NInput } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  id?: string | number
}>()

const model = ref({
  nickname: 'test123',
  email: '',
  phone: '',
})
</script>

<template>
  <DuxModalForm :id="props.id" title="用户" :data="model" path="user">
    <DuxFormItem label="昵称" path="nickname" rule="required">
      <NInput v-model:value="model.nickname" />
    </DuxFormItem>
    <DuxFormItem label="邮箱" path="email" rule="required|email">
      <NInput v-model:value="model.email" />
    </DuxFormItem>
    <DuxFormItem label="手机号" path="phone">
      <NInput v-model:value="model.phone" />
    </DuxFormItem>
  </DuxModalForm>
</template>

<style scoped>
</style>
