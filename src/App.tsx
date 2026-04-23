import { ControlsPanel } from './components/ControlsPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { useConfig } from './state/useConfig';

export default function App() {
  const { config, set, reset } = useConfig();

  return (
    <div className="flex h-dvh flex-col bg-gray-50 lg:grid lg:grid-cols-[320px_1fr]">
      <div className="order-1 h-[55vh] min-h-0 lg:order-2 lg:h-full">
        <PreviewCanvas config={config} />
      </div>
      <div className="order-2 min-h-0 flex-1 lg:order-1 lg:h-full lg:overflow-hidden">
        <ControlsPanel config={config} set={set} reset={reset} />
      </div>
    </div>
  );
}
