# assets/

Drop media here. Nothing in this tree is committed as code — it's all yours to fill.

```
img/
  me.jpg                portrait for the about page (any size, ~800px+ wide)
  work-drone.jpg        square-ish cover for the Selected Work card (drone)
  work-vex.jpg          square-ish cover for the Selected Work card (VEX)
  work-bunblade.jpg     already here — cropped from the game's main-menu art;
                        swap it for a real screenshot whenever you want

drones/
  v1/  v2/  v3/  v4/  v5/
      model.glb         full-assembly export from Fusion 360. Drop it in and the
                        frame becomes an interactive 3D viewer automatically
                        (send .stl / .obj instead and I'll convert to .glb).
      *.jpg             work-in-progress photos for that version
  flight.mp4            flight footage, muted loop (or send raw clips)

game/
  Build/  TemplateData/ index.html     Unity WebGL build output (see BUILD-NOTES.md §1)
  shots/
      menu.png  battle.png             screenshots (optional)

vex/
  robot-2025.jpg  robot-2024.jpg        robot photos
  *.png / *.mp4                         CAD renders, match clips
```

File names above are what the pages currently point at. If you use different
names, either rename to match or tell me and I'll update the `data-model` / `src`
attributes.
