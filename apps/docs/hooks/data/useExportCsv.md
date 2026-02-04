# useExportCsv

`useExportCsv` 基于 `useExport` 导出数据并生成 CSV 文件。

## 使用方法

```ts
import { useExportCsv } from '@duxweb/dvha-core'

const { isLoading, trigger } = useExportCsv({
  path: 'users',
  filename: 'users.csv',
  headers: ['id', 'name', 'email'],
  csvOptions: {
    delimiter: ',',
    writeBOM: true,
  },
})

trigger()
```

## 参数说明

继承 `useExport` 的参数，新增：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `filename` | `string` | 下载文件名，默认 `export.csv` |
| `headers` | `string[] \| boolean` | 指定导出字段；`false` 表示不输出表头 |
| `csvOptions` | `{ delimiter?: string; quote?: string \| boolean; escape?: string; eol?: string; writeBOM?: boolean }` | CSV 配置 |

## 默认行为

- `writeBOM` 默认为 `true`（用于 Excel 中文兼容）
- 当 `headers === false` 时不输出表头
- 当无数据可导出时触发 `onError({ status: 400 })`

## 返回值

与 `useExport` 一致：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `Ref<IDataProviderResponse \| undefined>` | 导出数据 |
| `isLoading` | `Ref<boolean>` | 是否导出中 |
| `trigger` | `() => Promise<void>` | 触发导出 |
