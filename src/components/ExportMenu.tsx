import { useEffect, useRef, useState } from 'react';
import { svgToPng, svgToSvgBlob, downloadBlob } from '../utils/svgToPng';
import { EXPORT_PRESETS } from '../utils/exportPresets';
import type { ExportPreset } from '../utils/exportPresets';
import { FONT_THEMES } from '../utils/fonts';
import type { Config } from '../types';

type Props = {
  svgRef: React.RefObject<SVGSVGElement | null>;
  config: Config;
  onExported: (message: string) => void;
  onOpenEmbed: () => void;
};

export function ExportMenu({ svgRef, config, onExported, onOpenEmbed }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  async function run(preset: ExportPreset) {
    if (!svgRef.current || busy) return;
    setBusy(true);
    setOpen(false);
    try {
      const theme = FONT_THEMES[config.font];
      const safe = config.title.trim().replace(/\s+/g, '-').toLowerCase() || 'riseling';
      if (preset.format === 'svg') {
        const blob = await svgToSvgBlob(svgRef.current, theme.faces);
        downloadBlob(blob, `${safe}.svg`);
      } else {
        const blob = await svgToPng(svgRef.current, {
          scale: preset.scale ?? 3,
          fontFaces: theme.faces,
          targetWidth: preset.targetWidth,
          targetHeight: preset.targetHeight,
          bwFriendly: preset.bwFriendly,
        });
        downloadBlob(blob, `${safe}-${preset.id}.png`);
      }
      onExported(`Downloaded · ${preset.label.replace(/^[A-Z]+ · /, '')}`);
    } catch (err) {
      console.error(err);
      onExported('Export failed');
    } finally {
      setBusy(false);
    }
  }

  const defaultPreset = EXPORT_PRESETS[0];

  return (
    <div ref={rootRef} className="relative flex">
      <button
        type="button"
        onClick={() => run(defaultPreset)}
        disabled={busy}
        className="rounded-l-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {busy ? 'Exporting…' : 'Download'}
      </button>
      <button
        type="button"
        aria-label="Export options"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="rounded-r-md border-l border-gray-700 bg-gray-900 px-2 py-1.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path
            d="M1 3 L5 7 L9 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-72 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="py-1">
            {EXPORT_PRESETS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => run(p)}
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{p.label}</span>
                  <span className="text-xs text-gray-500">{p.description}</span>
                </button>
              </li>
            ))}
            <li className="border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenEmbed();
                }}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">Embed · iframe</span>
                <span className="text-xs text-gray-500">
                  Live-updating-on-share-no, but stays visible on your site
                </span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
