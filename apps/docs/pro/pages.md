# 页面组件

这一页主要讲：**DVHA Pro 提供的页面组件，能直接帮你省掉哪些后台基础页面工作。**

如果你只想先记重点，可以先记这句话：

**Pro 的页面组件，不只是几个页面文件，而是帮你把后台最常重复搭的那一层先补齐。**

## 这些页面组件能帮你做什么

后台项目里，最容易重复写的通常不是业务页面，而是这些基础页面：

- 登录页
- 后台主布局
- 404 / 403 / 500 页面
- 空状态页
- 加载页
- 异常状态页
- 顶部菜单 / 用户菜单 / 通知入口 / 暗黑切换这些基础结构

如果每个项目都从头搭，会很浪费时间。

Pro 的页面组件，就是帮你把这些东西先准备好。

## 最常用的一组组件

```ts
import {
  DuxAuthLayout,
  DuxLayout,
  DuxLoginPage,
  DuxPage,
  DuxPage403,
  DuxPage404,
  DuxPage500,
  DuxPageEmpty,
  DuxPageException,
  DuxPageLoading,
  DuxPageStatus,
  DuxMenuApp,
  DuxMenuMain,
  DuxMenuCmd,
  DuxMenuAvatar,
  DuxMenuButton,
  DuxMenuDark,
  DuxMenuNotice,
  DuxMobileMenu,
} from '@duxweb/dvha-pro'
```

你不用一次全记住，先看下面这几组更容易理解。

## 1. 先解决后台“外壳”

### `DuxLayout`

这是最常用的后台主布局。

适合：

- 登录后进入的后台主界面
- 带菜单、头部、内容区的常规后台页面

### `DuxAuthLayout`

这是认证相关页面布局。

适合：

- 登录页
- 找回密码页
- 其他未登录态页面

最常见配置：

```ts
const config = {
  manages: [
    {
      name: 'admin',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
      },
    },
  ],
}
```

最简单理解：

- `authLayout`：登录前页面怎么包
- `noAuthLayout`：登录后后台怎么包

## 2. 直接拿到后台基础页面

### `DuxLoginPage`

这是现成登录页。

适合：

- 想先快速跑通登录流程
- 不想自己从 0 写登录界面

### `DuxPage404` / `DuxPage403` / `DuxPage500`

这是三类最常见错误页：

- `DuxPage404`：页面不存在
- `DuxPage403`：没有权限
- `DuxPage500`：服务异常或通用错误

后台项目里，这几个页面几乎都会用到，直接接入最省事。

### `DuxPageEmpty`

空状态页。

适合：

- 没有数据时展示
- 某个业务还没开通时展示
- 某个模块暂无内容时展示

### `DuxPageLoading`

加载状态页。

适合：

- 页面初始化时先占位
- 远程加载过程中的过渡状态

### `DuxPageException` / `DuxPageStatus`

这类更适合做统一状态页和异常页。

适合：

- 统一业务状态展示
- 自定义成功 / 失败 / 待处理等状态页面

## 3. 直接拿到后台顶部和菜单区能力

Pro 不只是给你页面壳，还给你后台顶部与菜单相关的基础组件。

### `DuxMenuMain`

后台主菜单区域。

### `DuxMenuApp`

应用或系统入口区域。

### `DuxMenuAvatar`

用户头像与账户入口。

### `DuxMenuNotice`

通知入口。

### `DuxMenuDark`

暗黑模式切换。

### `DuxMobileMenu`

移动端菜单能力。

简单说，这些组件帮你少做的事情是：

- 少自己拼后台头部结构
- 少自己处理通知入口、账户入口、主题切换
- 少自己重新搭一套移动端菜单

## 4. 最常见的接法

最常见的接法就是把布局和错误页先配置到 `createDux(...)` 里：

```ts
const config = {
  manages: [
    {
      name: 'admin',
      components: {
        authLayout: DuxAuthLayout,
        noAuthLayout: DuxLayout,
        notFound: DuxPage404,
        notAuthorized: DuxPage403,
        error: DuxPage500,
        exception: DuxPageException,
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
}
```

这套接完之后，你的后台基础骨架基本就有了。

## 5. 这些页面组件最适合什么项目

特别适合：

- 想快速起一个后台项目
- 不想重复搭登录页、布局页、错误页
- 想先把后台框架层搭稳，再开始做业务页面
- 多管理端项目，希望不同后台共用一套成熟页面能力

## 6. 如果你要做业务页面，下一步看什么

这页主要解决“基础页面壳”问题。

如果你接下来要做业务页面，更建议继续看：

- Pro 组件库：[`/pro/components/`](/pro/components/)
- Pro Hooks：[`/pro/hooks/`](/pro/hooks/)
- Pro 快速开始：[`/pro/getting-started`](/pro/getting-started)
- Core 和 Pro 怎么选：[`/pro/choose`](/pro/choose)

## 7. 最后一句话理解

如果说 Core 帮你搭的是后台基础能力，

那 Pro 这组页面组件，帮你补上的就是：**后台真正最容易重复写、最适合直接复用的页面壳和状态页。**
