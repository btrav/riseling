import { useId } from 'react';
import type { ShapeProps } from '../types';
import { formatValue, progressPercent } from '../utils/format';
import { lighten, darken } from '../utils/color';
import { FONT_THEMES } from '../utils/fonts';
import { useSpring } from '../hooks/useSpring';

const W = 440;
const H = 720;

const tubeW = 80;
const tubeX = (W - tubeW) / 2;
const tubeTop = 120;
const bulbR = 65;
const bulbCY = 510;
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

export function Thermometer({ config, ref }: ShapeProps) {
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

  const fillLight = lighten(config.fillColor, 0.2);
  const fillShadow = darken(config.fillColor, 0.1);
  const trackBorder = darken(config.trackColor, 0.08);

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
          x1={cx}
          y1={clipY}
          x2={cx}
          y2={bulbCY + bulbR}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={fillLight} />
          <stop offset="0.45" stopColor={config.fillColor} />
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
          y={56}
          textAnchor="middle"
          fontSize={30}
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
          y={86}
          textAnchor="middle"
          fontSize={13}
          fontFamily={fonts.labels}
          fill="#6b7280"
          letterSpacing="0.02em"
        >
          {config.caption}
        </text>
      )}

      <path d={trackPath} fill={config.trackColor} stroke={trackBorder} strokeWidth={1.25} />

      <g clipPath={`url(#${clipId})`}>
        <path d={trackPath} fill={`url(#${gradId})`} />
      </g>

      <g clipPath={`url(#${highlightClipId})`}>
        <rect
          x={tubeX + tubeW * 0.2}
          y={topArcEndY - 4}
          width={tubeW * 0.1}
          height={bulbMeetY - topArcEndY + 8}
          fill="white"
          opacity={0.22}
          rx={tubeW * 0.05}
        />
        <ellipse
          cx={cx - bulbR * 0.34}
          cy={bulbCY - bulbR * 0.3}
          rx={bulbR * 0.16}
          ry={bulbR * 0.22}
          fill="white"
          opacity={0.28}
          transform={`rotate(-18 ${cx - bulbR * 0.34} ${bulbCY - bulbR * 0.3})`}
        />
      </g>

      <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {config.show.raised && (
          <>
            <text
              x={W / 2}
              y={614}
              textAnchor="middle"
              fontSize={46}
              fontWeight={600}
              fill="#0f172a"
              letterSpacing="-0.02em"
            >
              {formatValue(raised, renderedConfig)}
            </text>
            <text
              x={W / 2}
              y={640}
              textAnchor="middle"
              fontSize={11}
              fontFamily={fonts.labels}
              fontWeight={500}
              fill="#9ca3af"
              letterSpacing="0.14em"
            >
              RAISED
            </text>
          </>
        )}

        {config.show.goal && (
          <text
            x={W / 2}
            y={672}
            textAnchor="middle"
            fontSize={15}
            fontFamily={fonts.labels}
            fontWeight={400}
            fill="#6b7280"
          >
            of {formatValue(config.target, config)} goal
          </text>
        )}

        {config.show.percentage && (
          <text
            x={W / 2}
            y={698}
            textAnchor="middle"
            fontSize={12}
            fontFamily={fonts.labels}
            fontWeight={500}
            fill="#9ca3af"
            letterSpacing="0.04em"
          >
            {displayPercent}% of goal
          </text>
        )}
      </g>
    </svg>
  );
}
