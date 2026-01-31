
export enum FontStyle {
  SANS = 'SANS',
  SERIF = 'SERIF',
  CALLIGRAPHY = 'CALLIGRAPHY',
  VINTAGE_SONG = 'VINTAGE_SONG',
  MONO = 'MONO',
  BRUSH = 'BRUSH',
  POETIC = 'POETIC',
  FUN = 'FUN',
  INK = 'INK',
  BOLD = 'BOLD',
  MARKER = 'MARKER',
  SCRIPT = 'SCRIPT'
}

export enum LayoutType {
  CENTERED = 'CENTERED',
  LEFT_ALIGNED = 'LEFT_ALIGNED',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  ELEGANT_VERTICAL = 'ELEGANT_VERTICAL',
  MODERN_BORDER = 'MODERN_BORDER'
}

export type AspectRatio = '1:1' | '4:5' | '9:16';

export interface BackgroundConfig {
  brightness: number;
  blur: number;
  contrast: number;
  opacity: number;
  grayscale: number;
  positionX: number;
  positionY: number;
  texture: 'none' | 'grain' | 'ink' | 'canvas';
}

export interface ColorPalette {
  background: string;
  text: string;
  accent: string;
  borderColor?: string;
  name: string;
  secondary?: string;
  gradient?: string;
}

export interface ShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface StrokeConfig {
  enabled: boolean;
  color: string;
  width: number;
}

export interface TextStylePreset {
  id: string;
  name: string;
  font: FontStyle;
  layout: LayoutType;
  palette: ColorPalette;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  letterSpacing: string;
  lineHeight: string;
  decoration?: string;
  shadow?: ShadowConfig;
  stroke?: StrokeConfig;
}

export interface AIAnalysisResult {
  recommendedVibe: string;
  suggestedStyleId?: string;
  explanation: string;
  bgPrompt?: string;
}

export type MoodType = 'Classic' | 'Cyberpunk' | 'Nature' | 'Minimal' | 'Romantic' | 'Vintage' | 'Zen';
