# useConfig

`useConfig` 用于获取全局配置对象。

## 使用方法

```ts
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()
```

## 说明

- 配置通过 `provide('dux.config', config)` 注入
- 若未提供配置，会抛出错误

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `config` | `IConfig` | 全局配置对象 |
