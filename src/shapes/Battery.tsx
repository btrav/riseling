import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, progressPercent } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

const W = 560;
const H = 320;
const bodyX = 70;
const bodyY = 140;
const bodyWidth = 400;
const bodyHeight = 110;
const bodyR = 18;
const termX = bodyX + bodyWidth;
const termY = bodyY + 30;
const termWidth = 14;
const termHeight = 50;
const termR = 4;
const innerPad = 8;

export function Battery({ config, ref }: ShapeProps) {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));

  const fonts = FONT_THEMES[config.font].families;
  const fillAreaWidth = bodyWidth - 2 * innerPad;
  const fillWidth = Math.max(0, (fillAreaWidth * percent) / 100);
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
      width={W}
      height={H}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={fillShadow} />
        </linearGradient>
        <clipPath id={clipId}>
          <rect
            x={bodyX + innerPad}
            y={bodyY + innerPad}
            width={fillAreaWidth}
            height={bodyHeight - 2 * innerPad}
            rx={bodyR - innerPad / 2}
          />
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
        x={termX}
        y={termY}
        width={termWidth}
        height={termHeight}
        rx={termR}
        fill={config.trackColor}
        stroke={trackBorder}
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
        stroke={trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${clipId})`}>
        <rect
          x={bodyX + innerPad}
          y={bodyY + innerPad}
          width={fillWidth}
          height={bodyHeight - 2 * innerPad}
          fill={`url(#${gradId})`}
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

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.raised && (
          <>
            <text
              x={W / 2}
              y={235}
              textAnchor="middle"
              fontSize={40}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.02em"
            >
              {formatValue(raised, renderedConfig)}
            </text>
            <text
              x={W / 2}
              y={258}
              textAnchor="middle"
              fontSize={10}
              fontFamily={fonts.labels}
              fontWeight={500}
              fill="#9ca3af"
              letterSpacing="0.1em"
            >
              RAISED
            </text>
          </>
        )}

        {config.show.goal && (
          <text
            x={W / 2}
            y={292}
            textAnchor="middle"
            fontSize={14}
            fontFamily={fonts.labels}
            fontWeight={400}
            fill="#6b7280"
          >
            of {formatValue(config.target, config)} goal
            {config.show.percentage && ` · ${displayPercent}%`}
          </text>
        )}
      </g>
    </svg>
  );
}
