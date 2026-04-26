# Riseling

Static fundraising progress image generator. Live at https://benjamintravis.com/riseling/. PRD lives at `~/Projects/Ideas/fundraising-image-generator-requirements.md` — read it for product context, panel takes, and roadmap.

## Stack

- **React 19** + TypeScript 6 (strict). Ref-as-prop pattern, no `forwardRef`.
- **Vite 8** with multi-entry: `index.html` (editor) + `v/index.html` (viewer-only) ship from the same JS bundle. Routing is a pathname check in `main.tsx`, no React Router.
- **Tailwind v4** via `@tailwindcss/vite` plugin (Oxide).
- **nuqs** for URL-synced state. Short keys (`g`, `r`, `cf`, `ct`, etc.). `CONFIG_VERSION = 1` locked in `useConfig.ts` for forward-compat with the planned Cloudflare Worker.
- **`@fontsource/*`** for self-hosted webfonts. Six themes wired up in `src/utils/fonts.ts`.
- **`react-colorful`** is the only UI lib. Everything else (modals, toast, dropdown) is hand-rolled.

## Architecture

### Entry & routing

- `src/main.tsx` checks `window.location.pathname`; mounts `<App>` at `/` and `<Viewer>` at `/v/`.
- Editor runs inside `<NuqsAdapter>`; viewer parses URL params directly (it's read-only).
- `public/404.html` is the SPA fallback redirect for typos.

### Shape primitives (`src/shapes/`)

All six shapes share these primitives:

- **`useShapeState(config)`** — single hook returns `{percent, raised, displayPercent, fonts, colors: {fillLight, fillShadow, trackBorder}, ids: {gradId, clipId, highlightClipId}, renderedConfig}`. Two `useSpring` calls inside (percent + raised), color derivations via `lighten`/`darken`, `useId()`-generated SVG IDs. Replaces ~25 lines of boilerplate per shape.
- **`<ShapeFrame>`** — SVG wrapper with viewBox, `fit` prop, `preserveAspectRatio="xMidYMid meet"`, and responsive sizing (100% width/height + maxWidth/maxHeight when `fit`).
- **`<TitleCaption>`** — title + caption text. Configurable y offsets per shape.
- **`<StandardLabels>`** — raised number + RAISED label + goal line. Used by 5 of 6 shapes (ring keeps inline labels because its layout is fundamentally different — value goes inside the ring).

When adding a new shape:
1. Module-level constants for x-axis geometry (widths, x positions) and radii that don't depend on caption presence.
2. Inside the function, compute `topOffset = config.show.caption && !!config.caption.trim() ? 20 : 0`. Apply to all y-coords (meter geometry, label y-positions, viewBox H).
3. Use `useShapeState`, `<ShapeFrame>`, `<TitleCaption>`, `<StandardLabels>`. Inline only the shape-specific path/clip/gradient.
4. The 70px gap from shape's visual bottom to raised-number cap-height is a hard rule. Verify the new shape matches.

### Export pipeline (`src/utils/svgToPng.ts`)

- **PNG**: serialize SVG → `new Image()` → `ctx.drawImage()` → `canvas.toBlob()`. **Do NOT use html-to-image** — DOM capture has too many issues (CSS variables, fallback fonts, blend-mode drift, Safari color-space).
- **SVG**: `XMLSerializer` on cloned node. Colon-strip on `useId()` IDs (`:r1a:` → `_r1a_`) for XML validity.
- **Font embedding**: `buildFontFaceCss` in `src/utils/fonts.ts` fetches woff2 URLs, converts to base64 data URIs via `FileReader.readAsDataURL`, injects `@font-face` rules into a `<style>` block inside `<defs>` of the cloned SVG before serialization. Without this, exported PNGs fall back to system fonts.
- **B&W print preset** uses `ctx.filter = 'grayscale(1) contrast(1.35) brightness(0.92)'` applied before `drawImage` (canvas-side, not SVG-side).

### State (`src/state/useConfig.ts`)

- One hook owns the editor's full config. URL is the source of truth; nuqs handles encoding.
- Defaults are listed at the top of the file under `defaults`. Schema fields:
  - `s` shape, `g` goal, `r` raised, `t` title, `cp` caption, `c` currency, `lo` locale, `u` unit, `cf` fill color, `ct` track color, `f` font theme, `uc` use-currency, `iu`/`iv`/`il` impact-unit fields, `vt`/`vc`/`vg`/`vr`/`vp` visibility toggles
  - `v` is the schema version, locked at `CONFIG_VERSION = 1`
- Viewer-only flags (`bg`, `edit`, `interactive`) are NOT in `Config` — `Viewer.tsx` parses them directly from URL.
- `reset()` clears all params to defaults.

### Viewer (`src/components/Viewer.tsx`)

- Reads URL params with `URLSearchParams`, passes `safeLocale` / `safeCurrency` from `src/utils/locale.ts` for validation.
- Renders the same `Shape` component with `fit={true}`.
- 960px max-width on desktop, edge-to-edge on mobile, `100svh` for iOS URL bar handling.
- Calls `startIframeHeightReporter()` on mount (`src/utils/iframeResize.ts`) — `ResizeObserver` posts `{type: 'riseling:height', h}` to parent so embed hosts can auto-resize.

## Deploy

- GitHub Actions workflow at `.github/workflows/deploy.yml`.
- **`npm install`, NOT `npm ci`** — Tailwind v4 Oxide pulls Linux-only optional deps via `@tailwindcss/oxide-linux-x64-gnu` that Mac-generated locks don't include. `npm ci`'s strict lock enforcement bails. Switching to `npm install` resolves missing optional deps at install time.
- Cache-control meta on both HTML shells prevents stale shells referencing deleted JS hashes.
- **After every push that should deploy, run `gh run list --repo btrav/riseling --limit 3`**. Commits pushed to main ≠ deployed. The first 3 deploys after Tailwind v4 adoption failed silently because of the npm ci issue.

## Conventions

- **Defaults**: editor has fill color `#E11D48` (warmer rose), track `#EEF0F3` (visible against white), font theme `editorial` (Fraunces + Inter).
- **70px shape-to-number gap** across all shapes. If you change a shape's geometry, audit this.
- **Caption-driven dynamic spacing**: when caption is present, all shapes shift their meter down 20px and grow viewBox H by 20. `topOffset` pattern.
- **`raisedLabelText(config)`**: returns `"RAISED"` for currency / custom-unit modes, `<UNIT_NAME>` (uppercase) for impact-unit mode. Use this, not the literal string.
- **`formatGoalValue(target, config)`**: returns the goal string with unit context (e.g., "100 sessions" in impact mode, "$8,000" in currency mode). Use for goal-line rendering.
- **Highlight overlays** wrap in `<g style={{ mixBlendMode: 'screen' }}>` so they work against any fill color without per-color tuning.
- **Track strokes** use `darken(trackColor, 0.18)`, 1.5px, `vectorEffect="non-scaling-stroke"`.

## Don't

- Don't add `html-to-image`. Native SVG → Canvas works.
- Don't add a routing library. Pathname check is enough.
- Don't centralize gradient/highlight defs — each shape needs slightly different `userSpaceOnUse` bounds. Local definition with shared color derivations is the right balance.
- Don't add a backend without strong signal. The Cloudflare Worker for OG images is planned (v2) but not built. Keep things static-first.
- Don't ship without checking `gh run view <run-id>`. CI deploy can fail silently for npm-lock-platform reasons.
