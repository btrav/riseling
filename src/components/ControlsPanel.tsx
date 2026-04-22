import type { Config } from '../types';

type Props = {
  config: Config;
  set: (patch: Partial<Config>) => void;
};

export function ControlsPanel({ config, set }: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Riseling</h1>
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
        v0.1 · Slice 1
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
