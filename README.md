# Expired

A photo editor that does one thing: makes digital photos look like they were shot on expired film.

It runs entirely in the browser (canvas, no libraries, no server), so photos never leave the device. It installs as an offline app on Android and iPhone.

## Use it

The top level of this repository is the installable app. Turn on GitHub Pages (Settings → Pages → Deploy from a branch → `main`, `/ (root)`) and it will be served at:

`https://thechickenmarengo.github.io/Expired-photo-editor/`

Open that link on a phone and add it to the home screen. Full install and hosting notes are in [docs/INSTALL.md](docs/INSTALL.md).

## What's in it

- 12 film stocks, including instant, mono and disposable-camera stocks, plus 5 one-tap Looks
- Expiry age and storage, film speed and push/pull, chemistry faults
- Damage: fog, fading, stains, light leaks, dust, fibres, scratches, mould, water spots and more, each with its own reroll
- Camera types (standard, disposable, pinhole) and five flash modes
- Darkroom developing and printing, with a final Develop step that starts on blank paper
- Crop and straighten, flare-removal retouch brush, upscaling, date stamp, saved profiles
- Photos open untouched: effects appear only when you edit, pick a stock or Look, or press Reroll all

## Repository layout

```
index.html, sw.js,       the installable app (built from src/)
manifest.webmanifest,
icons/, favicon.png
src/expired.html         source of truth (the single-file app)
tools/                   build scripts
tests/                   Playwright test scripts and sample photos
docs/INSTALL.md          hosting and phone install guide
```

## Building

`src/expired.html` is the app. The top-level `index.html` is generated from it by `tools/make_pwa.py`, which removes the "Open in browser" banner and switches saving to the share sheet.

The scripts expect a flat working folder, so copy things into one first:

```sh
mkdir work && cd work
cp ../src/expired.html past-due.html
cp ../tools/* ../tests/* .
mkdir expired-app && cp -r ../manifest.webmanifest ../sw.js ../icons ../favicon.png expired-app/
python3 make_pwa.py                          # writes expired-app/index.html
```

When releasing, bump the cache name in `sw.js` (for example `expired-v25` → `expired-v25`) so installed copies update.

## Testing

Tests use Node and Playwright with Chromium. Some scripts have `/home/claude/` paths hard-coded from the sandbox they were written in; change those to your working folder.

```sh
python3 build_test_html.py                   # makes test.html with a test hook and the sample photo
node all.js                                  # every slider at several values
node stress.js                               # stocks × cameras × flash, extremes, odd sizes
node monkey2.cjs 7 600                       # random taps, drags and typing
node clean.cjs                               # opened photos stay untouched until edited
```
