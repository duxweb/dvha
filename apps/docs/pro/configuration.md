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
  DuxApp,
  DuxAuthLayout,
  DuxLayout,
  DuxLoginPage,
  DuxPage404,
  DuxPage500,
  DuxPageLoading,
  enUS,
  zhCN
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
      apiRoutePath: '/routes', // 远程路由 API 路径

      // API 配置 - 使用新的 apiBasePath
      apiBasePath: '/admin', // API 基础路径

      // 布局组件配置
      components: {
        authLayout: DuxAuthLayout, // 认证页面布局
        noAuthLayout: DuxLayout, // 主应用布局
        notFound: DuxPage404, // 404 页面
        loading: DuxPageLoading, // 加载页面
        error: DuxPage500, // 错误页面
      },

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
      apiBasePath: '/admin',

      // Pro 版特有的 API 路径配置
      apiPath: {
        upload: '/api/upload', // 文件上传 API
        uploadManager: '/api/upload/manager', // 文件管理 API
        ai: '/api/ai', // AI 功能 API
        [key: string]: any // 支持自定义 API 路径
      },

      // 上传配置
      upload: {
        driver: 'local', // 上传驱动：'local' | 's3'
        signPath: '/api/upload/sign', // S3 签名路径（仅 S3 驱动需要）
        signCallback: (response: IDataProviderResponse) => ({
          uploadUrl: response.data?.uploadUrl,
          url: response.data?.url,
          params: response.data?.params,
        }),
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

**重要说明**: 根据最新代码，`createDuxPro()` 函数不接受任何配置参数，它会自动初始化以下功能：

1. **表单验证**：VeeValidate 国际化配置
2. **UnoCSS 运行时**：原子化 CSS 支持
3. **ECharts 组件**：注册为全局 `v-chart` 组件
4. **业务组件**：自动注册所有 Pro 版业务组件
5. **样式主题**：自动加载 css 主题样式

### Pro 插件自动化配置

Pro 插件会自动处理以下配置：

```typescript
// 这些功能无需手动配置，Pro 插件会自动初始化
export function createDuxPro() {
  // 1. 初始化表单验证
  initVeeValidate()

  // 2. 初始化 UnoCSS 运行时
  initUnocssRuntime({
    defaults: unoConfig(false),
    bypassDefined: true,
  })

  return {
    install(app: App) {
      // 3. 注册 ECharts 组件
      app.component('v-chart', VueECharts)
      // 4. 注册所有业务组件
      app.use(component)
    },
  }
}
```

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

## 📁 上传配置详解

### 本地上传配置

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',

      // API 路径配置
      apiPath: {
        upload: '/api/upload', // 上传接口路径
        uploadManager: '/api/upload/manager', // 文件管理接口路径
      },

      // 本地上传配置
      upload: {
        driver: 'local', // 使用本地上传驱动
      },
    },
  ],
}
```

### S3 云存储配置

```typescript
const config: IConfig = {
  manages: [
    {
      name: 'admin',

      // S3 上传配置
      upload: {
        driver: 's3', // 使用 S3 上传驱动
        signPath: '/api/upload/sign', // S3 签名接口路径
        signCallback: (response: IDataProviderResponse) => ({
          uploadUrl: response.data?.uploadUrl, // S3 上传地址
          url: response.data?.url, // 文件最终访问地址
          params: response.data?.params, // 额外的上传参数
        }),
      },
    },
  ],
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
  DuxPage500,
  DuxPageLoading,
  enUS,
  zhCN
} from '@duxweb/dvha-pro'
import NaiveUI from 'naive-ui'
import { createApp } from 'vue'

import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

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
      apiBasePath: '/admin', // 使用新的 apiBasePath

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

      // 上传配置
      upload: {
        driver: 's3', // 生产环境推荐使用 S3
        signPath: '/api/upload/sign',
        signCallback: response => ({
          uploadUrl: response.data?.uploadUrl,
          url: response.data?.url,
          params: response.data?.params,
        }),
      },

      routes: [
        {
          name: 'admin.login',
          path: 'login',
          component: DuxLoginPage,
          meta: { authorization: false },
        },
      ],

      userMenus: [
        {
          key: 'profile',
          label: '个人资料',
          icon: 'i-tabler:user',
          path: 'profile',
        },
        {
          key: 'setting',
          label: '系统设置',
          icon: 'i-tabler:settings',
          path: 'setting',
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
    apiUrl: process.env.VITE_API_URL || 'https://api.example.com',
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

  // 远程组件配置
  remote: {
    packages: {
      'naive-ui': NaiveUI,
      '@duxweb/dvha-pro': DuxPro,
    },
  },
}

// 插件安装
app.use(createDux(config))
app.use(NaiveUI)
app.use(createDuxPro()) // 不接受任何参数

app.mount('#app')
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
- [数据提供者](/providers/data) - 配置数据接口
- [认证提供者](/providers/auth) - 配置认证系统
- [国际化提供者](/providers/i18n) - 配置多语言

## ❓ 常见问题

### 样式加载问题

如果样式不生效，请检查：

1. 确保使用了正确的样式导入：`@duxweb/dvha-pro/style.css`
3. 重启开发服务器

### API 配置问题

如果 API 请求失败：

1. 确保使用了 `apiBasePath` 而不是 `apiUrl`
2. 检查数据提供者配置
3. 查看控制台网络请求

### 上传功能问题

如果上传不工作：

1. 检查 `apiPath.upload` 配置
2. 确认后端接口格式
3. 检查文件大小和类型限制

### 主题配置问题

如果主题配置不正确：

1. 检查颜色名称是否正确（如 blue, green, red 等）
2. 确保 Logo 路径正确
3. 查看控制台是否有错误信息
