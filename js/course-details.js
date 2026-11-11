/* =========================================================
   LearnSphere Academy — Course detail page
   Reads ?slug=… and renders the full course experience.
   All course content and reviews are demonstration data.
   ========================================================= */
(function () {
  "use strict";

  var util = LS.util;
  var store = LS.store;
  var icon = LS.icons.svg;
  var data = window.LS_DATA;
  var root = document.getElementById("course-detail");
  if (!root || !data) return;

  var course = data.bySlug(util.param("slug") || "");

  /* ---------- Small helpers ---------- */
  function instructorOf() {
    return data.instructorForCourse(course.slug);
  }

  function flatLessons() {
    var list = [];
    var index = 0;
    course.modules.forEach(function (module, moduleIndex) {
      module.lessons.forEach(function (lesson) {
        list.push({
          index: index,
          moduleIndex: moduleIndex,
          title: lesson.title,
          duration: lesson.duration,
          preview: lesson.preview
        });
        index += 1;
      });
    });
    return list;
  }

  function discount() {
    if (!course.originalPrice || course.originalPrice <= course.price) return 0;
    return Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  }

  function nextFlatIndex(enrollment) {
    var completed = enrollment && Array.isArray(enrollment.completed) ? enrollment.completed : [];
    var lessons = flatLessons();
    for (var i = 0; i < lessons.length; i++) {
      if (completed.indexOf(lessons[i].index) === -1) return lessons[i].index;
    }
    return -1;
  }

  function allReviews() {
    var local = store.reviews()
      .filter(function (review) {
        return review.course === course.slug;
      })
      .map(function (review) {
        return {
          id: review.id,
          name: review.name,
          initials: review.initials || util.initials(review.name),
          rating: Number(review.rating) || 5,
          title: review.title || "Learner review",
          text: review.text,
          date: review.date || review.createdAt,
          local: true
        };
      });
    return local.concat(
      data.reviewsForCourse(course.slug).map(function (review) {
        return {
          id: review.id,
          name: review.name,
          initials: review.initials,
          rating: review.rating,
          title: review.title,
          text: review.text,
          date: review.date,
          local: false
        };
      })
    );
  }

  /* ---------- Hero / header ---------- */
  function breadcrumb() {
    return (
      '<nav class="breadcrumb" aria-label="Breadcrumb">' +
      '<a href="' + util.page("index.html") + '">Home</a>' +
      '<span class="breadcrumb__sep" aria-hidden="true">/</span>' +
      '<a href="' + util.page("pages/courses.html") + '">Courses</a>' +
      '<span class="breadcrumb__sep" aria-hidden="true">/</span>' +
      '<span aria-current="page">' + util.escapeHTML(course.title) + "</span>" +
      "</nav>"
    );
  }

  function hero() {
    var teacher = instructorOf();
    return (
      breadcrumb() +
      '<div class="detail-layout" style="margin-top:1.5rem">' +
      "<div>" +
      '<div class="course-banner' + (course.image ? " has-photo" : "") + ' reveal">' +
      util.coursePhoto(course, "course-banner__photo") +
      '<div class="course-banner__top">' +
      '<span class="course-banner__chip">' + icon("layers") + util.escapeHTML(course.category) + "</span>" +
      '<span class="course-banner__chip">' + icon("bar-chart") + util.escapeHTML(course.level) + "</span>" +
      "</div>" +
      icon(course.icon, "course-banner__glyph") +
      '<div class="course-banner__bottom">' +
      '<span class="course-banner__code">' + util.escapeHTML(course.code) + "</span>" +
      '<div class="course-banner__chips">' +
      '<span class="course-banner__chip">' + icon("star", "icon--fill") + course.rating.toFixed(1) + " rating</span>" +
      '<span class="course-banner__chip">' + icon("users") + util.compact(course.students) + " learners</span>" +
      "</div></div></div>" +
      '<h1 class="detail-title reveal">' + util.escapeHTML(course.title) + "</h1>" +
      '<p class="detail-lead reveal">' + util.escapeHTML(course.description) + "</p>" +
      '<div class="detail-meta reveal">' +
      "<span>" + icon("clock") + util.escapeHTML(course.duration) + "</span>" +
      "<span>" + icon("book-open") + course.lessons + " lessons</span>" +
      "<span>" + icon("globe") + util.escapeHTML(course.language) + "</span>" +
      "<span>" + icon("calendar") + "Updated " + util.escapeHTML(course.updated) + "</span>" +
      (teacher
        ? "<span>" + icon("user") + "Mentor: " + util.escapeHTML(teacher.name) + "</span>"
        : "") +
      "</div>" +
      '<div class="demo-note reveal">' +
      icon("info") +
      "<span>Demonstration course. Prices, ratings, learner counts, lesson videos and certificates are sample content, not real offerings.</span>" +
      "</div>" +
      '<nav class="detail-nav reveal" aria-label="Course sections">' +
      '<a href="#overview">Overview</a>' +
      '<a href="#outcomes">What you\'ll learn</a>' +
      '<a href="#curriculum">Curriculum</a>' +
      '<a href="#requirements">Requirements</a>' +
      '<a href="#mentor">Instructor</a>' +
      '<a href="#review-section">Reviews</a>' +
      "</nav>" +
      '<section class="detail-section" id="overview">' +
      '<div class="detail-section__head"><h2>About this course</h2><p>' +
      util.escapeHTML(course.short) +
      "</p></div>" +
      '<div class="detail-overview"><p>' + util.escapeHTML(course.overview) + "</p>" +
      "<p>" + util.escapeHTML(course.description) + "</p>" +
      '<div class="notice notice--accent" style="margin-top:1.1rem">' +
      icon("info") +
      "<span>This is a portfolio/demo project. No videos are hosted, no live sessions run and no certificate is issued.</span>" +
      "</div></div></section>" +
      outcomeSection() +
      curriculumSection() +
      requirementsSection() +
      mentorSection() +
      reviewSection() +
      relatedSection() +
      "</div>" +
      '<aside class="detail-aside" id="detail-aside" aria-label="Course enrollment">' +
      purchaseCard() +
      certificateCard() +
      "</aside>" +
      "</div>"
    );
  }

  function outcomeSection() {
    return (
      '<section class="detail-section" id="outcomes">' +
      '<div class="detail-section__head"><h2>What you\'ll learn</h2>' +
      "<p>Practical outcomes written for this demonstration syllabus.</p></div>" +
      '<div class="outcome-grid">' +
      course.outcomes
        .map(function (outcome) {
          return '<div class="outcome">' + icon("check") + util.escapeHTML(outcome) + "</div>";
        })
        .join("") +
      "</div></section>"
    );
  }

  function curriculumSection() {
    var totalDuration = 0;
    var flat = flatLessons();
    var completed = (store.enrollment(course.slug) || { completed: [] }).completed || [];

    return (
      '<section class="detail-section" id="curriculum">' +
      '<div class="detail-section__head"><h2>Course curriculum</h2>' +
      "<p>Click a module to preview its lessons. Sample lesson durations only.</p></div>" +
      '<div class="curriculum">' +
      '<div class="curriculum__head"><span><strong>' +
      course.modules.length +
      " modules</strong> · " +
      course.lessons +
      " lessons · " +
      util.escapeHTML(course.duration) +
      '</span><span>Demo syllabus</span></div>' +
      course.modules
        .map(function (module, moduleIndex) {
          var moduleLessons = module.lessons.length;
          var moduleStart = flat.filter(function (item) {
            return item.moduleIndex === moduleIndex;
          })[0];
          var startIndex = moduleStart ? moduleStart.index : 0;
          var open = moduleIndex === 0;
          return (
            '<div class="module' + (open ? " is-open" : "") + '" data-module="' + moduleIndex + '">' +
            '<button class="module__trigger" type="button" aria-expanded="' +
            (open ? "true" : "false") +
            '" aria-controls="module-panel-' +
            moduleIndex +
            '" data-module-toggle="' +
            moduleIndex +
            '">' +
            '<span class="module__index">' + ("0" + (moduleIndex + 1)).slice(-2) + "</span>" +
            '<span class="module__title">' + util.escapeHTML(module.title) + "</span>" +
            '<span class="module__meta"><span>' + moduleLessons + " lessons</span><span>" +
            util.escapeHTML(course.level) +
            "</span></span>" +
            '<span class="module__chevron">' + icon("chevron-down") + "</span>" +
            "</button>" +
            '<div class="module__panel" id="module-panel-' + moduleIndex + '" aria-hidden="' + (open ? "false" : "true") + '"' +
            (open ? "" : " inert") +
            "><div class=\"module__panel-inner\">" +
            module.lessons
              .map(function (lesson, lessonIndex) {
                var flatIndex = startIndex + lessonIndex;
                var isComplete = completed.indexOf(flatIndex) > -1;
                return (
                  '<div class="lesson-row' + (isComplete ? " is-complete" : "") + '" data-lesson-row="' + flatIndex + '">' +
                  '<button class="lesson-row__check" type="button" data-lesson-index="' + flatIndex + '" aria-pressed="' +
                  (isComplete ? "true" : "false") +
                  '" aria-label="' +
                  (isComplete ? "Mark lesson incomplete: " : "Mark lesson complete: ") +
                  util.escapeHTML(lesson.title) +
                  '">' + icon("check") + "</button>" +
                  '<span class="lesson-row__icon">' + icon(lesson.preview ? "play-circle" : "file") + "</span>" +
                  '<span class="lesson-row__title">' + util.escapeHTML(lesson.title) + "</span>" +
                  (lesson.preview ? '<span class="lesson-row__preview">Preview</span>' : "") +
                  '<span class="lesson-row__duration">' + util.escapeHTML(lesson.duration) + "</span>" +
                  "</div>"
                );
              })
              .join("") +
            "</div></div></div>"
          );
        })
        .join("") +
      "</div></section>"
    );
  }

  function requirementsSection() {
    return (
      '<section class="detail-section" id="requirements">' +
      '<div class="detail-section__head"><h2>Requirements</h2>' +
      "<p>Nothing here is enforced — this is a frontend preview.</p></div>" +
      '<ul class="requirement-list">' +
      course.requirements
        .map(function (requirement) {
          return "<li>" + icon("check-circle") + util.escapeHTML(requirement) + "</li>";
        })
        .join("") +
      "</ul></section>"
    );
  }

  function mentorSection() {
    var teacher = instructorOf();
    if (!teacher) return "";
    var socials = "";
    if (teacher.socials) {
      ["linkedin", "twitter", "github"].forEach(function (network) {
        if (teacher.socials[network]) {
          socials +=
            '<a href="' + teacher.socials[network] + '" target="_blank" rel="noopener noreferrer" aria-label="' +
            util.escapeHTML(teacher.name) + " on " + network + ' (placeholder link)">' +
            icon(network) + "</a>";
        }
      });
    }
    return (
      '<section class="detail-section" id="mentor">' +
      '<div class="detail-section__head"><h2>Your instructor</h2>' +
      "<p>Sample profile created for this demonstration.</p></div>" +
      '<div class="instructor-spotlight">' +
      '<img class="instructor-spotlight__media" src="' + util.image(teacher.image) + '" alt="Portrait placeholder for ' +
      util.escapeHTML(teacher.name) + '" loading="lazy" width="176" height="200">' +
      '<div class="instructor-spotlight__body"><h3>' + util.escapeHTML(teacher.name) + "</h3>" +
      '<p class="instructor-spotlight__role">' + util.escapeHTML(teacher.role) + "</p>" +
      '<p class="instructor-spotlight__bio">' + util.escapeHTML(teacher.bio) + "</p>" +
      '<div class="instructor-spotlight__foot">' +
      '<span class="chip">' + util.escapeHTML(teacher.experience) + " experience</span>" +
      '<span class="chip">' + util.escapeHTML(teacher.qualification) + "</span>" +
      (socials ? '<div class="instructor-spotlight__socials">' + socials + "</div>" : "") +
      "</div></div></div></section>"
    );
  }

  function reviewSection() {
    var reviews = allReviews();
    var shown = reviews.slice(0, 4);
    return (
      '<section class="detail-section" id="review-section">' +
      '<div class="detail-section__head"><h2>Learner reviews</h2>' +
      "<p>Sample reviews written for this demonstration. They are not verified purchases.</p></div>" +
      '<div class="review-summary-row"><strong>' + course.rating.toFixed(1) + "</strong>" +
      LS.icons.stars(course.rating) +
      "<span>" + util.formatNumber(course.reviewCount) + " sample ratings · " + reviews.length +
      " written reviews</span></div>" +
      '<div class="detail-review-list">' +
      (shown.length
        ? shown
            .map(function (review) {
              return (
                '<article class="detail-review">' +
                '<div class="detail-review__head">' +
                '<span class="detail-review__avatar">' + util.escapeHTML(review.initials) + "</span>" +
                '<span><span class="detail-review__name">' + util.escapeHTML(review.name) + "</span>" +
                '<span class="detail-review__meta">' + util.escapeHTML(review.title) + " · " +
                (review.local ? "Your demo review" : "Sample review") + "</span></span>" +
                '<span class="detail-review__stars">' + LS.icons.stars(review.rating) + "</span>" +
                "</div>" +
                "<p>" + util.escapeHTML(review.text) + "</p>" +
                "</article>"
              );
            })
            .join("")
        : '<p class="detail-overview">No written sample review for this course yet. You can add a demo review on the reviews page.</p>') +
      "</div>" +
      '<div style="margin-top:1rem"><a class="btn btn--secondary btn--sm" href="' +
      util.page("pages/reviews.html") + "?course=" + encodeURIComponent(course.slug) +
      '#write-review">Read &amp; add demo reviews ' + icon("arrow-right", "icon--arrow") + "</a></div>" +
      "</section>"
    );
  }

  function relatedSection() {
    var related = data.courses
      .filter(function (item) {
        return item.slug !== course.slug && item.category === course.category;
      })
      .slice(0, 3);
    if (related.length < 3) {
      data.courses.forEach(function (item) {
        if (related.length < 3 && item.slug !== course.slug && related.indexOf(item) === -1) related.push(item);
      });
    }
    return (
      '<section class="detail-section" id="related">' +
      '<div class="detail-section__head"><h2>Related courses</h2>' +
      "<p>More sample courses in the catalogue.</p></div>" +
      '<div class="course-grid">' +
      related
        .map(function (item, index) {
          return window.LS.courses ? LS.courses.card(item, index) : "";
        })
        .join("") +
      "</div></section>"
    );
  }

  /* ---------- Purchase / aside ---------- */
  function purchaseCard() {
    var enrollment = store.enrollment(course.slug);
    var progress = store.progress(course.slug);
    var isSaved = store.isSaved(course.slug);
    var isFavorite = store.isFavorite(course.slug);
    var off = discount();
    var flat = flatLessons();
    var nextIndex = nextFlatIndex(enrollment);
    var nextLesson = nextIndex > -1 ? flat[nextIndex] : null;
    var percent = progress.percent;
    var complete = enrollment && progress.completed >= progress.total && progress.total > 0;

    var actions = enrollment
      ? '<a class="btn btn--primary btn--lg" href="#curriculum" data-continue-learning>' +
        (complete ? "Review the curriculum" : "Continue learning") + " " + icon("arrow-right", "icon--arrow") + "</a>" +
        '<a class="btn btn--secondary" href="' + util.page("pages/dashboard.html") + '">Open dashboard</a>'
      : '<button class="btn btn--primary btn--lg" type="button" data-enroll="' + util.escapeHTML(course.slug) + '">Enroll now ' +
        icon("arrow-right", "icon--arrow") + "</button>" +
        '<button class="btn btn--secondary" type="button" data-save="' + util.escapeHTML(course.slug) + '" aria-pressed="' +
        (isSaved ? "true" : "false") + '">' + icon("bookmark") + "<span>" + (isSaved ? "Saved" : "Save course") + "</span></button>";

    return (
      '<div class="purchase-card">' +
      '<div class="purchase-card__head">' +
      '<div><div class="purchase-price"><strong>' + util.formatPrice(course.price) + "</strong><s>" +
      util.formatPrice(course.originalPrice) + "</s></div>" +
      '<p class="purchase-card__sub">One-time demo price · lifetime access in this preview</p></div>' +
      (off ? '<span class="purchase-discount">' + off + "% off</span>" : "") +
      "</div>" +
      '<div class="purchase-card__actions">' + actions + "</div>" +
      (enrollment
        ? '<div class="purchase-progress" aria-live="polite"><div class="purchase-progress__head"><span>Your progress</span><span>' +
          progress.completed + " / " + progress.total + " lessons · " + percent + "%</span></div>" +
          '<div class="bar"><div class="bar__fill" style="width:' + percent + '%"></div></div>' +
          (nextLesson
            ? '<p style="margin-top:.55rem;font-size:.7rem;color:var(--color-accent-strong);line-height:1.45">Next: ' +
              util.escapeHTML(nextLesson.title) + "</p>"
            : '<p style="margin-top:.55rem;font-size:.7rem;color:var(--color-accent-strong)">All sample lessons complete.</p>') +
          (nextLesson
            ? '<button class="btn btn--ghost btn--sm btn--block" style="margin-top:.6rem" type="button" data-next-lesson="' +
              nextIndex + '">' + icon("check") + " Mark next lesson complete</button>"
            : "") +
          "</div>"
        : "") +
      '<button class="btn btn--ghost btn--sm btn--block" type="button" style="margin-top:.55rem" data-favorite="' +
      util.escapeHTML(course.slug) + '" aria-pressed="' + (isFavorite ? "true" : "false") + '">' +
      icon("heart") + "<span>" + (isFavorite ? "In your favourites" : "Add to favourites") + "</span></button>" +
      '<div class="purchase-includes"><h3>This demo includes</h3><ul class="purchase-includes__list">' +
      "<li>" + icon("book-open") + course.lessons + " sample lessons</li>" +
      "<li>" + icon("clock") + util.escapeHTML(course.duration) + " of lesson outlines</li>" +
      "<li>" + icon("download") + "Downloadable resource placeholders</li>" +
      "<li>" + icon("headphones") + "Mentor support described (not delivered)</li>" +
      "<li>" + icon("award") + "Certificate track described (not issued)</li>" +
      "</ul></div>" +
      '<div class="purchase-share"><span>Share this demo course</span>' +
      '<button class="icon-btn icon-btn--bordered" type="button" data-share-course aria-label="Copy course link">' +
      icon("share") + "</button></div>" +
      "</div>"
    );
  }

  function certificateCard() {
    return (
      '<div class="certificate-card" style="margin-top:1rem">' +
      '<span class="certificate-card__icon">' + icon("award") + "</span>" +
      "<div><h3>A certificate, in a real platform</h3>" +
      "<p>Completing a course in this preview does not create or issue a certificate. A live product would verify completion and identity before issuing one.</p></div></div>"
    );
  }

  function renderAside() {
    var aside = document.getElementById("detail-aside");
    if (aside) aside.innerHTML = purchaseCard() + certificateCard();
    if (window.LS.courses) LS.courses.updateButtons(course.slug);
  }

  /* ---------- Interactions ---------- */
  function refreshLessonRow(index) {
    var row = root.querySelector('[data-lesson-row="' + index + '"]');
    if (!row) return;
    var enrollment = store.enrollment(course.slug);
    var isComplete = enrollment && enrollment.completed.indexOf(index) > -1;
    row.classList.toggle("is-complete", !!isComplete);
    var button = row.querySelector("[data-lesson-index]");
    if (button) {
      button.setAttribute("aria-pressed", isComplete ? "true" : "false");
      var lesson = flatLessons()[index];
      if (lesson) {
        button.setAttribute(
          "aria-label",
          (isComplete ? "Mark lesson incomplete: " : "Mark lesson complete: ") + lesson.title
        );
      }
    }
  }

  function markLesson(index) {
    var flat = flatLessons();
    if (index < 0 || index >= flat.length) return;
    var hadEnrollment = !!store.enrollment(course.slug);
    var result = store.toggleLesson(course.slug, index, course.lessons);
    var lesson = flat[index];
    if (!hadEnrollment && result.complete) {
      store.logActivity("enroll", "Enrolled in " + course.title, course.slug);
      LS.toast("A demo enrollment was created in your dashboard.", "success", "Lesson saved");
    }
    if (result.complete) {
      store.logActivity("lesson", "Completed “" + lesson.title + "” in " + course.title, course.slug);
      LS.toast("Lesson marked complete. Progress is stored in this browser only.", "success", "Progress updated");
    } else {
      LS.toast("Lesson marked incomplete.", "info", "Progress updated");
    }
    refreshLessonRow(index);
    renderAside();
    var progress = store.progress(course.slug);
    if (result.complete && progress.total > 0 && progress.completed >= progress.total) {
      LS.toast(
        "All sample lessons are complete. A real platform would review and issue a certificate; this demo does not.",
        "accent",
        "Demo course complete"
      );
    }
    document.dispatchEvent(
      new CustomEvent("ls:progress", { detail: { slug: course.slug, progress: progress } })
    );
  }

  function toggleModule(moduleIndex, trigger) {
    var wrapper = root.querySelector('[data-module="' + moduleIndex + '"]');
    if (!wrapper) return;
    var open = !wrapper.classList.contains("is-open");
    wrapper.classList.toggle("is-open", open);
    var button = wrapper.querySelector(".module__trigger");
    var panel = wrapper.querySelector(".module__panel");
    if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
    if (panel) {
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if ("inert" in panel) panel.inert = !open;
    }
    if (trigger) trigger.blur();
  }

  function copyLink() {
    var url = window.location.href;
    function done() {
      LS.toast("Course link copied to your clipboard.", "success", "Link copied");
    }
    function fallback() {
      var area = document.createElement("textarea");
      area.value = url;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (error) {
        LS.toast("Copy failed. You can copy the address bar manually.", "error", "Clipboard unavailable");
      }
      document.body.removeChild(area);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  root.addEventListener("click", function (event) {
    var moduleBtn = event.target.closest("[data-module-toggle]");
    if (moduleBtn) {
      toggleModule(moduleBtn.getAttribute("data-module-toggle"), moduleBtn);
      return;
    }

    var lessonBtn = event.target.closest("[data-lesson-index]");
    if (lessonBtn) {
      event.preventDefault();
      markLesson(Number(lessonBtn.getAttribute("data-lesson-index")));
      return;
    }

    var nextBtn = event.target.closest("[data-next-lesson]");
    if (nextBtn) {
      event.preventDefault();
      markLesson(Number(nextBtn.getAttribute("data-next-lesson")));
      return;
    }

    var favoriteBtn = event.target.closest("[data-favorite]");
    if (favoriteBtn) {
      event.preventDefault();
      var fav = store.toggleFavorite(course.slug);
      if (fav.active) {
        store.logActivity("favorite", "Favourited " + course.title, course.slug);
        LS.toast("Find favourites in your dashboard.", "success", "Added to favourites");
      } else {
        LS.toast("Removed from your favourites.", "info", "Favourite removed");
      }
      renderAside();
      return;
    }

    var shareBtn = event.target.closest("[data-share-course]");
    if (shareBtn) {
      event.preventDefault();
      copyLink();
      return;
    }

    var continueBtn = event.target.closest("[data-continue-learning]");
    if (continueBtn) {
      var enrollment = store.enrollment(course.slug);
      var next = nextFlatIndex(enrollment);
      if (next > -1) {
        var flat = flatLessons();
        var moduleIndex = flat[next].moduleIndex;
        var wrapper = root.querySelector('[data-module="' + moduleIndex + '"]');
        if (wrapper && !wrapper.classList.contains("is-open")) toggleModule(moduleIndex, null);
      }
    }
  });

  document.addEventListener("ls:enrolled", function (event) {
    if (event.detail && event.detail.slug === course.slug) renderAside();
  });

  /* ---------- Render / error ---------- */
  function renderNotFound() {
    document.title = "Course not found — LearnSphere Academy";
    root.innerHTML =
      '<section style="padding-block:clamp(3rem,8vw,6rem)">' +
      '<div class="empty-state" style="max-width:620px;margin-inline:auto">' +
      '<span class="empty-state__icon">' + icon("search") + "</span>" +
      "<h3>We couldn't find that course</h3>" +
      "<p>The course link may be incomplete or the slug may have changed. This is a demonstration catalogue, so try browsing the available sample courses.</p>" +
      '<div style="display:flex;gap:.6rem;flex-wrap:wrap;justify-content:center;margin-top:1.25rem">' +
      '<a class="btn btn--primary" href="' + util.page("pages/courses.html") + '">Browse courses ' + icon("arrow-right", "icon--arrow") + "</a>" +
      '<a class="btn btn--secondary" href="' + util.page("index.html") + '">Go home</a>' +
      "</div></div></section>";
  }

  if (!course) {
    renderNotFound();
    return;
  }

  document.title = course.title + " — LearnSphere Academy";
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", course.short + " Demo course content from LearnSphere Academy.");

  root.innerHTML = hero();
  renderAside();
  if (window.LS.animations) window.LS.animations.refresh();
})();
