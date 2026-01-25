
import React, { useState, useLayoutEffect, useRef, useEffect, memo } from 'react';
import { FontStyle, LayoutType, TextStylePreset, AspectRatio, BackgroundConfig } from '../types';

interface PreviewCardProps {
  text: string;
  style: TextStylePreset;
  cardRef: React.RefObject<HTMLDivElement>;
  aspectRatio: AspectRatio;
  bgImage?: string | null;
  bgConfig?: BackgroundConfig;
  customScaleOffset?: number;
  customLineHeight?: number;
  isAnalyzing?: boolean;
  lang?: 'zh' | 'en';
}

interface DisplayBuffer {
  text: string;
  style: TextStylePreset;
  aspectRatio: AspectRatio;
  bgImage: string | null | undefined;
  bgConfig: BackgroundConfig;
  scaleOffset: number;
  lineHeight: number;
}

const DEFAULT_BG_CONFIG: BackgroundConfig = {
  brightness: 1, blur: 0, contrast: 1, opacity: 0.6, grayscale: 0,
  positionX: 50, positionY: 50, texture: 'none'
};

const PreviewCard: React.FC<PreviewCardProps> = ({ 
  text, style, cardRef, aspectRatio, bgImage, 
  bgConfig = DEFAULT_BG_CONFIG,
  customScaleOffset = 1,
  customLineHeight = 1.5,
  isAnalyzing = false,
  lang = 'zh'
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isShutterClosed, setIsShutterClosed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadingText, setLoadingText] = useState("CALIBRATING");

  const [display, setDisplay] = useState<DisplayBuffer>({
    text, style: { ...style }, aspectRatio, bgImage, bgConfig, scaleOffset: customScaleOffset, lineHeight: customLineHeight
  });

  useEffect(() => {
    const isMajorIdentityChange = 
      style.id !== display.style.id || 
      text !== display.text || 
      aspectRatio !== display.aspectRatio ||
      bgImage !== display.bgImage ||
      style.font !== display.style.font ||
      style.layout !== display.style.layout;

    if (isMajorIdentityChange) {
      setIsShutterClosed(true);
      const pool = lang === 'zh' 
        ? ["光学重排", "像素重组", "艺术对焦", "正在渲染意境", "深度校正"] 
        : ["RECONSTRUCTING", "SYNCING PIXELS", "ART FOCUS", "VIBE RENDER", "CALIBRATING"];
      setLoadingText(pool[Math.floor(Math.random() * pool.length)]);

      const swapTimer = setTimeout(() => {
        setDisplay({
          text, style: { ...style }, aspectRatio, bgImage, bgConfig: { ...bgConfig },
          scaleOffset: customScaleOffset, lineHeight: customLineHeight
        });
      }, 500);

      const openTimer = setTimeout(() => {
        setIsShutterClosed(false);
      }, 900);

      return () => {
        clearTimeout(swapTimer);
        clearTimeout(openTimer);
      };
    } else {
      setDisplay({
        text, style: { ...style }, aspectRatio, bgImage, bgConfig: { ...bgConfig },
        scaleOffset: customScaleOffset, lineHeight: customLineHeight
      });
    }
  }, [
    text, style.id, style.font, style.layout, style.palette.background, style.palette.text, 
    style.shadow?.enabled, style.shadow?.blur, style.shadow?.color,
    style.stroke?.enabled, style.stroke?.width, style.stroke?.color,
    aspectRatio, bgImage, bgConfig.texture, bgConfig.opacity, bgConfig.positionX, bgConfig.positionY, 
    bgConfig.brightness, bgConfig.blur, bgConfig.contrast,
    customScaleOffset, customLineHeight, lang
  ]);

  const calculateFit = () => {
    if (!containerRef.current || !contentRef.current) return;
    const container = containerRef.current;
    const content = contentRef.current;
    
    const marginX = container.offsetWidth * 0.15;
    const marginY = container.offsetHeight * 0.15;
    
    const availableW = container.offsetWidth - (marginX * 2);
    const availableH = container.offsetHeight - (marginY * 2);

    const isVertical = display.style.layout === LayoutType.ELEGANT_VERTICAL;
    const originalTransform = content.style.transform;
    content.style.transform = 'none';
    
    const contentW = content.scrollWidth || 1;
    const contentH = content.scrollHeight || 1;
    
    const factorW = availableW / contentW;
    const factorH = availableH / contentH;
    
    let finalFactor = Math.min(factorW, factorH);
    const maxScaleLimit = isVertical ? 1.1 : 1.0;
    finalFactor = Math.min(finalFactor, maxScaleLimit);
    
    const resultScale = finalFactor * (display.scaleOffset || 1);
    content.style.transform = originalTransform;
    
    setScaleFactor(resultScale);
    if (!isReady) setIsReady(true);
  };

  useLayoutEffect(() => {
    const timer = setTimeout(calculateFit, 50);
    return () => clearTimeout(timer);
  }, [display, isReady]);

  useEffect(() => {
    const observer = new ResizeObserver(calculateFit);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [display]);

  const getFontClass = (font: FontStyle) => {
    const fonts = {
      [FontStyle.SERIF]: 'f-serif', [FontStyle.CALLIGRAPHY]: 'f-cursive', [FontStyle.VINTAGE_SONG]: 'f-vintage',
      [FontStyle.BRUSH]: 'f-brush', [FontStyle.POETIC]: 'f-poetic', [FontStyle.FUN]: 'f-fun',
      [FontStyle.INK]: 'f-ink', [FontStyle.BOLD]: 'f-bold', [FontStyle.MARKER]: 'f-marker',
      [FontStyle.SCRIPT]: 'f-script', [FontStyle.MONO]: 'font-mono'
    };
    return fonts[font] || 'f-sans';
  };

  const getLayoutClass = (layout: LayoutType) => {
    switch (layout) {
      case LayoutType.CENTERED: return 'items-center justify-center text-center';
      case LayoutType.LEFT_ALIGNED: return 'items-start justify-center text-left';
      case LayoutType.BOTTOM_LEFT: return 'items-start justify-end text-left pb-12';
      case LayoutType.ELEGANT_VERTICAL: return 'items-center justify-center writing-vertical-rl';
      case LayoutType.MODERN_BORDER: return 'items-center justify-center text-center';
      default: return '';
    }
  };

  const getTransformOrigin = () => {
    switch (display.style.layout) {
      case LayoutType.CENTERED: return 'center center';
      case LayoutType.LEFT_ALIGNED: return 'left center';
      case LayoutType.BOTTOM_LEFT: return 'left bottom';
      case LayoutType.ELEGANT_VERTICAL: return 'center center';
      case LayoutType.MODERN_BORDER: return 'center center';
      default: return 'center center';
    }
  };

  const getAspectClass = (ratio: AspectRatio) => {
    const ratios = { '1:1': 'aspect-square', '9:16': 'aspect-[9/16]' };
    return ratios[ratio] || 'aspect-[4/5]';
  };

  const bgBaseStyle = display.style.palette.background.includes('gradient') 
    ? { background: display.style.palette.background } 
    : { backgroundColor: display.style.palette.background };

  const textStyle: React.CSSProperties = {
    color: display.style.palette.text,
    letterSpacing: `${display.style.letterSpacing || '0.01em'}`, 
    lineHeight: display.lineHeight,
    transform: `scale(${scaleFactor})`,
    transformOrigin: getTransformOrigin(),
    transition: 'color 0.4s ease, text-shadow 0.2s linear, -webkit-text-stroke 0.2s linear',
    willChange: 'transform, color, text-shadow',
    maxWidth: '100%',
  };

  if (display.style.shadow?.enabled) {
    textStyle.textShadow = `${display.style.shadow.offsetX}px ${display.style.shadow.offsetY}px ${display.style.shadow.blur}px ${display.style.shadow.color}`;
  }
  if (display.style.stroke?.enabled) {
    textStyle.WebkitTextStroke = `${display.style.stroke.width}px ${display.style.stroke.color}`;
  }

  return (
    <div 
      ref={cardRef}
      className={`relative w-full max-w-[500px] mx-auto overflow-hidden shadow-2xl ${getAspectClass(display.aspectRatio)} bg-[#0a0a0a] transition-all duration-700 ${isAnalyzing ? 'scale-[0.97] rounded-[48px]' : 'scale-100'} ${display.bgConfig.texture === 'grain' ? 'texture-grain' : ''}`}
    >
      {/* 1. 底色层 (Base Color Layer) */}
      <div className="absolute inset-0 z-0 transition-all duration-700" style={bgBaseStyle} />

      {/* 2. 背景图片层 (AI Image Layer) - 严格覆盖在底色之上 */}
      <div 
        className={`absolute inset-0 z-10 transition-opacity duration-700 ease-in-out ${display.bgImage ? 'opacity-100' : 'opacity-0'}`}
        style={{ opacity: display.bgImage ? display.bgConfig.opacity : 0 }}
      >
        {display.bgImage && (
          <img 
            src={display.bgImage} 
            className="w-full h-full object-cover" 
            style={{
              filter: `brightness(${display.bgConfig.brightness}) blur(${display.bgConfig.blur}px) contrast(${display.bgConfig.contrast}) grayscale(${display.bgConfig.grayscale})`,
              objectPosition: `${display.bgConfig.positionX}% ${display.bgConfig.positionY}%`,
            }}
            alt="" 
          />
        )}
      </div>

      {/* 3. 装饰框层 (Border Layer) */}
      {display.style.layout === LayoutType.MODERN_BORDER && (
        <div 
          className="absolute inset-[8%] border-[8px] md:border-[16px] pointer-events-none transition-all duration-700 z-30 animate-in fade-in zoom-in-95 duration-1000"
          style={{ borderColor: display.style.palette.borderColor || display.style.palette.accent }}
        />
      )}

      {/* 4. 文字内容层 (Text Layer) - 始终在最顶层 */}
      <div 
        ref={containerRef}
        className={`absolute inset-0 z-40 flex p-[10%] overflow-hidden ${getLayoutClass(display.style.layout)}`}
      >
        <div 
          ref={contentRef}
          className={`relative ${getFontClass(display.style.font)} text-4xl md:text-5xl ${display.style.decoration || ''} transition-all duration-700 ${!isReady ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          style={textStyle}
        >
          {display.style.layout === LayoutType.LEFT_ALIGNED && (
            <div 
              className="absolute -left-6 top-0 bottom-0 w-1 transition-colors duration-700" 
              style={{ backgroundColor: display.style.palette.borderColor || display.style.palette.accent }}
            />
          )}
          
          <div className="break-words antialiased">
            {display.text.split('\n').map((line, idx) => (
              <p key={idx} className={`${line.trim() === '' ? 'h-6' : 'mb-3'} whitespace-pre-wrap`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {isAnalyzing && <div className="scan-line"></div>}

      <div 
        className={`absolute inset-0 z-[100] pointer-events-none overflow-hidden transition-all duration-700 ${isShutterClosed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
        style={{ background: 'linear-gradient(to bottom, #111, #000)' }}
      >
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
           <div className="w-14 h-14 border-4 border-white/5 border-t-white/60 rounded-full animate-spin"></div>
           <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase animate-pulse transition-all">{loadingText}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(PreviewCard);
