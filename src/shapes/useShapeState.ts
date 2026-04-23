import { useId } from 'react';
import type { Config } from '../types';
import { FONT_THEMES } from '../utils/fonts';
import type { FontTheme } from '../utils/fonts';
import { lighten, darken } from '../utils/color';
import { useSpring } from '../hooks/useSpring';
import { progressPercent } from '../utils/format';

export type ShapeState = {
  percent: number;
  raised: number;
  displayPercent: number;
  fonts: FontTheme['families'];
  colors: {
    fillLight: string;
    fillShadow: string;
    trackBorder: string;
  };
  ids: {
    gradId: string;
    clipId: string;
    highlightClipId: string;
  };
  renderedConfig: Config;
};

export function useShapeState(config: Config): ShapeState {
  const targetPercent = progressPercent(config);
  const percent = useSpring(targetPercent);
  const raised = Math.round(useSpring(config.current));
  const fonts = FONT_THEMES[config.font].families;
  const displayPercent = Math.round(percent);
  const renderedConfig = { ...config, current: raised };

  const fillLight = lighten(config.fillColor, 0.22);
  const fillShadow = darken(config.fillColor, 0.12);
  const trackBorder = darken(config.trackColor, 0.18);

  const gradId = useId();
  const clipId = useId();
  const highlightClipId = useId();

  return {
    percent,
    raised,
    displayPercent,
    fonts,
    colors: { fillLight, fillShadow, trackBorder },
    ids: { gradId, clipId, highlightClipId },
    renderedConfig,
  };
}
