# Build notes

Plain static site. No framework, no build step. Open `index.html` in a browser,
or serve the folder:

```bash
python -m http.server 8000
```

Page transitions use the native **View Transitions API** (Chrome / Edge). Firefox
and Safari just do an instant navigation — nothing breaks, they only miss the wipe.

---

## File layout

```
index.html        about me (landing) — kept simple on purpose
projects.html     hub: drone / game / vex
drones.html       v1 -> v5 iteration timeline + flight software
game.html         Bunblade — Unity WebGL embed goes here
vex.html          VEX 3388S, 2023-2025
fun.html          smaller experiments

css/base.css      design system (monochrome)
css/motion.css    view transitions + scroll reveals
js/site.js        reveal-on-scroll, headline splitting, nav state, drone rail

fonts/            OMORI_GAME2.ttf
assets/           all media you drop in — see assets/README.md
```

Anything still in draft on the site is marked with a hatched **DRAFT** chip.
Search the HTML for `class="draft"` to find every spot that needs your input.

---

## 1. The game — DONE

The Bunblade WebGL build lives in `assets/game/` (`Build/`, `TemplateData/`,
`index.html`). `game.html` embeds it in the `#game-embed` box via an `<iframe>` to
`assets/game/index.html`; `TemplateData/style.css` has an override block that makes
the canvas fill the frame and hides the Unity footer.

`index.html` sets `config.matchWebGLToCanvasSize = false` so the game always
renders at its authored **960 x 600** and CSS just scales the display up. Do not
remove that — without it, scenes with fixed-pixel UI (the battle screen) render at
the browser's size and the HUD ends up off-screen with a blue camera-void border.

The build is Brotli-compressed with **Decompression Fallback: ON**, so the files
are named `game.*.unityweb` (~14 MB total) and the loader decompresses them in JS.
That means **it works on any plain static host, including GitHub Pages** — no
`Content-Encoding` header needed. Verified locally against `serve.py`.

`serve.py`'s `.br` / `Content-Encoding` handling is now unused (kept in case a
future build goes back to raw `.br`).

If you re-build the game, the fresh `assets/game/index.html` and
`TemplateData/style.css` will overwrite the two custom bits — re-apply:
`config.matchWebGLToCanvasSize = false;` (index.html), the desktop-branch
`canvas.style.width/height = "100%"` (index.html), and the "jacobkim.ca embed
overrides" block at the bottom of `TemplateData/style.css`.

Note: `assets/game/Build/*.unityweb` are ~14 MB of binaries committed directly
(Git LFS is not an option — GitHub Pages serves LFS pointer files, not the data).

---

## 2. The drone CAD — DONE

All 5 interactive models are live at `assets/drones/vN/model.glb`, converted from
your Fusion OBJ exports (`npx obj2gltf`). On page load `js/site.js` checks each
version's `data-model` marker and turns the frame into a `<model-viewer>`
(orbit / zoom / slow auto-rotate). The component (`js/vendor/model-viewer.min.js`,
~1 MB) is vendored locally — no CDN.

v2/v3 are flat grey (single "Steel – Satin" appearance); v4/v5 show the white +
cyan colouring from your CAD. To change colours: reassign **Appearances** in
Fusion, re-export OBJ, send it over.

**To add photos** per version: drop `*.jpg` in `assets/drones/vN/` and tell me —
I'll build a gallery alongside the model.

**Software section:** the "SWE / Autonomous visual tracking" block was pulled from
`drones.html` (Aug 30) to be rebuilt later. When redoing it: add an
`<article class="version" id="software" data-version>` after the v5 article and a
`<a href="#software">…</a>` in the `.rail` nav.

**If you ever re-export:** configured designs only offer `.f3z` in File > Export.
Workaround — right-click the top component in the browser tree → **Save As Mesh**
(STL or OBJ), or pick a single configuration in the export dialog's top dropdown.

---

## 3. Media I still need

| Where | What |
|---|---|
| `assets/drones/vN/*.jpg` | WIP photos per version (models are done) — optional |
| `assets/drones/flight.mp4` | flight video (muted loop) — or send raw clips |
| `assets/game/shots/` | menu.png, battle.png for the Screens section (optional) |
| `assets/vex/` | robot photos, CAD renders, match clips |

---

## 4. Draft copy to confirm

- **Drones:** per-version copy is done (your notes, first person). Still missing:
  all-up weight / flight time numbers if you want them shown.
- **VEX:** the two game names (2023-24, 2024-25) and the full award list.
- **Repo links:** exact GitHub URLs for the drone software and for Bunblade
  (drone page still has one DRAFT chip on the "Full source" line).
- **Contact:** the footer uses your Waterloo email + GitHub + LinkedIn from your
  résumé. Phone number left off on purpose — add it if you want it public.
