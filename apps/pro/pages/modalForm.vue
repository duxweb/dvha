<script setup lang="ts">
import { useForm, useSelect } from '@duxweb/dvha-core'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  id?: string | number
  onClose?: () => void
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
  <n-card
    title="模态框"
    :bordered="false"
    size="small"
    role="dialog"
    aria-modal="true"
    class="w-400px"
  >
    <template #header-extra>
      <n-button tertiary circle @click="onClose">
        <template #icon>
          <div class="i-tabler:x size-4" />
        </template>
      </n-button>
    </template>

    <n-form
      :model="form"
      label-placement="top"
      :label-width="160"
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
      <div class="flex justify-end gap-2">
        <n-button @click="onReset">
          重置
        </n-button>
        <n-button type="primary" :loading="isLoading" @click="onSubmit">
          提交
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<style scoped>
</style>
