# 标签页方法 (useTabs)

`useTabs` 是基于 `useTabStore` 封装的便捷 Hook，提供了完整的标签页状态管理功能。

## 功能特点

- 📑 **标签管理** - 添加、删除、切换标签页
- 💾 **状态同步** - 自动同步路由和标签页状态
- 🔒 **标签锁定** - 支持锁定重要标签防止关闭
- 🎯 **智能导航** - 提供便捷的标签页导航方法
- 🔄 **批量操作** - 支持批量关闭标签页操作
- 📊 **状态查询** - 提供丰富的标签页状态查询

## 基础用法

### 获取标签页 Hook

```js
import { useTabStore } from '@duxweb/dvha-core'

// 获取当前管理端的标签页Store
const tabStore = useTabStore()

// 或者指定管理端名称
const adminTabStore = useTabStore('admin')
```

### Hook 返回值

```js
const {
  // 状态数据
  current,     // 当前激活的标签页路径
  tabs,        // 所有标签页数组

  // 查询方法
  isTab,       // 检查是否为标签页

  // 操作方法
  addTab,      // 添加标签页
  delTab,      // 删除标签页
  changeTab,   // 切换标签页
  lockTab,     // 锁定/解锁标签页

  // 批量操作
  delOther,    // 关闭其他标签页
  delLeft,     // 关闭左侧标签页
  delRight,    // 关闭右侧标签页
  clearTab,    // 清除所有标签页
} = useTabStore()
```

## 标签页操作

### 添加标签页

```js
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

const tabStore = useTabStore()
const router = useRouter()

// 基础添加
const addNewTab = () => {
  tabStore.addTab({
    name: 'users',
    label: '用户管理',
    path: '/admin/users'
  })
}

// 添加并导航
const addAndNavigate = () => {
  tabStore.addTab({
    name: 'dashboard',
    label: '仪表盘',
    path: '/admin/dashboard'
  }, (tab) => {
    // 添加成功后的回调
    router.push(tab.path)
  })
}

// 添加带元数据的标签
const addTabWithMeta = () => {
  tabStore.addTab({
    name: 'important',
    label: '重要页面',
    path: '/admin/important',
    meta: {
      lock: true,        // 锁定标签
      icon: 'star',      // 图标
      closable: false    // 不可关闭
    }
  })
}
```

### 删除标签页

```js
// 删除指定标签页
const deleteTab = (path) => {
  tabStore.delTab(path, (nextTab) => {
    // 删除后的回调，自动导航到下一个标签
    if (nextTab) {
      router.push(nextTab.path)
    }
  })
}

// 删除当前标签页
const deleteCurrentTab = () => {
  if (tabStore.current) {
    tabStore.delTab(tabStore.current, (nextTab) => {
      router.push(nextTab.path)
    })
  }
}

// 带确认的删除
const deleteTabWithConfirm = (path) => {
  if (confirm('确定要关闭此标签页吗？')) {
    tabStore.delTab(path)
  }
}
```

### 切换标签页

```js
// 切换到指定标签页
const switchTab = (path) => {
  tabStore.changeTab(path, (tab) => {
    // 切换成功后的回调
    router.push(tab.path)
    console.log('已切换到:', tab.label)
  })
}

// 切换到下一个标签页
const switchToNext = () => {
  const currentIndex = tabStore.tabs.findIndex(
    tab => tab.path === tabStore.current
  )
  const nextIndex = (currentIndex + 1) % tabStore.tabs.length
  const nextTab = tabStore.tabs[nextIndex]

  if (nextTab) {
    switchTab(nextTab.path)
  }
}

// 切换到上一个标签页
const switchToPrev = () => {
  const currentIndex = tabStore.tabs.findIndex(
    tab => tab.path === tabStore.current
  )
  const prevIndex = currentIndex === 0
    ? tabStore.tabs.length - 1
    : currentIndex - 1
  const prevTab = tabStore.tabs[prevIndex]

  if (prevTab) {
    switchTab(prevTab.path)
  }
}
```

### 锁定标签页

```js
// 锁定/解锁标签页
const toggleLock = (path) => {
  tabStore.lockTab(path)
  console.log('标签页锁定状态已切换')
}

// 检查标签页是否锁定
const isTabLocked = (path) => {
  const tab = tabStore.tabs.find(t => t.path === path)
  return tab?.meta?.lock || false
}

// 锁定所有标签页
const lockAllTabs = () => {
  tabStore.tabs.forEach(tab => {
    if (!tab.meta?.lock) {
      tabStore.lockTab(tab.path)
    }
  })
}
```

## 批量操作

### 关闭其他标签页

```js
// 关闭除指定标签外的所有标签页
const closeOtherTabs = (keepPath) => {
  tabStore.delOther(keepPath, () => {
    console.log('已关闭其他标签页')
    router.push(keepPath)
  })
}

// 关闭除当前标签外的所有标签页
const closeOtherCurrentTabs = () => {
  if (tabStore.current) {
    closeOtherTabs(tabStore.current)
  }
}
```

### 关闭左侧/右侧标签页

```js
// 关闭左侧标签页
const closeLeftTabs = (path) => {
  tabStore.delLeft(path, () => {
    console.log('已关闭左侧标签页')
  })
}

// 关闭右侧标签页
const closeRightTabs = (path) => {
  tabStore.delRight(path, () => {
    console.log('已关闭右侧标签页')
  })
}

// 关闭当前标签页左侧的所有标签页
const closeCurrentLeftTabs = () => {
  if (tabStore.current) {
    closeLeftTabs(tabStore.current)
  }
}
```

### 清除所有标签页

```js
// 清除所有标签页
const clearAllTabs = () => {
  if (confirm('确定要关闭所有标签页吗？')) {
    tabStore.clearTab()
    // 导航到首页
    router.push('/admin')
  }
}

// 清除除锁定标签外的所有标签页
const clearUnlockedTabs = () => {
  const lockedTabs = tabStore.tabs.filter(tab => tab.meta?.lock)
  tabStore.clearTab()

  // 重新添加锁定的标签页
  lockedTabs.forEach(tab => {
    tabStore.addTab(tab)
  })
}
```

## 状态查询

### 检查标签页状态

```js
// 检查路径是否为标签页
const checkIsTab = (path) => {
  return tabStore.isTab(path)
}

// 获取标签页数量
const getTabCount = () => {
  return tabStore.tabs.length
}

// 获取当前标签页信息
const getCurrentTab = () => {
  return tabStore.tabs.find(tab => tab.path === tabStore.current)
}

// 获取指定标签页信息
const getTabByPath = (path) => {
  return tabStore.tabs.find(tab => tab.path === path)
}

// 检查是否有未保存的标签页
const hasUnsavedTabs = () => {
  return tabStore.tabs.some(tab => tab.meta?.unsaved)
}
```

### 标签页过滤和排序

```js
import { computed } from 'vue'

// 获取可见的标签页
const visibleTabs = computed(() => {
  return tabStore.tabs.filter(tab => !tab.meta?.hidden)
})

// 获取锁定的标签页
const lockedTabs = computed(() => {
  return tabStore.tabs.filter(tab => tab.meta?.lock)
})

// 获取可关闭的标签页
const closableTabs = computed(() => {
  return tabStore.tabs.filter(tab => !tab.meta?.lock)
})

// 按重要性排序的标签页
const sortedTabs = computed(() => {
  return [...tabStore.tabs].sort((a, b) => {
    // 锁定的标签页优先
    if (a.meta?.lock && !b.meta?.lock) return -1
    if (!a.meta?.lock && b.meta?.lock) return 1

    // 按添加时间排序
    return (a.meta?.addTime || 0) - (b.meta?.addTime || 0)
  })
})
```

## 实际应用示例

### 标签页组件

```vue
<template>
  <div class="tabs-container">
    <!-- 标签栏 -->
    <div class="tabs-bar">
      <div
        v-for="tab in visibleTabs"
        :key="tab.path"
        :class="getTabClass(tab)"
        @click="switchToTab(tab.path)"
        @contextmenu.prevent="showContextMenu($event, tab)"
      >
        <!-- 标签图标 -->
        <i v-if="tab.meta?.icon" :class="tab.meta.icon"></i>

        <!-- 标签标题 -->
        <span class="tab-title">{{ tab.label }}</span>

        <!-- 未保存标识 -->
        <span v-if="tab.meta?.unsaved" class="unsaved-dot">●</span>

        <!-- 锁定图标 -->
        <i v-if="tab.meta?.lock" class="lock-icon">🔒</i>

        <!-- 关闭按钮 -->
        <button
          v-else-if="tab.meta?.closable !== false"
          class="close-btn"
          @click.stop="closeTab(tab.path)"
        >×</button>
      </div>

      <!-- 添加按钮 -->
      <button class="add-tab-btn" @click="showAddTabDialog">+</button>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

const tabStore = useTabStore()
const router = useRouter()

// 可见标签页
const visibleTabs = computed(() => {
  return tabStore.tabs.filter(tab => !tab.meta?.hidden)
})

// 获取标签页样式类
const getTabClass = (tab) => {
  return [
    'tab-item',
    {
      'active': tab.path === tabStore.current,
      'locked': tab.meta?.lock,
      'unsaved': tab.meta?.unsaved
    }
  ]
}

// 切换标签页
const switchToTab = (path) => {
  tabStore.changeTab(path, (tab) => {
    router.push(tab.path)
  })
}

// 关闭标签页
const closeTab = (path) => {
  const tab = tabStore.tabs.find(t => t.path === path)

  // 检查是否有未保存的内容
  if (tab?.meta?.unsaved) {
    if (!confirm('标签页有未保存的内容，确定要关闭吗？')) {
      return
    }
  }

  tabStore.delTab(path, (nextTab) => {
    if (nextTab) {
      router.push(nextTab.path)
    }
  })
}
</script>
```

### 标签页导航组件

```vue
<template>
  <div class="tab-navigation">
    <!-- 标签页控制按钮 -->
    <div class="tab-controls">
      <button @click="refreshCurrentTab" title="刷新">
        🔄
      </button>
      <button @click="closeCurrentTab" title="关闭当前">
        ×
      </button>
      <button @click="closeOthers" title="关闭其他">
        ⋯
      </button>
      <button @click="closeAll" title="关闭所有">
        🗙
      </button>
    </div>

    <!-- 标签页列表 -->
    <div class="tab-list">
      <select v-model="currentPath" @change="switchTab">
        <option
          v-for="tab in tabStore.tabs"
          :key="tab.path"
          :value="tab.path"
        >
          {{ tab.label }}
          {{ tab.meta?.lock ? '🔒' : '' }}
          {{ tab.meta?.unsaved ? '●' : '' }}
        </option>
      </select>
    </div>

    <!-- 标签页统计 -->
    <div class="tab-stats">
      总计: {{ tabStore.tabs.length }} 个标签页
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

const tabStore = useTabStore()
const router = useRouter()

const currentPath = computed({
  get: () => tabStore.current,
  set: (value) => switchTab(value)
})

// 刷新当前标签页
const refreshCurrentTab = () => {
  router.go(0)
}

// 关闭当前标签页
const closeCurrentTab = () => {
  if (tabStore.current) {
    tabStore.delTab(tabStore.current, (nextTab) => {
      if (nextTab) {
        router.push(nextTab.path)
      }
    })
  }
}

// 关闭其他标签页
const closeOthers = () => {
  if (tabStore.current) {
    tabStore.delOther(tabStore.current)
  }
}

// 关闭所有标签页
const closeAll = () => {
  if (confirm('确定要关闭所有标签页吗？')) {
    tabStore.clearTab()
    router.push('/admin')
  }
}

// 切换标签页
const switchTab = (path) => {
  tabStore.changeTab(path, (tab) => {
    router.push(tab.path)
  })
}
</script>
```

### 标签页持久化

```js
// composables/useTabPersistence.js
import { watch } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'

export function useTabPersistence(manageName) {
  const tabStore = useTabStore(manageName)
  const storageKey = `tabs-${manageName}`

  // 保存标签页状态
  const saveState = () => {
    const state = {
      tabs: tabStore.tabs.map(tab => ({
        ...tab,
        // 移除不需要持久化的字段
        component: undefined
      })),
      current: tabStore.current,
      timestamp: Date.now()
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch (error) {
      console.warn('保存标签页状态失败:', error)
    }
  }

  // 恢复标签页状态
  const restoreState = () => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return

      const state = JSON.parse(saved)

      // 检查状态是否过期（24小时）
      if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(storageKey)
        return
      }

      // 恢复标签页
      state.tabs.forEach(tab => {
        tabStore.addTab(tab)
      })

      // 恢复当前标签页
      if (state.current) {
        tabStore.changeTab(state.current)
      }

    } catch (error) {
      console.warn('恢复标签页状态失败:', error)
      localStorage.removeItem(storageKey)
    }
  }

  // 监听状态变化并保存
  watch([
    () => tabStore.tabs,
    () => tabStore.current
  ], saveState, { deep: true })

  // 清除状态
  const clearState = () => {
    localStorage.removeItem(storageKey)
  }

  return {
    saveState,
    restoreState,
    clearState
  }
}
```

## 键盘快捷键

```js
// composables/useTabShortcuts.js
import { onMounted, onUnmounted } from 'vue'
import { useTabStore } from '@duxweb/dvha-core'
import { useRouter } from 'vue-router'

export function useTabShortcuts() {
  const tabStore = useTabStore()
  const router = useRouter()

  const handleKeydown = (event) => {
    // Ctrl/Cmd + W: 关闭当前标签页
    if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
      event.preventDefault()
      if (tabStore.current) {
        tabStore.delTab(tabStore.current, (nextTab) => {
          if (nextTab) {
            router.push(nextTab.path)
          }
        })
      }
    }

    // Ctrl/Cmd + Tab: 切换到下一个标签页
    if ((event.ctrlKey || event.metaKey) && event.key === 'Tab') {
      event.preventDefault()
      const currentIndex = tabStore.tabs.findIndex(
        tab => tab.path === tabStore.current
      )
      const nextIndex = (currentIndex + 1) % tabStore.tabs.length
      const nextTab = tabStore.tabs[nextIndex]

      if (nextTab) {
        tabStore.changeTab(nextTab.path, (tab) => {
          router.push(tab.path)
        })
      }
    }

    // Ctrl/Cmd + Shift + Tab: 切换到上一个标签页
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Tab') {
      event.preventDefault()
      const currentIndex = tabStore.tabs.findIndex(
        tab => tab.path === tabStore.current
      )
      const prevIndex = currentIndex === 0
        ? tabStore.tabs.length - 1
        : currentIndex - 1
      const prevTab = tabStore.tabs[prevIndex]

      if (prevTab) {
        tabStore.changeTab(prevTab.path, (tab) => {
          router.push(tab.path)
        })
      }
    }

    // Ctrl/Cmd + 数字键: 切换到指定位置的标签页
    if ((event.ctrlKey || event.metaKey) && /^[1-9]$/.test(event.key)) {
      event.preventDefault()
      const index = parseInt(event.key) - 1
      const tab = tabStore.tabs[index]

      if (tab) {
        tabStore.changeTab(tab.path, (tab) => {
          router.push(tab.path)
        })
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
```

## 最佳实践

1. **合理使用锁定**: 重要页面如首页应该锁定
2. **状态持久化**: 适当保存用户的标签页状态
3. **性能优化**: 限制最大标签页数量，及时清理缓存
4. **用户体验**: 提供键盘快捷键和右键菜单
5. **错误处理**: 处理标签页加载失败的情况
6. **内存管理**: 监控标签页的内存使用情况

## 注意事项

- **管理端隔离**: 不同管理端的标签页是完全隔离的
- **路由同步**: 确保标签页状态与路由状态同步
- **权限控制**: 检查用户是否有权限访问标签页
- **数据一致性**: 注意标签页间数据状态的同步
- **兼容性**: 考虑不同浏览器的localStorage支持
- **清理机制**: 定期清理过期的标签页状态