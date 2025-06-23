# 配置说明

详细介绍 DVHA Pro 版本的配置选项，包括应用入口配置、Pro 插件配置、主题定制等关键设置。

## 🔧 应用入口配置 (main.ts)

### 基础配置结构

DVHA Pro 的配置分为几个层次：核心框架配置、Pro 插件配置和主题配置。

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
  DuxApp
} from '@duxweb/dvha-pro'
import NaiveUI from 'naive-ui'
import { createApp } from 'vue'

// 导入样式
import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

// 完整配置示例
const config: IConfig = {
  // 全局配置
  title: 'DVHA Pro 管理后台',
  description: '基于 Vue 3 的企业级管理后台',
  defaultManage: 'admin',

  // 管理端配置
  manages: [/* 管理端配置数组 */],

  // 提供者配置
  dataProvider: simpleDataProvider({ /* 数据提供者配置 */ }),
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({ /* 国际化配置 */ }),

  // 主题配置
  theme: { /* 主题配置 */ },
}

// 插件安装顺序
app.use(createDux(config)) // 1. 核心框架
app.use(NaiveUI) // 2. UI 组件库
app.use(createDuxPro()) // 3. Pro 插件

app.mount('#app')
```

## 📱 管理端配置详解

### 基础管理端配置

```typescript
const config: IConfig = {
  manages: [
    {
      // 基础信息
      name: 'admin', // 管理端标识
      title: 'DVHA Pro 管理后台', // 管理端标题
      copyright: '© 2024 DVHA Pro', // 版权信息
      description: '企业级管理后台', // 描述信息

      // 功能开关
      register: false, // 是否支持注册
      forgotPassword: true, // 是否支持忘记密码
      updatePassword: true, // 是否支持修改密码

      // 路由配置
      routePrefix: '/admin', // 路由前缀
      apiRoutePath: '/admin/routes', // 远程路由 API 路径

      // 布局组件配置
      components: {
        authLayout: DuxAuthLayout, // 认证页面布局
        noAuthLayout: DuxLayout, // 主应用布局
        notFound: DuxPage404, // 404 页面
        loading: DuxPageLoading, // 加载页面
        error: DuxPage500, // 错误页面
      },

      // 路由配置
      // API 路由配置
      apiUrl: '/admin', // API 基础路径
      apiRoutePath: '/routes', // 远程路由API路径

      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
          meta: { authorization: false },
        },
      ],

      // 用户菜单配置 (用户头像下拉菜单)
      userMenus: [
        {
          key: 'profile',
          label: '个人资料',
          icon: 'i-tabler:user',
          path: 'profile',
        },
        {
          key: 'setting',
          label: '设置',
          icon: 'i-tabler:settings',
          path: 'setting',
        },
      ],

      // 菜单配置
      menus: [
        {
          name: 'dashboard',
          path: 'dashboard',
          icon: 'i-tabler:dashboard',
          label: '仪表盘',
          component: () => import('./pages/Dashboard.vue'),
        },
        {
          name: 'users',
          icon: 'i-tabler:users',
          label: '用户管理',
          children: [
            {
              name: 'users.list',
              path: 'users',
              label: '用户列表',
              component: () => import('./pages/users/List.vue'),
            },
            {
              name: 'users.roles',
              path: 'users/roles',
              label: '角色管理',
              component: () => import('./pages/users/Roles.vue'),
            },
          ],
        },
      ],
    },
  ],
}
```

### Pro 版专属配置

Pro 版扩展了管理端配置，增加了以下特有选项：

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: 'DVHA Pro',

      // Pro 版特有的 API 路径配置
      apiPath: {
        upload: '/api/upload', // 文件上传 API
        uploadManager: '/api/upload/manager', // 文件管理 API
        ai: '/api/ai', // AI 功能 API
      },

      // 远程组件配置
      remote: {
        packages: {
          'vue': Vue,
          'naive-ui': NaiveUI,
          '@duxweb/dvha-pro': DuxPro,
        },
        apiMethod: 'POST',
        apiRoutePath: '/admin/remote/components',
      },
    },
  ],
}
```

## 🎨 Pro 插件配置 (createDuxPro)

### 基础 Pro 配置

```typescript
// 无参数配置 (使用默认配置)
app.use(createDuxPro())
```

**注意**: 根据实际代码，`createDuxPro()` 函数目前不接受任何配置参数，它会自动初始化以下功能：

1. **UnoCSS 运行时**：原子化 CSS 支持
2. **ECharts 组件**：注册为全局 `v-chart` 组件
3. **表单验证**：VeeValidate 国际化配置
4. **业务组件**：注册所有 Pro 版业务组件

## 🎯 主题配置详解

### 基础主题配置

```typescript
const config: IConfig = {
  theme: {
    // Logo 配置
    logo: '/logo.png', // 亮色主题 Logo
    darkLogo: '/logo-dark.png', // 暗色主题 Logo

    // 横幅配置
    banner: '/banner.jpg', // 亮色主题横幅
    darkBanner: '/banner-dark.jpg', // 暗色主题横幅

    // 主题颜色配置
    defaultTheme: {
      primary: 'emerald', // 主色调
      info: 'cyan', // 信息色
      success: 'green', // 成功色
      warning: 'amber', // 警告色
      error: 'red', // 错误色
      gray: 'zinc', // 灰色系
    },
  },
}
```

### Naive UI 主题集成

Pro 版会自动处理 Naive UI 主题集成，无需在配置中手动设置。主题系统通过 `useTheme()` hook 自动管理。

## 🔄 远程组件配置

### 全局远程配置

```typescript
const config: IConfig = {
  remote: {
    // 远程组件包映射
    packages: {
      'vue': Vue,
      'naive-ui': NaiveUI,
      '@duxweb/dvha-pro': DuxPro,
      '@duxweb/dvha-core': DuxCore,
    },

    // 远程 API 配置
    apiMethod: 'POST', // 请求方法
    apiRoutePath: '/api/remote/components', // 远程组件 API 路径
  },
}
```

## 👤 用户菜单配置详解

### userMenus 配置

`userMenus` 用于配置用户头像下拉菜单中的自定义菜单项，显示在语言切换和主题设置之前。

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',

      // 用户菜单配置
      userMenus: [
        {
          key: 'profile', // 菜单项唯一标识
          label: '个人资料', // 显示文本 (支持国际化key)
          icon: 'i-tabler:user', // 图标类名 (Tabler Icons)
          path: 'profile', // 路径 (相对路径会自动加上 routePrefix)
        },
        {
          key: 'setting',
          label: 'components.menu.setting', // 国际化key
          icon: 'i-tabler:settings',
          path: 'setting',
        },
        {
          key: 'help',
          label: '帮助中心',
          icon: 'i-tabler:help',
          path: '/help', // 绝对路径
        },
      ],
    },
  ],
}
```

### 用户菜单项属性

| 属性名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| key | string | ✅ | 菜单项唯一标识，用于事件处理 |
| label | string | ✅ | 显示文本，支持国际化key |
| icon | string | ✅ | 图标类名，推荐使用 Tabler Icons |
| path | string | ✅ | 跳转路径，相对路径会加上 routePrefix |

### 国际化支持

用户菜单支持国际化，可以在 `label` 中使用国际化key：

```typescript
// 国际化配置
const i18nMessages = {
  'zh-CN': {
    'components.menu.profile': '个人资料',
    'components.menu.setting': '系统设置',
  },
  'en-US': {
    'components.menu.profile': 'Profile',
    'components.menu.setting': 'Settings',
  },
}

// 用户菜单配置
userMenus: [
  {
    key: 'profile',
    label: 'components.menu.profile', // 使用国际化key
    icon: 'i-tabler:user',
    path: 'profile',
  },
]
```

### 路径处理规则

1. **相对路径**: 自动加上当前管理端的 `routePrefix`
   ```typescript
   path: 'profile' // → /admin/profile (假设 routePrefix 为 '/admin')
   ```

2. **绝对路径**: 直接使用，不做任何处理
   ```typescript
   path: '/help' // → /help
   ```

3. **外部链接**: 支持外部链接跳转
   ```typescript
   path: 'https://docs.example.com' // → 外部链接
   ```

## 🔧 自定义提供者

DVHA Pro 支持完全自定义的提供者配置，实现高度定制化的功能：

### 数据提供者

详细的数据提供者配置请参考 [数据提供者文档](/providers/data)

### 认证提供者

详细的认证提供者配置请参考 [认证提供者文档](/providers/auth)

### 国际化提供者

详细的国际化提供者配置请参考 [国际化提供者文档](/providers/i18n)

## 📋 配置示例

### 完整的生产环境配置

```typescript
// main.ts 生产环境配置示例
const config: IConfig = {
  title: 'DVHA Pro 企业管理系统',
  defaultManage: 'admin',

  manages: [
    {
      name: 'admin',
      title: 'DVHA Pro 管理后台',
      copyright: '© 2024 DVHA Pro',

      // 功能开关
      register: false,
      forgotPassword: true,
      updatePassword: true,

      routePrefix: '/admin',

      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        loading: DuxPageLoading,
        error: DuxPage500,
      },

      // Pro 版特有配置
      apiPath: {
        upload: '/api/upload',
        uploadManager: '/api/upload/manager',
        ai: '/api/ai',
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

  // 提供者配置
  dataProvider: simpleDataProvider({
    apiUrl: process.env.VITE_API_URL || 'https://api.example.com/admin',
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

  // 主题配置
  theme: {
    logo: '/logo.png',
    darkLogo: '/logo-dark.png',
    defaultTheme: {
      primary: 'blue',
      info: 'cyan',
      success: 'green',
      warning: 'amber',
      error: 'red',
      gray: 'zinc',
    },
  },
}
```

## ⚡ 性能优化

### 构建优化配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'dvha-core': ['@duxweb/dvha-core'],
          'dvha-pro': ['@duxweb/dvha-pro'],
        }
      }
    }
  }
})
```

### 环境变量配置

```bash
# .env.production
VITE_API_URL=https://api.your-domain.com
VITE_APP_TITLE=DVHA Pro 生产环境
```

## 📚 相关文档

- [快速开始](/pro/getting-started) - 了解如何创建项目
- [组件文档](/pro/components/) - 学习可用组件
- [Hooks 文档](/pro/hooks/) - 探索实用工具

## ❓ 常见问题

### 配置不生效

如果配置修改后不生效，请检查：

1. 插件安装顺序是否正确
2. 配置对象是否有语法错误
3. 重启开发服务器

### 主题配置问题

如果主题配置不正确：

1. 检查颜色名称是否正确（如 blue, green, red 等）
2. 确保 Logo 路径正确
3. 查看控制台是否有错误信息
