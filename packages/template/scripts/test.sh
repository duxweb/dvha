#!/bin/bash

set -e

cd "$(dirname "$0")/.."

echo "🧪 快速检查模板创建..."
node --test test/*.test.js

echo ""
echo "🔥 Smoke 构建 pro 模板..."
node scripts/smoke.js pro

echo ""
echo "✅ 测试完成！"
