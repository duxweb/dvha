# useManage

`useManage` hook 用于获取当前管理端的配置信息和相关方法。

## 基本用法

```vue
<template>
  <div class="p-6">
    <h2 class="text-xl font-bold">{{ manage?.title }}</h2>
    <p class="text-gray-600">路由前缀: {{ manage?.routePrefix }}</p>
    <p class="text-gray-600">API 地址: {{ manage?.getApiUrl() }}</p>
  </div>
</template>

<script setup lang="ts">
import { useManage } from '@duxweb/dvha-core'

const manage = useManage()
</script>
```

## API

### 返回值

```typescript
interface IManageHook {
  title: string
  routePrefix: string
  getApiUrl: (path?: string) => string
  // 其他管理端配置...
}
```

#### title
- **类型**: `string`
- **说明**: 管理端标题

#### routePrefix
- **类型**: `string`
- **说明**: 路由前缀，如 `'admin'`、`'user'` 等

#### getApiUrl
- **类型**: `(path?: string) => string`
- **说明**: 获取 API 完整地址的方法
- **参数**:
  - `path`: 可选的路径参数
- **返回**: 完整的 API 地址

## 完整示例

```vue
<template>
  <div class="flex justify-between items-center px-6 py-4 bg-white border-b">
    <div>
      <h1 class="text-xl font-bold text-gray-900">{{ manage?.title || '管理系统' }}</h1>
    </div>

    <div class="flex gap-6 text-sm text-gray-600">
      <span>当前管理端: {{ manage?.routePrefix }}</span>
      <span>API 地址: {{ apiBaseUrl }}</span>
    </div>

    <div class="flex gap-2">
      <button
        @click="testApi"
        class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:border-blue-500 hover:text-blue-500"
      >
        测试 API 连接
      </button>
      <button
        @click="switchManage"
        class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:border-blue-500 hover:text-blue-500"
      >
        切换管理端
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useManage, useRouter } from '@duxweb/dvha-core'

const manage = useManage()
const router = useRouter()

// 获取 API 基础地址
const apiBaseUrl = computed(() => manage?.getApiUrl())

// 测试 API 连接
const testApi = async () => {
  try {
    const url = manage?.getApiUrl('health')
    const response = await fetch(url)
    if (response.ok) {
      alert('API 连接正常')
    } else {
      alert('API 连接失败')
    }
  } catch (error) {
    alert('API 连接错误: ' + error.message)
  }
}

// 切换管理端
const switchManage = () => {
  // 跳转到其他管理端
  const currentPrefix = manage?.routePrefix
  const targetPrefix = currentPrefix === 'admin' ? 'user' : 'admin'
  router.push(`/${targetPrefix}/dashboard`)
}
</script>
```

## 多管理端示例

```vue
<template>
  <div class="p-6">
    <h3 class="text-lg font-semibold mb-4">选择管理端</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in manageList"
        :key="item.routePrefix"
        :class="[
          'p-4 border-2 rounded-lg cursor-pointer transition-all',
          item.routePrefix === currentManage?.routePrefix
            ? 'border-blue-500 bg-green-50'
            : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
        ]"
        @click="switchTo(item.routePrefix)"
      >
        <h4 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h4>
        <p class="text-sm text-gray-600 mb-3">{{ item.description }}</p>
        <span
          :class="[
            'inline-block px-2 py-1 text-xs rounded',
            item.routePrefix === currentManage?.routePrefix
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ item.routePrefix }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useManage, useRouter } from '@duxweb/dvha-core'

const currentManage = useManage()
const router = useRouter()

// 可用的管理端列表
const manageList = [
  {
    title: '系统管理',
    description: '系统配置和用户管理',
    routePrefix: 'admin'
  },
  {
    title: '用户中心',
    description: '用户个人信息管理',
    routePrefix: 'user'
  },
  {
    title: '商户管理',
    description: '商户信息和订单管理',
    routePrefix: 'merchant'
  }
]

const switchTo = (routePrefix: string) => {
  if (routePrefix !== currentManage?.routePrefix) {
    router.push(`/${routePrefix}/dashboard`)
  }
}
</script>
```

## 工作流程

1. **获取管理端信息**: 从当前路由或配置中获取管理端信息
2. **提供配置访问**: 提供管理端的各种配置信息
3. **API 地址生成**: 根据管理端配置生成正确的 API 地址
4. **路由前缀**: 提供当前管理端的路由前缀信息

## 注意事项

- `useManage` 返回的是当前激活的管理端信息
- 在多管理端应用中，不同管理端的配置是独立的
- `getApiUrl` 方法会自动处理 API 基础地址和路径拼接
- 管理端切换时，相关的状态和缓存会自动重置

## 相关 Hooks

- [useConfig](./useConfig.md) - 获取全局配置
- [useRouter](../router/useRouter.md) - 路由操作
- [useMenu](./useMenu.md) - 菜单管理