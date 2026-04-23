import { useEffect, useMemo } from 'react';
import { SHAPE_REGISTRY } from '../shapes';
import { SHAPE_KEYS } from '../types';
import type { Config, ShapeKey } from '../types';
import { FONT_THEMES } from '../utils/fonts';
import type { FontKey } from '../utils/fonts';
import { safeCurrency, safeLocale } from '../utils/locale';
import { startIframeHeightReporter } from '../utils/iframeResize';
import { EditLink } from './EditLink';

const FONT_KEYS = Object.keys(FONT_THEMES) as FontKey[];

function parseConfig(search: URLSearchParams): Config {
  const shapeParam = search.get('s') ?? 'thermometer';
  const shape: ShapeKey = (SHAPE_KEYS as readonly string[]).includes(shapeParam)
    ? (shapeParam as ShapeKey)
    : 'thermometer';
  const fontParam = search.get('f') ?? 'editorial';
  const font: FontKey = (FONT_KEYS as readonly string[]).includes(fontParam)
    ? (fontParam as FontKey)
    : 'editorial';

  return {
    shape,
    target: Number(search.get('g')) || 8000,
    current: Number(search.get('r')) || 3400,
    title: search.get('t') ?? 'Library Fund',
    caption: search.get('cp') ?? '',
    currency: safeCurrency(search.get('c') ?? 'USD'),
    locale: safeLocale(search.get('lo') ?? 'en-US'),
    unitLabel: search.get('u') ?? '',
    useCurrencyFormat: search.get('uc') !== 'false',
    impactUnitEnabled: search.get('iu') === 'true',
    impactUnitValue: Number(search.get('iv')) || 250,
    impactUnitLabel: search.get('il') ?? 'sessions',
    fillColor: search.get('cf') ?? '#E11D48',
    trackColor: search.get('ct') ?? '#EEF0F3',
    font,
    show: {
      title: search.get('vt') !== 'false',
      caption: search.get('vc') !== 'false',
      goal: search.get('vg') !== 'false',
      raised: search.get('vr') !== 'false',
      percentage: search.get('vp') !== 'false',
    },
  };
}

function buildEditorHref(search: URLSearchParams): string {
  const base = window.location.origin + '/riseling/';
  const params = new URLSearchParams(search);
  params.delete('bg');
  params.delete('edit');
  params.delete('interactive');
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function Viewer() {
  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const config = useMemo(() => parseConfig(search), [search]);

  const bg = search.get('bg');
  const showEditLink = search.get('edit') === '1';
  const interactive = search.get('interactive') === '1';
  const editorHref = useMemo(() => buildEditorHref(search), [search]);

  useEffect(() => {
    document.title = config.title
      ? `${config.title} · Riseling`
      : 'Riseling · Fundraising progress';
    document.body.classList.toggle('bg-transparent', bg === 'transparent');
    const placeholder = document.querySelector('.rl-placeholder');
    if (placeholder) placeholder.remove();
    startIframeHeightReporter();
  }, [config.title, bg]);

  const Shape = SHAPE_REGISTRY[config.shape];

  const stageChildren = (
    <div className="flex w-full max-w-[960px] items-center justify-center px-4 py-6 sm:px-8">
      <Shape config={config} fit />
    </div>
  );

  return (
    <div
      className="relative flex min-h-[100svh] w-full items-center justify-center"
      style={{ background: bg === 'transparent' ? 'transparent' : undefined }}
    >
      {interactive ? (
        <a
          href={editorHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center"
          aria-label={`Open ${config.title || 'this meter'} in Riseling`}
        >
          {stageChildren}
        </a>
      ) : (
        stageChildren
      )}
      {showEditLink && <EditLink editorUrl={editorHref} />}
    </div>
  );
}
