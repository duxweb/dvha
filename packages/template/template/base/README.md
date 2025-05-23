# Dux Template - 基础管理系统模板

这是一个基于 `@duxweb/dvha-core` 框架构建的基础管理系统模板，使用 Vue 3 + UnoCSS 提供简洁现代的界面设计。

## ✨ 特性

- 🎨 **纯 UnoCSS** - 原子化 CSS 框架，无额外 UI 库依赖
- 🚀 **Vue 3** - 基于最新的 Vue 3 Composition API
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🔧 **@duxweb/dvha-core** - 集成 Dux 框架的完整功能
- 🎯 **开箱即用** - 包含常用页面和组件
- 🔒 **权限管理** - 内置登录和权限控制
- 📦 **模块化** - 易于扩展和定制

## 📁 项目结构

```
packages/template/
├── pages/           # 页面组件
│   ├── layout.vue   # 主布局（侧边栏+头部）
│   ├── home.vue     # 首页
│   ├── login.vue    # 登录页
│   └── 404.vue      # 404错误页
├── main.ts          # 应用入口
├── App.vue          # 根组件
├── uno.config.ts    # UnoCSS 配置
└── package.json     # 依赖配置
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

## 📄 页面说明

### 🏠 首页 (home.vue)
- 系统概览和统计数据
- 快速操作入口
- 最近活动记录
- 系统状态监控

### 🔐 登录页 (login.vue)
- 用户身份验证
- 表单验证和错误提示
- 记住登录状态
- 第三方登录支持

### 🎯 布局 (layout.vue)
- 固定头部导航
- 可折叠侧边栏
- 移动端适配
- 用户菜单和通知

### ❌ 404页面 (404.vue)
- 友好的错误提示
- 搜索功能
- 快速导航链接

## 🎨 样式系统

本模板使用 UnoCSS 原子化 CSS 框架，主要包含：

- **颜色系统**: 基于 Tailwind 的颜色调色板
- **图标库**: Tabler Icons (@iconify-json/tabler)
- **响应式**: 移动优先的响应式设计
- **动画**: 平滑的过渡和交互效果


## 🔧 配置说明

### Dux 配置 (main.ts)

```typescript
const config: IConfig = {
  apiUrl: 'your-api-url',
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理系统标题',
      routePrefix: '/admin',
      components: {
        authLayout: () => import('./pages/layout.vue'),
        notFound: () => import('./pages/404.vue'),
      },
      menus: [
        // 菜单配置
      ]
    }
  ],
  simpleDataProvider,
  simpleAuthProvider,
}
```

### UnoCSS 配置 (uno.config.ts)

```typescript
export default defineConfig({
  presets: [
    presetWind3(),        // Tailwind CSS 兼容
    presetIcons({         // 图标支持
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json')
      }
    })
  ]
})
```

## 🛠 自定义和扩展

### 添加新页面

1. 在 `pages/` 目录创建新的 Vue 组件
2. 在 `main.ts` 中添加路由配置
3. 在菜单配置中添加导航项

```typescript
// 添加新菜单项
menus: [
  {
    name: 'new-page',
    path: 'new-page',
    icon: 'i-tabler:page',
    label: '新页面',
    component: () => import('./pages/new-page.vue'),
  }
]
```

## 📄 许可证

MIT License

---

**提示**: 这是一个基础模板，你可以根据实际需求进行定制和扩展。如果需要更多功能，请参考 @duxweb/dvha-core 的官方文档。