# 安装指南

这一页只讲一件事：**怎么把 DVHA Pro 接到你的项目里。**

如果你是第一次接触 Pro，可以先这样理解：

- Core 负责后台基础能力
- Pro 负责更完整的后台页面和组件能力

## 1. 安装依赖

```bash
pnpm add @duxweb/dvha-pro
```

`@duxweb/dvha-pro` 已经包含 `@duxweb/dvha-core` 与 `@duxweb/dvha-naiveui` 相关依赖能力，通常你直接安装 Pro 就可以开始接入。

## 2. 最小接入示例

```ts
import { createApp } from 'vue'
import { createDux, i18nProvider, simpleAuthProvider, simpleDataProvider } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp, DuxAuthLayout, DuxLayout, DuxLoginPage, DuxPage404, DuxPage403, DuxPage500 } from '@duxweb/dvha-pro'

import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

app.use(createDux({
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        notAuthorized: DuxPage403,
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
    },
  ],
  dataProvider: simpleDataProvider({ apiUrl: 'https://api.example.com' }),
  authProvider: simpleAuthProvider(),
  i18nProvider: i18nProvider({ locale: 'zh-CN', fallbackLocale: 'en-US' }),
}))

app.use(createDuxPro())
app.mount('#app')
```

## 3. 这段代码做了什么

你可以先不用一次看懂全部，只要知道这几件事：

- `DuxApp`：Pro 提供的应用入口组件
- `createDux(...)`：注册 DVHA 基础能力
- `createDuxPro()`：注册 Pro 的页面和组件能力
- `@duxweb/dvha-pro/style.css`：加载 Pro 样式
- `DuxAuthLayout` / `DuxLayout`：后台布局
- `DuxLoginPage`：登录页
- `DuxPage404` / `DuxPage403` / `DuxPage500`：错误页

## 4. 安装后你会立刻得到什么

接入 Pro 后，最直接的变化通常是：

- 后台布局直接可用
- 登录页直接可用
- 基础错误页直接可用
- 后续可以继续接入更多 Pro 页面和组件

也就是说，Pro 的价值不只是“多几个组件”，而是帮你把后台最基础、最重复的那一层先搭起来。

## 5. 常见问题

### 为什么我已经安装了 Pro，还要 `createDux(...)`？

因为 Pro 不是替代 Core，而是建立在 Core 之上的增强层。

最简单理解：

- `createDux(...)` 负责基础能力
- `createDuxPro()` 负责 Pro 能力

### 为什么还要引入 `style.css`？

因为 Pro 组件和页面有自己的样式，如果不引入，页面结构可能能跑，但样式不会完整。

## 下一步看什么

- 想继续看 Pro 的能力边界：[`/pro/`](/pro/)
- 想看 Pro 的扩展配置：[`/pro/configuration`](/pro/configuration)
- 想直接开始做页面：[`/pro/getting-started`](/pro/getting-started)
