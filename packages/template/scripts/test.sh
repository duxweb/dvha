#!/bin/bash

# 快速测试新的模板结构

set -e

echo "🧪 快速测试新的模板结构..."

# 进入包目录
cd "$(dirname "$0")/.."

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    bun install
fi

# 测试每个UI库模板
UIS=("template" "elementui" "naiveui")

for ui in "${UIS[@]}"; do
    echo ""
    echo "🎨 测试 $ui 模板..."

    # 创建测试目录
    TEST_DIR="../../../test-$ui-$(date +%s)"

    # 运行工具，自动选择UI库
    echo "$ui" | bun run bin/index.js "$TEST_DIR" >/dev/null 2>&1 || {
        echo "  使用交互式方式创建..."
        timeout 10s bash -c "echo -e '$TEST_DIR\n1\n' | bun run bin/index.js" >/dev/null 2>&1 || true
    }

    if [ -d "$TEST_DIR" ]; then
        echo "  ✅ $ui 模板创建成功: $TEST_DIR"

        # 检查关键文件
        if [ -f "$TEST_DIR/package.json" ] && [ -f "$TEST_DIR/main.ts" ] && [ -d "$TEST_DIR/pages" ]; then
            echo "  ✅ 关键文件存在"
        else
            echo "  ❌ 关键文件缺失"
        fi

        # 清理测试目录
        rm -rf "$TEST_DIR"
    else
        echo "  ❌ $ui 模板创建失败"
    fi
done

echo ""
echo "✅ 快速测试完成！"