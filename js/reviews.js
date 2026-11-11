/* =========================================================
   LearnSphere Academy — Reviews page
   Combines sample reviews with any locally stored demo reviews.
   Nothing here is verified feedback from real learners.
   ========================================================= */
(function () {
  "use strict";

  var util = LS.util;
  var store = LS.store;
  var icon = LS.icons.svg;
  var data = window.LS_DATA;
  var grid = document.getElementById("review-grid");
  if (!grid || !data) return;

  var scoreEl = document.getElementById("review-score");
  var starsEl = document.getElementById("review-stars");
  var totalEl = document.getElementById("review-total");
  var barsEl = document.getElementById("rating-bars");
  var countEl = document.getElementById("review-count");
  var emptyEl = document.getElementById("review-empty");
  var courseSelect = document.getElementById("review-course-filter");
  var ratingChips = Array.prototype.slice.call(document.querySelectorAll("[data-review-rating]"));
  var rating = "all";

  function formatDate(value) {
    var date = new Date(value);
    if (isNaN(date.getTime())) return "Sample date";
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function combinedReviews() {
    var local = store.reviews().map(function (review) {
      return {
        id: review.id,
        name: review.name || "Demo visitor",
        initials: review.initials || util.initials(review.name),
        course: review.course,
        rating: Number(review.rating) || 5,
        title: review.title || "Demo review",
        text: review.text || "",
        date: review.date || review.createdAt,
        local: true
      };
    });
    var sample = data.reviews.map(function (review) {
      return {
        id: review.id,
        name: review.name,
        initials: review.initials,
        course: review.course,
        rating: review.rating,
        title: review.title,
        text: review.text,
        date: review.date,
        local: false
      };
    });
    return local.concat(sample);
  }

  function average(list) {
    if (!list.length) return 0;
    var total = list.reduce(function (sum, review) {
      return sum + review.rating;
    }, 0);
    return total / list.length;
  }

  function distribution(list) {
    var counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(function (review) {
      var key = Math.max(1, Math.min(5, Math.round(review.rating)));
      counts[key] += 1;
    });
    return counts;
  }

  function renderSummary() {
    var list = combinedReviews();
    var avg = average(list);
    if (scoreEl) scoreEl.textContent = avg.toFixed(1);
    if (starsEl) starsEl.innerHTML = LS.icons.stars(avg);
    if (totalEl) {
      totalEl.innerHTML =
        "out of 5 · <strong>" + list.length + "</strong> sample review" + (list.length === 1 ? "" : "s");
    }

    if (barsEl) {
      var counts = distribution(list);
      var rows = "";
      for (var star = 5; star >= 1; star--) {
        var percent = list.length ? Math.round((counts[star] / list.length) * 100) : 0;
        rows +=
          '<div class="rating-bar"><span>' + star + " star</span>" +
          '<div class="rating-bar__track"><div class="rating-bar__fill" style="width:' + percent + '%"></div></div>' +
          "<span>" + percent + "%</span></div>";
      }
      barsEl.innerHTML = rows;
    }

    if (courseSelect && !courseSelect.options.length) {
      courseSelect.innerHTML =
        '<option value="all">All courses</option>' +
        data.courses
          .map(function (course) {
            return '<option value="' + util.escapeHTML(course.slug) + '">' + util.escapeHTML(course.title) + "</option>";
          })
          .join("");
      var fromQuery = util.param("course");
      if (fromQuery) {
        Array.prototype.forEach.call(courseSelect.options, function (option) {
          if (option.value === fromQuery) courseSelect.value = fromQuery;
        });
      }
    }
  }

  function reviewCard(review) {
    return (
      '<article class="review-card reveal">' +
      '<div class="review-card__head">' +
      LS.icons.stars(review.rating) +
      '<span class="badge badge--neutral">' + (review.local ? "Your demo review" : "Sample review") + "</span>" +
      "</div>" +
      '<h3 class="review-card__title">' + util.escapeHTML(review.title) + "</h3>" +
      '<p class="review-card__text">' + util.escapeHTML(review.text) + "</p>" +
      '<div class="review-card__foot">' +
      '<span class="review-card__avatar" aria-hidden="true">' + util.escapeHTML(review.initials) + "</span>" +
      "<div><div class=\"review-card__name\">" + util.escapeHTML(review.name) + "</div>" +
      '<div class="review-card__meta">' + util.escapeHTML(data.courseTitle(review.course)) + " · Demo content</div></div>" +
      '<time class="review-card__date" datetime="' + util.escapeHTML(String(review.date || "")) + '">' +
      util.escapeHTML(formatDate(review.date)) +
      "</time></div></article>"
    );
  }

  function renderList() {
    var list = combinedReviews();
    if (courseSelect && courseSelect.value && courseSelect.value !== "all") {
      list = list.filter(function (review) {
        return review.course === courseSelect.value;
      });
    }
    if (rating !== "all") {
      if (rating === "3") {
        list = list.filter(function (review) {
          return review.rating <= 3;
        });
      } else {
        list = list.filter(function (review) {
          return review.rating === Number(rating);
        });
      }
    }

    list.sort(function (a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    grid.innerHTML = list.map(reviewCard).join("");
    grid.hidden = list.length === 0;
    if (emptyEl) emptyEl.hidden = list.length !== 0;
    if (countEl) {
      countEl.innerHTML =
        "Showing <strong>" + list.length + "</strong> of " + combinedReviews().length + " sample reviews";
    }
    if (window.LS.animations) window.LS.animations.refresh();
  }

  ratingChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      rating = chip.getAttribute("data-review-rating");
      ratingChips.forEach(function (other) {
        var active = other === chip;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", active ? "true" : "false");
      });
      renderList();
    });
  });

  if (courseSelect) {
    courseSelect.addEventListener("change", renderList);
  }

  /* ---------- Review form ---------- */
  function initForm() {
    var form = document.getElementById("review-form");
    if (!form) return;
    var nameInput = form.querySelector("#review-name");
    var courseInput = form.querySelector("#review-course");
    var titleInput = form.querySelector("#review-title");
    var textInput = form.querySelector("#review-text");
    var success = document.getElementById("review-success");
    var button = form.querySelector('button[type="submit"]');
    var session = store.session();

    if (session && nameInput) nameInput.value = session.name || "";

    if (courseInput) {
      courseInput.innerHTML =
        '<option value="">Choose a course</option>' +
        data.courses
          .map(function (course) {
            return '<option value="' + util.escapeHTML(course.slug) + '">' + util.escapeHTML(course.title) + "</option>";
          })
          .join("");
      var fromQuery = util.param("course");
      if (fromQuery) {
        Array.prototype.forEach.call(courseInput.options, function (option) {
          if (option.value === fromQuery) courseInput.value = fromQuery;
        });
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      Array.prototype.forEach.call(form.querySelectorAll(".has-error"), function (field) {
        field.classList.remove("has-error");
      });
      Array.prototype.forEach.call(form.querySelectorAll("[aria-invalid]"), function (input) {
        input.removeAttribute("aria-invalid");
      });
      if (success) success.classList.remove("is-visible");

      var ratingInput = form.querySelector('input[name="rating"]:checked');
      var ok = true;

      function fail(input, message, field) {
        var target = field || (input ? input.closest(".form-field") : null);
        if (target) {
          target.classList.add("has-error");
          var error = target.querySelector(".field-error");
          if (error) {
            error.innerHTML = icon("alert") + "<span></span>";
            error.querySelector("span").textContent = message;
          }
        }
        if (input) input.setAttribute("aria-invalid", "true");
        ok = false;
      }

      if (!ratingInput) fail(null, "Choose a star rating.", form.querySelector("#review-rating-field"));
      if (!nameInput || !nameInput.value.trim()) fail(nameInput, "Add your name or a display name.");
      if (!courseInput || !courseInput.value) fail(courseInput, "Choose a course.");
      if (!titleInput || !titleInput.value.trim()) fail(titleInput, "Add a short review title.");
      if (!textInput || textInput.value.trim().length < 20) {
        fail(textInput, "Write at least 20 characters so the review is useful.");
      }

      if (!ok) {
        var first = form.querySelector(".has-error .input, .has-error .select, .has-error .textarea");
        if (first) first.focus();
        return;
      }

      var chosenCourse = data.bySlug(courseInput.value);
      if (!chosenCourse) return;

      var review = {
        id: util.uid(),
        name: nameInput.value.trim(),
        initials: util.initials(nameInput.value.trim()),
        course: courseInput.value,
        rating: Number(ratingInput.value),
        title: titleInput.value.trim(),
        text: textInput.value.trim(),
        date: new Date().toISOString(),
        demo: true
      };

      store.addReview(review);
      store.logActivity("review", "Wrote a demo review for " + chosenCourse.title, chosenCourse.slug);
      form.reset();
      if (session && nameInput) nameInput.value = session.name || "";
      if (success) {
        success.innerHTML =
          icon("check-circle") +
          "<span>Your demo review was saved in this browser. It is not verified feedback and appears only for you.</span>";
        success.classList.add("is-visible");
      }
      renderSummary();
      renderList();
      LS.toast("Review saved locally. It is sample content, not a verified purchase.", "success", "Demo review added");
      document.dispatchEvent(new CustomEvent("ls:review-added", { detail: { review: review } }));
    });
  }

  renderSummary();
  renderList();
  initForm();

  document.addEventListener("ls:review-added", function () {
    renderSummary();
    renderList();
  });
})();
