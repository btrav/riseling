import type { ShapeProps } from '../types';
import { formatValue, progressPercent } from '../utils/format';

const W = 400;
const H = 540;
const tubeX = 90;
const tubeW = 64;
const tubeTop = 60;
const tubeBottom = 400;
const bulbCY = 440;
const bulbR = 58;
const innerPad = 10;

export function Thermometer({ config, ref }: ShapeProps) {
  const percent = progressPercent(config);
  const tubeH = tubeBottom - tubeTop;
  const fillH = (tubeH * percent) / 100;
  const fillY = tubeBottom - fillH;
  const cx = tubeX + tubeW / 2;

  const fontStack = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ display: 'block' }}
    >
      {config.show.title && config.title && (
        <text
          x={W / 2}
          y={36}
          textAnchor="middle"
          fontSize={24}
          fontWeight={600}
          fill="#111827"
          fontFamily={fontStack}
        >
          {config.title}
        </text>
      )}

      <rect
        x={tubeX}
        y={tubeTop}
        width={tubeW}
        height={tubeH}
        rx={tubeW / 2}
        fill={config.trackColor}
      />
      <circle cx={cx} cy={bulbCY} r={bulbR} fill={config.trackColor} />

      <circle cx={cx} cy={bulbCY} r={bulbR - innerPad} fill={config.fillColor} />
      {fillH > 0 && (
        <rect
          x={tubeX + innerPad}
          y={fillY}
          width={tubeW - 2 * innerPad}
          height={fillH}
          rx={(tubeW - 2 * innerPad) / 2}
          fill={config.fillColor}
        />
      )}

      {config.show.percentage && (
        <text
          x={cx}
          y={bulbCY + 8}
          textAnchor="middle"
          fontSize={22}
          fontWeight={700}
          fill="#ffffff"
          fontFamily={fontStack}
          stroke={config.fillColor}
          strokeWidth={0.5}
          paintOrder="stroke fill"
        >
          {Math.round(percent)}%
        </text>
      )}

      <g fontFamily={fontStack}>
        {config.show.raised && (
          <>
            <text x={200} y={170} fontSize={28} fontWeight={700} fill="#111827">
              {formatValue(config.current, config)}
            </text>
            <text x={200} y={194} fontSize={13} fill="#6b7280">
              raised
            </text>
          </>
        )}
        {config.show.goal && (
          <>
            <text x={200} y={256} fontSize={20} fontWeight={500} fill="#374151">
              of {formatValue(config.target, config)}
            </text>
            <text x={200} y={278} fontSize={13} fill="#6b7280">
              goal
            </text>
          </>
        )}
      </g>

      {config.show.caption && config.caption && (
        <text
          x={W / 2}
          y={H - 20}
          textAnchor="middle"
          fontSize={14}
          fill="#6b7280"
          fontFamily={fontStack}
        >
          {config.caption}
        </text>
      )}
    </svg>
  );
}
