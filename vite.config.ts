import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  // 在 GitHub Pages 上部署时使用项目路径，本地开发使用根路径
  const base = process.env.GITHUB_ACTIONS ? '/ArtText-Studio/' : '/';

  return {
    base,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 设置 chunk 大小警告限制
      chunkSizeWarningLimit: 1000,
      // 压缩选项 - 使用 esbuild（更快）
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // 优化的代码分割策略
          manualChunks: (id) => {
            // React 核心库及其依赖
            if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
              return 'react-vendor';
            }
            // React 相关库
            if (id.includes('node_modules/react-helmet-async')) {
              return 'react-libs';
            }
            // UI 图标库
            if (id.includes('node_modules/lucide-react')) {
              return 'lucide-icons';
            }
            // 图像处理库
            if (id.includes('node_modules/html-to-image')) {
              return 'html-to-image';
            }
            // Google AI 库
            if (id.includes('node_modules/@google/')) {
              return 'google-ai';
            }
            // 其他 node_modules
            if (id.includes('node_modules/')) {
              return 'vendor';
            }
          },
          // 优化文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const fileName = assetInfo.names?.[0] || 'asset';
            if (/\.(png|jpe?g|svg|gif|webp|ico)$/i.test(fileName)) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
              return 'assets/fonts/[name]-[hash][extname]';
            }
            if (/\.css$/i.test(fileName)) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      },
      // 启用 gzip 压缩提示
      reportCompressedSize: true,
      // 设置目标浏览器
      target: 'es2015'
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-helmet-async',
        'lucide-react',
        'html-to-image'
      ],
      exclude: ['@google/genai']
    }
  };
});
