# useImportCsv

`useImportCsv` 基于 `useImport`，支持选择 CSV 文件并解析导入。

## 使用方法

```ts
import { useImportCsv } from '@duxweb/dvha-core'

const { isLoading, progress, open, readFile } = useImportCsv({
  path: 'users/import',
  csvOptions: {
    delimiter: ',',
    excelBOM: true,
  },
})

open()
// 或 readFile(file)
```

## 参数说明

继承 `useImport` 的参数，新增：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `encoding` | `'auto' \| string` | 文件编码，默认 `auto` |
| `csvOptions` | `{ delimiter?: string; wrap?: string; eol?: string; excelBOM?: boolean; headerFields?: string[]; keys?: string[]; trimHeaderFields?: boolean; trimFieldValues?: boolean }` | CSV 解析配置 |

说明：

- `open()` 使用内置文件选择（仅 `.csv`）
- `readFile(file)` 可直接传入 `File`
- 无数据时触发 `onError({ status: 400 })`，解析失败触发 `onError({ status: 500 })`

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `isLoading` | `ComputedRef<boolean>` | 是否导入中 |
| `progress` | `ComputedRef<IImportProgress>` | 导入进度 |
| `open` | `() => void` | 打开文件选择 |
| `readFile` | `(file: File) => Promise<void>` | 解析并导入 |
