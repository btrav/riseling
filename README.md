```
  ┌─────────────────────────────────┐
  │                                 │
  │         Library Fund            │
  │                                 │
  │             ___                 │
  │            |   |                │
  │            |   |                │
  │            |   |                │
  │            |▓▓▓|                │
  │            |▓▓▓|                │
  │           /▓▓▓▓▓\               │
  │          |▓▓▓▓▓▓▓|              │
  │           \▓▓▓▓▓/               │
  │                                 │
  │            $3,400               │
  │             RAISED              │
  │         of $8,000 goal          │
  │                                 │
  └─────────────────────────────────┘
```

# Riseling

**Fundraising progress images you can actually control.**

Set a goal, a raised amount, a title, and colors. Preview updates live.
Download a PNG. Share a link that restores the exact same config.

**[→ Try it live](https://benjamintravis.com/riseling/)**

---

## What it does

Nonprofits, mutual aid organizers, campaign managers, and people running
personal fundraisers all end up needing the same thing: a clean progress
image to drop into an email, a tweet, a Slack post, or a donation page.

Riseling is a browser tool that generates fundraising progress graphics
client-side. Configure the goal, the raised amount, the title, the colors,
and the font. Watch the preview update as you type. Export a PNG when you're
ready.

The entire config encodes into the URL, so every preview doubles as a
shareable link. Bookmark it, paste it into a doc, send it to a teammate.
They see what you see.

Nothing is uploaded. Everything runs in the browser.

---

## Money, or whatever you're counting

Progress doesn't have to be about dollars.

Riseling uses locale-aware `Intl.NumberFormat` for currencies. A German
campaign shows `4.500,00 €`, a US one shows `$4,500.00`, no manual
setup. The unit label is free text, which means you can track books
collected, meals served, miles run, signatures gathered, or counseling
sessions funded. If it has a target and a current count, it fits.

---

## What's included

- **Six meter shapes** on the way: thermometer (shipping), horizontal bar, progress ring, jar, battery, heart
- **Live preview** that updates as you edit
- **URL-encoded state** so every config is a shareable link
- **Multi-currency** with locale-aware formatting
- **Free-text units** for tracking anything countable
- **Three font themes**: System, Editorial (Fraunces + Inter), Serif Display (Instrument Serif + Inter)
- **Fonts embed into the PNG export**, so the download matches the preview
- **Spring-animated fill** on value changes
- **One-click PNG download** at 3x pixel ratio

---

## Status

**v0.1.1** — alpha, under active development.

Shipping now:
- Thermometer shape with full feature support
- Live preview, PNG export, URL state, multi-currency, free-text units, font themes, animated fill

On the roadmap:
- The other five shapes (bar, ring, jar, battery, heart) wired up
- Show/hide toggles for individual preview elements
- Command palette for keyboard-driven editing
- Logo upload and custom SVG shape upload
- Animated export (GIF/MP4)
- Impact-unit mode: define `$250 = 1 counseling session` and fill the meter in sessions instead of dollars

---

## Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev) — UI and build
- [TypeScript](https://www.typescriptlang.org) — types
- [Tailwind v4](https://tailwindcss.com) — styling
- [nuqs](https://nuqs.47ng.com) — URL-synced state
- [@fontsource](https://fontsource.org) — self-hosted Fraunces, Inter, Instrument Serif
- `Intl.NumberFormat` — locale-aware number and currency formatting
- Native SVG → Canvas — PNG export with no DOM-capture dependency

---

## Why

I was looking for a fundraising progress generator for a side project and
nothing I found felt right. The ones that existed were one-shot tools:
type a goal, click generate, get a static image. Most handled US dollars
only. A few watermarked the output.

I wanted something more like a live configurator. Pick a font, pick a
color, type a number, see the preview update as I type, download a clean
PNG. I wanted the state to live in the URL so "send me the thermometer"
wouldn't require a screenshot. And I wanted to count things other than
dollars, because the most motivating fundraising targets aren't always
monetary.

Riseling is that tool.

---

## Run it locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/riseling/`

---

made by [btrav](https://github.com/btrav)
