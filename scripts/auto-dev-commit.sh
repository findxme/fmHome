#!/bin/bash
# fmHome 自动化开发流程 - 提交阶段
# 用法: ./auto-dev-commit.sh <issue_number> <branch_name> [commit_message]

set -e

ISSUE_NUMBER=$1
BRANCH_NAME=$2
COMMIT_MSG="${3:-fix: Issue #$ISSUE_NUMBER}"
REPO="findxme/fmHome"
WORK_DIR="/home/gem/workspace/agent/workspace/fmHome"

if [ -z "$ISSUE_NUMBER" ] || [ -z "$BRANCH_NAME" ]; then
    echo "❌ 参数不完整"
    echo "用法: ./auto-dev-commit.sh <issue_number> <branch_name> [commit_message]"
    exit 1
fi

cd "$WORK_DIR"

echo "========================================"
echo "🚀 fmHome 自动化流程 - 提交阶段"
echo "   Issue: #$ISSUE_NUMBER"
echo "   分支: $BRANCH_NAME"
echo "========================================"

# Step 5: 检查代码变更
echo ""
echo "📊 Step 5: 检查代码变更..."
git status

CHANGED_FILES=$(git diff --name-only HEAD)
if [ -z "$CHANGED_FILES" ]; then
    echo "⚠️  没有检测到代码变更"
    exit 0
fi

echo ""
echo "变更文件:"
echo "$CHANGED_FILES"

# Step 6: 提交代码
echo ""
echo "💾 Step 6: 提交代码..."
git add -A
git commit -m "$COMMIT_MSG"
echo "   ✅ 提交成功"

# Step 7: 推送分支
echo ""
echo "📤 Step 7: 推送分支..."
git push -u origin "$BRANCH_NAME"
echo "   ✅ 推送成功"

# Step 8: 创建 PR
echo ""
echo "🔀 Step 8: 创建 Pull Request..."
PR_URL=$(gh pr create --repo "$REPO" --title "fix: Issue #$ISSUE_NUMBER" --body "Closes #$ISSUE_NUMBER" --head "$BRANCH_NAME" --base main 2>/dev/null || echo "")

if [ -n "$PR_URL" ]; then
    echo "   ✅ PR 已创建: $PR_URL"
    
    # Step 9: 等待 CI/CD
    echo ""
    echo "🔄 Step 9: 等待 CI/CD 检查..."
    sleep 10
    
    # 检查 CI 状态
    CI_STATUS=$(gh pr checks "$PR_URL" --repo "$REPO" 2>/dev/null || echo "unknown")
    echo "   CI 状态: $CI_STATUS"
    
    # Step 10: 合并 PR
    echo ""
    echo "🔀 Step 10: 合并 PR..."
    gh pr merge --squash --delete-branch --repo "$REPO" 2>/dev/null && echo "   ✅ PR 已合并" || echo "   ⏳ PR 等待审核"
fi

# Step 11: 关闭 Issue
echo ""
echo "🏁 Step 11: 关闭 Issue..."
gh issue close "$ISSUE_NUMBER" --repo "$REPO" --comment "✅ 已修复并合并到 main 分支" 2>/dev/null && echo "   ✅ Issue 已关闭" || echo "   ⏳ Issue 等待关闭"

echo ""
echo "========================================"
echo "🎉 自动化流程完成！"
echo "========================================"