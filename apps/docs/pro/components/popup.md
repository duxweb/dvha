# 弹窗组件

弹窗组件提供了模态框、模态框页面、模态框标签页等弹窗容器，支持复杂的内容展示和交互。

## 导入

```typescript
import {
  DuxModal,
  DuxModalPage,
  DuxModalTab
} from '@duxweb/dvha-pro'
```

## 组件总览

DVHA Pro 提供以下弹窗组件：

- **DuxModal** - 模态框容器组件
- **DuxModalPage** - 模态框页面组件
- **DuxModalTab** - 模态框标签页组件
- **useModal** - 模态框管理 Hook

## DuxModal 模态框容器

基于 Naive UI Modal 封装的模态框容器组件，支持异步组件加载和拖拽功能。

### 属性

| 属性名         | 类型                              | 默认值 | 说明               |
| -------------- | --------------------------------- | ------ | ------------------ |
| title          | string                            | -      | 模态框标题         |
| component      | AsyncComponentLoader \| Component | -      | 模态框内容组件     |
| componentProps | Record<string, any>               | -      | 传递给组件的属性   |
| width          | number \| string                  | 500    | 模态框宽度         |
| modalProps     | ModalProps                        | -      | Naive UI Modal属性 |
| draggable      | boolean                           | true   | 是否可拖拽         |

### 事件处理

组件内部会自动为传入的组件添加以下事件处理：

- `onConfirm`: 确认回调，用于返回结果
- `onClose`: 关闭回调，用于取消操作

### 基础用法

```vue
<script setup lang="ts">
import { useModal } from '@duxweb/dvha-pro'
import TestComponent from './TestComponent.vue'

const modal = useModal()

async function showModal() {
  try {
    const result = await modal.show({
      title: '测试模态框',
      component: TestComponent,
      width: 600,
      componentProps: {
        data: 'test data'
      }
    })
    console.log('模态框返回结果:', result)
  }
  catch (error) {
    console.log('模态框被取消')
  }
}
</script>

<template>
  <div>
    <n-button @click="showModal">
      打开模态框
    </n-button>
  </div>
</template>
```

### 异步组件加载

```typescript
import { useModal } from '@duxweb/dvha-pro'

const modal = useModal()

// 使用动态导入
await modal.show({
  title: '异步组件',
  component: () => import('./AsyncComponent.vue'),
  width: '80%'
})
```

### 自定义 Modal 属性

```typescript
await modal.show({
  title: '自定义模态框',
  component: MyComponent,
  modalProps: {
    maskClosable: false,
    closable: false,
    preset: 'card'
  }
})
```

## DuxModalPage 模态框页面

模态框页面组件，提供标准的页面布局结构，包含标题栏、内容区域和底部操作区域。

### 属性

| 属性名    | 类型     | 默认值 | 说明         |
| --------- | -------- | ------ | ------------ |
| title     | string   | ''     | 页面标题     |
| draggable | boolean  | false  | 是否可拖拽   |
| handle    | string   | -      | 拖拽手柄类名 |
| onClose   | Function | -      | 关闭回调     |

### 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 页面内容 |
| footer  | 底部操作 |

### 基础用法

```vue
<script setup lang="ts">
interface Props {
  title?: string
  onClose?: () => void
  onConfirm?: (data: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '模态框标题'
})

const handle = ref()

function onClose() {
  props.onClose?.()
}

function onConfirm() {
  props.onConfirm?.({ message: '操作成功' })
}
</script>

<template>
  <DuxModalPage
    :title="title"
    :draggable="true"
    :handle="handle"
    @close="onClose"
  >
    <div>
      <!-- 页面内容 -->
      <p>这里是模态框的主要内容</p>
    </div>

    <template #footer>
      <n-button @click="onClose">
        取消
      </n-button>
      <n-button type="primary" @click="onConfirm">
        确认
      </n-button>
    </template>
  </DuxModalPage>
</template>
```

## DuxModalTab 模态框标签页

模态框标签页组件，提供标签页布局的模态框，适用于多个相关页面的切换。

### 属性

| 属性名     | 类型               | 默认值 | 说明         |
| ---------- | ------------------ | ------ | ------------ |
| draggable  | boolean            | false  | 是否可拖拽   |
| defaultTab | string             | '0'    | 默认标签页   |
| handle     | Ref\<HTMLElement\> | -      | 拖拽手柄引用 |
| onClose    | Function           | -      | 关闭回调     |

### 插槽

| 插槽名  | 说明       |
| ------- | ---------- |
| default | 标签页内容 |
| footer  | 底部操作   |

### 基础用法

```vue
<script setup lang="ts">
const handleRef = ref()

function onClose() {
  // 关闭逻辑
}

function onSave() {
  // 保存逻辑
}
</script>

<template>
  <DuxModalTab
    :draggable="true"
    default-tab="user"
    :handle="handleRef"
    @close="onClose"
  >
    <n-tab-pane name="user" tab="用户信息">
      <UserInfo />
    </n-tab-pane>
    <n-tab-pane name="settings" tab="设置">
      <UserSettings />
    </n-tab-pane>

    <template #footer>
      <n-button @click="onClose">
        取消
      </n-button>
      <n-button type="primary" @click="onSave">
        保存
      </n-button>
    </template>
  </DuxModalTab>
</template>
```

## useModal Hook

模态框管理 Hook，提供便捷的模态框调用方法。

### 接口定义

```typescript
interface UseModalResult {
  show: (props: UseModalProps) => Promise<any>
}

interface UseModalProps {
  title?: string
  width?: number | string
  component: AsyncComponentLoader<any> | Component
  componentProps?: Record<string, any>
  draggable?: boolean
  modalProps?: ModalProps
}
```

### 基础用法

```typescript
import { useModal } from '@duxweb/dvha-pro'

const modal = useModal()

// 显示模态框
const result = await modal.show({
  title: '编辑用户',
  component: () => import('./UserForm.vue'),
  width: 800,
  componentProps: {
    userId: 123
  }
})
```

### 处理返回值

```typescript
try {
  const result = await modal.show({
    title: '表单提交',
    component: FormComponent
  })

  // 处理成功结果
  console.log('提交成功:', result)
}
catch (error) {
  // 处理取消或错误
  console.log('操作被取消')
}
```

## 最佳实践

### 1. 选择合适的组件类型

- **简单表单** - 使用 DuxModalPage
- **多标签页** - 使用 DuxModalTab
- **复杂布局** - 直接使用 DuxModal

### 2. 设置合适的尺寸

- `width: 400` - 简单表单
- `width: 600` - 标准表单
- `width: 800` - 复杂表单
- `width: 1000` - 详情展示

### 3. 数据传递

通过 `componentProps` 传递数据和事件回调。

### 4. 用户体验

- 提供清晰的标题
- 处理加载状态
- 合理的动画效果
- 适当的拖拽功能
