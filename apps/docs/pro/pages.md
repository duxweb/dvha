# 页面组件总览

## 导入说明

```typescript
import {
  DuxAuthLayout,
  DuxLayout,
  DuxLogin,
  DuxMenuAvatar,
  DuxMenuButton,
  DuxMenuCmd,
  DuxMenuMain,
  DuxPage,
  DuxPage403,
  DuxPage404,
  DuxPage500,
  DuxPageEmpty,
  DuxPageLoading,
  DuxPageStatus
} from '@duxweb/dvha-pro'
```

页面组件提供了一套完整的页面布局和状态展示解决方案。这些组件主要作为 DVHA 的预设配置组件，为系统提供统一的页面结构和用户体验。

## 组件分类

### 布局组件

| 组件名 | 说明 | 使用场景 |
| --- | --- | --- |
| DuxLayout | 主布局组件 | 应用主要布局容器 |
| DuxAuthLayout | 认证布局组件 | 登录、注册等认证页面布局 |

### 页面组件

| 组件名 | 说明 | 使用场景 |
| --- | --- | --- |
| DuxLogin | 登录页面 | 用户登录界面 |
| DuxPage | 通用页面容器 | 标准页面布局 |

### 状态页面

| 组件名 | 说明 | 使用场景 |
| --- | --- | --- |
| DuxPage403 | 403 权限不足页面 | 用户权限不足时显示 |
| DuxPage404 | 404 页面未找到 | 路由不存在时显示 |
| DuxPage500 | 500 服务器错误页面 | 服务器内部错误时显示 |
| DuxPageEmpty | 空状态页面 | 数据为空时显示 |
| DuxPageLoading | 加载状态页面 | 页面加载时显示 |
| DuxPageStatus | 通用状态页面 | 自定义状态展示 |

### 菜单组件

| 组件名 | 说明 | 使用场景 |
| --- | --- | --- |
| DuxMenuMain | 主菜单组件 | 侧边栏主导航 |
| DuxMenuAvatar | 用户头像菜单 | 用户信息和设置 |
| DuxMenuButton | 菜单按钮 | 菜单项通用按钮 |
| DuxMenuCmd | 命令面板 | 快速搜索和操作 |

## 设计原则

### 1. 预设配置
所有页面组件都是预设的配置组件，提供开箱即用的页面解决方案：

```vue
<template>
  <!-- 直接使用预设布局 -->
  <DuxLayout>
    <router-view />
  </DuxLayout>
</template>
```

### 2. 统一体验
组件遵循统一的设计语言和交互模式：

- **一致的视觉风格**: 使用统一的色彩、字体、间距
- **标准化的交互**: 相同的操作反馈和状态转换
- **响应式设计**: 自适应不同设备和屏幕尺寸

### 3. 可配置性
通过配置而非修改来实现定制：

```typescript
// 通过配置定制页面行为
const config = {
  title: '我的应用',
  logo: '/logo.png',
  userMenus: [
    { label: '个人资料', path: '/profile' }
  ]
}
```

## 使用指南

### 基础布局

最简单的应用布局：

```vue
<script setup>
import { DuxLayout } from '@duxweb/dvha-pro'
</script>

<template>
  <DuxLayout>
    <router-view />
  </DuxLayout>
</template>
```

### 认证流程

登录页面的使用：

```vue
<script setup>
import { DuxAuthLayout, DuxLogin } from '@duxweb/dvha-pro'
</script>

<template>
  <DuxAuthLayout>
    <DuxLogin />
  </DuxAuthLayout>
</template>
```

### 错误处理

不同错误状态的处理：

```vue
<template>
  <div>
    <!-- 404 错误 -->
    <DuxPage404 v-if="is404" />

    <!-- 权限错误 -->
    <DuxPage403 v-else-if="is403" />

    <!-- 服务器错误 -->
    <DuxPage500 v-else-if="is500" />

    <!-- 正常内容 -->
    <router-view v-else />
  </div>
</template>
```

### 加载状态

页面加载时的状态展示：

```vue
<template>
  <div>
    <DuxPageLoading v-if="loading" />
    <DuxPageEmpty v-else-if="isEmpty" />
    <div v-else>
      <!-- 正常内容 -->
    </div>
  </div>
</template>
```

## 注意事项

1. **预设组件**: 这些组件主要作为预设配置使用，不建议直接继承或修改源码
2. **版本兼容**: 组件 API 保持向后兼容，升级时注意查看变更日志
3. **性能考虑**: 大型应用建议使用懒加载和代码分割
4. **国际化**: 所有文本都支持国际化，可通过 `useI18n` 进行语言切换
5. **样式隔离**: 使用 CSS 变量进行主题定制，避免直接修改组件样式
