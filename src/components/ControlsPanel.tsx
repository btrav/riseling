import type { Config, ShapeKey } from '../types';
import { FONT_THEMES } from '../utils/fonts';
import type { FontKey } from '../utils/fonts';
import { CURRENCY_PRESETS, presetKey } from '../utils/currencies';
import { LIVE_SHAPES, SHAPE_LABELS } from '../shapes';

type Props = {
  config: Config;
  set: (patch: Partial<Config>) => void;
  reset: () => void;
};

type TrackingMode = 'currency' | 'custom' | 'impact';

function currentMode(config: Config): TrackingMode {
  if (config.impactUnitEnabled) return 'impact';
  if (config.useCurrencyFormat) return 'currency';
  return 'custom';
}

export function ControlsPanel({ config, set, reset }: Props) {
  function handleReset() {
    if (window.confirm('Reset all fields to defaults?')) reset();
  }
  const currencyKey = `${config.currency}:${config.locale}`;
  const mode = currentMode(config);

  function setMode(next: TrackingMode) {
    if (next === 'currency') {
      set({ useCurrencyFormat: true, impactUnitEnabled: false });
    } else if (next === 'custom') {
      set({ useCurrencyFormat: false, impactUnitEnabled: false });
    } else {
      set({ useCurrencyFormat: true, impactUnitEnabled: true });
    }
  }

  function handleCurrencyChange(key: string) {
    const [code, locale] = key.split(':');
    if (code && locale) set({ currency: code, locale });
  }

  function toggleVisibility(key: keyof Config['show']) {
    set({ show: { ...config.show, [key]: !config.show[key] } });
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto border-t border-gray-200 bg-white lg:border-t-0 lg:border-r">
      <div className="border-b border-gray-200 px-5 py-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-gray-900">
          Riseling
        </h1>
        <p className="text-xs text-gray-500">Fundraising image generator</p>
      </div>

      <div className="flex flex-col gap-5 px-5 py-4">
        <Field label="Title">
          <input
            type="text"
            value={config.title}
            onChange={(e) => set({ title: e.target.value })}
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

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-700">Tracking</span>
          <div className="grid grid-cols-3 gap-1 rounded-md bg-gray-100 p-1">
            <SegmentButton active={mode === 'currency'} onClick={() => setMode('currency')}>
              Currency
            </SegmentButton>
            <SegmentButton active={mode === 'custom'} onClick={() => setMode('custom')}>
              Custom unit
            </SegmentButton>
            <SegmentButton active={mode === 'impact'} onClick={() => setMode('impact')}>
              Impact unit
            </SegmentButton>
          </div>

          {mode === 'currency' && (
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
          )}

          {mode === 'custom' && (
            <input
              type="text"
              value={config.unitLabel}
              onChange={(e) => set({ unitLabel: e.target.value })}
              placeholder="e.g. books, miles, meals"
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
            />
          )}

          {mode === 'impact' && (
            <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-gray-50 p-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-600">
                  Each unit equals
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={currencyKey}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs"
                  >
                    {CURRENCY_PRESETS.map((p) => (
                      <option key={presetKey(p)} value={presetKey(p)}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={config.impactUnitValue}
                    onChange={(e) => set({ impactUnitValue: Number(e.target.value) || 0 })}
                    min={1}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1 text-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-600">Unit label</span>
                <input
                  type="text"
                  value={config.impactUnitLabel}
                  onChange={(e) => set({ impactUnitLabel: e.target.value })}
                  placeholder="e.g. sessions, meals, books"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                />
              </div>
              <p className="text-[10px] leading-snug text-gray-500">
                Shows progress in units (e.g. “30 sessions funded of 100 goal”) instead of
                the money total.
              </p>
            </div>
          )}
        </div>

        <Field label="Caption (optional)">
          <input
            type="text"
            value={config.caption}
            onChange={(e) => set({ caption: e.target.value })}
            placeholder="e.g. Ends Friday"
            className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm"
          />
        </Field>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-gray-700">Show / hide</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <Toggle label="Title" checked={config.show.title} onChange={() => toggleVisibility('title')} />
            <Toggle label="Caption" checked={config.show.caption} onChange={() => toggleVisibility('caption')} />
            <Toggle label="Raised" checked={config.show.raised} onChange={() => toggleVisibility('raised')} />
            <Toggle label="Goal" checked={config.show.goal} onChange={() => toggleVisibility('goal')} />
            <Toggle label="Percent" checked={config.show.percentage} onChange={() => toggleVisibility('percentage')} />
          </div>
        </div>

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

      <div className="mt-auto flex items-center justify-between border-t border-gray-200 px-5 py-3 text-[11px] text-gray-400">
        <span>v0.6.0 · Impact units</span>
        <button
          type="button"
          onClick={handleReset}
          className="rounded px-2 py-0.5 text-[11px] font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        >
          Reset
        </button>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-gray-900"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
