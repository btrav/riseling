import interRegular from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
import interSemibold from '@fontsource/inter/files/inter-latin-600-normal.woff2?url';
import interBold from '@fontsource/inter/files/inter-latin-700-normal.woff2?url';
import frauncesRegular from '@fontsource/fraunces/files/fraunces-latin-400-normal.woff2?url';
import frauncesSemibold from '@fontsource/fraunces/files/fraunces-latin-600-normal.woff2?url';
import frauncesBold from '@fontsource/fraunces/files/fraunces-latin-700-normal.woff2?url';
import instrumentSerifRegular from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url';

export type FontKey = 'system' | 'editorial' | 'serif-display';

export type FontFaceSpec = {
  family: string;
  weight: number;
  url: string;
};

export type FontTheme = {
  key: FontKey;
  label: string;
  families: {
    title: string;
    numbers: string;
    labels: string;
  };
  faces: FontFaceSpec[];
};

const SYSTEM_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const FONT_THEMES: Record<FontKey, FontTheme> = {
  system: {
    key: 'system',
    label: 'System',
    families: {
      title: SYSTEM_STACK,
      numbers: SYSTEM_STACK,
      labels: SYSTEM_STACK,
    },
    faces: [],
  },
  editorial: {
    key: 'editorial',
    label: 'Editorial (Fraunces + Inter)',
    families: {
      title: `"Fraunces", Georgia, serif`,
      numbers: `"Fraunces", Georgia, serif`,
      labels: `"Inter", ${SYSTEM_STACK}`,
    },
    faces: [
      { family: 'Fraunces', weight: 400, url: frauncesRegular },
      { family: 'Fraunces', weight: 600, url: frauncesSemibold },
      { family: 'Fraunces', weight: 700, url: frauncesBold },
      { family: 'Inter', weight: 400, url: interRegular },
      { family: 'Inter', weight: 600, url: interSemibold },
    ],
  },
  'serif-display': {
    key: 'serif-display',
    label: 'Serif Display (Instrument Serif + Inter)',
    families: {
      title: `"Instrument Serif", Georgia, serif`,
      numbers: `"Instrument Serif", Georgia, serif`,
      labels: `"Inter", ${SYSTEM_STACK}`,
    },
    faces: [
      { family: 'Instrument Serif', weight: 400, url: instrumentSerifRegular },
      { family: 'Inter', weight: 400, url: interRegular },
      { family: 'Inter', weight: 600, url: interSemibold },
      { family: 'Inter', weight: 700, url: interBold },
    ],
  },
};

const dataUrlCache = new Map<string, string>();

export async function getFontDataUrl(url: string): Promise<string> {
  const cached = dataUrlCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${url}`);
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  dataUrlCache.set(url, dataUrl);
  return dataUrl;
}

export async function buildFontFaceCss(faces: FontFaceSpec[]): Promise<string> {
  if (!faces.length) return '';
  const entries = await Promise.all(
    faces.map(async (f) => {
      const dataUrl = await getFontDataUrl(f.url);
      return `@font-face { font-family: "${f.family}"; font-weight: ${f.weight}; font-style: normal; src: url(${dataUrl}) format("woff2"); }`;
    }),
  );
  return entries.join('\n');
}
