/* ==========================================================================
   PROJECT BOTTOM SHEET
   Flow: tap a card -> sheet springs up to a compact height showing the
   project mark with a ring drawing around it ("Opening X") -> after
   LOAD_MS it expands into the full detail view.

   Close by: swiping down (mobile), dragging the handle (mouse), tapping the
   backdrop, pressing Escape, or the close button.

   Motion uses a small spring solver with Apple's two designer-friendly
   parameters (damping ratio + response). Every animation starts from the
   sheet's current position and velocity, so it can be grabbed mid-flight.

   Accessibility: role="dialog" + aria-modal, focus moves in and is trapped,
   the rest of the page is made inert, page scroll is locked, and focus
   returns to the card on close. Reduced motion: a simple fade.

   Public API: window.Sheet.open(projectId, triggerElement), Sheet.close()
   ========================================================================== */

(function () {
  "use strict";

  var root = document.querySelector("[data-sheet]");
  if (!root) return;

  var LOAD_MS = 800; // loading state length (0.7-1s feels polished)
  var COMPACT = 236; // visible height of the sheet while loading (px)

  var panel = root.querySelector("[data-sheet-panel]");
  var backdrop = root.querySelector("[data-sheet-backdrop]");
  var handle = root.querySelector("[data-sheet-handle]");
  var scroller = root.querySelector("[data-sheet-scroll]");
  var content = root.querySelector("[data-sheet-content]");
  var markEl = root.querySelector("[data-sheet-mark]");
  var openingEl = root.querySelector("[data-sheet-opening]");
  var loadingEl = root.querySelector("[data-sheet-loading]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  var state = "closed"; // closed | loading | open | closing
  var y = 0; // current translateY of the panel (px)
  var anim = null; // running spring
  var timer = 0;
  var project = null;
  var opener = null;
  var drag = null;

  panel.style.setProperty("--load-ms", LOAD_MS + "ms");

  /* ---------- helpers ---------- */

  function clamp(v, a, b) {
    return Math.min(Math.max(v, a), b);
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function height() {
    return panel.offsetHeight;
  }
  function closedY() {
    return height() + 40;
  }
  function compactY() {
    return Math.max(0, height() - COMPACT);
  }

  // Position the panel and keep the backdrop in sync with it, frame by frame
  function render(v) {
    y = v;
    panel.style.transform = "translate3d(0," + v.toFixed(2) + "px,0)";
    var cy = compactY();
    var zy = closedY();
    var o = v <= cy ? 1 : 1 - (v - cy) / (zy - cy);
    backdrop.style.opacity = clamp(o, 0, 1).toFixed(3);
  }

  /* ---------- spring ---------- */
  // damping: 1 = no overshoot, <1 = a little bounce
  // response: roughly how quickly it arrives, in seconds (not a duration)
  function springTo(target, opts) {
    opts = opts || {};
    var damping = opts.damping != null ? opts.damping : 1;
    var response = opts.response != null ? opts.response : 0.4;
    var k = Math.pow((2 * Math.PI) / response, 2);
    var c = (4 * Math.PI * damping) / response;
    var x = y;
    var v = opts.velocity != null ? opts.velocity : anim ? anim.velocity : 0;
    var last = performance.now();
    var id = 0;

    stop();
    var spring = {
      velocity: v,
      stop: function () {
        cancelAnimationFrame(id);
      },
    };
    anim = spring;

    return new Promise(function (resolve) {
      function tick(now) {
        var dt = Math.min((now - last) / 1000, 0.064);
        last = now;
        // Integrate in small sub-steps for stability
        var n = Math.max(1, Math.ceil(dt / 0.004));
        var hStep = dt / n;
        for (var i = 0; i < n; i++) {
          var a = -k * (x - target) - c * v;
          v += a * hStep;
          x += v * hStep;
        }
        spring.velocity = v;
        if (Math.abs(v) < 4 && Math.abs(x - target) < 0.4) {
          render(target);
          if (anim === spring) anim = null;
          resolve();
          return;
        }
        render(x);
        id = requestAnimationFrame(tick);
      }
      id = requestAnimationFrame(tick);
    });
  }

  function stop() {
    if (anim) anim.stop();
    anim = null;
  }

  // Where a flick would come to rest (Apple's projection, deceleration 0.998)
  function projectRest(velocity) {
    var d = 0.998;
    return ((velocity / 1000) * d) / (1 - d);
  }

  // Soft resistance when dragging above the top (rubber-banding)
  function rubber(overshoot, dimension) {
    var c = 0.55;
    return (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
  }

  /* ---------- content ---------- */

  function findProject(id) {
    var list = window.PROJECTS || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function fillLoading() {
    var t = window.I18N;
    markEl.textContent = project.mark || project.title.charAt(0);
    // "Opening {name}" with the name emphasised
    var parts = t.t("sheet.opening").split("{name}");
    openingEl.textContent = "";
    openingEl.appendChild(document.createTextNode(parts[0] || ""));
    var b = document.createElement("b");
    b.textContent = project.title;
    openingEl.appendChild(b);
    openingEl.appendChild(document.createTextNode(parts[1] || ""));
  }

  function renderDetail() {
    var I = window.I18N;
    var p = project;
    var img = p.image || {};
    var fit = img.fit === "contain" ? "contain" : "cover";
    var figStyle = fit === "contain" && img.bg ? ' style="background:' + esc(img.bg) + '"' : "";
    var srcset = img.srcset ? ' srcset="' + esc(img.srcset) + '" sizes="(min-width: 860px) 780px, 100vw"' : "";

    var links = (p.links || [])
      .map(function (l, i) {
        var primary = i === 0 && l.type !== "github";
        var icon = l.type === "github" ? "i-github" : "i-arrow-up-right";
        return (
          '<a class="btn ' + (primary ? "btn-primary" : "btn-secondary") + '" href="' + esc(l.url) +
          '" target="_blank" rel="noopener noreferrer">' +
          "<span>" + esc(I.t("sheet.links." + l.type)) + "</span>" +
          '<svg class="icon" aria-hidden="true"><use href="#' + icon + '"></use></svg>' +
          '<span class="sr-only"> ' + esc(I.t("a11y.newTab")) + "</span></a>"
        );
      })
      .join("");

    var chips = (p.stack || [])
      .map(function (s) {
        return "<li>" + esc(s) + "</li>";
      })
      .join("");

    content.innerHTML =
      '<header class="sc-head sc-reveal" style="--i:0">' +
      '<span class="sc-mark" aria-hidden="true">' + esc(p.mark || p.title.charAt(0)) + "</span>" +
      '<div><h2 class="sc-title" id="sheet-title">' + esc(p.title) + "</h2>" +
      '<p class="sc-meta">' + esc(I.pick(p.type)) + " · " + esc(p.year) + "</p></div>" +
      "</header>" +
      '<figure class="sc-figure sc-reveal" style="--i:1" data-fit="' + fit + '"' + figStyle + ">" +
      '<img src="' + esc(img.src) + '"' + srcset + ' width="' + (img.width || "") + '" height="' + (img.height || "") +
      '" alt="' + esc(I.pick(img.alt) || "") + '" decoding="async" />' +
      "</figure>" +
      '<div class="sc-grid">' +
      '<section class="sc-reveal" style="--i:2" aria-labelledby="sc-overview">' +
      '<h3 class="sc-label" id="sc-overview">' + esc(I.t("sheet.overview")) + "</h3>" +
      '<p class="sc-desc">' + esc(I.pick(p.description)) + "</p>" +
      "</section>" +
      '<dl class="sc-facts sc-reveal" style="--i:3">' +
      "<div><dt>" + esc(I.t("sheet.role")) + "</dt><dd>" + esc(I.pick(p.role)) + "</dd></div>" +
      "<div><dt>" + esc(I.t("sheet.stack")) + '</dt><dd><ul class="chips" role="list">' + chips + "</ul></dd></div>" +
      "<div><dt>" + esc(I.t("sheet.outcome")) + "</dt><dd>" + esc(I.pick(p.outcome)) + "</dd></div>" +
      "</dl>" +
      "</div>" +
      (links ? '<div class="sc-actions sc-reveal" style="--i:4">' + links + "</div>" : "");
  }

  /* ---------- page state: inert, scroll lock ---------- */

  function setBackgroundInert(on) {
    document.querySelectorAll("body > header, body > main, body > footer, .skip-link").forEach(function (el) {
      el.inert = on;
      if (on) el.setAttribute("aria-hidden", "true");
      else el.removeAttribute("aria-hidden");
    });
  }

  function lockScroll(on) {
    document.documentElement.classList.toggle("is-locked", on);
  }

  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) {
        // skip anything not rendered or hidden (the detail view while loading)
        return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
      }
    );
  }

  /* ---------- open / expand / close ---------- */

  function open(id, trigger) {
    if (state !== "closed") return;
    project = findProject(id);
    if (!project) return;
    opener = trigger || document.activeElement;

    fillLoading();
    renderDetail(); // render now so the image loads during the loading beat
    scroller.scrollTop = 0;

    panel.setAttribute("data-state", "loading");
    panel.setAttribute("aria-busy", "true");
    panel.setAttribute("aria-labelledby", "sheet-loading-text");
    loadingEl.setAttribute("aria-hidden", "false");

    root.hidden = false;
    root.classList.toggle("is-rm", reduceMotion.matches);
    lockScroll(true);
    setBackgroundInert(true);
    document.dispatchEvent(new CustomEvent("sheet:open"));
    state = "loading";

    if (reduceMotion.matches) {
      render(0);
      panel.style.opacity = "0";
      backdrop.style.opacity = "0";
      void panel.offsetWidth; // commit the starting opacity
      panel.style.opacity = "1";
      backdrop.style.opacity = "1";
    } else {
      render(closedY());
      springTo(compactY(), { damping: 0.86, response: 0.36, velocity: 0 });
    }

    panel.focus({ preventScroll: true });
    timer = window.setTimeout(expand, LOAD_MS);
  }

  function expand(velocity) {
    window.clearTimeout(timer);
    if (state === "closed" || state === "closing") return;
    state = "open";
    panel.setAttribute("data-state", "ready");
    panel.removeAttribute("aria-busy");
    panel.setAttribute("aria-labelledby", "sheet-title");
    loadingEl.setAttribute("aria-hidden", "true");
    if (reduceMotion.matches) render(0);
    else springTo(0, { damping: 0.9, response: 0.5, velocity: velocity });
  }

  function finishClose() {
    root.hidden = true;
    root.classList.remove("is-rm");
    panel.removeAttribute("data-state");
    panel.style.opacity = "";
    content.innerHTML = "";
    lockScroll(false);
    setBackgroundInert(false);
    state = "closed";
    document.dispatchEvent(new CustomEvent("sheet:close"));
    if (opener && typeof opener.focus === "function") opener.focus({ preventScroll: true });
    opener = null;
    project = null;
  }

  function close(velocity) {
    if (state === "closed" || state === "closing") return;
    window.clearTimeout(timer);
    state = "closing";

    if (reduceMotion.matches) {
      panel.style.opacity = "0";
      backdrop.style.opacity = "0";
      window.setTimeout(function () {
        if (state === "closing") finishClose();
      }, 230);
      return;
    }

    springTo(closedY(), { damping: 1, response: 0.36, velocity: velocity || 0 }).then(function () {
      if (state === "closing") finishClose();
    });
  }

  /* ---------- drag to dismiss ---------- */

  function dragStart(clientY) {
    if (state === "closed" || reduceMotion.matches) return false;
    stop();
    window.clearTimeout(timer);
    drag = {
      startY: clientY,
      startPos: y,
      wasLoading: state === "loading",
      samples: [{ y: clientY, t: performance.now() }],
    };
    if (state === "closing") state = "open"; // caught it on the way down
    panel.classList.add("is-dragging");
    return true;
  }

  function dragMove(clientY) {
    if (!drag) return;
    var next = drag.startPos + (clientY - drag.startY);
    if (next < 0) next = -rubber(-next, height()); // resist above the top
    render(next);
    var now = performance.now();
    drag.samples.push({ y: clientY, t: now });
    while (drag.samples.length > 2 && now - drag.samples[0].t > 100) drag.samples.shift();
  }

  function dragEnd() {
    if (!drag) return;
    var s = drag.samples;
    var first = s[0];
    var last = s[s.length - 1];
    var dt = (last.t - first.t) / 1000;
    var velocity = dt > 0 ? (last.y - first.y) / dt : 0; // px/s, positive = down
    var wasLoading = drag.wasLoading;
    drag = null;
    panel.classList.remove("is-dragging");

    // Decide from where the gesture is heading, not only where it stopped
    var projected = y + projectRest(velocity);
    var threshold = wasLoading ? compactY() + COMPACT * 0.4 : height() * 0.45;

    if (projected > threshold && velocity > -50) {
      close(velocity);
    } else if (wasLoading && projected > compactY() * 0.5) {
      // Released near the compact position: let it finish loading, then expand
      springTo(compactY(), { damping: 0.9, response: 0.35, velocity: velocity });
      state = "loading";
      timer = window.setTimeout(expand, 250);
    } else if (wasLoading) {
      expand(velocity);
    } else {
      state = "open";
      springTo(0, { damping: 0.82, response: 0.4, velocity: velocity });
    }
  }

  // Mouse, pen, and touch on the handle area
  handle.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 || e.target.closest("button")) return;
    if (!dragStart(e.clientY)) return;
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener("pointermove", function (e) {
    if (drag) dragMove(e.clientY);
  });
  handle.addEventListener("pointerup", dragEnd);
  handle.addEventListener("pointercancel", dragEnd);

  // Touch on the content: pull down to dismiss only when scrolled to the top
  var touch = null;
  scroller.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length !== 1) return;
      touch = { y: e.touches[0].clientY, active: false };
    },
    { passive: true }
  );
  scroller.addEventListener(
    "touchmove",
    function (e) {
      if (!touch) return;
      var cy = e.touches[0].clientY;
      if (!touch.active) {
        if (scroller.scrollTop <= 0 && cy - touch.y > 6) {
          touch.active = dragStart(cy);
        } else if (Math.abs(cy - touch.y) > 6) {
          touch = null; // a normal scroll; leave it alone
          return;
        }
      }
      if (touch && touch.active) {
        e.preventDefault();
        dragMove(cy);
      }
    },
    { passive: false }
  );
  function touchEnd() {
    if (touch && touch.active) dragEnd();
    touch = null;
  }
  scroller.addEventListener("touchend", touchEnd);
  scroller.addEventListener("touchcancel", touchEnd);

  /* ---------- other ways to close, focus trap ---------- */

  backdrop.addEventListener("click", function () {
    close(0);
  });
  root.querySelector("[data-sheet-close]").addEventListener("click", function () {
    close(0);
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close(0);
      return;
    }
    if (e.key !== "Tab") return;
    var items = focusables();
    if (!items.length) {
      e.preventDefault();
      return;
    }
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Keep the sheet at the right detent when the viewport changes
  window.addEventListener("resize", function () {
    if (state === "open") render(0);
    else if (state === "loading" && !anim) render(compactY());
  });

  // Re-render text if the language changes while open
  document.addEventListener("langchange", function () {
    if (!project || state === "closed") return;
    fillLoading();
    renderDetail();
  });

  window.Sheet = { open: open, close: close };
})();
