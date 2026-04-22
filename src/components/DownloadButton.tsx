import { useState } from 'react';
import { svgToPng, downloadBlob } from '../utils/svgToPng';

type Props = {
  svgRef: React.RefObject<SVGSVGElement | null>;
  title: string;
};

export function DownloadButton({ svgRef, title }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (!svgRef.current || busy) return;
    setBusy(true);
    try {
      const blob = await svgToPng(svgRef.current, 3);
      const safe = title.trim().replace(/\s+/g, '-').toLowerCase() || 'riseling';
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
