import type { Config } from '../types';
import type { FontTheme } from '../utils/fonts';
import { formatValue, formatGoalValue, raisedLabelText } from '../utils/format';

type Fonts = FontTheme['families'];

type TitleCaptionProps = {
  config: Config;
  fonts: Fonts;
  width: number;
  titleY: number;
  captionY: number;
  titleSize?: number;
};

export function TitleCaption({
  config,
  fonts,
  width,
  titleY,
  captionY,
  titleSize = 28,
}: TitleCaptionProps) {
  return (
    <>
      {config.show.title && config.title && (
        <text
          x={width / 2}
          y={titleY}
          textAnchor="middle"
          fontSize={titleSize}
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
          x={width / 2}
          y={captionY}
          textAnchor="middle"
          fontSize={13}
          fontFamily={fonts.labels}
          fill="#6b7280"
          letterSpacing="0.02em"
        >
          {config.caption}
        </text>
      )}
    </>
  );
}

type StandardLabelsProps = {
  config: Config;
  fonts: Fonts;
  width: number;
  raised: number;
  displayPercent: number;
  renderedConfig: Config;
  raisedY: number;
  raisedLabelY: number;
  goalY: number;
  raisedSize?: number;
};

export function StandardLabels({
  config,
  fonts,
  width,
  raised,
  displayPercent,
  renderedConfig,
  raisedY,
  raisedLabelY,
  goalY,
  raisedSize = 42,
}: StandardLabelsProps) {
  return (
    <g fontFamily={fonts.numbers} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {config.show.raised && (
        <>
          <text
            x={width / 2}
            y={raisedY}
            textAnchor="middle"
            fontSize={raisedSize}
            fontWeight={600}
            fill="#0f172a"
            letterSpacing="-0.02em"
          >
            {formatValue(raised, renderedConfig)}
          </text>
          <text
            x={width / 2}
            y={raisedLabelY}
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
          x={width / 2}
          y={goalY}
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
          x={width / 2}
          y={goalY}
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
  );
}
