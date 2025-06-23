# 安装指南

本指南将介绍如何手动安装 DVHA Pro 项目，适合需要集成到现有项目的开发者。

::: tip 💡 推荐使用脚手架
如果你是新项目，推荐使用 [快速开始](/pro/getting-started) 中的脚手架工具，一键创建项目。
:::

## 🎯 环境要求

| 工具              | 版本要求     | 说明                                |
| ----------------- | ------------ | ----------------------------------- |
| **Node.js**       | >= 20.0.0    | JavaScript 运行时环境               |
| **npm/pnpm/yarn** | 最新版本     | 包管理工具 (推荐 pnpm)              |
| **TypeScript**    | >= 5.0.0     | 类型安全的 JavaScript               |
| **现代浏览器**    | 支持 ES2020+ | Chrome 90+, Firefox 88+, Safari 14+ |

## 📦 核心依赖安装

### 安装 DVHA Pro 套件

```bash
# 安装核心框架和 Pro 版本
pnpm add @duxweb/dvha-core @duxweb/dvha-pro

# 安装 Naive UI 适配器
pnpm add @duxweb/dvha-naiveui

# 安装 UI 组件库
pnpm add naive-ui@^2.42.0

# 安装 Vue 生态系统
pnpm add vue@^3.5.0 vue-router@^4.5.1 pinia@^3.0.3
```

### 安装开发依赖

```bash
# 安装构建工具
pnpm add -D vite @vitejs/plugin-vue

# 安装 TypeScript 支持
pnpm add -D typescript vue-tsc @types/node
```

## 🚀 基础配置

### 创建应用入口文件

```typescript
// main.ts
import type { IConfig } from '@duxweb/dvha-core'
import {
  createDux,
  i18nProvider,
  simpleAuthProvider,
  simpleDataProvider
} from '@duxweb/dvha-core'
import {
  createDuxPro,
  DuxApp,
  DuxAuthLayout,
  DuxLayout,
  DuxLoginPage,
  DuxPage404,
  DuxPageLoading,
  enUS,
  zhCN
} from '@duxweb/dvha-pro'
import NaiveUI from 'naive-ui'
import { createApp } from 'vue'

// 导入样式文件
import '@duxweb/dvha-pro/style.css'

// 创建 Vue 应用实例
const app = createApp(DuxApp)

// DVHA 配置
const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'DVHA Pro 管理后台',

      // 基础组件配置
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        loading: DuxPageLoading,
      },

      // 登录路由
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
          meta: { authorization: false },
        },
      ],

      // 示例菜单
      menus: [
        {
          name: 'dashboard',
          path: 'dashboard',
          icon: 'i-tabler:dashboard',
          label: '仪表盘',
          component: () => import('./pages/Dashboard.vue'),
        },
      ],
    },
  ],

  // 数据提供者
  dataProvider: simpleDataProvider({
    apiUrl: 'https://your-api-domain.com/admin',
  }),

  // 认证提供者
  authProvider: simpleAuthProvider(),

  // 国际化提供者
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: { 'zh-CN': zhCN, 'en-US': enUS },
  }),
}

// 安装插件 (顺序很重要!)
app.use(createDux(config))
app.use(NaiveUI)
app.use(createDuxPro())

// 挂载应用
app.mount('#app')
```

### 创建 Vite 配置文件

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('iconify-')
        }
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
  },
})
```

### 创建示例页面

```vue
<!-- pages/Dashboard.vue -->
<script setup lang="ts">
import { DuxCard } from '@duxweb/dvha-pro'
</script>

<template>
  <div class="p-4">
    <DuxCard title="欢迎使用 DVHA Pro">
      <p>您已经成功安装了 DVHA Pro！</p>
    </DuxCard>
  </div>
</template>
```

## 🏗️ 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

打开浏览器访问 `http://localhost:5173`，你应该能看到登录页面。

## 📚 下一步

安装完成后，你可以：

- 📖 查看 [配置说明](/pro/configuration) 了解详细配置选项
- 🧩 浏览 [组件文档](/pro/components/) 学习可用组件
- 🎣 探索 [Hooks 文档](/pro/hooks/) 了解实用工具

## ❓ 常见问题

### 依赖冲突

如果遇到版本冲突：

1. 检查 Node.js 版本是否满足要求
2. 清理 node_modules 重新安装
3. 确保相关依赖版本兼容

### 样式问题

如果样式不正常显示：

1. 确保导入了 `@duxweb/dvha-pro/style.css`
2. 检查插件安装顺序
3. 查看控制台是否有错误信息
