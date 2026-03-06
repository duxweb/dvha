# 远程组件与微前端

DVHA 支持通过远程组件实现轻量级微前端：页面本体可以不随主应用一起打包，而是在运行时按需拉取、渲染。

这套能力适合：

- 服务端动态下发页面
- 插件式页面扩展
- 不同团队独立维护页面模块
- 将表单、看板、运营页按远程资源接入

## 先理解三个角色

在 DVHA 中，远程组件通常由三部分配合：

- `remote`：定义远程文件从哪里加载、运行时能用哪些包
- `components.remote`：定义远程页面由哪个加载器组件来渲染
- 菜单 `loader: 'remote'`：告诉路由系统当前页面是远程页面

最常见的链路是：

1. 菜单声明 `loader: 'remote'`
2. 路由进入远程页面加载器
3. 加载器根据 `remote.apiRoutePath` 请求远程文件内容
4. 远程文件运行时从 `remote.packages` 中获取依赖
5. 页面最终在当前管理端中渲染出来

## 基础配置

### 1. 注册远程依赖

远程页面不会参与当前项目的本地打包，所以它在运行时能 `import` 哪些包，需要提前声明。

```ts
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

const config: IConfig = {
  remote: {
    packages: {
      'naive-ui': NaiveUI,
      '@duxweb/dvha-pro': DuxPro,
      '@duxweb/dvha-naiveui': DuxNaiveUI,
    },
    apiMethod: 'POST',
    apiRoutePath: 'static',
  },
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      routePrefix: '/admin',
    },
  ],
}
```

### 2. 配置远程加载器组件

DVHA 会根据菜单的 `loader` 类型，自动选择对应的页面加载器。远程页面使用的是 `components.remote`。

```ts
const config: IConfig = {
  components: {
    remote: () => import('@duxweb/dvha-core/components/loader/loader'),
  },
}
```

大多数场景下可以直接使用框架默认的远程加载器，不一定需要手动覆盖；只有你想自定义加载中、错误展示或包裹额外布局时，才需要重写这个组件。

### 3. 菜单声明远程页面

```ts
const menus = [
  {
    name: 'remote.widget',
    label: '远程部件',
    path: 'remote/widget',
    loader: 'remote',
    meta: {
      url: 'widgets/dashboard',
    },
  },
]
```

这里的关键是 `loader: 'remote'`。进入该菜单时，DVHA 会自动走远程页面加载流程。

## 远程接口约定

默认情况下，远程加载器会向 `remote.apiRoutePath` 指定的接口发起请求，请求参数中会携带：

```json
{
  "path": "widgets/dashboard"
}
```

如果没有显式配置 `apiRoutePath`，默认会请求 `static`；如果没有配置 `apiMethod`，默认使用 `POST`。

远程接口返回的数据至少应包含：

```json
{
  "content": "<template><div>Hello Remote</div></template>",
  "type": ".vue"
}
```

常见 `type`：

- `.vue`：远程 Vue SFC 页面
- `.json`：JSON Schema 页面
- `.js` / `.ts` / `.jsx` / `.tsx`：会被按模块脚本处理

## 三种常见远程页面形式

### 远程 Vue SFC

适合复杂交互页面。

```vue
<template>
  <n-card title="远程页面">
    <n-button type="primary">点击我</n-button>
  </n-card>
</template>

<script setup>
import { NButton, NCard } from 'naive-ui'
</script>
```

只要 `naive-ui` 已注册进 `remote.packages`，这类页面就可以直接运行。

### 远程 JSON Schema

适合动态表单、活动页、低代码结构页面。

接口返回：

```json
{
  "type": ".json",
  "content": {
    "nodes": [
      {
        "tag": "NInput",
        "attrs": {
          "placeholder": "请输入标题"
        }
      },
      {
        "tag": "DuxFormItem",
        "attrs": {
          "label": "名称"
        }
      }
    ],
    "data": {}
  }
}
```

这里如果使用了 `NInput`、`DuxFormItem`，同样要求这些组件已经在当前应用中通过 `jsonSchema.components` 或局部 `useJsonSchema({ components })` 注册。

### iframe 页面

如果远程页面不是 Vue 模块，而是已有独立站点，可以使用 `loader: 'iframe'`：

```ts
const menus = [
  {
    name: 'report.external',
    label: '外部报表',
    path: 'report/external',
    loader: 'iframe',
    meta: {
      url: 'https://example.com/report',
    },
  },
]
```

这种方式更像页面嵌入，不共享当前应用的组件运行时。

## 推荐项目组织方式

如果项目里远程页面较多，建议单独拆一组扩展配置：

```text
src/
  extensions/
    remote.ts
    json-schema.ts
  main.ts
```

```ts
// src/extensions/remote.ts
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

export const remoteConfig = {
  packages: {
    'naive-ui': NaiveUI,
    '@duxweb/dvha-pro': DuxPro,
    '@duxweb/dvha-naiveui': DuxNaiveUI,
  },
  apiMethod: 'POST',
  apiRoutePath: 'static',
}
```

```ts
// src/main.ts
import { remoteConfig } from './extensions/remote'

const config: IConfig = {
  remote: remoteConfig,
  manages: [
    {
      name: 'admin',
      title: '管理后台',
    },
  ],
}
```

## 常见问题

### 为什么远程页面里 `import 'naive-ui'` 报错？

通常是因为没有在 `remote.packages` 中注册对应包。远程组件加载器不会自动读取你本地 bundler 的依赖图，只会使用它自己的运行时包表。

### 为什么 JSON Schema 远程页面里识别不到 `DuxFormItem`？

通常不是 `remote.packages` 的问题，而是 `jsonSchema.components` 没有提前注册对应组件。远程 `.json` 页面最终还是走 `useJsonSchema()` 渲染。

### 全局配置和管理端配置怎么选？

建议规则：

- 公共远程依赖放 `IConfig.remote`
- 某个管理端特有依赖放 `IManage.remote`
- 公共 JSON Schema 组件放 `IConfig.jsonSchema`
- 某个管理端专用组件放 `IManage.jsonSchema`

## 相关阅读

- 配置总览：[`/guide/config`](/guide/config)
- 自定义扩展：[`/guide/custom-extension`](/guide/custom-extension)
- 管理端配置：[`/manage/overview`](/manage/overview)
- 管理端 Hook：[`/hooks/manage/useManage`](/hooks/manage/useManage)
- JSON Schema 渲染：[`/hooks/advanced/useJson`](/hooks/advanced/useJson)
- 异步菜单：[`/router/async`](/router/async)
