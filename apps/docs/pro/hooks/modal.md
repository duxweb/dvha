# useModal - 模态框管理

`useModal` 是一个模态框管理 Hook，提供异步组件加载的模态对话框调用方法，适用于表单编辑、内容展示等场景。

## 特性

- **异步组件加载**: 支持动态导入组件，按需加载
- **拖拽支持**: 内置拖拽功能，用户可以拖动模态框
- **Promise 支持**: 基于 Promise 的异步操作

## 基础用法

### 导入

```typescript
import { useModal } from '@duxweb/dvha-pro'
```

### 基本使用

```typescript
const modal = useModal()

// 显示模态框
modal.show({
  title: '编辑用户',
  width: 600,
  component: () => import('./UserEditForm.vue'),
  componentProps: {
    userId: 123
  }
}).then((result) => {
  console.log('模态框返回结果:', result)
}).catch(() => {
  console.log('用户取消了操作')
})
```

## API 参考

### UseModalResult

| 字段 | 类型                                | 说明         |
| ---- | ----------------------------------- | ------------ |
| show | (props: UseModalProps) => Promise\<any\> | 显示模态框 |

### UseModalProps

| 属性名         | 类型                                    | 默认值 | 说明                 |
| -------------- | --------------------------------------- | ------ | -------------------- |
| title          | string                                  | -      | 模态框标题           |
| width          | number \| string                        | -      | 模态框宽度           |
| component      | AsyncComponentLoader \| Component       | -      | 要显示的组件         |
| componentProps | Record\<string, any\>                   | -      | 传递给组件的属性     |
| draggable      | boolean                                 | -      | 是否可拖拽           |
| modalProps     | ModalProps                              | -      | Naive UI Modal 属性  |

## 使用示例

### 基础模态框

```vue
<script setup>
import { useModal } from '@duxweb/dvha-pro'
import { NButton } from 'naive-ui'

const modal = useModal()

// 显示用户编辑模态框
function showUserEdit(userId) {
  modal.show({
    title: '编辑用户',
    width: 600,
    component: () => import('./components/UserEditForm.vue'),
    componentProps: {
      userId
    }
  }).then((result) => {
    console.log('编辑结果:', result)
  }).catch(() => {
    console.log('用户取消编辑')
  })
}

// 显示数据查看模态框
function showDataViewer(data) {
  modal.show({
    title: '数据详情',
    width: 800,
    component: () => import('./components/DataViewer.vue'),
    componentProps: {
      data
    }
  })
}
</script>

<template>
  <div class="flex gap-4">
    <NButton @click="showUserEdit(123)">
      编辑用户
    </NButton>
    <NButton @click="showDataViewer({ id: 1, name: 'test' })">
      查看数据
    </NButton>
  </div>
</template>
```

### 自定义配置

```vue
<script setup>
import { useModal } from '@duxweb/dvha-pro'

const modal = useModal()

function showCustomModal() {
  modal.show({
    title: '自定义模态框',
    width: '80%',
    draggable: false,
    component: () => import('./CustomComponent.vue'),
    modalProps: {
      closeOnEsc: false,
      maskClosable: false
    }
  })
}
</script>
```
