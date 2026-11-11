/* =========================================================
   LearnSphere Academy — Shared header, footer, icons & toasts
   Injected on every page so navigation stays consistent.
   ========================================================= */
(function () {
  "use strict";

  LS.icons.inject();

  var util = LS.util;
  var store = LS.store;
  var icon = LS.icons.svg;
  var page = document.body.getAttribute("data-page") || "home";
  var year = new Date().getFullYear();

  var navItems = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "about", label: "About", href: "pages/about.html" },
    { key: "courses", label: "Courses", href: "pages/courses.html" },
    { key: "instructors", label: "Instructors", href: "pages/instructors.html" },
    { key: "experience", label: "Experience", href: "pages/experience.html" },
    { key: "reviews", label: "Reviews", href: "pages/reviews.html" },
    { key: "contact", label: "Contact", href: "pages/contact.html" }
  ];

  function activeFor(key) {
    if (page === key) return true;
    if (key === "courses" && page === "course-details") return true;
    return false;
  }

  var session = store.session();

  function authActions(mobile) {
    if (session) {
      return (
        '<a class="account-chip" href="' +
        util.page("pages/dashboard.html") +
        '" aria-label="Open your dashboard">' +
        '<span class="account-chip__avatar">' +
        util.initials(session.name) +
        "</span>" +
        '<span class="account-chip__label">Dashboard</span>' +
        "</a>"
      );
    }
    return (
      '<a class="btn btn--ghost btn--sm header-login" href="' +
      util.page("pages/login.html") +
      '">Login</a>' +
      '<a class="btn btn--primary btn--sm" href="' +
      util.page("pages/signup.html") +
      '">Sign Up</a>'
    );
  }

  function brandMark() {
    return (
      '<span class="brand-mark" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">' +
      '<circle cx="12" cy="12" r="4.1"/>' +
      '<ellipse cx="12" cy="12" rx="9.6" ry="4.4" transform="rotate(-24 12 12)"/>' +
      '<ellipse cx="12" cy="12" rx="9.6" ry="4.4" transform="rotate(58 12 12)" opacity=".55"/>' +
      '<circle cx="20.2" cy="7.4" r="1.4" fill="currentColor" stroke="none"/>' +
      "</svg></span>"
    );
  }

  function brand() {
    return (
      '<a class="brand" href="' +
      util.page("index.html") +
      '">' +
      brandMark() +
      '<span class="brand-name">LearnSphere<span>Academy</span></span>' +
      "</a>"
    );
  }

  var navHtml = navItems
    .map(function (item) {
      return (
        '<li><a class="nav-link' +
        (activeFor(item.key) ? " is-active" : "") +
        '" href="' +
        util.page(item.href) +
        '"' +
        (activeFor(item.key) ? ' aria-current="page"' : "") +
        ">" +
        item.label +
        "</a></li>"
      );
    })
    .join("");

  var mobileNavHtml = navItems
    .map(function (item) {
      return (
        '<a class="' +
        (activeFor(item.key) ? "is-active" : "") +
        '" href="' +
        util.page(item.href) +
        '"' +
        (activeFor(item.key) ? ' aria-current="page"' : "") +
        ">" +
        item.label +
        " " +
        icon("chevron-right") +
        "</a>"
      );
    })
    .join("");

  var header =
    '<header class="site-header" id="site-header-bar">' +
    '<div class="container header-inner">' +
    brand() +
    '<nav class="primary-nav" aria-label="Primary navigation"><ul class="nav-list">' +
    navHtml +
    "</ul></nav>" +
    '<div class="header-actions">' +
    '<button class="icon-btn theme-toggle" type="button" aria-pressed="false" aria-label="Switch to dark theme" title="Switch to dark theme">' +
    icon("sun", "icon--sun") +
    icon("moon", "icon--moon") +
    "</button>" +
    authActions(false) +
    '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">' +
    icon("menu") +
    "</button>" +
    "</div></div></header>" +
    '<div class="menu-backdrop" id="menu-backdrop" hidden></div>' +
    '<aside class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden="true">' +
    '<div class="mobile-menu__head">' +
    brand() +
    '<button class="icon-btn menu-close" type="button" aria-label="Close menu">' +
    icon("close") +
    "</button></div>" +
    '<nav class="mobile-menu__nav" aria-label="Mobile primary navigation">' +
    mobileNavHtml +
    "</nav>" +
    '<div class="mobile-menu__actions">' +
    (session
      ? '<a class="btn btn--primary btn--block" href="' +
        util.page("pages/dashboard.html") +
        '">Go to dashboard ' +
        icon("arrow-right", "icon--arrow") +
        "</a>"
      : '<a class="btn btn--primary btn--block" href="' +
        util.page("pages/signup.html") +
        '">Create free account ' +
        icon("arrow-right", "icon--arrow") +
        "</a>" +
        '<a class="btn btn--secondary btn--block" href="' +
        util.page("pages/login.html") +
        '">Log in</a>') +
    "</div>" +
    '<div class="mobile-menu__foot">Questions? Write to <a href="mailto:hello@learnsphere.example" style="color:var(--color-text);text-decoration:underline;text-underline-offset:2px">hello@learnsphere.example</a><br><span style="opacity:.7">Demo site · sample content</span></div>' +
    "</aside>";

  var placeholderHeader = document.getElementById("site-header");
  if (placeholderHeader) placeholderHeader.outerHTML = header;
  else if (!document.getElementById("site-header-bar")) document.body.insertAdjacentHTML("afterbegin", header);

  var popularSlugs = ["web-development", "python-programming", "artificial-intelligence", "dsa"];
  var courseLinks = "";
  if (window.LS_DATA) {
    popularSlugs.forEach(function (slug) {
      var course = window.LS_DATA.bySlug(slug);
      if (course) {
        courseLinks +=
          '<li><a href="' +
          util.courseUrl(slug) +
          '">' +
          util.escapeHTML(course.title) +
          "</a></li>";
      }
    });
  }

  var footer =
    '<footer class="site-footer">' +
    '<div class="container">' +
    '<div class="footer-grid">' +
    '<div class="footer-brand">' +
    brand() +
    "<p>An independent learning space for people who want to understand deeply, practise honestly and grow at a thoughtful pace.</p>" +
    '<form class="footer-newsletter" id="newsletter-form" novalidate>' +
    '<label for="newsletter-email">Occasional learning notes</label>' +
    '<div class="footer-newsletter__row">' +
    '<input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" aria-label="Email address for learning notes" required>' +
    '<button class="btn btn--primary btn--sm" type="submit">' +
    icon("send") +
    "<span>Join</span></button>" +
    "</div>" +
    '<p class="footer-newsletter__note">Demo form. Nothing is sent or subscribed.</p>' +
    "</form></div>" +
    '<div class="footer-col"><h2>Explore</h2><ul class="footer-links">' +
    '<li><a href="' +
    util.page("pages/about.html") +
    '">About us</a></li>' +
    '<li><a href="' +
    util.page("pages/courses.html") +
    '">All courses</a></li>' +
    '<li><a href="' +
    util.page("pages/instructors.html") +
    '">Instructors</a></li>' +
    '<li><a href="' +
    util.page("pages/experience.html") +
    '">Learning experience</a></li>' +
    '<li><a href="' +
    util.page("pages/reviews.html") +
    '">Student reviews</a></li>' +
    '<li><a href="' +
    util.page("pages/dashboard.html") +
    '">Student dashboard</a></li>' +
    "</ul></div>" +
    '<div class="footer-col"><h2>Popular courses</h2><ul class="footer-links">' +
    courseLinks +
    '<li><a href="' +
    util.page("pages/courses.html") +
    '">Browse every course</a></li>' +
    "</ul></div>" +
    '<div class="footer-col"><h2>Contact</h2><ul class="footer-contact">' +
    '<li><span>' +
    icon("mail") +
    '</span><a href="mailto:hello@learnsphere.example">hello@learnsphere.example</a></li>' +
    '<li><span>' +
    icon("phone") +
    '</span><a href="tel:+910000000000">+91 00000 00000</a></li>' +
    '<li><span>' +
    icon("map-pin") +
    "</span><span>Learning Hub, 24 Knowledge Lane,<br>Bengaluru, India <em>(demo address)</em></span></li>" +
    '<li><span>' +
    icon("clock") +
    "</span><span>Mon–Sat, 9:00–18:00 IST</span></li>" +
    "</ul>" +
    '<div class="footer-socials">' +
    '<a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (placeholder link)">' +
    icon("linkedin") +
    "</a>" +
    '<a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter (placeholder link)">' +
    icon("twitter") +
    "</a>" +
    '<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (placeholder link)">' +
    icon("instagram") +
    "</a>" +
    '<a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube (placeholder link)">' +
    icon("youtube") +
    "</a>" +
    "</div></div></div>" +
    '<div class="footer-bottom">' +
    "<p>© " +
    year +
    ' LearnSphere Academy. Demonstration project.</p>' +
    '<div class="footer-bottom__links">' +
    '<span class="footer-demo">' +
    icon("info") +
    " Sample data · frontend only</span>" +
    '<a href="' +
    util.page("pages/privacy-policy.html") +
    '">Privacy Policy</a>' +
    '<a href="' +
    util.page("pages/terms.html") +
    '">Terms &amp; Conditions</a>' +
    '<a href="' +
    util.page("pages/contact.html") +
    '">Support</a>' +
    "</div></div></div></footer>" +
    '<button class="back-to-top" id="back-to-top" type="button" aria-label="Back to top" title="Back to top">' +
    icon("arrow-up") +
    "</button>" +
    '<div class="toast-region" id="toast-region" role="status" aria-live="polite" aria-atomic="false"></div>';

  var placeholderFooter = document.getElementById("site-footer");
  if (placeholderFooter) placeholderFooter.outerHTML = footer;
  else document.body.insertAdjacentHTML("beforeend", footer);

  /* ---------- Toast API ---------- */
  var toastIcons = {
    success: "check-circle",
    error: "alert",
    info: "info",
    accent: "sparkles"
  };

  function toast(message, type, title) {
    var region = document.getElementById("toast-region");
    if (!region) return;
    var kind = toastIcons[type] ? type : "info";
    var node = document.createElement("div");
    node.className = "toast toast--" + kind;
    node.setAttribute("role", "status");
    node.innerHTML =
      '<span class="toast__icon">' +
      icon(toastIcons[kind]) +
      "</span>" +
      '<div class="toast__body"><p class="toast__title"></p><p class="toast__msg"></p></div>' +
      '<button class="toast__close" type="button" aria-label="Dismiss notification">' +
      icon("close") +
      "</button>";
    node.querySelector(".toast__title").textContent = title || (kind === "error" ? "Something to check" : "Done");
    node.querySelector(".toast__msg").textContent = message || "";
    node.querySelector(".toast__close").addEventListener("click", function () {
      dismiss(node);
    });
    region.appendChild(node);
    var timeout = window.setTimeout(function () {
      dismiss(node);
    }, kind === "error" ? 6000 : 4200);
    node.addEventListener("mouseenter", function () {
      window.clearTimeout(timeout);
    });
    return node;
  }

  function dismiss(node) {
    if (!node || node.classList.contains("is-leaving")) return;
    node.classList.add("is-leaving");
    window.setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 280);
  }

  LS.toast = toast;

  var flash = LS.store.consumeFlash();
  if (flash && flash.message) {
    window.setTimeout(function () {
      toast(flash.message, flash.type || "success");
    }, 280);
  }

  document.dispatchEvent(new CustomEvent("ls:components-ready"));
})();
