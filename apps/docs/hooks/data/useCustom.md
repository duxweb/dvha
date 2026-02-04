# useCustom

`useCustom` 用于自定义查询请求。

## 使用方法

```ts
import { useCustom } from '@duxweb/dvha-core'

const { data, isLoading, refetch } = useCustom({
  path: 'stats',
  method: 'GET',
  query: { range: 'month' },
})
```

## 参数说明

`useCustom` 继承 `IDataProviderCustomOptions`，并支持：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `providerName` | `string` | 数据提供者名称，默认 `default` |
| `options` | `DefinedInitialQueryOptions` | TanStack Query 选项 |
| `onError` | `(error: IDataProviderError) => void` | 错误回调 |

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `Ref<IDataProviderResponse \| undefined>` | 响应数据 |
| `isLoading` | `ComputedRef<boolean>` | 是否加载中 |
| `refetch` | `() => Promise<any>` | 重新请求 |
