# 🚀 快速开始指南

## 第一步：准备工作

### 1. 获取 Google Gemini API 密钥

1. 访问 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 使用 Google 账号登录
3. 点击 "Create API Key" 创建新密钥
4. 复制生成的 API 密钥

### 2. 配置本地环境

在项目根目录创建 `.env.local` 文件：

```bash
GEMINI_API_KEY=你的API密钥
```

## 第二步：本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 开始使用！

## 第三步：部署到 GitHub Pages

### 方式一：使用自动部署脚本（推荐）

**Windows 用户：**
```bash
deploy.bat "首次部署"
```

**Mac/Linux 用户：**
```bash
chmod +x deploy.sh
./deploy.sh "首次部署"
```

### 方式二：手动部署

```bash
# 1. 添加所有文件
git add .

# 2. 提交更改
git commit -m "feat: initial deployment"

# 3. 推送到 GitHub
git push origin main
```

### 配置 GitHub

1. **设置 Pages**
   - 进入仓库 Settings > Pages
   - Source 选择 "GitHub Actions"

2. **添加 API 密钥**
   - 进入 Settings > Secrets and variables > Actions
   - 点击 "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Secret: 粘贴你的 API 密钥
   - 点击 "Add secret"

3. **等待部署完成**
   - 进入 Actions 页面查看部署进度
   - 通常需要 2-3 分钟

4. **访问网站**
   ```
   https://你的用户名.github.io/ArtText-Studio/
   ```

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 部署
./deploy.sh "更新内容"     # 快速部署（Mac/Linux）
deploy.bat "更新内容"      # 快速部署（Windows）
```

## 使用技巧

### 1. 基础操作
- 在左侧输入文字
- 选择画布比例（1:1、4:5、9:16）
- 点击"AI 艺术探索"自动生成

### 2. 高级调节
- **参数面板**：精细调整字体、布局、颜色
- **风格画廊**：浏览并应用 40+ 预设样式
- **背景引擎**：上传图片或使用 AI 生成背景

### 3. 导出作品
- **高清下载**：导出 3 倍分辨率的 PNG 图片
- **复制内容**：一键复制到剪贴板，方便分享

## 故障排除

### 问题：AI 功能不工作
- 检查 API 密钥是否正确配置
- 确认网络连接正常
- 查看浏览器控制台错误信息

### 问题：部署后页面空白
- 检查 `vite.config.ts` 中的 `base` 配置
- 确认仓库名称为 `ArtText-Studio`
- 清除浏览器缓存后重试

### 问题：字体显示异常
- 等待 Google Fonts 加载完成
- 检查网络连接
- 尝试刷新页面

## 获取帮助

- 📖 查看完整文档：[README.md](README.md)
- 🚀 部署详细指南：[DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 提交问题：[GitHub Issues](https://github.com/Eververdants/ArtText-Studio/issues)

---

祝您使用愉快！✨
