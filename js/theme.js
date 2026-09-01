/* Theme toggle, scroll reveal and stat counters — progressive enhancement only.

   With JavaScript disabled the page renders completely: it follows the
   operating system's colour scheme, every section is visible, and the stat row
   shows its final numbers straight from the markup. This file only adds the
   manual theme override and two pieces of motion on top of that.

   The `js` class is set here, in the head, and only when IntersectionObserver
   exists. `.reveal` hides nothing unless that class is present, so a browser
   without the observer — or one that never runs this file — is never left with
   invisible content. */
(function () {
  "use strict";

  var KEY = "portfolio-theme";
  var root = document.documentElement;
  var canObserve = "IntersectionObserver" in window;

  if (canObserve) { root.className = (root.className + " js").trim(); }

  /* ---------- theme ---------- */

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function persist(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
  }

  function systemIsDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function current() {
    return root.getAttribute("data-theme") || (systemIsDark() ? "dark" : "light");
  }

  function apply(theme, button) {
    root.setAttribute("data-theme", theme);
    if (button) {
      button.textContent = theme === "dark" ? "☀" : "☽";
      button.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " theme");
    }
  }

  var saved = stored();
  if (saved === "dark" || saved === "light") { root.setAttribute("data-theme", saved); }

  function initTheme() {
    var button = document.querySelector(".theme-toggle");
    if (!button) { return; }
    button.hidden = false;
    apply(current(), button);
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next, button);
      persist(next);
    });
  }

  /* ---------- scroll reveal ---------- */

  function reduced() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initReveal() {
    if (!canObserve) { return; }
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) { return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        observer.unobserve(el);
        /* Stagger only siblings that share a parent, so a long section does not
           accumulate a delay long enough to look broken. */
        var delay = reduced() ? 0 : Math.min(Number(el.getAttribute("data-stagger") || 0), 5) * 60;
        window.setTimeout(function () { el.classList.add("is-in"); }, delay);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    Array.prototype.forEach.call(targets, function (el) { observer.observe(el); });

    /* A safety sweep. An IntersectionObserver only reports the state it sees at
       a callback; an element scrolled past between two callbacks — an anchor
       jump, a flick scroll, a restored scroll position — can be missed and
       would then stay invisible until it happened to re-enter the viewport.
       This reveals anything already level with the fold, so nothing can be
       permanently stuck. */
    var ticking = false;
    function sweep() {
      ticking = false;
      var fold = window.innerHeight * 0.94;
      var rest = document.querySelectorAll(".reveal:not(.is-in)");
      if (!rest.length) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        return;
      }
      Array.prototype.forEach.call(rest, function (el) {
        if (el.getBoundingClientRect().top < fold) { el.classList.add("is-in"); }
      });
    }
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(sweep);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- stat counters ---------- */

  /* The final value lives in the markup as text. The counter overwrites it for
     the duration of the animation and then restores exactly that string, so a
     failed or skipped animation can never leave a wrong number on screen. */
  function initCounters() {
    if (!canObserve) { return; }
    var stats = document.querySelectorAll("[data-count-to]");
    if (!stats.length) { return; }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        observer.unobserve(el);
        if (reduced()) { return; }

        var final = el.textContent;
        var to = parseFloat(el.getAttribute("data-count-to"));
        var decimals = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
        var prefix = el.getAttribute("data-count-prefix") || "";
        if (isNaN(to)) { return; }

        var start = null;
        var duration = 900;

        function frame(now) {
          if (start === null) { start = now; }
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          if (p < 1) {
            el.textContent = prefix + (to * eased).toFixed(decimals);
            window.requestAnimationFrame(frame);
          } else {
            el.textContent = final;
          }
        }
        window.requestAnimationFrame(frame);
      });
    }, { threshold: 0.4 });

    Array.prototype.forEach.call(stats, function (el) { observer.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initReveal();
    initCounters();
  });
})();
