/* ============================================================
   Jacob Kim — site behaviour
   No framework. Progressive enhancement only.

   Reveals are pure CSS (scroll-driven animations in motion.css).
   This file only:
     - splits headlines into masked lines
     - sets --i on staggered groups
     - marks the current nav item
     - drives the drone version rail
   ============================================================ */
(() => {
  "use strict";

  /* ---- stagger index for grouped reveals ---- */
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty("--i", i);
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", "");
    });
  });

  /* ---- split headlines into masked lines ---- */
  document.querySelectorAll("[data-lines]").forEach((el) => {
    const lines = el.textContent.trim().split("\n");
    el.textContent = "";
    el.classList.add("lines");
    lines.forEach((line, i) => {
      const ln = document.createElement("span");
      ln.className = "ln";
      const inner = document.createElement("span");
      inner.textContent = line.trim();
      inner.style.setProperty("--i", i);
      ln.appendChild(inner);
      el.appendChild(ln);
    });
  });

  /* ---- top nav: hidden at the top, slides in once you scroll ---- */
  const setNav = () => {
    document.body.classList.toggle("nav-shown", window.scrollY > 24);
  };
  setNav();

  /* ---- about: scroll-choreographed intro ---- */
  const intro = document.querySelector("[data-intro]");
  const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);
  const remap = (n, a, b) => clamp01((n - a) / (b - a));
  const applyIntro = intro
    ? () => {
        const travel = intro.offsetHeight - window.innerHeight;
        const p = travel > 0 ? clamp01(-intro.getBoundingClientRect().top / travel) : 0;
        intro.style.setProperty("--dock", remap(p, 0.05, 0.4).toFixed(4));
        intro.style.setProperty("--panel", remap(p, 0.32, 0.62).toFixed(4));
        intro.style.setProperty("--cue", (1 - remap(p, 0.0, 0.1)).toFixed(4));
      }
    : () => {};
  applyIntro();

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      setNav();
      applyIntro();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    setNav();
    applyIntro();
  });

  /* ---- mark the current nav item ---- */
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === here || (here === "" && href === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---- drone models: swap a [data-model] frame for an interactive
     <model-viewer> once the .glb actually exists in assets/. Until then
     the frame keeps its "drop a file here" placeholder. ---- */
  const modelFrames = document.querySelectorAll("[data-model]");
  if (modelFrames.length) {
    let libRequested = false;
    const loadLib = () => {
      if (libRequested) return;
      libRequested = true;
      const s = document.createElement("script");
      s.type = "module";
      s.src = "js/vendor/model-viewer.min.js";
      document.head.appendChild(s);
    };
    modelFrames.forEach((frame) => {
      const src = frame.getAttribute("data-model");
      if (!src) return;
      fetch(src, { method: "HEAD" })
        .then((r) => {
          if (!r.ok) return;
          loadLib();
          const label = (frame.textContent.trim().split("\n")[0] || "3D model").trim();
          const mv = document.createElement("model-viewer");
          const attrs = {
            src,
            alt: label,
            "camera-controls": "",
            "auto-rotate": "",
            "auto-rotate-delay": "0",
            "rotation-per-second": "22deg",
            "camera-orbit": "-25deg 68deg 82%",
            "interaction-prompt": "none",
            "touch-action": "pan-y",
            "tone-mapping": "agx",
            exposure: "0.6",
            "shadow-intensity": "2",
            "shadow-softness": "0.4",
          };
          for (const [k, v] of Object.entries(attrs)) mv.setAttribute(k, v);
          frame.textContent = "";
          frame.classList.add("frame--model");
          frame.appendChild(mv);
        })
        .catch(() => {});
    });
  }

  /* ---- drone version rail: highlight the section in view ---- */
  const rail = document.querySelector("[data-rail]");
  if (rail) {
    const links = Array.from(rail.querySelectorAll("a"));
    const sections = Array.from(document.querySelectorAll("[data-version]"));
    let tick = false;
    const mark = () => {
      tick = false;
      const mid = window.innerHeight * 0.5;
      let current = sections[0];
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= mid) current = s;
      }
      if (current) {
        links.forEach((l) =>
          l.classList.toggle("on", l.getAttribute("href") === "#" + current.id)
        );
      }
    };
    window.addEventListener(
      "scroll",
      () => {
        if (tick) return;
        tick = true;
        requestAnimationFrame(mark);
      },
      { passive: true }
    );
    mark();
  }
})();
