/* ==========================================================================
   BACKGROUND THREADS
   A single ribbon of fine purple threads crosses the viewport, pinching and
   fanning out slowly like silk. Near the cursor the threads part gently.

   - requestAnimationFrame loop, paused when the tab is hidden or the
     project sheet is open
   - thread count and sample spacing scale with screen size
   - devicePixelRatio capped at 1.75
   - prefers-reduced-motion: one static frame, no cursor reaction
   - dims after you scroll past the hero so content stays dominant

   Tweak the look in CONFIG below.
   ========================================================================== */

(function () {
  "use strict";

  var canvas = document.querySelector(".bg-threads");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  var CONFIG = {
    color: "116, 87, 245", // --accent as r, g, b
    maxAlpha: 0.3, // brightest (centre) thread
    minAlpha: 0.07, // outer threads
    dprCap: 1.75,
    cursorRadius: 150, // px, how far the cursor's influence reaches
    cursorPush: 30, // px, max displacement at the cursor
    speed: 1, // global time multiplier
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  var w = 0, h = 0, dpr = 1, step = 10;
  var threads = [];
  var gradient = null;
  var raf = 0;
  var running = false;
  var sheetOpen = false;
  var start = performance.now();
  var mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, power: 0, target: 0 };

  function build() {
    var count = w < 640 ? 8 : w < 1100 ? 11 : 14;
    threads = [];
    for (var i = 0; i < count; i++) {
      var f = count === 1 ? 0.5 : i / (count - 1);
      threads.push({
        f: f,
        alpha: CONFIG.minAlpha + (CONFIG.maxAlpha - CONFIG.minAlpha) * Math.pow(Math.sin(Math.PI * f), 2),
        width: i % 5 === 2 ? 1.25 : 0.75,
        phase: Math.random() * Math.PI * 2,
        wobble: 4 + Math.random() * 9,
        rate: 0.35 + Math.random() * 0.35,
      });
    }
  }

  function resize() {
    var prevW = w;
    dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    step = w < 640 ? 14 : 10;

    // Threads fade in and out at the screen edges
    gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, "rgba(" + CONFIG.color + ", 0)");
    gradient.addColorStop(0.18, "rgba(" + CONFIG.color + ", 1)");
    gradient.addColorStop(0.82, "rgba(" + CONFIG.color + ", 1)");
    gradient.addColorStop(1, "rgba(" + CONFIG.color + ", 0)");

    // Only rebuild on width changes; mobile toolbars change height constantly
    if (w !== prevW || !threads.length) build();
    if (!running) draw(reduceMotion.matches ? 0 : performance.now() - start);
  }

  // Vertical position of a thread at x, time s (seconds)
  function yAt(th, x, s) {
    var u = x / w;
    // Ribbon centre: rises from lower-left to upper-right with a slow S-bend
    var centre =
      h * (0.74 - 0.46 * u) +
      Math.sin(u * 3.1 + s * 0.11) * h * 0.075 +
      Math.sin(u * 6.7 - s * 0.17) * h * 0.022;
    // Ribbon width: pinches and fans along its length
    var spread = h * (0.035 + 0.12 * (0.5 + 0.5 * Math.sin(u * 4.2 - s * 0.14 + 1.3)));
    var offset = (th.f - 0.5) * spread;
    var wobble = Math.sin(u * 8.5 + s * th.rate + th.phase) * th.wobble;
    return centre + offset + wobble;
  }

  function draw(ms) {
    var s = (ms / 1000) * CONFIG.speed;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = gradient;
    ctx.lineJoin = "round";

    var R = CONFIG.cursorRadius;
    var twoSigma2 = 2 * (R / 2) * (R / 2);
    var useMouse = mouse.power > 0.01;

    for (var i = 0; i < threads.length; i++) {
      var th = threads[i];
      ctx.beginPath();
      for (var x = -step; x <= w + step; x += step) {
        var y = yAt(th, x, s);
        if (useMouse) {
          var dx = x - mouse.x;
          var dy = y - mouse.y;
          if (dx > -R * 1.6 && dx < R * 1.6 && dy > -R * 1.6 && dy < R * 1.6) {
            var infl = Math.exp(-(dx * dx + dy * dy) / twoSigma2) * mouse.power;
            // Part away from the cursor, like a hand drawn through silk
            y += (dy >= 0 ? 1 : -1) * infl * CONFIG.cursorPush;
          }
        }
        if (x === -step) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = th.alpha;
      ctx.lineWidth = th.width;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    // Ease the cursor so the threads respond softly, never snap
    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    mouse.power += (mouse.target - mouse.power) * 0.05;
    draw(now - start);
    raf = requestAnimationFrame(frame);
  }

  function play() {
    if (!w || running || reduceMotion.matches || document.hidden || sheetOpen) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function pause() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function onPointerMove(e) {
    if (e.pointerType !== "mouse") return;
    if (mouse.target === 0) {
      // Jump the eased position close to the pointer on first entry
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
    mouse.target = 1;
  }

  function onPointerLeave() {
    mouse.target = 0;
  }

  function setMotion() {
    if (reduceMotion.matches) {
      pause();
      draw(0); // a single still frame
    } else {
      play();
    }
  }

  // Dim once the hero has scrolled away
  var hero = document.querySelector(".hero, .nf");
  if (hero && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        canvas.classList.toggle("is-dim", !entries[0].isIntersecting);
      },
      { threshold: 0.15 }
    ).observe(hero);
  }

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) pause();
    else play();
  });
  if (finePointer.matches) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
  }
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", setMotion);

  // The sheet's backdrop blurs whatever is behind it; stop redrawing meanwhile
  document.addEventListener("sheet:open", function () {
    sheetOpen = true;
    pause();
  });
  document.addEventListener("sheet:close", function () {
    sheetOpen = false;
    play();
  });

  // Start after the page has painted so the canvas never delays first render
  function boot() {
    requestAnimationFrame(function () {
      resize();
      setMotion();
    });
  }
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot, { once: true });
})();
