# useOne

`useOne` hook 用于获取单个资源的详细信息。

## 功能特点

- 🔍 **单条数据获取** - 根据 ID 获取特定资源
- 📱 **自动缓存** - 智能缓存管理，避免重复请求
- 🔄 **自动重新验证** - 数据过期时自动刷新
- ⚡ **实时状态** - 提供加载、错误、成功状态
- 🛡️ **错误处理** - 自动处理网络错误和认证失败

## 接口关系

该hook调用数据提供者的 `getOne(resource, params)` 方法获取单条数据。

```js
// 数据提供者接口
interface IDataProvider {
  getOne(
    resource: string,
    params: {
      id: string | number
      meta?: Record<string, any>
    }
  ): Promise<{
    data: any
  }>
}
```

## 使用方法

```js
import { useOne } from '@duxweb/dvha-core'

const { data, isLoading, isError, error } = useOne({
  path: 'users',
  id: userId
})
```

## 常用参数

```js
const { data, isLoading, isError, error, refetch } = useOne({
  // 必需参数
  path: 'users',           // API 路径
  id: props.userId,        // 资源 ID

  // 可选参数
  meta: {                  // 额外参数
    include: 'profile,roles',
    fields: 'id,name,email'
  },
  onError: (err) => {      // 错误回调
    console.error('获取失败:', err)
  }
})
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ✅ | API 资源路径 |
| `id` | `string \| number` | ✅ | 资源 ID |
| `meta` | `Record<string, any>` | ❌ | 传递给 API 的额外参数 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `data` | `Ref<any>` | 响应数据 |
| `isLoading` | `Ref<boolean>` | 是否加载中 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `refetch` | `Function` | 重新获取数据 |

## 条件查询

```js
import { useOne } from '@duxweb/dvha-core'
import { computed } from 'vue'

// 只有当 userId 存在时才查询
const { data } = useOne({
  path: 'users',
  id: userId.value
}, {
  enabled: computed(() => !!userId.value) // TanStack Query 选项
})
```

## 响应格式

```json
{
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "message": "获取成功"
}
```