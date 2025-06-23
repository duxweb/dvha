# 第一个页面

本教程将带你从初始化后的 DVHA Pro 项目开始，创建一个简单的 Hello 页面。

## 📋 前置条件

确保你已经完成了以下步骤：
- 按照 [快速开始](/pro/getting-started) 初始化了项目
- 按照 [安装指南](/pro/installation) 安装了依赖
- 项目能够正常启动

## 🎯 目标效果

我们将创建一个简单的 Hello 页面，包含：
- 📄 欢迎信息展示
- 🎨 使用 DVHA Pro 组件

## 📂 项目结构回顾

初始化后的项目结构：
```
my-admin/
├── src/
│   ├── main.ts          # 应用入口
│   ├── App.vue          # 根组件
│   └── pages/
│       └── home.vue     # 首页
├── package.json
└── vite.config.ts
```

## 🔧 第一步：配置菜单

首先，我们需要在 `main.ts` 中添加 Hello 页面菜单：

```typescript{7-15}
import { createApp } from 'vue'
import { createDux } from '@duxweb/dvha-core'
import { createDuxPro } from '@duxweb/dvha-pro'
import App from './App.vue'

const app = createApp(App)

// 配置菜单
const config = {
  menus: [
    {
      name: 'hello',
      title: 'Hello 页面',
      icon: 'i-tabler:heart',
      path: '/hello'
    }
  ]
}

app.use(createDux(config))
app.use(createDuxPro())
app.mount('#app')
```

::: tip 图标说明
我们使用了 Tabler Icons，DVHA Pro 已经内置支持。你可以在 [Tabler Icons](https://tabler.io/icons) 找到更多图标。
:::

## 📄 第二步：创建页面文件

在 `src/pages/` 目录下创建 `hello.vue` 文件：

```vue
<script setup>
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NIcon, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const greeting = ref('Hello')

function showMessage() {
  message.success('你好！欢迎使用 DVHA Pro！')
}

function changeGreeting() {
  const greetings = ['Hello', '你好', 'Bonjour', 'Hola', 'こんにちは']
  const current = greetings.indexOf(greeting.value)
  greeting.value = greetings[(current + 1) % greetings.length]
}
</script>

<template>
  <div class="p-6">
    <DuxCard>
      <template #header>
        <div class="flex items-center gap-3">
          <NIcon size="24" color="#18a058">
            <i class="i-tabler:heart" />
          </NIcon>
          <h1 class="text-2xl font-bold">
            Hello DVHA Pro
          </h1>
        </div>
      </template>

      <template #default>
        <div class="space-y-4">
          <p class="text-lg text-gray-600">
            🎉 恭喜！你已经成功创建了第一个 DVHA Pro 页面。
          </p>

          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-medium text-blue-900 mb-2">
              ✨ 你学会了：
            </h3>
            <ul class="text-blue-800 space-y-1">
              <li>• 配置菜单项</li>
              <li>• 创建页面文件</li>
              <li>• 使用 DVHA Pro 组件</li>
            </ul>
          </div>

          <div class="flex gap-3 pt-4">
            <NButton type="primary" @click="showMessage">
              点击我试试
            </NButton>
            <NButton @click="changeGreeting">
              {{ greeting }}
            </NButton>
          </div>
        </div>
      </template>
    </DuxCard>
  </div>
</template>
```

## 🚀 第三步：启动项目

现在启动项目查看效果：

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173`，你应该能看到：

1. 左侧菜单中出现了"Hello 页面"选项
2. 点击菜单可以进入 Hello 页面
3. 页面显示欢迎信息和两个按钮

## 🎨 组件说明

### DuxCard
卡片组件，包含：
- `#header` 插槽：卡片头部，显示标题和图标
- `#default` 插槽：卡片内容，显示主要信息

### NButton
Naive UI 按钮组件，支持：
- 不同类型（primary、default 等）
- 点击事件处理

### useMessage
Naive UI 消息提示 Hook，用于显示成功、错误等消息。

## 🎯 下一步

恭喜！你已经成功创建了第一个页面。接下来你可以：

1. **添加更多页面**：参考本教程创建更多页面
2. **使用表格组件**：查看 [表格组件文档](/pro/components/table) 创建表格页面
3. **集成表单组件**：查看 [表单组件文档](/pro/components/form) 创建表单页面
4. **连接后端 API**：查看 [数据操作文档](/hooks/data/useList) 学习数据交互

## 💡 常见问题

::: details 菜单没有显示怎么办？
检查 `main.ts` 中的菜单配置是否正确，确保 `path` 与页面路由匹配。
:::

::: details 组件样式不正确怎么办？
确保已经正确导入了 DVHA Pro 的样式文件：
```typescript
import '@duxweb/dvha-pro/style.css'
```
:::

::: details 如何自定义主题？
查看 [配置说明](/pro/configuration) 了解主题定制方法。
:::

## 📚 相关文档

- [组件库总览](/pro/components/)
- [Hooks 文档](/pro/hooks/)
- [配置说明](/pro/configuration)
