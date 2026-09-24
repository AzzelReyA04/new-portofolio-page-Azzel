/* ==========================================================================
   MAIN
   1. Project cards (built from window.PROJECTS)
   2. Language segmented control
   3. Mobile menu
   4. Header state + active nav link
   5. Scroll reveals
   6. Copy email
   ========================================================================== */

(function () {
  "use strict";

  var I18N = window.I18N;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* 1. Project cards ------------------------------------------------------ */

  var grid = document.querySelector("[data-work-grid]");

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHTML(p) {
    var img = p.image || {};
    var fit = img.fit === "contain" ? "contain" : "cover";
    var bg = fit === "contain" && img.bg ? ' style="background:' + esc(img.bg) + '"' : "";
    var srcset = img.srcset ? ' srcset="' + esc(img.srcset) + '" sizes="(min-width: 1240px) 700px, (min-width: 880px) 56vw, (min-width: 640px) 46vw, calc(100vw - 32px)"' : "";
    return (
      '<article class="work-card" data-id="' + esc(p.id) + '">' +
      '<div class="work-media" data-fit="' + fit + '"' + bg + ">" +
      '<img src="' + esc(img.src) + '"' + srcset + ' width="' + (img.width || "") + '" height="' + (img.height || "") +
      '" alt="" loading="lazy" decoding="async" data-alt />' +
      "</div>" +
      '<div class="work-body">' +
      '<div class="work-head">' +
      '<h3 class="work-title"><button class="work-open" type="button" aria-haspopup="dialog" aria-describedby="sum-' +
      esc(p.id) + '">' + esc(p.title) + "</button></h3>" +
      '<span class="work-year">' + esc(p.year) + "</span>" +
      "</div>" +
      '<p class="work-summary" id="sum-' + esc(p.id) + '" data-i18n-dyn data-field="summary"></p>' +
      '<div class="work-foot">' +
      '<span class="work-type" data-i18n-dyn data-field="type"></span>' +
      '<span class="work-more" aria-hidden="true"><span data-i18n-dyn data-field="details"></span>' +
      '<svg class="icon"><use href="#i-arrow-right"></use></svg></span>' +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderCards() {
    if (!grid || !window.PROJECTS) return;
    grid.innerHTML = window.PROJECTS.map(function (p, i) {
      return '<li class="work-item reveal" style="--reveal-delay:' + (i % 2) * 70 + 'ms">' + cardHTML(p) + "</li>";
    }).join("");
    updateCardText();
  }

  // Swap only the translatable text so reveal state and images stay put
  function updateCardText() {
    if (!grid) return;
    grid.querySelectorAll(".work-card").forEach(function (card) {
      var p = findProject(card.getAttribute("data-id"));
      if (!p) return;
      card.querySelector('[data-field="summary"]').textContent = I18N.pick(p.summary);
      card.querySelector('[data-field="type"]').textContent = I18N.pick(p.type);
      card.querySelector('[data-field="details"]').textContent = I18N.t("work.details");
      // The screenshot is described in the sheet; on the card it would repeat the title
      card.querySelector("[data-alt]").setAttribute("alt", "");
    });
  }

  function findProject(id) {
    var list = window.PROJECTS || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  if (grid) {
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".work-open");
      var card = e.target.closest(".work-card");
      if (!card) return;
      // A click anywhere on the card lands on the stretched title button
      if (!btn) btn = card.querySelector(".work-open");
      if (window.Sheet) window.Sheet.open(card.getAttribute("data-id"), btn);
    });
  }

  /* 2. Language segmented control ---------------------------------------- */

  var seg = document.querySelector("[data-lang-switch]");

  function syncLangControl() {
    if (!seg) return;
    seg.setAttribute("data-active", I18N.lang);
    seg.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === I18N.lang));
    });
  }

  if (seg) {
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (!b) return;
      var next = b.getAttribute("data-lang");
      // Move the pill immediately so the control feels instant
      seg.setAttribute("data-active", next);
      seg.querySelectorAll("[data-lang]").forEach(function (x) {
        x.setAttribute("aria-pressed", String(x === b));
      });
      I18N.set(next);
    });
    // Arrow keys move between the two options, like a native segmented control
    seg.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      var btns = Array.prototype.slice.call(seg.querySelectorAll("[data-lang]"));
      var i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var next = btns[(i + (e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
      next.focus();
      next.click();
    });
  }

  document.addEventListener("langchange", function () {
    syncLangControl();
    updateCardText();
    updateMenuLabel();
    resetCopyLabel();
  });

  /* 3. Mobile menu -------------------------------------------------------- */

  var menuBtn = document.querySelector("[data-menu-btn]");
  var menu = document.querySelector("[data-menu]");

  function updateMenuLabel() {
    if (!menuBtn) return;
    var open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-label", I18N.t(open ? "a11y.menuClose" : "a11y.menuOpen"));
  }

  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    updateMenuLabel();
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !e.target.closest("[data-header]")) setMenu(false);
    });
    window.matchMedia("(min-width: 760px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* 4. Header state + active nav link ------------------------------------ */

  var header = document.querySelector("[data-header]");
  var hero = document.querySelector(".hero");

  if ("IntersectionObserver" in window) {
    // Hairline under the header only once content scrolls beneath it
    if (header && hero) {
      var sentinel = document.createElement("div");
      sentinel.setAttribute("aria-hidden", "true");
      sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none";
      hero.appendChild(sentinel);
      new IntersectionObserver(function (entries) {
        header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
      }).observe(sentinel);
    }

    // Mark the nav link for the section in the middle of the viewport
    var links = document.querySelectorAll("[data-nav]");
    var sections = Array.prototype.map
      .call(links, function (a) {
        return document.getElementById(a.getAttribute("data-nav"));
      })
      .filter(Boolean);

    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            if (a.getAttribute("data-nav") === entry.target.id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) {
      navObserver.observe(s);
    });

    // Clear the highlight when back in the hero
    if (hero) {
      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting)
            links.forEach(function (a) {
              a.removeAttribute("aria-current");
            });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      ).observe(hero);
    }
  }

  /* 5. Scroll reveals ----------------------------------------------------- */

  function initReveals() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* 6. Copy email --------------------------------------------------------- */

  var copyBtn = document.querySelector("[data-copy]");
  var copyStatus = document.querySelector("[data-copy-status]");
  var copyTimer = 0;

  function resetCopyLabel() {
    if (!copyBtn) return;
    copyBtn.classList.remove("is-copied");
    copyBtn.querySelector("[data-copy-label]").textContent = I18N.t("contact.copy");
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject();
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      var attempt =
        navigator.clipboard && window.isSecureContext ? navigator.clipboard.writeText(text) : fallbackCopy(text);
      attempt
        .then(function () {
          copyBtn.classList.add("is-copied");
          copyBtn.querySelector("[data-copy-label]").textContent = I18N.t("contact.copied");
          if (copyStatus) copyStatus.textContent = I18N.t("a11y.emailCopied");
          clearTimeout(copyTimer);
          copyTimer = setTimeout(function () {
            resetCopyLabel();
            if (copyStatus) copyStatus.textContent = "";
          }, 2200);
        })
        .catch(function () {
          // Clipboard blocked: fall back to opening the mail app
          window.location.href = "mailto:" + text;
        });
    });
  }

  /* Boot ----------------------------------------------------------------- */

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  renderCards();
  syncLangControl();
  updateMenuLabel();
  initReveals();

  // Respect a hash on load (e.g. /#projects) after cards have rendered
  if (location.hash && location.hash.length > 1) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      requestAnimationFrame(function () {
        target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "instant" });
      });
    }
  }
})();
