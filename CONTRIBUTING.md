# 贡献指南 / Contributing Guide

感谢您对 ArtText Studio 项目的关注！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果您发现了 Bug，请：

1. 在 [Issues](https://github.com/Eververdants/ArtText-Studio/issues) 中搜索是否已有相关问题
2. 如果没有，创建新的 Issue，并提供：
   - Bug 的详细描述
   - 复现步骤
   - 预期行为和实际行为
   - 截图（如果适用）
   - 浏览器和操作系统信息

### 提出新功能

如果您有好的想法：

1. 在 Issues 中创建 Feature Request
2. 详细描述您的想法和使用场景
3. 等待社区讨论和反馈

### 提交代码

#### 1. Fork 项目

点击页面右上角的 "Fork" 按钮

#### 2. 克隆到本地

```bash
git clone https://github.com/你的用户名/ArtText-Studio.git
cd ArtText-Studio
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `style/` - 代码格式调整
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具相关

#### 4. 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 进行开发...
```

#### 5. 提交更改

提交信息格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

示例：

```bash
git add .
git commit -m "feat(ui): add new font style option"
```

#### 6. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

#### 7. 创建 Pull Request

1. 访问您 Fork 的仓库
2. 点击 "Pull Request" 按钮
3. 填写 PR 描述：
   - 改动的内容
   - 相关的 Issue（如果有）
   - 测试情况
   - 截图（如果适用）

## 📝 代码规范

### TypeScript

- 使用 TypeScript 编写代码
- 为函数和组件添加类型注解
- 避免使用 `any` 类型

### React

- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- Props 接口以组件名 + Props 命名

### 样式

- 使用 Tailwind CSS 类名
- 保持类名的可读性
- 复杂样式可以提取为组件

### 命名规范

- 变量和函数：camelCase
- 组件：PascalCase
- 常量：UPPER_SNAKE_CASE
- 类型/接口：PascalCase

## 🧪 测试

在提交 PR 前，请确保：

- [ ] 代码可以正常构建（`npm run build`）
- [ ] 在浏览器中测试了所有改动
- [ ] 没有 TypeScript 错误
- [ ] 没有控制台错误或警告

## 📚 项目结构

```
ArtText-Studio/
├── components/          # React 组件
├── App.tsx             # 主应用
├── constants.tsx       # 常量配置
├── types.ts            # 类型定义
├── geminiService.ts    # AI 服务
└── ...
```

## 🎯 开发建议

### 添加新字体

1. 在 `index.html` 中添加 Google Fonts 链接
2. 在 `types.ts` 的 `FontStyle` 枚举中添加新字体
3. 在 `App.tsx` 的 `FONT_OPTIONS` 中添加选项
4. 在 `index.html` 的样式中添加字体类

### 添加新布局

1. 在 `types.ts` 的 `LayoutType` 枚举中添加
2. 在 `PreviewCard.tsx` 的 `getLayoutClass` 中处理
3. 在 `App.tsx` 中添加布局选择按钮

### 添加新预设

在 `constants.tsx` 的 `PRESETS` 数组中添加新配置

## 💬 交流

- 在 Issues 中讨论
- 提交 PR 时详细说明改动
- 保持友好和尊重

## 📄 许可

提交代码即表示您同意将代码以 MIT 许可证开源。

---

再次感谢您的贡献！🎉
