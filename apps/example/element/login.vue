<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useLogin } from '@dux-vue/core'
import type { FormInstance } from 'element-plus'
import { User, Lock, Platform } from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const router = useRouter()

const formRef = ref<FormInstance>()

const formModel = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const { mutate, isLoading } = useLogin({
  onSuccess: () => {
    ElMessage.success('登录成功')
  },
  onError: (error) => {
    console.log(error)
    ElMessage.error(error?.message || '登录失败，请检查用户名和密码')
  }
})

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (valid) {
      mutate({
        username: formModel.username,
        password: formModel.password,
        code: "0000"
      })
    }
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

      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-position="top"
      >
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            type="password"
            placeholder="请输入密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="flex justify-between items-center mb-4">
          <el-checkbox v-model="formModel.remember">
            记住我
          </el-checkbox>
          <el-button link type="primary">
            忘记密码？
          </el-button>
        </div>

        <el-button
          type="primary"
          class="w-full"
          :loading="isLoading"
          @click="handleSubmit"
        >
          登录
        </el-button>

        <div class="flex justify-center items-center mt-6 text-14px text-gray-500">
          <span>还没有账号？</span>
          <el-button link type="primary" class="ml-2" @click="router.push('/register')">
            立即注册
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* 所有CSS样式已替换为UnoCSS原子类 */
</style>
