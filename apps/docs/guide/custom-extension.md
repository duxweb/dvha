# 自定义扩展

DVHA 本身保留了三类非常适合二次扩展的配置入口：

- `extends`：纯业务自定义配置，供你自己的组件和页面读取
- `remote`：远程组件 / 微前端运行时扩展
- `jsonSchema`：JSON Schema 渲染器扩展

如果你在 `项目配置` 中只想快速查类型，请看 [`/guide/config`](/guide/config)；如果你想知道这些能力应该怎么组织、放在哪里、什么时候放全局或管理端，就看本页。

## 推荐理解方式

### `extends`

`extends` 不参与框架内部逻辑，完全是你的业务配置仓库。

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

适合放：

- 业务开关
- 第三方服务配置
- 页面共享常量
- 上传、展示、埋点等项目级参数

读取方式：

```ts
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

console.log(config.extends?.analytics?.enabled)
```

### `remote`

`remote` 是远程组件加载器的运行时配置，常用于微前端或服务端下发页面。

```ts
remote?: {
  packages?: Options
  apiMethod?: string
  apiRoutePath?: string | ((path: string) => string)
}
```

其中最关键的是 `remote.packages`。

### `jsonSchema`

`jsonSchema` 是 `useJsonSchema()` 的全局扩展入口。

```ts
jsonSchema?: {
  adaptors?: IJsonAdaptor[]
  components?: Record<string, Component> | Component[]
}
```

其中最常用的是 `jsonSchema.components`，用于注册 JSON Schema 渲染时可按名称直接使用的组件。

## `remote.packages` 怎么理解

远程页面不是和你本地源码一起打包的，所以它运行时能用哪些包，需要你显式告诉加载器。

DVHA 底层会把 `remote.packages` 合并进 `vue3-sfc-loader` 的 `moduleCache`。也就是说，远程文件里只要写了：

```ts
import { NButton } from 'naive-ui'
import { DuxCard } from '@duxweb/dvha-pro'
```

那你本地配置里就要先注册这些包：

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

### 什么时候放全局，什么时候放管理端

放到全局 `IConfig.remote`：

- 多个管理端都要复用同一批远程依赖
- 远程组件接口统一
- 想集中维护微前端基础能力

放到 `IManage.remote`：

- 只有某个管理端需要额外远程包
- 不同管理端的远程接口不一样
- 某个管理端要覆盖全局 `apiRoutePath`

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

## `jsonSchema.components` 怎么用

`jsonSchema.components` 的作用，是把组件预注册到 JSON Schema 渲染器里。

这样你在 schema 里就可以直接写组件名，而不是每次调用 `useJsonSchema()` 都重新传一遍 `components`。

### 写法一：对象映射

适合少量业务组件，名字可控。

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

Schema 中可直接这样写：

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

### 写法二：组件数组

适合批量注册一整套组件库。DVHA 会尝试从组件的 `name` 或 `__name` 推导注册名。

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

Schema 中可直接写：

```ts
const schema = [
  {
    tag: 'NInput',
    attrs: {
      placeholder: '请输入名称',
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

## 推荐目录组织

如果你的项目扩展开始变多，建议不要把所有配置都堆在 `main.ts` 里，可以拆成独立目录：

```text
src/
  extensions/
    remote.ts
    json-schema.ts
    project.ts
  main.ts
```

示例：

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
// src/extensions/json-schema.ts
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

```ts
// src/extensions/project.ts
export const projectExtends = {
  analytics: {
    enabled: true,
  },
  upload: {
    maxSize: 10 * 1024 * 1024,
  },
}
```

```ts
// src/main.ts
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

## 建议

- `extends` 放业务参数，不要混进框架运行时依赖
- `remote.packages` 只注册远程页面真实会用到的包，避免无意义堆大对象
- `jsonSchema.components` 优先注册稳定复用组件，临时组件可在 `useJsonSchema()` 里局部传入
- 多管理端场景优先全局复用，只有差异项才放到 `IManage`
