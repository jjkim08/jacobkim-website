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

## 1. The game — making Bunblade playable in the browser

Your zip is the **Unity project source**, not a build. A browser can't run that
directly; Unity has to compile it to **WebGL** (WebAssembly + JS + data files).
I can't run Unity, so this part is yours — it's about 10 minutes.

**In Unity (you have 6000.2.14f1):**

1. `File > Build Profiles` (or `Build Settings`) → select **Web** →
   **Switch Platform**.
2. `Edit > Project Settings > Player > Web` tab → **Publishing Settings**:
   - Compression Format: **Gzip**
   - **Decompression Fallback: ON**  ← lets it run on any static host, including
     your PC, with no server config
3. Still in Player settings, set **Resolution** (e.g. 960 × 600) and WebGL
   Template: **Minimal**.
4. Add the scenes to the build (MainMenu, Turn Based, Shop, Lost) in the build
   list, MainMenu first.
5. **Build** → pick an empty output folder.

You get a folder with `index.html`, `Build/`, `TemplateData/`.

**Then:** copy the **contents** of that folder into `assets/game/` here, so you have:

```
assets/game/Build/...
assets/game/TemplateData/...
assets/game/index.html      (Unity's own — we don't link it directly)
```

Tell me the total size of `Build/` when it's done. If any single file in
`Build/` is over ~90 MB we should switch to Brotli or trim assets before it goes
on a real host. On your own PC it'll be fine either way.

Once it's in, I'll wire the `#game-embed` box on `game.html` to load it (either an
`<iframe>` to Unity's `index.html`, or the canvas loader inlined into our page
styling).

---

## 2. The drone CAD — getting it on the page

`.f3d` / `.f3z` are Fusion 360's own format. Nothing on the web can read them, and
neither can I — the geometry inside is proprietary. We need a mesh export.

**For each version, in Fusion 360:**

- Open the design (`drone v1.f3d` … `drone v5` — note v4 and v5 are the `.f3z`
  files inside the `v4` folder).
- `File > Export` → **GLTF Binary (.glb)** if your Fusion version offers it.
  If not: `File > Export > Mesh (.stl)` or **OBJ**, "one file" / whole assembly.
- Name it `model.glb` (or `.stl` / `.obj`) and drop it in
  `assets/drones/v1/`, `.../v2/`, etc.

If you send STL or OBJ, I'll convert them to compressed GLB and wire up an
interactive 3D viewer (orbit / zoom) in each version's frame. Photos work too —
drop them in the same folders and I'll build a gallery instead of / alongside the
model.

The `.3mf` print files aren't useful here (single parts, oriented for the bed) —
you were right to skip them.

---

## 3. Media I still need

| Where | What |
|---|---|
| `assets/img/me.jpg` | your portrait for the about page |
| `assets/drones/vN/` | GLB/STL/OBJ model **and/or** WIP photos per version |
| `assets/drones/flight.mp4` | flight video (muted loop) — or send raw clips |
| `assets/game/` | the WebGL build (section 1) |
| `assets/game/shots/` | menu.png, battle.png (optional) |
| `assets/vex/` | robot photos, CAD renders, match clips |

---

## 4. Draft copy to confirm

- **Drones:** one or two sentences per version — what you changed and why, plus
  final weight / size / flight time. The site currently has neutral placeholders
  inferred from your part names; replace them with the real story.
- **VEX:** the two game names (2023-24, 2024-25) and the full award list.
- **Repo links:** exact GitHub URLs for the drone software and for Bunblade.
- **Contact:** the footer uses your Waterloo email + GitHub + LinkedIn from your
  résumé. Phone number left off on purpose — add it if you want it public.
