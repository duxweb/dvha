# useCustomMutation

`useCustomMutation` hook 用于执行自定义操作（非查询类）。

## 功能特点

- 🔧 **自定义操作** - 支持任意 API 变更操作
- 🌐 **HTTP 方法** - 支持 POST、PUT、DELETE 等变更方法
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理网络错误和认证失败
- 🔄 **自动缓存** - 可选择性更新相关缓存
- 🎯 **灵活配置** - 支持自定义请求头和参数
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `custom(options, manage, auth)` 方法执行自定义操作。

```typescript
// 数据提供者接口
interface IDataProvider {
  custom(
    options: IDataProviderCustomOptions,
    manage?: IManageHook,
    auth?: IUserState
  ): Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderCustomOptions {
  path?: string                                         // API 路径
  method?: string                                       // HTTP 方法
  sorters?: Record<string, 'asc' | 'desc'>             // 排序配置
  filters?: Record<string, any>                        // 筛选条件
  query?: Record<string, any>                          // 查询参数
  headers?: Record<string, string>                     // 自定义请求头
  meta?: Record<string, any>                           // 额外参数
  payload?: any                                        // 请求体数据
}

// 响应数据接口
interface IDataProviderResponse {
  message?: string                          // 响应消息
  data?: any                                // 响应数据
  meta?: Record<string, any>                // 元数据信息
  [key: string]: any                        // 其他自定义字段
}
```

## 使用方法

```js
import { useCustomMutation } from '@duxweb/dvha-core'

const { mutate, isLoading, isError, isSuccess, error } = useCustomMutation({
  path: 'users/batch-action',
  method: 'POST'
})

// 执行操作
mutate({
  payload: { action: 'activate', ids: [1, 2, 3] }
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useCustomMutation({
  // 必需参数
  path: 'users/custom-action', // API 路径
  method: 'POST',              // HTTP 方法

  // 可选参数
  headers: {                   // 自定义请求头
    'Content-Type': 'application/json'
  },
  meta: {                      // 额外参数
    timeout: 30000
  },
  providerName: 'default',     // 数据提供者名称，默认为 'default'
  onSuccess: (data) => {       // 成功回调
    console.log('操作成功:', data)
  },
  onError: (err) => {          // 错误回调
    console.error('操作失败:', err)
  }
})

// 执行操作
const handleAction = () => {
  mutate({
    payload: {
      action: 'batch_update',
      data: { status: 'active' },
      ids: [1, 2, 3, 4, 5]
    }
  })
}
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `path` | `string` | ❌ | API 路径 |
| `method` | `string` | ❌ | HTTP 方法，默认为 'POST' |
| `query` | `Record<string, any>` | ❌ | 查询参数 |
| `filters` | `Record<string, any>` | ❌ | 筛选条件 |
| `sorters` | `Record<string, 'asc' \| 'desc'>` | ❌ | 排序配置 |
| `headers` | `Record<string, string>` | ❌ | 自定义请求头 |
| `meta` | `Record<string, any>` | ❌ | 额外参数 |
| `providerName` | `string` | ❌ | 数据提供者名称，默认为 'default' |
| `onSuccess` | `(data: any) => void` | ❌ | 成功回调 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |
| `options` | `UseMutationOptions` | ❌ | TanStack Query Mutation 选项 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `Function` | 执行操作的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在执行 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 操作后的响应数据 |

## 文件上传示例

```js
import { useCustomMutation } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedFile = ref(null)

const { mutate: uploadFile, isLoading, data } = useCustomMutation({
  path: 'upload',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  onSuccess: (response) => {
    console.log('文件上传成功:', response.data)
  }
})

const handleUpload = () => {
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('category', 'documents')

  uploadFile({
    payload: formData
  })
}
```

## 批量操作示例

```js
import { useCustomMutation } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedIds = ref([])

const { mutate: batchAction, isLoading } = useCustomMutation({
  path: 'users/batch',
  method: 'POST',
  onSuccess: () => {
    selectedIds.value = []
    console.log('批量操作完成')
  }
})

const handleBatchActivate = () => {
  batchAction({
    payload: {
      action: 'activate',
      ids: selectedIds.value
    }
  })
}

const handleBatchDeactivate = () => {
  batchAction({
    payload: {
      action: 'deactivate',
      ids: selectedIds.value
    }
  })
}
```

## 多数据提供者示例

```js
import { useCustomMutation } from '@duxweb/dvha-core'

// 使用默认数据提供者执行用户操作
const { mutate: userAction } = useCustomMutation({
  path: 'users/action',
  method: 'POST'
})

// 使用分析服务生成报告
const { mutate: generateReport } = useCustomMutation({
  path: 'generate-report',
  method: 'POST',
  providerName: 'analytics'
})

// 使用支付服务处理退款
const { mutate: processRefund } = useCustomMutation({
  path: 'refund',
  method: 'POST',
  providerName: 'payment'
})

// 执行不同的操作
const handleUserAction = () => {
  userAction({
    payload: { action: 'reset_password', userId: 1 }
  })
}

const handleGenerateReport = () => {
  generateReport({
    payload: { type: 'monthly', format: 'pdf' }
  })
}

const handleRefund = () => {
  processRefund({
    payload: { orderId: 'order-123', amount: 100 }
  })
}
```

## 复杂操作示例

```js
import { useCustomMutation, useInvalidate } from '@duxweb/dvha-core'

const { invalidate } = useInvalidate()

const { mutate: complexAction, isLoading, error } = useCustomMutation({
  path: 'complex-operation',
  method: 'POST',
  headers: {
    'X-Custom-Header': 'special-operation'
  },
  meta: {
    timeout: 60000,  // 60秒超时
    retries: 3       // 重试3次
  },
  providerName: 'mainService',
  onSuccess: async (data) => {
    console.log('复杂操作成功:', data)

    // 失效相关缓存
    await Promise.all([
      invalidate('users'),
      invalidate('stats', 'analytics'),
      invalidate('reports', 'analytics')
    ])
  },
  onError: (error) => {
    console.error('复杂操作失败:', error)
  }
})

const handleComplexOperation = () => {
  complexAction({
    query: {
      include: 'related_data'
    },
    payload: {
      operation_type: 'batch_update',
      targets: [1, 2, 3],
      settings: {
        notify_users: true,
        send_email: false
      }
    },
    meta: {
      priority: 'high'
    }
  })
}
```

## 状态管理示例

```js
import { useCustomMutation } from '@duxweb/dvha-core'
import { ref } from 'vue'

const operationResult = ref(null)
const operationError = ref(null)

const {
  mutate: executeOperation,
  isLoading,
  isSuccess,
  isError,
  data,
  error
} = useCustomMutation({
  path: 'special-operation',
  method: 'POST',
  onSuccess: (response) => {
    operationResult.value = response.data
    operationError.value = null
  },
  onError: (err) => {
    operationResult.value = null
    operationError.value = err.message
  }
})

// 在组件中使用状态
const handleOperation = () => {
  if (isLoading.value) {
    console.log('操作进行中...')
    return
  }

  executeOperation({
    payload: { action: 'process' }
  })
}

// 监听状态变化
watch(isSuccess, (success) => {
  if (success) {
    console.log('操作成功完成')
  }
})

watch(isError, (error) => {
  if (error) {
    console.log('操作失败:', error.value)
  }
})
```

## 响应格式

```json
{
  "message": "操作成功",
  "data": {
    "affected_rows": 5,
    "operation_id": "op-12345",
    "results": [
      { "id": 1, "status": "success" },
      { "id": 2, "status": "success" }
    ]
  }
}
```