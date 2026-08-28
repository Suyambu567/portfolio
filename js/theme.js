/* Theme toggle — progressive enhancement only.
   With JavaScript disabled the page still renders correctly and follows the
   operating system's colour scheme; this script only adds a manual override. */
(function () {
  "use strict";

  var KEY = "portfolio-theme";
  var root = document.documentElement;

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

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector(".theme-toggle");
    if (!button) { return; }
    button.hidden = false;
    apply(current(), button);
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next, button);
      persist(next);
    });
  });
})();
