# useCustom

`useCustom` hook 用于执行自定义查询操作。

## 功能特点

- 🔧 **自定义查询** - 支持任意 API 查询操作
- 🌐 **HTTP 方法** - 支持 GET、POST、PUT、DELETE 等
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🛡️ **错误处理** - 自动处理网络错误和认证失败
- 🎯 **灵活配置** - 支持自定义请求头和参数

## 接口关系

该hook调用数据提供者的 `custom(params)` 方法执行自定义请求。

```js
// 数据提供者接口
interface IDataProvider {
  custom(params: {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    params?: Record<string, any>
    headers?: Record<string, string>
  }): Promise<{
    data: any
  }>
}
```

## 使用方法

```js
import { useCustom } from '@duxweb/dvha-core'

const { data, isLoading, isError, error } = useCustom({
  url: '/api/dashboard/stats',
  method: 'GET'
})
```

## 常用参数

```js
const { data, isLoading, isError, error, refetch } = useCustom({
  // 必需参数
  url: '/api/users/stats',  // 自定义 URL
  method: 'GET',            // HTTP 方法

  // 可选参数
  params: {                 // 查询参数
    period: 'month',
    status: 'active'
  },
  headers: {                // 自定义请求头
    'Custom-Header': 'value'
  },
  onError: (err) => {       // 错误回调
    console.error('请求失败:', err)
  }
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `url` | `string` | ✅ | 请求的 URL |
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | ✅ | HTTP 方法 |
| `params` | `Record<string, any>` | ❌ | 查询参数 |
| `headers` | `Record<string, string>` | ❌ | 自定义请求头 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<any>` | 响应数据 |
| `isLoading` | `Ref<boolean>` | 是否加载中 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `refetch` | `Function` | 重新获取数据 |

## 动态参数查询

```js
import { useCustom } from '@duxweb/dvha-core'
import { ref, watch } from 'vue'

const selectedPeriod = ref('day')

const { data, isLoading, refetch } = useCustom({
  url: '/api/analytics',
  method: 'GET',
  params: {
    period: selectedPeriod.value
  }
})

// 监听参数变化，重新请求
watch(selectedPeriod, () => {
  refetch()
})
```

## POST 请求示例

```js
import { useCustom } from '@duxweb/dvha-core'

const { data, isLoading } = useCustom({
  url: '/api/reports/generate',
  method: 'POST',
  params: {
    type: 'user_activity',
    format: 'pdf',
    date_range: {
      start: '2024-01-01',
      end: '2024-01-31'
    }
  }
})
```

## 响应格式

```json
{
  "data": {
    "total_users": 1250,
    "active_users": 980,
    "new_users_today": 25,
    "growth_rate": 12.5
  },
  "message": "获取成功"
}
```