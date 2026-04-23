import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, formatGoalValue, progressPercent, raisedLabelText } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

const W = 560;
const H = 320;
const barX = 60;
const barY = 130;
const barWidth = W - 2 * barX;
const barHeight = 44;

export function HorizontalBar({ config, ref, fit }: ShapeProps) {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));

  const fonts = FONT_THEMES[config.font].families;
  const fillWidth = Math.max(0, (barWidth * percent) / 100);
  const displayPercent = Math.round(percent);
  const renderedConfig = { ...config, current: raised };

  const gradId = useId();
  const clipId = useId();

  const fillLight = lighten(config.fillColor, 0.22);
  const fillShadow = darken(config.fillColor, 0.12);
  const trackBorder = darken(config.trackColor, 0.18);

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      width={fit ? '100%' : W}
      height={fit ? '100%' : H}
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: 'block',
        maxWidth: fit ? '100%' : undefined,
        maxHeight: fit ? '100svh' : undefined,
      }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={fillShadow} />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={barX} y={barY} width={barWidth} height={barHeight} rx={barHeight / 2} />
        </clipPath>
      </defs>

      {config.show.title && config.title && (
        <text
          x={W / 2}
          y={60}
          textAnchor="middle"
          fontSize={28}
          fontWeight={600}
          fill="#111827"
          fontFamily={fonts.title}
          letterSpacing="-0.01em"
        >
          {config.title}
        </text>
      )}

      {config.show.caption && config.caption && (
        <text
          x={W / 2}
          y={90}
          textAnchor="middle"
          fontSize={13}
          fontFamily={fonts.labels}
          fill="#6b7280"
          letterSpacing="0.02em"
        >
          {config.caption}
        </text>
      )}

      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        rx={barHeight / 2}
        fill={config.trackColor}
        stroke={trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${clipId})`}>
        <rect x={barX} y={barY} width={fillWidth} height={barHeight} fill={`url(#${gradId})`} />
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

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.raised && (
          <>
            <text
              x={W / 2}
              y={244}
              textAnchor="middle"
              fontSize={42}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.02em"
            >
              {formatValue(raised, renderedConfig)}
            </text>
            <text
              x={W / 2}
              y={265}
              textAnchor="middle"
              fontSize={10}
              fontFamily={fonts.labels}
              fontWeight={500}
              fill="#6b7280"
              letterSpacing="0.1em"
            >
              {raisedLabelText(config)}
            </text>
          </>
        )}

        {config.show.goal && (
          <text
            x={W / 2}
            y={299}
            textAnchor="middle"
            fontSize={14}
            fontFamily={fonts.labels}
            fontWeight={400}
            fill="#6b7280"
          >
            of {formatGoalValue(config.target, config)} goal
            {config.show.percentage && ` · ${displayPercent}%`}
          </text>
        )}

        {!config.show.goal && config.show.percentage && (
          <text
            x={W / 2}
            y={299}
            textAnchor="middle"
            fontSize={14}
            fontFamily={fonts.labels}
            fontWeight={500}
            fill="#9ca3af"
          >
            {displayPercent}% of goal
          </text>
        )}
      </g>
    </svg>
  );
}
