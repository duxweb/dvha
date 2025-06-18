# Pro 版本快速开始

## 环境准备

在开始使用 DVHA Pro 之前，请确保您的开发环境满足以下要求：

- **Node.js**: >= 20.0.0
- **pnpm**: >= 8.0.0 (推荐)
- **Vue**: ^3.5.0
- **TypeScript**: ^5.8.0

## 5分钟快速体验

### 1. 克隆示例项目

```bash
# 克隆完整仓库
git clone https://github.com/duxweb/dvha.git
cd dvha

# 安装依赖
pnpm install

# 启动 Pro 版演示
pnpm start:dev
```

### 2. 访问应用

打开浏览器访问 `http://localhost:5173`，您将看到：

1. **登录页面** - 输入任意用户名密码即可登录
2. **仪表盘** - 展示数据统计、任务列表、常用功能等
3. **完整的后台界面** - 包含菜单、表格、表单等

## 实际配置分析

### 应用入口配置

基于 `apps/start/main.ts` 的实际配置：

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
        // 列表示例分组
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
        // 表单示例分组
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

// 先安装 Dux (包含 Pinia 初始化)
app.use(createDux(config))

// 然后安装其他插件
app.use(NaiveUI)
app.use(createDuxPro())

app.mount('#app')
```

## 核心组件示例

### 表格页面组件

基于 `apps/start/pages/table.vue` 的实际实现：

```vue
<script setup lang="ts">
import type { TableColumn } from '@duxweb/dvha-naiveui'
import type { UseActionItem } from '@duxweb/dvha-pro'
import { DuxTablePage, useDialog, useModal, useTableColumn } from '@duxweb/dvha-pro'
import { NInput } from 'naive-ui'
import { ref } from 'vue'

const filters = ref({
  keyword: '',
})

const { show } = useModal()
const { confirm } = useDialog()

const { renderMedia, renderSwitch, renderStatus, renderCopy, renderInput, renderHidden } = useTableColumn()

const columns: TableColumn[] = [
  {
    type: 'selection',
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
    render: renderInput({
      key: 'nickname',
      tag: NInput,
    }),
  },
  {
    title: '邮箱',
    key: 'email',
    minWidth: 200,
    render: renderCopy({
      key: 'email',
    }),
  },
  {
    title: '用户',
    key: 'nickname',
    minWidth: 150,
    render: renderMedia({
      image: 'avatar',
      title: 'nickname',
      desc: 'email',
      avatar: true,
      imageWidth: 36,
      imageHeight: 36,
    }),
  },
  {
    title: '状态',
    key: 'status',
    minWidth: 100,
    render: renderStatus({
      key: 'status',
      maps: {
        success: {
          label: '正常',
          value: true,
        },
        error: {
          label: '禁用',
          value: false,
        },
      },
    }),
  },
]

const tabs = ref([
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '已启用',
    value: 'enabled',
  },
  {
    label: '已禁用',
    value: 'disabled',
  },
])

const filterSchema = [
  {
    tag: NInput,
    attrs: {
      'placeholder': '请输入关键词搜索',
      'v-model:value': [filters.value, 'keyword'],
    },
  },
]

const actions = ref<UseActionItem[]>([
  {
    label: '新增',
    type: 'modal',
    component: () => import('./form/modal.vue'),
  },
])
</script>

<template>
  <DuxTablePage
    path="user"
    :columns="columns"
    :filter="filters"
    :tabs="tabs"
    :filter-schema="filterSchema"
    :actions="actions"
    pagination
  />
</template>
```

### 表单模态框组件

基于 `apps/start/pages/form/modal.vue` 的实际实现：

```vue
<script setup lang="ts">
import { DuxFormItem, DuxModalForm } from '@duxweb/dvha-pro'
import { NInput } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  id?: string | number
}>()

const model = ref({
  nickname: 'test123',
  email: '',
  phone: '',
})
</script>

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

## 实际功能特性

### 数据处理 Hooks

Pro 版本提供了强大的数据处理工具：

- **useTableColumn**: 表格列渲染器（复制、输入、隐藏、媒体等）
- **useAction**: 操作处理器（模态框、删除、确认等）
- **useModal**: 模态框管理
- **useDialog**: 对话框管理

### 组件库

基于示例项目的实际组件：

- **DuxTablePage**: 完整的表格页面组件
- **DuxModalForm**: 模态框表单组件
- **DuxFormItem**: 表单项组件
- **DuxDashboardQuick**: 仪表盘快捷功能
- **DuxMedia**: 媒体展示组件

### API 集成

示例使用了真实的 Mock API：

```typescript
dataProvider: simpleDataProvider({
  apiUrl: 'https://m1.apifoxmock.com/m1/4407506-4052338-default/admin',
})
```

## 下一步

通过查看示例代码，您可以：

- 📦 [查看安装指南](/pro/installation) - 了解详细的安装配置
- ⚙️ [阅读配置说明](/pro/configuration) - 深入了解配置选项
- 🧩 [探索组件库](/pro/components/layout) - 使用丰富的企业级组件

## 实际项目结构

```
apps/start/                 # Pro 版演示应用
├── main.ts                 # 应用入口（实际配置）
├── pages/                  # 页面组件
│   ├── home.vue           # 仪表盘首页
│   ├── table.vue          # 表格列表页
│   ├── setting.vue        # 设置页面
│   ├── form/
│   │   ├── modal.vue      # 模态框表单
│   │   └── page.vue       # 表单页面
│   └── list/
│       ├── card.vue       # 卡片列表
│       ├── article.vue    # 文章列表
│       └── list.vue       # 订单列表
├── langs/                  # 语言包
│   ├── zh-CN.json
│   └── en-US.json
└── dvha/                   # DVHA 布局组件
    ├── authLayout.vue
    ├── layout.vue
    ├── page404.vue
    ├── page500.vue
    └── pageLoading.vue
```

## 问题解决

### 常见问题

**Q: 演示环境如何登录？**
A: 输入任意用户名密码即可，如 admin / 123456。

**Q: 数据是真实的吗？**
A: 使用的是 Mock API，数据仅用于演示。

**Q: 如何修改 API 地址？**
A: 修改 `main.ts` 中的 `apiUrl` 配置即可。

### 获取帮助

- 💬 [加入社区讨论](/community)
- 🐛 [提交问题反馈](https://github.com/duxweb/dvha/issues)
- 📖 [查看完整文档](/pro/)
