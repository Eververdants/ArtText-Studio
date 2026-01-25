#!/bin/bash

# ArtText Studio - GitHub Pages 部署脚本
# 使用方法: ./deploy.sh "commit message"

set -e

echo "🚀 开始部署 ArtText Studio 到 GitHub Pages..."

# 检查是否提供了提交信息
COMMIT_MSG=${1:-"Update: deploy to GitHub Pages"}

echo "📝 提交信息: $COMMIT_MSG"

# 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
    echo "📦 检测到未提交的更改，正在提交..."
    git add .
    git commit -m "$COMMIT_MSG"
else
    echo "✅ 没有需要提交的更改"
fi

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git push origin main

echo "✨ 部署已触发！"
echo "📊 查看部署状态: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo "🌐 部署完成后访问: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | cut -d'/' -f1).github.io/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/' | cut -d'/' -f2)/"

echo ""
echo "⏳ 请等待 2-3 分钟让 GitHub Actions 完成构建和部署"
echo "💡 提示: 如果这是首次部署，请确保："
echo "   1. 在 GitHub 仓库 Settings > Pages 中选择 'GitHub Actions' 作为 Source"
echo "   2. 在 GitHub 仓库 Settings > Secrets 中添加 GEMINI_API_KEY"
