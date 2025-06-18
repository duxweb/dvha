# Pro 版本安装指南

本文档详细介绍如何安装和配置 DVHA Pro 版本，包括系统要求、多种安装方式和常见问题。

## 系统要求

在开始安装之前，请确保您的开发环境满足以下要求：

| 项目           | 版本要求  | 说明                    |
| -------------- | --------- | ----------------------- |
| **Node.js**    | >= 20.0.0 | 建议使用最新的 LTS 版本 |
| **pnpm**       | >= 8.0.0  | 推荐的包管理器          |
| **Vue**        | ^3.5.0    | Vue 3 框架              |
| **TypeScript** | ^5.8.0    | TypeScript 支持         |

### 检查环境

```bash
# 检查 Node.js 版本
node -v

# 检查 pnpm 版本
pnpm -v

# 如果没有安装 pnpm
npm install -g pnpm
```

## 安装方式

### 方式 1: 克隆演示项目（推荐新手）

这是最简单的方式，直接克隆包含完整示例的项目：

```bash
# 克隆项目
git clone https://github.com/duxweb/dvha.git
cd dvha

# 安装依赖
pnpm install

# 启动 Pro 版演示
pnpm start:dev
```

**访问地址**: localhost:5173

**登录账号**: 任意用户名密码（如：admin / 123456）

### 方式 2: 使用脚手架创建项目

使用官方脚手架快速创建 Pro 版项目：

```bash
# 使用 pnpm (推荐)
pnpm create @duxweb/dvha@latest my-admin --template pro

# 或使用 npm
npm create @duxweb/dvha@latest my-admin --template pro

# 进入项目目录
cd my-admin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 方式 3: 手动安装依赖

如果您想在现有项目中集成 Pro 版本：

#### 3.1 安装核心依赖

```bash
# 安装 DVHA 核心依赖
pnpm add @duxweb/dvha-core @duxweb/dvha-pro @duxweb/dvha-naiveui

# 安装 UI 框架
pnpm add naive-ui

# 安装 Vue 相关依赖
pnpm add vue vue-router pinia

# 安装开发依赖
pnpm add -D vite @vitejs/plugin-vue typescript vue-tsc
```

#### 3.2 创建 Vite 配置

```typescript
import vue from '@vitejs/plugin-vue'
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

#### 3.3 创建 TypeScript 配置

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 3.4 创建 HTML 入口

```html
<!-- index.html -->
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DVHA Pro Admin</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

#### 3.5 创建应用入口

基于 `apps/start/main.ts` 的真实配置：

```typescript
// src/main.ts
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp, DuxAuthLayout, DuxLayout, DuxLoginPage, DuxPage404, DuxPage500, DuxPageLoading, enUS, zhCN } from '@duxweb/dvha-pro'
import NaiveUI from 'naive-ui'
import { createApp } from 'vue'

import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'DVHA Pro Admin',
      routePrefix: '/admin',
      apiUrl: '/admin',
      apiRoutePath: '/routes',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        loading: DuxPageLoading,
        error: DuxPage500,
      },
      userMenus: [
        {
          label: '设置',
          key: 'setting',
          icon: 'i-tabler:settings',
          path: 'setting',
        },
      ],
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
          meta: {
            authorization: false,
          },
        },
      ],
      menus: [
        {
          name: 'home',
          path: 'index',
          icon: 'i-tabler:home',
          label: '首页',
          component: () => import('./pages/Home.vue'),
        },
      ],
    },
  ],
  dataProvider: simpleDataProvider({
    apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
  }),
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: {
      'zh-CN': zhCN,
      'en-US': enUS,
    },
  }),
}

// 按正确顺序安装插件
app.use(createDux(config))
app.use(NaiveUI)
app.use(createDuxPro())

app.mount('#app')
```

#### 3.6 创建首页组件

```vue
<!-- src/pages/Home.vue -->
<script setup lang="ts">
// 页面逻辑
</script>

<template>
  <dux-page title="首页">
    <div class="p-4">
      <h1 class="text-2xl font-bold">
        欢迎使用 DVHA Pro
      </h1>
      <p class="mt-2 text-gray-600">
        这是您的第一个 DVHA Pro 应用
      </p>
    </div>
  </dux-page>
</template>
```

#### 3.7 配置 package.json 脚本

```json
{
  "name": "my-dvha-pro-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@duxweb/dvha-core": "^0.1.22",
    "@duxweb/dvha-pro": "^0.0.6",
    "@duxweb/dvha-naiveui": "^0.0.6",
    "naive-ui": "^2.42.0",
    "vue": "^3.5.0",
    "vue-router": "^4.5.1",
    "pinia": "^2.2.2"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.4",
    "typescript": "^5.8.2",
    "vite": "^6.3.5",
    "vue-tsc": "^2.2.10"
  }
}
```

## 项目初始化

### 启动开发服务器

```bash
# 如果是克隆的项目
pnpm start:dev

# 如果是新创建的项目
pnpm dev
```

### 构建生产版本

```bash
# 构建单个项目
pnpm build

# 构建所有项目（monorepo）
pnpm start:build
```

## 可用脚本

### 开发相关脚本

基于项目根目录 `package.json` 的实际脚本：

```bash
# 启动 Pro 版演示
pnpm start:dev

# 构建 Pro 版演示
pnpm start:build

# 启动文档服务
pnpm docs:dev

# 构建文档
pnpm docs:build
```

### 包构建脚本

```bash
# 构建核心包
pnpm core:build

# 构建 Pro 包
pnpm pro:build

# 构建 Naive UI 适配包
pnpm naiveui:build

# 构建 Element UI 适配包
pnpm elementui:build
```

### 示例应用脚本

```bash
# 启动基础示例
pnpm example:dev

# 构建基础示例
pnpm example:build
```

## 依赖说明

### 核心依赖

| 包名                   | 版本    | 说明               |
| ---------------------- | ------- | ------------------ |
| `@duxweb/dvha-core`    | ^0.1.22 | DVHA 核心框架      |
| `@duxweb/dvha-pro`     | ^0.0.6  | Pro 版本组件和功能 |
| `@duxweb/dvha-naiveui` | ^0.0.6  | Naive UI 适配器    |
| `naive-ui`             | ^2.42.0 | UI 组件库          |
| `vue`                  | ^3.5.0  | Vue 3 框架         |
| `vue-router`           | ^4.5.1  | Vue 路由           |
| `pinia`                | ^2.2.2  | 状态管理           |

### 开发依赖

| 包名                 | 版本    | 说明                  |
| -------------------- | ------- | --------------------- |
| `vite`               | ^6.3.5  | 构建工具              |
| `@vitejs/plugin-vue` | ^5.2.4  | Vue 插件              |
| `typescript`         | ^5.8.2  | TypeScript 支持       |
| `vue-tsc`            | ^2.2.10 | Vue TypeScript 编译器 |

## 版本兼容性

| DVHA Pro 版本 | DVHA Core 版本 | Vue 版本 | Node.js 版本 |
| ------------- | -------------- | -------- | ------------ |
| 0.0.6+        | 0.1.22+        | 3.5.0+   | 20.0.0+      |
| 0.0.5         | 0.1.21         | 3.4.0+   | 18.0.0+      |

## 常见问题

### Q: 安装失败，提示网络错误？

**A**: 尝试使用国内镜像源：

```bash
# 设置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 设置 pnpm 镜像
pnpm config set registry https://registry.npmmirror.com
```

### Q: 启动时报错 "Cannot find module"？

**A**: 确保依赖正确安装：

```bash
# 删除 node_modules 和锁文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### Q: TypeScript 类型错误？

**A**: 确保安装了正确的类型定义：

```bash
# 安装类型定义
pnpm add -D @types/node

# 检查 tsconfig.json 配置
```

### Q: 样式显示异常？

**A**: 确保导入了 Pro 版本的样式文件：

```typescript
// main.ts
import '@duxweb/dvha-pro/style.css'
```

### Q: 如何升级到最新版本？

**A**: 使用以下命令升级：

```bash
# 升级所有 DVHA 相关包
pnpm up "@duxweb/*"

# 或者升级特定包
pnpm up @duxweb/dvha-pro@latest
```

## 升级指南

### 从 0.0.5 升级到 0.0.6

1. **更新依赖版本**：

```bash
pnpm up @duxweb/dvha-core@^0.1.22 @duxweb/dvha-pro@^0.0.6
```

2. **检查配置变更**：查看 [配置说明](/pro/configuration) 了解新的配置选项。

3. **更新代码**：按照新版本的 API 调整代码。

### 自动升级脚本

```bash
#!/bin/bash
# upgrade-dvha.sh

echo "正在升级 DVHA Pro..."

# 备份 package.json
cp package.json package.json.backup

# 升级依赖
pnpm up "@duxweb/*"

# 重新安装
pnpm install

echo "升级完成！"
```

## 下一步

安装完成后，您可以：

- 🚀 [快速开始](/pro/getting-started) - 5分钟创建第一个页面
- ⚙️ [配置说明](/pro/configuration) - 了解详细配置选项
- 🧩 [组件库](/pro/components/layout) - 探索企业级组件

## 获取帮助

如果在安装过程中遇到问题：

- 📚 [查看文档](/pro/) - 完整的使用指南
- 💬 [加入社区](/community) - 与其他开发者交流
- 🐛 [提交 Issue](https://github.com/duxweb/dvha/issues) - 报告问题或建议
- 🌟 [查看源码](https://github.com/duxweb/dvha) - 深入了解实现原理
