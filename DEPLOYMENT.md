# 部署指南 / Deployment Guide

本文档提供详细的 GitHub Pages 部署步骤。

## 📋 前置要求

1. GitHub 账号
2. Git 已安装并配置
3. 已获取 Google Gemini API 密钥

## 🚀 部署步骤

### 1. 创建 GitHub 仓库

如果还没有创建仓库：

```bash
# 在 GitHub 上创建一个新仓库，名称为 ArtText-Studio
# 然后在本地初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ArtText-Studio.git
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入仓库的 **Settings** 页面
2. 在左侧菜单找到 **Pages**
3. 在 **Source** 下选择 **GitHub Actions**

### 3. 添加 API 密钥

1. 进入仓库的 **Settings** > **Secrets and variables** > **Actions**
2. 点击 **New repository secret**
3. 添加以下密钥：
   - Name: `GEMINI_API_KEY`
   - Secret: 您的 Google Gemini API 密钥

### 4. 触发部署

有两种方式触发部署：

#### 方式 1：推送代码（自动部署）

```bash
git add .
git commit -m "feat: deploy to GitHub Pages"
git push origin main
```

#### 方式 2：手动触发

1. 进入仓库的 **Actions** 页面
2. 选择 **Deploy to GitHub Pages** 工作流
3. 点击 **Run workflow** 按钮

### 5. 查看部署状态

1. 进入 **Actions** 页面
2. 查看最新的工作流运行状态
3. 等待构建和部署完成（通常需要 2-3 分钟）

### 6. 访问网站

部署成功后，访问：
```
https://YOUR_USERNAME.github.io/ArtText-Studio/
```

## 🔧 自定义域名（可选）

如果您想使用自定义域名：

1. 在仓库根目录创建 `public` 文件夹
2. 在 `public` 文件夹中创建 `CNAME` 文件
3. 在 `CNAME` 文件中写入您的域名，例如：
   ```
   arttext.yourdomain.com
   ```
4. 在您的域名 DNS 设置中添加 CNAME 记录指向 `YOUR_USERNAME.github.io`
5. 推送代码并等待部署完成

## 🐛 常见问题

### 问题 1：页面显示 404

**解决方案：**
- 确认 `vite.config.ts` 中的 `base` 配置正确
- 检查仓库名称是否为 `ArtText-Studio`
- 如果仓库名称不同，需要修改 `vite.config.ts` 中的 `base` 值

### 问题 2：AI 功能不工作

**解决方案：**
- 确认已在 GitHub Secrets 中正确添加 `GEMINI_API_KEY`
- 检查 API 密钥是否有效
- 查看浏览器控制台是否有错误信息

### 问题 3：构建失败

**解决方案：**
- 检查 Actions 日志中的错误信息
- 确认所有依赖都已正确安装
- 尝试在本地运行 `npm run build` 测试

### 问题 4：样式或资源加载失败

**解决方案：**
- 确认 `base` 配置正确
- 检查资源路径是否使用了绝对路径
- 清除浏览器缓存后重试

## 📝 更新网站

每次推送到 `main` 分支时，GitHub Actions 会自动重新构建和部署：

```bash
# 修改代码后
git add .
git commit -m "feat: add new feature"
git push origin main
```

## 🔒 环境变量说明

项目使用以下环境变量：

- `GEMINI_API_KEY`: Google Gemini API 密钥（必需）
  - 开发环境：在 `.env.local` 文件中配置
  - 生产环境：在 GitHub Secrets 中配置

## 📊 监控部署

您可以通过以下方式监控部署：

1. **GitHub Actions 页面**：查看工作流运行历史
2. **Pages 设置页面**：查看当前部署的版本和 URL
3. **Deployments 页面**：查看所有部署历史

## 🎯 优化建议

1. **启用缓存**：GitHub Actions 已配置 npm 缓存，加快构建速度
2. **代码分割**：Vite 配置已优化代码分割，减小初始加载大小
3. **CDN 加速**：考虑使用 Cloudflare 等 CDN 服务加速访问

## 📞 获取帮助

如果遇到问题：

1. 查看 [GitHub Actions 文档](https://docs.github.com/en/actions)
2. 查看 [GitHub Pages 文档](https://docs.github.com/en/pages)
3. 在项目仓库提交 Issue

---

祝您部署顺利！🎉
