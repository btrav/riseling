import type { ShapeProps } from '../types';
import { useShapeState } from './useShapeState';
import { ShapeFrame } from './ShapeFrame';
import { TitleCaption, StandardLabels } from './primitives';

const W = 440;
const H = 620;

const heartCx = W / 2;
const heartTop = 130;
const heartBottom = 410;
const heartWidth = 280;
const heartHeight = heartBottom - heartTop;
const heartX = heartCx - heartWidth / 2;

function heartPath(): string {
  const x = heartX;
  const y = heartTop;
  const w = heartWidth;
  const h = heartHeight;
  const notchY = y + h * 0.3;
  return [
    `M ${x + w / 2} ${notchY}`,
    `C ${x + w * 0.2} ${y}, ${x} ${y + h * 0.15}, ${x} ${y + h * 0.4}`,
    `C ${x} ${y + h * 0.6}, ${x + w * 0.3} ${y + h * 0.78}, ${x + w / 2} ${y + h}`,
    `C ${x + w * 0.7} ${y + h * 0.78}, ${x + w} ${y + h * 0.6}, ${x + w} ${y + h * 0.4}`,
    `C ${x + w} ${y + h * 0.15}, ${x + w * 0.8} ${y}, ${x + w / 2} ${notchY}`,
    'Z',
  ].join(' ');
}

const path = heartPath();

export function Heart({ config, ref, fit }: ShapeProps) {
  const state = useShapeState(config);
  const { percent, fonts, colors, ids, raised, displayPercent, renderedConfig } = state;

  const fillHeight = (heartHeight * percent) / 100;
  const clipY = heartBottom - fillHeight;

  return (
    <ShapeFrame width={W} height={H} fit={fit} ref={ref}>
      <defs>
        <linearGradient
          id={ids.gradId}
          x1={heartCx}
          y1={clipY}
          x2={heartCx}
          y2={heartBottom}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={colors.fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={colors.fillShadow} />
        </linearGradient>
        <clipPath id={ids.clipId}>
          <rect x={0} y={clipY} width={W} height={H - clipY} />
        </clipPath>
        <clipPath id={ids.highlightClipId}>
          <path d={path} />
        </clipPath>
      </defs>

      <TitleCaption config={config} fonts={fonts} width={W} titleY={50} captionY={78} />

      <path
        d={path}
        fill={config.trackColor}
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${ids.clipId})`}>
        <path d={path} fill={`url(#${ids.gradId})`} />
      </g>

      <g clipPath={`url(#${ids.highlightClipId})`} style={{ mixBlendMode: 'screen' }}>
        <ellipse
          cx={heartCx - heartWidth * 0.22}
          cy={heartTop + heartHeight * 0.45}
          rx={heartWidth * 0.08}
          ry={heartHeight * 0.12}
          fill="white"
          opacity={0.42}
          transform={`rotate(-25 ${heartCx - heartWidth * 0.22} ${heartTop + heartHeight * 0.45})`}
        />
      </g>

      <StandardLabels
        config={config}
        fonts={fonts}
        width={W}
        raised={raised}
        displayPercent={displayPercent}
        renderedConfig={renderedConfig}
        raisedY={480}
        raisedLabelY={502}
        goalY={540}
      />
    </ShapeFrame>
  );
}
