# DVHA Pro 版本

## 产品概览

DVHA Pro 是基于 DVHA 核心框架结合 Naive UI 打造的完整中后台前端系统，为开发者提供开箱即用的管理界面、组件库和最佳实践示例。

## 🔗 仓库信息

- **GitHub 仓库**: [https://github.com/duxweb/dvha](https://github.com/duxweb/dvha)
- **NPM 包**: [@duxweb/dvha-pro](https://www.npmjs.com/package/@duxweb/dvha-pro)
- **当前版本**: v0.0.6
- **协议**: MIT License

## 🚀 在线演示

🎯 **[立即体验 Pro 版本](http://duxweb.dux.plus/dvha/start/)** - 完整功能演示

### 演示账号

- **用户名**: 随意输入（例如：admin）
- **密码**: 随意输入（例如：123456）

> 💡 **提示**: 演示环境账号密码可以随意填写，无需真实验证

### 演示功能

- 完整的后台管理界面
- 用户权限管理系统
- 数据表格操作示例
- 表单处理和验证
- 图表和数据可视化
- 多语言国际化展示

## 📦 安装方式

### 方式一：使用模板快速创建项目

```bash
# 使用 npm
npm create @duxweb/dvha@latest my-admin --template pro

# 使用 pnpm (推荐)
pnpm create @duxweb/dvha@latest my-admin --template pro

# 使用 yarn
yarn create @duxweb/dvha@latest my-admin --template pro
```

### 方式二：手动安装依赖

```bash
# 1. 创建项目目录
mkdir my-dvha-pro
cd my-dvha-pro

# 2. 初始化 package.json
npm init -y

# 3. 安装核心依赖
pnpm add @duxweb/dvha-core @duxweb/dvha-naiveui @duxweb/dvha-pro

# 4. 安装 UI 框架
pnpm add naive-ui

# 5. 安装 Vue 生态
pnpm add vue@^3.5.0 vue-router@^4.5.1 pinia@^3.0.3

# 6. 安装开发依赖
pnpm add -D vite @vitejs/plugin-vue typescript vue-tsc @types/node
```

### 方式三：克隆示例项目

```bash
# 克隆完整仓库
git clone https://github.com/duxweb/dvha.git
cd dvha

# 安装依赖
pnpm install

# 启动 Pro 版演示（基于 apps/start/）
pnpm start:dev

# 构建 Pro 版演示
pnpm start:build
```

> 🔍 **目录说明**:
>
> - 源代码位于: `packages/pro/`
> - 演示应用位于: `apps/start/`
> - 演示账号密码: 随意输入即可

## 🛠️ 可用脚本

### 开发脚本

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 自动修复代码格式
pnpm lint:fix
```

### 包管理脚本（Monorepo）

```bash
# 构建 Pro 包
pnpm pro:build

# 构建核心包
pnpm core:build

# 构建 Naive UI 包
pnpm naiveui:build

# 构建文档
pnpm docs:build

# 启动文档开发
pnpm docs:dev
```

## 🗂️ 项目结构

### Pro 包结构（源代码）

```
packages/pro/
├── src/
│   ├── components/          # 业务组件
│   │   ├── card/           # 卡片组件
│   │   ├── carousel/       # 轮播组件
│   │   ├── dashboard/      # 仪表盘组件
│   │   ├── dialog/         # 对话框组件
│   │   ├── drawer/         # 抽屉组件
│   │   ├── form/           # 表单组件
│   │   ├── layout/         # 布局组件
│   │   ├── list/           # 列表组件
│   │   ├── modal/          # 模态框组件
│   │   ├── table/          # 表格组件
│   │   └── ...
│   ├── hooks/              # 业务 Hooks
│   │   ├── action.tsx      # 操作相关
│   │   ├── dialog.tsx      # 对话框 Hook
│   │   ├── drawer.tsx      # 抽屉 Hook
│   │   └── table/          # 表格增强 Hooks
│   ├── pages/              # 页面组件
│   │   ├── authLayout.tsx  # 认证布局
│   │   ├── layout.tsx      # 主布局
│   │   ├── menu/           # 菜单相关
│   │   └── ...
│   ├── stores/             # 状态管理
│   │   ├── index.ts
│   │   └── ui.ts
│   ├── theme/              # 主题配置
│   │   ├── css/            # 样式文件
│   │   ├── naiveTheme.ts   # Naive UI 主题
│   │   └── presetTheme.ts  # 预设主题
│   ├── langs/              # 国际化
│   │   ├── zh-CN.json
│   │   └── en-US.json
│   ├── config/             # 配置文件
│   └── index.ts            # 入口文件
├── package.json
├── vite.config.ts
├── tsconfig.json
└── uno.config.ts
```

### 演示应用结构

```
apps/start/                 # Pro 版演示应用（演示代码）
├── main.ts                 # 应用入口
├── pages/                  # 页面组件
│   ├── 404.vue
│   ├── form/
│   ├── home.vue
│   ├── list/
│   ├── login.vue
│   ├── render.vue
│   ├── setting.vue
│   └── table.vue
├── langs/                  # 语言包
│   ├── zh-CN.json
│   └── en-US.json
├── dvha/                   # DVHA 布局组件
│   ├── authLayout.vue
│   ├── layout.vue
│   ├── page404.vue
│   ├── page500.vue
│   └── pageLoading.vue
├── package.json
├── vite.config.ts
└── tsconfig.json
```

> 📁 **说明**:
>
> - `packages/pro/` - Pro 版本的源代码目录
> - `apps/start/` - Pro 版本的演示应用目录

## 💻 快速开始

### 1. 创建基础应用

```typescript
// main.ts
import type { IConfig } from '@duxweb/dvha-core'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp, DuxAuthLayout, DuxLayout, DuxLoginPage, DuxPage404, DuxPage500, DuxPageLoading, enUS, zhCN } from '@duxweb/dvha-pro'
import NaiveUI from 'naive-ui'
import { createApp } from 'vue'

// 导入样式
import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

const config: IConfig = {
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: 'DVHA Pro',
      routePrefix: '/admin',
      apiUrl: '/admin',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        loading: DuxPageLoading,
        error: DuxPage500,
      },
      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
          meta: { authorization: false },
        },
      ],
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
  dataProvider: simpleDataProvider({
    apiUrl: 'https://your-api-url.com/admin',
  }),
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({
    locale: 'zh-CN',
    fallbackLocale: 'en-US',
    messages: { 'zh-CN': zhCN, 'en-US': enUS },
  }),
}

// 安装插件
app.use(NaiveUI)
app.use(createDuxPro())
app.use(createDux(config))

app.mount('#app')
```

### 2. 创建页面组件

```vue
<!-- pages/Dashboard.vue -->
<script setup lang="ts">
import { DuxCard, DuxHello, DuxTablePage } from '@duxweb/dvha-pro'

const stats = {
  total: 1234,
  new: 56,
  active: 890
}

const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
]

const search = [
  { key: 'name', title: '姓名', type: 'input' },
  { key: 'status', title: '状态', type: 'select' },
]
</script>

<template>
  <div>
    <!-- 使用 Pro 版组件 -->
    <DuxCard title="用户统计">
      <DuxHello :data="stats" />
    </DuxCard>

    <DuxTablePage
      resource="users"
      :columns="columns"
      :search="search"
    />
  </div>
</template>
```

### 3. 配置主题

```typescript
// theme.config.ts
import { createTheme } from '@duxweb/dvha-pro'

export const theme = createTheme({
  primaryColor: '#1890ff',
  borderRadius: '6px',
  layout: {
    sider: {
      width: 240,
      collapsedWidth: 64,
    },
    header: {
      height: 64,
    },
  },
})
```

## 🎨 主要特性详解

### 🏗️ 丰富的企业级组件

| 组件类型     | 组件名称                   | 说明                   |
| ------------ | -------------------------- | ---------------------- |
| **布局组件** | DuxLayout, DuxAuthLayout   | 主布局和认证布局       |
| **表格组件** | DuxTablePage, DuxTable     | 完整的数据表格解决方案 |
| **表单组件** | DuxFormLayout, DuxFormItem | 智能表单生成和验证     |
| **对话框**   | DuxDialog, DuxModal        | 模态对话框组件         |
| **抽屉**     | DuxDrawer, DuxDrawerPage   | 侧边抽屉组件           |
| **卡片**     | DuxCard                    | 信息展示卡片           |
| **列表**     | DuxList, DuxListCard       | 数据列表组件           |
| **媒体**     | DuxMedia                   | 媒体文件处理           |
| **状态**     | DuxEmpty, DuxLoading       | 状态展示组件           |

### 🔧 强大的 Hooks 工具

| Hook 类型    | Hook 名称                    | 功能说明             |
| ------------ | ---------------------------- | -------------------- |
| **表格增强** | useTableCopy, useTableHidden | 表格复制、隐藏列功能 |
| **操作增强** | useAction                    | 统一的操作处理       |
| **对话框**   | useDialog                    | 对话框状态管理       |
| **抽屉**     | useDrawer                    | 抽屉状态管理         |
| **表单**     | useFormModal                 | 表单模态框           |

### 🎯 开箱即用的页面模板

- **仪表盘页面**: 数据统计和图表展示
- **用户管理**: 完整的 CRUD 操作示例
- **权限管理**: 角色和权限分配
- **系统设置**: 配置管理界面
- **登录页面**: 美观的认证界面
- **错误页面**: 404、500 等错误页面

## 🔑 环境要求

- **Node.js**: >= 20.0.0
- **pnpm**: >= 8.0.0 (推荐)
- **Vue**: ^3.5.0
- **TypeScript**: ^5.8.0

## 📚 依赖说明

### 核心依赖

```json
{
  "@duxweb/dvha-core": "workspace:*",
  "@duxweb/dvha-naiveui": "workspace:*",
  "naive-ui": "^2.42.0",
  "vue": "^3.5.0",
  "vue-router": "^4.5.1",
  "pinia": "^3.0.3"
}
```

### 增强功能

```json
{
  "@unocss/runtime": "^66.2.1", // 原子化 CSS
  "@vueuse/core": "^13.3.0", // Vue 工具库
  "vee-validate": "^4.15.1", // 表单验证
  "vue-command-palette": "^0.2.3", // 命令面板
  "lodash-es": "^4.17.21" // 工具函数
}
```

## 🚀 部署指南

### 构建生产版本

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/dvha-pro/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-backend-api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker 部署

```dockerfile
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 贡献指南

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](https://github.com/duxweb/dvha/blob/main/LICENSE) 文件

## 🔗 相关链接

- 📖 **[完整文档](/)** - 详细的使用指南
- 🎯 **[在线演示](http://duxweb.dux.plus/dvha/start/)** - 功能演示
- 💻 **[GitHub](https://github.com/duxweb/dvha)** - 源码仓库
- 📦 **[NPM](https://www.npmjs.com/package/@duxweb/dvha-pro)** - 包管理
- 💬 **[社区讨论](/community)** - 技术交流
- 🐛 **[问题反馈](https://github.com/duxweb/dvha/issues)** - Bug 报告
- 🚀 **[更新日志](https://github.com/duxweb/dvha/blob/main/packages/pro/CHANGELOG.md)** - 版本变更

---

<div align="center">

**🎉 感谢使用 DVHA Pro！**

如果这个项目对你有帮助，请给我们一个 ⭐️

</div>
