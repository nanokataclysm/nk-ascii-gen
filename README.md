# nk-ascii-gen

**Banner press** is a browser FIGlet banner maker for CLI authors. Type a tool
name, choose a font and color, then copy a terminal-ready ANSI banner or a
self-contained Python `print()` snippet.

## What it does

- Previews banners as you type, with ten bundled FIGlet fonts: Standard, Big,
  Slant, Shadow, Doom, Banner, Small, Ghost, Cyberlarge, and ANSI Shadow.
- Offers eight solid colors or a horizontal rainbow gradient using ANSI
  256-color escape sequences.
- Copies the rendered banner with **Copy ANSI**, or embeds its text and colors
  in a **Copy Python snippet** export that needs no Python packages.
- Renders locally in the browser. Fonts are bundled with the app; banner
  generation does not send your text to a server or fetch additional fonts.

## Run locally

From a checkout with Node.js and npm installed:

```bash
npm ci
npm run dev
```

Open the local URL printed by the development server. Enter your phrase, select
a font and color, and use one of the copy buttons. Empty input disables export.

## Development and build

```bash
npm run lint
npm run build
npm run preview
```

The build checks TypeScript and produces a static site in `dist/`. The preview
command serves that build locally. The app uses React, TypeScript, Vite, and
FIGlet; it has no backend or account setup.

## Output notes

Use a terminal with ANSI 256-color support to display the exported colors.
The Python export includes the rendered banner, so Python does not need FIGlet
or a color library at runtime. Font support for a particular character depends
on the selected FIGlet font.

The copy buttons use the browser clipboard API. Serve the app over HTTPS or
localhost and allow clipboard access when your browser requires it.
