# useUI - UI 状态管理

`useUI` 是一个 UI 状态管理 Hook，提供界面状态的管理功能，包括菜单折叠状态、命令面板显示状态等。

## 特性

- **菜单控制**: 桌面端菜单折叠状态管理
- **移动端菜单**: 移动端菜单折叠状态管理
- **命令面板**: 命令面板显示状态控制

## 基础用法

### 导入

```typescript
import { useUI } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const ui = useUI()

// 菜单折叠控制
ui.setMenuCollapsed(true) // 折叠菜单
ui.setMenuCollapsed(false) // 展开菜单

// 移动端菜单控制
ui.setMenuMobileCollapsed(true) // 折叠移动端菜单
ui.setMenuMobileCollapsed(false) // 展开移动端菜单

// 命令面板控制
ui.setCmdVisible(true) // 显示命令面板
ui.setCmdVisible(false) // 隐藏命令面板

// 获取状态
console.log(ui.menuCollapsed.value) // 菜单折叠状态
console.log(ui.menuMobileCollapsed.value) // 移动端菜单折叠状态
console.log(ui.cmdVisible.value) // 命令面板显示状态
```

## API 参考

### UseUIResult

| 字段                   | 类型                     | 说明                 |
| ---------------------- | ------------------------ | -------------------- |
| menuCollapsed          | Ref\<boolean\>           | 菜单折叠状态         |
| setMenuCollapsed       | (collapsed: boolean) => void | 设置菜单折叠状态     |
| menuMobileCollapsed    | Ref\<boolean\>           | 移动端菜单折叠状态   |
| setMenuMobileCollapsed | (collapsed: boolean) => void | 设置移动端菜单折叠状态 |
| cmdVisible             | Ref\<boolean\>           | 命令面板显示状态     |
| setCmdVisible          | (visible: boolean) => void   | 设置命令面板显示状态 |

## 使用示例

### 菜单控制

```vue
<script setup>
import { useUI } from '@duxweb/dvha-pro'
import { NButton, NSwitch } from 'naive-ui'

const ui = useUI()

function toggleMenu() {
  ui.setMenuCollapsed(!ui.menuCollapsed.value)
}

function toggleMobileMenu() {
  ui.setMenuMobileCollapsed(!ui.menuMobileCollapsed.value)
}

function toggleCmd() {
  ui.setCmdVisible(!ui.cmdVisible.value)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4">
      <NButton @click="toggleMenu">
        {{ ui.menuCollapsed.value ? '展开菜单' : '折叠菜单' }}
      </NButton>

      <NButton @click="toggleMobileMenu">
        {{ ui.menuMobileCollapsed.value ? '展开移动端菜单' : '折叠移动端菜单' }}
      </NButton>

      <NButton @click="toggleCmd">
        {{ ui.cmdVisible.value ? '隐藏命令面板' : '显示命令面板' }}
      </NButton>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <span>菜单折叠:</span>
        <NSwitch
          :value="ui.menuCollapsed.value"
          @update:value="ui.setMenuCollapsed"
        />
      </div>

      <div class="flex items-center gap-2">
        <span>移动端菜单折叠:</span>
        <NSwitch
          :value="ui.menuMobileCollapsed.value"
          @update:value="ui.setMenuMobileCollapsed"
        />
      </div>

      <div class="flex items-center gap-2">
        <span>命令面板显示:</span>
        <NSwitch
          :value="ui.cmdVisible.value"
          @update:value="ui.setCmdVisible"
        />
      </div>
    </div>
  </div>
</template>
```

### 响应式菜单控制

```vue
<script setup>
import { useUI } from '@duxweb/dvha-pro'
import { useMediaQuery } from '@vueuse/core'
import { watch } from 'vue'

const ui = useUI()
const isMobile = useMediaQuery('(max-width: 768px)')

// 根据屏幕尺寸自动调整菜单状态
watch(isMobile, (mobile) => {
  if (mobile) {
    // 移动端默认折叠桌面菜单
    ui.setMenuCollapsed(true)
  }
  else {
    // 桌面端默认折叠移动端菜单
    ui.setMenuMobileCollapsed(true)
  }
}, { immediate: true })
</script>

<template>
  <div class="layout">
    <!-- 桌面端侧边栏 -->
    <aside
      v-if="!isMobile"
      :class="{ collapsed: ui.menuCollapsed.value }"
      class="sidebar"
    >
      <!-- 菜单内容 -->
    </aside>

    <!-- 移动端抽屉菜单 -->
    <n-drawer
      v-if="isMobile"
      :show="!ui.menuMobileCollapsed.value"
      placement="left"
      @update:show="ui.setMenuMobileCollapsed"
    >
      <!-- 移动端菜单内容 -->
    </n-drawer>

    <!-- 命令面板 -->
    <n-modal
      :show="ui.cmdVisible.value"
      @update:show="ui.setCmdVisible"
    >
      <!-- 命令面板内容 -->
    </n-modal>
  </div>
</template>
```

## 注意事项

1. **状态持久化**: `menuCollapsed` 状态会自动持久化保存
2. **管理端隔离**: 每个管理端（manage）都有独立的 UI 状态
3. **响应式**: 所有状态都是响应式的，可直接在模板中使用
