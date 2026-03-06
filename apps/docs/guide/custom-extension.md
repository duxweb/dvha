# 自定义扩展

这一页专门讲三件最常见的事：

- 给远程页面**加载三方包**
- 给 JSON Schema **加载三方组件**
- 给你自己的业务**添加自定义配置**

如果你刚接触 DVHA，可以先这样理解：

- `remote`：解决“远程页面里可以用哪些包”
- `jsonSchema`：解决“JSON Schema 里可以用哪些组件”
- `extends`：解决“我自己的业务配置放哪里”

## 什么时候需要看这一页

如果你遇到下面这些情况，就可以看本页：

- 远程页面里 `import 'naive-ui'` 报错
- JSON Schema 里写了 `NInput`、`DuxFormItem` 但是渲染不出来
- 你想给项目加自己的配置项，比如上传大小、埋点开关、第三方服务参数

## 1. 加载三方包

### 这是什么

“加载三方包” 指的是：让**远程页面**在运行时可以使用某些 npm 包。

比如你的远程页面里写了：

```ts
import { NButton } from 'naive-ui'
```

那你就必须先把 `naive-ui` 注册到 `remote.packages` 中。

### 为什么要配

因为远程页面不是和你当前项目一起本地打包的。

所以 DVHA 不知道远程页面要用哪些包，你需要手动告诉它：“这些包可以给远程页面使用”。

### 怎么配置

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

### 这几个字段是什么意思

| 字段 | 说明 |
| --- | --- |
| `packages` | 远程页面允许使用的包 |
| `apiMethod` | 拉取远程文件时使用的请求方法，默认是 `POST` |
| `apiRoutePath` | 拉取远程文件的接口地址，默认是 `static` |

### 什么时候放全局，什么时候放管理端

放在全局 `IConfig.remote`：

- 多个管理端都要用
- 想统一维护一套远程依赖

放在 `IManage.remote`：

- 只有某个管理端要用
- 某个管理端的远程接口单独不同

```ts
const config: IConfig = {
  remote: {
    packages: {
      'naive-ui': NaiveUI,
    },
  },
  manages: [
    {
      name: 'admin',
      title: '管理后台',
      remote: {
        packages: {
          '@duxweb/dvha-pro': DuxPro,
        },
      },
    },
  ],
}
```

### 你可以怎么判断有没有配对

如果远程页面里：

- `import 'naive-ui'` 报错
- `import '@duxweb/dvha-pro'` 报错

通常就是 `remote.packages` 没配，或者包名写错了。

## 2. 加载三方组件

### 这是什么

“加载三方组件” 指的是：让 **JSON Schema** 在渲染时，能够识别你写的组件名。

比如你在 schema 里写了：

```ts
const schema = [
  {
    tag: 'NInput',
  },
  {
    tag: 'DuxFormItem',
  },
]
```

那你就要先把这些组件注册到 `jsonSchema.components`。

### 为什么要配

因为 JSON Schema 只是一份配置，它不知道 `NInput`、`DuxFormItem` 到底对应哪个 Vue 组件。

所以你要先告诉它：

- `NInput` 对应哪个组件
- `DuxFormItem` 对应哪个组件

### 怎么配置

#### 方式一：少量组件，直接写对象

适合业务组件比较少的场景。

```ts
import UserProfileCard from './components/UserProfileCard.vue'
import UserStatusTag from './components/UserStatusTag.vue'

const config: IConfig = {
  jsonSchema: {
    components: {
      UserProfileCard,
      UserStatusTag,
    },
  },
}
```

这样你在 schema 里就能直接写：

```ts
const schema = [
  {
    tag: 'UserProfileCard',
    attrs: {
      userId: 1,
    },
  },
]
```

#### 方式二：组件很多，用数组批量注册

适合把一整个组件库注册进去。

```ts
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

const config: IConfig = {
  jsonSchema: {
    components: [
      ...Object.values(DuxPro).filter(comp => comp?.name?.startsWith?.('Dux')),
      ...Object.values(DuxNaiveUI).filter(comp => comp?.name?.startsWith?.('Dux')),
      ...Object.entries(NaiveUI)
        .filter(([name]) => name.startsWith('N'))
        .map(([name, component]) => {
          ;(component as any).name = name
          return component
        }),
    ],
  },
}
```

这样 schema 里就可以直接写：

```ts
const schema = [
  {
    tag: 'NInput',
    attrs: {
      placeholder: '请输入标题',
    },
  },
  {
    tag: 'DuxFormItem',
    attrs: {
      label: '标题',
    },
  },
]
```

### 什么时候放全局，什么时候放管理端

放在全局 `IConfig.jsonSchema`：

- 多个管理端都能用到这些组件
- 想统一维护一套 JSON Schema 组件

放在 `IManage.jsonSchema`：

- 只有某个管理端会用到
- 某个管理端有自己专属的组件

### 你可以怎么判断有没有配对

如果 schema 里：

- 写了 `NInput` 但是不渲染
- 写了 `DuxFormItem` 但是不识别
- 写了业务组件名但页面空白

通常就是 `jsonSchema.components` 没注册，或者注册名和 `tag` 不一致。

## 3. 添加自定义配置

### 这是什么

“自定义配置” 指的是：你自己项目里的业务参数。

它和远程组件、JSON Schema 没有直接关系，纯粹是给你自己的页面和组件读取的。

### 适合放什么

比如这些都适合放到 `extends`：

- 埋点开关
- 上传大小限制
- 第三方服务地址
- 业务常量
- 某些页面功能开关

### 怎么配置

```ts
const config: IConfig = {
  extends: {
    analytics: {
      enabled: true,
      trackingId: 'GA-XXXXXX',
    },
    upload: {
      maxSize: 10 * 1024 * 1024,
      accept: ['image/png', 'image/jpeg'],
    },
  },
}
```

### 怎么读取

```ts
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

console.log(config.extends?.analytics?.enabled)
console.log(config.extends?.upload?.maxSize)
```

## 4. 推荐写法

如果项目小，可以直接写在 `main.ts`。

如果项目越来越大，建议拆出去：

```text
src/
  extensions/
    remote.ts
    json-schema.ts
    project.ts
  main.ts
```

### `remote.ts`

```ts
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

### `json-schema.ts`

```ts
import * as DuxNaiveUI from '@duxweb/dvha-naiveui'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'

export const jsonSchemaConfig = {
  components: [
    ...Object.values(DuxPro).filter(comp => comp?.name?.startsWith?.('Dux')),
    ...Object.values(DuxNaiveUI).filter(comp => comp?.name?.startsWith?.('Dux')),
    ...Object.entries(NaiveUI)
      .filter(([name]) => name.startsWith('N'))
      .map(([name, component]) => {
        ;(component as any).name = name
        return component
      }),
  ],
}
```

### `project.ts`

```ts
export const projectExtends = {
  analytics: {
    enabled: true,
  },
  upload: {
    maxSize: 10 * 1024 * 1024,
  },
}
```

### `main.ts`

```ts
import { jsonSchemaConfig } from './extensions/json-schema'
import { projectExtends } from './extensions/project'
import { remoteConfig } from './extensions/remote'

const config: IConfig = {
  remote: remoteConfig,
  jsonSchema: jsonSchemaConfig,
  extends: projectExtends,
  manages: [
    {
      name: 'admin',
      title: '管理后台',
    },
  ],
}
```

## 5. 最后记一个最简单的判断方法

你可以只记下面这三句话：

- 远程页面缺包，看 `remote.packages`
- JSON Schema 缺组件，看 `jsonSchema.components`
- 业务自定义参数，看 `extends`

## 相关阅读

- 项目配置：[`/guide/config`](/guide/config)
- 管理端配置：[`/manage/overview`](/manage/overview)
- 管理端 Hook：[`/hooks/manage/useManage`](/hooks/manage/useManage)
- JSON Schema：[`/hooks/advanced/useJson`](/hooks/advanced/useJson)
- 远程组件教程：[`/pro/course/remote`](/pro/course/remote)
