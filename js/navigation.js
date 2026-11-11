/* =========================================================
   LearnSphere Academy — Navigation behaviour
   ========================================================= */
(function () {
  "use strict";

  var header = document.getElementById("site-header-bar");
  var mobileMenu = document.getElementById("mobile-menu");
  var backdrop = document.getElementById("menu-backdrop");
  var menuToggle = document.querySelector(".menu-toggle");
  var closeButton = document.querySelector(".menu-close");
  var backToTop = document.getElementById("back-to-top");
  var lastFocused = null;

  /* ---------- Header scrolled state ---------- */
  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 520);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  function openMenu() {
    if (!mobileMenu || !backdrop) return;
    lastFocused = document.activeElement;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    window.requestAnimationFrame(function () {
      backdrop.classList.add("is-visible");
    });
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    window.setTimeout(function () {
      if (closeButton) closeButton.focus();
    }, 80);
  }

  function closeMenu() {
    if (!mobileMenu || !backdrop) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    backdrop.classList.remove("is-visible");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    window.setTimeout(function () {
      if (!mobileMenu.classList.contains("is-open")) backdrop.hidden = true;
    }, 300);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (mobileMenu && mobileMenu.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
  }

  if (closeButton) closeButton.addEventListener("click", closeMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);

  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        document.body.style.overflow = "";
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileMenu && mobileMenu.classList.contains("is-open")) {
      closeMenu();
    }

    if (
      event.key === "Tab" &&
      mobileMenu &&
      mobileMenu.classList.contains("is-open") &&
      mobileMenu
    ) {
      var focusable = mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1120 && mobileMenu && mobileMenu.classList.contains("is-open")) {
      closeMenu();
    }
  });

  /* ---------- Back to top ---------- */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- Smooth same-page anchors ---------- */
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute("href");
    if (!hash || hash === "#") return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    event.preventDefault();
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    window.setTimeout(function () {
      target.focus({ preventScroll: true });
    }, reduce ? 0 : 450);
    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", hash);
    }
  });

  /* ---------- Mark current page for course filters passed via URL ---------- */
  window.LS = window.LS || {};
  window.LS.nav = { open: openMenu, close: closeMenu };
})();
