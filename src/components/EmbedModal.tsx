import { useEffect, useMemo, useRef, useState } from 'react';
import type { Config } from '../types';
import { buildEmbedCode, buildViewerLink } from '../utils/buildEmbedCode';

type Props = {
  open: boolean;
  config: Config;
  onClose: () => void;
  onCopied: (message: string) => void;
};

const SHAPE_ASPECT: Record<string, { w: number; h: number }> = {
  thermometer: { w: 440, h: 720 },
  bar: { w: 560, h: 320 },
  ring: { w: 440, h: 560 },
  jar: { w: 440, h: 610 },
  battery: { w: 560, h: 380 },
  heart: { w: 440, h: 620 },
};

function defaultDimensions(shape: string, targetWidth = 400) {
  const aspect = SHAPE_ASPECT[shape] ?? { w: 440, h: 720 };
  const height = Math.round((targetWidth * aspect.h) / aspect.w);
  return { width: targetWidth, height };
}

export function EmbedModal({ open, config, onClose, onCopied }: Props) {
  const initial = useMemo(() => defaultDimensions(config.shape), [config.shape]);
  const [width, setWidth] = useState(initial.width);
  const [height, setHeight] = useState(initial.height);
  const [background, setBackground] = useState<'white' | 'transparent'>('white');
  const [showEditLink, setShowEditLink] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const next = defaultDimensions(config.shape);
    setWidth(next.width);
    setHeight(next.height);
  }, [open, config.shape]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const opts = { config, width, height, background, showEditLink, interactive };
  const snippet = buildEmbedCode(opts);
  const previewSrc = buildViewerLink(opts);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      onCopied('Embed code copied');
    } catch {
      onCopied('Copy failed');
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Embed code"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[min(640px,90vh)] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-gray-900">Embed</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-500 hover:bg-gray-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 4 L12 12 M12 4 L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-0 overflow-hidden md:grid-cols-[1fr_280px]">
          <div className="flex items-center justify-center overflow-auto bg-gray-50 p-6">
            <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
              <iframe
                key={previewSrc}
                src={previewSrc}
                width={width}
                height={height}
                style={{ border: 0, display: 'block', maxWidth: '100%' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Embed preview"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto border-t border-gray-200 bg-white p-5 md:border-l md:border-t-0">
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-medium text-gray-700">Width</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Math.max(120, Number(e.target.value) || 0))}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-medium text-gray-700">Height</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Math.max(120, Number(e.target.value) || 0))}
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-gray-700">Background</span>
              <div className="grid grid-cols-2 gap-2 rounded-md bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setBackground('white')}
                  className={
                    'rounded px-2 py-1 text-xs font-medium ' +
                    (background === 'white' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600')
                  }
                >
                  White
                </button>
                <button
                  type="button"
                  onClick={() => setBackground('transparent')}
                  className={
                    'rounded px-2 py-1 text-xs font-medium ' +
                    (background === 'transparent'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600')
                  }
                >
                  Transparent
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showEditLink}
                onChange={(e) => setShowEditLink(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900"
              />
              Show “Edit in Riseling” link
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={interactive}
                onChange={(e) => setInteractive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900"
              />
              Click opens editor in new tab
            </label>

            <p className="rounded-md border border-amber-200 bg-amber-50 p-2.5 text-[11px] leading-snug text-amber-900">
              Embeds freeze the current state. Updating the raised amount later
              means copying a new snippet and replacing the iframe src wherever
              you pasted it.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 p-4">
          <textarea
            readOnly
            value={snippet}
            rows={4}
            className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-xs text-gray-800"
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={copy}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Copy embed code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
