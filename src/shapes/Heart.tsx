import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, formatGoalValue, progressPercent, raisedLabelText } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

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

export function Heart({ config, ref }: ShapeProps) {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));

  const fonts = FONT_THEMES[config.font].families;
  const fillHeight = (heartHeight * percent) / 100;
  const clipY = heartBottom - fillHeight;

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
      width={W}
      height={H}
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1={heartCx}
          y1={clipY}
          x2={heartCx}
          y2={heartBottom}
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
          <path d={path} />
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
        d={path}
        fill={config.trackColor}
        stroke={trackBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${clipId})`}>
        <path d={path} fill={`url(#${gradId})`} />
      </g>

      <g clipPath={`url(#${highlightClipId})`} style={{ mixBlendMode: 'screen' }}>
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

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.raised && (
          <>
            <text
              x={W / 2}
              y={480}
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
              y={502}
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
            y={540}
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
      </g>
    </svg>
  );
}
