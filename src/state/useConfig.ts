import { useQueryStates, parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';
import type { Config, ShapeKey } from '../types';
import { SHAPE_KEYS } from '../types';

const defaults = {
  s: 'thermometer',
  g: 8000,
  r: 3400,
  t: 'Library Fund',
  cp: '',
  c: 'USD',
  lo: 'en-US',
  u: '',
  cf: '#ef4444',
  ct: '#f3f4f6',
  uc: true,
  vt: true,
  vc: true,
  vg: true,
  vr: true,
  vp: true,
};

export function useConfig(): {
  config: Config;
  set: (patch: Partial<Config>) => void;
} {
  const [state, setState] = useQueryStates({
    s: parseAsString.withDefault(defaults.s),
    g: parseAsInteger.withDefault(defaults.g),
    r: parseAsInteger.withDefault(defaults.r),
    t: parseAsString.withDefault(defaults.t),
    cp: parseAsString.withDefault(defaults.cp),
    c: parseAsString.withDefault(defaults.c),
    lo: parseAsString.withDefault(defaults.lo),
    u: parseAsString.withDefault(defaults.u),
    cf: parseAsString.withDefault(defaults.cf),
    ct: parseAsString.withDefault(defaults.ct),
    uc: parseAsBoolean.withDefault(defaults.uc),
    vt: parseAsBoolean.withDefault(defaults.vt),
    vc: parseAsBoolean.withDefault(defaults.vc),
    vg: parseAsBoolean.withDefault(defaults.vg),
    vr: parseAsBoolean.withDefault(defaults.vr),
    vp: parseAsBoolean.withDefault(defaults.vp),
  });

  const shape: ShapeKey = (SHAPE_KEYS as readonly string[]).includes(state.s)
    ? (state.s as ShapeKey)
    : 'thermometer';

  const config: Config = {
    shape,
    current: state.r,
    target: state.g,
    title: state.t,
    caption: state.cp,
    currency: state.c,
    locale: state.lo,
    unitLabel: state.u,
    useCurrencyFormat: state.uc,
    fillColor: state.cf,
    trackColor: state.ct,
    show: {
      title: state.vt,
      caption: state.vc,
      goal: state.vg,
      raised: state.vr,
      percentage: state.vp,
    },
  };

  function set(patch: Partial<Config>) {
    const update: Record<string, string | number | boolean> = {};
    if (patch.shape !== undefined) update.s = patch.shape;
    if (patch.current !== undefined) update.r = patch.current;
    if (patch.target !== undefined) update.g = patch.target;
    if (patch.title !== undefined) update.t = patch.title;
    if (patch.caption !== undefined) update.cp = patch.caption;
    if (patch.currency !== undefined) update.c = patch.currency;
    if (patch.locale !== undefined) update.lo = patch.locale;
    if (patch.unitLabel !== undefined) update.u = patch.unitLabel;
    if (patch.useCurrencyFormat !== undefined) update.uc = patch.useCurrencyFormat;
    if (patch.fillColor !== undefined) update.cf = patch.fillColor;
    if (patch.trackColor !== undefined) update.ct = patch.trackColor;
    if (patch.show) {
      if (patch.show.title !== undefined) update.vt = patch.show.title;
      if (patch.show.caption !== undefined) update.vc = patch.show.caption;
      if (patch.show.goal !== undefined) update.vg = patch.show.goal;
      if (patch.show.raised !== undefined) update.vr = patch.show.raised;
      if (patch.show.percentage !== undefined) update.vp = patch.show.percentage;
    }
    setState(update);
  }

  return { config, set };
}
