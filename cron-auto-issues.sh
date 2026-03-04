#!/bin/bash
# fmHome Issues 自动处理脚本
# 每15分钟检查一次 GitHub issues 并按工作流程处理

REPO="findxme/fmHome"
WORKDIR="/Users/lixinjun/.openclaw/workspace/fmHome"
LOG_FILE="$WORKDIR/cron-issues.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$WORKDIR" || exit 1

# 获取 open issues
ISSUES=$(gh issue list --repo "$REPO" --state open --json number,title,labels 2>/dev/null)

if [ -z "$ISSUES" ] || [ "$ISSUES" = "[]" ]; then
    log "✅ 没有 open issues"
    exit 0
fi

ISSUE_COUNT=$(echo "$ISSUES" | jq '. | length')
log "📋 发现 $ISSUE_COUNT 个 open issues"

# 处理每个 issue
echo "$ISSUES" | jq -r '.[] | @json' | while read issue; do
    number=$(echo "$issue" | jq -r '.number')
    title=$(echo "$issue" | jq -r '.title')
    labels=$(echo "$issue" | jq -r '.labels[].name')
    
    log "处理 Issue #$number: $title"
    
    # 跳过已处理或进行中的
    if echo "$labels" | grep -qE "(in-progress|done|fixed)"; then
        log "  ⏭️ 跳过（已有标签）"
        continue
    fi
    
    # 标记为进行中
    gh issue edit "$number" --add-label "in-progress" 2>/dev/null
    
    # TODO: 触发 sub-agents 处理
    # 这里需要调用 OpenClaw API 来启动 sub-agent
    
    log "  ✅ 已标记为 in-progress"
done

log "✅ 检查完成"
