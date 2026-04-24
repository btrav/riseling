import type { ShapeProps } from '../types';
import { useShapeState } from './useShapeState';
import { ShapeFrame } from './ShapeFrame';
import { TitleCaption } from './primitives';
import { formatValue, formatGoalValue, raisedLabelText } from '../utils/format';

const W = 440;
const H = 500;
const cx = W / 2;
const cy = 230;
const r = 130;
const strokeWidth = 32;
const circumference = 2 * Math.PI * r;

export function ProgressRing({ config, ref, fit }: ShapeProps) {
  const state = useShapeState(config);
  const { percent, fonts, colors, ids, raised, displayPercent, renderedConfig } = state;

  const dashOffset = circumference * (1 - percent / 100);

  const insidePercentMode = config.show.percentage;
  const insideRaisedMode = !config.show.percentage && config.show.raised;

  return (
    <ShapeFrame width={W} height={H} fit={fit} ref={ref}>
      <defs>
        <linearGradient
          id={ids.gradId}
          x1={cx - r}
          y1={cy - r}
          x2={cx + r}
          y2={cy + r}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={colors.fillLight} />
          <stop offset="0.5" stopColor={config.fillColor} />
          <stop offset="1" stopColor={colors.fillShadow} />
        </linearGradient>
      </defs>

      <TitleCaption config={config} fonts={fonts} width={W} titleY={50} captionY={78} />

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
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r + strokeWidth / 2}
        fill="none"
        stroke={colors.trackBorder}
        strokeWidth={1}
        opacity={0.25}
        vectorEffect="non-scaling-stroke"
      />

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={`url(#${ids.gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {insidePercentMode && (
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
              y={cy + 26}
              textAnchor="middle"
              fontSize={12}
              fontFamily={fonts.labels}
              fontWeight={500}
              fill="#6b7280"
              letterSpacing="0.08em"
            >
              OF GOAL
            </text>
          </>
        )}

        {insideRaisedMode && (
          <>
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              fontSize={38}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.02em"
            >
              {formatValue(raised, renderedConfig)}
            </text>
            <text
              x={cx}
              y={cy + 24}
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
            y={446}
            textAnchor="middle"
            fontSize={14}
            fontFamily={fonts.labels}
            fontWeight={400}
            fill="#6b7280"
          >
            {config.show.percentage && config.show.raised
              ? `${formatValue(raised, renderedConfig)} of ${formatGoalValue(config.target, config)}`
              : `of ${formatGoalValue(config.target, config)} goal`}
          </text>
        )}
      </g>
    </ShapeFrame>
  );
}
