<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage, type FormInst } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useLogin } from '@duxweb/dvha-core'

const router = useRouter()
const message = useMessage()

const formRef = ref<FormInst | null>(null)

const formModel = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}


const { mutate, isLoading } = useLogin({
  onSuccess: () => {
    message.success('登录成功')
  },
  onError: (error) => {
    console.log(error)
    message.error(error?.message || '登录失败，请检查用户名和密码')
  }
})

const handleSubmit = () => {
  if (!formRef.value) return


  formRef.value.validate((errors) => {
    if (errors) return

    mutate({
      username: formModel.username,
      password: formModel.password,
      code: "0000"
    })
  })
}
</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100">
      <div class="w-400px p-40px rounded-8px bg-white shadow-sm">
        <div class="text-center mb-40px">
          <h1 class="m-0 mb-8px text-24px font-600 text-gray-800">系统登录</h1>
          <p class="m-0 text-gray-500 text-14px">欢迎使用管理系统，请登录</p>
        </div>

        <n-form
          ref="formRef"
          :model="formModel"
          :rules="rules"
          label-placement="left"
        >
          <n-form-item path="username">
            <n-input
              v-model:value="formModel.username"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <div class="i-tabler:user size-4"></div>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="password">
            <n-input
              v-model:value="formModel.password"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
            >
              <template #prefix>
                <div class="i-tabler:lock size-4"></div>
              </template>
            </n-input>
          </n-form-item>

          <div class="flex justify-between items-center mb-4">
            <n-checkbox v-model:checked="formModel.remember">
              记住我
            </n-checkbox>
            <n-button text>
              忘记密码？
            </n-button>
          </div>

          <n-button
            type="primary"
            block
            :loading="isLoading"
            @click="handleSubmit"
          >
            登录
          </n-button>

          <div class="flex justify-center items-center mt-6 text-14px text-gray-500">
            <span>还没有账号？</span>
            <n-button text class="ml-2 text-primary" @click="router.push('/register')">
              立即注册
            </n-button>
          </div>
        </n-form>
      </div>
    </div>
</template>

<style scoped>
/* 所有CSS样式已替换为UnoCSS原子类 */
</style>
