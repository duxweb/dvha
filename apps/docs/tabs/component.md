# 标签组件

DVHA 框架提供了标签页系统，支持多标签页浏览，提升用户在复杂管理界面中的操作体验。

## 功能特点

- 📑 **多标签浏览** - 支持在多个页面间快速切换
- 💾 **状态保持** - 自动保持页面状态和滚动位置
- 🔒 **锁定标签** - 支持锁定重要标签防止误关闭
- 🎯 **智能缓存** - 基于 KeepAlive 的智能组件缓存
- 🔄 **动态管理** - 支持添加、删除、切换标签页
- 🎨 **自定义样式** - 完全可定制的标签页外观
- ⚡ **高性能** - 优化的渲染和内存管理

## 核心组件

### DuxTabRouterView

标签页路由视图组件，负责标签页的渲染和状态管理：

```vue
<template>
  <div class="layout">
    <!-- 标签栏 -->
    <div class="tabs-bar">
      <tab-bar />
    </div>

    <!-- 标签页内容 -->
    <div class="tabs-content">
      <DuxTabRouterView />
    </div>
  </div>
</template>

<script setup>
import { DuxTabRouterView } from '@duxweb/dvha-core'
</script>
```

### 工作原理

`DuxTabRouterView` 组件的核心特性：

1. **自动标签管理**: 监听路由变化，自动添加新标签
2. **组件缓存**: 使用 KeepAlive 缓存组件实例
3. **内存优化**: 自动清理已关闭标签的缓存
4. **过渡动画**: 内置标签切换的过渡效果

## 标签栏组件

### 基础标签栏

```vue
<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      :class="['tab-item', { active: tab.path === current }]"
      @click="changeTab(tab.path)"
    >
      <span class="tab-label">{{ tab.label }}</span>

      <!-- 锁定图标 -->
      <i
        v-if="tab.meta?.lock"
        class="tab-lock"
        @click.stop="lockTab(tab.path)"
      >🔒</i>

      <!-- 关闭按钮 -->
      <button
        v-else
        class="tab-close"
        @click.stop="delTab(tab.path)"
      >×</button>
    </div>
  </div>
</template>

<script setup>
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

const { tabs, current, delTab, changeTab, lockTab } = tabStore

const handleTabClick = (path) => {
  changeTab(path, (tab) => {
    router.push(tab.path)
  })
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.tab-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  border-right: 1px solid #e8e8e8;
  transition: background-color 0.2s;
}

.tab-item:hover {
  background-color: #f5f5f5;
}

.tab-item.active {
  background-color: #1890ff;
  color: white;
}

.tab-close {
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
</style>
```

### 带右键菜单的标签栏

```vue
<template>
  <div class="tab-bar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      :class="['tab-item', { active: tab.path === current }]"
      @click="changeTab(tab.path)"
      @contextmenu.prevent="showContextMenu($event, tab)"
    >
      <span class="tab-label">{{ tab.label }}</span>
      <button
        v-if="!tab.meta?.lock"
        class="tab-close"
        @click.stop="delTab(tab.path)"
      >×</button>
    </div>

    <!-- 右键菜单 -->
    <div
      v-if="contextMenu.visible"
      :style="contextMenuStyle"
      class="context-menu"
    >
      <div @click="refreshTab">刷新</div>
      <div @click="closeTab">关闭</div>
      <div @click="closeOthers">关闭其他</div>
      <div @click="closeLeft">关闭左侧</div>
      <div @click="closeRight">关闭右侧</div>
      <div @click="toggleLock">
        {{ contextMenu.tab?.meta?.lock ? '解锁' : '锁定' }}
      </div>
    </div>
  </div>

  <!-- 点击遮罩关闭菜单 -->
  <div
    v-if="contextMenu.visible"
    class="context-overlay"
    @click="hideContextMenu"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  tab: null
})

const contextMenuStyle = computed(() => ({
  left: `${contextMenu.value.x}px`,
  top: `${contextMenu.value.y}px`
}))

const showContextMenu = (event, tab) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    tab
  }
}

const hideContextMenu = () => {
  contextMenu.value.visible = false
}

const refreshTab = () => {
  const tab = contextMenu.value.tab
  router.go(0) // 刷新当前页面
  hideContextMenu()
}

const closeTab = () => {
  const tab = contextMenu.value.tab
  tabStore.delTab(tab.path, (nextTab) => {
    router.push(nextTab.path)
  })
  hideContextMenu()
}

const closeOthers = () => {
  const tab = contextMenu.value.tab
  tabStore.delOther(tab.path, () => {
    router.push(tab.path)
  })
  hideContextMenu()
}

const closeLeft = () => {
  const tab = contextMenu.value.tab
  tabStore.delLeft(tab.path)
  hideContextMenu()
}

const closeRight = () => {
  const tab = contextMenu.value.tab
  tabStore.delRight(tab.path)
  hideContextMenu()
}

const toggleLock = () => {
  const tab = contextMenu.value.tab
  tabStore.lockTab(tab.path)
  hideContextMenu()
}
</script>
```

## 标签页布局

### 完整布局示例

```vue
<template>
  <div class="admin-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-left">
        <img src="/logo.png" class="logo" />
        <h1>管理后台</h1>
      </div>
      <div class="header-right">
        <user-dropdown />
      </div>
    </header>

    <!-- 主体区域 -->
    <div class="main">
      <!-- 侧边菜单 -->
      <aside class="sidebar">
        <main-menu />
      </aside>

      <!-- 内容区域 -->
      <div class="content">
        <!-- 标签栏 -->
        <div class="tabs-bar">
          <tab-bar />
        </div>

        <!-- 页面内容 -->
        <div class="page-content">
          <DuxTabRouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DuxTabRouterView } from '@duxweb/dvha-core'
import TabBar from './components/TabBar.vue'
import MainMenu from './components/MainMenu.vue'
import UserDropdown from './components/UserDropdown.vue'
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: #001529;
  color: white;
}

.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: #001529;
  overflow-y: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs-bar {
  height: 40px;
  border-bottom: 1px solid #e8e8e8;
}

.page-content {
  flex: 1;
  overflow: hidden;
}
</style>
```

### 响应式布局

```vue
<template>
  <div class="responsive-layout">
    <!-- 移动端顶部栏 -->
    <header class="mobile-header" v-if="isMobile">
      <button @click="toggleSidebar">☰</button>
      <h1>{{ currentPageTitle }}</h1>
    </header>

    <!-- 桌面端布局 -->
    <div class="desktop-layout" v-else>
      <!-- 正常的桌面端布局 -->
    </div>

    <!-- 移动端标签切换器 -->
    <div class="mobile-tabs" v-if="isMobile">
      <select v-model="currentTab" @change="switchTab">
        <option
          v-for="tab in tabs"
          :key="tab.path"
          :value="tab.path"
        >
          {{ tab.label }}
        </option>
      </select>
    </div>

    <!-- 页面内容 -->
    <div class="content">
      <DuxTabRouterView />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

const router = useRouter()
const tabStore = useTabStore()
const isMobile = ref(window.innerWidth < 768)

const currentTab = computed({
  get: () => tabStore.current,
  set: (value) => {
    tabStore.changeTab(value, (tab) => {
      router.push(tab.path)
    })
  }
})

const switchTab = () => {
  const tab = tabStore.tabs.find(t => t.path === currentTab.value)
  if (tab) {
    router.push(tab.path)
  }
}
</script>
```

## 标签页状态管理

### 自定义标签标题

```vue
<script setup>
import { onMounted } from 'vue'
import { useTabStore, useRouteStore } from '@duxweb/dvha-core'

const tabStore = useTabStore()
const routeStore = useRouteStore()

onMounted(() => {
  // 更新当前标签页标题
  const currentRoute = routeStore.searchRouteName(route.name)
  if (currentRoute) {
    tabStore.addTab({
      ...currentRoute,
      label: '自定义标题', // 覆盖默认标题
      path: route.path
    })
  }
})
</script>
```

### 条件显示标签

```vue
<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTabStore } from '@duxweb/dvha-core'

const route = useRoute()
const tabStore = useTabStore()

watch(() => route.meta, (meta) => {
  // 根据路由meta决定是否显示在标签中
  if (meta.hideInTabs) {
    // 不添加到标签页
    return
  }

  // 正常添加标签页
  tabStore.addTab({
    name: route.name,
    label: meta.title || route.name,
    path: route.path
  })
}, { immediate: true })
</script>
```

## 高级功能

### 标签页拖拽排序

```vue
<template>
  <div class="draggable-tabs">
    <draggable
      v-model="sortedTabs"
      item-key="path"
      @end="onDragEnd"
    >
      <template #item="{ element: tab }">
        <div
          :class="['tab-item', { active: tab.path === current }]"
          @click="changeTab(tab.path)"
        >
          <span>{{ tab.label }}</span>
          <button @click.stop="delTab(tab.path)">×</button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useTabStore } from '@duxweb/dvha-core'

const tabStore = useTabStore()

const sortedTabs = computed({
  get: () => tabStore.tabs,
  set: (value) => {
    // 更新标签页顺序
    tabStore.tabs = value
  }
})

const onDragEnd = () => {
  // 拖拽结束后的处理
  console.log('标签页顺序已更新')
}
</script>
```

### 标签页分组

```vue
<template>
  <div class="grouped-tabs">
    <div
      v-for="group in groupedTabs"
      :key="group.name"
      class="tab-group"
    >
      <div class="group-header">{{ group.label }}</div>
      <div class="group-tabs">
        <div
          v-for="tab in group.tabs"
          :key="tab.path"
          :class="['tab-item', { active: tab.path === current }]"
          @click="changeTab(tab.path)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'

const tabStore = useTabStore()

const groupedTabs = computed(() => {
  const groups = {}

  tabStore.tabs.forEach(tab => {
    const groupName = tab.meta?.group || 'default'
    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        label: tab.meta?.groupLabel || '默认',
        tabs: []
      }
    }
    groups[groupName].tabs.push(tab)
  })

  return Object.values(groups)
})
</script>
```

### 标签页持久化

```js
// 标签页状态持久化
import { useTabStore } from '@duxweb/dvha-core'

const tabStore = useTabStore()

// 保存标签页状态
const saveTabsState = () => {
  const state = {
    tabs: tabStore.tabs,
    current: tabStore.current
  }
  localStorage.setItem('tabs-state', JSON.stringify(state))
}

// 恢复标签页状态
const restoreTabsState = () => {
  const saved = localStorage.getItem('tabs-state')
  if (saved) {
    const state = JSON.parse(saved)
    state.tabs.forEach(tab => {
      tabStore.addTab(tab)
    })
    if (state.current) {
      tabStore.changeTab(state.current)
    }
  }
}

// 监听标签页变化并保存
tabStore.$subscribe(() => {
  saveTabsState()
})
```

## 性能优化

### 组件缓存策略

```vue
<script>
// 在 DuxTabRouterView 中实现的缓存策略
export default {
  name: 'DuxTabRouterView',
  setup() {
    const cacheMap = new Map()
    const maxCacheSize = 10 // 最大缓存数量

    const wrap = (name, component) => {
      // 缓存大小控制
      if (cacheMap.size >= maxCacheSize) {
        const firstKey = cacheMap.keys().next().value
        cacheMap.delete(firstKey)
      }

      let cache = cacheMap.get(name)
      if (!cache) {
        cache = {
          name,
          render() { return component }
        }
        cacheMap.set(name, cache)
      }

      return cache
    }

    return { wrap }
  }
}
</script>
```

### 内存清理

```js
// 自动清理不再使用的标签页缓存
tabStore.$subscribe((mutation, state) => {
  const activePaths = new Set(state.tabs.map(t => t.path))

  // 清理已关闭标签页的缓存
  cacheMap.forEach((cache, path) => {
    if (!activePaths.has(path)) {
      cacheMap.delete(path)
    }
  })
})
```

## 最佳实践

1. **合理设置缓存**: 不要缓存太多标签页，影响性能
2. **锁定重要标签**: 首页等重要页面应该锁定
3. **清晰的标签标题**: 确保标签标题简洁明了
4. **响应式设计**: 在移动端提供适合的标签页体验
5. **状态持久化**: 合理保存用户的标签页状态
6. **性能监控**: 监控标签页的内存使用情况

## 注意事项

- **内存管理**: 及时清理不需要的组件缓存
- **用户体验**: 避免标签页过多导致界面混乱
- **数据一致性**: 注意标签页间数据状态的同步
- **权限控制**: 确保用户只能访问有权限的标签页
- **错误处理**: 处理标签页加载失败的情况
- **兼容性**: 考虑不同浏览器的兼容性问题