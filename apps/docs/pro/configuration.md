# 配置说明

Pro 主要通过 `createDux` + `createDuxPro` 接入。

## 基础接入

```ts
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro, DuxApp } from '@duxweb/dvha-pro'
import { createApp } from 'vue'

const app = createApp(DuxApp)
app.use(createDux({ /* IConfig */ }))
app.use(createDuxPro())
app.mount('#app')
```

## Pro 扩展配置

Pro 在 `IManage` 上扩展了以下字段（见 `packages/pro/src/main.ts`）：

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
