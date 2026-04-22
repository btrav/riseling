import type { ComponentType } from 'react';
import type { ShapeKey, ShapeProps } from '../types';
import { Thermometer } from './Thermometer';

const placeholder: ComponentType<ShapeProps> = Thermometer;

export const SHAPE_REGISTRY: Record<ShapeKey, ComponentType<ShapeProps>> = {
  thermometer: Thermometer,
  bar: placeholder,
  ring: placeholder,
  jar: placeholder,
  battery: placeholder,
  heart: placeholder,
};

export const SHAPE_LABELS: Record<ShapeKey, string> = {
  thermometer: 'Thermometer',
  bar: 'Horizontal bar',
  ring: 'Progress ring',
  jar: 'Jar',
  battery: 'Battery',
  heart: 'Heart',
};
