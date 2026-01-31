# Contributing Guide
# 贡献指南

Thank you for your interest in contributing to ArtText Studio! We welcome all forms of contributions.

感谢您对 ArtText Studio 项目的关注！我们欢迎任何形式的贡献。

## 🤝 How to Contribute
## 🤝 如何贡献

### Reporting Bugs
### 报告 Bug

If you find a bug, please:

如果您发现了 Bug，请：

1. Search [Issues](https://github.com/Eververdants/ArtText-Studio/issues) to see if the problem has already been reported
   
   在 [Issues](https://github.com/Eververdants/ArtText-Studio/issues) 中搜索是否已有相关问题

2. If not, create a new Issue with the following information:
   
   如果没有，创建新的 Issue，并提供：
   
   - Detailed description of the bug / Bug 的详细描述
   - Steps to reproduce / 复现步骤
   - Expected vs actual behavior / 预期行为和实际行为
   - Screenshots (if applicable) / 截图（如果适用）
   - Browser and OS information / 浏览器和操作系统信息

### Suggesting Features
### 提出新功能

If you have a great idea:

如果您有好的想法：

1. Create a Feature Request in Issues
   
   在 Issues 中创建 Feature Request

2. Describe your idea and use cases in detail
   
   详细描述您的想法和使用场景

3. Wait for community discussion and feedback
   
   等待社区讨论和反馈

### Submitting Code
### 提交代码

#### 1. Fork the Repository
#### 1. Fork 项目

Click the "Fork" button in the top right corner of the page

点击页面右上角的 "Fork" 按钮

#### 2. Clone to Local
#### 2. 克隆到本地

```bash
git clone https://github.com/your-username/ArtText-Studio.git
cd ArtText-Studio
```

#### 3. Create a Branch
#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# or / 或
git checkout -b fix/your-bug-fix
```

Branch naming conventions:

分支命名规范：

- `feature/` - New features / 新功能
- `fix/` - Bug fixes / Bug 修复
- `docs/` - Documentation updates / 文档更新
- `style/` - Code formatting / 代码格式调整
- `refactor/` - Code refactoring / 代码重构
- `test/` - Testing related / 测试相关
- `chore/` - Build/tooling related / 构建/工具相关

#### 4. Development
#### 4. 开发

```bash
# Install dependencies / 安装依赖
npm install

# Start development server / 启动开发服务器
npm run dev

# Start developing... / 进行开发...
```

#### 5. Commit Changes
#### 5. 提交更改

Commit message format:

提交信息格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

类型（type）：

- `feat`: New feature / 新功能
- `fix`: Bug fix / Bug 修复
- `docs`: Documentation / 文档更新
- `style`: Code formatting (no functional changes) / 代码格式（不影响代码运行）
- `refactor`: Refactoring / 重构
- `test`: Testing / 测试
- `chore`: Build process or tooling changes / 构建过程或辅助工具的变动

Example:

示例：

```bash
git add .
git commit -m "feat(ui): add new font style option"
```

#### 6. Push to GitHub
#### 6. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

#### 7. Create a Pull Request
#### 7. 创建 Pull Request

1. Visit your forked repository
   
   访问您 Fork 的仓库

2. Click the "Pull Request" button
   
   点击 "Pull Request" 按钮

3. Fill in the PR description:
   
   填写 PR 描述：
   
   - What changed / 改动的内容
   - Related Issues (if any) / 相关的 Issue（如果有）
   - Testing status / 测试情况
   - Screenshots (if applicable) / 截图（如果适用）

## 📝 Code Standards
## 📝 代码规范

### TypeScript

- Write code in TypeScript
  
  使用 TypeScript 编写代码

- Add type annotations to functions and components
  
  为函数和组件添加类型注解

- Avoid using `any` type
  
  避免使用 `any` 类型

### React

- Use functional components and Hooks
  
  使用函数组件和 Hooks

- Component names use PascalCase
  
  组件名使用 PascalCase

- Props interfaces named as ComponentName + Props
  
  Props 接口以组件名 + Props 命名

### Styling
### 样式

- Use Tailwind CSS class names
  
  使用 Tailwind CSS 类名

- Keep class names readable
  
  保持类名的可读性

- Extract complex styles into components
  
  复杂样式可以提取为组件

### Naming Conventions
### 命名规范

- Variables and functions: camelCase / 变量和函数：camelCase
- Components: PascalCase / 组件：PascalCase
- Constants: UPPER_SNAKE_CASE / 常量：UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase / 类型/接口：PascalCase

## 🧪 Testing
## 🧪 测试

Before submitting a PR, ensure:

在提交 PR 前，请确保：

- [ ] Code builds successfully (`npm run build`) / 代码可以正常构建（`npm run build`）
- [ ] All changes tested in browser / 在浏览器中测试了所有改动
- [ ] No TypeScript errors / 没有 TypeScript 错误
- [ ] No console errors or warnings / 没有控制台错误或警告

## 📚 Project Structure
## 📚 项目结构

```
ArtText-Studio/
├── src/
│   ├── components/          # React components / React 组件
│   ├── services/            # Service layer / 服务层
│   ├── hooks/               # Custom hooks / 自定义 Hooks
│   ├── types/               # Type definitions / 类型定义
│   ├── utils/               # Utilities / 工具函数
│   ├── App.tsx              # Main application / 主应用
│   └── main.tsx             # Entry point / 入口文件
└── ...
```

## 🎯 Development Tips
## 🎯 开发建议

### Adding New Fonts
### 添加新字体

1. Add Google Fonts link in `index.html`
   
   在 `index.html` 中添加 Google Fonts 链接

2. Add new font to `FontStyle` enum in `src/types/index.ts`
   
   在 `src/types/index.ts` 的 `FontStyle` 枚举中添加新字体

3. Add option in `FONT_OPTIONS` in `src/utils/constants.ts`
   
   在 `src/utils/constants.ts` 的 `FONT_OPTIONS` 中添加选项

4. Add font class in styles
   
   在样式中添加字体类

### Adding New Layouts
### 添加新布局

1. Add to `LayoutType` enum in `src/types/index.ts`
   
   在 `src/types/index.ts` 的 `LayoutType` 枚举中添加

2. Handle in `getLayoutClass` in `src/components/PreviewCard.tsx`
   
   在 `src/components/PreviewCard.tsx` 的 `getLayoutClass` 中处理

3. Add layout selection button in `src/App.tsx`
   
   在 `src/App.tsx` 中添加布局选择按钮

### Adding New Presets
### 添加新预设

Add new configuration to `PRESETS` array in `src/utils/constants.ts`

在 `src/utils/constants.ts` 的 `PRESETS` 数组中添加新配置

## 💬 Communication
## 💬 交流

- Discuss in Issues / 在 Issues 中讨论
- Provide detailed explanations in PRs / 提交 PR 时详细说明改动
- Be friendly and respectful / 保持友好和尊重

## 📄 License
## 📄 许可

By submitting code, you agree to license your contribution under the MIT License.

提交代码即表示您同意将代码以 MIT 许可证开源。

---

Thank you for your contribution! 🎉

再次感谢您的贡献！🎉
