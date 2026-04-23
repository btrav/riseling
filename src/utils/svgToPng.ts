import type { FontFaceSpec } from './fonts';
import { buildFontFaceCss } from './fonts';

type SvgToPngOptions = {
  scale?: number;
  fontFaces?: FontFaceSpec[];
  targetWidth?: number;
  targetHeight?: number;
  bwFriendly?: boolean;
};

export async function svgToPng(svg: SVGSVGElement, options: SvgToPngOptions = {}): Promise<Blob> {
  const { scale = 3, fontFaces = [], targetWidth, targetHeight, bwFriendly } = options;
  const { svgString, width: sourceWidth, height: sourceHeight } = await prepareSvgString(
    svg,
    fontFaces,
  );

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

    if (targetWidth && targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      const padding = 0.08;
      const usableW = targetWidth * (1 - padding * 2);
      const usableH = targetHeight * (1 - padding * 2);
      const sourceAspect = sourceWidth / sourceHeight;
      const usableAspect = usableW / usableH;

      let drawW: number;
      let drawH: number;
      if (sourceAspect > usableAspect) {
        drawW = usableW;
        drawH = usableW / sourceAspect;
      } else {
        drawH = usableH;
        drawW = usableH * sourceAspect;
      }
      const offsetX = (targetWidth - drawW) / 2;
      const offsetY = (targetHeight - drawH) / 2;

      if (bwFriendly) {
        ctx.filter = 'grayscale(1) contrast(1.35) brightness(0.92)';
      }
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
      if (bwFriendly) ctx.filter = 'none';
    } else {
      canvas.width = Math.round(sourceWidth * scale);
      canvas.height = Math.round(sourceHeight * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context not available');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, sourceWidth, sourceHeight);
    }

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

export async function svgToSvgBlob(
  svg: SVGSVGElement,
  fontFaces: FontFaceSpec[] = [],
): Promise<Blob> {
  const { svgString } = await prepareSvgString(svg, fontFaces);
  return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
}

async function prepareSvgString(
  svg: SVGSVGElement,
  fontFaces: FontFaceSpec[],
): Promise<{ svgString: string; width: number; height: number }> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  sanitizeIds(clone);

  if (fontFaces.length) {
    const css = await buildFontFaceCss(fontFaces);
    if (css) {
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = css;
      let defs = clone.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        clone.insertBefore(defs, clone.firstChild);
      }
      defs.insertBefore(style, defs.firstChild);
    }
  }

  const vb = svg.viewBox.baseVal;
  const rect = svg.getBoundingClientRect();
  const width = vb && vb.width ? vb.width : rect.width;
  const height = vb && vb.height ? vb.height : rect.height;

  const svgString = new XMLSerializer().serializeToString(clone);
  return { svgString, width, height };
}

function sanitizeIds(node: Element) {
  const ATTRS_WITH_URL_REFS = ['clip-path', 'fill', 'stroke', 'filter', 'mask'];
  const idMap = new Map<string, string>();

  node.querySelectorAll('[id]').forEach((el) => {
    const oldId = el.getAttribute('id');
    if (oldId && /[:#]/.test(oldId)) {
      const newId = oldId.replace(/[:#]/g, '_');
      idMap.set(oldId, newId);
      el.setAttribute('id', newId);
    }
  });

  if (!idMap.size) return;

  const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);
  let current: Node | null = walker.currentNode;
  while (current) {
    if (current instanceof Element) {
      ATTRS_WITH_URL_REFS.forEach((attr) => {
        const val = current instanceof Element ? current.getAttribute(attr) : null;
        if (val) {
          let replaced = val;
          idMap.forEach((newId, oldId) => {
            replaced = replaced.replaceAll(`url(#${oldId})`, `url(#${newId})`);
          });
          if (replaced !== val && current instanceof Element) {
            current.setAttribute(attr, replaced);
          }
        }
      });
    }
    current = walker.nextNode();
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
