# useOverlay

`useOverlay` hook 提供基础的弹窗逻辑管理，支持异步加载弹窗组件，是构建各种浮动层的基础工具。

## 功能特点

- 🎯 **基础逻辑** - 仅提供弹窗的基本显示和管理逻辑
- 🔧 **无样式约束** - 不包含任何预设样式，完全由开发者控制
- 📦 **异步加载** - 支持组件的动态导入和按需加载
- 🛠️ **高度扩展** - 可基于此构建 Modal、Dialog、灯箱等各种浮动层
- 🎨 **灵活定制** - 弹窗组件的样式和行为完全自定义
- ⚡ **轻量级** - 专注核心功能，保持最小化实现

## 接口关系

该hook基于 @overlastic/vue 库，提供Vue 3弹窗管理的基础能力。

```js
// 弹窗配置接口
interface UseOverlayProps {
  component?: () => any                    // 异步加载的弹窗组件
  componentProps?: Record<string, any>     // 传递给组件的属性
}
```

## 使用方法

```js
import { useOverlay } from '@duxweb/dvha-core'

const { show } = useOverlay()

// 显示弹窗
const overlayInstance = show({
  component: () => import('./MyOverlay.vue'),
  componentProps: {
    title: '标题',
    onClose: () => overlayInstance.close()
  }
})
```

## 返回值

| 字段   | 类型       | 说明                         |
| ------ | ---------- | ---------------------------- |
| `show` | `Function` | 显示弹窗的方法，返回弹窗实例 |

## 基础使用示例

```js
import { useOverlay } from '@duxweb/dvha-core'

const { show } = useOverlay()

// 最简单的弹窗
function showSimpleOverlay() {
  const instance = show({
    component: () => import('./SimpleOverlay.vue'),
    componentProps: {
      message: '这是一个简单的弹窗',
      onClose: () => instance.close()
    }
  })
}
```

## 基础弹窗组件示例

```vue
<!-- SimpleOverlay.vue -->
<script setup>
interface Props {
  title?: string
  message?: string
  onClose?: () => void
}

const props = defineProps<Props>()

function handleClose() {
  props.onClose?.()
}
</script>

<template>
  <!-- 完全自定义的弹窗样式 -->
  <div class="custom-overlay">
    <div class="overlay-backdrop" @click="handleClose">
      <div class="overlay-content" @click.stop>
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <button @click="handleClose">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 完全自定义的样式 - 可以是任何设计 */
.custom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.overlay-backdrop {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
```

## 扩展示例 - Modal 组件

```js
// 基于 useOverlay 构建 Modal 组件
import { useOverlay } from '@duxweb/dvha-core'

export function useModal() {
  const { show } = useOverlay()

  const showModal = (options) => {
    return show({
      component: () => import('./components/Modal.vue'),
      componentProps: options
    })
  }

  return { showModal }
}

// 使用
const { showModal } = useModal()

showModal({
  title: '模态框',
  content: '这是模态框内容',
  width: '500px',
  onConfirm: () => console.log('确认'),
  onCancel: () => console.log('取消')
})
```

## 扩展示例 - Dialog 组件

```js
// 基于 useOverlay 构建 Dialog 组件
import { useOverlay } from '@duxweb/dvha-core'

export function useDialog() {
  const { show } = useOverlay()

  const confirm = (title, message) => {
    return new Promise((resolve) => {
      show({
        component: () => import('./components/Dialog.vue'),
        componentProps: {
          type: 'confirm',
          title,
          message,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        }
      })
    })
  }

  const alert = (title, message) => {
    return new Promise((resolve) => {
      show({
        component: () => import('./components/Dialog.vue'),
        componentProps: {
          type: 'alert',
          title,
          message,
          onOk: () => resolve()
        }
      })
    })
  }

  return { confirm, alert }
}
```

## 扩展示例 - 图片灯箱

```js
// 基于 useOverlay 构建图片灯箱
import { useOverlay } from '@duxweb/dvha-core'

export function useLightbox() {
  const { show } = useOverlay()

  const showImage = (imageUrl, options = {}) => {
    return show({
      component: () => import('./components/Lightbox.vue'),
      componentProps: {
        imageUrl,
        ...options
      }
    })
  }

  const showGallery = (images, startIndex = 0) => {
    return show({
      component: () => import('./components/Gallery.vue'),
      componentProps: {
        images,
        startIndex
      }
    })
  }

  return { showImage, showGallery }
}
```

## 扩展示例 - 抽屉组件

```js
// 基于 useOverlay 构建抽屉组件
import { useOverlay } from '@duxweb/dvha-core'

export function useDrawer() {
  const { show } = useOverlay()

  const showDrawer = (options) => {
    return show({
      component: () => import('./components/Drawer.vue'),
      componentProps: {
        placement: 'right', // 'left' | 'right' | 'top' | 'bottom'
        width: '300px',
        ...options
      }
    })
  }

  return { showDrawer }
}
```

## 自定义浮动层组件示例

```vue
<!-- CustomFloating.vue -->
<script setup>
import { computed, onMounted, ref } from 'vue'

interface Props {
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  size?: 'small' | 'medium' | 'large' | string
  shape?: 'rect' | 'circle' | 'rounded'
  animation?: 'fade' | 'slide' | 'zoom' | 'none'
  mask?: boolean
  maskClosable?: boolean
  closable?: boolean
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  position: 'center',
  size: 'medium',
  shape: 'rect',
  animation: 'fade',
  mask: true,
  maskClosable: true,
  closable: true
})

const visible = ref(false)

const contentStyle = computed(() => {
  // 根据 props 动态生成样式
  const styles = {}

  // 位置样式
  switch (props.position) {
    case 'top':
      Object.assign(styles, { top: '20px', left: '50%', transform: 'translateX(-50%)' })
      break
    case 'bottom':
      Object.assign(styles, { bottom: '20px', left: '50%', transform: 'translateX(-50%)' })
      break
    // ... 其他位置
  }

  // 大小样式
  if (typeof props.size === 'string' && !['small', 'medium', 'large'].includes(props.size)) {
    styles.width = props.size
  }

  return styles
})

function handleClose() {
  visible.value = false
  props.onClose?.()
}

onMounted(() => {
  visible.value = true
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="floating-container">
      <!-- 可以是任何样式：圆形、不规则形状、动画效果等 -->
      <div
        class="floating-content"
        :style="contentStyle"
        @click.stop
      >
        <slot />

        <!-- 自定义关闭按钮 -->
        <button
          v-if="closable"
          class="close-btn"
          :style="closeButtonStyle"
          @click="handleClose"
        >
          ×
        </button>
      </div>

      <!-- 可选的背景蒙层 -->
      <div
        v-if="mask"
        class="floating-mask"
        @click="maskClosable && handleClose()"
      />
    </div>
  </Teleport>
</template>

<style scoped>
.floating-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.floating-content {
  position: absolute;
  background: white;
  /* 样式完全可自定义 */
}

.floating-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

/* 动画效果可自定义 */
.floating-content {
  transition: all 0.3s ease;
}
</style>
```

## 组合使用示例

```js
// 在一个组件中使用多种浮动层
import { useOverlay } from '@duxweb/dvha-core'

export default {
  setup() {
    const { show } = useOverlay()

    // 显示不同类型的浮动层
    const showNotification = (message, type = 'info') => {
      show({
        component: () => import('./Notification.vue'),
        componentProps: { message, type }
      })
    }

    const showTooltip = (content, targetEl) => {
      show({
        component: () => import('./Tooltip.vue'),
        componentProps: { content, targetEl }
      })
    }

    const showPopover = (content, trigger) => {
      show({
        component: () => import('./Popover.vue'),
        componentProps: { content, trigger }
      })
    }

    return {
      showNotification,
      showTooltip,
      showPopover
    }
  }
}
```

## 与其他UI库集成

```js
// 可以包装其他UI库的组件
import { useOverlay } from '@duxweb/dvha-core'
import { ElDialog } from 'element-plus'

export function useElementOverlay() {
  const { show } = useOverlay()

  const showElementDialog = (options) => {
    return show({
      component: () => Promise.resolve({
        components: { ElDialog },
        template: `
          <el-dialog v-bind="$attrs" @close="onClose">
            <template v-for="(_, slot) of $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </el-dialog>
        `
      }),
      componentProps: options
    })
  }

  return { showElementDialog }
}
```

## 挂载点说明

DVHA 默认将弹窗挂载在 `AppProvider` 中。如果需要自定义挂载位置（例如挂载在框架的主题内），可以使用 `OverlaysProvider` 组件：

```vue
<script setup>
import { OverlaysProvider } from '@overlastic/vue'
</script>

<template>
  <OverlaysProvider>
    <App />
  </OverlaysProvider>
</template>
```

## 最佳实践

### 1. 组件结构化

```js
// 建议按功能组织弹窗组件
const overlayComponents = {
  modal: () => import('./overlays/Modal.vue'),
  dialog: () => import('./overlays/Dialog.vue'),
  drawer: () => import('./overlays/Drawer.vue'),
  lightbox: () => import('./overlays/Lightbox.vue'),
  notification: () => import('./overlays/Notification.vue')
}

function showOverlay(type, props) {
  const { show } = useOverlay()
  return show({
    component: overlayComponents[type],
    componentProps: props
  })
}
```

### 2. 样式约定

```js
// 建议定义一套样式约定
const overlayStyles = {
  zIndex: {
    modal: 1000,
    drawer: 1100,
    notification: 1200,
    tooltip: 1300
  },
  animation: {
    duration: '0.3s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
```

### 3. 类型安全

```typescript
// TypeScript 支持
interface OverlayConfig<T = any> {
  component: () => Promise<any>
  componentProps?: T
}

function createTypedOverlay<T>() {
  const { show } = useOverlay()

  return (config: OverlayConfig<T>) => {
    return show(config)
  }
}
```

## 工作流程

1. **调用 show 方法**: 传入组件导入函数和属性
2. **异步加载组件**: 动态导入指定的弹窗组件
3. **创建实例**: @overlastic/vue 创建弹窗实例
4. **渲染组件**: 渲染加载的组件并传递属性
5. **用户交互**: 用户在自定义的弹窗中进行操作
6. **生命周期管理**: 通过实例控制显示和关闭

## 注意事项

- **无样式依赖**: hook 本身不包含任何样式，需要在组件中自行实现
- **异步加载**: 建议使用 `() => import()` 实现组件的按需加载
- **实例管理**: 返回的实例提供 `close()` 方法用于程序化关闭
- **扩展性优先**: 专注于提供基础能力，具体功能通过扩展实现
- **性能考虑**: 异步加载可以避免不必要的代码打包
- **自定义程度**: 从基础的遮罩到复杂的交互都完全由开发者控制
