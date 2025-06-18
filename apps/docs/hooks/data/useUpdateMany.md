# useUpdateMany

`useUpdateMany` hook 用于批量更新多条数据记录，适用于需要同时更新大量数据的场景。

## 功能特点

- ✏️ **批量更新** - 一次请求更新多条数据记录
- 🔄 **自动缓存更新** - 更新成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理批量更新失败情况
- 🎯 **高效处理** - 相比单个更新，减少网络请求次数
- 🔄 **缓存失效** - 自动失效相关查询缓存
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `updateMany(options, manage, auth)` 方法批量更新数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  updateMany: (
    options: IDataProviderUpdateManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderUpdateManyOptions {
  path: string // API 路径
  ids: (string | number)[] // 要更新的资源 ID 列表
  data: Record<string, any> // 要更新的数据
  meta?: Record<string, any> // 额外参数
}

// 响应数据接口
interface IDataProviderResponse {
  message?: string // 响应消息
  data?: any // 响应数据
  meta?: Record<string, any> // 元数据信息
  [key: string]: any // 其他自定义字段
}
```

## 使用方法

```js
import { useUpdateMany } from '@duxweb/dvha-core'

const { mutate: updateUsers, isLoading, isError, error } = useUpdateMany({
  path: 'users'
})

// 执行批量更新
updateUsers({
  ids: [1, 2, 3],
  data: { status: 'active' }
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useUpdateMany({
  // 必需参数
  path: 'users', // API 路径

  // 可选参数
  meta: { // 额外参数
    include: 'profile',
    notify: true
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => { // 成功回调
    console.log('批量更新成功:', data)
    console.log(`成功更新 ${data.meta.updated} 条记录`)
  },
  onError: (err) => { // 错误回调
    console.error('批量更新失败:', err)
  }
})

// 执行批量更新
function handleBatchUpdate() {
  mutate({
    ids: selectedIds.value,
    data: updateData.value
  })
}
```

## 参数说明

| 参数           | 类型                   | 必需 | 说明                             |
| -------------- | ---------------------- | ---- | -------------------------------- |
| `path`         | `string`               | ✅   | API 资源路径                     |
| `meta`         | `Record<string, any>`  | ❌   | 传递给 API 的额外参数            |
| `providerName` | `string`               | ❌   | 数据提供者名称，默认为 'default' |
| `onSuccess`    | `(data: any) => void`  | ❌   | 成功回调                         |
| `onError`      | `(error: any) => void` | ❌   | 错误处理回调                     |
| `options`      | `UseMutationOptions`   | ❌   | TanStack Query Mutation 选项     |

## 返回值

| 字段        | 类型           | 说明               |
| ----------- | -------------- | ------------------ |
| `mutate`    | `Function`     | 执行批量更新的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在更新       |
| `isError`   | `Ref<boolean>` | 是否出错           |
| `error`     | `Ref<any>`     | 错误信息           |
| `isSuccess` | `Ref<boolean>` | 是否成功           |
| `data`      | `Ref<any>`     | 更新后的响应数据   |

## 批量状态更新示例

```js
import { useUpdateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedUserIds = ref([1, 2, 3, 4, 5])
const newStatus = ref('active')

const {
  mutate: batchUpdateStatus,
  isLoading,
  isError,
  isSuccess,
  error
} = useUpdateMany({
  path: 'users',
  onSuccess: (response) => {
    console.log(`批量更新成功，共更新 ${response.meta.updated} 个用户状态`)
    // 清空选择
    selectedUserIds.value = []
  },
  onError: (error) => {
    console.error('批量更新失败:', error.message)
  }
})

function handleBatchStatusUpdate() {
  if (selectedUserIds.value.length === 0) {
    alert('请先选择要更新的用户')
    return
  }

  batchUpdateStatus({
    ids: selectedUserIds.value,
    data: { status: newStatus.value }
  })
}

// 批量激活用户
function activateUsers() {
  batchUpdateStatus({
    ids: selectedUserIds.value,
    data: { status: 'active', activated_at: new Date().toISOString() }
  })
}

// 批量禁用用户
function deactivateUsers() {
  batchUpdateStatus({
    ids: selectedUserIds.value,
    data: { status: 'inactive', deactivated_at: new Date().toISOString() }
  })
}
```

## 批量字段更新示例

```js
import { useUpdateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedProducts = ref([])
const batchUpdateForm = ref({
  category: '',
  discount: 0,
  tags: []
})

const { mutate: batchUpdateProducts, isLoading } = useUpdateMany({
  path: 'products',
  onSuccess: (response) => {
    console.log('产品批量更新成功:', response)
    // 重置表单
    selectedProducts.value = []
    batchUpdateForm.value = {
      category: '',
      discount: 0,
      tags: []
    }
  }
})

function handleBatchUpdate() {
  const updateData = {}

  // 只更新有值的字段
  if (batchUpdateForm.value.category) {
    updateData.category = batchUpdateForm.value.category
  }
  if (batchUpdateForm.value.discount > 0) {
    updateData.discount = batchUpdateForm.value.discount
  }
  if (batchUpdateForm.value.tags.length > 0) {
    updateData.tags = batchUpdateForm.value.tags
  }

  if (Object.keys(updateData).length === 0) {
    alert('请至少选择一个要更新的字段')
    return
  }

  batchUpdateProducts({
    ids: selectedProducts.value.map(p => p.id),
    data: updateData
  })
}

// 批量设置促销
function setPromotion(promotionData) {
  batchUpdateProducts({
    ids: selectedProducts.value.map(p => p.id),
    data: {
      is_promotion: true,
      promotion_price: promotionData.price,
      promotion_start: promotionData.startDate,
      promotion_end: promotionData.endDate
    }
  })
}
```

## 批量审核示例

```js
import { useUpdateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const pendingArticles = ref([])
const reviewComment = ref('')

const { mutate: batchReview, isLoading } = useUpdateMany({
  path: 'articles',
  onSuccess: (response) => {
    console.log('批量审核完成:', response.meta)
    pendingArticles.value = []
    reviewComment.value = ''
  }
})

// 批量通过审核
function approveArticles() {
  batchReview({
    ids: pendingArticles.value.map(article => article.id),
    data: {
      status: 'approved',
      review_comment: reviewComment.value,
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'current_user_id'
    }
  })
}

// 批量拒绝审核
function rejectArticles() {
  if (!reviewComment.value.trim()) {
    alert('拒绝时必须填写审核意见')
    return
  }

  batchReview({
    ids: pendingArticles.value.map(article => article.id),
    data: {
      status: 'rejected',
      review_comment: reviewComment.value,
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'current_user_id'
    }
  })
}

// 批量回退到草稿
function returnToDraft() {
  batchReview({
    ids: pendingArticles.value.map(article => article.id),
    data: {
      status: 'draft',
      review_comment: reviewComment.value,
      reviewed_at: new Date().toISOString()
    }
  })
}
```

## 多数据提供者示例

```js
import { useUpdateMany } from '@duxweb/dvha-core'

// 使用默认数据提供者批量更新用户
const { mutate: updateUsers } = useUpdateMany({
  path: 'users'
})

// 使用分析服务批量更新报告
const { mutate: updateReports } = useUpdateMany({
  path: 'reports',
  providerName: 'analytics'
})

// 使用支付服务批量更新订单
const { mutate: updateOrders } = useUpdateMany({
  path: 'orders',
  providerName: 'payment'
})

// 执行不同的批量更新操作
function handleBatchUpdateUsers() {
  updateUsers({
    ids: [1, 2, 3],
    data: { department: 'Engineering' }
  })
}

function handleBatchUpdateReports() {
  updateReports({
    ids: ['report-1', 'report-2'],
    data: { status: 'published' }
  })
}

function handleBatchUpdateOrders() {
  updateOrders({
    ids: ['order-1', 'order-2'],
    data: { status: 'shipped', shipped_at: new Date().toISOString() }
  })
}
```

## 条件批量更新示例

```js
import { useUpdateMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const updateConditions = ref({
  status: 'pending',
  created_before: '2024-01-01'
})

const { mutate: conditionalUpdate, isLoading } = useUpdateMany({
  path: 'tasks',
  meta: {
    conditional: true
  },
  onSuccess: (response) => {
    console.log(`根据条件更新了 ${response.meta.updated} 条记录`)
  }
})

// 根据条件批量更新
function handleConditionalUpdate() {
  conditionalUpdate({
    // 传递条件而不是具体的 ID
    data: {
      status: 'cancelled',
      cancelled_reason: '超时自动取消'
    },
    meta: {
      where: updateConditions.value // 更新条件
    }
  })
}

// 批量更新过期任务
function updateExpiredTasks() {
  conditionalUpdate({
    data: {
      status: 'expired',
      expired_at: new Date().toISOString()
    },
    meta: {
      where: {
        status: 'pending',
        due_date: { $lt: new Date().toISOString() }
      }
    }
  })
}
```

## 高级配置示例

```js
import { useUpdateMany } from '@duxweb/dvha-core'

const { mutate: batchUpdateUsers, isLoading, error } = useUpdateMany({
  path: 'users',
  meta: {
    include: 'profile,permissions',
    notification: true,
    batchOptions: {
      size: 50, // 每批50条
      parallel: false, // 不并行处理
      continueOnError: true // 遇到错误继续处理其他记录
    }
  },
  providerName: 'userService',
  options: {
    onMutate: () => {
      console.log('开始批量更新用户...')
    },
    onSettled: () => {
      console.log('批量更新操作完成')
    }
  },
  onSuccess: (data) => {
    console.log('用户批量更新成功:', data)
    const { total, success, failed } = data.meta
    console.log(`总计: ${total}, 成功: ${success}, 失败: ${failed}`)
  },
  onError: (error) => {
    console.error('批量更新用户失败:', error)
    if (error.details) {
      console.log('失败详情:', error.details)
    }
  }
})

function handleAdvancedBatchUpdate() {
  batchUpdateUsers({
    ids: [1, 2, 3, 4, 5],
    data: {
      department: 'Engineering',
      permissions: ['read', 'write'],
      profile: {
        updated_at: new Date().toISOString()
      }
    },
    meta: {
      sendNotification: true,
      logActivity: true
    }
  })
}
```

## 响应格式

```json
{
  "message": "批量更新成功",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "status": "active",
      "updated_at": "2024-01-20T15:45:00Z"
    },
    {
      "id": 2,
      "name": "李四",
      "status": "active",
      "updated_at": "2024-01-20T15:45:01Z"
    }
  ],
  "meta": {
    "total": 2,
    "updated": 2,
    "failed": 0,
    "batch_id": "batch_update_20240120_001"
  }
}
```

## Vue 组件完整示例

```vue
<script setup lang="ts">
import { useUpdateMany } from '@duxweb/dvha-core'
import { computed, ref } from 'vue'

const selectedItems = ref([])
const batchForm = ref({
  status: '',
  category: '',
  tags: []
})

const {
  mutate: batchUpdate,
  isLoading,
  isError,
  isSuccess,
  error
} = useUpdateMany({
  path: 'products',
  onSuccess: (response) => {
    console.log('批量更新成功:', response)
    // 重置选择和表单
    selectedItems.value = []
    batchForm.value = { status: '', category: '', tags: [] }
  }
})

const canUpdate = computed(() => {
  return selectedItems.value.length > 0 && (
    batchForm.value.status
    || batchForm.value.category
    || batchForm.value.tags.length > 0
  )
})

function getUpdateData() {
  const data = {}
  if (batchForm.value.status)
    data.status = batchForm.value.status
  if (batchForm.value.category)
    data.category = batchForm.value.category
  if (batchForm.value.tags.length > 0)
    data.tags = batchForm.value.tags
  return data
}

function handleBatchUpdate() {
  if (!canUpdate.value) {
    alert('请选择要更新的项目和至少一个字段')
    return
  }

  batchUpdate({
    ids: selectedItems.value.map(item => item.id),
    data: getUpdateData()
  })
}

function selectAll() {
  // 这里应该从实际的数据列表中选择
  selectedItems.value = [...availableItems.value]
}

function clearSelection() {
  selectedItems.value = []
}
</script>

<template>
  <div class="batch-update">
    <h2>批量更新</h2>

    <!-- 选择区域 -->
    <div class="selection-area">
      <p>已选择 {{ selectedItems.length }} 个项目</p>
      <div class="selection-actions">
        <button class="btn btn-secondary" @click="selectAll">
          全选
        </button>
        <button class="btn btn-secondary" @click="clearSelection">
          清空选择
        </button>
      </div>
    </div>

    <!-- 批量更新表单 -->
    <div class="batch-form">
      <h3>批量更新字段</h3>

      <div class="form-group">
        <label>状态:</label>
        <select v-model="batchForm.status" class="form-select">
          <option value="">
            不更新
          </option>
          <option value="active">
            激活
          </option>
          <option value="inactive">
            禁用
          </option>
          <option value="pending">
            待审核
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>分类:</label>
        <select v-model="batchForm.category" class="form-select">
          <option value="">
            不更新
          </option>
          <option value="electronics">
            电子产品
          </option>
          <option value="clothing">
            服装
          </option>
          <option value="books">
            图书
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>标签:</label>
        <input
          v-model="batchForm.tags"
          placeholder="多个标签用逗号分隔"
          class="form-input"
        >
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <button
        :disabled="!canUpdate || isLoading"
        class="btn btn-primary"
        @click="handleBatchUpdate"
      >
        {{ isLoading ? '更新中...' : '批量更新' }}
      </button>
    </div>

    <!-- 状态显示 -->
    <div v-if="isError" class="error">
      更新失败: {{ error?.message }}
    </div>

    <div v-if="isSuccess" class="success">
      批量更新成功！
    </div>

    <!-- 预览更新内容 -->
    <div v-if="selectedItems.length > 0" class="preview">
      <h4>更新预览</h4>
      <p>将更新 {{ selectedItems.length }} 个项目:</p>
      <ul>
        <li v-if="batchForm.status">
          状态 → {{ batchForm.status }}
        </li>
        <li v-if="batchForm.category">
          分类 → {{ batchForm.category }}
        </li>
        <li v-if="batchForm.tags.length > 0">
          标签 → {{ batchForm.tags.join(', ') }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.batch-update {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.selection-area {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.selection-actions {
  margin-top: 10px;
}

.batch-form {
  border: 1px solid #dee2e6;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.actions {
  margin-bottom: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}
.btn-secondary {
  background: #6c757d;
  color: white;
}

.error {
  color: #dc3545;
  padding: 10px;
  background: #f8d7da;
  border-radius: 4px;
  margin-bottom: 10px;
}

.success {
  color: #155724;
  padding: 10px;
  background: #d4edda;
  border-radius: 4px;
  margin-bottom: 10px;
}

.preview {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 4px;
}

.preview ul {
  margin: 10px 0;
  padding-left: 20px;
}
</style>
```

## 工作流程

1. **调用 mutate**: 传入要更新的 ID 列表和更新数据
2. **调用数据提供者**: 框架调用配置的数据提供者的 `updateMany` 方法
3. **批量处理**: 服务器端处理批量更新逻辑
4. **处理响应**:
   - 成功：触发 `onSuccess` 回调，自动失效相关查询缓存
   - 失败：触发 `onError` 回调
5. **缓存更新**: 更新成功后，相关的查询缓存会自动失效并重新获取

## 注意事项

- 批量更新通常比逐个更新更高效，减少网络请求次数
- 服务器端需要支持批量更新接口
- 支持按条件批量更新，不仅限于 ID 列表
- 更新成功后，框架会自动失效相关的查询缓存
- 支持部分成功模式，可以通过响应数据查看详细结果
- 错误处理可能包含验证错误的详细信息
- 适合状态变更、字段统一更新等场景
- 可以配合权限控制确保安全性

```

```
