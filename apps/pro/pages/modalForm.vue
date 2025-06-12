<script setup lang="ts">
import { useForm } from '@duxweb/dvha-core'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
import { ModalPage } from '../components'

const props = defineProps<{
  id?: string | number
}>()

const model = ref({
  nickname: '123',
  email: '',
  phone: '',
})

const message = useMessage()

const { isLoading, onSubmit, onReset, form } = useForm({
  form: model.value,
  id: props.id,
  path: 'user',
  action: props.id ? 'edit' : 'create',
  onError: (error) => {
    message.error(error.message)
  },
  onSuccess: () => {
    message.success('操作成功')
    props.onClose?.()
  },
})
</script>

<template>
  <ModalPage title="新增用户">
    <n-form
      :model="form"
      label-placement="left"
      :label-width="70"
      label-align="right"
    >
      <n-form-item label="昵称" path="nickname">
        <n-input v-model:value="form.nickname" />
      </n-form-item>
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="form.email" />
      </n-form-item>
      <n-form-item label="手机号" path="phone">
        <n-input v-model:value="form.phone" />
      </n-form-item>
    </n-form>

    <template #footer>
      <n-button @click="onReset">
        重置
      </n-button>
      <n-button type="primary" :loading="isLoading" @click="onSubmit">
        提交
      </n-button>
    </template>
  </ModalPage>
</template>

<style scoped>
</style>
