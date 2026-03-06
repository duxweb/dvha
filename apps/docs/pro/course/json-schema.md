# JSON Schema 动态表单

这一页主要讲：**怎么用 JSON Schema 做更动态的页面和表单。**

如果你有这些场景，这一页会很有用：

- 表单结构希望配置化
- 页面内容希望服务端下发
- 想减少重复写大量相似表单

## 核心能力来自哪里

```ts
import { useJsonSchema } from '@duxweb/dvha-core'
import { DuxSchemaTreeEditor } from '@duxweb/dvha-pro'
```

最简单理解：

- `useJsonSchema`：把一份 JSON 配置渲染成页面
- `DuxSchemaTreeEditor`：更方便地编辑 Schema

## 它适合解决什么问题

最适合：

- 动态表单
- 配置化页面
- 低代码类编辑场景
- 运营配置页面

## 如果你已经看过 Core 文档

建议把这页和下面两页一起看：

- [`/hooks/advanced/useJson`](/hooks/advanced/useJson)
- [`/guide/custom-extension`](/guide/custom-extension)

因为 JSON Schema 真正跑起来通常会和：

- `jsonSchema.components`
- 组件注册
- 全局 / 管理端配置

一起配合使用。

## 最常见问题

### Schema 能拿到，但组件不显示

先检查：

- `jsonSchema.components` 是否已注册对应组件
- `tag` 名称是否和注册名一致

### 想做可视化编辑怎么办

先看 `DuxSchemaTreeEditor`，它更适合做可编辑的 Schema 管理场景。

## 下一步建议

如果你还需要动态页面或远程扩展，可以继续看：

- [`远程组件与微前端`](/pro/course/remote)
