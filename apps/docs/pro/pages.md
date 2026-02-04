# 页面组件

Pro 包中提供了一组页面与布局组件，位于 `packages/pro/src/pages`。

## 导入示例

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

## 常见用途

在 `createDux` 配置中绑定布局与错误页：

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
    },
  ],
}
```
