import type { ShapeProps } from '../types';
import { useShapeState } from './useShapeState';
import { ShapeFrame } from './ShapeFrame';
import { TitleCaption, StandardLabels } from './primitives';

const W = 560;
const barX = 60;
const barWidth = W - 2 * barX;
const barHeight = 44;

export function HorizontalBar({ config, ref, fit }: ShapeProps) {
  const state = useShapeState(config);
  const { percent, fonts, colors, ids, raised, displayPercent, renderedConfig } = state;

  const hasCaption = config.show.caption && !!config.caption.trim();
  const topOffset = hasCaption ? 20 : 0;
  const H = 320 + topOffset;
  const barY = 130 + topOffset;

  const fillWidth = Math.max(0, (barWidth * percent) / 100);

  return (
    <ShapeFrame width={W} height={H} fit={fit} ref={ref}>
      <defs>
        <linearGradient id={ids.gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={colors.fillShadow} />
        </linearGradient>
        <clipPath id={ids.clipId}>
          <rect x={barX} y={barY} width={barWidth} height={barHeight} rx={barHeight / 2} />
        </clipPath>
      </defs>

      <TitleCaption config={config} fonts={fonts} width={W} titleY={60} captionY={90} />

      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        rx={barHeight / 2}
        fill={config.trackColor}
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${ids.clipId})`}>
        <rect x={barX} y={barY} width={fillWidth} height={barHeight} fill={`url(#${ids.gradId})`} />
        {fillWidth > barHeight * 0.6 && (
          <g style={{ mixBlendMode: 'screen' }}>
            <rect
              x={barX + 8}
              y={barY + 4}
              width={Math.max(0, fillWidth - 16)}
              height={3}
              rx={1.5}
              fill="white"
              opacity={0.42}
            />
          </g>
        )}
      </g>

      <StandardLabels
        config={config}
        fonts={fonts}
        width={W}
        raised={raised}
        displayPercent={displayPercent}
        renderedConfig={renderedConfig}
        raisedY={244 + topOffset}
        raisedLabelY={265 + topOffset}
        goalY={299 + topOffset}
      />
    </ShapeFrame>
  );
}
