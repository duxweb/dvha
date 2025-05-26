# 快速开始

DVHA 是一个基于 Vue 的中后台框架，提供了一套完整的数据管理和认证解决方案。本指南将帮助您在几分钟内创建第一个 DVHA 应用程序。

## 前置要求

开始之前，请确保您的开发环境满足以下要求：

- **Node.js** 版本 20 或更高
- **npm**、**yarn**、**pnpm** 或 **bun** 包管理器
- 基本的 **Vue 3** 和 **TypeScript** 知识

## 在线体验

如果您想在本地安装之前先体验 DVHA，可以使用我们的在线沙盒环境：

[![Edit dvha](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/funny-jerry-7xttgl?embed=1)

## 使用脚手架创建项目 (推荐)

DVHA 提供了官方脚手架工具 `@duxweb/dvha-template`，可以快速创建项目。

### 创建新项目

::: code-group

```bash [bun (推荐)]
bunx @duxweb/dvha-template@latest init
```

```bash [npx]
npx @duxweb/dvha-template@latest init
```

```bash [yarn]
yarn dlx @duxweb/dvha-template@latest init
```

```bash [pnpm]
pnpm dlx @duxweb/dvha-template@latest init
```

:::

### 指定项目名称

::: code-group

```bash [bun]
bunx @duxweb/dvha-template init my-awesome-project
```

```bash [npx]
npx @duxweb/dvha-template init my-awesome-project
```

```bash [yarn]
yarn dlx @duxweb/dvha-template init my-awesome-project
```

```bash [pnpm]
pnpm dlx @duxweb/dvha-template init my-awesome-project
```

:::

### 全局安装后使用

如果您经常创建 DVHA 项目，可以选择全局安装：

::: code-group

```bash [npm]
# 全局安装
npm install -g @duxweb/dvha-template

# 使用命令创建项目
duxweb-dvha init my-project
```

```bash [yarn]
# 全局安装
yarn global add @duxweb/dvha-template

# 使用命令创建项目
duxweb-dvha init my-project
```

```bash [pnpm]
# 全局安装
pnpm add -g @duxweb/dvha-template

# 使用命令创建项目
duxweb-dvha init my-project
```

```bash [bun]
# 全局安装
bun add -g @duxweb/dvha-template

# 使用命令创建项目
duxweb-dvha init my-project
```

:::

## 模板选择

脚手架提供了多种预配置模板：

- **Vue 3 + Vite + UnoCSS** - 基础的 Vue 3 项目模板，无 UI 框架
- **Vue 3 + Element Plus** - 集成 Element Plus 的简单模板示例
- **Vue 3 + Naive UI** - 集成 Naive UI 的简单模板示例

创建项目时，脚手架会引导您选择合适的模板。

## 安装依赖并启动项目

项目创建完成后，进入项目目录并安装依赖：

::: code-group

```bash [bun (推荐)]
cd my-awesome-project
bun install
bun run dev
```

```bash [npm]
cd my-awesome-project
npm install
npm run dev
```

```bash [yarn]
cd my-awesome-project
yarn install
yarn dev
```

```bash [pnpm]
cd my-awesome-project
pnpm install
pnpm dev
```

:::

## 项目结构

创建的项目具有以下结构：

```
my-awesome-project/
├── pages/                 # 页面组件（根据选择的模板而定）
│   ├── home.vue          # 首页
│   ├── login.vue         # 登录页面
│   ├── layout.vue        # 布局组件
│   ├── menu.vue          # 菜单组件
│   └── 404.vue           # 404 页面
├── main.ts              # 应用入口文件
├── App.vue              # 根组件
├── index.html           # HTML 入口
├── vite.config.ts       # Vite 配置
├── uno.config.ts        # UnoCSS 配置
├── tsconfig.json        # TypeScript 配置
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 快速了解核心概念

### 1. 管理端配置

DVHA 支持多管理端架构，在 `main.ts` 中可以看到管理端的配置：

```typescript
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'DVHA 后台管理系统',
      routePrefix: '/admin',
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
        }
      ]
    }
  ],
  dataProvider: simpleDataProvider({
    // 替换为自定义 API
    apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
  }),
  authProvider: simpleAuthProvider(),
}
```

### 2. 简单数据提供者

DVHA 核心包提供了 `simpleDataProvider`，这是一个开箱即用的数据提供者：

```typescript
import { simpleDataProvider } from '@duxweb/dvha-core'

// 自动处理常见的 CRUD 操作
// 支持分页、过滤、排序等功能
// 标准 ‌RESTful Api 实现
// 无需自定义配置即可使用
```

### 3. 简单认证提供者

同样，`simpleAuthProvider` 提供了基础的认证功能：

```typescript
import { simpleAuthProvider } from '@duxweb/dvha-core'

// 提供登录、登出、认证检查等基本功能
// 支持 Token 存储和管理
// 开箱即用的认证解决方案
```

## 开始开发

现在您可以开始开发您的应用了！

- 📚 阅读 [项目配置](/guide/config) 了解如何配置项目
- 🎯 查看 [数据操作 Hooks](/hooks/data/useList) 学习如何进行数据操作
- 🔐 了解 [认证系统 Hooks](/hooks/auth/useLogin) 配置用户认证
- 🧭 学习 [路由配置](/router/config) 管理应用路由

## 手动安装

如果您想要从零开始或集成到现有项目中，也可以手动安装 DVHA 核心包：

::: code-group

```bash [bun]
bun add @duxweb/dvha-core
```

```bash [npm]
npm install @duxweb/dvha-core
```

```bash [yarn]
yarn add @duxweb/dvha-core
```

```bash [pnpm]
pnpm add @duxweb/dvha-core
```

:::

然后参考 [初始化项目](/guide/init) 章节进行手动配置。

::: tip
推荐使用脚手架创建项目，它会自动配置所有必要的文件和依赖，让您可以立即开始开发。框架提供了 `simpleDataProvider` 和 `simpleAuthProvider`，让您无需编写复杂的提供者代码即可快速上手。
:::
