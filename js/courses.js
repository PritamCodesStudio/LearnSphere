/* =========================================================
   LearnSphere Academy — Course cards, catalogue & enrollment
   ========================================================= */
(function () {
  "use strict";

  var util = LS.util;
  var store = LS.store;
  var icon = LS.icons.svg;
  var data = window.LS_DATA;

  if (!data) return;

  /* ---------- Helpers ---------- */
  function discount(course) {
    if (!course.originalPrice || course.originalPrice <= course.price) return 0;
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  }

  function instructorOf(course) {
    return data.instructorForCourse(course.slug);
  }

  function enrolled(slug) {
    return !!store.enrollment(slug);
  }

  function saved(slug) {
    return store.isSaved(slug);
  }

  function courseCard(course, index) {
    var teacher = instructorOf(course);
    var isEnrolled = enrolled(course.slug);
    var isSaved = saved(course.slug);
    var delay = index == null ? 0 : Math.min(3, index % 4);

    return (
      '<article class="course-card reveal" data-course="' +
      util.escapeHTML(course.slug) +
      '" data-delay="' +
      delay +
      '">' +
      '<div class="course-card__media' +
      (course.image ? " has-photo" : "") +
      '">' +
      util.coursePhoto(course, "course-card__photo") +
      '<div class="course-card__top">' +
      '<span class="course-card__cat">' +
      util.escapeHTML(course.category) +
      "</span>" +
      '<div class="course-card__tools">' +
      '<button class="icon-btn icon-btn--glass' +
      (isSaved ? " is-active" : "") +
      '" type="button" data-save="' +
      util.escapeHTML(course.slug) +
      '" aria-label="' +
      (isSaved ? "Remove " : "Save ") +
      util.escapeHTML(course.title) +
      (isSaved ? " from saved courses" : " to saved courses") +
      '" aria-pressed="' +
      (isSaved ? "true" : "false") +
      '">' +
      icon("bookmark") +
      "</button>" +
      '<button class="icon-btn icon-btn--glass" type="button" data-quickview="' +
      util.escapeHTML(course.slug) +
      '" aria-label="Quick view: ' +
      util.escapeHTML(course.title) +
      '" aria-haspopup="dialog">' +
      icon("eye") +
      "</button>" +
      "</div></div>" +
      icon(course.icon, "course-card__glyph") +
      '<span class="course-card__code">' +
      util.escapeHTML(course.code) +
      "</span>" +
      "</div>" +
      '<div class="course-card__body">' +
      '<div class="course-card__meta-top">' +
      '<span class="badge badge--neutral">' +
      util.escapeHTML(course.level) +
      "</span>" +
      '<span class="course-rating">' +
      icon("star", "icon--fill") +
      course.rating.toFixed(1) +
      " (" +
      util.compact(course.reviewCount) +
      ")</span>" +
      "</div>" +
      '<h3 class="course-card__title"><a href="' +
      util.courseUrl(course.slug) +
      '">' +
      util.escapeHTML(course.title) +
      "</a></h3>" +
      '<p class="course-card__desc">' +
      util.escapeHTML(course.short) +
      "</p>" +
      (teacher
        ? '<div class="course-card__instructor"><img src="' +
          util.image(teacher.image) +
          '" alt="" width="22" height="22" loading="lazy"><span>By <strong>' +
          util.escapeHTML(teacher.name) +
          "</strong></span></div>"
        : "") +
      '<div class="course-card__meta">' +
      "<span>" +
      icon("clock") +
      util.escapeHTML(course.duration) +
      "</span>" +
      "<span>" +
      icon("book-open") +
      course.lessons +
      " lessons</span>" +
      "<span>" +
      icon("bar-chart") +
      util.escapeHTML(course.level) +
      "</span>" +
      "</div></div>" +
      '<div class="course-card__footer">' +
      '<div class="course-price"><strong>' +
      util.formatPrice(course.price) +
      "</strong><s>" +
      util.formatPrice(course.originalPrice) +
      "</s></div>" +
      '<div class="course-card__actions">' +
      '<a class="btn btn--ghost btn--sm" href="' +
      util.courseUrl(course.slug) +
      '">View details</a>' +
      '<button class="btn btn--primary btn--sm" type="button" data-enroll="' +
      util.escapeHTML(course.slug) +
      '" data-enrolled="' +
      (isEnrolled ? "true" : "false") +
      '">' +
      (isEnrolled ? icon("check") + "Enrolled" : "Enroll now") +
      "</button>" +
      "</div></div></article>"
    );
  }

  function renderInto(container, list) {
    if (!container) return;
    if (!list.length) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = list.map(courseCard).join("");
    if (window.LS.animations) window.LS.animations.refresh();
  }

  function updateButtons(slug) {
    var isEnrolled = enrolled(slug);
    Array.prototype.forEach.call(document.querySelectorAll('[data-enroll="' + slug + '"]'), function (button) {
      button.setAttribute("data-enrolled", isEnrolled ? "true" : "false");
      if (isEnrolled) {
        button.innerHTML = icon("check") + "Enrolled";
      } else {
        button.textContent = "Enroll now";
      }
    });
    var isSaved = saved(slug);
    Array.prototype.forEach.call(document.querySelectorAll('[data-save="' + slug + '"]'), function (button) {
      button.classList.toggle("is-active", isSaved);
      button.setAttribute("aria-pressed", isSaved ? "true" : "false");
      var course = data.bySlug(slug);
      if (!course) return;
      /* Icon-only buttons need an explicit label. Buttons that already show
         text ("Save course", "Saved") take their name from that text, so an
         aria-label would only clash with it. */
      if (button.textContent.trim() === "") {
        button.setAttribute(
          "aria-label",
          (isSaved ? "Remove " : "Save ") +
            course.title +
            (isSaved ? " from saved courses" : " to saved courses")
        );
      } else {
        button.removeAttribute("aria-label");
      }
    });
  }

  /* ---------- Quick view dialog ---------- */
  var modal = null;
  var modalTrigger = null;

  function buildModal() {
    if (modal) return modal;
    modal = document.createElement("dialog");
    modal.className = "course-modal";
    modal.id = "course-modal";
    modal.setAttribute("aria-labelledby", "course-modal-title");
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) modal.close();
      var close = event.target.closest("[data-modal-close]");
      if (close) modal.close();
    });
    modal.addEventListener("close", function () {
      if (modalTrigger && document.contains(modalTrigger)) modalTrigger.focus();
      modalTrigger = null;
    });
    return modal;
  }

  function openQuickView(slug, trigger) {
    var course = data.bySlug(slug);
    if (!course) return;
    var teacher = instructorOf(course);
    var isSaved = saved(slug);
    var isEnrolled = enrolled(slug);
    var dialog = buildModal();
    modalTrigger = trigger || null;

    dialog.innerHTML =
      '<div class="modal-head">' +
      "<div><h2 id=\"course-modal-title\">" +
      util.escapeHTML(course.title) +
      "</h2><p>" +
      util.escapeHTML(course.category) +
      " · " +
      course.lessons +
      " lessons · " +
      util.escapeHTML(course.duration) +
      "</p></div>" +
      '<button class="icon-btn icon-btn--bordered" type="button" data-modal-close aria-label="Close quick view">' +
      icon("close") +
      "</button></div>" +
      '<div class="modal-body">' +
      '<div class="modal-banner' +
      (course.image ? " has-photo" : "") +
      '">' +
      util.coursePhoto(course, "modal-banner__photo") +
      "<div><div class=\"modal-banner__title\">" +
      util.escapeHTML(course.level) +
      " · " +
      util.escapeHTML(course.category) +
      "</div>" +
      '<div class="modal-banner__meta"><span>' +
      icon("star", "icon--fill") +
      " " +
      course.rating.toFixed(1) +
      " rating</span><span>" +
      icon("users") +
      " " +
      util.formatNumber(course.students) +
      " learners</span><span>" +
      icon("award") +
      " Certificate track</span></div></div>" +
      icon(course.icon) +
      "</div>" +
      "<h3>About this course</h3><p>" +
      util.escapeHTML(course.overview) +
      "</p>" +
      "<h3>What you will learn</h3>" +
      '<ul class="modal-outcomes">' +
      course.outcomes
        .slice(0, 4)
        .map(function (outcome) {
          return "<li>" + icon("check") + util.escapeHTML(outcome) + "</li>";
        })
        .join("") +
      "</ul>" +
      (teacher
        ? "<h3>Your instructor</h3><p><strong>" +
          util.escapeHTML(teacher.name) +
          "</strong> — " +
          util.escapeHTML(teacher.role) +
          ". " +
          util.escapeHTML(teacher.bio) +
          "</p>"
        : "") +
      "</div>" +
      '<div class="modal-foot">' +
      '<div class="modal-price"><strong>' +
      util.formatPrice(course.price) +
      "</strong><s>" +
      util.formatPrice(course.originalPrice) +
      "</s></div>" +
      '<div class="modal-foot__actions">' +
      '<button class="btn btn--secondary btn--sm' +
      (isSaved ? " is-saved" : "") +
      '" type="button" data-save="' +
      course.slug +
      '" aria-pressed="' +
      (isSaved ? "true" : "false") +
      '">' +
      icon("bookmark") +
      "<span>" +
      (isSaved ? "Saved" : "Save") +
      "</span></button>" +
      '<a class="btn btn--secondary btn--sm" href="' +
      util.courseUrl(slug) +
      '">Full details</a>' +
      '<button class="btn btn--primary btn--sm" type="button" data-enroll="' +
      course.slug +
      '">' +
      (isEnrolled ? icon("check") + "Enrolled" : "Enroll now") +
      "</button>" +
      "</div></div>";

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    var closeBtn = dialog.querySelector("[data-modal-close]");
    if (closeBtn) window.setTimeout(function () { closeBtn.focus(); }, 40);
  }

  /* ---------- Global course actions ---------- */
  document.addEventListener("click", function (event) {
    var enrollBtn = event.target.closest("[data-enroll]");
    if (enrollBtn) {
      event.preventDefault();
      var enrollSlug = enrollBtn.getAttribute("data-enroll");
      var enrollCourse = data.bySlug(enrollSlug);
      if (!enrollCourse) return;
      var result = store.enroll(enrollSlug, enrollCourse.lessons);
      if (result.created) {
        store.logActivity("enroll", "Enrolled in " + enrollCourse.title, enrollSlug);
        LS.toast(
          "Added to your dashboard. This is a demo enrollment — no payment was taken.",
          "success",
          "Enrollment saved"
        );
      } else {
        LS.toast(
          "This course is already in your dashboard. Sign in or open the dashboard to continue.",
          "info",
          "Already enrolled"
        );
      }
      updateButtons(enrollSlug);
      document.dispatchEvent(
        new CustomEvent("ls:enrolled", { detail: { slug: enrollSlug, created: result.created } })
      );
      return;
    }

    var saveBtn = event.target.closest("[data-save]");
    if (saveBtn) {
      event.preventDefault();
      var saveSlug = saveBtn.getAttribute("data-save");
      var saveCourse = data.bySlug(saveSlug);
      if (!saveCourse) return;
      var saveResult = store.toggleSaved(saveSlug);
      updateButtons(saveSlug);
      if (saveResult.active) {
        store.logActivity("save", "Saved " + saveCourse.title, saveSlug);
        LS.toast("Find it under Saved courses in your dashboard.", "success", "Course saved");
      } else {
        LS.toast("Removed from your saved courses.", "info", "Course removed");
      }
      if (saveBtn.classList.contains("btn")) {
        var label = saveBtn.querySelector("span");
        if (label) label.textContent = saveResult.active ? "Saved" : "Save";
      }
      document.dispatchEvent(
        new CustomEvent("ls:saved", { detail: { slug: saveSlug, saved: saveResult.active } })
      );
      return;
    }

    var quickBtn = event.target.closest("[data-quickview]");
    if (quickBtn) {
      event.preventDefault();
      openQuickView(quickBtn.getAttribute("data-quickview"), quickBtn);
    }
  });

  /* ---------- Featured courses (home) ---------- */
  function initFeatured() {
    var container = document.getElementById("featured-courses");
    if (!container) return;
    var featured = data.courses.filter(function (course) {
      return course.featured;
    });
    renderInto(container, featured.slice(0, 6));
  }

  /* ---------- Catalogue (courses page) ---------- */
  function initCatalog() {
    var grid = document.getElementById("course-grid");
    if (!grid) return;

    var searchInput = document.getElementById("course-search");
    var sortSelect = document.getElementById("course-sort");
    var countEl = document.getElementById("course-count");
    var emptyEl = document.getElementById("course-empty");
    var filters = document.getElementById("catalog-filters");
    var filterToggle = document.querySelector(".filters-toggle");
    var viewButtons = Array.prototype.slice.call(document.querySelectorAll("[data-view]"));
    var clearButtons = Array.prototype.slice.call(document.querySelectorAll("[data-clear-filters]"));
    var view = "grid";

    var savedView = null;
    try {
      savedView = window.sessionStorage.getItem("learnsphere.view");
    } catch (error) {
      savedView = null;
    }
    if (savedView === "list") view = "list";

    function selected(name) {
      var checked = document.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : "all";
    }

    function setView(next) {
      view = next;
      grid.classList.toggle("is-list", view === "list");
      viewButtons.forEach(function (button) {
        var active = button.getAttribute("data-view") === view;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      try {
        window.sessionStorage.setItem("learnsphere.view", view);
      } catch (error) {
        /* no-op */
      }
      if (window.LS.animations) window.LS.animations.refresh();
    }

    function matchesPrice(course, bucket) {
      if (bucket === "under-1000") return course.price < 1000;
      if (bucket === "1000-1999") return course.price >= 1000 && course.price <= 1999;
      if (bucket === "2000-plus") return course.price >= 2000;
      return true;
    }

    function filterAndRender() {
      var query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      var category = selected("category");
      var level = selected("level");
      var price = selected("price");
      var sort = sortSelect ? sortSelect.value : "popularity";

      var list = data.courses.filter(function (course) {
        var haystack = (course.title + " " + course.description + " " + course.category + " " + course.level).toLowerCase();
        var teacher = instructorOf(course);
        if (teacher) haystack += " " + teacher.name.toLowerCase();
        var matchesQuery = !query || haystack.indexOf(query) > -1;
        var matchesCategory = category === "all" || course.category === category;
        var matchesLevel = level === "all" || course.level.toLowerCase() === level;
        var matchesPriceBucket = matchesPrice(course, price);
        return matchesQuery && matchesCategory && matchesLevel && matchesPriceBucket;
      });

      list.sort(function (a, b) {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "title") return a.title.localeCompare(b.title);
        return b.students - a.students;
      });

      grid.innerHTML = list
        .map(function (course, index) {
          return courseCard(course, index);
        })
        .join("");
      grid.hidden = list.length === 0;
      if (emptyEl) emptyEl.hidden = list.length !== 0;

      if (countEl) {
        countEl.innerHTML =
          "Showing <strong>" +
          list.length +
          "</strong> of " +
          data.courses.length +
          " courses" +
          (query ? ' for “<strong>' + util.escapeHTML(searchInput.value.trim()) + "</strong>”" : "");
      }

      if (window.LS.animations) window.LS.animations.refresh();

      try {
        var params = new URLSearchParams(window.location.search);
        if (query) params.set("q", searchInput.value.trim());
        else params.delete("q");
        if (category !== "all") params.set("category", category);
        else params.delete("category");
        var next = params.toString();
        window.history.replaceState(null, "", window.location.pathname + (next ? "?" + next : ""));
      } catch (error) {
        /* history may be unavailable */
      }
    }

    var debounced = util.debounce(filterAndRender, 150);

    if (searchInput) {
      searchInput.addEventListener("input", debounced);
    }

    Array.prototype.forEach.call(
      document.querySelectorAll('.filters input[type="radio"]'),
      function (input) {
        input.addEventListener("change", filterAndRender);
      }
    );

    if (sortSelect) sortSelect.addEventListener("change", filterAndRender);

    viewButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setView(button.getAttribute("data-view"));
      });
    });

    if (filterToggle && filters) {
      filterToggle.addEventListener("click", function () {
        var open = filters.classList.toggle("is-open");
        filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    function clearAll() {
      var allRadio = document.querySelector('input[name="category"][value="all"]');
      if (allRadio) allRadio.checked = true;
      var allLevel = document.querySelector('input[name="level"][value="all"]');
      if (allLevel) allLevel.checked = true;
      var allPrice = document.querySelector('input[name="price"][value="all"]');
      if (allPrice) allPrice.checked = true;
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "popularity";
      filterAndRender();
      if (searchInput) searchInput.focus();
    }

    clearButtons.forEach(function (button) {
      button.addEventListener("click", clearAll);
    });

    var initialQuery = util.param("q") || "";
    var initialCategory = util.param("category") || "all";
    if (searchInput) searchInput.value = initialQuery;
    if (initialCategory !== "all") {
      var categoryInput = document.querySelector(
        'input[name="category"][value="' +
          initialCategory.replace(/"/g, '\\"') +
          '"]'
      );
      if (categoryInput) categoryInput.checked = true;
    }

    setView(view);
    filterAndRender();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFeatured();
    initCatalog();
  });

  window.LS.courses = {
    card: courseCard,
    render: renderInto,
    updateButtons: updateButtons,
    openQuickView: openQuickView
  };
})();
