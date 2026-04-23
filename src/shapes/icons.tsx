import { useId } from 'react';
import type { ComponentType } from 'react';
import type { ShapeKey } from '../types';

export type ShapeIconProps = {
  percent: number;
  fillColor: string;
  trackColor: string;
};

const W = 48;
const H = 48;

function ThermometerIcon({ percent, fillColor, trackColor }: ShapeIconProps) {
  const tubeW = 7;
  const tubeX = (W - tubeW) / 2;
  const tubeTop = 6;
  const tubeBottom = 30;
  const bulbCY = 37;
  const bulbR = 7;
  const tubeH = tubeBottom - tubeTop;
  const fillH = (tubeH * percent) / 100;
  const cx = tubeX + tubeW / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect x={tubeX} y={tubeTop} width={tubeW} height={tubeH} rx={tubeW / 2} fill={trackColor} />
      <circle cx={cx} cy={bulbCY} r={bulbR} fill={trackColor} />
      <circle cx={cx} cy={bulbCY} r={bulbR - 1.5} fill={fillColor} />
      {fillH > 0 && (
        <rect
          x={tubeX + 1.5}
          y={tubeBottom - fillH}
          width={tubeW - 3}
          height={fillH}
          rx={(tubeW - 3) / 2}
          fill={fillColor}
        />
      )}
    </svg>
  );
}

function HorizontalBarIcon({ percent, fillColor, trackColor }: ShapeIconProps) {
  const barX = 6;
  const barY = 20;
  const barH = 8;
  const barW = W - 2 * barX;
  const fillW = (barW * percent) / 100;
  const clipId = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <defs>
        <clipPath id={clipId}>
          <rect x={barX} y={barY} width={barW} height={barH} rx={barH / 2} />
        </clipPath>
      </defs>
      <rect x={barX} y={barY} width={barW} height={barH} rx={barH / 2} fill={trackColor} />
      <g clipPath={`url(#${clipId})`}>
        <rect x={barX} y={barY} width={fillW} height={barH} fill={fillColor} />
      </g>
    </svg>
  );
}

function ProgressRingIcon({ percent, fillColor, trackColor }: ShapeIconProps) {
  const cx = W / 2;
  const cy = H / 2;
  const r = 15;
  const sw = 5;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={sw} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={fillColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  );
}

function JarIcon({ percent, fillColor, trackColor }: ShapeIconProps) {
  const x0 = 15;
  const x1 = 33;
  const y0 = 10;
  const y1 = 42;
  const topR = 2;
  const botR = 4;
  const path = [
    `M ${x0 + topR} ${y0}`,
    `L ${x1 - topR} ${y0}`,
    `A ${topR} ${topR} 0 0 1 ${x1} ${y0 + topR}`,
    `L ${x1} ${y1 - botR}`,
    `A ${botR} ${botR} 0 0 1 ${x1 - botR} ${y1}`,
    `L ${x0 + botR} ${y1}`,
    `A ${botR} ${botR} 0 0 1 ${x0} ${y1 - botR}`,
    `L ${x0} ${y0 + topR}`,
    `A ${topR} ${topR} 0 0 1 ${x0 + topR} ${y0}`,
    'Z',
  ].join(' ');
  const clipY = y1 - (y1 - y0) * (percent / 100);
  const clipId = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={clipY} width={W} height={H - clipY} />
        </clipPath>
      </defs>
      <path d={path} fill={trackColor} />
      <g clipPath={`url(#${clipId})`}>
        <path d={path} fill={fillColor} />
      </g>
    </svg>
  );
}

function BatteryIcon({ percent, fillColor, trackColor }: ShapeIconProps) {
  const bodyX = 5;
  const bodyY = 18;
  const bodyW = 34;
  const bodyH = 14;
  const bodyR = 3;
  const termX = bodyX + bodyW;
  const termY = 22;
  const termW = 3;
  const termH = 6;
  const innerPad = 2;
  const fillAreaW = bodyW - 2 * innerPad;
  const fillW = (fillAreaW * percent) / 100;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect x={termX} y={termY} width={termW} height={termH} rx={1} fill={trackColor} />
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx={bodyR} fill={trackColor} />
      {fillW > 0 && (
        <rect
          x={bodyX + innerPad}
          y={bodyY + innerPad}
          width={fillW}
          height={bodyH - 2 * innerPad}
          rx={1.5}
          fill={fillColor}
        />
      )}
    </svg>
  );
}

function HeartIcon({ percent, fillColor, trackColor }: ShapeIconProps) {
  const cx = W / 2;
  const topY = 12;
  const bottomY = 40;
  const halfW = 14;
  const notchY = topY + (bottomY - topY) * 0.2;
  const path = [
    `M ${cx} ${notchY}`,
    `C ${cx - halfW * 0.5} ${topY}, ${cx - halfW} ${topY + 2}, ${cx - halfW} ${topY + 8}`,
    `C ${cx - halfW} ${topY + 16}, ${cx - halfW * 0.5} ${topY + 22}, ${cx} ${bottomY}`,
    `C ${cx + halfW * 0.5} ${topY + 22}, ${cx + halfW} ${topY + 16}, ${cx + halfW} ${topY + 8}`,
    `C ${cx + halfW} ${topY + 2}, ${cx + halfW * 0.5} ${topY}, ${cx} ${notchY}`,
    'Z',
  ].join(' ');
  const clipY = bottomY - (bottomY - topY) * (percent / 100);
  const clipId = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <defs>
        <clipPath id={clipId}>
          <rect x={0} y={clipY} width={W} height={H - clipY} />
        </clipPath>
      </defs>
      <path d={path} fill={trackColor} />
      <g clipPath={`url(#${clipId})`}>
        <path d={path} fill={fillColor} />
      </g>
    </svg>
  );
}

export const SHAPE_ICONS: Record<ShapeKey, ComponentType<ShapeIconProps>> = {
  thermometer: ThermometerIcon,
  bar: HorizontalBarIcon,
  ring: ProgressRingIcon,
  jar: JarIcon,
  battery: BatteryIcon,
  heart: HeartIcon,
};
