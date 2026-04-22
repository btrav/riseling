# Riseling

A fundraising progress image generator. Configure a thermometer (or one of five other shapes), download a PNG, share it anywhere.

Better than [CallHub's](https://callhub.io/tools/fundraising-thermometer/) or [Funraise's](https://www.funraise.org/fundraising-thermometer) generators: multi-currency with locale-aware formatting, shape-agnostic data model, free-text unit labels (books, miles, meals — not just money), URL-encoded state so configs are shareable links.

## Stack

- React 19 + Vite + TypeScript
- Tailwind v4
- [nuqs](https://nuqs.47ng.com/) for URL-synced state
- [react-colorful](https://github.com/omgovich/react-colorful) for color pickers
- Native SVG → Canvas for PNG export (no DOM-capture dependency)

## Run locally

```bash
npm install
npm run dev
```

## Status

**v0.1 · Slice 1.** Thermometer shape only. Goal, raised, title, colors editable. URL state. PNG download. Currency picker, toggles, and other shapes come in later slices.
