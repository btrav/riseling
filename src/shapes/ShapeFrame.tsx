import type { ReactNode, Ref } from 'react';

type Props = {
  width: number;
  height: number;
  fit?: boolean;
  ref?: Ref<SVGSVGElement>;
  children: ReactNode;
};

export function ShapeFrame({ width, height, fit, ref, children }: Props) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={fit ? '100%' : width}
      height={fit ? '100%' : height}
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: 'block',
        maxWidth: fit ? '100%' : undefined,
        maxHeight: fit ? '100svh' : undefined,
      }}
    >
      {children}
    </svg>
  );
}
