# @duxweb/dvha-template

快速创建 Dux Vue 项目的脚手架工具。

## 使用方法

### 使用 bunx (推荐)

```bash
bunx @duxweb/dvha-template init
```

### 使用 npx

```bash
npx @duxweb/dvha-template init
```

### 使用 yarn

```bash
yarn dlx @duxweb/dvha-template init
```

### 使用 pnpm

```bash
pnpm dlx @duxweb/dvha-template init
```

### 指定项目名称

```bash
bunx @duxweb/dvha-template init my-awesome-project
npx @duxweb/dvha-template init my-awesome-project
```

### 全局安装后使用

```bash
# 安装到全局
npm install -g @duxweb/dvha-template

# 然后可以直接使用
duxweb-dvha init my-project
```

## 可用模板

1. **Vue 3 + Vite + UnoCSS** - 基础的 Vue 3 项目模板
2. **Vue 3 + Element Plus** - 使用 Element Plus 的 Vue 3 项目
3. **Vue 3 + Naive UI** - 使用 Naive UI 的 Vue 3 项目

## 特性

- 🚀 快速创建项目
- 🎨 多种 UI 框架模板选择
- 📦 自动配置开发环境
- 🔧 开箱即用的开发工具
- 🌐 中英文双语界面
- 💻 支持 npm、yarn、pnpm、bun

## 开发

```bash
# 安装依赖
bun install

# 本地测试
bun run bin/index.js init test-project

# 或者使用 npm
npm install
node bin/index.js init test-project
```

## 发布

```bash
# 使用发布脚本
npm run push

# 或者手动发布
npm publish --access=public
```

## 许可证

MIT