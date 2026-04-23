export type ExportFormat = 'png' | 'svg';

export type ExportPreset = {
  id: string;
  label: string;
  description: string;
  format: ExportFormat;
  targetWidth?: number;
  targetHeight?: number;
  bwFriendly?: boolean;
  scale?: number;
};

export const EXPORT_PRESETS: ExportPreset[] = [
  {
    id: 'native-png',
    label: 'PNG · Native size',
    description: 'Whatever the shape renders at, 3x pixel ratio',
    format: 'png',
    scale: 3,
  },
  {
    id: 'story-png',
    label: 'PNG · Instagram Story',
    description: '1080×1920 (9:16)',
    format: 'png',
    targetWidth: 1080,
    targetHeight: 1920,
  },
  {
    id: 'square-png',
    label: 'PNG · Square',
    description: '1080×1080 (WhatsApp, IG feed)',
    format: 'png',
    targetWidth: 1080,
    targetHeight: 1080,
  },
  {
    id: 'og-png',
    label: 'PNG · Social card',
    description: '1200×630 (email, OG)',
    format: 'png',
    targetWidth: 1200,
    targetHeight: 630,
  },
  {
    id: 'print-png',
    label: 'PNG · Print (B&W safe)',
    description: '8.5×11″ at 300 dpi, grayscale',
    format: 'png',
    targetWidth: 2550,
    targetHeight: 3300,
    bwFriendly: true,
  },
  {
    id: 'svg',
    label: 'SVG · Editable vector',
    description: 'Raw SVG, scalable, editable',
    format: 'svg',
  },
];
