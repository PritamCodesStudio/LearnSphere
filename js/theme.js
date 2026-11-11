/* =========================================================
   LearnSphere Academy — Theme (light / dark)
   Preference is persisted in localStorage and applied before
   paint by a tiny inline script in each HTML page.
   ========================================================= */
(function () {
  "use strict";

  var KEY = "learnsphere.theme";
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function stored() {
    try {
      var value = window.localStorage.getItem(KEY);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function apply(mode, persist) {
    var theme = mode === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) {
      try {
        window.localStorage.setItem(KEY, theme);
      } catch (error) {
        /* storage unavailable */
      }
    }
    updateControls(theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#17151f" : "#f8f7f4");
    document.dispatchEvent(
      new CustomEvent("ls:theme", {
        detail: { theme: theme }
      })
    );
  }

  function updateControls(theme) {
    var isDark = theme === "dark";
    Array.prototype.forEach.call(document.querySelectorAll(".theme-toggle"), function (button) {
      button.setAttribute("aria-pressed", isDark ? "true" : "false");
      button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
      button.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  function toggle() {
    var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    apply(current === "dark" ? "light" : "dark", true);
  }

  document.addEventListener("click", function (event) {
    var toggleButton = event.target.closest(".theme-toggle");
    if (!toggleButton) return;
    event.preventDefault();
    toggle();
  });

  if (media) {
    var onChange = function (event) {
      if (!stored()) apply(event.matches ? "dark" : "light", false);
    };
    if (media.addEventListener) media.addEventListener("change", onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  document.addEventListener("ls:components-ready", function () {
    updateControls(document.documentElement.getAttribute("data-theme") || "light");
  });

  window.LS = window.LS || {};
  window.LS.theme = {
    apply: apply,
    toggle: toggle,
    current: function () {
      return document.documentElement.getAttribute("data-theme") || "light";
    }
  };
})();
