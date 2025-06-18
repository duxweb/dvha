# Pro 版本配置说明

DVHA Pro 提供了丰富的配置选项，让您可以灵活定制应用的各个方面。本文基于 `apps/start/main.ts` 的实际配置进行详细说明。

## 实际配置示例

### 完整配置文件

基于 `apps/start/main.ts` 的真实配置：

```typescript
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
      title: 'Dvha Pro',
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
          component: () => import('./pages/home.vue'),
        },
        {
          name: 'example.list',
          icon: 'i-tabler:layout-kanban',
          label: '列表',
        },
        {
          name: 'table',
          path: 'table',
          icon: 'i-tabler:table',
          label: '表格列表',
          component: () => import('./pages/table.vue'),
          parent: 'example.list',
        },
        {
          name: 'list.card',
          path: 'list/card',
          icon: 'i-tabler:list-check',
          label: '卡片列表',
          parent: 'example.list',
          component: () => import('./pages/list/card.vue'),
        },
        {
          name: 'list.article',
          path: 'list/article',
          icon: 'i-tabler:article',
          label: '文章列表',
          parent: 'example.list',
          component: () => import('./pages/list/article.vue'),
        },
        {
          name: 'list.list',
          path: 'list/list',
          icon: 'i-tabler:list',
          label: '订单列表',
          parent: 'example.list',
          component: () => import('./pages/list/list.vue'),
        },
        {
          name: 'example.form',
          icon: 'i-tabler:layout-kanban',
          label: '表单',
        },
        {
          name: 'form.form',
          path: 'form/form',
          icon: 'i-tabler:forms',
          label: '表单页面',
          component: () => import('./pages/form/page.vue'),
          parent: 'example.form',
        },
        {
          name: 'form.setting',
          path: 'form/setting',
          icon: 'i-tabler:settings',
          label: '个人设置',
          component: () => import('./pages/setting.vue'),
          parent: 'example.form',
        },
        {
          name: 'render',
          icon: 'i-tabler:layout-kanban',
          label: '渲染',
        },
        {
          name: 'render.json',
          path: 'render/json',
          label: 'Json渲染',
          parent: 'render',
          icon: 'i-tabler:json',
          component: () => import('./pages/render.vue'),
        },
        {
          name: 'render.remote',
          path: 'render/remote',
          icon: 'i-tabler:list-check',
          label: '远程渲染',
          loader: 'remote',
          parent: 'render',
          meta: {
            path: '/remote',
          },
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

// 插件安装顺序很重要
app.use(createDux(config)) // 先安装 Dux (包含 Pinia 初始化)
app.use(NaiveUI) // 然后安装 UI 框架
app.use(createDuxPro()) // 最后安装 Pro 插件

app.mount('#app')
```

## 配置项详解

### 1. 基础配置

```typescript
const config: IConfig = {
  defaultManage: 'admin',  // 默认管理端名称
  manages: [/* 管理端配置 */],
  dataProvider: /* 数据提供者 */,
  authProvider: /* 认证提供者 */,
  i18nProvider: /* 国际化提供者 */,
}
```

### 2. 管理端配置

```typescript
{
  name: 'admin',              // 管理端唯一标识
  title: 'Dvha Pro',         // 管理端标题
  routePrefix: '/admin',      // 路由前缀
  apiUrl: '/admin',           // API 基础地址
  apiRoutePath: '/routes',    // 动态路由获取路径

  // 页面组件配置
  components: {
    authLayout: DuxAuthLayout,    // 认证布局（登录页面）
    noAuthLayout: DuxLayout,      // 主布局（登录后）
    notFound: DuxPage404,         // 404 页面
    loading: DuxPageLoading,      // 加载页面
    error: DuxPage500,            // 错误页面
  },

  // 用户菜单配置
  userMenus: [
    {
      label: '设置',
      key: 'setting',
      icon: 'i-tabler:settings',
      path: 'setting',
    },
  ],

  // 静态路由配置
  routes: [
    {
      name: 'admin.login',
      path: 'login',
      component: DuxLoginPage,
      meta: {
        authorization: false,  // 不需要认证
      },
    },
  ],
}
```

### 3. 菜单结构配置

示例中展示了完整的菜单层级结构：

```typescript
menus: [
  // 首页
  {
    name: 'home',
    path: 'index',
    icon: 'i-tabler:home',
    label: '首页',
    component: () => import('./pages/home.vue'),
  },

  // 列表分组
  {
    name: 'example.list',
    icon: 'i-tabler:layout-kanban',
    label: '列表', // 分组菜单，无路径
  },
  {
    name: 'table',
    path: 'table',
    icon: 'i-tabler:table',
    label: '表格列表',
    component: () => import('./pages/table.vue'),
    parent: 'example.list', // 归属于列表分组
  },
  {
    name: 'list.card',
    path: 'list/card',
    icon: 'i-tabler:list-check',
    label: '卡片列表',
    parent: 'example.list',
    component: () => import('./pages/list/card.vue'),
  },

  // 表单分组
  {
    name: 'example.form',
    icon: 'i-tabler:layout-kanban',
    label: '表单',
  },
  {
    name: 'form.form',
    path: 'form/form',
    icon: 'i-tabler:forms',
    label: '表单页面',
    component: () => import('./pages/form/page.vue'),
    parent: 'example.form',
  },

  // 渲染功能
  {
    name: 'render.remote',
    path: 'render/remote',
    icon: 'i-tabler:list-check',
    label: '远程渲染',
    loader: 'remote', // 使用远程加载器
    parent: 'render',
    meta: {
      path: '/remote', // 远程组件路径
    },
  },
]
```

### 4. 数据提供者配置

```typescript
dataProvider: simpleDataProvider({
  apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
})
```

示例使用了 Apifox 的 Mock API 服务，您可以替换为自己的 API 地址。

### 5. 认证提供者配置

```typescript
authProvider: simpleAuthProvider()
```

使用默认的简单认证提供者，支持基本的登录/登出功能。

### 6. 国际化配置

```typescript
i18nProvider: i18nProvider({
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'en-US', // 回退语言
  messages: {
    'zh-CN': zhCN, // 中文语言包
    'en-US': enUS, // 英文语言包
  },
})
```

## 插件安装顺序

**重要**: 插件的安装顺序很关键：

```typescript
// 1. 先安装 Dux 核心 (初始化 Pinia 等)
app.use(createDux(config))

// 2. 然后安装 UI 框架
app.use(NaiveUI)

// 3. 最后安装 Pro 插件
app.use(createDuxPro())

// 4. 挂载应用
app.mount('#app')
```

## 实际页面配置

### 表格页面

基于 `apps/start/pages/table.vue` 的配置：

```typescript
// 表格列配置
const columns: TableColumn[] = [
  {
    type: 'selection', // 选择列
    key: 'selection',
    width: 50,
  },
  {
    title: 'ID',
    key: 'id',
    width: 100,
  },
  {
    title: '昵称',
    key: 'nickname',
    minWidth: 100,
    render: renderInput({ // 可编辑输入框
      key: 'nickname',
      tag: NInput,
    }),
  },
  {
    title: '邮箱',
    key: 'email',
    minWidth: 200,
    render: renderCopy({ // 可复制内容
      key: 'email',
    }),
  },
]

// 筛选配置
const filterSchema = [
  {
    tag: NInput,
    attrs: {
      'placeholder': '请输入关键词搜索',
      'v-model:value': [filters.value, 'keyword'],
    },
  },
]

// 操作按钮配置
const actions = ref<UseActionItem[]>([
  {
    label: '新增',
    type: 'modal',
    component: () => import('./form/modal.vue'),
  },
])
```

### 表单配置

基于 `apps/start/pages/form/modal.vue` 的配置：

```typescript
const model = ref({
  nickname: 'test123', // 默认值
  email: '',
  phone: '',
})
```

```vue
<template>
  <DuxModalForm :id="props.id" title="用户" :data="model" path="user">
    <DuxFormItem label="昵称" path="nickname" rule="required">
      <NInput v-model:value="model.nickname" />
    </DuxFormItem>
    <DuxFormItem label="邮箱" path="email" rule="required|email">
      <NInput v-model:value="model.email" />
    </DuxFormItem>
    <DuxFormItem label="手机号" path="phone">
      <NInput v-model:value="model.phone" />
    </DuxFormItem>
  </DuxModalForm>
</template>
```

## 环境配置

### 开发环境

```typescript
// 可以根据环境动态配置
const config: IConfig = {
  dataProvider: simpleDataProvider({
    apiUrl: process.env.NODE_ENV === 'development'
      ? 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin' // 开发环境使用 Mock
      : 'https://api.production.com/admin' // 生产环境使用真实 API
  }),
}
```

### 样式导入

```typescript
import '@duxweb/dvha-pro/style.css' // 必须导入 Pro 版样式
```

## 自定义扩展

### 添加新页面

1. 创建页面组件文件
2. 在 `menus` 配置中添加菜单项
3. 设置正确的 `parent` 关系

```typescript
{
  name: 'my-new-page',
  path: 'my-page',
  icon: 'i-tabler:new',
  label: '我的页面',
  component: () => import('./pages/my-page.vue'),
  parent: 'example.list',  // 可选：归属于某个分组
}
```

### 修改 API 地址

只需修改 `dataProvider` 配置：

```typescript
dataProvider: simpleDataProvider({
  apiUrl: 'https://your-api-domain.com/admin',
})
```

## 常见配置问题

### Q: 如何禁用某个菜单项？

```typescript
{
  name: 'disabled-menu',
  path: 'disabled',
  label: '禁用菜单',
  hidden: true,  // 隐藏菜单
  component: () => import('./pages/disabled.vue'),
}
```

### Q: 如何配置菜单权限？

```typescript
{
  name: 'admin-only',
  path: 'admin',
  label: '管理员专用',
  component: () => import('./pages/admin.vue'),
  meta: {
    permission: 'admin',  // 权限标识
  },
}
```

### Q: 如何添加外部链接菜单？

```typescript
{
  name: 'external-link',
  path: 'https://github.com/duxweb/dvha',
  icon: 'i-tabler:external-link',
  label: '外部链接',
  meta: {
    target: '_blank',  // 新窗口打开
  },
}
```

## 下一步

配置完成后，您可以：

- 🚀 [快速开始](/pro/getting-started) - 创建第一个页面
- 🧩 [探索组件库](/pro/components/layout) - 使用企业级组件
