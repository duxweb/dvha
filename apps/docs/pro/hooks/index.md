# Hooks 总览

DVHA Pro 提供了一系列强大的 Hooks，用于简化常见的业务逻辑和交互操作。这些 Hooks 专门针对中后台管理系统的需求设计，提供开箱即用的解决方案。

## Hooks 分类

### 交互增强 Hooks

- **[useAction](./action)** - 操作增强，统一处理模态框、抽屉、确认对话框等用户操作
- **[useDialog](./dialog)** - 对话框管理，提供各种类型的对话框调用方法
- **[useDrawer](./drawer)** - 抽屉管理，便捷的侧边滑出容器调用
- **[useModal](./modal)** - 模态框管理，异步组件加载的模态对话框

### 表格增强 Hooks

- **[useTable](./table)** - 表格数据管理，提供完整的表格功能支持

### 功能工具 Hooks

- **[useDownload](./download)** - 下载功能，支持多种文件下载方式和进度监控
- **[useImage](./image)** - 图片处理，提供图片预览和处理功能
- **[useLevel](./level)** - 层级处理，多级联动选择器的数据管理
- **[useEchart](./echart)** - 图表处理，ECharts 图表的配置和管理
- **[useUI](./ui)** - UI 工具，界面状态和交互的管理

## 特性概览

### 🎯 业务导向

所有 Hooks 都针对中后台管理系统的常见业务场景设计，提供开箱即用的解决方案。

### 🔧 类型安全

完整的 TypeScript 类型定义，提供良好的开发体验和类型提示。

### 🎨 高度可定制

支持丰富的配置选项，可以根据具体需求进行定制和扩展。

### ⚡ 性能优化

内置缓存、防抖、节流等性能优化策略，确保良好的用户体验。

### 🌐 国际化支持

集成国际化功能，支持多语言环境。

## 快速开始

### 安装

```bash
npm install @duxweb/dvha-pro
```

### 基础用法

```typescript
import {
  useAction,
  useDialog,
  useDownload,
  useTable
} from '@duxweb/dvha-pro'

// 在组件中使用
export default {
  setup() {
    const action = useAction()
    const dialog = useDialog()
    const download = useDownload()
    const table = useTable()

    return {
      action,
      dialog,
      download,
      table
    }
  }
}
```

## 设计原则

### 1. 一致性

所有 Hooks 遵循统一的 API 设计模式，降低学习成本。

### 2. 可组合性

Hooks 之间可以灵活组合使用，构建复杂的业务逻辑。

### 3. 可扩展性

提供丰富的配置选项和回调函数，支持业务定制需求。

### 4. 响应式

基于 Vue 3 的响应式系统，自动处理数据变化和界面更新。

## 最佳实践

### 1. 合理使用组合

```typescript
// ✅ 推荐：组合使用多个 Hooks
const { show: showModal } = useModal()
const { confirm } = useDialog()
const { file: downloadFile } = useDownload()

async function handleExport() {
  const confirmed = await confirm({
    title: '确认导出',
    content: '是否导出当前数据？'
  })

  if (confirmed) {
    downloadFile('/api/export', { format: 'xlsx' })
  }
}
```

### 2. 统一错误处理

```typescript
// ✅ 推荐：统一的错误处理
const action = useAction({
  onError: (error) => {
    console.error('操作失败:', error)
    // 统一的错误处理逻辑
  }
})
```

### 3. 性能优化

```typescript
// ✅ 推荐：合理使用缓存和防抖
const table = useTable({
  path: '/api/users',
  // 启用缓存
  staleTime: 5 * 60 * 1000, // 5分钟
  // 防抖搜索
  debounceMs: 300
})
```

## 常见问题

### Q: 如何在非组件中使用 Hooks？

A: Hooks 必须在 Vue 组件的 setup 函数中使用。如果需要在其他地方使用，可以考虑使用 Pinia store 或者全局状态管理。

### Q: 多个 Hooks 之间如何共享状态？

A: 可以通过以下方式共享状态：

- 使用 `ref` 或 `reactive` 创建共享状态
- 使用 Pinia store 管理全局状态
- 通过 props 和 emit 在组件间传递状态

### Q: 如何扩展现有的 Hooks？

A: 可以通过以下方式扩展：

- 包装现有 Hooks 添加额外功能
- 使用组合模式结合多个 Hooks
- 继承和扩展 Hook 的配置选项

## 贡献指南

欢迎为 DVHA Pro Hooks 贡献代码！请遵循以下指南：

1. 遵循现有的代码风格和命名规范
2. 添加完整的类型定义
3. 编写相应的测试用例
4. 更新相关文档
