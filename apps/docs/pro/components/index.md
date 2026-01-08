# 组件总览

DVHA Pro 提供了丰富的组件库，涵盖了中后台系统开发的各个方面。组件库分为基础组件和业务组件两大类，所有组件都基于现代化的设计理念，提供了优秀的用户体验和开发体验。

## 组件体系

### 基础组件

DVHA Pro 直接使用 [Naive UI](https://www.naiveui.com/) 作为基础组件库，提供了完整的基础 UI 组件：

#### 通用组件

- **NButton** - 按钮组件，支持多种类型和尺寸
- **NIcon** - 图标组件，集成 Tabler Icons
- **NText** - 文本组件，提供语义化文本样式
- **NEl** - 通用元素组件

#### 布局组件

- **NLayout** - 布局容器
- **NLayoutHeader/NLayoutSider/NLayoutContent/NLayoutFooter** - 布局区域
- **NGrid/NGridItem** - 栅格系统
- **NSpace** - 间距组件
- **NDivider** - 分割线

#### 导航组件

- **NMenu** - 菜单组件
- **NBreadcrumb** - 面包屑导航
- **NTabs** - 标签页
- **NPagination** - 分页组件
- **NSteps** - 步骤条

#### 数据录入组件

- **NInput** - 输入框
- **NSelect** - 选择器
- **NCheckbox/NCheckboxGroup** - 复选框
- **NRadio/NRadioGroup** - 单选框
- **NSwitch** - 开关
- **NSlider** - 滑动条
- **NRate** - 评分
- **NDatePicker** - 日期选择器
- **NTimePicker** - 时间选择器
- **NUpload** - 基础上传组件

#### 数据展示组件

- **NTable** - 基础表格
- **NList** - 基础列表
- **NCard** - 基础卡片
- **NDescriptions** - 描述列表
- **NStatistic** - 统计数值
- **NTag** - 标签
- **NBadge** - 徽标
- **NAvatar** - 头像
- **NImage** - 图片
- **NCarousel** - 基础轮播

#### 反馈组件

- **NAlert** - 警告提示
- **NMessage** - 全局提示
- **NNotification** - 通知提醒
- **NModal** - 基础模态框
- **NDrawer** - 基础抽屉
- **NPopover** - 气泡卡片
- **NTooltip** - 文字提示
- **NProgress** - 进度条
- **NSpin** - 加载中
- **NSkeleton** - 骨架屏

### 业务组件

DVHA Pro 在基础组件之上，提供了专为中后台系统设计的业务组件：

#### 布局组件

- **[DuxCard](/pro/components/card)** - 通用卡片容器，支持头部、内容、底部区域配置
- **[DuxListLayout](/pro/components/layout)** - 列表布局组件，提供筛选、工具栏、分页等功能
- **[DuxTableLayout](/pro/components/layout)** - 表格布局组件，集成查询、操作、分页等功能

#### 表单组件

- **[DuxFormLayout](/pro/components/form)** - 表单布局组件，支持 JSON Schema 动态渲染
- **[DuxFormItem](/pro/components/form)** - 表单项组件，提供统一的表单项样式
- **[DuxTableFilter](/pro/components/form)** - 表格筛选组件，快速构建筛选表单

#### 数据展示组件

- **[DuxTablePage](/pro/components/table)** - 完整的表格页面组件，开箱即用
- **[DuxListPage](/pro/components/list)** - 传统列表页面组件，支持垂直布局
- **[DuxCardPage](/pro/components/list)** - 卡片网格页面组件，支持响应式布局
- **[DuxChart](/pro/components/chart)** - 图表组件，基于 ECharts，支持多种图表类型
- **[DuxStatsNumber](/pro/components/stats)** - 数字统计组件
- **[DuxStatsRealTime](/pro/components/stats)** - 实时统计组件
- **[DuxMedia](/pro/components/media)** - 媒体展示组件，支持图片、头像、标题组合

#### 反馈组件

- **[DuxModal](/pro/components/popup)** - 增强模态框组件
- **[DuxModalPage](/pro/components/popup)** - 模态框页面组件
- **[DuxModalTab](/pro/components/popup)** - 模态框标签页组件
- **[DuxDrawerPage](/pro/components/drawer)** - 抽屉页面组件
- **[DuxBlockEmpty](/pro/components/status)** - 空状态组件

#### 数据录入组件

- **[DuxImageUpload](/pro/components/upload)** - 图片上传组件，支持预览、管理
- **[DuxFileUpload](/pro/components/upload)** - 文件上传组件，支持多种文件类型
- **[DuxFileManage](/pro/components/upload)** - 文件管理组件，提供文件浏览和选择
- **[DuxAiEditor](/pro/components/editor)** - AI 增强编辑器，支持智能写作
- **[DuxImageCrop](/pro/components/crop)** - 图片裁剪组件，支持多种裁剪模式
- **[DuxSelectCard](/pro/components/select)** - 卡片选择组件，提供可视化选择
- **[DuxLevel](/pro/components/level)** - 层级选择组件，支持省市区等多级联动
- **[DuxDynamicData](/pro/components/data)** - 动态数据组件
- **[DuxDynamicSelect](/pro/components/data)** - 动态选择组件
- **[DuxSchemaTreeEditor](/pro/components/schema-editor)** - 树形 Schema 编辑器，支持节点配置

#### 导航组件

- **[DuxCarousel](/pro/components/carousel)** - 轮播组件，支持图片轮播和点击事件

#### 面板组件

- **[DuxPanelAlert](/pro/components/panel)** - 警告面板组件
- **[DuxPanelCard](/pro/components/panel)** - 卡片面板组件

#### 仪表盘组件

- **[DuxDashboardHello](/pro/components/dashboard)** - 欢迎横幅组件
- **[DuxDashboardHelloBig](/pro/components/dashboard)** - 大型欢迎横幅组件
- **[DuxDashboardQuick](/pro/components/dashboard)** - 快捷功能组件

#### 小部件组件

- **[DuxAvatar](/pro/components/widget)** - 增强头像组件，支持占位符
- **[DuxImage](/pro/components/widget)** - 增强图片组件，支持占位符和错误处理
- **[DuxConnect](/pro/components/widget)** - 连接状态组件

#### 设计器组件

- **[DuxFlowEditor](/pro/components/flow-editor)** - 可视化流程设计器，支持拖拽式节点编辑和连线操作

## 使用说明

### 基础组件使用

基础组件直接使用 Naive UI 组件，无需额外导入：

```vue
<script setup>
// 直接使用 Naive UI 组件
</script>

<template>
  <NButton type="primary">
    按钮
  </NButton>
  <NInput placeholder="请输入内容" />
  <NSelect :options="options" />
  <NTable :data="tableData" />
</template>
```

### 业务组件使用

业务组件需要从 `@duxweb/dvha-pro` 导入：

```vue
<script setup>
import {
  DuxCard,
  DuxTablePage
} from '@duxweb/dvha-pro'
</script>

<template>
  <DuxCard title="用户管理">
    <DuxTablePage path="/api/users" />
  </DuxCard>
</template>
```

### 全局注册

所有业务组件在安装 DVHA Pro 时已全局注册，可直接在模板中使用：

```vue
<template>
  <!-- 无需导入，直接使用 -->
  <DuxTablePage path="/api/users" />
  <DuxFormLayout :schema="formSchema" />
</template>
```

## 设计原则

### 一致性

- **视觉一致性** - 统一的设计语言和视觉风格
- **交互一致性** - 相同的交互模式和操作逻辑
- **代码一致性** - 统一的 API 设计和命名规范

### 可用性

- **易用性** - 简单直观的 API 设计
- **可访问性** - 支持键盘导航和屏幕阅读器
- **响应式** - 适配各种屏幕尺寸和设备

### 可扩展性

- **组合式设计** - 组件可以灵活组合使用
- **插槽支持** - 提供丰富的插槽用于自定义
- **主题定制** - 支持深度的主题定制

### 性能

- **按需加载** - 支持组件的按需导入
- **虚拟滚动** - 大数据量场景的性能优化
- **缓存优化** - 智能的数据缓存机制

## 开发指南

### TypeScript 支持

所有组件都提供了完整的 TypeScript 类型定义：

```typescript
import type { DuxTablePageProps, DuxFormLayoutProps } from '@duxweb/dvha-pro'

// 组件属性类型
const tableProps: DuxTablePageProps = {
  path: '/api/users',
  columns: [...]
}

// 事件回调类型
const handleSubmit = (data: FormData) => {
  // 类型安全的表单数据处理
}
```

### 主题定制

组件支持通过 CSS 变量进行主题定制：

```css
:root {
  --ui-color-primary: 59 130 246;
  --ui-border-radius: 6px;
  --ui-spacing-unit: 4px;
}
```

### 国际化支持

组件内置国际化支持，可配置多语言：

```typescript
import { useI18n } from '@duxweb/dvha'

const { t } = useI18n()

// 组件会自动使用配置的语言
```

## 最佳实践

### 组件选择

- **优先使用业务组件** - 业务组件提供了更丰富的功能和更好的用户体验
- **基础组件补充** - 在业务组件无法满足需求时使用基础组件
- **组合使用** - 通过组合不同组件实现复杂的业务需求

### 性能优化

- **按需导入** - 只导入需要的组件
- **合理使用缓存** - 利用组件内置的缓存机制
- **避免过度渲染** - 合理使用 `v-memo` 和 `v-once`

### 代码组织

- **组件拆分** - 将复杂组件拆分为多个小组件
- **逻辑复用** - 使用 Composition API 抽取可复用逻辑
- **类型安全** - 充分利用 TypeScript 的类型检查

## 贡献指南

欢迎贡献代码和提出建议，请参考 [贡献指南](https://github.com/duxweb/dvha) 了解详细信息。
