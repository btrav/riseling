import { useRef } from 'react';
import type { Config } from '../types';
import { SHAPE_REGISTRY } from '../shapes';
import { DownloadButton } from './DownloadButton';

type Props = { config: Config };

export function PreviewCanvas({ config }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const Shape = SHAPE_REGISTRY[config.shape];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <span className="text-sm font-medium text-gray-600">Preview</span>
        <DownloadButton svgRef={svgRef} config={config} />
      </div>
      <div className="checkered-bg flex flex-1 items-center justify-center overflow-auto p-10">
        <div className="rounded-2xl border border-black/5 bg-white px-7 py-7 shadow-sm">
          <Shape config={config} ref={svgRef} />
        </div>
      </div>
    </div>
  );
}
