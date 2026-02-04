# 自定义数据接口

通过 `dataProvider` 适配后端 API。

```ts
import { simpleDataProvider } from '@duxweb/dvha-core'

const config = {
  dataProvider: simpleDataProvider({
    apiUrl: 'https://api.example.com',
  }),
}
```
