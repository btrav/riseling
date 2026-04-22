import { ControlsPanel } from './components/ControlsPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { useConfig } from './state/useConfig';

export default function App() {
  const { config, set } = useConfig();

  return (
    <div className="grid h-dvh grid-cols-[320px_1fr] bg-gray-50">
      <ControlsPanel config={config} set={set} />
      <PreviewCanvas config={config} />
    </div>
  );
}
