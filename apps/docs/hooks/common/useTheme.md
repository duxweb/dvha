# useTheme

`useTheme` hook 用于管理应用的主题系统，支持亮色/暗色主题切换。

## 功能特点

- 🌓 **主题切换** - 支持亮色、暗色和自动模式
- 🔄 **循环切换** - 一键循环切换主题模式
- 🎨 **动态资源** - 根据主题自动切换Logo、Banner等资源
- 💾 **状态持久** - 主题选择自动保存到本地存储
- 🖥️ **系统感知** - 自动模式跟随系统主题设置
- 📱 **响应式** - 主题状态实时响应变化

## 接口关系

该hook不直接调用外部接口，而是基于 VueUse 的 useColorMode 和管理端配置。

```js
// 主题配置接口
interface ITheme {
  logo?: string
  darkLogo?: string
  banner?: string
  darkBanner?: string
  primaryColor?: string
}

// 主题模式类型
type ColorMode = 'light' | 'dark' | 'auto'
```

## 使用方法

```js
import { useTheme } from '@duxweb/dvha-core'

const { toggle, mode, isDark, theme } = useTheme()

// 带配置选项
const themeConfig = useTheme({
  selector: 'html',
  attribute: 'data-theme',
  storageKey: 'theme-mode'
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `options` | `UseColorModeOptions` | ❌ | VueUse colorMode 配置选项 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `toggle` | `Function` | 切换主题模式的方法 |
| `mode` | `Ref<ColorMode>` | 当前主题模式 |
| `isDark` | `Ref<boolean>` | 是否为暗色主题 |
| `theme` | `Ref<ITheme>` | 当前主题资源配置 |

## 基本使用

```js
import { useTheme } from '@duxweb/dvha-core'

const { toggle, mode, isDark, theme } = useTheme()

console.log('主题状态:', {
  当前模式: mode.value,        // 'light' | 'dark' | 'auto'
  是否暗色: isDark.value,      // true | false
  当前资源: theme.value        // 当前主题的资源配置
})

// 切换主题
toggle() // light -> dark -> auto -> light
```

## 主题资源获取

```js
import { useTheme } from '@duxweb/dvha-core'

const { theme, isDark } = useTheme()

// 获取当前主题资源
console.log('当前主题资源:', {
  logo: theme.value.logo,           // 当前Logo
  banner: theme.value.banner,       // 当前Banner
  isDark: isDark.value              // 当前是否为暗色主题
})

// 在暗色主题下，theme.value 会自动切换到 darkLogo 和 darkBanner
```

## 主题模式检测

```js
import { useTheme } from '@duxweb/dvha-core'
import { watch } from 'vue'

const { mode, isDark } = useTheme()

// 监听主题变化
watch(mode, (newMode) => {
  console.log('主题模式变化:', newMode)
  switch (newMode) {
    case 'light':
      console.log('切换到亮色主题')
      break
    case 'dark':
      console.log('切换到暗色主题')
      break
    case 'auto':
      console.log('切换到自动模式')
      break
  }
})

// 监听暗色状态变化
watch(isDark, (newIsDark) => {
  console.log('暗色状态:', newIsDark ? '暗色' : '亮色')
  // 可以在这里执行主题相关的副作用
  document.documentElement.style.setProperty(
    '--primary-color',
    newIsDark ? '#1f2937' : '#3b82f6'
  )
})
```

## 完整示例 - 主题切换组件

```vue
<template>
  <div class="theme-switcher">
    <button
      @click="toggle"
      class="theme-button"
      :class="{ dark: isDark }"
    >
      <Icon :name="themeIcon" />
      <span>{{ themeName }}</span>
    </button>

    <!-- 主题状态显示 -->
    <div class="theme-status">
      <p>当前模式: {{ mode }}</p>
      <p>实际显示: {{ isDark ? '暗色' : '亮色' }}</p>
    </div>

    <!-- 动态Logo -->
    <div class="logo-container">
      <img
        v-if="theme.logo"
        :src="theme.logo"
        alt="Logo"
        class="logo"
      />
    </div>

    <!-- 动态Banner -->
    <div class="banner-container" v-if="theme.banner">
      <img
        :src="theme.banner"
        alt="Banner"
        class="banner"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@duxweb/dvha-core'

const { toggle, mode, isDark, theme } = useTheme()

// 主题图标
const themeIcon = computed(() => {
  switch (mode.value) {
    case 'light': return 'sun'
    case 'dark': return 'moon'
    case 'auto': return 'computer'
    default: return 'sun'
  }
})

// 主题名称
const themeName = computed(() => {
  switch (mode.value) {
    case 'light': return '亮色主题'
    case 'dark': return '暗色主题'
    case 'auto': return '自动主题'
    default: return '未知主题'
  }
})
</script>

<style scoped>
.theme-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-button.dark {
  border-color: #374151;
  background: #1f2937;
  color: #f9fafb;
}

.theme-button:hover {
  opacity: 0.8;
}

.logo, .banner {
  max-width: 200px;
  height: auto;
}
</style>
```

## 自定义配置示例

```js
import { useTheme } from '@duxweb/dvha-core'

// 自定义主题配置
const { toggle, mode, isDark, theme } = useTheme({
  selector: 'html',                    // CSS选择器
  attribute: 'data-theme',             // HTML属性名
  storageKey: 'app-theme-mode',        // 本地存储键名
  valueDark: 'dark',                   // 暗色主题值
  valueLight: 'light',                 // 亮色主题值
  modes: ['light', 'dark', 'auto'],    // 可用模式
  onChanged: (mode) => {               // 变化回调
    console.log('主题变化到:', mode)
  }
})
```

## CSS 集成示例

```css
/* 基于 data-theme 属性的样式 */
html[data-theme="light"] {
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
}

html[data-theme="dark"] {
  --bg-color: #1f2937;
  --text-color: #f9fafb;
  --border-color: #374151;
}

/* 组件样式 */
.app-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  border-color: var(--border-color);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

/* 响应系统主题偏好 */
@media (prefers-color-scheme: dark) {
  html:not([data-theme]) {
    --bg-color: #1f2937;
    --text-color: #f9fafb;
    --border-color: #374151;
  }
}
```

## 主题资源配置

```js
// 在应用配置中设置主题资源
const config = {
  theme: {
    logo: '/images/logo-light.png',
    darkLogo: '/images/logo-dark.png',
    banner: '/images/banner-light.jpg',
    darkBanner: '/images/banner-dark.jpg',
    primaryColor: '#3b82f6'
  }
}

// 使用主题资源
const { theme, isDark } = useTheme()

// theme.value 会根据当前主题自动选择对应的资源
```

## 条件渲染示例

```vue
<template>
  <div class="theme-aware-component">
    <!-- 根据主题模式显示不同内容 -->
    <div v-if="mode === 'auto'" class="auto-mode-tip">
      当前跟随系统主题设置
    </div>

    <!-- 根据实际主题状态显示不同样式 -->
    <div class="content" :class="{ 'dark-content': isDark }">
      <h1>{{ isDark ? '暗色主题内容' : '亮色主题内容' }}</h1>
    </div>

    <!-- 主题相关的图标 -->
    <Icon
      :name="isDark ? 'moon' : 'sun'"
      :class="isDark ? 'text-blue-300' : 'text-yellow-500'"
    />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@duxweb/dvha-core'

const { mode, isDark } = useTheme()
</script>
```

## 工作流程

1. **初始化**: 从本地存储或系统设置获取初始主题模式
2. **配置合并**: 合并用户配置和默认配置
3. **状态计算**: 根据模式和系统偏好计算实际主题状态
4. **资源切换**: 根据主题状态自动切换Logo、Banner等资源
5. **DOM更新**: 更新HTML属性，触发CSS主题切换
6. **状态持久**: 将主题选择保存到本地存储

## 注意事项

- 主题资源需要在管理端配置中正确设置
- 自动模式会跟随系统的暗色/亮色偏好设置
- 主题状态会自动保存到本地存储，页面刷新后保持
- 可以通过CSS变量和HTML属性实现完整的主题切换
- isDark 计算考虑了自动模式下的系统偏好
- 支持自定义主题模式和切换逻辑