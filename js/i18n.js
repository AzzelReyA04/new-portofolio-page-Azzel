/* ==========================================================================
   I18N ENGINE
   Reads window.TRANSLATIONS (js/translations.js) and applies it to any
   element with data-i18n / data-i18n-attr. Exposes window.I18N:

     I18N.lang            current language ("en" | "id")
     I18N.t(key, vars)    look up a string, e.g. t("sheet.opening", { name })
     I18N.pick(obj)       pick obj.en / obj.id for per-project copy
     I18N.set(lang)       switch language (animated unless reduced motion)

   Fires a "langchange" event on document after every apply, so dynamic
   content (project cards, the sheet) can re-render its text.
   ========================================================================== */

(function () {
  "use strict";

  var T = window.TRANSLATIONS || {};
  var root = document.documentElement;
  var STORAGE_KEY = "lang";
  var SUPPORTED = ["en", "id"];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // The inline <head> script already resolved the language onto <html lang>
  var lang = SUPPORTED.indexOf(root.lang) > -1 ? root.lang : "en";
  var switching = false;
  var queued = null; // a choice made mid-transition runs right after it

  function lookup(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  function t(key, vars) {
    var s = lookup(T[lang], key);
    if (s == null) s = lookup(T.en, key); // fall back to English
    if (s == null) return key;
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) {
        return vars[k] != null ? vars[k] : m;
      });
    }
    return s;
  }

  function pick(obj) {
    if (!obj || typeof obj !== "object") return obj;
    return obj[lang] != null ? obj[lang] : obj.en;
  }

  function apply(scope) {
    scope = scope || document;

    scope.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (el.textContent !== value) el.textContent = value;
    });

    // Same lookup, but the translation string is trusted markup (authored in
    // translations.js, never user input) so a heading can carry one inline
    // accent span that survives a language switch instead of being wiped by
    // a plain textContent assignment.
    scope.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-html"));
      if (el.innerHTML !== value) el.innerHTML = value;
    });

    scope.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr")
        .split(";")
        .forEach(function (pair) {
          var parts = pair.split(":");
          var attr = (parts[0] || "").trim();
          var key = (parts[1] || "").trim();
          if (attr && key) el.setAttribute(attr, t(key));
        });
    });

    // Document-level metadata
    root.lang = lang;
    var is404 = document.body && document.body.getAttribute("data-page") === "404";
    document.title = t(is404 ? "meta.notFoundTitle" : "meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t(is404 ? "meta.notFoundDescription" : "meta.description"));

    root.classList.remove("i18n-pending");
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function save(next) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      /* private mode or blocked storage: the choice just won't persist */
    }
  }

  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  }

  // Switch language. Visible text blurs out, swaps, and settles back in,
  // staggered top-to-bottom by at most 40ms. Total is roughly 300ms.
  function set(next) {
    if (SUPPORTED.indexOf(next) < 0) return;
    if (switching) {
      queued = next;
      return;
    }
    if (next === lang) return;
    save(next);

    if (reduceMotion.matches) {
      lang = next;
      apply();
      return;
    }

    switching = true;
    var vh = window.innerHeight || 1;
    var targets = Array.prototype.filter.call(
      document.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-dyn]"),
      inView
    );

    root.classList.add("i18n-anim");
    targets.forEach(function (el) {
      var ratio = Math.min(Math.max(el.getBoundingClientRect().top / vh, 0), 1);
      el.style.setProperty("--i18n-delay", Math.round(ratio * 40) + "ms");
      el.classList.add("i18n-out");
    });

    window.setTimeout(function () {
      lang = next;
      apply();
      // Wait one frame so the new text is laid out before fading it back in
      requestAnimationFrame(function () {
        targets.forEach(function (el) {
          el.classList.remove("i18n-out");
        });
        window.setTimeout(function () {
          root.classList.remove("i18n-anim");
          targets.forEach(function (el) {
            el.style.removeProperty("--i18n-delay");
          });
          switching = false;
          if (queued) {
            var q = queued;
            queued = null;
            if (q !== lang) set(q);
            else document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
          }
        }, 170);
      });
    }, 150);
  }

  window.I18N = {
    get lang() {
      return lang;
    },
    t: t,
    pick: pick,
    apply: apply,
    set: set,
  };

  // Deferred scripts run after parsing, so the DOM is ready here
  apply();
})();
