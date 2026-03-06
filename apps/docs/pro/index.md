# DVHA Pro 版本

## 什么是 DVHA Pro？

如果说 `@duxweb/dvha-core` 解决的是：

- 后台的基础能力怎么搭
- 多管理端怎么管
- 登录、权限、路由、数据这些怎么统一

那 **DVHA Pro** 解决的就是：

- 页面怎么更快落地
- 后台界面怎么更快搭出来
- 常见中后台组件怎么直接复用

你可以把它理解成：

**DVHA Core 是骨架，DVHA Pro 是更完整的后台界面能力。**

## DVHA Pro 最适合什么人

如果你符合下面这些情况，通常很适合直接上 Pro：

- 你不想从 0 开始搭后台页面
- 你想要现成的布局、登录页、错误页、表格、表单等能力
- 你希望项目一开始就有比较完整的后台 UI 体验
- 你希望继续保留 DVHA 的多管理端、配置驱动、动态扩展能力

简单说：

- 想要更灵活、自己拼能力，用 Core
- 想要更快出页面、直接开始做业务，用 Pro

## DVHA Pro 的价值在哪里

### 1. 少写很多后台基础页面

Pro 已经提供了很多后台里反复会写到的页面和组件能力，比如：

- 后台布局
- 登录页
- 404 / 403 / 500 页面
- 表格、表单、弹窗、抽屉等常用组件
- 上传、编辑器、图表、选择器等高频组件

这意味着你不用每个项目都重复搭一遍后台外壳。

### 2. 继续保持 DVHA 的“轻”

用了 Pro，不代表又回到“更重的后台模板”。

它仍然保留了 DVHA 的核心优势：

- 多管理端
- 配置驱动
- 远程页面
- JSON Schema
- 可扩展 Hook 能力

也就是说，**Pro 是在 Core 的基础上补齐后台常用 UI，而不是把你重新绑回死板模板。**

### 3. 更适合业务项目快速落地

如果你的目标是：

- 尽快把后台做出来
- 少做重复页面
- 优先解决业务问题，而不是重复搭基础设施

那 Pro 会比纯 Core 更省时间。

## 什么时候建议直接用 Pro

建议直接上 Pro 的场景：

- 你要尽快搭一个完整后台
- 你已经明确会用 Naive UI 体系
- 你希望直接拥有比较完整的后台界面能力
- 你不想自己补登录页、布局页、错误页、表单页这些基础页面

如果你更在意：

- UI 完全自定义
- 页面体系完全自己搭
- 只想要一层很轻的能力封装

那就优先用 Core。

## 安装

```bash
pnpm add @duxweb/dvha-pro
```

## 最简单的接入方式

```ts
import { createApp } from 'vue'
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp } from '@duxweb/dvha-pro'
import '@duxweb/dvha-pro/style.css'

const app = createApp(DuxApp)

app.use(createDux({
  defaultManage: 'admin',
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
    },
  ],
}))

app.use(createDuxPro())
app.mount('#app')
```

## 你可以先看哪几页

- 想先快速跑起来：[`/pro/getting-started`](/pro/getting-started)
- 想看完整安装方式：[`/pro/installation`](/pro/installation)
- 想看 Pro 的扩展配置：[`/pro/configuration`](/pro/configuration)
- 想看有哪些页面能力：[`/pro/pages`](/pro/pages)
