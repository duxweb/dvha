<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- 登录卡片 -->
      <div class="bg-white rounded-lg shadow-sm border p-8">
        <!-- 标题区域 -->
        <div class="text-center mb-8">
          <div class="i-tabler:shield-check text-4xl text-blue-600 mx-auto mb-4"></div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">系统登录</h1>
          <p class="text-gray-500 text-sm">欢迎使用管理系统，请登录</p>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- 用户名 -->
          <div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <div class="i-tabler:user text-gray-400"></div>
              </div>
              <input
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                class="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-300': errors.username}"
              />
            </div>
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
          </div>

          <!-- 密码 -->
          <div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <div class="i-tabler:lock text-gray-400"></div>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{'border-red-300': errors.password}"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <div :class="showPassword ? 'i-tabler:eye-off' : 'i-tabler:eye'"></div>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input v-model="form.remember" type="checkbox" class="h-4 w-4 text-blue-600 rounded border-gray-300" />
              <span class="ml-2 text-sm text-gray-600">记住我</span>
            </label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-500">忘记密码？</a>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <div class="i-tabler:loader-2 animate-spin mr-2"></div>
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </form>

        <!-- 注册提示 -->
        <div class="mt-6 text-center">
          <span class="text-sm text-gray-500">还没有账号？</span>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500 font-medium ml-1">立即注册</a>
        </div>
      </div>

      <!-- 版权信息 -->
      <p class="mt-6 text-center text-xs text-gray-400">
        © 2024 Dux Template. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLogin } from '@duxweb/dvha-core'

const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const errors = reactive({
  username: '',
  password: ''
})

const { mutate: login, isLoading: loading } = useLogin({
  onSuccess: () => console.log('登录成功'),
  onError: (error) => {
    console.error('登录失败:', error)
    if (error?.message) {
      if (error.message.includes('用户名') || error.message.includes('username')) {
        errors.username = error.message
      } else if (error.message.includes('密码') || error.message.includes('password')) {
        errors.password = error.message
      } else {
        errors.password = error.message
      }
    } else {
      errors.password = '登录失败，请检查用户名和密码'
    }
  }
})

const validateForm = () => {
  errors.username = ''
  errors.password = ''

  let isValid = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    await login({
      username: form.username,
      password: form.password,
      remember: form.remember
    })
  } catch (error) {
    console.error('登录过程中发生错误:', error)
  }
}
</script>
