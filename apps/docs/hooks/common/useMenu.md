# useMenu

`useMenu` hook 用于管理应用的菜单系统，支持单级和双级菜单结构。

## 功能特点

- 📋 **菜单管理** - 获取和管理应用菜单数据
- 🎯 **双级菜单** - 支持单级和双级菜单模式
- 🌳 **树形结构** - 自动构建菜单层级关系
- 🔍 **面包屑导航** - 自动生成面包屑路径
- 📱 **响应式状态** - 菜单状态实时更新
- 🚀 **路由集成** - 与 Vue Router 完美集成
- 🎨 **可见性控制** - 支持菜单项显示/隐藏

## 接口关系

该hook不直接调用外部接口，而是从路由配置和路由存储中获取菜单数据。

```js
// 菜单项接口
interface IMenu {
  name: string
  title?: string
  icon?: string
  path?: string
  parent?: string
  hidden?: boolean
  sort?: number
  children?: IMenu[]
}
```

## 使用方法

```js
import { useMenu } from '@duxweb/dvha-core'

// 单级菜单模式
const {
  data,
  mainMenu,
  subMenu,
  crumbs,
  active
} = useMenu()

// 双级菜单模式
const menuData = useMenu({ doubleMenu: true })
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `doubleMenu` | `boolean` | ❌ | 是否启用双级菜单模式，默认 `false` |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<IMenu[]>` | 完整的菜单树数据（仅可见项） |
| `originalData` | `Ref<IMenu[]>` | 原始菜单树数据（包含隐藏项） |
| `getMenu` | `Function` | 获取菜单的方法 |
| `mainMenu` | `Ref<IMenu[]>` | 主菜单数据 |
| `subMenu` | `Ref<IMenu[]>` | 子菜单数据 |
| `isSubMenu` | `Ref<boolean>` | 是否显示子菜单 |
| `crumbs` | `Ref<IMenu[]>` | 面包屑路径 |
| `active` | `Ref<string>` | 当前激活的菜单项 |
| `appActive` | `Ref<string>` | 当前激活的主菜单项 |
| `subActive` | `Ref<string>` | 当前激活的子菜单项 |

## 单级菜单示例

```js
import { useMenu } from '@duxweb/dvha-core'

const {
  mainMenu,      // 主菜单（不包含子级）
  subMenu,       // 当前主菜单的子菜单
  active,        // 当前激活菜单
  appActive,     // 当前激活主菜单
  subActive      // 当前激活子菜单
} = useMenu()

console.log('菜单状态:', {
  当前主菜单: appActive.value,
  当前子菜单: subActive.value,
  当前激活: active.value
})
```

## 双级菜单示例

```js
import { useMenu } from '@duxweb/dvha-core'

const {
  data,          // 完整菜单树
  mainMenu,      // 在双级模式下就是完整菜单树
  active,        // 当前激活菜单
  appActive,     // 主应用激活项
  subActive      // 子菜单激活项
} = useMenu({ doubleMenu: true })

console.log('双级菜单:', {
  完整菜单: data.value,
  当前激活: active.value
})
```

## 面包屑导航

```js
import { useMenu } from '@duxweb/dvha-core'

const { crumbs } = useMenu()

// 面包屑数据
console.log('面包屑路径:', crumbs.value)

// 面包屑通常是从根到当前页面的路径
// 例如: [{ name: 'dashboard', title: '仪表板' }, { name: 'users', title: '用户管理' }]
```

## 菜单过滤

```js
import { useMenu } from '@duxweb/dvha-core'

const { getMenu } = useMenu()

// 获取所有菜单（包含隐藏项）
const allMenus = getMenu(false)

// 获取可见菜单（默认行为）
const visibleMenus = getMenu(true)

console.log('菜单对比:', {
  全部菜单数量: allMenus.length,
  可见菜单数量: visibleMenus.length
})
```

## 菜单状态监控

```js
import { useMenu } from '@duxweb/dvha-core'
import { watch } from 'vue'

const { active, appActive, subActive } = useMenu()

// 监控菜单激活状态变化
watch([active, appActive, subActive], ([newActive, newApp, newSub]) => {
  console.log('菜单状态变化:', {
    激活菜单: newActive,
    主菜单: newApp,
    子菜单: newSub
  })
})
```

## 完整示例 - 单级菜单

```vue
<template>
  <div class="menu-layout">
    <!-- 主菜单 -->
    <nav class="main-nav">
      <ul>
        <li
          v-for="item in mainMenu"
          :key="item.name"
          :class="{ active: appActive === item.name }"
        >
          <router-link :to="item.path">
            <i :class="item.icon"></i>
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 子菜单 -->
    <nav class="sub-nav" v-if="isSubMenu && subMenu.length > 0">
      <ul>
        <li
          v-for="item in subMenu"
          :key="item.name"
          :class="{ active: subActive === item.name }"
        >
          <router-link :to="item.path">
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span v-for="(crumb, index) in crumbs" :key="crumb.name">
        <router-link v-if="index < crumbs.length - 1" :to="crumb.path">
          {{ crumb.title }}
        </router-link>
        <span v-else>{{ crumb.title }}</span>
        <span v-if="index < crumbs.length - 1"> / </span>
      </span>
    </div>

    <!-- 内容区域 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '@duxweb/dvha-core'

const {
  mainMenu,
  subMenu,
  isSubMenu,
  crumbs,
  active,
  appActive,
  subActive
} = useMenu()
</script>
```

## 完整示例 - 双级菜单

```vue
<template>
  <div class="double-menu-layout">
    <!-- 主菜单 -->
    <nav class="main-nav">
      <div
        v-for="item in mainMenu"
        :key="item.name"
        class="menu-group"
      >
        <h3>{{ item.title }}</h3>
        <ul v-if="item.children">
          <li
            v-for="child in item.children"
            :key="child.name"
            :class="{ active: active === child.name }"
          >
            <router-link :to="child.path">
              <i :class="child.icon"></i>
              {{ child.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span v-for="(crumb, index) in crumbs" :key="crumb.name">
        <router-link v-if="index < crumbs.length - 1" :to="crumb.path">
          {{ crumb.title }}
        </router-link>
        <span v-else>{{ crumb.title }}</span>
        <span v-if="index < crumbs.length - 1"> / </span>
      </span>
    </div>

    <!-- 内容区域 -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useMenu } from '@duxweb/dvha-core'

const {
  mainMenu,
  crumbs,
  active
} = useMenu({ doubleMenu: true })
</script>
```

## 动态菜单示例

```js
import { useMenu } from '@duxweb/dvha-core'
import { computed } from 'vue'

const { data, getMenu } = useMenu()

// 根据权限过滤菜单
const filteredMenu = computed(() => {
  return data.value.filter(item => {
    // 这里可以添加权限检查逻辑
    return hasPermission(item.name)
  })
})

// 搜索菜单
const searchMenu = (keyword: string) => {
  const allMenus = getMenu(false)
  return allMenus.filter(item =>
    item.title?.toLowerCase().includes(keyword.toLowerCase())
  )
}
```

## 工作流程

1. **获取路由**: 从路由存储中获取路由配置
2. **构建树形**: 使用 arrayToTree 构建菜单层级结构
3. **过滤可见**: 根据 hidden 属性过滤菜单项
4. **路由监听**: 监听路由变化更新激活状态
5. **状态计算**: 计算主菜单、子菜单和面包屑
6. **模式适配**: 根据 doubleMenu 参数调整菜单结构

## 注意事项

- 菜单数据来源于路由配置，需要在路由中正确配置菜单信息
- 双级菜单模式下，mainMenu 包含完整的菜单树结构
- 单级菜单模式下，mainMenu 只包含顶级菜单，子菜单通过 subMenu 获取
- 面包屑自动根据当前路由和菜单结构生成
- 菜单的显示/隐藏由 hidden 属性控制
- 菜单排序由 sort 属性控制