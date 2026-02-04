# useCustomMutation

`useCustomMutation` 用于自定义提交请求。

## 使用方法

```ts
import { useCustomMutation } from '@duxweb/dvha-core'

const { mutate, isLoading } = useCustomMutation({
  path: 'users/import',
  method: 'POST',
})

mutate({ payload: [{ name: '张三' }] })
```

## 参数说明

`useCustomMutation` 继承 `IDataProviderCustomOptions`，并支持：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `providerName` | `string` | 数据提供者名称，默认 `default` |
| `options` | `UseMutationOptions` | TanStack Query 选项 |
| `onSuccess` | `(data: IDataProviderResponse) => void` | 成功回调 |
| `onError` | `(error: IDataProviderError) => void` | 错误回调 |

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mutate` | `(data: IDataProviderCustomOptions) => void` | 触发提交 |
| `isLoading` | `ComputedRef<boolean>` | 是否提交中 |
