# 配置说明

这一页主要讲：**用了 DVHA Pro 之后，还能额外配什么。**

如果你已经知道 Core 的 `IConfig` / `IManage`，那可以把 Pro 配置理解成：

- Core 提供基础配置
- Pro 在此基础上补充一些更贴近后台业务的能力

## 1. Pro 怎么接入

Pro 主要通过这两个步骤接入：

```ts
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp } from '@duxweb/dvha-pro'
import { createApp } from 'vue'

const app = createApp(DuxApp)
app.use(createDux({ /* IConfig */ }))
app.use(createDuxPro())
app.mount('#app')
```

最简单理解：

- `createDux(...)`：配 Core
- `createDuxPro()`：启用 Pro

## 2. Pro 额外增加了哪些配置

Pro 会在 `IManage` 上增加一些更偏后台业务的字段。

```ts
interface IManage {
  upload?: {
    method?: 'POST' | 'PUT'
    driver?: 'local' | 's3'
    signPath?: string
    signCallback?: (response: IDataProviderResponse) => IS3SignData
  }
  apiPath?: {
    upload?: string
    uploadManager?: string
    ai?: string
    [key: string]: any
  }
  notice?: {
    status?: false
    path?: string
    route?: string
    titleField?: string
    descField?: string
    readField?: string
    urlField?: string
  }
  tools?: { label: string; icon: string; path?: string; url?: string; callback?: () => void }[]
  map?: {
    baiduAk?: string
    tiandituTk?: string
    [key: string]: any
  }
}
```

## 3. 这些配置可以怎么理解

### `upload`

这一组配置主要管上传。

常见用途：

- 上传接口是 `POST` 还是 `PUT`
- 上传到本地还是 S3
- S3 场景下签名接口怎么取

### `apiPath`

这一组配置主要放 Pro 内部常用的一些业务接口地址。

比如：

- 上传接口
- 文件管理接口
- AI 相关接口

你可以把它理解成：**Pro 某些页面和组件可能会用到的快捷接口配置。**

### `notice`

这一组配置主要给通知能力使用。

常见用途：

- 是否开启通知
- 通知列表接口地址
- 通知跳转路由
- 标题、描述、已读字段分别叫什么

### `tools`

这一组配置主要是顶部工具区或快捷入口。

比如你可以配置：

- 跳转某个页面
- 打开某个外链
- 执行某个回调

### `map`

这一组配置主要是地图能力相关。

目前常见的是：

- 百度地图 Key
- 天地图 Token

## 4. 最常见的使用方式

最常见的做法是：把这些配置直接写到某个管理端里。

```ts
const config: IConfig = {
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      upload: {
        method: 'POST',
        driver: 'local',
      },
      apiPath: {
        upload: '/upload',
        uploadManager: '/upload/manage',
      },
      notice: {
        path: '/notice',
        route: '/notice/list',
      },
      tools: [
        {
          label: '控制台',
          icon: 'i-tabler:dashboard',
          path: '/admin',
        },
      ],
    },
  ],
}
```

## 5. 什么时候需要看这一页

你通常会在下面这些场景来看这页：

- 想接入 Pro 上传能力
- 想配置通知能力
- 想补顶部工具入口
- 想接地图相关能力
- 想知道某些 Pro 页面为什么还需要额外接口配置

如果你只是想先把 Pro 跑起来，可以先看 [`/pro/installation`](/pro/installation)。
