<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- 登录卡片 -->
      <n-card class="login-card">
        <!-- 标题区域 -->
        <div class="text-center mb-8">
          <div class="i-tabler:shield-check text-4xl text-blue-600 mx-auto mb-4"></div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">系统登录</h1>
          <p class="text-gray-500 text-sm">欢迎使用管理系统，请登录</p>
        </div>

        <!-- 登录表单 -->
        <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          @submit.prevent="handleLogin"
          size="large"
        >
          <!-- 用户名 -->
          <n-form-item path="username">
            <n-input
              v-model:value="form.username"
              placeholder="请输入用户名"
              clearable
            >
              <template #prefix>
                <div class="i-tabler:user text-gray-400"></div>
              </template>
            </n-input>
          </n-form-item>

          <!-- 密码 -->
          <n-form-item path="password">
            <n-input
              v-model:value="form.password"
              type="password"
              placeholder="请输入密码"
              show-password-on="click"
              clearable
            >
              <template #prefix>
                <div class="i-tabler:lock text-gray-400"></div>
              </template>
            </n-input>
          </n-form-item>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between mb-6">
            <n-checkbox v-model:checked="form.remember">记住我</n-checkbox>
            <n-button text type="primary" @click="handleForgotPassword">忘记密码？</n-button>
          </div>

          <!-- 登录按钮 -->
          <n-form-item>
            <n-button
              type="primary"
              :loading="loading"
              @click="handleLogin"
              block
              size="large"
            >
              {{ loading ? '登录中...' : '登录' }}
            </n-button>
          </n-form-item>
        </n-form>

        <!-- 注册提示 -->
        <div class="text-center">
          <span class="text-sm text-gray-500">还没有账号？</span>
          <n-button text type="primary" @click="handleRegister" class="ml-1">立即注册</n-button>
        </div>
      </n-card>

      <!-- 版权信息 -->
      <p class="mt-6 text-center text-xs text-gray-400">
        © 2024 Dux Template. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage, type FormInst } from 'naive-ui'
import { useLogin } from '@duxweb/dvha-core'

const message = useMessage()
const formRef = ref<FormInst | null>(null)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const { mutate: login, isLoading: loading } = useLogin({
  onSuccess: () => {
    message.success('登录成功')
  },
  onError: (error) => {
    console.error('登录失败:', error)
    message.error(error?.message || '登录失败，请检查用户名和密码')
  }
})

const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    await login({
      username: form.username,
      password: form.password,
      remember: form.remember
    })
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleForgotPassword = () => {
  message.info('忘记密码功能待开发')
}

const handleRegister = () => {
  message.info('注册功能待开发')
}
</script>

<style scoped>
.login-card {
  padding: 2rem;
}
</style>
