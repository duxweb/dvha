# useDeleteMany

`useDeleteMany` hook 用于批量删除多条数据记录，适用于需要同时删除大量数据的场景。

## 功能特点

- 🗑️ **批量删除** - 一次请求删除多条数据记录
- 🔄 **自动缓存更新** - 删除成功后自动更新相关缓存
- ⚡ **实时状态** - 提供操作进度和结果状态
- 🛡️ **错误处理** - 自动处理批量删除失败情况
- 🎯 **高效处理** - 相比单个删除，减少网络请求次数
- 🔄 **缓存失效** - 自动失效相关查询缓存
- 🎯 **多数据源** - 支持指定不同的数据提供者

## 接口关系

该hook调用数据提供者的 `deleteMany(options, manage, auth)` 方法批量删除数据。

```typescript
// 数据提供者接口
interface IDataProvider {
  deleteMany: (
    options: IDataProviderDeleteManyOptions,
    manage?: IManageHook,
    auth?: IUserState
  ) => Promise<IDataProviderResponse>
}

// 请求选项接口
interface IDataProviderDeleteManyOptions {
  path: string // API 路径
  ids: (string | number)[] // 要删除的资源 ID 列表
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
import { useDeleteMany } from '@duxweb/dvha-core'

const { mutate: deleteUsers, isLoading, isError, error } = useDeleteMany({
  path: 'users'
})

// 执行批量删除
deleteUsers({
  ids: [1, 2, 3]
})
```

## 常用参数

```js
const { mutate, isLoading, isError, error } = useDeleteMany({
  // 必需参数
  path: 'users', // API 路径

  // 可选参数
  meta: { // 额外参数
    soft: true, // 软删除
    force: false // 是否强制删除
  },
  providerName: 'default', // 数据提供者名称，默认为 'default'
  onSuccess: (data) => { // 成功回调
    console.log('批量删除成功:', data)
    console.log(`成功删除 ${data.meta.deleted} 条记录`)
  },
  onError: (err) => { // 错误回调
    console.error('批量删除失败:', err)
  }
})

// 执行批量删除
function handleBatchDelete() {
  mutate({
    ids: selectedIds.value
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
| `mutate`    | `Function`     | 执行批量删除的函数 |
| `isLoading` | `Ref<boolean>` | 是否正在删除       |
| `isError`   | `Ref<boolean>` | 是否出错           |
| `error`     | `Ref<any>`     | 错误信息           |
| `isSuccess` | `Ref<boolean>` | 是否成功           |
| `data`      | `Ref<any>`     | 删除后的响应数据   |

## 批量删除用户示例

```js
import { useDeleteMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedUserIds = ref([])

const {
  mutate: batchDeleteUsers,
  isLoading,
  isError,
  isSuccess,
  error
} = useDeleteMany({
  path: 'users',
  onSuccess: (response) => {
    console.log(`批量删除成功，共删除 ${response.meta.deleted} 个用户`)
    // 清空选择
    selectedUserIds.value = []
  },
  onError: (error) => {
    console.error('批量删除失败:', error.message)
  }
})

function handleBatchDelete() {
  if (selectedUserIds.value.length === 0) {
    alert('请先选择要删除的用户')
    return
  }

  // 确认删除
  if (confirm(`确定要删除选中的 ${selectedUserIds.value.length} 个用户吗？`)) {
    batchDeleteUsers({
      ids: selectedUserIds.value
    })
  }
}

// 删除所有非活跃用户
function deleteInactiveUsers() {
  const inactiveUsers = users.value.filter(user => user.status === 'inactive')
  if (inactiveUsers.length === 0) {
    alert('没有非活跃用户需要删除')
    return
  }

  if (confirm(`确定要删除 ${inactiveUsers.length} 个非活跃用户吗？`)) {
    batchDeleteUsers({
      ids: inactiveUsers.map(user => user.id)
    })
  }
}
```

## 软删除示例

```js
import { useDeleteMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedItems = ref([])

const { mutate: softDeleteItems, isLoading } = useDeleteMany({
  path: 'articles',
  meta: {
    soft: true // 启用软删除
  },
  onSuccess: (response) => {
    console.log('软删除成功:', response)
    // 从列表中移除但不会真正删除数据
    selectedItems.value = []
  }
})

// 软删除选中文章
function handleSoftDelete() {
  softDeleteItems({
    ids: selectedItems.value.map(item => item.id),
    meta: {
      reason: '批量归档',
      deleted_by: 'admin'
    }
  })
}

// 永久删除（硬删除）
const { mutate: permanentDelete } = useDeleteMany({
  path: 'articles',
  meta: {
    force: true // 强制删除
  }
})

function handlePermanentDelete() {
  if (confirm('确定要永久删除这些文章吗？此操作不可恢复！')) {
    permanentDelete({
      ids: selectedItems.value.map(item => item.id)
    })
  }
}
```

## 批量清理示例

```js
import { useDeleteMany } from '@duxweb/dvha-core'

// 清理过期数据
const { mutate: cleanupExpired, isLoading: isCleaningUp } = useDeleteMany({
  path: 'temp-files',
  onSuccess: (response) => {
    console.log(`清理完成，删除了 ${response.meta.deleted} 个过期文件`)
  }
})

// 清理垃圾箱
const { mutate: emptyTrash, isLoading: isEmptyingTrash } = useDeleteMany({
  path: 'trash',
  meta: {
    force: true
  }
})

function handleCleanup() {
  // 获取过期文件 ID 列表
  const expiredFileIds = getExpiredFileIds()

  if (expiredFileIds.length > 0) {
    cleanupExpired({
      ids: expiredFileIds
    })
  }
  else {
    alert('没有过期文件需要清理')
  }
}

function handleEmptyTrash() {
  if (confirm('确定要清空垃圾箱吗？此操作不可恢复！')) {
    emptyTrash({
      ids: trashItems.value.map(item => item.id)
    })
  }
}

// 定期清理
function scheduleCleanup() {
  setInterval(() => {
    const expiredIds = getExpiredFileIds()
    if (expiredIds.length > 0) {
      cleanupExpired({ ids: expiredIds })
    }
  }, 24 * 60 * 60 * 1000) // 每24小时清理一次
}
```

## 多数据提供者示例

```js
import { useDeleteMany } from '@duxweb/dvha-core'

// 使用默认数据提供者批量删除用户
const { mutate: deleteUsers } = useDeleteMany({
  path: 'users'
})

// 使用分析服务批量删除报告
const { mutate: deleteReports } = useDeleteMany({
  path: 'reports',
  providerName: 'analytics'
})

// 使用支付服务批量删除订单
const { mutate: deleteOrders } = useDeleteMany({
  path: 'orders',
  providerName: 'payment'
})

// 执行不同的批量删除操作
function handleBatchDeleteUsers() {
  deleteUsers({
    ids: [1, 2, 3]
  })
}

function handleBatchDeleteReports() {
  deleteReports({
    ids: ['report-1', 'report-2']
  })
}

function handleBatchDeleteOrders() {
  deleteOrders({
    ids: ['order-1', 'order-2']
  })
}
```

## 批量删除验证示例

```js
import { useDeleteMany } from '@duxweb/dvha-core'
import { ref } from 'vue'

const selectedProducts = ref([])

const { mutate: deleteProducts, isLoading } = useDeleteMany({
  path: 'products',
  onSuccess: (response) => {
    console.log('批量删除成功:', response)
    if (response.meta.warnings) {
      alert(`删除完成，但有以下警告:\n${response.meta.warnings.join('\n')}`)
    }
  },
  onError: (error) => {
    console.error('批量删除失败:', error)
    // 显示具体的失败原因
    if (error.conflicts) {
      alert(`以下产品无法删除:\n${error.conflicts.map(c => c.reason).join('\n')}`)
    }
  }
})

// 删除前验证
function validateBeforeDelete(productIds) {
  const conflicts = []

  productIds.forEach((id) => {
    const product = products.value.find(p => p.id === id)
    if (product) {
      // 检查是否有关联订单
      if (product.order_count > 0) {
        conflicts.push(`产品 "${product.name}" 存在关联订单，无法删除`)
      }
      // 检查是否在购物车中
      if (product.in_cart_count > 0) {
        conflicts.push(`产品 "${product.name}" 在用户购物车中，无法删除`)
      }
    }
  })

  return conflicts
}

function handleValidatedDelete() {
  const selectedIds = selectedProducts.value.map(p => p.id)
  const conflicts = validateBeforeDelete(selectedIds)

  if (conflicts.length > 0) {
    alert(`删除验证失败:\n${conflicts.join('\n')}`)
    return
  }

  if (confirm(`确定要删除选中的 ${selectedIds.length} 个产品吗？`)) {
    deleteProducts({
      ids: selectedIds,
      meta: {
        cascade: false, // 不级联删除关联数据
        validate: true // 服务端再次验证
      }
    })
  }
}
```

## 高级配置示例

```js
import { useDeleteMany } from '@duxweb/dvha-core'

const { mutate: batchDeleteUsers, isLoading, error } = useDeleteMany({
  path: 'users',
  meta: {
    soft: true,
    backup: true, // 删除前备份
    notification: true, // 发送通知
    batchOptions: {
      size: 20, // 每批20条
      parallel: false, // 不并行处理
      continueOnError: true // 遇到错误继续处理其他记录
    }
  },
  providerName: 'userService',
  options: {
    onMutate: () => {
      console.log('开始批量删除用户...')
    },
    onSettled: () => {
      console.log('批量删除操作完成')
    }
  },
  onSuccess: (data) => {
    console.log('用户批量删除成功:', data)
    const { total, deleted, failed } = data.meta
    console.log(`总计: ${total}, 成功: ${deleted}, 失败: ${failed}`)
  },
  onError: (error) => {
    console.error('批量删除用户失败:', error)
    if (error.details) {
      console.log('失败详情:', error.details)
    }
  }
})

function handleAdvancedBatchDelete() {
  if (confirm('确定要删除选中的用户吗？将会进行软删除并备份数据。')) {
    batchDeleteUsers({
      ids: [1, 2, 3, 4, 5],
      meta: {
        reason: '管理员批量清理',
        notify_users: false,
        backup_location: 'user_backups_2024'
      }
    })
  }
}
```

## 响应格式

```json
{
  "message": "批量删除成功",
  "data": null,
  "meta": {
    "total": 3,
    "deleted": 3,
    "failed": 0,
    "batch_id": "batch_delete_20240120_001",
    "warnings": [],
    "backup_id": "backup_20240120_001"
  }
}
```

## Vue 组件完整示例

```vue
<script setup lang="ts">
import { useDeleteMany } from '@duxweb/dvha-core'
import { computed, ref } from 'vue'

const selectedItems = ref([])
const deleteMode = ref('soft') // 'soft' | 'hard'
const deleteReason = ref('')

const {
  mutate: batchDelete,
  isLoading,
  isError,
  isSuccess,
  error
} = useDeleteMany({
  path: 'documents',
  onSuccess: (response) => {
    console.log('批量删除成功:', response)
    // 重置选择
    selectedItems.value = []
    deleteReason.value = ''
  }
})

const canDelete = computed(() => {
  return selectedItems.value.length > 0
    && (deleteMode.value === 'soft' || deleteReason.value.trim() !== '')
})

function getDeleteConfig() {
  const config = {
    ids: selectedItems.value.map(item => item.id),
    meta: {
      soft: deleteMode.value === 'soft',
      reason: deleteReason.value
    }
  }

  if (deleteMode.value === 'hard') {
    config.meta.force = true
    config.meta.backup = true
  }

  return config
}

function handleBatchDelete() {
  if (!canDelete.value) {
    alert('请选择要删除的项目并填写删除原因')
    return
  }

  const action = deleteMode.value === 'soft' ? '软删除' : '永久删除'
  const warning = deleteMode.value === 'hard' ? '\n注意：此操作不可恢复！' : ''

  if (confirm(`确定要${action}选中的 ${selectedItems.value.length} 个文档吗？${warning}`)) {
    batchDelete(getDeleteConfig())
  }
}

function selectAll() {
  selectedItems.value = [...availableItems.value]
}

function clearSelection() {
  selectedItems.value = []
}

// 快速删除操作
function quickDelete(type) {
  let itemsToDelete = []

  switch (type) {
    case 'expired':
      itemsToDelete = availableItems.value.filter(item =>
        new Date(item.expires_at) < new Date()
      )
      break
    case 'draft':
      itemsToDelete = availableItems.value.filter(item =>
        item.status === 'draft'
      )
      break
    case 'trash':
      itemsToDelete = availableItems.value.filter(item =>
        item.status === 'deleted'
      )
      deleteMode.value = 'hard'
      break
  }

  if (itemsToDelete.length === 0) {
    alert(`没有找到需要删除的${type}项目`)
    return
  }

  selectedItems.value = itemsToDelete
  handleBatchDelete()
}
</script>

<template>
  <div class="batch-delete">
    <h2>批量删除管理</h2>

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

    <!-- 删除配置 -->
    <div class="delete-config">
      <h3>删除配置</h3>

      <div class="form-group">
        <label>删除模式:</label>
        <div class="radio-group">
          <label>
            <input
              v-model="deleteMode"
              type="radio"
              value="soft"
            >
            软删除（可恢复）
          </label>
          <label>
            <input
              v-model="deleteMode"
              type="radio"
              value="hard"
            >
            永久删除（不可恢复）
          </label>
        </div>
      </div>

      <div v-if="deleteMode === 'hard'" class="form-group">
        <label>删除原因 <span class="required">*</span>:</label>
        <textarea
          v-model="deleteReason"
          placeholder="请输入永久删除的原因..."
          class="form-textarea"
          rows="3"
        />
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="actions-grid">
        <button
          class="btn btn-warning"
          @click="quickDelete('expired')"
        >
          删除过期项目
        </button>
        <button
          class="btn btn-info"
          @click="quickDelete('draft')"
        >
          删除草稿
        </button>
        <button
          class="btn btn-danger"
          @click="quickDelete('trash')"
        >
          清空垃圾箱
        </button>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="main-actions">
      <button
        :disabled="!canDelete || isLoading"
        class="btn"
        :class="[deleteMode === 'hard' ? 'btn-danger' : 'btn-warning']" @click="handleBatchDelete"
      >
        {{ isLoading ? '删除中...' : `批量${deleteMode === 'soft' ? '软删除' : '永久删除'}` }}
      </button>
    </div>

    <!-- 状态显示 -->
    <div v-if="isError" class="error">
      删除失败: {{ error?.message }}
    </div>

    <div v-if="isSuccess" class="success">
      批量删除成功！
    </div>

    <!-- 删除预览 -->
    <div v-if="selectedItems.length > 0" class="preview">
      <h4>删除预览</h4>
      <div class="preview-info">
        <p>操作类型: {{ deleteMode === 'soft' ? '软删除' : '永久删除' }}</p>
        <p>影响项目: {{ selectedItems.length }} 个</p>
        <p v-if="deleteReason">
          删除原因: {{ deleteReason }}
        </p>
      </div>

      <div v-if="deleteMode === 'hard'" class="warning">
        ⚠️ 警告：永久删除操作不可恢复，请谨慎操作！
      </div>
    </div>
  </div>
</template>

<style scoped>
.batch-delete {
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

.delete-config {
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

.required {
  color: #dc3545;
}

.radio-group {
  display: flex;
  gap: 15px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.form-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.quick-actions {
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.main-actions {
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

.btn-secondary {
  background: #6c757d;
  color: white;
}
.btn-warning {
  background: #ffc107;
  color: #212529;
}
.btn-info {
  background: #17a2b8;
  color: white;
}
.btn-danger {
  background: #dc3545;
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
  margin-bottom: 20px;
}

.preview-info {
  margin-bottom: 10px;
}

.warning {
  color: #856404;
  background: #fff3cd;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
}
</style>
```

## 工作流程

1. **调用 mutate**: 传入要删除的 ID 列表
2. **调用数据提供者**: 框架调用配置的数据提供者的 `deleteMany` 方法
3. **批量处理**: 服务器端处理批量删除逻辑
4. **处理响应**:
   - 成功：触发 `onSuccess` 回调，自动失效相关查询缓存
   - 失败：触发 `onError` 回调
5. **缓存更新**: 删除成功后，相关的查询缓存会自动失效并重新获取

## 注意事项

- 批量删除通常比逐个删除更高效，减少网络请求次数
- 服务器端需要支持批量删除接口
- 支持软删除和硬删除两种模式
- 删除成功后，框架会自动失效相关的查询缓存
- 支持部分成功模式，可以通过响应数据查看详细结果
- 硬删除操作应该有额外的确认和权限检查
- 适合清理、归档、批量管理等场景
- 建议在删除前进行数据备份
- 可以配合权限控制确保安全性
  </rewritten_file>
