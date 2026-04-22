import type { ComponentType } from 'react';
import type { ShapeKey, ShapeProps } from '../types';
import { Thermometer } from './Thermometer';
import { HorizontalBar } from './HorizontalBar';
import { ProgressRing } from './ProgressRing';
import { Jar } from './Jar';
import { Battery } from './Battery';
import { Heart } from './Heart';

export const SHAPE_REGISTRY: Record<ShapeKey, ComponentType<ShapeProps>> = {
  thermometer: Thermometer,
  bar: HorizontalBar,
  ring: ProgressRing,
  jar: Jar,
  battery: Battery,
  heart: Heart,
};

export const SHAPE_LABELS: Record<ShapeKey, string> = {
  thermometer: 'Thermometer',
  bar: 'Horizontal bar',
  ring: 'Progress ring',
  jar: 'Jar',
  battery: 'Battery',
  heart: 'Heart',
};

export const LIVE_SHAPES: ShapeKey[] = [
  'thermometer',
  'bar',
  'ring',
  'jar',
  'battery',
  'heart',
];
