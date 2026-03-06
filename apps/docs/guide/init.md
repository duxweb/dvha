# 初始化项目

本指南将帮助您手动创建 DVHA 应用程序，适合需要从零开始或集成到现有项目的场景。如果您希望快速开始，建议使用 [脚手架工具](/guide/started)。

## 前置要求

开始之前，请确保您的开发环境满足以下要求：

- **Node.js** 版本 20 或更高
- **npm**、**yarn**、**pnpm** 或 **bun** 包管理器
- 基本的 **Vue 3** 和 **TypeScript** 知识

## 1. 创建 Vite + Vue 项目

首先创建一个新的 Vite + Vue + TypeScript 项目：

::: code-group

```bash [bun]
bun create vue@latest my-dvha-app
```

```bash [npm]
npm create vue@latest my-dvha-app
```

```bash [yarn]
yarn create vue@latest my-dvha-app
```

```bash [pnpm]
pnpm create vue@latest my-dvha-app
```

:::

在创建过程中，选择以下配置：
- ✅ Add TypeScript?  **Yes**
- ✅ Add JSX Support?  **Yes**（可选）
- ✅ Add Vue Router for Single Page Application development?  **Yes**
- ❌ Add Pinia for state management?  **No**（DVHA 内置状态管理）
- ❌ Add Vitest for Unit testing?  **可选**
- ❌ Add an End-to-End Testing Solution?  **可选**
- ❌ Add ESLint for code quality?  **可选**

## 2. 安装 DVHA 依赖

进入项目目录并安装必要的依赖：

::: code-group

```bash [bun]
cd my-dvha-app

# 安装 DVHA 核心包
bun add @duxweb/dvha-core

# 安装 UnoCSS 相关依赖
bun add -D unocss @unocss/reset @unocss/preset-icons

# 安装图标包
bun add -D @iconify-json/tabler

# 安装必要依赖
bun add -D @vitejs/plugin-vue-jsx

# 可选依赖（按需安装）
# bun add @vueuse/core @vueuse/integrations axios lodash-es
```

```bash [npm]
cd my-dvha-app

# 安装 DVHA 核心包
npm install @duxweb/dvha-core

# 安装 UnoCSS 相关依赖
npm install -D unocss @unocss/reset @unocss/preset-icons

# 安装图标包
npm install -D @iconify-json/tabler

# 安装必要依赖
npm install -D @vitejs/plugin-vue-jsx

# 可选依赖（按需安装）
# npm install @vueuse/core @vueuse/integrations axios lodash-es
```

```bash [yarn]
cd my-dvha-app

# 安装 DVHA 核心包
yarn add @duxweb/dvha-core

# 安装 UnoCSS 相关依赖
yarn add -D unocss @unocss/reset @unocss/preset-icons

# 安装图标包
yarn add -D @iconify-json/tabler

# 安装必要依赖
yarn add -D @vitejs/plugin-vue-jsx

# 可选依赖（按需安装）
# yarn add @vueuse/core @vueuse/integrations axios lodash-es
```

```bash [pnpm]
cd my-dvha-app

# 安装 DVHA 核心包
pnpm add @duxweb/dvha-core

# 安装 UnoCSS 相关依赖
pnpm add -D unocss @unocss/reset @unocss/preset-icons

# 安装图标包
pnpm add -D @iconify-json/tabler

# 安装必要依赖
pnpm add -D @vitejs/plugin-vue-jsx

# 可选依赖（按需安装）
# pnpm add @vueuse/core @vueuse/integrations axios lodash-es
```

:::

## 3. 配置 Vite

更新 `vite.config.ts`，添加必要的插件：

```typescript
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    VueJsx(),
    UnoCSS(),
  ],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
    outDir: resolve(__dirname, 'dist'),
  },
})
```

## 4. 配置 UnoCSS

创建 `uno.config.ts` 文件：

```typescript
import { defineConfig, presetIcons, presetWind } from 'unocss'
import icons from '@iconify-json/tabler/icons.json'

const generateSafeList = () => {
  return Object.keys(icons.icons).flatMap((item) => {
    return `i-tabler:${item}`
  })
}

const safeList = generateSafeList()

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons({
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then(i => i.default),
      },
    }),
  ],
  safelist: safeList,
})
```

## 5. 更新 TypeScript 配置

更新 `tsconfig.json`，确保正确的配置：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "lib": ["ESNext", "DOM"],
    "moduleDetection": "force",
    "useDefineForClassFields": true,
    "baseUrl": ".",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.vue",
    "**/*.d.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

## 6. 配置主应用入口

更新 `src/main.ts`，配置 DVHA：

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleDataProvider, simpleAuthProvider } from '@duxweb/dvha-core'
import { createApp } from 'vue'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

const app = createApp(App)

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'DVHA 后台管理系统',
      routePrefix: '/admin',
      apiBasePath: '/admin',
      components: {
        authLayout: () => import('./pages/layout.vue'),
        notFound: () => import('./pages/404.vue'),
      },
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: () => import('./pages/login.vue'),
          meta: {
            authorization: false,
          }
        },
      ],
      menus: [
        {
          name: 'home',
          path: 'index',
          icon: 'i-tabler:home',
          label: '首页',
          component: () => import('./pages/home.vue'),
        },
        {
          name: 'users',
          path: 'users',
          icon: 'i-tabler:users',
          label: '用户管理',
          component: () => import('./pages/home.vue'),
        },
        {
          name: 'settings',
          path: 'settings',
          icon: 'i-tabler:settings',
          label: '系统设置',
          component: () => import('./pages/home.vue'),
        },
      ]
    },
  ],
  dataProvider: simpleDataProvider({
    // 替换为你的 API
    apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
  }),
  authProvider: simpleAuthProvider(),
}

app.use(createDux(config))
app.mount('#app')
```

## 7. 创建页面组件

### 创建页面目录

在 `src` 目录下创建 `pages` 文件夹：

```bash
mkdir src/pages
```

### 7.1 创建布局组件

创建 `src/pages/layout.vue`：

```vue
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 头部 -->
    <header class="bg-white shadow-sm border-b fixed w-full top-0 z-50">
      <div class="flex items-center justify-between h-16 px-4">
        <div class="flex items-center">
          <button @click="toggleSidebar" class="p-2 rounded hover:bg-gray-100 lg:hidden">
            <div class="i-tabler:menu-2 text-xl"></div>
          </button>
          <div class="flex items-center ml-4 lg:ml-0">
            <div class="i-tabler:brand-vue text-2xl text-blue-600 mr-3"></div>
            <h1 class="text-xl font-bold">{{ manage.config?.title || 'DVHA Admin' }}</h1>
          </div>
        </div>

        <!-- 用户菜单 -->
        <div class="relative">
          <button @click="showUserMenu = !showUserMenu" class="flex items-center p-2 rounded hover:bg-gray-100">
            <div class="i-tabler:user-circle text-xl mr-2"></div>
            <span class="hidden md:block text-sm font-medium">{{ getUserName() }}</span>
            <div class="i-tabler:chevron-down text-sm ml-1 hidden md:block"></div>
          </button>

          <div v-if="showUserMenu" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50">
            <div class="py-1">
              <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                <div class="i-tabler:logout mr-3"></div>
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex pt-16 flex-1">
      <!-- 侧边栏 -->
      <Sidebar :sidebar-open="sidebarOpen" />

      <!-- 遮罩层 -->
      <div v-if="sidebarOpen" @click="toggleSidebar" class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"></div>

      <!-- 主内容 -->
      <main class="flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useManage, useGetAuth, useLogout } from '@duxweb/dvha-core'
import Sidebar from './menu.vue'

const manage = useManage()
const user = useGetAuth()

const { mutate: logout } = useLogout({
  onSuccess: () => console.log('退出成功'),
  onError: (error) => console.error('退出失败:', error)
})

const sidebarOpen = ref(false)
const showUserMenu = ref(false)

const getUserName = () => user?.info?.name || user?.info?.username || 'Admin'
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value
const handleLogout = () => logout()

const closeDropdowns = (event: Event) => {
  if (!(event.target as HTMLElement).closest('.relative')) {
    showUserMenu.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdowns))
onUnmounted(() => document.removeEventListener('click', closeDropdowns))
</script>
```

### 7.2 创建菜单组件

创建 `src/pages/menu.vue`：

```vue
<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r pt-16 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <nav class="h-full px-3 py-4 overflow-y-auto">
      <ul class="space-y-2">
        <li v-for="menu in menus" :key="menu.name">
          <router-link
            :to="getRoutePath(menu.path)"
            class="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            active-class="bg-blue-100 text-blue-700"
          >
            <div :class="menu.icon" class="text-xl"></div>
            <span class="ms-3">{{ menu.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useMenu, useManage } from '@duxweb/dvha-core'

defineProps<{
  sidebarOpen: boolean
}>()

const menus = useMenu()
const { getRoutePath } = useManage()
</script>
```

### 7.3 创建登录页面

创建 `src/pages/login.vue`：

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
          <div class="i-tabler:brand-vue text-2xl text-white"></div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登录到您的账户
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">用户名</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="用户名"
            />
          </div>
          <div>
            <label for="password" class="sr-only">密码</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="密码"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isPending"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="isPending" class="i-tabler:loader-2 animate-spin mr-2"></span>
            {{ isPending ? '登录中...' : '登录' }}
          </button>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error.message }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLogin } from '@duxweb/dvha-core'

const form = ref({
  username: '',
  password: ''
})

const { mutate: login, isPending, error } = useLogin({
  onSuccess: () => {
    console.log('登录成功')
  },
  onError: (err) => {
    console.error('登录失败:', err)
  }
})

const handleSubmit = () => {
  if (form.value.username && form.value.password) {
    login(form.value)
  }
}
</script>
```

### 7.4 创建首页

创建 `src/pages/home.vue`：

```vue
<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">欢迎使用 DVHA</h1>
      <p class="text-gray-600">一个少编译、更灵活的 Vue 中后台框架</p>
    </div>
  </div>
</template>
```

### 7.5 创建 404 页面

创建 `src/pages/404.vue`：

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="i-tabler:error-404 text-6xl text-gray-400 mx-auto mb-4"></div>
        <h1 class="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p class="text-gray-600">抱歉，您访问的页面不存在</p>
      </div>

      <div class="space-y-4">
        <button
          @click="$router.go(-1)"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回上一页
        </button>

        <router-link
          :to="{ name: getHomePath() }"
          class="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          回到首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useManage } from '@duxweb/dvha-core'

const manage = useManage()

const getHomePath = () => `${manage.config?.name}.index`
</script>
```

## 8. 更新根组件

更新 `src/App.vue`：

```vue
<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// App 组件现在可以保持简洁
// DVHA 会自动处理路由和布局
</script>
```

## 9. 启动项目

现在您可以启动项目了：

::: code-group

```bash [bun]
bun run dev
```

```bash [npm]
npm run dev
```

```bash [yarn]
yarn dev
```

```bash [pnpm]
pnpm dev
```

:::

## 10. 访问应用

打开浏览器访问 `http://localhost:5173/admin`，您将看到登录页面。

默认情况下，您可以使用任意用户名和密码登录（simpleAuthProvider 用于开发测试）。

## 下一步

恭喜！您已经成功创建了一个 DVHA 应用程序。接下来您可以：

- 📚 阅读 [项目配置](/guide/config) 了解更多配置选项
- 🎯 查看 [数据操作 Hooks](/hooks/data/useList) 学习数据管理
- 🔐 了解 [认证系统 Hooks](/hooks/auth/useLogin) 自定义认证逻辑
- 🧭 学习 [路由配置](/router/config) 管理更复杂的路由

::: tip
建议在生产环境中替换 `simpleDataProvider` 和 `simpleAuthProvider` 为自定义的实现，以满足您的具体业务需求。
:::
