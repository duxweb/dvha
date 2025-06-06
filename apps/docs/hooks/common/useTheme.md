# useTheme

`useTheme` 是一个强大的主题管理系统，专为简化现代应用的主题开发而设计。它自动处理明暗主题切换、生成完整的CSS变量系统，并提供灵活的色彩自定义能力。

## 功能特点

- 🌓 **主题切换** - 支持亮色、暗色和自动模式循环切换
- 🎨 **色彩管理** - 内置丰富的色彩预设（Tailwind调色板），支持自定义色彩映射
- 🎯 **场景颜色** - 自动生成 hover、pressed、focus、disabled 等交互状态颜色
- 📝 **语义颜色** - 预设的文本、背景、边框语义颜色，自动适配明暗主题
- 🔧 **CSS变量** - 自动生成和管理完整的CSS变量系统
- 💾 **状态持久** - 主题和颜色配置自动保存到本地存储
- 🖥️ **系统感知** - 自动模式跟随系统主题设置
- 🎪 **动态资源** - 根据主题自动切换Logo、Banner等资源
- 🛠️ **工具链集成** - 与UnoCSS、Tailwind CSS无缝集成

## 使用方法

```js
import { useTheme } from '@duxweb/dvha-core'

const {
  toggle,
  mode,
  isDark,
  resources,
  colors,
  cssInit,
  setColor,
  setColors,
  getSceneColor,
  getShadeColor,
  getSemanticColor
} = useTheme()
```

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `toggle` | `Function` | 循环切换主题模式 (light → dark → auto) |
| `mode` | `Ref<ColorMode>` | 当前主题模式 |
| `isDark` | `Ref<boolean>` | 是否为暗色主题 |
| `resources` | `Ref<ITheme>` | 当前主题资源配置（logo、banner等） |
| `config` | `Readonly<ThemeConfig>` | 只读的主题配置 |
| `colorMapping` | `Readonly<Ref>` | 只读的颜色映射关系 |
| `colors` | `Ref<string[]>` | 所有可用的颜色名称列表 |
| `colorShades` | `string[]` | 颜色色阶列表 ['50', '100', ..., '950'] |
| `colorTypes` | `string[]` | 颜色类型列表 ['primary', 'info', 'success', 'warning', 'error', 'gray'] |
| `colorScenes` | `string[]` | 场景类型列表 ['default', 'hover', 'pressed', 'focus', 'disabled'] |
| `cssInit` | `Function` | 初始化CSS变量系统 |
| `cssReset` | `Function` | 重置为默认颜色配置 |
| `setColor` | `Function` | 设置单个颜色映射 |
| `setColors` | `Function` | 设置多个颜色映射 |
| `getSceneColor` | `Function` | 获取场景颜色值 |
| `getShadeColor` | `Function` | 获取色阶颜色值 |
| `getSemanticColor` | `Function` | 获取语义颜色值 |

## 基本使用

```vue
<template>
  <div>
    <!-- 主题切换 -->
    <button @click="toggle">
      {{ mode === 'light' ? '☀️ 亮色' : mode === 'dark' ? '🌙 暗色' : '🔄 自动' }}
    </button>

    <!-- 色彩切换 -->
    <button @click="setColor('primary', 'red')">切换为红色主题</button>

    <!-- 使用CSS变量的按钮 -->
    <button class="primary-btn">主题按钮</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from '@duxweb/dvha-core'

const { toggle, mode, cssInit, setColor } = useTheme()

// 应用启动时初始化CSS变量
onMounted(() => {
  cssInit()
})
</script>

<style scoped>
.primary-btn {
  background: var(--ui-color-primary);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.primary-btn:hover {
  background: var(--ui-color-primary-hover);
}
</style>
```

## CSS变量

初始化 css 变量后您可以在css内使用变量调用预设色彩：

```
.card {
  color: var(--ui-text)
}
```

下面是可用的所有变量展示：

```css
/* 基础色阶 - 所有预设颜色的完整色阶 */
--base-color-red-50
--base-color-red-100
--base-color-red-200
...
--base-color-red-950

--base-color-blue-50
--base-color-blue-100
--base-color-blue-200
...
--base-color-blue-950

--base-color-green-50
--base-color-green-100
--base-color-green-200
...
--base-color-green-950

/* 其他颜色: orange, amber, yellow, lime, emerald, teal, cyan, sky, indigo, violet, purple, fuchsia, pink, rose, gray, slate, zinc, neutral, stone
*/

/* 场景颜色变量 - 主色状态 */
--ui-color-primary          /* 主要颜色默认状态 */
--ui-color-primary-hover    /* 主要颜色悬停状态 */
--ui-color-primary-pressed  /* 主要颜色按下状态 */
--ui-color-primary-focus    /* 主要颜色焦点状态 */
--ui-color-primary-disabled /* 主要颜色禁用状态 */

/* ... 其他场景： success warning, error, info, gray 的所有状态 */

/* UI色阶变量 - 主色完整色阶 */
--ui-color-primary-50       /* 主要颜色50色阶 */
--ui-color-primary-100      /* 主要颜色100色阶 */
--ui-color-primary-200      /* 主要颜色200色阶 */
...
--ui-color-primary-950      /* 主要颜色950色阶 */

/* ... 其他颜色: success warning, error, info, gray 的完整色阶 */

/* 语义颜色变量 - 文本 */
--ui-text-dimmed           /* 暗淡文本色 */
--ui-text-muted            /* 弱化文本色 */
--ui-text-toned            /* 调色文本色 */
--ui-text                  /* 基础文本色 */
--ui-text-highlighted      /* 高亮文本色 */
--ui-text-inverted         /* 反转文本色 */

/* 语义颜色变量 - 背景 */
--ui-bg                    /* 基础背景色 */
--ui-bg-muted             /* 弱化背景色 */
--ui-bg-elevated          /* 提升背景色 */
--ui-bg-accented          /* 强调背景色 */
--ui-bg-inverted          /* 反转背景色 */

/* 语义颜色变量 - 边框 */
--ui-border               /* 基础边框色 */
--ui-border-muted         /* 弱化边框色 */
--ui-border-accented      /* 强调边框色 */
--ui-border-inverted      /* 反转边框色 */

/* 基础颜色 */
--color-white             /* 白色 */
--color-black             /* 黑色 */
```


## 色彩架构

系统会自动生成完整的CSS变量系统，采用三层嵌套结构：

### CSS变量嵌套关系

```
基础颜色值 → UI颜色映射 → 语义化颜色
    ↓            ↓           ↓
  固定值      引用基础     引用UI颜色
```

#### 第一层：基础色彩变量（固定值）
```css
/* 所有预设颜色的完整色阶 */
:root {
  --base-color-blue-50: rgb(239, 246, 255);   /* 具体的RGB值 */
  --base-color-blue-500: rgb(59, 130, 246);
  --base-color-blue-900: rgb(30, 58, 138);
  /* ... 所有颜色的所有色阶 */
}
```

#### 第二层：UI色彩变量（智能映射）
```css
/* 根据你的设置自动映射到基础色彩 */
:root {
  --ui-color-primary: var(--base-color-blue-500);        /* 引用基础变量 */
  --ui-color-primary-hover: var(--base-color-blue-600);  /* 悬停状态 */
  --ui-color-primary-pressed: var(--base-color-blue-700);/* 按下状态 */
  --ui-color-primary-focus: var(--base-color-blue-600);  /* 焦点状态 */
  --ui-color-primary-disabled: var(--base-color-blue-400);/* 禁用状态 */
}
```

#### 第三层：语义化变量（主题感知）
```css
/* 根据明暗主题自动调整，引用UI颜色或基础颜色 */
:root {
  --ui-text: var(--base-color-gray-700);      /* 亮色模式：引用基础变量 */
  --ui-bg: var(--color-white);                /* 引用固定颜色 */
  --ui-border: var(--base-color-gray-200);
}

/* 暗色模式自动切换 */
html.dark {
  --ui-text: var(--base-color-gray-300);      /* 暗色模式：切换到不同色阶 */
  --ui-bg: var(--base-color-gray-950);
  --ui-border: var(--base-color-gray-800);
}
```

### 色彩更换操作流程

当你调用 `setColor('primary', 'red')` 时，系统执行以下操作：

```
1. 更新颜色映射
   colorMapping.primary = 'red'

2. 重新生成第二层变量
   --ui-color-primary: var(--base-color-red-500)
   --ui-color-primary-hover: var(--base-color-red-600)
   --ui-color-primary-pressed: var(--base-color-red-700)
   ... 所有primary相关变量

3. 自动更新CSS
   所有使用 var(--ui-color-primary) 的地方立即生效

4. 保存到本地存储
   持久化用户的颜色选择
```

**整个过程是响应式的**：
- 基础色彩值不变（第一层）
- 只更新映射关系（第二层）
- 语义化颜色自动跟随主题模式调整（第三层）

## 颜色配置

基于 `ThemeConfig` 接口，系统内置了默认配置：

```ts
interface ThemeConfig {
  colors: Record<string, Record<string, string>>
  colorTypes: ThemeColorType[]
  colorShades: ThemeColorShade[]
  colorScenes: {
    light: ThemeColorSceneGroupConfig
    dark: ThemeColorSceneGroupConfig
  }
  colorSemantic: {
    light: ThemeColorSemanticConfig
    dark: ThemeColorSemanticConfig
  }
  colorBase?: {
    white: string
    black: string
  }
}
```


### 全局配置覆盖

系统预设了一套通用主题色，您可以使用应用的配置来覆盖预设主题色彩配置：

```js
import { themeColor } from '@duxweb/dvha-core'

// 在应用配置中设置主题配置
const config = {
  theme: {
    // Logo和Banner资源
    logo: '/images/logo.png',
    darkLogo: '/images/logo-dark.png',
    banner: '/images/banner.jpg',
    darkBanner: '/images/banner-dark.jpg',

    // 主题默认配置
    config: {
      // 预设色彩
      colors: themeColor,
      // 色彩类型
      colorTypes: ['primary', 'info', 'success', 'warning', 'error', 'gray'],
      // 色彩色阶
      colorShades: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
      // 色彩场景
      colorScenes: {
        light: {
          default: { default: '500', hover: '600', pressed: '700', focus: '500', disabled: '300' },
        },
        dark: {
          default: { default: '500', hover: '400', pressed: '300', focus: '500', disabled: '600' },
        },
      },
      // 语义颜色
      colorSemantic: {
        light: {
          text: { dimmed: '400', muted: '500', toned: '600', base: '700', highlighted: '900', inverted: 'white' },
          bg: { base: 'white', muted: '50', elevated: '100', accented: '200', inverted: '900' },
          border: { base: '200', muted: '200', accented: '300', inverted: '900' },
        },
        dark: {
          text: { dimmed: '600', muted: '500', toned: '400', base: '300', highlighted: '100', inverted: 'black' },
          bg: { base: '950', muted: '900', elevated: '800', accented: '700', inverted: '100' },
          border: { base: '800', muted: '800', accented: '700', inverted: '100' },
        },
      },
      // 基础颜色
      colorBase: { white: '#ffffff', black: '#000000' },
    }
  }
}
```

**配置优先级说明**：
1. **系统默认配置** - `defaultConfig`（最低优先级）
2. **全局项目配置** - `manage.config?.theme?.config`（覆盖默认配置）
3. **运行时动态映射** - `themeStore`（影响色彩映射关系）

### 动态色彩映射

动态设置颜色实际上是改变语义色类型到基础色的映射关系：

```js
import { useTheme } from '@duxweb/dvha-core'

const { setColor, setColors, colors } = useTheme()

// 查看所有可用的基础色
console.log('可用颜色:', colors.value)
// ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'gray', 'slate', 'zinc', 'neutral', 'stone']

// 将 primary 语义色映射到 red 基础色
setColor('primary', 'red')
// 这会让所有 --ui-color-primary-* 变量指向 --base-color-red-* 变量

// 批量设置语义色映射
setColors({
  primary: 'blue',    // primary 类型 → blue 基础色
  success: 'green',   // success 类型 → green 基础色
  warning: 'amber',   // warning 类型 → amber 基础色
  error: 'red',       // error 类型 → red 基础色
  gray: 'slate'       // gray 类型 → slate 基础色
})
```

**映射原理**：
```js
// 设置前：primary 映射到默认的某个基础色
--ui-color-primary: var(--base-color-blue-500)

// 执行 setColor('primary', 'red') 后
--ui-color-primary: var(--base-color-red-500)
--ui-color-primary-hover: var(--base-color-red-600)
// ... 所有 primary 相关变量都重新映射到 red 基础色
```

### 获取颜色值

```js
import { useTheme } from '@duxweb/dvha-core'

const { getSceneColor, getShadeColor, getSemanticColor } = useTheme()

// 获取场景颜色 - 根据当前主题模式自动选择色阶
const primaryColor = getSceneColor('primary') // 默认状态
const primaryHover = getSceneColor('primary', 'hover') // 悬停状态
const primaryPressed = getSceneColor('primary', 'pressed') // 按下状态
const primaryFocus = getSceneColor('primary', 'focus') // 焦点状态
const primaryDisabled = getSceneColor('primary', 'disabled') // 禁用状态

// 获取指定色阶颜色
const primary500 = getShadeColor('primary', '500')
const success200 = getShadeColor('success', '200')

// 获取语义颜色
const textColor = getSemanticColor('text', 'base') // 基础文本色
const textMuted = getSemanticColor('text', 'muted') // 弱化文本色
const bgColor = getSemanticColor('bg', 'base') // 基础背景色
const borderColor = getSemanticColor('border', 'base') // 基础边框色
```

## UnoCSS / Tailwind CSS 预设

该主题系统提供了 UnoCSS 和 Tailwind CSS 的预设配置，可直接使用工具类：

```js
// uno.config.ts 或 tailwind.config.js
import { themePreset } from '@duxweb/dvha-core/utils'
import { themeColor } from '@duxweb/dvha-core'

const preset = themePreset(themeColor)

export default {
  theme: {
    extend: {
      colors: preset.colors // 扩展颜色系统
    }
  },
  // UnoCSS 配置
  rules: preset.rules,

  // 或者 Tailwind CSS 配置
  plugins: [
    function({ addUtilities }) {
      addUtilities(preset.utilities)
    }
  ]
}
```

### themePreset 返回值

`themePreset` 函数返回完整的配置对象：

```js
const preset = themePreset(themeColor)
// 返回：
{
  colors: {
    // 调色板颜色（直接覆盖原生颜色）
    'red': { '50': 'var(--base-color-red-50)', '100': 'var(--base-color-red-100)', '500': 'var(--base-color-red-500)', ... },
    'blue': { '50': 'var(--base-color-blue-50)', '100': 'var(--base-color-blue-100)', '500': 'var(--base-color-blue-500)', ... },
    'green': { '50': 'var(--base-color-green-50)', ... },
    // ... 所有themeColor中的颜色

    // UI 颜色类型
    'primary': {
      'DEFAULT': 'var(--ui-color-primary)',
      '50': 'var(--ui-color-primary-50)',
      'hover': 'var(--ui-color-primary-hover)',
      'pressed': 'var(--ui-color-primary-pressed)',
      // ...
    },

    // 基础颜色
    'white': { 'DEFAULT': 'var(--color-white)' },
    'black': { 'DEFAULT': 'var(--color-black)' }
  },

  classes: {
    // 语义化类定义
    'text': { 'color': 'var(--ui-text)' },
    'text-dimmed': { 'color': 'var(--ui-text-dimmed)' },
    'bg': { 'background-color': 'var(--ui-bg)' },
    'bg-elevated': { 'background-color': 'var(--ui-bg-elevated)' },
    'border': { 'border-color': 'var(--ui-border)' },
    // ...
  },

  rules: [...], // UnoCSS 规则数组
  utilities: {...} // Tailwind CSS 工具类对象
}
```

### 可用的工具类

```html
<!-- 主题色工具类 -->
<div class="bg-primary text-white hover:bg-primary-hover">主题色按钮</div>
<div class="bg-primary-500 text-primary-50">精确色阶控制</div>

<!-- 原生调色板（直接覆盖） -->
<div class="bg-red-500 text-blue-600">覆盖原生red-500、blue-600</div>
<div class="bg-green-100 text-purple-900">覆盖原生green-100、purple-900</div>

<!-- 语义颜色工具类（预设提供） -->
<div class="text bg-elevated border">自动主题适配</div>
<div class="text-dimmed bg-muted border-accented">语义化样式</div>
<div class="text-highlighted bg-inverted border-inverted">高对比样式</div>

<!-- 所有交互状态 -->
<button class="bg-primary hover:bg-primary-hover active:bg-primary-pressed focus:bg-primary-focus disabled:bg-primary-disabled">
  完整交互状态
</button>
```


## 与UI框架集成示例

```vue
<script setup>
import { computed } from 'vue'
import { useTheme } from '@duxweb/dvha-core'

const { isDark, getSceneColor, getSemanticColor } = useTheme()

// Naive UI 主题配置
const naiveThemeOverrides = computed(() => ({
  common: {
    // 主题色
    primaryColor: getSceneColor('primary'),
    primaryColorHover: getSceneColor('primary', 'hover'),
    primaryColorPressed: getSceneColor('primary', 'pressed'),

    // 功能色
    infoColor: getSceneColor('info'),
    successColor: getSceneColor('success'),
    warningColor: getSceneColor('warning'),
    errorColor: getSceneColor('error'),

    // 文本色
    textColorBase: getSemanticColor('text', 'base'),
    textColor1: getSemanticColor('text', 'highlighted'),
    textColor2: getSemanticColor('text', 'toned'),
    textColor3: getSemanticColor('text', 'muted'),
    textColorDisabled: getSemanticColor('text', 'dimmed'),

    // 背景色
    bodyColor: getSemanticColor('bg', 'base'),
    cardColor: getSemanticColor('bg', 'elevated'),
    inputColor: getSemanticColor('bg', 'muted'),

    // 边框色
    borderColor: getSemanticColor('border', 'base'),
    dividerColor: getSemanticColor('border', 'muted'),
  }
}))
</script>

<template>
  <n-config-provider
    :theme="isDark ? darkTheme : lightTheme"
    :theme-overrides="naiveThemeOverrides"
  >
    <n-app>
      <!-- 应用内容 -->
    </n-app>
  </n-config-provider>
</template>
```

## 工作原理

1. **初始化**: 从本地存储读取主题模式和颜色配置
2. **CSS变量生成**: 基于当前配置生成完整的CSS变量系统
3. **颜色映射**: 将抽象的颜色类型映射到具体的颜色名称
4. **场景计算**: 根据主题模式计算不同交互状态的颜色
5. **语义颜色**: 提供文本、背景、边框等语义化颜色变量
6. **响应式更新**: 监听配置变化，自动更新CSS变量
7. **状态持久**: 将用户的主题和颜色选择保存到本地存储

## 注意事项

- 首次使用前必须调用 `cssInit()` 初始化CSS变量
- 颜色设置会自动保存到本地存储
- 自动模式会跟随系统的暗色/亮色偏好
- 所有颜色值都经过hex到rgb的转换处理
- 支持完整的颜色调色板和语义化颜色系统
- 与现代CSS工具链完全兼容
- 优先使用语义化变量而不是具体颜色值
- 建议在应用启动时统一设置颜色方案