import type { ShapeProps } from '../types';
import { useShapeState } from './useShapeState';
import { ShapeFrame } from './ShapeFrame';
import { TitleCaption, StandardLabels } from './primitives';

const W = 440;
const tubeW = 74;
const tubeX = (W - tubeW) / 2;
const bulbR = 58;
const cx = tubeX + tubeW / 2;

export function Thermometer({ config, ref, fit }: ShapeProps) {
  const state = useShapeState(config);
  const { percent, fonts, colors, ids, raised, displayPercent, renderedConfig } = state;

  const hasCaption = config.show.caption && !!config.caption.trim();
  const topOffset = hasCaption ? 20 : 0;
  const H = 720 + topOffset;
  const tubeTop = 110 + topOffset;
  const bulbCY = 488 + topOffset;

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

  const fillTubeHeight = (tubeUsable * percent) / 100;
  const clipY = bulbMeetY - fillTubeHeight;

  return (
    <ShapeFrame width={W} height={H} fit={fit} ref={ref}>
      <defs>
        <linearGradient
          id={ids.gradId}
          x1={cx}
          y1={clipY}
          x2={cx}
          y2={bulbCY + bulbR}
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
          <path d={trackPath} />
        </clipPath>
      </defs>

      <TitleCaption config={config} fonts={fonts} width={W} titleY={50} captionY={78} />

      <path
        d={trackPath}
        fill={config.trackColor}
        stroke={colors.trackBorder}
        strokeWidth={1.5}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      <g clipPath={`url(#${ids.clipId})`}>
        <path d={trackPath} fill={`url(#${ids.gradId})`} />
      </g>

      <g clipPath={`url(#${ids.highlightClipId})`} style={{ mixBlendMode: 'screen' }}>
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

      <StandardLabels
        config={config}
        fonts={fonts}
        width={W}
        raised={raised}
        displayPercent={displayPercent}
        renderedConfig={renderedConfig}
        raisedY={644 + topOffset}
        raisedLabelY={666 + topOffset}
        goalY={698 + topOffset}
      />
    </ShapeFrame>
  );
}
