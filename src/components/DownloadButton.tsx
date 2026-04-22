import { useState } from 'react';
import { svgToPng, downloadBlob } from '../utils/svgToPng';
import { FONT_THEMES } from '../utils/fonts';
import type { Config } from '../types';

type Props = {
  svgRef: React.RefObject<SVGSVGElement | null>;
  config: Config;
};

export function DownloadButton({ svgRef, config }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (!svgRef.current || busy) return;
    setBusy(true);
    try {
      const theme = FONT_THEMES[config.font];
      const blob = await svgToPng(svgRef.current, {
        scale: 3,
        fontFaces: theme.faces,
      });
      const safe = config.title.trim().replace(/\s+/g, '-').toLowerCase() || 'riseling';
      downloadBlob(blob, `${safe}.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
    >
      {busy ? 'Exporting…' : 'Download PNG'}
    </button>
  );
}
