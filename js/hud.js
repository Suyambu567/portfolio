/* HUD behaviour for index.html — no dependencies.
   Everything here is progressive: with JS off, the page still reads top to
   bottom with every section, number and link present. */
(function () {
  "use strict";

  var EMAIL = "suyambulingaraj7@gmail.com";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) { return; }
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 2200);
  }

  /* ---------- nav, progress bar, scroll rail, scrollspy ---------- */
  function initScroll() {
    var nav = $("#nav");
    var bar = $(".progress");
    var rail = $(".rail");
    var fill = rail && $(".rail-fill", rail);
    var bot = rail && $(".rail-bot", rail);
    var tag = rail && $(".rail-tag", rail);
    var sections = $$("main section[id]");
    var links = $$(".nav-links a");
    var nodes = [];

    if (rail) {
      sections.forEach(function () {
        var n = document.createElement("span");
        n.className = "rail-node";
        rail.appendChild(n);
        nodes.push(n);
      });
    }

    function layoutNodes() {
      if (!rail || !rail.offsetHeight) { return; }
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var h = rail.offsetHeight;
      sections.forEach(function (s, i) {
        var p = max > 0 ? Math.min(1, Math.max(0, (s.offsetTop - 80) / max)) : 0;
        nodes[i].style.top = (p * (h - 12)) + "px";
      });
    }

    var current = null;
    function update() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, y / max) : 0;
      if (nav) { nav.classList.toggle("is-stuck", y > 10); }
      if (bar) { bar.style.transform = "scaleX(" + p + ")"; }

      var mark = y + window.innerHeight * 0.35;
      var active = sections[0];
      sections.forEach(function (s) { if (s.offsetTop <= mark) { active = s; } });

      if (rail && rail.offsetHeight) {
        var h = rail.offsetHeight;
        fill.style.height = (p * h) + "px";
        bot.style.top = Math.max(0, p * h - 26) + "px";
        sections.forEach(function (s, i) { nodes[i].classList.toggle("is-on", s.offsetTop <= mark); });
      }
      if (active && active !== current) {
        current = active;
        if (tag && active) { tag.textContent = active.getAttribute("data-rail") || ""; }
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + active.id);
        });
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { layoutNodes(); onScroll(); }, { passive: true });
    window.addEventListener("load", function () { layoutNodes(); update(); });
    layoutNodes();
    update();
  }

  /* ---------- mobile menu ---------- */
  function initMenu() {
    var btn = $(".menu-btn");
    var menu = $("#mobile-menu");
    if (!btn || !menu) { return; }
    function set(open) {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { set(false); } });
  }

  /* ---------- typewriter ---------- */
  function initType() {
    var el = $(".type");
    if (!el || reduced) { return; }
    var words = (el.getAttribute("data-words") || "").split("|");
    var w = 0, i = words[0].length, deleting = true;
    function step() {
      var delay;
      if (deleting) {
        i--;
        el.textContent = words[w].slice(0, i);
        delay = 40;
        if (i <= 0) { deleting = false; w = (w + 1) % words.length; delay = 320; }
      } else {
        i++;
        el.textContent = words[w].slice(0, i);
        delay = 80;
        if (i >= words[w].length) { deleting = true; delay = 1900; }
      }
      setTimeout(step, delay);
    }
    setTimeout(step, 2400);
  }

  /* ---------- photos: use whatever exists in assets/profile/ ---------- */
  var EXTS = [".webp", ".jpg", ".jpeg", ".png"];
  function loadFirst(img, base, done) {
    var k = 0;
    function next() {
      if (k >= EXTS.length) { return done(false); }
      var src = base + EXTS[k++];
      var probe = new Image();
      probe.onload = function () { img.src = src; done(true); };
      probe.onerror = next;
      probe.src = src;
    }
    next();
  }

  function initPhotos() {
    var grid = $(".photos");
    var avatar = $(".avatar");
    var bar = $(".mode-bar");
    var tagT = $(".matrix-tag-t");
    if (grid) {
      var figs = $$("figure", grid);
      var pending = figs.length, found = 0;
      figs.forEach(function (fig) {
        var img = $("img", fig);
        loadFirst(img, img.getAttribute("data-src"), function (ok) {
          if (ok) { found++; } else { fig.remove(); }
          if (--pending === 0) { finish(); }
        });
      });
      function finish() {
        if (!found) { return; }
        grid.hidden = false;
        if (avatar) { avatar.hidden = true; }
        if (found === 1) { grid.classList.add("single"); }
        if (found === 2) { grid.style.gridTemplateColumns = "1fr 1fr"; grid.style.gridTemplateRows = "1fr"; $$("figure", grid)[0].style.gridRow = "auto"; }
        if (tagT) { tagT.textContent = found > 1 ? "PROFILE MATRIX // " + found + "-ANGLE" : "PROFILE // VERIFIED"; }
        if (found > 1 && bar) {
          bar.hidden = false;
          var saved = grid.getAttribute("style") || "";
          $$("button", bar).forEach(function (b) {
            b.addEventListener("click", function () {
              $$("button", bar).forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
              var portrait = b.getAttribute("data-mode") === "portrait";
              grid.classList.toggle("single", portrait);
              grid.setAttribute("style", portrait ? "" : saved);
            });
          });
        }
      }
    }
    var idImg = $(".id-photo");
    if (idImg) {
      loadFirst(idImg, idImg.getAttribute("data-src"), function (ok) {
        if (!ok) { return; }
        idImg.hidden = false;
        var fb = $(".idcard .fallback");
        if (fb) { fb.setAttribute("hidden", ""); }
      });
    }
  }

  /* ---------- live clocks ---------- */
  var DAY = 864e5;
  function split(ms) {
    var totalDays = ms / DAY;
    var years = Math.floor(totalDays / 365.25);
    var remDays = totalDays - years * 365.25;
    var months = Math.floor(remDays / 30.4375);
    remDays -= months * 30.4375;
    var days = Math.floor(remDays);
    var secsLeft = Math.floor((remDays - days) * 86400);
    return {
      years: years, months: months, days: days,
      hours: Math.floor(secsLeft / 3600),
      minutes: Math.floor((secsLeft % 3600) / 60),
      seconds: secsLeft % 60,
      totalYears: totalDays / 365.25
    };
  }
  function initClocks() {
    var clocks = $$("[data-since], [data-periods]");
    if (!clocks.length) { return; }
    var badge = $("[data-total-badge]");
    function elapsed(el, now) {
      var since = el.getAttribute("data-since");
      if (since) { return Math.max(0, now - Date.parse(since)); }
      return el.getAttribute("data-periods").split(",").reduce(function (sum, p) {
        var ab = p.split("/");
        var a = Date.parse(ab[0]);
        var b = ab[1] === "now" ? now : Date.parse(ab[1]);
        return sum + Math.max(0, Math.min(b, now) - a);
      }, 0);
    }
    function tick() {
      var now = Date.now();
      clocks.forEach(function (el) {
        var v = split(elapsed(el, now));
        $$("[data-u]", el).forEach(function (b) {
          var u = b.getAttribute("data-u");
          var n = v[u];
          b.textContent = (u === "hours" || u === "minutes" || u === "seconds") ? pad(n) : String(n);
        });
        if (el.hasAttribute("data-periods") && badge) {
          badge.textContent = "≈ " + v.totalYears.toFixed(2) + " YRS ACTIVE";
        }
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- reveal + counters ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count-to"));
    var dec = parseInt(el.getAttribute("data-count-decimals") || "0", 10);
    var pre = el.getAttribute("data-count-prefix") || "";
    var final = el.textContent;
    if (reduced || isNaN(to)) { return; }
    var t0 = null, dur = 1300;
    function frame(t) {
      if (!t0) { t0 = t; }
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (to * e).toFixed(dec);
      if (k < 1) { requestAnimationFrame(frame); } else { el.textContent = final; }
    }
    requestAnimationFrame(frame);
  }
  function initReveal() {
    var items = $$(".reveal");
    var counters = $$("[data-count-to]");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });

    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) { return; }
        countUp(en.target);
        co.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- talking bots ---------- */
  function initBots() {
    var tb = $(".talkbot");
    if (tb) {
      var lines = ["வணக்கம்!", "Naan voice bot — Tamil, Tanglish rendum puriyum.", "Speech → text → intent → ticket.", "Scroll down — projects inga irukku! 👇"];
      var k = 0, say = $(".say", tb);
      tb.addEventListener("click", function () {
        k = (k + 1) % lines.length;
        say.textContent = lines[k];
        say.setAttribute("lang", k === 0 ? "ta" : "en");
        tb.classList.add("is-talking");
        setTimeout(function () { tb.classList.remove("is-talking"); }, 600);
      });
    }
    $$(".unit").forEach(function (u) {
      var timer;
      u.addEventListener("click", function () {
        $$(".unit.is-on").forEach(function (o) { if (o !== u) { o.classList.remove("is-on"); } });
        $(".bubble", u).textContent = u.getAttribute("data-say");
        u.classList.add("is-on");
        clearTimeout(timer);
        timer = setTimeout(function () { u.classList.remove("is-on"); }, 3200);
      });
    });
  }

  /* ---------- copy email ---------- */
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { toast("Email copied ⚡ " + text); }, function () { toast(text); });
    }
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Email copied ⚡ " + text); } catch (e) { toast(text); }
    ta.remove();
  }
  function initCopy() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-copy]");
      if (b) { copy(b.getAttribute("data-copy")); }
    });
  }

  /* ---------- project filters ---------- */
  function initFilters() {
    var btns = $$(".filters button");
    var cards = $$(".pcard");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter");
        btns.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        cards.forEach(function (c) {
          var show = f === "all" || c.getAttribute("data-cat") === f;
          c.hidden = !show;
          if (show) { c.classList.add("is-in"); }
        });
      });
    });
  }

  /* ---------- deep-dive files: open before jumping to them ---------- */
  function openTarget(id) {
    var el = id && document.getElementById(id);
    if (!el) { return; }
    var d = el.tagName === "DETAILS" ? el : el.closest("details");
    while (d) { d.open = true; d = d.parentElement && d.parentElement.closest("details"); }
  }
  function initDives() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href^='#']");
      if (a) { openTarget(a.getAttribute("href").slice(1)); }
    });
    if (location.hash) {
      openTarget(location.hash.slice(1));
      var t = document.getElementById(location.hash.slice(1));
      if (t) { setTimeout(function () { t.scrollIntoView(); }, 60); }
    }
    window.addEventListener("hashchange", function () { openTarget(location.hash.slice(1)); });
  }

  /* ---------- contact form → mail app ---------- */
  function initForm() {
    var form = $("#contact-form");
    if (!form) { return; }
    var f = function (n) { return form.elements.namedItem(n); };
    var msg = $("#f-msg"), count = $("#f-count"), err = $("#f-err");
    msg.addEventListener("input", function () { count.textContent = msg.value.length; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = f("name").value.trim();
      var email = f("email").value.trim();
      var body = msg.value.trim();
      var missing = [];
      if (!name) { missing.push("name"); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { missing.push("a valid email"); }
      if (!body) { missing.push("a message"); }
      if (missing.length) {
        err.textContent = "Please add " + missing.join(", ") + ".";
        (!name ? f("name") : !body ? msg : f("email")).focus();
        return;
      }
      err.textContent = "";
      var kind = (form.querySelector("input[name=kind]:checked") || {}).value || "";
      var subject = f("subject").value.trim() || kind;
      var org = f("org").value.trim();
      var text = body + "\n\n— " + name + (org ? ", " + org : "") + "\n" + email + "\nInquiry type: " + kind;
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
      toast("Opening your mail app… 📡");
    });
  }

  /* ---------- command palette ---------- */
  function initPalette() {
    var dlg = $("#palette");
    if (!dlg || typeof dlg.showModal !== "function") {
      $$("[data-palette]").forEach(function (b) { b.hidden = true; });
      return;
    }
    var q = $("#pal-q"), list = $("#pal-list");
    var go = function (id) { return function () { openTarget(id); var t = document.getElementById(id); if (t) { t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); } }; };
    var items = [
      { t: "Home", k: "Section", run: go("top") },
      { t: "Recruiter snapshot", k: "Section", run: go("snapshot") },
      { t: "About", k: "Section", run: go("about") },
      { t: "Experience", k: "Section", run: go("experience") },
      { t: "Projects", k: "Section", run: go("projects") },
      { t: "Voice assistant — evidence", k: "Project", run: go("voice-assistant") },
      { t: "Tamil BPE tokenizer — evidence", k: "Project", run: go("tamil-tokenizer") },
      { t: "Fake user detection — evidence", k: "Project", run: go("fake-user-detection") },
      { t: "Expertise", k: "Section", run: go("skills") },
      { t: "Credentials", k: "Section", run: go("credentials") },
      { t: "Contact", k: "Section", run: go("contact") },
      { t: "Copy email address", k: "Action", run: function () { copy(EMAIL); } },
      { t: "Open résumé (PDF)", k: "Action", run: function () { location.href = "Suyambulingaraj_Resume_ATS.pdf"; } },
      { t: "Read the voice assistant case study", k: "Page", run: function () { location.href = "case-study-voice-assistant.html"; } },
      { t: "GitHub profile", k: "Link", run: function () { window.open("https://github.com/Suyambu567", "_blank", "noopener"); } },
      { t: "LinkedIn profile", k: "Link", run: function () { window.open("https://www.linkedin.com/in/suyambulingaraj-s-165590250/", "_blank", "noopener"); } }
    ];
    var shown = items, sel = 0;
    function render() {
      var s = q.value.trim().toLowerCase();
      shown = items.filter(function (it) { return !s || (it.t + " " + it.k).toLowerCase().indexOf(s) !== -1; });
      sel = Math.min(sel, Math.max(0, shown.length - 1));
      list.textContent = "";
      if (!shown.length) {
        var li = document.createElement("li");
        li.className = "pal-empty"; li.textContent = "No matches";
        list.appendChild(li);
        q.removeAttribute("aria-activedescendant");
        return;
      }
      shown.forEach(function (it, i) {
        var li = document.createElement("li");
        li.id = "pal-o" + i;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === sel));
        li.textContent = it.t;
        var k = document.createElement("span"); k.textContent = it.k; li.appendChild(k);
        li.addEventListener("mousemove", function () { if (sel !== i) { sel = i; render(); } });
        li.addEventListener("click", function () { choose(i); });
        list.appendChild(li);
      });
      q.setAttribute("aria-activedescendant", "pal-o" + sel);
      var cur = $("#pal-o" + sel);
      if (cur) { cur.scrollIntoView({ block: "nearest" }); }
    }
    function choose(i) { var it = shown[i]; dlg.close(); if (it) { it.run(); } }
    function open() {
      if (dlg.open) { return; }
      q.value = ""; sel = 0; render();
      dlg.showModal();
      q.focus();
    }
    q.addEventListener("input", function () { sel = 0; render(); });
    q.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
      else if (e.key === "Enter") { e.preventDefault(); choose(sel); }
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) { dlg.close(); } });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); if (dlg.open) { dlg.close(); } else { open(); } }
    });
    $$("[data-palette]").forEach(function (b) { b.addEventListener("click", open); });
  }

  /* ---------- certificate viewer ---------- */
  function initCertViewer() {
    var dialog = $("#cert-dialog");
    if (!dialog || typeof dialog.showModal !== "function") { return; }
    var title = $(".cert-dialog-title", dialog);
    var body = $(".cert-dialog-body", dialog);
    var tab = $(".cert-dialog-tab", dialog);
    var opener = null;
    function openCert(button) {
      var src = button.getAttribute("data-cert");
      if (!src) { return; }
      var card = button.closest(".cert-card");
      var name = card && $(".n", card);
      title.textContent = name ? name.textContent : "Certificate";
      tab.href = src;
      var el;
      if (/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(src)) {
        el = document.createElement("img");
        el.alt = title.textContent + " — certificate";
        el.src = src;
      } else {
        el = document.createElement("object");
        el.type = "application/pdf";
        el.data = src;
        el.setAttribute("aria-label", title.textContent + " — certificate");
        var fb = document.createElement("div");
        fb.className = "cert-dialog-fallback";
        var p = document.createElement("p");
        p.textContent = "This browser cannot display the PDF inline.";
        var a = document.createElement("a");
        a.className = "btn btn-primary"; a.href = src; a.target = "_blank"; a.rel = "noopener";
        a.textContent = "Open the certificate";
        fb.appendChild(p); fb.appendChild(a); el.appendChild(fb);
      }
      body.textContent = "";
      body.appendChild(el);
      opener = button;
      document.body.classList.add("no-scroll");
      dialog.showModal();
    }
    dialog.addEventListener("close", function () {
      document.body.classList.remove("no-scroll");
      body.textContent = "";
      if (opener) { opener.focus(); opener = null; }
    });
    $(".cert-dialog-close", dialog).addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) { dialog.close(); } });
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".cert-view");
      if (b) { openCert(b); }
    });
  }

  function init() {
    initScroll();
    initMenu();
    initType();
    initPhotos();
    initClocks();
    initReveal();
    initBots();
    initCopy();
    initFilters();
    initDives();
    initForm();
    initPalette();
    initCertViewer();
  }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", init); } else { init(); }
})();
