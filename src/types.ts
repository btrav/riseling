import type { FontKey } from './utils/fonts';

export type ShapeKey = 'thermometer' | 'bar' | 'ring' | 'jar' | 'battery' | 'heart';

export const SHAPE_KEYS: readonly ShapeKey[] = [
  'thermometer',
  'bar',
  'ring',
  'jar',
  'battery',
  'heart',
];

export type Config = {
  shape: ShapeKey;
  current: number;
  target: number;
  title: string;
  caption: string;
  currency: string;
  locale: string;
  unitLabel: string;
  useCurrencyFormat: boolean;
  fillColor: string;
  trackColor: string;
  font: FontKey;
  show: {
    title: boolean;
    caption: boolean;
    goal: boolean;
    raised: boolean;
    percentage: boolean;
  };
};

export type ShapeProps = {
  config: Config;
  ref?: React.Ref<SVGSVGElement>;
};
