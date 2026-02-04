# 标签组件

`DuxTabRouterView` 用于多标签页模式的路由渲染与缓存。

## 使用方法

```vue
<template>
  <DuxTabRouterView />
</template>

<script setup>
import { DuxTabRouterView } from '@duxweb/dvha-core'
</script>
```

## 行为说明

- 基于 `KeepAlive` 缓存已打开的路由组件
- 监听路由变化自动添加标签
- 关闭标签会同步清理缓存
