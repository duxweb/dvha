# 快速开始

这一页的目标很简单：**尽快把一个能跑的 DVHA Pro 后台项目搭起来。**

如果你懒得看太多，先记最短路径：

```bash
npx @duxweb/dvha-template init
```

选择 Pro 模板后，再执行：

```bash
pnpm install
pnpm dev
```

## 你会得到什么

走完这一页后，你通常会得到一个已经具备这些能力的后台项目：

- 有后台基础布局
- 有登录页
- 有错误页
- 有 Pro 组件和页面能力
- 可以直接开始接业务页面

也就是说，你不是只拿到一个空壳 Vue 项目，而是拿到一个更适合直接做后台开发的起点。

## 1. 用模板创建 Pro 项目

```bash
npx @duxweb/dvha-template init
```

执行后，选择 **Pro 模板**。

如果你只是想快速体验 DVHA Pro，这是最快的方法。

## 2. 安装依赖并启动

```bash
pnpm install
pnpm dev
```

启动后，你就可以先看到一个可运行的 Pro 后台基础项目。

## 3. 为什么推荐先用模板

因为 Pro 项目通常不只是“装一个包”这么简单，它还会涉及：

- 应用入口
- 样式引入
- 后台布局
- 登录页
- 管理端配置
- Pro 插件注册

如果你手动从 0 接，虽然也可以，但第一次接入通常不如模板快。

所以更推荐：

- **第一次接触 Pro**：先用模板
- **已经熟悉 DVHA 结构**：再考虑手动集成

## 4. 跑起来之后先看什么

项目启动后，建议按这个顺序看：

### 先看管理端配置

先找到项目里的 `createDux({ ... })` 配置，重点看：

- `defaultManage`
- `manages`
- `components`
- `dataProvider`
- `authProvider`

这几项基本决定了后台怎么跑起来。

### 再看 Pro 注册

再确认项目里有：

```ts
app.use(createDuxPro())
```

它表示 Pro 的页面和组件能力已经启用。

### 再看样式引入

再确认项目里有：

```ts
import '@duxweb/dvha-pro/style.css'
```

如果没引这个，很多 Pro 页面和组件样式不会完整。

## 5. 接下来怎么开始做业务

项目能跑起来之后，通常就可以开始做这些事：

- 新增菜单
- 新增本地页面
- 配置数据接口
- 接入 Pro 表格 / 表单 / 弹窗 / 抽屉组件
- 按需接入远程页面或 JSON Schema

如果你是第一次做，建议顺序是：

1. 先改一个现有页面
2. 再新增一个菜单页面
3. 再接一个简单列表接口
4. 最后再接更复杂的上传、通知、远程页面能力

## 6. 如果你想手动接入 Pro

如果你不想用模板，而是想把 Pro 接进现有项目，可以继续看：

- 安装指南：[`/pro/installation`](/pro/installation)
- 配置说明：[`/pro/configuration`](/pro/configuration)

## 7. 常见问题

### 模板和手动接入怎么选？

最简单的建议：

- 想快：用模板
- 想集成到已有项目：手动接入

### 我已经会用 Core，还需要看这页吗？

需要。

因为 Pro 不是只多几个组件，它还涉及：

- Pro 应用入口
- Pro 样式
- Pro 页面能力
- Pro 扩展配置

### 如果我只是想判断该不该用 Pro 呢？

先看这页：[`/pro/choose`](/pro/choose)

## 下一步看什么

- 想知道为什么要用 Pro：[`/pro/`](/pro/)
- 想判断 Core 和 Pro 怎么选：[`/pro/choose`](/pro/choose)
- 想看完整安装：[`/pro/installation`](/pro/installation)
- 想看 Pro 配置：[`/pro/configuration`](/pro/configuration)
- 想直接开始教程：[`/pro/course/`](/pro/course/)
