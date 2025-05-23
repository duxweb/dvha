#!/bin/bash

# 发布 template 到 npm

set -e

echo "📦 准备发布 template..."

# 检查是否登录 npm (Bun 使用 npm registry)
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 请先登录 npm: npm login"
    exit 1
fi

# 进入包目录
cd "$(dirname "$0")/.."

# 清理模板中的 node_modules 和其他不需要的文件
echo "🧹 清理模板文件..."
find template -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find template -name ".vite" -type d -exec rm -rf {} + 2>/dev/null || true
find template -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
find template -name "*.log" -type f -delete 2>/dev/null || true
find template -name ".DS_Store" -type f -delete 2>/dev/null || true

# 清理旧的构建文件
echo "🧹 清理构建文件..."
rm -rf node_modules bun.lockb

# 安装依赖
echo "📦 安装依赖..."
bun install

# 检查包是否可以发布
echo "🔍 检查包..."
npm pack --dry-run

# 询问是否确认发布
echo ""
read -p "确认发布到 npm? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
fi

# 发布 (使用 npm publish，因为 bun publish 可能有兼容性问题)
echo "🚀 正在发布..."
npm publish --access=public

echo "✅ 发布成功！"
echo ""
echo "现在你可以使用以下命令创建项目："
echo "  bunx @duxweb/dvha-template init my-project"
echo "  npx @duxweb/dvha-template init my-project"
echo ""
echo "或者全局安装后使用："
echo "  npm install -g @duxweb/dvha-template"
echo "  duxweb-dvha init my-project"