import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, progressPercent } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

const W = 440;
const H = 560;
const cx = W / 2;
const cy = 260;
const r = 130;
const strokeWidth = 32;
const circumference = 2 * Math.PI * r;

export function ProgressRing({ config, ref }: ShapeProps) {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));

  const fonts = FONT_THEMES[config.font].families;
  const dashOffset = circumference * (1 - percent / 100);
  const displayPercent = Math.round(percent);
  const renderedConfig = { ...config, current: raised };

  const gradId = useId();

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
        <linearGradient
          id={gradId}
          x1={cx - r}
          y1={cy - r}
          x2={cx + r}
          y2={cy + r}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={fillLight} />
          <stop offset="0.5" stopColor={config.fillColor} />
          <stop offset="1" stopColor={fillShadow} />
        </linearGradient>
      </defs>

      {config.show.title && config.title && (
        <text
          x={W / 2}
          y={50}
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
          y={78}
          textAnchor="middle"
          fontSize={13}
          fontFamily={fonts.labels}
          fill="#6b7280"
          letterSpacing="0.02em"
        >
          {config.caption}
        </text>
      )}

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={config.trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r + strokeWidth / 2}
        fill="none"
        stroke={trackBorder}
        strokeWidth={1}
        opacity={0.25}
        vectorEffect="non-scaling-stroke"
      />

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.percentage ? (
          <>
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize={64}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.03em"
            >
              {displayPercent}%
            </text>
            <text
              x={cx}
              y={cy + 28}
              textAnchor="middle"
              fontSize={12}
              fontFamily={fonts.labels}
              fontWeight={500}
              fill="#9ca3af"
              letterSpacing="0.1em"
            >
              OF GOAL
            </text>
          </>
        ) : (
          config.show.raised && (
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fontSize={38}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.02em"
            >
              {formatValue(raised, renderedConfig)}
            </text>
          )
        )}

        {config.show.raised && config.show.percentage && (
          <>
            <text
              x={W / 2}
              y={470}
              textAnchor="middle"
              fontSize={32}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.02em"
            >
              {formatValue(raised, renderedConfig)}
            </text>
            <text
              x={W / 2}
              y={492}
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
            y={config.show.raised && config.show.percentage ? 524 : 470}
            textAnchor="middle"
            fontSize={14}
            fontFamily={fonts.labels}
            fontWeight={400}
            fill="#6b7280"
          >
            of {formatValue(config.target, config)} goal
          </text>
        )}
      </g>
    </svg>
  );
}
