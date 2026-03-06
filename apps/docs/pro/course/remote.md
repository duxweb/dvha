# 远程组件与微前端

这一页只讲一件事：**怎么让 DVHA 加载远程页面**。

如果你是第一次接触，可以先记住这三句话：

- 远程页面要能打开，先配 `remote`
- 远程页面里要能 `import` 包，先配 `remote.packages`
- 远程页面如果返回的是 JSON Schema，还要配 `jsonSchema.components`

## 1. 最简单的理解方式

DVHA 里的远程页面，意思是：页面代码不是跟着当前项目一起打包，而是在运行时再去接口里拿。

最常见流程是：

1. 菜单声明这个页面是远程页面
2. DVHA 根据配置去请求远程文件
3. 远程文件拿回来后开始渲染
4. 如果远程文件里用到了三方包，就从 `remote.packages` 里找

## 2. 先配置远程页面能用的包

比如你的远程页面里写了：

```ts
import { NButton } from 'naive-ui'
import { DuxCard } from '@duxweb/dvha-pro'
```

那你就要先注册这些包：

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
}
```

这里你只要先记：

- `packages`：远程页面能用哪些包
- `apiMethod`：怎么请求远程文件
- `apiRoutePath`：去哪个接口拿远程文件

## 3. 再告诉菜单：这是一个远程页面

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

这里最关键的是 `loader: 'remote'`。

有了它，DVHA 才知道这个菜单进入后，不是本地页面，而是要走远程加载流程。

## 4. 远程接口一般返回什么

默认情况下，请求远程文件时会带上这样的参数：

```json
{
  "path": "widgets/dashboard"
}
```

接口通常至少返回这两个字段：

```json
{
  "content": "<template><div>Hello Remote</div></template>",
  "type": ".vue"
}
```

常见的 `type`：

- `.vue`：普通远程 Vue 页面
- `.json`：远程 JSON Schema 页面
- `.js` / `.ts` / `.jsx` / `.tsx`：远程模块脚本

## 5. 如果返回的是 JSON Schema，要再配组件

如果远程接口返回的是 `.json`，而且内容里写了：

```json
{
  "nodes": [
    {
      "tag": "NInput"
    },
    {
      "tag": "DuxFormItem"
    }
  ]
}
```

那除了 `remote.packages`，你还要保证这些组件已经注册到 `jsonSchema.components`。

否则远程 JSON Schema 页面拿到了，也可能渲染不出来。

## 6. 最常见的报错怎么排查

### 远程页面里 `import 'naive-ui'` 报错

先检查：

- `remote.packages` 里有没有 `naive-ui`
- 包名有没有写错

### 远程 JSON Schema 页面不显示组件

先检查：

- `jsonSchema.components` 里有没有注册对应组件
- schema 里的 `tag` 名字和注册名是否一致

### 远程页面接口地址不对

先检查：

- `remote.apiRoutePath`
- `remote.apiMethod`

## 7. 放全局还是放管理端

多个管理端都要用，就放全局：

- `IConfig.remote`
- `IConfig.jsonSchema`

只有某个管理端要用，就放当前管理端：

- `IManage.remote`
- `IManage.jsonSchema`

## 相关阅读

- 项目配置：[`/guide/config`](/guide/config)
- 自定义扩展：[`/guide/custom-extension`](/guide/custom-extension)
- 管理端配置：[`/manage/overview`](/manage/overview)
- 管理端 Hook：[`/hooks/manage/useManage`](/hooks/manage/useManage)
- JSON Schema 渲染：[`/hooks/advanced/useJson`](/hooks/advanced/useJson)
- 异步菜单：[`/router/async`](/router/async)
