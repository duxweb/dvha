# 快速开始

通过 DVHA 模板创建工具，你可以在几分钟内搭建一个完整的 Pro 版本管理后台应用。

## 🚀 一键创建项目

### 使用官方创建工具

```bash
# 使用 npm
npm create @duxweb/dvha@latest my-admin --template pro

# 使用 pnpm (推荐)
pnpm create @duxweb/dvha@latest my-admin --template pro

# 使用 yarn
yarn create @duxweb/dvha@latest my-admin --template pro
```

### 交互式创建

如果不指定项目名称，创建工具会启动交互式界面：

```bash
pnpm create @duxweb/dvha@latest
```

系统会提示你：

1. **输入项目名称** - 例如：`my-admin-app`
2. **选择模板类型** - 选择 `Vue 3 + Dux Pro - 使用 Dux Pro 组件库的 Vue 3 项目`
3. **自动创建项目** - 工具会自动复制模板文件并配置依赖

## 📁 项目结构

创建完成后，你会得到一个简洁的项目结构：

```
my-admin/
├── index.html              # HTML 入口文件
├── main.ts                 # 应用入口文件
├── vite.config.ts          # Vite 配置文件
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖配置
└── pages/                  # 页面组件目录
    └── home.vue            # 首页组件
```

## 🔧 安装依赖

进入项目目录并安装依赖：

```bash
cd my-admin

# 安装依赖
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 🚀 启动开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

启动成功后，打开浏览器访问 `http://localhost:5173`。

## 🎯 开箱即用功能

创建的项目包含以下核心功能：

- **🏠 首页仪表盘** - 展示 Pro 版功能特性
- **🎭 主题切换** - 明暗主题切换功能
- **📱 响应式设计** - 适配各种设备屏幕
- **🌐 多语言支持** - 国际化框架集成
- **🔐 认证系统** - 用户登录认证
- **🎨 UnoCSS 集成** - 原子化 CSS 支持
- **📦 Pro 组件库** - 50+ 企业级组件

## 🏗️ 构建和部署

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 部署到服务器

构建完成后，`dist/` 目录包含所有静态文件，可以部署到任何静态文件服务器。

## 📚 下一步

现在你已经成功创建了一个 DVHA Pro 项目！接下来你可以：

- 📖 查看 [配置说明](/pro/configuration) 了解详细配置选项
- 🧩 浏览 [组件文档](/pro/components/) 学习可用组件
- 🎣 探索 [Hooks 文档](/pro/hooks/) 了解实用工具

## 🆘 遇到问题？

如果在使用过程中遇到问题：

1. **查看控制台错误** - 检查浏览器开发者工具的控制台
2. **检查依赖版本** - 确保所有依赖都是兼容版本
3. **查看文档** - 浏览相关功能的详细文档
4. **社区求助** - 在 GitHub Issues 中提问

## 🎉 完成！

恭喜！你已经成功创建并运行了第一个 DVHA Pro 应用。开始探索和定制你的管理后台吧！
