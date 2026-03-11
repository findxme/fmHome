#!/bin/bash
# fmHome 自动化开发流程
# 用法: ./auto-dev.sh <issue_number>

set -e

ISSUE_NUMBER=$1

if [ -z "$ISSUE_NUMBER" ]; then
    echo "❌ 请提供 Issue 编号"
    echo "用法: ./auto-dev.sh <issue_number>"
    exit 1
fi

REPO="findxme/fmHome"
WORK_DIR="/home/gem/workspace/agent/workspace/fmHome"

echo "========================================"
echo "🚀 fmHome 自动化开发流程"
echo "   Issue: #$ISSUE_NUMBER"
echo "========================================"

cd "$WORK_DIR"

# Step 1: 拉取最新代码
echo ""
echo "📥 Step 1: 拉取最新代码..."
git fetch origin
git checkout main
git pull origin main

# Step 2: 获取 Issue 信息
echo ""
echo "📋 Step 2: 获取 Issue 信息..."
ISSUE_URL="https://github.com/$REPO/issues/$ISSUE_NUMBER"
ISSUE_TITLE=$(gh issue view $ISSUE_NUMBER --repo $REPO --json title -q '.title' 2>/dev/null || echo "无法获取")
echo "   标题: $ISSUE_TITLE"
echo "   链接: $ISSUE_URL"

# Step 3: 创建开发分支
BRANCH_NAME="fix/issue-$ISSUE_NUMBER-$(date +%Y%m%d%H%M)"
echo ""
echo "🌿 Step 3: 创建开发分支..."
echo "   分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Step 4: 等待开发完成（由 Agent 完成）
echo ""
echo "========================================"
echo "⏳ Step 4: 开发阶段"
echo "   请在当前分支完成开发后继续..."
echo "========================================"

echo ""
echo "✅ 准备工作完成！"
echo ""
echo "后续步骤（开发完成后执行）："
echo "  ./auto-dev-commit.sh $ISSUE_NUMBER \"$BRANCH_NAME\""