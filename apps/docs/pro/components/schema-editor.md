# SchemaTreeEditor

`DuxSchemaTreeEditor` 基于 Naive UI `NTree` 封装，提供一个可视化的树形 Schema 编辑器，支持节点增删、类型选择、参数配置等操作，方便后端/前端通过结构化配置完成复杂表单或接口 Schema 的维护。

## 特性

- **树形编辑**：支持新增根节点、子节点、复制、删除等常规操作
- **自定义节点类型**：通过 `type-options` 传入标签/颜色，自动在树节点上展示
- **参数面板**：`param-fields` 描述节点需要维护的自定义字段，自动渲染成表单
- **双向绑定**：`v-model` 输出完整树结构（包含 `name/type/description/params/children`）
- **Modal 交互**：新增/复制/编辑节点时会通过 `useModal` 弹出配置表单，交互流程统一

## 基础示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DuxSchemaTreeEditor } from '@duxweb/dvha-pro'

const schema = ref([
  {
    id: 'root',
    name: '用户',
    type: 'object',
    params: { required: true },
    children: [
      { id: 'field_name', name: '姓名', type: 'string' },
      { id: 'field_age', name: '年龄', type: 'number' },
    ],
  },
])

const paramFields = [
  { key: 'required', label: '必填', component: 'switch' },
  { key: 'mock', label: 'Mock 数据', component: 'textarea', rows: 2 },
]
</script>

<template>
  <DuxSchemaTreeEditor v-model="schema" :param-fields="paramFields" />
</template>
```

## 自定义节点类型

```vue
<DuxSchemaTreeEditor
  v-model="schema"
  :type-options="[
    { label: '对象', value: 'object', tagType: 'info' },
    { label: '数组', value: 'array', tagType: 'success' },
    { label: '字符串', value: 'string' },
    { label: '数字', value: 'number', tagType: 'warning' },
    { label: '布尔', value: 'boolean', tagType: 'error' }
  ]"
/>
```

> `tagType` 对应 Naive UI `NTag` 的 `type`，用于快速区分不同节点类型。

## 参数 schema

`param-fields` 的每一项都描述了一个表单字段，基础结构如下：

| 属性 | 说明 |
|------|------|
| `key` | 写入 `node.params[key]` 的字段名 |
| `label` | 表单项标题 |
| `component` | 渲染类型，支持 `input/textarea/select/number/switch`，默认 `input` |
| `options` | 仅在 `select` 时生效 |
| `placeholder` | 表单占位提示 |
| `rows` | `textarea` 的高度 |
| `componentProps` | 透传给对应组件的额外属性 |

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| `v-model` | `SchemaTreeNode[]` | Schema 树数据 |
| `type-options` | `SchemaTypeOption[]` | 节点类型列表，默认内置常见类型 |
| `param-fields` | `SchemaParamField[]` | 自定义参数字段配置 |
| `readonly` | `boolean` | 是否只读，禁用所有编辑行为 |

## 数据结构

```ts
interface SchemaTreeNode {
  id: string
  name: string
  type: string
  description?: string
  params?: Record<string, any>
  children?: SchemaTreeNode[]
}
```

通过 `v-model` 返回的就是上述结构，可直接用于接口传输、落库等场景。
