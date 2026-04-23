import type { ShapeProps } from '../types';
import { useShapeState } from './useShapeState';
import { ShapeFrame } from './ShapeFrame';
import { TitleCaption, StandardLabels } from './primitives';

const W = 560;
const H = 380;
const bodyX = 70;
const bodyY = 130;
const bodyWidth = 400;
const bodyHeight = 100;
const bodyR = 18;
const termX = bodyX + bodyWidth;
const termY = bodyY + 30;
const termWidth = 14;
const termHeight = 40;
const termR = 4;
const innerPad = 8;

export function Battery({ config, ref, fit }: ShapeProps) {
  const state = useShapeState(config);
  const { percent, fonts, colors, ids, raised, displayPercent, renderedConfig } = state;

  const fillAreaWidth = bodyWidth - 2 * innerPad;
  const fillWidth = Math.max(0, (fillAreaWidth * percent) / 100);

  return (
    <ShapeFrame width={W} height={H} fit={fit} ref={ref}>
      <defs>
        <linearGradient id={ids.gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={colors.fillShadow} />
        </linearGradient>
        <clipPath id={ids.clipId}>
          <rect
            x={bodyX + innerPad}
            y={bodyY + innerPad}
            width={fillAreaWidth}
            height={bodyHeight - 2 * innerPad}
            rx={bodyR - innerPad / 2}
          />
        </clipPath>
      </defs>

      <TitleCaption config={config} fonts={fonts} width={W} titleY={60} captionY={90} />

      <rect
        x={termX}
        y={termY}
        width={termWidth}
        height={termHeight}
        rx={termR}
        fill={config.trackColor}
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      <rect
        x={bodyX}
        y={bodyY}
        width={bodyWidth}
        height={bodyHeight}
        rx={bodyR}
        fill={config.trackColor}
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${ids.clipId})`}>
        <rect
          x={bodyX + innerPad}
          y={bodyY + innerPad}
          width={fillWidth}
          height={bodyHeight - 2 * innerPad}
          fill={`url(#${ids.gradId})`}
        />
        {fillWidth > 24 && (
          <g style={{ mixBlendMode: 'screen' }}>
            <rect
              x={bodyX + innerPad + 8}
              y={bodyY + innerPad + 4}
              width={Math.max(0, fillWidth - 20)}
              height={3}
              rx={1.5}
              fill="white"
              opacity={0.4}
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
        raisedY={294}
        raisedLabelY={316}
        goalY={350}
        raisedSize={40}
      />
    </ShapeFrame>
  );
}
