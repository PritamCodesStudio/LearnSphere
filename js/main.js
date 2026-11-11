/* =========================================================
   LearnSphere Academy — Shared page bootstrap
   Runs last on every page. Keeps small global behaviours in
   one place so each page file can stay focused.
   ========================================================= */
(function () {
  "use strict";

  /* Custom validation is handled by forms.js. Turning off the
     browser's native bubbles keeps error messages consistent. */
  Array.prototype.forEach.call(document.querySelectorAll("form"), function (form) {
    form.setAttribute("novalidate", "");
  });

  /* Any element can show the current year without a build step. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* Mark the document as ready for small CSS finishing touches. */
  document.documentElement.classList.add("is-ready");

  /* Keep footer newsletter status messages accessible. */
  var newsletter = document.getElementById("newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", function () {
      var input = newsletter.querySelector('input[type="email"]');
      if (input) input.setAttribute("autocomplete", "email");
    });
  }

  /* If a page is opened with a hash, make sure the target can
     receive focus for keyboard and screen-reader users. */
  if (window.location.hash && window.location.hash.length > 1) {
    var target = document.getElementById(window.location.hash.slice(1));
    if (target && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  }

  window.LS = window.LS || {};
  window.LS.page = {
    name: document.body.getAttribute("data-page") || "home",
    root: document.body.getAttribute("data-root") || "./"
  };
})();
