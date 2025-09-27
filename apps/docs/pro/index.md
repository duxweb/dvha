# DVHA Pro 版本

::: tip 🚀 企业级中后台前端解决方案
基于 Vue 3 + TypeScript + Naive UI，专为现代化企业应用打造的下一代前端框架
:::

## ✨ 核心特性

::: info 🎯 五大核心特性
**JSON 渲染组件** • **远程动态渲染** • **UnoCSS 运行时** • **移动端自适应** • **开箱即用**
:::

<div class="features-container">

<div class="feature-item">
  <div class="feature-card">
    <div class="feature-icon">🔮</div>
    <div class="feature-title">JSON 渲染组件</div>
  </div>
  <div class="feature-content">
    <ul>
      <li>通过 JSON Schema 配置生成 Vue 组件</li>
      <li>支持复杂的表单、表格、布局渲染</li>
      <li>配置即界面，无需编写模板代码</li>
    </ul>
  </div>
</div>

<div class="feature-item">
  <div class="feature-card">
    <div class="feature-icon">🌐</div>
    <div class="feature-title">远程动态渲染</div>
  </div>
  <div class="feature-content">
    <ul>
      <li>后台输出 Vue 字符串，前端实时渲染</li>
      <li>运行时热更新，无需重新部署</li>
      <li>支持完整的 Vue 3 组件语法</li>
    </ul>
  </div>
</div>

<div class="feature-item">
  <div class="feature-card">
    <div class="feature-icon">⚡</div>
    <div class="feature-title">UnoCSS 运行时</div>
  </div>
  <div class="feature-content">
    <ul>
      <li>按需生成 CSS，极致性能优化</li>
      <li>支持任意 CSS 类名，实时编译</li>
      <li>完整的暗色模式和主题定制</li>
    </ul>
  </div>
</div>

<div class="feature-item">
  <div class="feature-card">
    <div class="feature-icon">📱</div>
    <div class="feature-title">移动端自适应</div>
  </div>
  <div class="feature-content">
    <ul>
      <li>响应式布局，完美适配各种设备</li>
      <li>触摸友好的交互体验</li>
      <li>移动端优化的组件和手势</li>
    </ul>
  </div>
</div>

<div class="feature-item">
  <div class="feature-card">
    <div class="feature-icon">📦</div>
    <div class="feature-title">开箱即用</div>
  </div>
  <div class="feature-content">
    <ul>
      <li>50+ 企业级组件库</li>
      <li>完整的权限和路由系统</li>
      <li>多租户和国际化支持</li>
    </ul>
  </div>
</div>

</div>

<style>
.features-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}

.feature-item {
  display: flex;
  gap: 2.5rem;
  align-items: center;
  min-height: 120px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg-alt) 100%);
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  min-width: 320px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-soft);
}

.feature-icon {
  font-size: 1.8rem;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-1), 0.3);
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.025em;
}

.feature-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.feature-content ul {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
}

.feature-content li {
  position: relative;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  font-size: 0.95rem;
  padding-left: 1.5rem;
  transition: color 0.2s ease;
}

.feature-content li:last-child {
  margin-bottom: 0;
}

.feature-content li::before {
  content: '●';
  color: var(--vp-c-brand-1);
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.8rem;
  line-height: 1.7;
}

.feature-content li:hover {
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .feature-item {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    min-height: auto;
  }

  .feature-card {
    min-width: auto;
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .feature-content {
    align-items: flex-start;
  }
}

@media (prefers-color-scheme: dark) {
  .feature-card {
    background: linear-gradient(135deg, var(--vp-c-bg-alt) 0%, var(--vp-c-bg-elv) 100%);
  }
}
</style>

## 📸 在线演示

::: info 🎮 立即体验完整功能
**Pro 版演示**: [https://duxweb.github.io/dvha/start/](https://duxweb.github.io/dvha/start/)

**账号密码**: 任意输入

:::

<div class="demo-container">
<img src="/show/home.png" width="400" alt="首页仪表盘" />
<img src="/show/stats.png" width="400" alt="数据统计" />
</div>

<style>
.demo-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
}
.demo-container img {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>

## ⚡ 核心亮点

::: info 🎯 三大核心优势
**后台驱动渲染** • **运行时CSS生成** • **层层动态配合**
:::

### 🔮 后台驱动的动态渲染

::: code-group

```php [后台输出Vue组件]
// PHP 后台直接输出完整的 Vue 组件
class DashboardController {
  public function getComponent() {
    return [
      'content' => '
        <template>
          <div class="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <h2 class="text-2xl font-bold text-white mb-4">{{ title }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="item in stats"
                :key="item.id"
                class="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-all"
              >
                <div class="text-white/80 text-sm">{{ item.label }}</div>
                <div class="text-2xl font-bold text-white">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </template>

        <script setup>
        import { useList } from "@duxweb/dvha-core"

        const { data: stats } = useList("dashboard/stats")
        const title = "实时数据看板"
        </script>
      ',
      'type' => 'vue'
    ];
  }
}
```

```typescript [前端自动渲染]
// 路由配置 - 指定远程组件
{
  name: 'dashboard.realtime',
  path: 'dashboard/realtime',
  loader: 'remote',
  meta: {
    path: '/api/dashboard/component'
  }
}

// 🎉 后台更新组件，前端立即生效
// 🎨 UnoCSS 类名实时编译生成
// ⚡ 无需重新部署，热更新支持
```

```json [JSON Schema 配置]
// 纯配置方式，同样支持 UnoCSS
{
  "tag": "div",
  "attrs": {
    "class": "flex flex-col gap-4 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl"
  },
  "children": [
    {
      "tag": "h3",
      "attrs": {
        "class": "text-xl font-semibold text-white"
      },
      "children": "{{ pageTitle }}"
    },
    {
      "tag": "div",
      "attrs": {
        "v-for": "item in dataList",
        "class": "bg-white/10 backdrop-blur-md rounded-lg p-4 hover:bg-white/20 transition-colors duration-300"
      },
      "children": "{{ item.content }}"
    }
  ]
}
```

:::

### 🎨 运行时CSS动态生成

::: code-group

```vue [后台组件中的UnoCSS]
<!-- 后台返回的Vue组件，包含任意UnoCSS类名 -->
<template>
  <div
    class="
    container mx-auto px-4 py-8
    bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600
    dark:from-gray-800 dark:via-gray-900 dark:to-black
    rounded-3xl shadow-2xl
    transform hover:scale-105 transition-all duration-500
  "
  >
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="card in cardList"
        class="
          bg-white/20 dark:bg-black/30
          backdrop-blur-xl border border-white/30
          rounded-2xl p-6 shadow-lg
          hover:shadow-2xl hover:bg-white/30
          transition-all duration-300 ease-out
          group cursor-pointer
        "
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors">
            {{ card.title }}
          </h4>
        </div>
        <p class="text-white/80 text-sm leading-relaxed">
          {{ card.description }}
        </p>
      </div>
    </div>
  </div>
</template>
```

```javascript [实时CSS编译]
// 🚀 当后台返回包含新CSS类名的组件时
// UnoCSS 引擎自动检测并生成对应样式

// 例如后台新增了这些类名：
// "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
// "animate-bounce hover:animate-pulse"
// "backdrop-blur-3xl"

// UnoCSS 立即生成：
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--un-gradient-stops));
}
.from-pink-500 {
  --un-gradient-from: #ec4899;
}
.animate-bounce {
  animation: bounce 1s infinite;
}
.backdrop-blur-3xl {
  backdrop-filter: blur(64px);
}

// 🎉 样式即时生效，无需预定义！
```

```css [自动样式注入]
/* UnoCSS 运行时自动注入到页面 */
<style data-hash="abc123">
.container { width: 100%; }
@media (min-width: 640px) {
  .container { max-width: 640px; }
}
.mx-auto { margin-left: auto; margin-right: auto; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--un-gradient-stops));
}
.from-emerald-400 { --un-gradient-from: #34d399; }
.hover\:scale-105:hover {
  --un-scale-x: 1.05; --un-scale-y: 1.05;
}
/* ... 更多样式自动生成 */
</style>
```

:::

### 🌐 层层动态配合

::: tip 🔥 完整工作流程
1. **后台控制**: PHP/Java等后台语言直接输出Vue组件代码
2. **Vue3渲染**: 前端使用vue3-sfc-loader实时解析和渲染
3. **UnoCSS引擎**: 扫描组件中的类名，运行时生成CSS
4. **样式注入**: 自动将生成的样式注入到页面
5. **热更新**: 后台更新组件，前端立即生效，样式同步更新
:::

```typescript
// 🎯 多层动态示例 - 后台返回包含复杂UnoCSS的组件
const backendResponse = {
  content: `
    <template>
      <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div class="p-8 rounded-2xl shadow-2xl transition-all duration-500 bg-white/10 backdrop-blur-lg">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in dynamicData"
              :key="item.id"
              class="
                group relative overflow-hidden
                bg-gradient-to-r from-cyan-500 to-blue-500
                hover:from-purple-500 hover:to-pink-500
                rounded-xl p-6 cursor-pointer
                transform transition-all duration-300
                hover:scale-110 hover:rotate-2
              "
            >
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-yellow-300">
                {{ item.title }}
              </h3>
              <p class="text-white/80 text-sm">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <script setup>
    import { useList } from '@duxweb/dvha-core'
    const { data: dynamicData } = useList('dynamic/items')
    </script>
  `
}

// ✅ Vue组件解析和渲染  ✅ UnoCSS类名扫描和编译
// ✅ 响应式数据绑定      ✅ 样式热更新
```

这种层层配合让开发变得极其灵活 - 后台开发者可以使用任意UnoCSS类名，前端会自动处理一切！

### 🛠️ 企业级组件库

::: details 📦 50+ 后台管理专用组件

**数据展示**
- `DuxTable` - 高级数据表格 (虚拟滚动、筛选排序)
- `DuxChart` - ECharts 图表封装
- `DuxStats` - 统计卡片和指标

**表单组件**
- `DuxForm` - 智能表单生成器
- `DuxUpload` - 文件上传管理
- `DuxImageCrop` - 图片裁剪处理

**后台特色**
- `DuxAIEditor` - AI 智能编辑器 (GPT集成)
- `DuxRemoteComponent` - 远程组件加载器
- `DuxPermission` - 权限控制组件
:::

## 🆚 适用场景对比

::: details 🎯 点击查看详细对比

### 选择 DVHA Pro 的场景

| 场景 | 传统方案 | DVHA Pro 方案 |
|------|----------|---------------|
| **后台控制界面** | 前端写死模板 | 后台输出Vue字符串 |
| **动态表单** | 前端硬编码 | JSON Schema配置 |
| **权限控制** | 前端判断显隐 | 后台控制组件渲染 |
| **多租户系统** | 多套前端代码 | 一套代码多管理端 |
| **功能更新** | 重新部署前端 | 后台更新组件代码 |

### 技术栈对比

| 对比项 | DVHA Pro | 传统Admin |
|--------|----------|-----------|
| 界面控制 | ✅ 后台驱动 | ❌ 前端硬编码 |
| 动态渲染 | ✅ Vue字符串+JSON | ❌ 静态模板 |
| 组件更新 | ✅ 运行时热更新 | ❌ 需要重新部署 |
| 多租户 | ✅ 原生支持 | ❌ 需要自行实现 |
| 学习成本 | 中等 (新概念) | 低 (传统开发) |

:::

::: tip 💡 选择建议
- **后台驱动的动态界面**: 选择 DVHA Pro
- **传统静态后台**: 选择传统方案
- **多租户SaaS系统**: 强烈推荐 DVHA Pro
:::

## 🔥 独有特性

::: warning 🎯 市场上独有的后台开发特性
这些特性专为后台开发场景设计
:::

### 🧬 后台控制前端渲染

```php
// 后台 PHP 代码
class PageController {
  public function getUserList() {
    $users = User::paginate(20);

    return [
      'data' => $users,
      'component' => '
        <DuxTable
          :data="data.data"
          :columns="[
            { title: \'ID\', key: \'id\' },
            { title: \'姓名\', key: \'name\' },
            { title: \'状态\', key: \'status\', render: (row) =>
              h(NTag, { type: row.status === 1 ? \'success\' : \'error\' },
                row.status === 1 ? \'正常\' : \'禁用\'
              )
            }
          ]"
          :pagination="data.pagination"
        />
      '
    ];
  }
}
```

### 🎨 运行时组件生成

```vue
<template>
  <!-- 后台返回什么，前端就渲染什么 -->
  <div
    class="flex items-center gap-4 p-6 rounded-lg shadow-md
               bg-white dark:bg-gray-800
               hover:shadow-lg transition-all"
  >
    <RemoteComponent :config="backendConfig" />
  </div>
</template>
```

## 💼 典型应用场景

::: details 🏢 企业管理系统

**SaaS 多租户平台**
- 每个租户不同的界面配置
- 后台控制租户功能开关
- 动态权限和菜单配置

**传统企业系统**
- ERP、CRM、OA 系统
- 工作流配置界面
- 报表和数据可视化

:::

::: details 🔧 后台开发优势

**选择 DVHA Pro 如果你需要:**
- ✅ 后台控制前端界面渲染
- ✅ 动态配置和热更新
- ✅ 多租户和权限控制
- ✅ Vue 3 + TypeScript 最佳实践

**不建议选择如果:**
- ❌ 纯静态展示页面
- ❌ 简单的企业官网
- ❌ 偏好传统开发模式

:::

## 🛣️ 学习路径

::: tip 📚 推荐学习顺序
1. [快速开始](/pro/getting-started) - 创建第一个项目
2. [组件库](/pro/components/) - 了解可用组件
3. [配置说明](/pro/configuration) - 掌握配置技巧
4. [Hooks 参考](/pro/hooks/) - 学习高级用法
:::

---

<div style="text-align: center; margin: 2rem 0; color: #666;">
🎯 <strong>DVHA Pro</strong> - 让后台开发更简单、更动态、更智能
</div>
