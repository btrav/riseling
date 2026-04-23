import { useQueryStates, parseAsString, parseAsInteger, parseAsBoolean } from 'nuqs';
import type { Config, ShapeKey } from '../types';
import { SHAPE_KEYS } from '../types';
import type { FontKey } from '../utils/fonts';
import { FONT_THEMES } from '../utils/fonts';

const FONT_KEYS = Object.keys(FONT_THEMES) as FontKey[];

export const CONFIG_VERSION = 1;

const defaults = {
  v: CONFIG_VERSION,
  s: 'thermometer',
  g: 8000,
  r: 3400,
  t: 'Library Fund',
  cp: '',
  c: 'USD',
  lo: 'en-US',
  u: '',
  cf: '#E11D48',
  ct: '#EEF0F3',
  f: 'editorial',
  uc: true,
  iu: false,
  iv: 250,
  il: 'sessions',
  vt: true,
  vc: true,
  vg: true,
  vr: true,
  vp: true,
};

export function useConfig(): {
  config: Config;
  set: (patch: Partial<Config>) => void;
  reset: () => void;
} {
  const [state, setState] = useQueryStates({
    v: parseAsInteger.withDefault(defaults.v),
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
    f: parseAsString.withDefault(defaults.f),
    uc: parseAsBoolean.withDefault(defaults.uc),
    iu: parseAsBoolean.withDefault(defaults.iu),
    iv: parseAsInteger.withDefault(defaults.iv),
    il: parseAsString.withDefault(defaults.il),
    vt: parseAsBoolean.withDefault(defaults.vt),
    vc: parseAsBoolean.withDefault(defaults.vc),
    vg: parseAsBoolean.withDefault(defaults.vg),
    vr: parseAsBoolean.withDefault(defaults.vr),
    vp: parseAsBoolean.withDefault(defaults.vp),
  });

  const shape: ShapeKey = (SHAPE_KEYS as readonly string[]).includes(state.s)
    ? (state.s as ShapeKey)
    : 'thermometer';

  const font: FontKey = (FONT_KEYS as readonly string[]).includes(state.f)
    ? (state.f as FontKey)
    : 'editorial';

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
    impactUnitEnabled: state.iu,
    impactUnitValue: state.iv,
    impactUnitLabel: state.il,
    fillColor: state.cf,
    trackColor: state.ct,
    font,
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
    if (patch.impactUnitEnabled !== undefined) update.iu = patch.impactUnitEnabled;
    if (patch.impactUnitValue !== undefined) update.iv = patch.impactUnitValue;
    if (patch.impactUnitLabel !== undefined) update.il = patch.impactUnitLabel;
    if (patch.fillColor !== undefined) update.cf = patch.fillColor;
    if (patch.trackColor !== undefined) update.ct = patch.trackColor;
    if (patch.font !== undefined) update.f = patch.font;
    if (patch.show) {
      if (patch.show.title !== undefined) update.vt = patch.show.title;
      if (patch.show.caption !== undefined) update.vc = patch.show.caption;
      if (patch.show.goal !== undefined) update.vg = patch.show.goal;
      if (patch.show.raised !== undefined) update.vr = patch.show.raised;
      if (patch.show.percentage !== undefined) update.vp = patch.show.percentage;
    }
    setState(update);
  }

  function reset() {
    setState({
      v: defaults.v,
      s: defaults.s,
      g: defaults.g,
      r: defaults.r,
      t: defaults.t,
      cp: defaults.cp,
      c: defaults.c,
      lo: defaults.lo,
      u: defaults.u,
      cf: defaults.cf,
      ct: defaults.ct,
      f: defaults.f,
      uc: defaults.uc,
      iu: defaults.iu,
      iv: defaults.iv,
      il: defaults.il,
      vt: defaults.vt,
      vc: defaults.vc,
      vg: defaults.vg,
      vr: defaults.vr,
      vp: defaults.vp,
    });
  }

  return { config, set, reset };
}
