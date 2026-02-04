# useUpdateMany

`useUpdateMany` 用于批量更新数据。

## 使用方法

```ts
import { useUpdateMany } from '@duxweb/dvha-core'

const { mutate, isLoading } = useUpdateMany({
  path: 'users',
})

mutate({ ids: [1, 2], data: { status: 'active' } })
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `string` | 资源路径（建议提供） |
| `ids` | `Array<string \| number>` | 记录 ID 集合 |
| `data` | `any` | 更新数据 |
| `meta` | `Record<string, any>` | 额外参数 |
| `providerName` | `string` | 数据提供者名称，默认 `default` |
| `options` | `UseMutationOptions` | TanStack Query 选项 |
| `onSuccess` | `(data: IDataProviderResponse) => void` | 成功回调 |
| `onError` | `(error: IDataProviderError) => void` | 错误回调 |

说明：

- 也可以在 `mutate` 时传入 `path` 覆盖当前路径
- 成功后会自动失效 `path` 对应的查询缓存

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mutate` | `(data: IDataProviderUpdateManyOptions) => void` | 触发更新 |
| `isLoading` | `ComputedRef<boolean>` | 是否提交中 |
