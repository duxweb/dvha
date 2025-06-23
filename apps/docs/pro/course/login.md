# 登录后台

本教程将教你如何自定义认证提供者，让 DVHA Pro 适配你的后端登录 API 格式。

## 📋 前置条件

- 已完成 [第一个页面](/pro/course/start) 教程
- 有自己的后端登录 API
- 了解基本的 JavaScript/TypeScript

## 🎯 目标效果

完成本教程后，你将能够：
- 🔐 自定义登录 API 接口
- 🔄 适配你的后端响应格式
- 💾 自定义用户信息存储
- 🚪 实现登录/登出功能

## 🔧 第一步：了解默认认证流程

DVHA Pro 默认的认证流程：

```typescript
// 默认登录请求格式
{
  username: "admin",
  password: "123456"
}

// 默认响应格式
{
  data: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: 1,
      name: "管理员",
      avatar: "https://example.com/avatar.jpg"
    }
  }
}
```

## 📝 第二步：创建自定义认证提供者

在 `src/` 目录下创建 `authProvider.ts` 文件：

```typescript
import type { AuthProvider } from '@duxweb/dvha-core'

// 自定义认证提供者
export const authProvider: AuthProvider = {
  // 登录方法
  login: async ({ username, password }) => {
    try {
      // 调用你的登录 API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 适配你的 API 字段名
          account: username, // 如果你的后端用 account 而不是 username
          pwd: password, // 如果你的后端用 pwd 而不是 password
        }),
      })

      const result = await response.json()

      // 适配你的响应格式
      if (result.code === 200) { // 假设你的成功状态码是 200
        return {
          token: result.data.access_token, // 适配你的 token 字段名
          user: {
            id: result.data.user.user_id, // 适配你的用户 ID 字段
            name: result.data.user.username, // 适配你的用户名字段
            avatar: result.data.user.avatar_url || '', // 适配你的头像字段
            // 添加其他用户信息
            email: result.data.user.email,
            role: result.data.user.role_name,
          }
        }
      }
      else {
        throw new Error(result.message || '登录失败')
      }
    }
    catch (error) {
      throw new Error(`登录失败: ${error.message}`)
    }
  },

  // 登出方法
  logout: async () => {
    try {
      // 如果需要调用登出 API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
    }
    catch (error) {
      console.warn('登出 API 调用失败:', error)
    }

    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // 检查认证状态
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未登录')
    }

    try {
      // 验证 token 是否有效
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Token 无效')
      }

      const result = await response.json()
      return {
        id: result.data.user_id,
        name: result.data.username,
        avatar: result.data.avatar_url || '',
        email: result.data.email,
        role: result.data.role_name,
      }
    }
    catch (error) {
      // Token 无效，清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      throw error
    }
  },

  // 获取用户信息
  getAuth: async () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}
```

## ⚙️ 第三步：配置认证提供者

修改 `main.ts` 文件，应用自定义认证提供者：

```typescript{5,10-12}
import { createApp } from 'vue'
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro } from '@duxweb/dvha-pro'
import App from './App.vue'
import { authProvider } from './authProvider'

const app = createApp(App)

const config = {
  // 应用自定义认证提供者
  authProvider,

  menus: [
    {
      name: 'hello',
      title: 'Hello 页面',
      icon: 'i-tabler:heart',
      path: '/hello'
    }
  ]
}

app.use(createDux(config))
app.use(createDuxPro())
app.mount('#app')
```

## 🎨 第四步：自定义登录页面（可选）

如果需要自定义登录页面，可以创建 `src/pages/login.vue`：

```vue
<script setup>
import { useLogin } from '@duxweb/dvha-core'
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NForm, NFormItem, NIcon, NInput, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = useMessage()
const { mutate: login, isLoading: loading } = useLogin()

const formRef = ref()
const formData = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

async function handleLogin() {
  try {
    await formRef.value?.validate()

    await login(formData, {
      onSuccess: () => {
        message.success('登录成功')
        router.push('/')
      },
      onError: (error) => {
        message.error(error.message || '登录失败')
      }
    })
  }
  catch (error) {
    // 表单验证失败
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <DuxCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900">
            登录后台
          </h1>
          <p class="text-gray-600 mt-2">
            请输入您的账号信息
          </p>
        </div>
      </template>

      <template #default>
        <NForm ref="formRef" :model="formData" :rules="rules" @submit.prevent="handleLogin">
          <NFormItem path="username">
            <NInput
              v-model:value="formData.username"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <NIcon><i class="i-tabler:user" /></NIcon>
              </template>
            </NInput>
          </NFormItem>

          <NFormItem path="password">
            <NInput
              v-model:value="formData.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <NIcon><i class="i-tabler:lock" /></NIcon>
              </template>
            </NInput>
          </NFormItem>

          <NButton
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </NButton>
        </NForm>
      </template>
    </DuxCard>
  </div>
</template>
```

## 🧪 第五步：测试登录功能

1. 启动项目：`npm run dev`
2. 访问登录页面
3. 输入测试账号密码
4. 检查是否成功跳转到后台

## 💡 常见问题

::: details 登录后没有跳转怎么办？
检查路由配置，确保登录成功后的跳转路径存在。可以在 `onSuccess` 回调中添加 `console.log` 调试。
:::

::: details Token 过期如何处理？
在 `checkAuth` 方法中捕获 401 错误，自动清除本地存储并跳转到登录页。
:::

::: details 如何适配不同的响应格式？
修改 `authProvider` 中的数据映射逻辑，将你的 API 响应格式转换为 DVHA 期望的格式。
:::

## 🎯 下一步

恭喜！你已经成功配置了自定义认证。接下来可以：

1. **自定义数据接口**：查看 [自定义数据接口](/pro/course/api) 教程
2. **权限控制**：学习如何基于用户角色控制页面访问
3. **用户管理**：创建用户管理页面

## 📚 相关文档

- [认证提供者](/providers/auth)
- [登录 Hook](/hooks/auth/useLogin)
- [认证检查 Hook](/hooks/auth/useCheck)
