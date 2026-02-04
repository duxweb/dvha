# useClient

`useClient` hook 用于获取数据客户端，提供自定义HTTP请求功能。

## 功能特点

- 🌐 **HTTP客户端** - 提供底层HTTP请求客户端
- 🔧 **自定义请求** - 支持任意自定义HTTP请求
- 🛡️ **认证集成** - 自动集成认证信息
- 🏢 **管理端感知** - 自动获取管理端配置
- ⚡ **直接调用** - 绕过hook封装，直接调用数据提供者
- 🎯 **灵活配置** - 支持完全自定义的请求参数

## 接口关系

该hook返回数据提供者的 `custom` 方法，可以直接调用进行HTTP请求。

```js
// 数据提供者接口
interface IDataProvider {
  custom(params: IDataProviderCustomOptions, manage?: IManageHook, auth?: IUserState): Promise<IDataProviderResponse>
}
```

## 使用方法

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// 执行自定义请求
const response = await request({
  path: '/api/custom-endpoint',
  method: 'POST',
  payload: { key: 'value' }
})
```

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `request` | `Function` | 执行HTTP请求的方法 |

## GET 请求示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// GET 请求
const fetchData = async () => {
  try {
    const response = await request({
      path: '/api/statistics',
      method: 'GET',
      query: {
        period: 'month',
        category: 'sales'
      }
    })

    console.log('统计数据:', response.data)
    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}
```

## POST 请求示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// POST 请求
const submitForm = async (formData) => {
  try {
    const response = await request({
      path: '/api/forms/submit',
      method: 'POST',
      payload: formData,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('提交结果:', response.data)
    return response.data
  } catch (error) {
    console.error('提交失败:', error)
    throw error
  }
}

// 使用示例
const formData = {
  name: '张三',
  email: 'zhangsan@example.com',
  message: '这是一条消息'
}

submitForm(formData)
```

## 文件上传示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// 文件上传
const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('category', 'images')

  try {
    const response = await request({
      path: '/api/upload',
      method: 'POST',
      payload: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('上传成功:', response.data)
    return response.data
  } catch (error) {
    console.error('上传失败:', error)
    throw error
  }
}
```

## 自定义Headers示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// 带自定义Headers的请求
const customRequest = async () => {
  try {
    const response = await request({
      path: '/api/protected-resource',
      method: 'GET',
      headers: {
        'X-Custom-Header': 'custom-value',
        'X-Client-Version': '1.0.0',
        'Accept': 'application/json'
      }
    })

    return response.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}
```

## 响应处理示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// 完整的响应处理
const handleRequest = async () => {
  try {
    const response = await request({
      path: '/api/data',
      method: 'GET'
    })

    // 处理不同类型的响应
    if (response.data) {
      console.log('数据:', response.data)
    }

    if (response.message) {
      console.log('消息:', response.message)
    }

    if (response.meta) {
      console.log('元数据:', response.meta)
    }

    return response
  } catch (error) {
    // 处理不同类型的错误
    if (error.response) {
      // 服务器响应错误
      console.error('服务器错误:', error.response.status, error.response.data)
    } else if (error.request) {
      // 网络错误
      console.error('网络错误:', error.request)
    } else {
      // 其他错误
      console.error('请求错误:', error.message)
    }

    throw error
  }
}
```

## 批量请求示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// 并发请求
const fetchMultipleData = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      request({ url: '/api/users', method: 'GET' }),
      request({ url: '/api/posts', method: 'GET' }),
      request({ url: '/api/comments', method: 'GET' })
    ])

    return {
      users: users.data,
      posts: posts.data,
      comments: comments.data
    }
  } catch (error) {
    console.error('批量请求失败:', error)
    throw error
  }
}

// 顺序请求
const fetchSequentialData = async () => {
  try {
    // 先获取用户信息
    const userResponse = await request({
      url: '/api/user/profile',
      method: 'GET'
    })

    // 基于用户ID获取订单
    const ordersResponse = await request({
      url: `/api/users/${userResponse.data.id}/orders`,
      method: 'GET'
    })

    return {
      user: userResponse.data,
      orders: ordersResponse.data
    }
  } catch (error) {
    console.error('顺序请求失败:', error)
    throw error
  }
}
```

## 错误重试示例

```js
import { useClient } from '@duxweb/dvha-core'

const { request } = useClient()

// 带重试机制的请求
const requestWithRetry = async (params, maxRetries = 3) => {
  let lastError

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await request(params)
      return response
    } catch (error) {
      lastError = error

      // 如果不是网络错误，直接抛出
      if (error.response && error.response.status !== 500) {
        throw error
      }

      // 等待一段时间后重试
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        console.log(`请求失败，第 ${i + 1} 次重试...`)
      }
    }
  }

  throw lastError
}

// 使用示例
const fetchDataWithRetry = async () => {
  try {
    const response = await requestWithRetry({
      url: '/api/unstable-endpoint',
      method: 'GET'
    }, 3)

    return response.data
  } catch (error) {
    console.error('重试后仍然失败:', error)
    throw error
  }
}
```

## 完整示例 - API客户端封装

```js
import { useClient } from '@duxweb/dvha-core'

// 创建API客户端类
class ApiClient {
  constructor() {
    const { request } = useClient()
    this.request = request
  }

  // GET 请求
  async get(url, params = {}) {
    return this.request({
      url,
      method: 'GET',
      params
    })
  }

  // POST 请求
  async post(url, data = {}) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }

  // PUT 请求
  async put(url, data = {}) {
    return this.request({
      url,
      method: 'PUT',
      data
    })
  }

  // DELETE 请求
  async delete(url) {
    return this.request({
      url,
      method: 'DELETE'
    })
  }

  // 文件上传
  async upload(url, file, additionalData = {}) {
    const formData = new FormData()
    formData.append('file', file)

    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key])
    })

    return this.request({
      url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 使用示例
const api = new ApiClient()

// 获取数据
const users = await api.get('/api/users', { page: 1, limit: 10 })

// 创建用户
const newUser = await api.post('/api/users', { name: '张三', email: 'zhang@example.com' })

// 上传文件
const uploadResult = await api.upload('/api/upload', file, { category: 'avatar' })
```

## 与其他Hooks对比

```js
import { useClient, useCustom, useCustomMutation } from '@duxweb/dvha-core'

// useClient - 直接调用，需要手动处理
const { request } = useClient()
const data = await request({ url: '/api/data', method: 'GET' })

// useCustom - 响应式查询，自动缓存
const { data, isLoading } = useCustom({
  url: '/api/data',
  method: 'GET'
})

// useCustomMutation - 响应式变更，自动状态管理
const { mutate, isLoading } = useCustomMutation({
  url: '/api/data',
  method: 'POST'
})
```

## 工作流程

1. **获取客户端**: 从 useClient 获取 request 方法
2. **配置请求**: 设置URL、方法、数据等参数
3. **执行请求**: 调用数据提供者的 custom 方法
4. **自动认证**: 框架自动添加认证信息
5. **处理响应**: 获取响应数据并处理错误

## 注意事项

- useClient 提供的是底层请求方法，需要手动处理加载状态和错误
- 认证信息会自动添加到请求中
- 适合需要完全控制请求流程的场景
- 与 useCustom 和 useCustomMutation 相比，缺少响应式状态管理
- 所有请求都会通过配置的数据提供者执行
- 支持完整的HTTP方法和参数配置
