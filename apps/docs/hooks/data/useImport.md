# useImport

`useImport` 用于批量导入数据，会按批次调用自定义接口。

## 使用方法

```ts
import { useImport } from '@duxweb/dvha-core'

const { isLoading, progress, trigger } = useImport({
  path: 'users/import',
  chunkSize: 100,
  interval: 200,
  onProgress: (p) => {
    console.log(p.percentage)
  },
  onComplete: (p) => {
    console.log('完成', p.totalItems)
  },
})

trigger([{ name: '张三' }, { name: '李四' }])
```

## 参数说明

`useImport` 继承 `IDataProviderCustomOptions`，新增：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `chunkSize` | `number` | 每批数量，默认 `100` |
| `interval` | `number` | 批次间隔（毫秒），默认 `100` |
| `onProgress` | `(progress: IImportProgress) => void` | 进度回调 |
| `onComplete` | `(progress: IImportProgress) => void` | 完成回调 |
| `onError` | `(error: IDataProviderError) => void` | 错误回调 |

说明：

- 内部固定使用 `POST` 调用自定义接口
- `path` 建议必填

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `isLoading` | `ComputedRef<boolean>` | 是否导入中 |
| `progress` | `ComputedRef<IImportProgress>` | 导入进度 |
| `trigger` | `(data: Record<string, any>[]) => Promise<void>` | 触发导入 |

## IImportProgress

```ts
interface IImportProgress {
  totalItems: number
  processedItems: number
  totalBatches: number
  processedBatches: number
  percentage: number
}
```
