# useOne

`useOne` 用于获取单条数据。

## 使用方法

```ts
import { useOne } from '@duxweb/dvha-core'

const { data, isLoading } = useOne({
  path: 'users',
  id: 1,
})
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `string` | 资源路径 |
| `id` | `string \| number` | 记录 ID |
| `meta` | `Record<string, any>` | 额外参数 |
| `providerName` | `string` | 数据提供者名称，默认 `default` |
| `options` | `DefinedInitialQueryOptions` | TanStack Query 选项 |
| `onError` | `(error: IDataProviderError) => void` | 错误回调 |

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `Ref<IDataProviderResponse \| undefined>` | 响应数据 |
| `isLoading` | `ComputedRef<boolean>` | 是否加载中 |
| `refetch` | `() => Promise<any>` | 重新请求 |
