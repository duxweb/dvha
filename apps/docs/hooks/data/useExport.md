# useExport

`useExport` 用于基于 `useInfiniteList` 循环请求分页数据，适合批量导出场景。

## 特点

- 基于 `useInfiniteList` 自动分页请求
- 支持请求间隔与最大页数限制
- 内置导出中状态，避免重复触发

## 使用方法

```ts
import { useExport } from '@duxweb/dvha-core'

const { data, isLoading, trigger } = useExport({
  path: 'users',
  pagination: { pageSize: 100 },
  interval: 500,
  maxPage: 20,
  onProgress: (pagination) => {
    console.log('当前页:', pagination.page)
  },
  onSuccess: (res) => {
    console.log('导出完成:', res?.data)
  },
})
```

## 参数说明

`useExport` 继承 `useInfiniteList` 的参数，新增以下参数：

| 参数        | 类型                              | 说明 |
| ----------- | --------------------------------- | ---- |
| `onSuccess` | `(data?: IDataProviderResponse) => void` | 导出完成回调 |
| `onProgress` | `(pagination?: IDataProviderPagination) => void` | 每页请求完成回调 |
| `interval` | `number` | 请求间隔（毫秒），默认 `300` |
| `maxPage` | `number \| (() => number)` | 最大导出页数，`0` 表示不限制 |

## 返回值

| 字段        | 类型                     | 说明 |
| ----------- | ------------------------ | ---- |
| `data`      | `Ref<IDataProviderResponse \| undefined>` | 合并后的数据（与 `useInfiniteList` 一致） |
| `isLoading` | `Ref<boolean>`           | 是否导出中 |
| `trigger`   | `() => Promise<void>`    | 触发导出 |
