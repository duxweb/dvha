# DuxImageEditor - 图像编辑器组件

基于 Fabric.js 的 Vue 3 图像编辑器组件，支持文本、矩形、圆形、图像等元素的编辑。

## 特性

- 🎨 **多元素支持**: 文本、矩形、圆形、图像
- 📏 **自适应缩放**: 画布自动缩放，最大宽度 750px
- 🔧 **工具插件化**: 可扩展的工具系统
- 💾 **JSON 数据**: 支持数据导入导出
- 📐 **标尺显示**: 显示 X、Y 轴标尺
- 🎯 **动态工具栏**: 根据选中对象动态显示属性

## 快速开始

```vue
<script setup lang="ts">
import { DuxImageEditor } from '@duxweb/dvha-pro'
import { ref } from 'vue'

const editorData = ref('')
const canvasSettings = ref({
  width: 750,
  height: 500,
  backgroundColor: '#ffffff',
  backgroundImage: null
})
</script>

<template>
  <DuxImageEditor
    v-model:value="editorData"
    v-model:canvas-settings="canvasSettings"
  />
</template>
```

## 工具说明

### 文本工具
- 双击文本进行编辑
- 支持字体大小、颜色、对齐方式设置
- 自动换行和高度调整

### 矩形工具
- 可设置填充色、边框色、透明度
- 支持标签绑定
- 拖拽调整大小

### 圆形工具
- 可设置填充色、边框色、透明度
- 支持标签绑定
- 拖拽调整半径

### 图像工具
- 双击选择图片文件
- 支持图片替换
- 自动适应占位符大小

## 页面设置

点击工具栏的设置按钮可以配置：
- 画布宽度和高度
- 背景颜色
- 背景图片上传

## 属性 API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | string | '' | 画布数据 JSON 字符串 |
| canvasSettings | CanvasSettings | - | 画布配置 |

### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| update:value | string | 画布数据变化 |
| update:canvasSettings | CanvasSettings | 画布设置变化 |

### CanvasSettings

```typescript
interface CanvasSettings {
  width: number // 画布宽度
  height: number // 画布高度
  backgroundColor: string // 背景颜色
  backgroundImage: string | null // 背景图片
}
```

## 自定义工具

可以扩展新的工具类：

```typescript
import type { ToolConfig } from './tools/base'
import { BaseTool } from './tools/base'

export class CustomTool extends BaseTool {
  constructor(canvas: Canvas, config?: Partial<ToolConfig>) {
    super(canvas, {
      id: 'custom',
      name: '自定义工具',
      icon: 'i-tabler:star',
      ...config
    })
  }

  activate(): void {
    // 工具激活逻辑
  }

  getProperties(): any[] {
    // 返回属性配置
    return []
  }

  updateProperty(key: string, value: any): void {
    // 更新属性逻辑
  }
}
```

## 依赖

- Vue 3
- Fabric.js
- Naive UI
- UnoCSS
