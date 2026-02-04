# useInvalidate

`useInvalidate` 用于手动失效指定查询缓存。

## 使用方法

```ts
import { useInvalidate } from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

invalidate('users')
invalidate(['users', 'roles'], 'default')
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `path` | `string \| string[]` | 需要失效的路径 |
| `providerName` | `string` | 数据提供者名称，默认 `default` |

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `invalidate` | `(path: string \| string[], providerName?: string) => void` | 失效缓存 |
