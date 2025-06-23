# 自定义数据接口

本教程将教你如何使用 DVHA Pro 内置的简单数据提供者，通过自定义回调函数来适配你的后端数据 API 格式。

## 📋 前置条件

- 已完成 [登录后台](/pro/course/login) 教程
- 有自己的后端数据 API
- 了解 RESTful API 设计

## 🎯 目标效果

完成本教程后，你将能够：
- 📡 使用内置的简单数据提供者
- 🔄 通过回调函数适配你的后端响应格式
- 📊 实现列表、详情、增删改查功能
- 🔍 支持搜索、分页、排序

## 🔧 第一步：了解简单数据提供者

DVHA Pro 内置了 `simpleDataProvider`，它是基于标准 RESTful API 的实现：

```typescript
import { simpleDataProvider } from '@duxweb/dvha-core'

// 默认配置
const dataProvider = simpleDataProvider({
  apiUrl: 'https://api.example.com'
})
```

## 📝 第二步：了解你的 API 格式

假设你的后端 API 返回格式如下：

```typescript
// 你的 API 响应格式
{
  code: 200,
  message: "success",
  result: {
    items: [...],     // 数据列表
    pagination: {
      current: 1,     // 当前页
      size: 10,       // 每页数量
      total: 100      // 总数
    }
  }
}

// DVHA 期望的格式
{
  data: {
    data: [...],      // 数据列表
    meta: {
      total: 100      // 总数
    }
  }
}
```

## ⚙️ 第三步：创建自定义数据提供者

在 `src/` 目录下创建 `dataProvider.ts` 文件：

```typescript
import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import { simpleDataProvider } from '@duxweb/dvha-core'

export const dataProvider = simpleDataProvider({
  // API 基础地址
  apiUrl: '/api',

  // 成功响应回调 - 适配你的响应格式
  successCallback: (res: any): IDataProviderResponse => {
    // res 是 axios 响应对象
    const result = res.data

    // 适配你的响应格式
    if (result.code === 200) {
      return {
        message: result.message,
        data: result.result?.items || result.result?.data || result.result,
        meta: {
          total: result.result?.pagination?.total || result.result?.total || 0,
          page: result.result?.pagination?.current || 1,
          pageSize: result.result?.pagination?.size || 10,
        },
        raw: result,
      }
    }

    // 如果不是成功状态，抛出错误
    throw new Error(result.message || '请求失败')
  },

  // 错误响应回调 - 适配你的错误格式
  errorCallback: (err: any): IDataProviderError => {
    const response = err.response?.data

    return {
      message: response?.message || err.message || '请求失败',
      status: response?.code || err.response?.status || 500,
      data: response?.data,
      meta: response?.meta,
      raw: response,
    }
  },

  // 自定义总数获取方式
  getTotal: (response: IDataProviderResponse) => {
    return response.meta?.total || 0
  },
})
```

## 🌐 第四步：处理不同的 API 格式

### 情况1：嵌套数据结构

如果你的 API 返回嵌套结构：

```typescript
// API 返回
{
  status: "ok",
  data: {
    list: [...],
    count: 100,
    page_info: {
      current_page: 1,
      per_page: 10
    }
  }
}
```

适配代码：

```typescript
successCallback: (res: any): IDataProviderResponse => {
  const result = res.data

  if (result.status === 'ok') {
    return {
      data: result.data.list,
      meta: {
        total: result.data.count,
        page: result.data.page_info.current_page,
        pageSize: result.data.page_info.per_page,
      },
      raw: result,
    }
  }

  throw new Error('请求失败')
}
```

### 情况2：不同的状态码

如果你的 API 使用不同的状态码：

```typescript
successCallback: (res: any): IDataProviderResponse => {
  const result = res.data

  // 适配不同的成功状态码
  if (result.errcode === 0 || result.success === true) {
    return {
      data: result.data || result.items,
      meta: {
        total: result.total || result.count,
      },
      raw: result,
    }
  }

  throw new Error(result.errmsg || result.message || '请求失败')
}
```

### 情况3：数组直接返回

如果你的 API 直接返回数组：

```typescript
successCallback: (res: any): IDataProviderResponse => {
  const result = res.data

  // 如果直接返回数组
  if (Array.isArray(result)) {
    return {
      data: result,
      meta: {
        total: result.length,
      },
      raw: result,
    }
  }

  // 如果是对象包装
  return {
    data: result.data || result,
    meta: {
      total: result.total || 0,
    },
    raw: result,
  }
}
```

## 🔧 第五步：配置数据提供者

修改 `main.ts` 文件，应用自定义数据提供者：

```typescript{6,11}
import { createApp } from 'vue'
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro } from '@duxweb/dvha-pro'
import App from './App.vue'
import { authProvider } from './authProvider'
import { dataProvider } from './dataProvider'

const app = createApp(App)

const config = {
  authProvider,
  dataProvider,  // 应用自定义数据提供者

  menus: [
    {
      name: 'hello',
      title: 'Hello 页面',
      icon: 'i-tabler:heart',
      path: '/hello'
    }
  ]
}

app.use(createDux(config))
app.use(createDuxPro())
app.mount('#app')
```

## 🧪 第六步：测试功能

在现有的 `src/pages/hello.vue` 页面中添加数据请求测试：

```vue{2-4,10-20}
<script setup>
import { useList } from '@duxweb/dvha-core'

// 测试数据请求
const { data, loading, error } = useList({ path: 'articles' })
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Hello DVHA Pro!</h1>

    <!-- 数据请求测试 -->
    <div class="mt-6">
      <h2 class="text-lg font-semibold mb-2">数据接口测试</h2>
      <div v-if="loading">加载中...</div>
      <div v-else-if="error" class="text-red-500">错误: {{ error.message }}</div>
      <div v-else>
        <p>数据条数: {{ data?.length || 0 }}</p>
        <pre class="mt-2 p-2 bg-gray-100 rounded text-sm">{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
```

启动项目测试：

```bash
npm run dev
```

访问 Hello 页面，查看数据请求是否成功。如果你的 API 返回数据，说明自定义数据提供者配置正确。

## 💡 常见问题

::: details 分页参数不匹配怎么办？
简单数据提供者会自动发送 `page` 和 `pageSize` 参数，如果你的后端使用不同的参数名，可以在后端做映射，或者使用完全自定义的数据提供者。
:::

::: details 响应格式变化怎么办？
在 `successCallback` 中添加容错处理，支持多种格式：
```typescript
successCallback: (res: any): IDataProviderResponse => {
  const result = res.data

  return {
    data: result.data || result.items || result.list || result,
    meta: {
      total: result.total || result.count || result.totalCount || 0
    },
    raw: result,
  }
}
```
:::

::: details 如何处理文件上传？
简单数据提供者支持文件上传，会自动处理 FormData 格式的数据。
:::

## 🎯 总结

通过本教程，你学会了：

✅ 使用内置的 `simpleDataProvider`
✅ 通过 `successCallback` 适配响应格式
✅ 通过 `errorCallback` 处理错误格式
✅ 创建完整的数据管理页面

这种方式比完全自定义数据提供者更简单，也更稳定。你可以根据自己的 API 格式调整回调函数即可。
