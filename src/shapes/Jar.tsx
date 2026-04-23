import type { ShapeProps } from '../types';
import { useShapeState } from './useShapeState';
import { ShapeFrame } from './ShapeFrame';
import { TitleCaption, StandardLabels } from './primitives';
import { darken } from '../utils/color';

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

export function Jar({ config, ref, fit }: ShapeProps) {
  const state = useShapeState(config);
  const { percent, fonts, colors, ids, raised, displayPercent, renderedConfig } = state;

  const fillHeight = ((jarY1 - rimY) * percent) / 100;
  const clipY = jarY1 - fillHeight;

  return (
    <ShapeFrame width={W} height={H} fit={fit} ref={ref}>
      <defs>
        <linearGradient
          id={ids.gradId}
          x1={W / 2}
          y1={clipY}
          x2={W / 2}
          y2={jarY1}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={colors.fillLight} />
          <stop offset="0.35" stopColor={config.fillColor} />
          <stop offset="1" stopColor={colors.fillShadow} />
        </linearGradient>
        <clipPath id={ids.clipId}>
          <rect x={0} y={clipY} width={W} height={H - clipY} />
        </clipPath>
        <clipPath id={ids.highlightClipId}>
          <path d={jarPath} />
        </clipPath>
      </defs>

      <TitleCaption config={config} fonts={fonts} width={W} titleY={50} captionY={78} />

      <path
        d={jarPath}
        fill={config.trackColor}
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <line
        x1={jarX0 + 6}
        y1={rimY}
        x2={jarX1 - 6}
        y2={rimY}
        stroke={darken(config.trackColor, 0.28)}
        strokeWidth={1}
        opacity={0.5}
      />

      <g clipPath={`url(#${ids.clipId})`}>
        <path d={jarPath} fill={`url(#${ids.gradId})`} />
      </g>

      <g clipPath={`url(#${ids.highlightClipId})`} style={{ mixBlendMode: 'screen' }}>
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

      <StandardLabels
        config={config}
        fonts={fonts}
        width={W}
        raised={raised}
        displayPercent={displayPercent}
        renderedConfig={renderedConfig}
        raisedY={510}
        raisedLabelY={530}
        goalY={562}
      />
    </ShapeFrame>
  );
}
