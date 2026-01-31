# ArtText Studio

<div align="center">

![ArtText Studio Banner](https://img.shields.io/badge/ArtText-Studio-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Transform your words into stunning visual masterpieces**

[Live Demo](https://eververdants.github.io/ArtText-Studio) · [中文文档](./README.zh-CN.md)

</div>

## Overview

ArtText Studio is an AI-powered text art generator that transforms your words into beautiful visual posters. Whether it's poetry, quotes, or everyday text, create unique artistic compositions with rich typography, intelligent layouts, and AI-generated backgrounds.

## Key Features

🤖 **AI-Powered Analysis** - Leverages Google Gemini AI to analyze text sentiment and recommend optimal visual styles

🎨 **40+ Preset Styles** - Curated collection spanning modern, classical, cyberpunk, and more aesthetic themes

🖼️ **AI Background Generation** - Automatically creates artistic backgrounds based on text content and mood

✍️ **11 Premium Fonts** - Carefully selected typefaces including geometric, serif, calligraphy, and brush styles

📐 **Flexible Layouts** - 5 layout modes: center, left-align, bottom-align, vertical, and decorative border

🎛️ **Fine-Grained Controls** - Precise adjustment of font size, line height, shadows, strokes, and background effects

🌍 **Bilingual Interface** - Seamless switching between Chinese and English

📱 **Responsive Design** - Optimized for both desktop and mobile devices

💾 **Multiple Export Options** - High-resolution download (3x scale) and one-click copy to clipboard

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm

### Installation

1. Clone the repository

```bash
git clone https://github.com/Eververdants/ArtText-Studio.git
cd ArtText-Studio
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Configure API key

Create a `.env.local` file and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

4. Start development server

```bash
npm run dev
```

Visit `http://localhost:5173` to start creating!

## Usage Guide

### Basic Workflow

1. **Enter Text** - Type or paste your text in the left panel
2. **Choose Aspect Ratio** - Select 1:1, 4:5, or 9:16 canvas ratio
3. **Set Mood** - Pick from Minimal, Zen, Classic, and other artistic moods
4. **AI Explore** - Click "AI Art Explore" for automatic style generation
5. **Manual Adjustments** - Fine-tune typography, layout, and colors in the right panel
6. **Export** - Download in high resolution or copy to clipboard

### Advanced Features

**Parameter Panel**
- Font selection with 11 curated typefaces
- 5 professional layout modes
- Custom background and text colors
- Shadow and stroke effects toggle
- Character weight and line rhythm controls

**Style Gallery**
- Browse 40+ preset styles
- One-click style application
- Real-time preview

**Background Engine**
- Paper textures (none, grain, etc.)
- Image adjustments (brightness, blur, contrast, opacity)
- Position controls for background images
- Custom image upload support

## Tech Stack

**Core**
- React 19.2.3 - UI framework
- TypeScript 5.8 - Type safety
- Vite 6.2 - Build tool

**Styling**
- Tailwind CSS 4.1 - Utility-first CSS
- Lucide React - Icon library
- Google Fonts - Multi-language typography

**AI & Image Processing**
- @google/genai - Google Gemini AI integration
- html-to-image - High-quality image export
- react-helmet-async - SEO optimization

## Project Structure

```
ArtText-Studio/
├── src/
│   ├── components/          # React components
│   │   ├── PreviewCard.tsx  # Main preview component
│   │   ├── HistoryPanel.tsx # History management
│   │   └── ShortcutsHelp.tsx # Keyboard shortcuts
│   ├── services/            # Service layer
│   │   ├── geminiService.ts # AI integration
│   │   └── historyService.ts # Local storage
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   ├── utils/               # Utilities and constants
│   ├── styles/              # Global styles
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── dist/                    # Build output
└── index.html               # HTML template
```

## Build & Deployment

### Local Build

```bash
npm run build
```

Build artifacts will be generated in the `dist` directory.

### Preview Build

```bash
npm run preview
```

### Deploy to GitHub Pages

The project includes automated deployment workflow:

1. Add your API key to GitHub repository secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add `GEMINI_API_KEY` with your Google Gemini API key

2. Push to `main` branch:

```bash
git push origin main
```

3. GitHub Actions will automatically build and deploy to GitHub Pages

## Roadmap

- [x] Basic text art generation
- [x] AI-powered style recommendations
- [x] AI background generation
- [x] Multiple export formats
- [x] Bilingual interface
- [x] History management
- [x] Keyboard shortcuts
- [ ] Additional font options
- [ ] Animation effects
- [ ] Batch processing
- [ ] Template marketplace
- [ ] Community sharing

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Eververdants**

- GitHub: [@Eververdants](https://github.com/Eververdants)
- Website: [https://eververdants.github.io](https://eververdants.github.io)

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) - Powerful AI capabilities
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [Tailwind CSS](https://tailwindcss.com/) - Excellent CSS framework
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [React](https://react.dev/) - UI framework

---

<div align="center">

**If this project helps you, please give it a ⭐️ Star!**

Made with ❤️ by Eververdants

</div>
