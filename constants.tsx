
import { FontStyle, LayoutType, TextStylePreset } from './types';

export const PALETTES = [
  { background: '#F4F1EA', text: '#323232', accent: '#A68B6A', borderColor: '#A68B6A', name: '书香门第' },
  { background: '#1C1C1E', text: '#F2F2F7', accent: '#0A84FF', borderColor: '#0A84FF', name: '极客深黑' },
  { background: '#D6E4E1', text: '#2F4F4F', accent: '#6B8E23', borderColor: '#6B8E23', name: '林深见鹿' },
  { background: '#E8DED3', text: '#5D4037', accent: '#8D6E63', borderColor: '#8D6E63', name: '大地情怀' },
  { background: '#F9F4F0', text: '#4A4A4A', accent: '#E07A5F', borderColor: '#E07A5F', name: '落日余晖' },
  { background: '#EAF2F8', text: '#2E4053', accent: '#5DADE2', borderColor: '#5DADE2', name: '海之静谧' },
  { background: '#F8F9F9', text: '#212F3C', accent: '#1ABC9C', borderColor: '#1ABC9C', name: '薄荷晨曦' },
  { background: '#212121', text: '#FFFFFF', accent: '#FFEB3B', borderColor: '#FFEB3B', name: '黑金时代' },
  { background: '#FFFBF0', text: '#1A1A1A', accent: '#C62828', borderColor: '#C62828', name: '宣纸丹青' },
  { background: '#2D3436', text: '#DFE6E9', accent: '#00CEC9', borderColor: '#00CEC9', name: '未来都市' },
];

export const PRESETS: TextStylePreset[] = [
  {
    id: 'minimal-zen',
    name: '极简禅意',
    font: FontStyle.SERIF,
    layout: LayoutType.CENTERED,
    palette: PALETTES[0],
    fontSize: 'large',
    letterSpacing: '0.02em',
    lineHeight: '1.6'
  },
  {
    id: 'cyber-dark',
    name: '赛博深邃',
    font: FontStyle.SANS,
    layout: LayoutType.LEFT_ALIGNED,
    palette: PALETTES[1],
    fontSize: 'xlarge',
    letterSpacing: '0.01em',
    lineHeight: '1.2',
    decoration: 'border-l-4 border-accent pl-6'
  },
  {
    id: 'traditional-ink',
    name: '古典水墨',
    font: FontStyle.VINTAGE_SONG,
    layout: LayoutType.ELEGANT_VERTICAL,
    palette: PALETTES[8],
    fontSize: 'xlarge',
    letterSpacing: '0.05em',
    lineHeight: '2.0'
  },
  {
    id: 'modern-clean',
    name: '现代纯净',
    font: FontStyle.SANS,
    layout: LayoutType.CENTERED,
    palette: PALETTES[6],
    fontSize: 'medium',
    letterSpacing: '0.02em',
    lineHeight: '1.5'
  },
  {
    id: 'artistic-brush',
    name: '豪放狂草',
    font: FontStyle.BRUSH,
    layout: LayoutType.CENTERED,
    palette: PALETTES[8],
    fontSize: 'large',
    letterSpacing: '0.05em',
    lineHeight: '1.4'
  }
];

export const generateVariants = (baseText: string): TextStylePreset[] => {
  const fonts = [FontStyle.SANS, FontStyle.SERIF, FontStyle.CALLIGRAPHY, FontStyle.VINTAGE_SONG, FontStyle.BRUSH, FontStyle.POETIC];
  const layouts = [LayoutType.CENTERED, LayoutType.LEFT_ALIGNED, LayoutType.BOTTOM_LEFT, LayoutType.ELEGANT_VERTICAL, LayoutType.MODERN_BORDER];
  
  const variants: TextStylePreset[] = [];
  for(let i=0; i<40; i++) {
    const palette = PALETTES[i % PALETTES.length];
    variants.push({
      id: `gen-${i}`,
      name: `智能预设 ${i + 1}`,
      font: fonts[Math.floor(Math.random() * fonts.length)],
      layout: layouts[Math.floor(Math.random() * layouts.length)],
      palette,
      fontSize: 'large',
      letterSpacing: '0.015em',
      lineHeight: '1.5'
    });
  }
  return variants;
};
