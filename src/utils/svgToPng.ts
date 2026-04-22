import type { FontFaceSpec } from './fonts';
import { buildFontFaceCss } from './fonts';

export async function svgToPng(
  svg: SVGSVGElement,
  options: { scale?: number; fontFaces?: FontFaceSpec[] } = {},
): Promise<Blob> {
  const { scale = 3, fontFaces = [] } = options;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  if (fontFaces.length) {
    const css = await buildFontFaceCss(fontFaces);
    if (css) {
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = css;
      const defs =
        clone.querySelector('defs') ||
        clone.insertBefore(
          document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
          clone.firstChild,
        );
      defs.insertBefore(style, defs.firstChild);
    }
  }

  const vb = svg.viewBox.baseVal;
  const width = vb && vb.width ? vb.width : svg.getBoundingClientRect().width;
  const height = vb && vb.height ? vb.height : svg.getBoundingClientRect().height;

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('SVG image load failed'));
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('PNG encode failed'));
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
