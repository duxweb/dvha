# useConfig

`useConfig` hook 用于获取全局配置信息。

## 功能特点

- ⚙️ **全局配置** - 获取应用的全局配置信息
- 🔒 **单例模式** - 确保全局配置的唯一性
- 📱 **响应式** - 配置信息响应式更新
- 🛡️ **错误处理** - 自动处理配置缺失的情况
- 🎯 **依赖注入** - 通过 Vue 的 provide/inject 获取配置

## 接口关系

该hook不直接调用外部接口，而是从 Vue 应用的依赖注入系统中获取全局配置。

```js
// 全局配置接口
interface IConfig {
  title?: string
  description?: string
  copyright?: string
  theme?: ITheme
  authProvider?: IAuthProvider
  dataProvider?: IDataProvider
  layoutComponent?: Record<string, any>
  manages?: IManage[]
}
```

## 使用方法

```js
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()
```

## 参数说明

该hook无需参数。

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `config` | `IConfig` | 全局配置对象 |

## 获取全局信息

```js
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

console.log('全局配置:', {
  title: config.title,                    // 应用标题
  description: config.description,        // 应用描述
  copyright: config.copyright,            // 版权信息
  theme: config.theme,                   // 全局主题配置
  authProvider: config.authProvider,     // 全局认证提供者
  dataProvider: config.dataProvider,     // 全局数据提供者
  layoutComponent: config.layoutComponent, // 全局布局组件
  manages: config.manages                // 管理端配置列表
})
```

## 主题配置使用

```js
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

// 获取主题配置
const themeConfig = config.theme
if (themeConfig) {
  console.log('主题配置:', {
    logo: themeConfig.logo,
    darkLogo: themeConfig.darkLogo,
    banner: themeConfig.banner,
    darkBanner: themeConfig.darkBanner,
    primaryColor: themeConfig.primaryColor
  })
}
```

## 管理端列表

```js
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

// 获取所有管理端配置
const manages = config.manages || []

console.log('可用管理端:', manages.map(manage => ({
  name: manage.name,
  title: manage.title,
  routePrefix: manage.routePrefix
})))

// 查找特定管理端
const adminManage = manages.find(manage => manage.name === 'admin')
if (adminManage) {
  console.log('管理端配置:', adminManage)
}
```

## 提供者配置

```js
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

// 检查全局提供者
const globalAuth = config.authProvider
const globalData = config.dataProvider

console.log('全局提供者:', {
  认证提供者: globalAuth ? '已配置' : '未配置',
  数据提供者: globalData ? '已配置' : '未配置'
})

// 使用全局认证提供者
if (globalAuth) {
  // 执行认证操作
  try {
    const authResult = await globalAuth.check()
    console.log('认证检查结果:', authResult)
  } catch (error) {
    console.error('认证检查失败:', error)
  }
}
```

## 完整示例

```vue
<template>
  <div class="app-info">
    <header>
      <h1>{{ config.title }}</h1>
      <p>{{ config.description }}</p>
    </header>

    <div class="manages">
      <h2>可用管理端</h2>
      <ul>
        <li v-for="manage in manages" :key="manage.name">
          {{ manage.title || manage.name }}
        </li>
      </ul>
    </div>

    <div class="providers">
      <h2>提供者状态</h2>
      <p>认证提供者: {{ authStatus }}</p>
      <p>数据提供者: {{ dataStatus }}</p>
    </div>

    <footer>
      <p>{{ config.copyright }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

// 计算属性
const manages = computed(() => config.manages || [])

const authStatus = computed(() =>
  config.authProvider ? '已配置' : '未配置'
)

const dataStatus = computed(() =>
  config.dataProvider ? '已配置' : '未配置'
)
</script>
```

## 配置验证示例

```js
import { useConfig } from '@duxweb/dvha-core'

const config = useConfig()

// 验证必要配置
const validateConfig = () => {
  const errors = []

  if (!config.manages || config.manages.length === 0) {
    errors.push('未配置任何管理端')
  }

  if (!config.authProvider && !config.dataProvider) {
    errors.push('未配置认证和数据提供者')
  }

  if (errors.length > 0) {
    console.warn('配置验证警告:', errors)
    return false
  }

  console.log('配置验证通过')
  return true
}

// 执行验证
validateConfig()
```

## 工作流程

1. **依赖注入**: 从 Vue 应用的 provide/inject 系统获取配置
2. **配置检查**: 验证配置是否存在
3. **返回配置**: 返回完整的全局配置对象
4. **错误处理**: 配置不存在时抛出错误

## 注意事项

- 必须在 Vue 应用中正确配置和提供全局配置
- 配置对象在应用初始化时注入，运行时只读
- 如果配置未正确提供，会抛出错误
- 全局配置会被管理端特定配置继承和覆盖
- 通过此hook获取的是原始配置，未经管理端特定处理