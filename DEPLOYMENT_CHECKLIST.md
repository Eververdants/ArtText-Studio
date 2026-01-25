# 🚀 部署检查清单

在部署到 GitHub Pages 之前，请确保完成以下步骤：

## ✅ 部署前检查

### 1. 代码准备
- [ ] 所有功能已完成并测试
- [ ] 代码已提交到本地 Git 仓库
- [ ] 没有未提交的更改（或已确认不需要提交）
- [ ] 本地构建成功（`npm run build`）
- [ ] 本地预览正常（`npm run preview`）

### 2. 配置检查
- [ ] `.env.local` 文件已配置（本地开发）
- [ ] `.env.example` 文件已更新
- [ ] `vite.config.ts` 中的 `base` 路径正确
- [ ] `package.json` 中的仓库信息正确

### 3. GitHub 仓库设置
- [ ] 已在 GitHub 创建仓库
- [ ] 仓库名称为 `ArtText-Studio`（或已相应修改配置）
- [ ] 本地已添加远程仓库（`git remote -v` 检查）
- [ ] 已推送代码到 GitHub

### 4. GitHub Pages 配置
- [ ] Settings > Pages > Source 设置为 "GitHub Actions"
- [ ] Settings > Secrets > Actions 中已添加 `GEMINI_API_KEY`
- [ ] 确认 API 密钥有效且有足够配额

### 5. 工作流检查
- [ ] `.github/workflows/deploy.yml` 文件存在
- [ ] 工作流配置正确
- [ ] 权限设置正确（Pages write 权限）

## 🚀 部署步骤

### 方式一：使用部署脚本

**Windows:**
```bash
deploy.bat "首次部署"
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh "首次部署"
```

### 方式二：手动部署

```bash
# 1. 添加所有文件
git add .

# 2. 提交更改
git commit -m "feat: initial deployment to GitHub Pages"

# 3. 推送到 GitHub
git push origin main
```

## 📊 部署后验证

### 1. 检查构建状态
- [ ] 访问 GitHub Actions 页面
- [ ] 确认工作流运行成功（绿色勾）
- [ ] 检查构建日志无错误

### 2. 访问网站
- [ ] 访问 `https://你的用户名.github.io/ArtText-Studio/`
- [ ] 页面正常加载
- [ ] 样式显示正确
- [ ] 字体加载正常

### 3. 功能测试
- [ ] 文字输入功能正常
- [ ] 样式切换正常
- [ ] AI 功能正常工作
- [ ] 背景生成功能正常
- [ ] 图片上传功能正常
- [ ] 导出功能正常
- [ ] 复制功能正常
- [ ] 语言切换正常

### 4. 响应式测试
- [ ] 桌面端显示正常
- [ ] 平板端显示正常
- [ ] 移动端显示正常

### 5. 浏览器兼容性
- [ ] Chrome 测试通过
- [ ] Firefox 测试通过
- [ ] Safari 测试通过（如果可用）
- [ ] Edge 测试通过

## 🐛 常见问题排查

### 问题：页面显示 404
**检查项：**
- [ ] `vite.config.ts` 中的 `base` 配置
- [ ] 仓库名称是否正确
- [ ] GitHub Pages 是否已启用

### 问题：样式丢失
**检查项：**
- [ ] 资源路径是否正确
- [ ] `base` 配置是否正确
- [ ] 浏览器控制台是否有 404 错误

### 问题：AI 功能不工作
**检查项：**
- [ ] GitHub Secrets 中的 API 密钥是否正确
- [ ] API 密钥是否有效
- [ ] 浏览器控制台是否有 API 错误

### 问题：字体显示异常
**检查项：**
- [ ] Google Fonts 是否加载成功
- [ ] 网络连接是否正常
- [ ] 浏览器是否支持相关字体

## 📝 部署记录

| 日期 | 版本 | 改动内容 | 部署人 | 状态 |
|------|------|----------|--------|------|
| 2026-01-25 | 1.0.0 | 首次部署 | Eververdants | ✅ |

## 🔄 更新部署

每次更新后：

1. 修改代码
2. 本地测试
3. 提交并推送
4. 等待自动部署
5. 验证更新

## 📞 获取帮助

如果遇到问题：
- 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 详细指南
- 查看 GitHub Actions 日志
- 在 Issues 中提问

---

✨ 祝部署顺利！
