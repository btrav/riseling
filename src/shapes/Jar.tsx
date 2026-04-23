import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, progressPercent } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

const W = 440;
const H = 610;
const jarX0 = 140;
const jarX1 = 300;
const jarY0 = 140;
const jarY1 = 440;
const topR = 10;
const bottomR = 32;

const jarPath = [
  `M ${jarX0 + topR} ${jarY0}`,
  `L ${jarX1 - topR} ${jarY0}`,
  `A ${topR} ${topR} 0 0 1 ${jarX1} ${jarY0 + topR}`,
  `L ${jarX1} ${jarY1 - bottomR}`,
  `A ${bottomR} ${bottomR} 0 0 1 ${jarX1 - bottomR} ${jarY1}`,
  `L ${jarX0 + bottomR} ${jarY1}`,
  `A ${bottomR} ${bottomR} 0 0 1 ${jarX0} ${jarY1 - bottomR}`,
  `L ${jarX0} ${jarY0 + topR}`,
  `A ${topR} ${topR} 0 0 1 ${jarX0 + topR} ${jarY0}`,
  'Z',
].join(' ');

const rimY = jarY0 + 16;

export function Jar({ config, ref }: ShapeProps) {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));

  const fonts = FONT_THEMES[config.font].families;
  const fillHeight = ((jarY1 - rimY) * percent) / 100;
  const clipY = jarY1 - fillHeight;

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
          x1={W / 2}
          y1={clipY}
          x2={W / 2}
          y2={jarY1}
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
          <path d={jarPath} />
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
        d={jarPath}
        fill={config.trackColor}
        stroke={trackBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <line
        x1={jarX0 + 6}
        y1={rimY}
        x2={jarX1 - 6}
        y2={rimY}
        stroke={trackBorder}
        strokeWidth={1}
        opacity={0.5}
      />

      <g clipPath={`url(#${clipId})`}>
        <path d={jarPath} fill={`url(#${gradId})`} />
      </g>

      <g clipPath={`url(#${highlightClipId})`} style={{ mixBlendMode: 'screen' }}>
        <rect
          x={jarX0 + 18}
          y={rimY + 10}
          width={10}
          height={jarY1 - rimY - 36}
          fill="white"
          opacity={0.38}
          rx={5}
        />
      </g>

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.raised && (
          <>
            <text
              x={W / 2}
              y={510}
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
              y={530}
              textAnchor="middle"
              fontSize={10}
              fontFamily={fonts.labels}
              fontWeight={500}
              fill="#6b7280"
              letterSpacing="0.1em"
            >
              RAISED
            </text>
          </>
        )}

        {config.show.goal && (
          <text
            x={W / 2}
            y={562}
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
