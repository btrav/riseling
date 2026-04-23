import { useRef } from 'react';
import type { Config } from '../types';
import { SHAPE_REGISTRY } from '../shapes';
import { ExportMenu } from './ExportMenu';
import { CopyLinkButton } from './CopyLinkButton';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';

type Props = { config: Config };

export function PreviewCanvas({ config }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const Shape = SHAPE_REGISTRY[config.shape];
  const { toast, show } = useToast();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 lg:px-6">
        <span className="font-display text-base font-semibold tracking-tight text-gray-700">
          Preview
        </span>
        <div className="flex items-center gap-2">
          <CopyLinkButton onCopied={show} />
          <ExportMenu svgRef={svgRef} config={config} onExported={show} />
        </div>
      </div>
      <div className="checkered-bg flex flex-1 items-center justify-center overflow-auto p-4 lg:p-8">
        <div className="rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-sm">
          <Shape config={config} ref={svgRef} />
        </div>
      </div>
      <Toast message={toast?.message ?? null} />
    </div>
  );
}
