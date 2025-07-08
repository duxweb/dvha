# useLevel - 层级处理

`useLevel` 是一个层级处理 Hook，用于多级联动选择器的数据管理，支持异步数据加载和级联选择。

## 特性

- **多级联动**: 支持多层级的数据联动
- **异步加载**: 支持异步数据获取
- **数据缓存**: 内置数据缓存机制
- **选择验证**: 支持选择项验证
- **自定义渲染**: 支持自定义选择器渲染

## 基础用法

### 导入

```typescript
import { useLevel } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const level = useLevel({
  path: 'area',
  value: ['110000', '110100', '110101'],
  maxLevel: 4,
  nameField: 'name',
  labelField: 'name',
  valueField: 'id'
})

// 获取当前选择的值和选项
const { value, options, loading } = level

// 设置选择值
level.setValue(['110000', '110100', '110101'])

// 重置选择
level.reset()
```

## API 参考

### UseLevelProps

| 属性       | 类型               | 默认值 | 说明                      |
| ---------- | ------------------ | ------ | ------------------------- |
| value      | MaybeRef\<string[]> | []     | 当前选择的值数组          |
| path       | MaybeRef\<string>   | 'area' | 数据接口路径              |
| maxLevel   | MaybeRef\<number>   | 4      | 最大层级数，0表示无限级   |
| nameField  | string             | 'name' | 父级查询字段名            |
| labelField | string             | 'name' | 显示标签字段名            |
| valueField | string             | 'id'   | 值字段名                  |

### UseLevelResult

| 字段     | 类型         | 说明       |
| -------- | ------------ | ---------- |
| values   | Ref\<any[]>   | 选择的值   |
| options  | Ref\<any[][]> | 选项数据   |
| loading  | Ref\<boolean> | 加载状态   |
| setValue | Function     | 设置选择值 |
| reset    | Function     | 重置选择   |

## 使用示例

```vue
<script setup>
import { useLevel } from '@duxweb/dvha-pro'
import { NSelect } from 'naive-ui'

const level = useLevel({
  api: '/api/regions',
  levels: ['province', 'city', 'district']
})

const { values, options, loading } = level
</script>

<template>
  <div class="flex gap-4">
    <NSelect
      v-model:value="values[0]"
      :options="options[0]"
      :loading="loading"
      placeholder="请选择省份"
    />
    <NSelect
      v-model:value="values[1]"
      :options="options[1]"
      :loading="loading"
      placeholder="请选择城市"
    />
    <NSelect
      v-model:value="values[2]"
      :options="options[2]"
      :loading="loading"
      placeholder="请选择区县"
    />
  </div>
</template>
```
