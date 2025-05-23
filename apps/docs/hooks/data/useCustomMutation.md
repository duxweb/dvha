# useCustomMutation

`useCustomMutation` hook 用于执行自定义操作（非查询类）。

## 功能特点

- ⚡ **自定义操作** - 支持任意 API 修改操作
- 🌐 **HTTP 方法** - 支持 POST、PUT、PATCH、DELETE 等
- 🔄 **自动缓存更新** - 操作成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理操作失败情况
- 🎯 **灵活配置** - 支持文件上传、批量操作等

## 接口关系

该hook调用数据提供者的 `custom(params)` 方法执行自定义操作。

```js
// 数据提供者接口（与 useCustom 相同）
interface IDataProvider {
  custom(params: {
    url: string
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    data?: Record<string, any>
    headers?: Record<string, string>
  }): Promise<{
    data: any
  }>
}
```

## 使用方法

```js
import { useCustomMutation } from '@duxweb/dvha-core'

const { mutate, isLoading, isError, isSuccess, error } = useCustomMutation({
  url: '/api/users/send-notification',
  method: 'POST'
})

// 执行操作
mutate({
  data: {
    message: '系统通知内容',
    type: 'info'
  }
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useCustomMutation({
  // 必需参数
  url: '/api/users/batch-update',  // 自定义 URL
  method: 'POST',                  // HTTP 方法

  // 可选参数
  headers: {                       // 自定义请求头
    'Content-Type': 'application/json'
  },
  onSuccess: (data) => {           // 成功回调
    console.log('操作成功:', data)
    // 可以进行页面跳转、刷新数据等
  },
  onError: (err) => {              // 错误回调
    console.error('操作失败:', err)
  }
})

// 执行操作
const handleUpdate = () => {
  mutate({
    data: {
      ids: [1, 2, 3],
      status: 'active'
    }
  })
}
```

## 参数说明

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `url` | `string` | ✅ | 请求的 URL |
| `method` | `'POST' \| 'PUT' \| 'PATCH' \| 'DELETE'` | ✅ | HTTP 方法 |
| `headers` | `Record<string, string>` | ❌ | 自定义请求头 |
| `onSuccess` | `(data: any) => void` | ❌ | 成功回调 |
| `onError` | `(error: any) => void` | ❌ | 错误处理回调 |

## 返回值

| 字段 | 类型 | 说明 |
|------|------|------|
| `mutate` | `Function` | 执行操作的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在执行 |
| `isError` | `Ref<boolean>` | 是否出错 |
| `error` | `Ref<any>` | 错误信息 |
| `isSuccess` | `Ref<boolean>` | 是否成功 |
| `data` | `Ref<any>` | 响应数据 |

## 文件上传示例

```js
import { useCustomMutation } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedFile = ref(null)

const { mutate: uploadFile, isLoading, data } = useCustomMutation({
  url: '/api/upload/image',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

const handleUpload = () => {
  if (!selectedFile.value) return

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  uploadFile({
    data: formData
  })
}
```

## 批量操作示例

```js
import { useCustomMutation } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedAction = ref('activate')
const selectedIds = ref([])

const { mutate: batchAction, isLoading } = useCustomMutation({
  url: '/api/users/batch-action',
  method: 'POST',
  onSuccess: () => {
    selectedIds.value = []
    // 刷新用户列表
  }
})

const handleBatchAction = () => {
  batchAction({
    data: {
      action: selectedAction.value,
      user_ids: selectedIds.value
    }
  })
}
```

## 响应格式

```json
{
  "data": {
    "processed_count": 3,
    "success_count": 3,
    "failed_count": 0
  },
  "message": "批量操作完成"
}
```