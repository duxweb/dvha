# useCreateMany

`useCreateMany` 用于批量创建数据。

## 使用方法

```ts
import { useCreateMany } from '@duxweb/dvha-core'

const { mutate, isLoading } = useCreateMany({
  path: 'users',
})

mutate({
  data: [
    { name: '张三' },
    { name: '李四' },
  ],
})
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `string` | 资源路径（建议提供） |
| `data` | `any[]` | 批量数据 |
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
| `mutate` | `(data: IDataProviderCreateManyOptions) => void` | 触发创建 |
| `isLoading` | `ComputedRef<boolean>` | 是否提交中 |
