import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, formatGoalValue, progressPercent, raisedLabelText } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

const W = 440;
const H = 720;

const tubeW = 74;
const tubeX = (W - tubeW) / 2;
const tubeTop = 110;
const bulbR = 58;
const bulbCY = 488;
const cx = tubeX + tubeW / 2;

const topArcEndY = tubeTop + tubeW / 2;
const bulbMeetY = bulbCY - Math.sqrt(bulbR * bulbR - (tubeW / 2) * (tubeW / 2));
const tubeUsable = bulbMeetY - topArcEndY;

const trackPath = [
  `M ${tubeX} ${topArcEndY}`,
  `A ${tubeW / 2} ${tubeW / 2} 0 0 1 ${tubeX + tubeW} ${topArcEndY}`,
  `L ${tubeX + tubeW} ${bulbMeetY}`,
  `A ${bulbR} ${bulbR} 0 1 1 ${tubeX} ${bulbMeetY}`,
  'Z',
].join(' ');

export function Thermometer({ config, ref, fit }: ShapeProps) {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));

  const fonts = FONT_THEMES[config.font].families;
  const fillTubeHeight = (tubeUsable * percent) / 100;
  const clipY = bulbMeetY - fillTubeHeight;

  const displayPercent = Math.round(percent);
  const renderedConfig = { ...config, current: raised };

  const gradId = useId();
  const clipId = useId();
  const highlightClipId = useId();

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
        <linearGradient
          id={gradId}
          x1={cx}
          y1={clipY}
          x2={cx}
          y2={bulbCY + bulbR}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={fillShadow} />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x={0} y={clipY} width={W} height={H - clipY} />
        </clipPath>
        <clipPath id={highlightClipId}>
          <path d={trackPath} />
        </clipPath>
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

      <path
        d={trackPath}
        fill={config.trackColor}
        stroke={trackBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${clipId})`}>
        <path d={trackPath} fill={`url(#${gradId})`} />
      </g>

      <g clipPath={`url(#${highlightClipId})`} style={{ mixBlendMode: 'screen' }}>
        <rect
          x={tubeX + tubeW * 0.22}
          y={topArcEndY - 4}
          width={tubeW * 0.08}
          height={bulbMeetY - topArcEndY + 8}
          fill="white"
          opacity={0.38}
          rx={tubeW * 0.04}
        />
        <ellipse
          cx={cx - bulbR * 0.36}
          cy={bulbCY - bulbR * 0.32}
          rx={bulbR * 0.18}
          ry={bulbR * 0.24}
          fill="white"
          opacity={0.42}
          transform={`rotate(-18 ${cx - bulbR * 0.36} ${bulbCY - bulbR * 0.32})`}
        />
      </g>

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.raised && (
          <>
            <text
              x={W / 2}
              y={644}
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
              y={666}
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
            y={698}
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
            y={698}
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
