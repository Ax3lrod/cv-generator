import { DesignConfig, PaperPreset } from '../types/cv';

export interface PaperSizeInfo {
  id: PaperPreset;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export const PAPER_PRESETS: Record<PaperPreset, PaperSizeInfo> = {
  a4: {
    id: 'a4',
    name: 'A4',
    widthMm: 210,
    heightMm: 297,
    description: '210 × 297 mm (Global & Indonesia standard)',
  },
  letter: {
    id: 'letter',
    name: 'US Letter',
    widthMm: 215.9,
    heightMm: 279.4,
    description: '215.9 × 279.4 mm (8.5 × 11 in - North America)',
  },
  f4: {
    id: 'f4',
    name: 'F4 / Folio',
    widthMm: 215,
    heightMm: 330,
    description: '215 × 330 mm (Standard Folio Indonesia)',
  },
  legal: {
    id: 'legal',
    name: 'US Legal',
    widthMm: 215.9,
    heightMm: 355.6,
    description: '215.9 × 355.6 mm (8.5 × 14 in)',
  },
  custom: {
    id: 'custom',
    name: 'Custom Size',
    widthMm: 210,
    heightMm: 297,
    description: 'Custom dimensions in millimeters',
  },
};

export function getPaperDimensions(config: DesignConfig): { widthMm: number; heightMm: number } {
  if (config.paperSize === 'custom') {
    return {
      widthMm: config.customPaperWidth || 210,
      heightMm: config.customPaperHeight || 297,
    };
  }

  const preset = PAPER_PRESETS[config.paperSize] || PAPER_PRESETS.a4;
  return {
    widthMm: preset.widthMm,
    heightMm: preset.heightMm,
  };
}
