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

  /* ---------- header state ---------- */

  /* The floating pill deepens its shadow once the page has scrolled. */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) { return; }
    var ticking = false;
    function set() {
      ticking = false;
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    window.addEventListener("scroll", function () {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(set);
    }, { passive: true });
    set();
  }

  /* ---------- scrollspy ---------- */

  /* Lights the nav link for the section currently on screen. Driven by an
     observer band around the viewport's upper third, so the active link
     changes when a chapter heading crosses the reading line. */
  function initSpy() {
    if (!canObserve) { return; }
    var links = document.querySelectorAll('.nav a[href^="#"]');
    if (!links.length) { return; }
    var byId = {};
    Array.prototype.forEach.call(links, function (a) {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (el) { byId[id] = a; }
    });
    var ids = Object.keys(byId);
    if (!ids.length) { return; }

    function activate(id) {
      Array.prototype.forEach.call(links, function (a) {
        a.classList.toggle("is-active", a === byId[id]);
      });
    }

    /* Every section with an id is watched — including ones with no nav link,
       which clear the highlight, so scrolling from Contact back up to About
       cannot leave Contact lit. */
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { activate(entry.target.id); }
      });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

    Array.prototype.forEach.call(
      document.querySelectorAll("main section[id]"),
      function (el) { observer.observe(el); }
    );
  }

  /* ---------- parallax ---------- */

  /* Subtle vertical drift on the project artwork as it crosses the viewport.
     Depth only — it never moves content enough to change what is readable,
     runs on wide viewports with motion allowed, and leaves the DOM untouched
     otherwise. */
  function initParallax() {
    if (reduced() || !window.matchMedia("(min-width: 900px)").matches) { return; }
    var shots = document.querySelectorAll("[data-parallax] img");
    if (!shots.length) { return; }
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      Array.prototype.forEach.call(shots, function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) { return; }
        var progress = (r.top + r.height / 2 - vh / 2) / vh; /* -0.5 .. 0.5 */
        img.style.translate = "0 " + (progress * -14).toFixed(1) + "px";
      });
    }
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ---------- certificate viewer ---------- */

  /* A native <dialog>: showModal() provides focus containment, ESC handling
     and focus restoration; this adds backdrop-click close, a body scroll
     lock, and swapping in the right embed for the file type. Certificates
     are local files under assets/certificates/ — no external viewer. */
  function initCertViewer() {
    var dialog = document.getElementById("cert-dialog");
    if (!dialog || typeof dialog.showModal !== "function") { return; }
    var title = dialog.querySelector(".cert-dialog-title");
    var body = dialog.querySelector(".cert-dialog-body");
    var tab = dialog.querySelector(".cert-dialog-tab");
    var closeBtn = dialog.querySelector(".cert-dialog-close");
    var opener = null;

    function openCert(button) {
      var src = button.getAttribute("data-cert");
      if (!src) { return; }
      var card = button.closest(".cert-card");
      var name = card && card.querySelector(".n");
      title.textContent = name ? name.textContent : "Certificate";
      tab.href = src;
      /* The embed is created on open and destroyed on close, so a PDF is not
         fetched until someone asks for it and stops loading when dismissed. */
      var el;
      if (/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(src)) {
        el = document.createElement("img");
        el.alt = title.textContent + " — certificate";
        el.src = src;
      } else {
        /* <object> renders the PDF where the browser can, and shows its
           child content where it cannot (typical on phones) — a local
           fallback, no external viewer. */
        el = document.createElement("object");
        el.type = "application/pdf";
        el.data = src;
        el.setAttribute("aria-label", title.textContent + " — certificate");
        var fb = document.createElement("div");
        fb.className = "cert-dialog-fallback";
        var msg = document.createElement("p");
        msg.textContent = "This browser cannot display the PDF inline.";
        var link = document.createElement("a");
        link.className = "btn btn-primary";
        link.href = src;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Open the certificate";
        fb.appendChild(msg);
        fb.appendChild(link);
        el.appendChild(fb);
      }
      body.textContent = "";
      body.appendChild(el);
      opener = button;
      document.body.classList.add("cert-dialog-open");
      dialog.showModal();
    }

    dialog.addEventListener("close", function () {
      document.body.classList.remove("cert-dialog-open");
      body.textContent = "";
      /* Modern browsers restore focus themselves; doing it explicitly keeps
         the behaviour identical everywhere. */
      if (opener) { opener.focus(); opener = null; }
    });
    closeBtn.addEventListener("click", function () { dialog.close(); });
    /* A click on the dialog element itself is a click on the backdrop — the
       bar and body cover the entire content box. */
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) { dialog.close(); }
    });

    document.addEventListener("click", function (event) {
      var button = event.target.closest && event.target.closest(".cert-view");
      if (button) { openCert(button); }
    });
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
    initHeader();
    initSpy();
    initReveal();
    initCounters();
    initParallax();
    initCertViewer();
  });
})();
