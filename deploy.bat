@echo off
REM ArtText Studio - GitHub Pages 部署脚本 (Windows)
REM 使用方法: deploy.bat "commit message"

echo 🚀 开始部署 ArtText Studio 到 GitHub Pages...

REM 获取提交信息
set COMMIT_MSG=%~1
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update: deploy to GitHub Pages

echo 📝 提交信息: %COMMIT_MSG%

REM 检查 Git 状态
git status --short > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 当前目录不是 Git 仓库
    exit /b 1
)

REM 添加并提交更改
echo 📦 提交更改...
git add .
git commit -m "%COMMIT_MSG%"

REM 推送到 GitHub
echo ⬆️  推送到 GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ✨ 部署已触发！
    echo 📊 请访问 GitHub Actions 页面查看部署状态
    echo 🌐 部署完成后即可访问您的网站
    echo.
    echo ⏳ 请等待 2-3 分钟让 GitHub Actions 完成构建和部署
    echo 💡 提示: 如果这是首次部署，请确保：
    echo    1. 在 GitHub 仓库 Settings ^> Pages 中选择 'GitHub Actions' 作为 Source
    echo    2. 在 GitHub 仓库 Settings ^> Secrets 中添加 GEMINI_API_KEY
) else (
    echo ❌ 推送失败，请检查错误信息
    exit /b 1
)
