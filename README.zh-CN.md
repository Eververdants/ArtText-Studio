# ArtText Studio

<div align="center">

![ArtText Studio Banner](https://img.shields.io/badge/ArtText-Studio-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**将文字转化为令人惊艳的视觉艺术作品**

[在线体验](https://eververdants.github.io/ArtText-Studio) · [English](./README.md)

</div>

## 项目简介

ArtText Studio 是一款基于 AI 的文字艺术生成工具，能够将您的文字内容转化为精美的视觉海报。无论是诗词、名言还是日常文案，都能通过丰富的字体、智能布局和 AI 生成的背景，创造出独特的艺术作品。

## 核心功能

🤖 **AI 智能分析** - 使用 Google Gemini AI 分析文本情感，自动推荐最佳视觉风格

🎨 **40+ 预设样式** - 精心设计的预设风格，涵盖现代、古典、赛博朋克等多种美学主题

🖼️ **AI 背景生成** - 基于文本内容和情绪自动生成艺术背景图

✍️ **11 种精选字体** - 包括现代几何、经典衬线、书法、毛笔等精心挑选的字体

📐 **灵活布局系统** - 5 种布局模式：居中、左对齐、底部对齐、竖排、边框装饰

🎛️ **深度参数调节** - 精细控制字体大小、行高、阴影、描边、背景效果等

🌍 **双语界面** - 支持中文/英文界面无缝切换

📱 **响应式设计** - 完美适配桌面和移动设备

💾 **多种导出方式** - 支持高清下载（3 倍分辨率）和一键复制到剪贴板

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm、yarn 或 pnpm

### 安装步骤

1. 克隆项目

```bash
git clone https://github.com/Eververdants/ArtText-Studio.git
cd ArtText-Studio
```

2. 安装依赖

```bash
npm install
# 或
pnpm install
```

3. 配置 API 密钥

创建 `.env.local` 文件并添加您的 Google Gemini API 密钥：

```env
GEMINI_API_KEY=your_api_key_here
```

在 [Google AI Studio](https://aistudio.google.com/app/apikey) 免费获取 API 密钥

4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 即可开始创作！

## 使用指南

### 基础工作流

1. **输入文字** - 在左侧文本框输入或粘贴您的文字
2. **选择画幅** - 选择 1:1、4:5 或 9:16 的画布比例
3. **设置意境** - 从 Minimal、Zen、Classic 等艺术意境中选择
4. **AI 探索** - 点击"AI 艺术探索"让 AI 自动生成最佳效果
5. **手动调整** - 在右侧面板精细调整字体、布局和颜色
6. **导出作品** - 高清下载或复制到剪贴板

### 高级功能

**参数面板**
- 11 种精选字体可供选择
- 5 种专业排版布局模式
- 自定义背景色和文字颜色
- 阴影和描边效果开关
- 字符比重和行间韵律控制

**风格画廊**
- 浏览 40+ 预设风格
- 一键应用样式
- 实时预览效果

**背景引擎**
- 纸张质感（无、颗粒等）
- 图像调节（亮度、模糊、对比度、不透明度）
- 背景图片位置控制
- 支持上传自定义背景图片

## 技术栈

**核心框架**
- React 19.2.3 - UI 框架
- TypeScript 5.8 - 类型安全
- Vite 6.2 - 构建工具

**样式与 UI**
- Tailwind CSS 4.1 - 实用优先的 CSS 框架
- Lucide React - 图标库
- Google Fonts - 多语言字体支持

**AI 与图像处理**
- @google/genai - Google Gemini AI 集成
- html-to-image - 高质量图像导出
- react-helmet-async - SEO 优化

## 项目结构

```
ArtText-Studio/
├── src/
│   ├── components/          # React 组件
│   │   ├── PreviewCard.tsx  # 主预览组件
│   │   ├── HistoryPanel.tsx # 历史记录管理
│   │   └── ShortcutsHelp.tsx # 快捷键帮助
│   ├── services/            # 服务层
│   │   ├── geminiService.ts # AI 集成
│   │   └── historyService.ts # 本地存储
│   ├── hooks/               # 自定义 React Hooks
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数和常量
│   ├── styles/              # 全局样式
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── public/                  # 静态资源
├── dist/                    # 构建输出
└── index.html               # HTML 模板
```

## 构建与部署

### 本地构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 预览构建结果

```bash
npm run preview
```

### 部署到 GitHub Pages

项目包含自动化部署工作流：

1. 在 GitHub 仓库中添加 API 密钥：
   - 进入 Settings > Secrets and variables > Actions
   - 添加 `GEMINI_API_KEY`，值为您的 Google Gemini API 密钥

2. 推送到 `main` 分支：

```bash
git push origin main
```

3. GitHub Actions 将自动构建并部署到 GitHub Pages

## 功能路线图

- [x] 基础文字艺术生成
- [x] AI 智能风格推荐
- [x] AI 背景图生成
- [x] 多种导出格式
- [x] 双语界面支持
- [x] 历史记录管理
- [x] 键盘快捷键
- [ ] 更多字体选择
- [ ] 动画效果支持
- [ ] 批量处理功能
- [ ] 模板市场
- [ ] 社区分享功能

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

详细信息请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 开源协议

本项目采用 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 作者

**Eververdants**

- GitHub: [@Eververdants](https://github.com/Eververdants)
- 个人主页: [https://eververdants.github.io](https://eververdants.github.io)

## 致谢

- [Google Gemini](https://ai.google.dev/) - 提供强大的 AI 能力
- [Lucide Icons](https://lucide.dev/) - 精美的图标库
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [React](https://react.dev/) - UI 框架

---

<div align="center">

**如果这个项目对您有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by Eververdants

</div>
