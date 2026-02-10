#!/bin/bash

echo "================================"
echo "GitHub 连接器功能演示"
echo "================================"
echo ""

echo "📋 1. 检查 Git 配置"
echo "---"
git config user.name
git config user.email
echo ""

echo "🔗 2. 查看远程仓库"
echo "---"
git remote -v
echo ""

echo "📊 3. 查看分支信息"
echo "---"
git branch -a
echo ""

echo "📝 4. 查看提交历史（最近 5 个）"
echo "---"
git log --oneline -5
echo ""

echo "🔍 5. 查看最新提交详情"
echo "---"
git log -1 --format="%H%nAuthor: %an <%ae>%nDate: %ad%nMessage:%n%B" --date=short
echo ""

echo "📈 6. 查看项目统计"
echo "---"
echo "源代码文件数:"
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | grep -v node_modules | wc -l
echo ""
echo "项目大小:"
du -sh . | awk '{print $1}'
echo ""

echo "✅ 7. 检查工作目录状态"
echo "---"
git status
echo ""

echo "🎯 8. 验证 GitHub 连接"
echo "---"
if git fetch user_github --dry-run 2>/dev/null; then
    echo "✅ GitHub 连接正常"
else
    echo "❌ GitHub 连接失败"
fi
echo ""

echo "================================"
echo "演示完成！"
echo "================================"
