import type { Config, ShapeKey } from '../types';
import { FONT_THEMES } from '../utils/fonts';
import type { FontKey } from '../utils/fonts';
import { CURRENCY_PRESETS, presetKey } from '../utils/currencies';
import { LIVE_SHAPES, SHAPE_LABELS } from '../shapes';

type Props = {
  config: Config;
  set: (patch: Partial<Config>) => void;
};

export function ControlsPanel({ config, set }: Props) {
  const currencyKey = `${config.currency}:${config.locale}`;

  function handleCurrencyChange(key: string) {
    const [code, locale] = key.split(':');
    if (code && locale) set({ currency: code, locale });
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Riseling</h1>
        <p className="text-xs text-gray-500">Fundraising image generator</p>
      </div>

      <div className="flex flex-col gap-5 px-5 py-4">
        <Field label="Shape">
          <select
            value={config.shape}
            onChange={(e) => set({ shape: e.target.value as ShapeKey })}
            className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm"
          >
            {LIVE_SHAPES.map((k) => (
              <option key={k} value={k}>
                {SHAPE_LABELS[k]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Title">
          <input
            type="text"
            value={config.title}
            onChange={(e) => set({ title: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
          />
        </Field>

        <Field label="Caption (optional)">
          <input
            type="text"
            value={config.caption}
            onChange={(e) => set({ caption: e.target.value })}
            placeholder="e.g. Ends Friday · All proceeds to X"
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
          />
        </Field>

        <Field label="Goal">
          <input
            type="number"
            value={config.target}
            onChange={(e) => set({ target: Number(e.target.value) || 0 })}
            min={0}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
          />
        </Field>

        <Field label="Raised">
          <input
            type="number"
            value={config.current}
            onChange={(e) => set({ current: Number(e.target.value) || 0 })}
            min={0}
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
          />
        </Field>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-700">Tracking</span>
          <div className="grid grid-cols-2 gap-2 rounded-md bg-gray-100 p-1">
            <SegmentButton
              active={config.useCurrencyFormat}
              onClick={() => set({ useCurrencyFormat: true })}
            >
              Currency
            </SegmentButton>
            <SegmentButton
              active={!config.useCurrencyFormat}
              onClick={() => set({ useCurrencyFormat: false })}
            >
              Custom unit
            </SegmentButton>
          </div>
        </div>

        {config.useCurrencyFormat ? (
          <Field label="Currency">
            <select
              value={currencyKey}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm"
            >
              {CURRENCY_PRESETS.map((p) => (
                <option key={presetKey(p)} value={presetKey(p)}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="Unit label">
            <input
              type="text"
              value={config.unitLabel}
              onChange={(e) => set({ unitLabel: e.target.value })}
              placeholder="e.g. books, miles, meals"
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
            />
          </Field>
        )}

        <Field label="Font">
          <select
            value={config.font}
            onChange={(e) => set({ font: e.target.value as FontKey })}
            className="w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm"
          >
            {Object.values(FONT_THEMES).map((theme) => (
              <option key={theme.key} value={theme.key}>
                {theme.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fill color">
            <input
              type="color"
              value={config.fillColor}
              onChange={(e) => set({ fillColor: e.target.value })}
              className="h-9 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </Field>
          <Field label="Track color">
            <input
              type="color"
              value={config.trackColor}
              onChange={(e) => set({ trackColor: e.target.value })}
              className="h-9 w-full cursor-pointer rounded-md border border-gray-300"
            />
          </Field>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-200 px-5 py-3 text-[11px] text-gray-400">
        v0.2.0 · Slice 2
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function SegmentButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded px-2 py-1 text-xs font-medium transition-colors ' +
        (active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')
      }
    >
      {children}
    </button>
  );
}
