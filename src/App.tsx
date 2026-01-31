
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import {
  Sparkles, Download, Shuffle, Type as TypeIcon, RotateCw,
  AlignLeft, AlignCenter, Layout, Type, Palette, Frame, MousePointer2,
  Settings2, Columns, Image as ImageIcon, X, Layers, Sliders, Monitor, Move,
  Copy, Check, Share2, Languages, Brush, Sun, Contrast as ShadowIcon, Box,
  ChevronDown, Globe, Droplets, SunMedium, Focus, Key, Save, Clock, Keyboard
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import PreviewCard from './components/PreviewCard';
import HistoryPanel from './components/HistoryPanel';
import ShortcutsHelp from './components/ShortcutsHelp';
import { TextStylePreset, AspectRatio, MoodType, LayoutType, FontStyle, BackgroundConfig, ShadowConfig, StrokeConfig } from './types';
import { PRESETS, generateVariants } from './utils/constants';
import { analyzeTextForStyle, generateBackground } from './services/geminiService';
import { saveToHistory, HistoryItem } from './services/historyService';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getRandomPoem } from './utils/poems';

const MOODS: MoodType[] = ['Minimal', 'Zen', 'Classic', 'Nature', 'Romantic', 'Vintage', 'Cyberpunk'];

const DEFAULT_BG_CONFIG: BackgroundConfig = {
  brightness: 1, blur: 0, contrast: 1, opacity: 0.8, grayscale: 0,
  positionX: 50, positionY: 50, texture: 'none'
};

const DEFAULT_SHADOW: ShadowConfig = { enabled: false, color: '#00000040', blur: 10, offsetX: 5, offsetY: 5 };
const DEFAULT_STROKE: StrokeConfig = { enabled: false, color: '#000000', width: 2 };

type Lang = 'zh' | 'en';

const FONT_OPTIONS = [
  { value: FontStyle.SANS, label: '现代几何 / Modern Sans', preview: 'f-sans' },
  { value: FontStyle.SERIF, label: '经典衬线 / Classic Serif', preview: 'f-serif' },
  { value: FontStyle.VINTAGE_SONG, label: '隽秀宋体 / Vintage Song', preview: 'f-vintage' },
  { value: FontStyle.BOLD, label: '沉稳黑体 / Bold Impact', preview: 'f-bold' },
  { value: FontStyle.CALLIGRAPHY, label: '苍劲书法 / Traditional', preview: 'f-cursive' },
  { value: FontStyle.BRUSH, label: '飞白狂草 / Ink Brush', preview: 'f-brush' },
  { value: FontStyle.POETIC, label: '灵动随笔 / Poetic Hand', preview: 'f-poetic' },
  { value: FontStyle.INK, label: '秀丽行书 / Graceful Ink', preview: 'f-ink' },
  { value: FontStyle.FUN, label: '趣意美术 / Playful Type', preview: 'f-fun' },
  { value: FontStyle.MARKER, label: '街头涂鸦 / Urban Marker', preview: 'f-marker' },
  { value: FontStyle.SCRIPT, label: '浪漫手写 / Elegant Script', preview: 'f-script' },
];

const CustomSelect = <T extends string>({
  value, options, onChange, icon, label
}: {
  value: T, options: { value: T, label: string, preview?: string }[], onChange: (val: T) => void, icon?: React.ReactNode, label?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">{label}</label>}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:border-black/20 ${isOpen ? 'ring-2 ring-black/5 border-black/20 shadow-lg' : 'shadow-sm'}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && <span className="text-slate-400 group-hover:text-black transition-colors shrink-0">{icon}</span>}
          <span className={`text-[11px] font-bold uppercase tracking-wider truncate ${selectedOption?.preview || ''}`}>
            {selectedOption?.label}
          </span>
        </div>
        <ChevronDown size={14} className={`text-slate-300 transition-transform duration-500 shrink-0 ${isOpen ? 'rotate-180 text-black' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-[110] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full px-4 py-3 flex items-center justify-between text-left rounded-xl transition-all mb-0.5 last:mb-0 ${value === opt.value ? 'bg-black text-white shadow-md' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <span className={`text-[11px] font-bold uppercase tracking-wider ${opt.preview || ''}`}>
                  {opt.label}
                </span>
                {value === opt.value && <Check size={12} className="text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('zh');
  const [text, setText] = useState<string>(() => getRandomPoem().text);
  const [activeStyle, setActiveStyle] = useState<TextStylePreset>({
    ...PRESETS[2], shadow: DEFAULT_SHADOW, stroke: DEFAULT_STROKE
  });
  const [allStyles, setAllStyles] = useState<TextStylePreset[]>([]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('4:5');
  const [activeMood, setActiveMood] = useState<MoodType>('Zen');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(DEFAULT_BG_CONFIG);

  const [customScale, setCustomScale] = useState(1);
  const [customLineHeight, setCustomLineHeight] = useState(1.5);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'download' | 'copy' | 'share' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'presets' | 'background'>('parameters');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [exportTransparent, setExportTransparent] = useState(false);
  const [isApiKeyModalClosing, setIsApiKeyModalClosing] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gemini_api_key') || '';
    }
    return '';
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useMemo(() => ({
    zh: {
      studio: "ArtText Studio 尊享版",
      author: "作者主页",
      copy: "复制内容", share: "分享海报", save: "高清下载", success: "同步成功", history: "历史记录", shortcuts: "快捷键", transparent: "透明背景",
      draftTitle: "文学构想", placeholder: "在此处书写您的灵感...",
      aspectRatio: "画布画幅", mood: "艺术意境", aiGen: "AI 艺术探索", shuffle: "灵感漫游", bg: "图层管理",
      params: "深度参数", styles: "风格画廊", layer: "背景引擎", chromatics: "色彩构成", base: "底色", ink: "墨迹",
      geometry: "构图排版", typography: "大师字体", glyphScale: "字符比重", lineRhythm: "行间韵律",
      viewportOffset: "空间偏移", postFx: "表面物理特性", opacity: "不透明度", blur: "光学模糊", brightness: "亮度调节",
      purge: "清空背景", noData: "未探测到物理图层", saving: "渲染中...",
      fxTitle: "后期特效", shadow: "空间投影", stroke: "边缘描边", texture: "纸张质感",
      layoutParams: "构图细项", xOffset: "水平位移", yOffset: "垂直位移",
      shadowBlur: "阴影模糊", strokeWidth: "描边宽度", tone: "色调",
      fonts: { modern: "现代", classic: "典雅", hand: "手写", antique: "古风", brush: "泼墨", ink: "灵动" },
      apiKey: "API 密钥", apiKeyDesc: "输入您的 Google Gemini API 密钥以启用 AI 功能", apiKeyPlaceholder: "请输入 API 密钥...", saveApiKey: "保存密钥", close: "关闭"
    },
    en: {
      studio: "ArtText Studio Pro",
      author: "Author",
      copy: "Copy Content", share: "Share Poster", save: "High-Res Export", success: "Synced Successfully", history: "History", shortcuts: "Shortcuts", transparent: "Transparent",
      draftTitle: "Composition", placeholder: "Write your inspiration here...",
      aspectRatio: "Canvas", mood: "Vibe", aiGen: "AI Discover", shuffle: "Surprise Me", bg: "Layer Manager",
      params: "Fine-tune", styles: "Gallery", layer: "Background Engine", chromatics: "Chromatic", base: "Base", ink: "Ink",
      geometry: "Composition", typography: "Typography", glyphScale: "Glyph Weight", lineRhythm: "Line Rhythm",
      viewportOffset: "Spatial Offset", postFx: "Physical Surface", opacity: "Opacity", blur: "Optic Blur", brightness: "Brightness",
      purge: "Clear Layer", noData: "No layer data detected", saving: "Rendering...",
      fxTitle: "Post-Processing", shadow: "Drop Shadow", stroke: "Stroke", texture: "Material Texture",
      layoutParams: "Layout Params", xOffset: "X Displacement", yOffset: "Y Displacement",
      shadowBlur: "Shadow Blur", strokeWidth: "Stroke Width", tone: "Tone",
      fonts: { modern: "Modern", classic: "Classic", hand: "Hand", antique: "Antique", brush: "Brush", ink: "Poetic" },
      apiKey: "API Key", apiKeyDesc: "Enter your Google Gemini API key to enable AI features", apiKeyPlaceholder: "Enter API key...", saveApiKey: "Save Key", close: "Close"
    }
  }[lang]), [lang]);

  useEffect(() => {
    const variants = generateVariants(text);
    setAllStyles([...PRESETS, ...variants]);
  }, [text]);

  const updatePalette = useCallback((updates: Partial<typeof activeStyle.palette>) => {
    setActiveStyle(prev => ({ ...prev, palette: { ...prev.palette, ...updates } }));
  }, []);

  const updateShadow = useCallback((updates: Partial<ShadowConfig>) => {
    setActiveStyle(prev => ({ ...prev, shadow: { ...(prev.shadow || DEFAULT_SHADOW), ...updates } }));
  }, []);

  const updateStroke = useCallback((updates: Partial<StrokeConfig>) => {
    setActiveStyle(prev => ({ ...prev, stroke: { ...(prev.stroke || DEFAULT_STROKE), ...updates } }));
  }, []);

  const updateBgConfig = useCallback((updates: Partial<BackgroundConfig>) => {
    setBgConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', apiKey);
      window.location.reload();
    }
  };

  const handleCloseApiKeyModal = () => {
    setIsApiKeyModalClosing(true);
    setTimeout(() => {
      setIsApiKeyModalClosing(false);
      setShowApiKeyModal(false);
    }, 200); // 与动画时长匹配
  };

  const handleAIMagic = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTextForStyle(text, activeMood);
      const matched = PRESETS.find(p => p.id === analysis.suggestedStyleId) || PRESETS[Math.floor(Math.random() * PRESETS.length)];
      setActiveStyle({ ...matched, shadow: DEFAULT_SHADOW, stroke: DEFAULT_STROKE });
      const img = await generateBackground(`${activeMood} ${analysis.bgPrompt || "artistic background"}`);
      if (img) { setBgImage(img); setActiveTab('background'); }
    } finally { setIsAnalyzing(false); }
  };

  const handleShuffle = () => {
    const randomIdx = Math.floor(Math.random() * allStyles.length);
    const s = allStyles[randomIdx];
    setActiveStyle({ ...s, shadow: s.shadow || DEFAULT_SHADOW, stroke: s.stroke || DEFAULT_STROKE });
    setBgImage(null); setBgConfig(DEFAULT_BG_CONFIG);
    setCustomScale(1); setCustomLineHeight(parseFloat(s.lineHeight) || 1.5);
  };

  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true); setExportType('download');
    try {
      await document.fonts.ready;

      const targetElement = cardRef.current;
      const originalStyle = targetElement.getAttribute('style');

      targetElement.style.position = 'fixed';
      targetElement.style.left = '0';
      targetElement.style.top = '0';
      targetElement.style.zIndex = '-9999';
      targetElement.style.opacity = '0';
      targetElement.style.pointerEvents = 'none';
      targetElement.style.transform = 'none';
      targetElement.style.overflow = 'visible';
      targetElement.style.width = targetElement.offsetWidth + 'px';

      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await htmlToImage.toPng(targetElement, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: exportTransparent ? 'transparent' : undefined
      });

      targetElement.setAttribute('style', originalStyle || '');

      const link = document.createElement('a');
      link.download = `ArtText-Pro-${Date.now()}.png`; link.href = dataUrl; link.click();
      triggerSuccess();
    } catch (err) { console.error('Export Error:', err); } finally { setIsExporting(false); setExportType(null); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => { setBgImage(event.target?.result as string); setActiveTab('background'); };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true); setExportType('copy');
    try {
      const blob = await htmlToImage.toBlob(cardRef.current, { pixelRatio: 2 });
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        triggerSuccess();
      }
    } catch (err) { console.error('Clipboard Error:', err); } finally { setIsExporting(false); setExportType(null); }
  };

  const triggerSuccess = () => { setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000); };

  const handleSaveToHistory = useCallback(() => {
    saveToHistory({
      text,
      style: activeStyle,
      aspectRatio,
      mood: activeMood,
      bgImage,
      bgConfig,
      customScale,
      customLineHeight,
    });
  }, [text, activeStyle, aspectRatio, activeMood, bgImage, bgConfig, customScale, customLineHeight]);

  const handleRestoreFromHistory = useCallback((item: HistoryItem) => {
    setText(item.text);
    setActiveStyle(item.style);
    setAspectRatio(item.aspectRatio);
    setActiveMood(item.mood);
    setBgImage(item.bgImage);
    setBgConfig(item.bgConfig);
    setCustomScale(item.customScale);
    setCustomLineHeight(item.customLineHeight);
  }, []);

  // 自动保存到历史记录（当用户进行重要操作时）
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.trim()) {
        handleSaveToHistory();
      }
    }, 2000); // 2秒后自动保存
    return () => clearTimeout(timer);
  }, [text, activeStyle.id, aspectRatio, activeMood]);

  // 快捷键配置
  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      allowInInput: true,
      action: () => {
        if (text.trim()) {
          handleSaveToHistory();
          triggerSuccess();
        }
      },
      description: 'Save to history'
    },
    {
      key: 'd',
      ctrl: true,
      allowInInput: true,
      action: () => {
        handleDownload();
      },
      description: 'Download image'
    },
    {
      key: 'c',
      ctrl: true,
      shift: true,
      allowInInput: true,
      action: () => {
        handleCopyToClipboard();
      },
      description: 'Copy to clipboard'
    },
    {
      key: ' ',
      allowInInput: false,
      action: () => {
        if (!isAnalyzing && !isExporting) {
          handleShuffle();
        }
      },
      description: 'Random style'
    },
    {
      key: 'h',
      ctrl: true,
      allowInInput: true,
      action: () => {
        setShowHistoryPanel(true);
      },
      description: 'Open history'
    },
    {
      key: '?',
      shift: true,
      allowInInput: false,
      action: () => {
        setShowShortcutsHelp(true);
      },
      description: 'Show shortcuts'
    }
  ]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>ArtText Studio - AI 文本艺术生成器 | Text Art Generator</title>
        <meta name="description" content="使用 AI 将文字瞬间转化为令人惊叹的艺术作品。支持多种艺术风格、中英文字体、背景图层自定义，一键导出高清图片。" />
        <meta name="keywords" content="AI文本艺术生成器, 文字转图片, 艺术字生成, text art generator, AI art, Gemini AI, 文字海报设计, calligraphy, typography design, 中文艺术字" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Eververdants" />
        <meta name="copyright" content="Eververdants" />
        <meta name="language" content="zh-CN, en" />
        <meta name="theme-color" content="#ffffff" />

        <link rel="canonical" href="https://eververdants.github.io/ArtText-Studio" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eververdants.github.io/ArtText-Studio" />
        <meta property="og:title" content="ArtText Studio - AI 文本艺术生成器" />
        <meta property="og:description" content="使用 AI 将文字瞬间转化为令人惊叹的艺术作品。支持多种艺术风格、中英文字体、背景图层自定义，一键导出高清图片。" />
        <meta property="og:image" content="https://eververdants.github.io/ArtText-Studio/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ArtText Studio" />
        <meta property="og:locale" content="zh_CN" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://eververdants.github.io/ArtText-Studio" />
        <meta name="twitter:title" content="ArtText Studio - AI 文本艺术生成器" />
        <meta name="twitter:description" content="使用 AI 将文字瞬间转化为令人惊叹的艺术作品。" />
        <meta name="twitter:image" content="https://eververdants.github.io/ArtText-Studio/og-image.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "ArtText Studio",
            "description": "AI-powered text art generator that transforms words into stunning visual masterpieces",
            "url": "https://eververdants.github.io/ArtText-Studio",
            "author": {
              "@type": "Person",
              "name": "Eververdants"
            },
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-[#F4F5F7] selection:bg-black selection:text-white">
        <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden border border-slate-100">
              <img src="/logo.png" alt="ArtText Studio Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black tracking-tight uppercase transition-colors group-hover:text-slate-600 leading-none">{t.studio}</h1>
              <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-widest hidden sm:block">Professional Grade V5.1</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* 移动端：仅显示图标 */}
            <a href="https://eververdants.github.io" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black border border-slate-100 transition-all active:scale-95 shadow-sm group">
              <Globe size={14} className="group-hover:rotate-12 transition-transform" /> <span>{t.author}</span>
            </a>
            <button onClick={() => setShowApiKeyModal(true)} className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black border border-slate-100 transition-all active:scale-95 shadow-sm">
              <Key size={14} /> <span className="hidden lg:inline">{t.apiKey}</span>
            </button>
            <button onClick={() => setShowHistoryPanel(true)} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black border border-slate-100 transition-all active:scale-95 shadow-sm">
              <Clock size={14} /> <span className="hidden sm:inline">{t.history}</span>
            </button>
            <button onClick={() => setShowShortcutsHelp(true)} className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black border border-slate-100 transition-all active:scale-95 shadow-sm">
              <Keyboard size={14} /> <span className="hidden lg:inline">{t.shortcuts}</span>
            </button>
            <button onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black border border-slate-100 transition-all active:scale-95 shadow-sm">
              <Languages size={14} /> <span className="hidden sm:inline">{lang.toUpperCase()}</span>
            </button>
            <div className="hidden lg:flex h-6 w-[1px] bg-slate-200 mx-2" />
            <button
              onClick={() => setExportTransparent(!exportTransparent)}
              className={`hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 shadow-sm ${exportTransparent ? 'bg-black text-white border-black' : 'bg-white text-slate-400 hover:text-black border-slate-100'}`}
            >
              <span className="hidden lg:inline">{t.transparent}</span>
              <span className="lg:hidden">T</span>
            </button>
            <button onClick={handleCopyToClipboard} disabled={isExporting} className="hidden sm:flex items-center gap-1 sm:gap-2 bg-white text-slate-500 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-black transition-all active:scale-95 border border-slate-100 shadow-sm disabled:opacity-50">
              {exportType === 'copy' ? <RotateCw size={14} className="animate-spin" /> : <Copy size={14} />} <span className="hidden lg:inline">{t.copy}</span>
            </button>
            <button onClick={handleDownload} disabled={isExporting} className="flex items-center gap-1 sm:gap-2 bg-black text-white px-3 sm:px-7 py-2 sm:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-black/10 disabled:opacity-50">
              {exportType === 'download' ? <RotateCw size={14} className="animate-spin" /> : <Download size={14} />} <span className="hidden sm:inline">{isExporting && exportType === 'download' ? t.saving : t.save}</span>
            </button>
          </div>
        </nav>

        <main className="flex-1 max-w-[1700px] mx-auto w-full p-3 sm:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-3 space-y-4 sm:space-y-8 lg:sticky lg:top-28 stagger-item animate-fade-in-up delay-100">
            <div className="bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 group transition-all hover:shadow-2xl">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 sm:mb-5 group-focus-within:text-black">{t.draftTitle}</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.placeholder} className="w-full h-32 sm:h-48 p-0 bg-transparent border-0 outline-none resize-none text-base sm:text-lg font-medium leading-relaxed custom-scrollbar placeholder:text-slate-200" />
            </div>
            <div className="bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4 sm:space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.aspectRatio}</label>
                <div className="flex p-1.5 bg-slate-50 rounded-2xl gap-2 border border-slate-100">
                  {(['1:1', '4:5', '9:16'] as AspectRatio[]).map(r => (
                    <button key={r} onClick={() => setAspectRatio(r)} className={`flex-1 py-2 text-[10px] font-black rounded-xl transition-all ${aspectRatio === r ? 'bg-white text-black shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>{r}</button>
                  ))}
                </div>
              </div>
              <CustomSelect label={t.mood} value={activeMood} options={MOODS.map(m => ({ value: m, label: m }))} onChange={(m) => setActiveMood(m as MoodType)} icon={<Monitor size={14} />} />
              <button onClick={handleAIMagic} disabled={isAnalyzing} className="w-full flex items-center justify-center gap-3 py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.97] shadow-2xl shadow-black/20 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {isAnalyzing ? <RotateCw size={16} className="animate-spin" /> : <Sparkles size={16} />} {t.aiGen}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col items-center stagger-item animate-fade-in-up delay-200">
            <div className={`w-full transition-all duration-1000 ${isAnalyzing ? 'scale-[0.98] blur-[1px]' : 'scale-100'}`}>
              <PreviewCard text={text} style={activeStyle} cardRef={cardRef} aspectRatio={aspectRatio} bgImage={bgImage} bgConfig={bgConfig} customScaleOffset={customScale} customLineHeight={customLineHeight} isAnalyzing={isAnalyzing} isExporting={isExporting} lang={lang} />
            </div>
            <div className="mt-4 sm:mt-10 flex justify-center gap-3 sm:gap-5 w-full max-w-[500px]">
              <button onClick={handleShuffle} className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-black shadow-xl shadow-slate-100 group"><Shuffle size={14} className="sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-700" /> <span className="hidden sm:inline">{t.shuffle}</span></button>
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-black shadow-xl shadow-slate-100 group"><ImageIcon size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">{t.bg}</span></button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 sm:space-y-8 stagger-item animate-fade-in-up delay-300">
            <div className="bg-white rounded-2xl sm:rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col h-[60vh] sm:h-[70vh] lg:h-[calc(100vh-200px)]">
              <div className="flex border-b border-slate-100 p-1.5 sm:p-2 gap-1.5 sm:gap-2 bg-slate-50/30">
                {[{ id: 'parameters', label: t.params, icon: <Sliders size={14} /> }, { id: 'presets', label: t.styles, icon: <TypeIcon size={14} /> }, { id: 'background', label: t.bg, icon: <Layers size={14} /> }].map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-2 sm:py-4 flex items-center justify-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl sm:rounded-2xl transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                    {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6 lg:p-10 overflow-y-auto custom-scrollbar flex-1">
                <div className={`transition-all duration-500 ${isAnalyzing ? 'opacity-30' : 'opacity-100'}`}>
                  {activeTab === 'parameters' && (
                    <div className="space-y-12 animate-scale-in">
                      <div className="space-y-8">
                        <CustomSelect label={t.typography} value={activeStyle.font} options={FONT_OPTIONS} onChange={(f) => setActiveStyle(p => ({ ...p, font: f }))} icon={<Brush size={14} />} />
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                          {[LayoutType.LEFT_ALIGNED, LayoutType.CENTERED, LayoutType.BOTTOM_LEFT, LayoutType.ELEGANT_VERTICAL, LayoutType.MODERN_BORDER].map(l => (
                            <button key={l} onClick={() => setActiveStyle(p => ({ ...p, layout: l }))} className={`aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl transition-all border ${activeStyle.layout === l ? 'bg-black text-white border-black shadow-2xl scale-105 sm:scale-110' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:border-slate-300 active:bg-white'}`}>
                              {l === LayoutType.CENTERED && <AlignCenter size={16} className="sm:w-[18px] sm:h-[18px]" />}
                              {l === LayoutType.LEFT_ALIGNED && <AlignLeft size={16} className="sm:w-[18px] sm:h-[18px]" />}
                              {l === LayoutType.BOTTOM_LEFT && <MousePointer2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
                              {l === LayoutType.ELEGANT_VERTICAL && <Columns size={16} className="sm:w-[18px] sm:h-[18px]" />}
                              {l === LayoutType.MODERN_BORDER && <Frame size={16} className="sm:w-[18px] sm:h-[18px]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 space-y-3 sm:space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><Palette size={12} /> {t.chromatics}</label>
                          <div className="flex gap-3 sm:gap-4">
                            <div className="relative group flex-1">
                              <input type="color" value={activeStyle.palette.background} onChange={(e) => updatePalette({ background: e.target.value })} className="w-full h-10 sm:h-12 rounded-xl border-0 bg-transparent cursor-pointer shadow-sm group-hover:shadow-md transition-all" />
                              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5" />
                            </div>
                            <div className="relative group flex-1">
                              <input type="color" value={activeStyle.palette.text} onChange={(e) => updatePalette({ text: e.target.value })} className="w-full h-10 sm:h-12 rounded-xl border-0 bg-transparent cursor-pointer shadow-sm group-hover:shadow-md transition-all" />
                              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/5" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 flex flex-col justify-between space-y-3 sm:space-y-0">
                          <div className="flex items-center justify-between gap-3">
                            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 sm:gap-2 flex-shrink-0"><ShadowIcon size={12} /> <span className="hidden sm:inline">{t.shadow}</span><span className="sm:hidden">阴影</span></label>
                            <button onClick={() => updateShadow({ enabled: !activeStyle.shadow?.enabled })} className={`w-11 h-6 sm:w-9 sm:h-5 rounded-full transition-all relative flex-shrink-0 ${activeStyle.shadow?.enabled ? 'bg-black' : 'bg-slate-300'}`}>
                              <div className={`absolute top-1 w-4 h-4 sm:w-3 sm:h-3 rounded-full bg-white transition-all ${activeStyle.shadow?.enabled ? 'left-6 sm:left-5' : 'left-1'}`} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-3 sm:mt-4">
                            <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 sm:gap-2 flex-shrink-0"><Box size={12} /> <span className="hidden sm:inline">{t.stroke}</span><span className="sm:hidden">描边</span></label>
                            <button onClick={() => updateStroke({ enabled: !activeStyle.stroke?.enabled })} className={`w-11 h-6 sm:w-9 sm:h-5 rounded-full transition-all relative flex-shrink-0 ${activeStyle.stroke?.enabled ? 'bg-black' : 'bg-slate-300'}`}>
                              <div className={`absolute top-1 w-4 h-4 sm:w-3 sm:h-3 rounded-full bg-white transition-all ${activeStyle.stroke?.enabled ? 'left-6 sm:left-5' : 'left-1'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6 sm:space-y-10 p-4 sm:p-8 bg-slate-50/50 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-inner">
                        <div className="space-y-3 sm:space-y-5 group">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 group-hover:text-black transition-colors"><span>{t.glyphScale}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{customScale.toFixed(2)}x</span></div>
                          <input type="range" min="0.5" max="1.5" step="0.01" value={customScale} onChange={(e) => setCustomScale(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300 transition-all" />
                        </div>
                        <div className="space-y-3 sm:space-y-5 group">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 group-hover:text-black transition-colors"><span>{t.lineRhythm}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{customLineHeight.toFixed(2)}</span></div>
                          <input type="range" min="0.8" max="2.5" step="0.05" value={customLineHeight} onChange={(e) => setCustomLineHeight(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300 transition-all" />
                        </div>
                      </div>
                      {(activeStyle.shadow?.enabled || activeStyle.stroke?.enabled) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-4">
                          {activeStyle.shadow?.enabled && (
                            <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 space-y-3 sm:space-y-5 shadow-sm">
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{t.shadowBlur}</span>
                              <input type="range" min="0" max="50" value={activeStyle.shadow.blur} onChange={(e) => updateShadow({ blur: parseInt(e.target.value) })} className="w-full h-1 bg-slate-100 rounded-full appearance-none accent-black" />
                              <div className="flex items-center gap-2">
                                <input type="color" value={activeStyle.shadow.color.substring(0, 7)} onChange={(e) => updateShadow({ color: e.target.value + '40' })} className="w-6 h-6 rounded-lg overflow-hidden border-0 cursor-pointer" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase">{t.tone}</span>
                              </div>
                            </div>
                          )}
                          {activeStyle.stroke?.enabled && (
                            <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 space-y-3 sm:space-y-5 shadow-sm">
                              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{t.strokeWidth}</span>
                              <input type="range" min="1" max="10" value={activeStyle.stroke.width} onChange={(e) => updateStroke({ width: parseInt(e.target.value) })} className="w-full h-1 bg-slate-100 rounded-full appearance-none accent-black" />
                              <div className="flex items-center gap-2">
                                <input type="color" value={activeStyle.stroke.color} onChange={(e) => updateStroke({ color: e.target.value })} className="w-6 h-6 rounded-lg overflow-hidden border-0 cursor-pointer" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase">{t.tone}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'presets' && (
                    <div className="grid grid-cols-4 gap-4 animate-scale-in">
                      {allStyles.map((s, i) => (
                        <button key={s.id} onClick={() => { setActiveStyle({ ...s, shadow: DEFAULT_SHADOW, stroke: DEFAULT_STROKE }); setBgImage(null); }} className={`aspect-square rounded-2xl transition-all border border-slate-100 relative group overflow-hidden ${activeStyle.id === s.id ? 'ring-4 ring-black ring-offset-4 scale-90 shadow-2xl' : 'hover:scale-105 opacity-90'}`} style={{ background: s.palette.background, animationDelay: `${i * 20}ms` }}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100"><Check size={24} className={s.palette.text === '#FFFFFF' ? 'text-white' : 'text-black'} strokeWidth={3} /></div>
                        </button>
                      ))}
                    </div>
                  )}

                  {activeTab === 'background' && (
                    <div className="space-y-8 sm:space-y-12 animate-scale-in">
                      <div className="space-y-4 sm:space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1"><Sun size={14} /> {t.texture}</label>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          {['none', 'grain'].map(tex => (
                            <button key={tex} onClick={() => updateBgConfig({ texture: tex as any })} className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase transition-all border ${bgConfig.texture === tex ? 'bg-black text-white shadow-xl scale-[1.02]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:border-slate-300'}`}>
                              {tex === 'none' ? '纯净画布' : '复古纤维'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 bg-slate-50/50 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-inner">
                        <div className="space-y-4 sm:space-y-6 group">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><span><Droplets size={12} /> {t.opacity}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{Math.round(bgConfig.opacity * 100)}%</span></div>
                          <input type="range" min="0" max="1" step="0.01" value={bgConfig.opacity} onChange={(e) => updateBgConfig({ opacity: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300" />
                        </div>
                        <div className="space-y-4 sm:space-y-6 group">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><span><SunMedium size={12} /> {t.brightness}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{Math.round(bgConfig.brightness * 100)}%</span></div>
                          <input type="range" min="0.2" max="2" step="0.01" value={bgConfig.brightness} onChange={(e) => updateBgConfig({ brightness: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300" />
                        </div>
                        <div className="space-y-6 group">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><span><Focus size={12} /> {t.blur}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{bgConfig.blur}px</span></div>
                          <input type="range" min="0" max="20" step="1" value={bgConfig.blur} onChange={(e) => updateBgConfig({ blur: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300" />
                        </div>
                        <div className="space-y-6 group pt-4 border-t border-slate-100">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>{t.xOffset}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{bgConfig.positionX}%</span></div>
                          <input type="range" min="0" max="100" value={bgConfig.positionX} onChange={(e) => updateBgConfig({ positionX: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300" />
                        </div>
                        <div className="space-y-6 group">
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400"><span>{t.yOffset}</span><span className="text-black bg-white px-2 rounded-lg shadow-sm">{bgConfig.positionY}%</span></div>
                          <input type="range" min="0" max="100" value={bgConfig.positionY} onChange={(e) => updateBgConfig({ positionY: parseInt(e.target.value) })} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-black hover:bg-slate-300" />
                        </div>
                      </div>

                      <button onClick={() => setBgImage(null)} className="w-full py-5 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm hover:shadow-xl hover:shadow-red-200"><X size={14} /> {t.purge}</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-12 text-center bg-white/50 border-t border-slate-200/50 mt-12 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">ArtText Studio Pro V5.1.0</p>
            <div className="h-[1px] w-12 bg-slate-200" />
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3">Designed and Developed by <a href="https://eververdants.github.io" target="_blank" rel="noopener noreferrer" className="text-black font-black hover:underline underline-offset-4 decoration-slate-200 transition-all">EverVerdants</a></p>
          </div>
          <p className="text-[8px] font-mono text-slate-300 uppercase tracking-widest">SYSTEM CLUSTER 9 • HIGH-RESOLUTION OUTPUT ENABLED</p>
        </footer>
        {showSuccess && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-bottom-6 flex items-center gap-3"><Check size={16} className="text-green-400" /> {t.success}</div>}

        <HistoryPanel
          isOpen={showHistoryPanel}
          onClose={() => setShowHistoryPanel(false)}
          onRestore={handleRestoreFromHistory}
          lang={lang}
        />

        <ShortcutsHelp
          isOpen={showShortcutsHelp}
          onClose={() => setShowShortcutsHelp(false)}
          lang={lang}
        />

        {(showApiKeyModal || isApiKeyModalClosing) && (
          <div className={`fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm ${isApiKeyModalClosing ? 'animate-fade-out' : 'animate-fade-in'}`}>
            <div className={`bg-white rounded-2xl sm:rounded-[32px] p-6 sm:p-10 shadow-2xl max-w-md w-[calc(100%-2rem)] sm:w-full mx-4 ${isApiKeyModalClosing ? 'animate-scale-out-modal' : 'animate-scale-in-modal'}`}>
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                  <Key size={18} className="sm:w-5 sm:h-5 text-black" />
                  {t.apiKey}
                </h2>
                <button onClick={handleCloseApiKeyModal} className="p-2 hover:bg-slate-100 active:scale-95 rounded-xl transition-all">
                  <X size={14} className="sm:w-4 sm:h-4 text-slate-400" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6 leading-relaxed">{t.apiKeyDesc}</p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t.apiKeyPlaceholder}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-mono focus:outline-none focus:border-black transition-colors mb-4 sm:mb-6"
              />
              <button
                onClick={handleSaveApiKey}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 bg-black text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.97] shadow-xl shadow-black/10"
              >
                <Save size={14} className="sm:w-4 sm:h-4" />
                {t.saveApiKey}
              </button>
            </div>
          </div>
        )}

        {/* 移动端底部快捷操作栏 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white/90 backdrop-blur-xl border-t border-slate-200 px-4 py-3 safe-area-bottom">
          <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
            <button
              onClick={handleCopyToClipboard}
              disabled={isExporting}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-slate-100 active:bg-slate-100 transition-all disabled:opacity-50 min-w-[60px]"
            >
              {exportType === 'copy' ? <RotateCw size={18} className="animate-spin" /> : <Copy size={18} />}
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">{t.copy}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex flex-col items-center gap-1 px-4 py-2 bg-black text-white rounded-xl active:scale-95 transition-all disabled:opacity-50 min-w-[70px] shadow-lg"
            >
              {exportType === 'download' ? <RotateCw size={18} className="animate-spin" /> : <Download size={18} />}
              <span className="text-[9px] font-bold uppercase tracking-wider">{isExporting && exportType === 'download' ? t.saving : t.save}</span>
            </button>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-slate-100 active:bg-slate-100 transition-all min-w-[60px]"
            >
              <Key size={18} />
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">API</span>
            </button>
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default App;
