/* =========================================================
   LearnSphere Academy — Student dashboard
   A frontend demo built on localStorage. No real student
   records, payments, certificates or secure accounts exist.
   ========================================================= */
(function () {
  "use strict";

  var app = document.getElementById("dashboard-app");
  var data = window.LS_DATA;
  if (!app || !data) return;

  var util = LS.util;
  var store = LS.store;
  var icon = LS.icons.svg;
  var session = store.session();
  var profileEditing = false;

  /* ---------- Demo seed ---------- */
  function seedDemo() {
    if (store.get("demoSeeded", false)) return;
    var existing = Object.keys(store.enrollments());
    if (existing.length) {
      store.set("demoSeeded", true);
      return;
    }

    var seeds = [
      { slug: "web-development", completed: [0, 1, 2, 3, 4, 5, 6] },
      { slug: "python-programming", completed: [0, 1, 2, 3] },
      { slug: "graphic-design", completed: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }
    ];

    seeds.forEach(function (seed) {
      var course = data.bySlug(seed.slug);
      if (!course) return;
      store.enroll(seed.slug, course.lessons);
      seed.completed.forEach(function (index) {
        if (index < course.lessons) store.toggleLesson(seed.slug, index, course.lessons);
      });
      store.logActivity("enroll", "Demo enrollment added for " + course.title, seed.slug);
    });
    store.logActivity("lesson", "Completed a sample lesson in Full-Stack Web Development", "web-development");
    store.set("demoSeeded", true);
  }

  seedDemo();

  /* ---------- Data helpers ---------- */
  function flatLessons(course) {
    var list = [];
    course.modules.forEach(function (module, moduleIndex) {
      module.lessons.forEach(function (lesson) {
        list.push({
          index: list.length,
          moduleIndex: moduleIndex,
          moduleTitle: module.title,
          title: lesson.title,
          duration: lesson.duration
        });
      });
    });
    return list;
  }

  function minutesFromDuration(value) {
    var match = String(value || "").match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  function nextLessonFor(course, enrollment) {
    var completed = enrollment && Array.isArray(enrollment.completed) ? enrollment.completed : [];
    var lessons = flatLessons(course);
    for (var i = 0; i < lessons.length; i++) {
      if (completed.indexOf(lessons[i].index) === -1) return lessons[i];
    }
    return null;
  }

  function completedMinutes(course, enrollment) {
    var lessons = flatLessons(course);
    var minutes = 0;
    (enrollment.completed || []).forEach(function (index) {
      if (lessons[index]) minutes += minutesFromDuration(lessons[index].duration);
    });
    return minutes;
  }

  function enrolledCourses() {
    var enrollments = store.enrollments();
    return Object.keys(enrollments)
      .map(function (slug) {
        var course = data.bySlug(slug);
        if (!course) return null;
        var progress = store.progress(slug);
        return {
          course: course,
          enrollment: enrollments[slug],
          progress: progress,
          next: nextLessonFor(course, enrollments[slug]),
          minutes: completedMinutes(course, enrollments[slug])
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return new Date(b.enrollment.enrolledAt || 0) - new Date(a.enrollment.enrolledAt || 0);
      });
  }

  function dashboardTitle() {
    var months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var now = new Date();
    return months[now.getMonth()] + " " + now.getFullYear();
  }

  function activityIcon(type) {
    var map = {
      enroll: "book-open",
      save: "bookmark",
      lesson: "check-circle",
      auth: "user-check",
      favorite: "heart",
      review: "star",
      profile: "settings"
    };
    return map[type] || "activity";
  }

  /* ---------- Components ---------- */
  function sidebar(items, totalCompleted, overall) {
    var nav = [
      { id: "dash-overview", label: "Overview", icon: "grid" },
      { id: "dash-courses", label: "My courses", icon: "book-open" },
      { id: "dash-saved", label: "Saved & favourite", icon: "bookmark" },
      { id: "dash-activity", label: "Activity", icon: "activity" },
      { id: "dash-profile", label: "Profile & demo data", icon: "user" }
    ];

    return (
      '<aside class="dash-side">' +
      '<div class="dash-identity">' +
      '<span class="dash-avatar">' + util.escapeHTML(util.initials(session ? session.name : "Guest learner")) + "</span>" +
      '<div><strong>' + util.escapeHTML(session ? session.name : "Guest learner") + "</strong>" +
      "<span>" + (session ? "Local demo account" : "Guest demo mode") + "</span></div>" +
      "</div>" +
      '<div class="dash-side__summary"><div><strong>' + items.length + "</strong><span>Courses</span></div>" +
      "<div><strong>" + totalCompleted + "</strong><span>Lessons</span></div>" +
      "<div><strong>" + overall + "%</strong><span>Overall</span></div></div>" +
      '<nav class="dash-nav" aria-label="Dashboard sections">' +
      nav
        .map(function (item, index) {
          return (
            '<a class="' + (index === 0 ? "is-active" : "") + '" href="#' + item.id + '" data-dash-nav="' + item.id + '">' +
            icon(item.icon) + "<span>" + item.label + "</span></a>"
          );
        })
        .join("") +
      "</nav>" +
      '<div class="dash-side__foot">' +
      (session
        ? '<button class="btn btn--ghost btn--sm btn--block" type="button" data-dash-action="logout">' + icon("logout") + " Sign out</button>"
        : '<a class="btn btn--primary btn--sm btn--block" href="' + util.page("pages/signup.html") + '">Create a demo account</a>' +
          '<a class="btn btn--ghost btn--sm btn--block" href="' + util.page("pages/login.html") + '">Log in</a>') +
      '<button class="btn btn--ghost btn--sm btn--block dash-reset" type="button" data-dash-action="reset">' + icon("refresh") + " Reset demo data</button>" +
      "</div></aside>"
    );
  }

  function guestBanner() {
    if (session) {
      return (
        '<div class="dash-session-note">' +
        icon("info") +
        "<span>Signed in as <strong>" + util.escapeHTML(session.email) + "</strong> on this browser only. This is not a secure account or a real student record.</span></div>"
      );
    }
    return (
      '<div class="dash-guest">' +
      '<span class="dash-guest__icon">' + icon("sparkles") + "</span>" +
      '<div class="dash-guest__body"><strong>You are exploring the guest demo.</strong>' +
      "<p>Three sample courses have been added so you can try progress tracking. Everything is stored in this browser’s local storage and is not a real account.</p></div>" +
      '<div class="dash-guest__actions"><a class="btn btn--primary btn--sm" href="' + util.page("pages/signup.html") + '">Create account</a>' +
      '<a class="btn btn--secondary btn--sm" href="' + util.page("pages/login.html") + '">Log in</a></div></div>'
    );
  }

  function stats(items, totalCompleted, overall) {
    var saved = store.saved().length;
    var minutes = items.reduce(function (sum, item) {
      return sum + item.minutes;
    }, 0);
    return (
      '<div class="dash-stats">' +
      '<article class="dash-stat reveal"><span class="dash-stat__icon">' + icon("book-open") + "</span>" +
      '<div><strong>' + items.length + '</strong><span>Courses enrolled</span></div></article>' +
      '<article class="dash-stat reveal" data-delay="1"><span class="dash-stat__icon dash-stat__icon--success">' + icon("check-circle") + "</span>" +
      '<div><strong>' + totalCompleted + '</strong><span>Lessons complete</span></div></article>' +
      '<article class="dash-stat reveal" data-delay="2"><span class="dash-stat__icon dash-stat__icon--warning">' + icon("clock") + "</span>" +
      '<div><strong>' + minutes + ' min</strong><span>Sample learning time</span></div></article>' +
      '<article class="dash-stat reveal" data-delay="3"><span class="dash-stat__icon dash-stat__icon--accent">' + icon("trending") + "</span>" +
      '<div><strong>' + overall + '%</strong><span>Overall progress · ' + saved + " saved</span></div></article>" +
      "</div>"
    );
  }

  function ring(percent, size) {
    return (
      '<div class="progress-ring dash-ring" style="--value:' + percent + ";--size:" + (size || 86) + 'px" role="img" aria-label="' +
      percent + ' percent complete"><span>' + percent + "%</span></div>"
    );
  }

  function continuePanel(items) {
    if (!items.length) {
      return (
        '<div class="empty-state dash-empty">' +
        '<span class="empty-state__icon">' + icon("compass") + "</span>" +
        "<h3>Your learning path starts here</h3>" +
        "<p>Enroll in a sample course to begin tracking lessons and progress in this demo.</p>" +
        '<a class="btn btn--primary" href="' + util.page("pages/courses.html") + '">Browse courses ' + icon("arrow-right", "icon--arrow") + "</a>" +
        "</div>"
      );
    }

    var active =
      items.filter(function (item) {
        return item.progress.percent > 0 && item.progress.percent < 100;
      })[0] || items[0];
    var complete = active.progress.percent >= 100;
    return (
      '<article class="dash-continue reveal">' +
      '<div class="dash-continue__media' + (active.course.image ? " has-photo" : "") + '">' +
      util.coursePhoto(active.course, "dash-continue__photo") + icon(active.course.icon) + "</div>" +
      '<div class="dash-continue__body">' +
      '<span class="eyebrow">' + (complete ? "Course complete" : "Continue where you left off") + "</span>" +
      "<h2>" + util.escapeHTML(active.course.title) + "</h2>" +
      (complete
        ? "<p>Every sample lesson is marked complete. In a real platform a certificate review would happen here.</p>"
        : '<p class="dash-continue__next">Next lesson: <strong>' +
          util.escapeHTML(active.next ? active.next.title : "Review the curriculum") +
          "</strong>" +
          (active.next ? " · " + util.escapeHTML(active.next.duration) : "") +
          "</p>") +
      '<div class="dash-progress"><div class="bar"><div class="bar__fill" style="width:' + active.progress.percent + '%"></div></div>' +
      "<span>" + active.progress.completed + " of " + active.progress.total + " lessons</span></div>" +
      '<div class="dash-continue__actions">' +
      '<a class="btn btn--primary btn--sm" href="' + util.courseUrl(active.course.slug) + '">Open course</a>' +
      (complete
        ? ""
        : '<button class="btn btn--secondary btn--sm" type="button" data-dash-next="' + active.course.slug + '">' +
          icon("check") + " Mark next complete</button>") +
      "</div></div>" +
      '<div class="dash-continue__side">' + ring(active.progress.percent, 88) + "<span>complete</span></div>" +
      "</article>"
    );
  }

  function courseCards(items) {
    if (!items.length) {
      return (
        '<div class="empty-state">' +
        '<span class="empty-state__icon">' + icon("book") + "</span>" +
        "<h3>No demo enrollments yet</h3>" +
        "<p>Pick a course from the catalogue. Enrollment is saved in this browser only.</p>" +
        '<a class="btn btn--secondary" href="' + util.page("pages/courses.html") + '">Explore courses</a></div>'
      );
    }
    return (
      '<div class="dash-course-grid">' +
      items
        .map(function (item, index) {
          var complete = item.progress.percent >= 100;
          return (
            '<article class="dash-course reveal" data-delay="' + Math.min(3, index % 4) + '">' +
            '<div class="dash-course__media' + (item.course.image ? " has-photo" : "") + '">' +
            util.coursePhoto(item.course, "dash-course__photo") +
            icon(item.course.icon) +
            '<span class="badge badge--outline">' + util.escapeHTML(item.course.level) + "</span></div>" +
            '<div class="dash-course__body">' +
            '<div class="dash-course__meta"><span>' + util.escapeHTML(item.course.category) + "</span>" +
            "<span>" + item.progress.completed + " / " + item.progress.total + " lessons</span></div>" +
            '<h3><a href="' + util.courseUrl(item.course.slug) + '">' + util.escapeHTML(item.course.title) + "</a></h3>" +
            '<p class="dash-course__next">' +
            (complete
              ? "All sample lessons completed."
              : "Next: " + util.escapeHTML(item.next ? item.next.title : "Review curriculum")) +
            "</p>" +
            '<div class="dash-progress"><div class="bar"><div class="bar__fill" style="width:' + item.progress.percent + '%"></div></div>' +
            "<span>" + item.progress.percent + "%</span></div>" +
            '<div class="dash-course__actions">' +
            '<a class="btn btn--primary btn--sm" href="' + util.courseUrl(item.course.slug) + '">' +
            (complete ? "Review course" : "Continue") + "</a>" +
            (complete
              ? '<span class="badge badge--success">' + icon("check") + " Complete</span>"
              : '<button class="btn btn--ghost btn--sm" type="button" data-dash-next="' + item.course.slug + '">' +
                icon("check") + " Mark next</button>") +
            "</div></div></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function savedRows(list, kind) {
    if (!list.length) {
      return (
        '<div class="dash-list-empty">' +
        icon(kind === "saved" ? "bookmark" : "heart") +
        "<p>" +
        (kind === "saved"
          ? "No saved courses yet. Use the bookmark button on any course card."
          : "No favourites yet. Add a course to favourites from its detail page.") +
        "</p></div>"
      );
    }
    return (
      '<div class="dash-list">' +
      list
        .map(function (course) {
          return (
            '<article class="dash-list__item">' +
            '<span class="dash-list__thumb' + (course.image ? " has-photo" : "") + '">' +
            util.coursePhoto(course, "dash-list__photo") + icon(course.icon) + "</span>" +
            '<div class="dash-list__body"><h3><a href="' + util.courseUrl(course.slug) + '">' +
            util.escapeHTML(course.title) + "</a></h3>" +
            "<p>" + util.escapeHTML(course.category) + " · " + util.escapeHTML(course.level) + " · " +
            util.escapeHTML(course.duration) + "</p></div>" +
            '<span class="dash-list__price">' + util.formatPrice(course.price) + "</span>" +
            '<div class="dash-list__actions">' +
            '<a class="icon-btn icon-btn--bordered" href="' + util.courseUrl(course.slug) + '" aria-label="Open ' +
            util.escapeHTML(course.title) + '">' + icon("arrow-right") + "</a>" +
            '<button class="icon-btn icon-btn--bordered" type="button" data-dash-' +
            (kind === "saved" ? "unsave" : "unfavorite") + "=\"" + util.escapeHTML(course.slug) +
            '" aria-label="Remove ' + util.escapeHTML(course.title) + (kind === "saved" ? " from saved" : " from favourites") +
            '">' + icon(kind === "saved" ? "bookmark" : "heart") + "</button>" +
            "</div></article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function activityList() {
    var list = store.activity();
    if (!list.length) {
      return (
        '<div class="dash-list-empty">' + icon("activity") +
        "<p>No activity yet. Enroll in a course, save one, or mark a lesson complete.</p></div>"
      );
    }
    return (
      '<ol class="dash-activity">' +
      list
        .map(function (entry) {
          return (
            '<li><span class="dash-activity__icon">' + icon(activityIcon(entry.type)) + "</span>" +
            '<div><p>' + util.escapeHTML(entry.text) + "</p><time datetime=\"" + util.escapeHTML(entry.at) + "\">" +
            util.escapeHTML(util.timeAgo(entry.at)) + "</time></div></li>"
          );
        })
        .join("") +
      "</ol>"
    );
  }

  function profileSection() {
    var name = session ? session.name : "Guest learner";
    var email = session ? session.email : "Not signed in";
    return (
      '<div class="dash-profile-card">' +
      '<div class="dash-profile-card__head">' +
      '<span class="dash-avatar dash-avatar--lg">' + util.escapeHTML(util.initials(name)) + "</span>" +
      '<div class="dash-profile-card__id"><h3>' + util.escapeHTML(name) + "</h3><p>" + util.escapeHTML(email) + "</p>" +
      '<span class="badge ' + (session ? "badge--soft" : "badge--neutral") + '">' +
      (session ? "Local demo account" : "Guest session") + "</span></div>" +
      (session
        ? '<button class="btn btn--secondary btn--sm" type="button" data-dash-action="edit-profile">' +
          icon("settings") + " Edit profile</button>"
        : '<a class="btn btn--primary btn--sm" href="' + util.page("pages/signup.html") + '">Create account</a>') +
      "</div>" +
      '<div class="dash-profile-card__meta">' +
      "<div><span>Member since</span><strong>" + (session ? util.dateLong(session.createdAt) : "Not applicable") + "</strong></div>" +
      "<div><span>Storage</span><strong>This browser only</strong></div>" +
      "<div><span>Data type</span><strong>Sample / demo data</strong></div>" +
      "</div>" +
      (session
        ? '<form class="dash-profile-form" id="profile-form"' + (profileEditing ? "" : " hidden") + ">" +
          '<div class="form-grid-2">' +
          '<div class="form-field"><label class="form-label" for="profile-name">Display name</label>' +
          '<input class="input" id="profile-name" name="name" type="text" autocomplete="name" value="' +
          util.escapeHTML(session.name) + '" required></div>' +
          '<div class="form-field"><label class="form-label" for="profile-email">Email</label>' +
          '<input class="input" id="profile-email" name="email" type="email" autocomplete="email" value="' +
          util.escapeHTML(session.email) + '" required></div>' +
          "</div>" +
          '<div class="dash-profile-form__actions">' +
          '<button class="btn btn--primary btn--sm" type="submit">Save demo profile</button>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-dash-action="cancel-profile">Cancel</button>' +
          "</div></form>"
        : '<p class="dash-profile-card__note">Create a local demo account to personalise the dashboard. No password reset, verification or secure storage is provided.</p>') +
      "</div>"
    );
  }

  /* ---------- Render ---------- */
  function render() {
    var items = enrolledCourses();
    var totalCompleted = items.reduce(function (sum, item) {
      return sum + item.progress.completed;
    }, 0);
    var totalLessons = items.reduce(function (sum, item) {
      return sum + item.progress.total;
    }, 0);
    var overall = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0;
    var savedCourses = store
      .saved()
      .map(function (slug) {
        return data.bySlug(slug);
      })
      .filter(Boolean);
    var favoriteCourses = store
      .favorites()
      .map(function (slug) {
        return data.bySlug(slug);
      })
      .filter(Boolean);

    app.innerHTML =
      '<div class="dash">' +
      sidebar(items, totalCompleted, overall) +
      '<div class="dash-main">' +
      '<header class="dash-head">' +
      '<div><span class="eyebrow">Student dashboard · demo</span>' +
      "<h1>" + dashboardTitle() + "</h1>" +
      "<p>Track sample courses, save lessons and try the learning workflow. Everything here is demonstration data stored in your browser.</p></div>" +
      '<div class="dash-head__actions"><a class="btn btn--secondary btn--sm" href="' + util.page("pages/courses.html") + '">Browse courses</a>' +
      '<a class="btn btn--primary btn--sm" href="' + util.page("pages/reviews.html") + '#write-review">Write a review</a></div>' +
      "</header>" +
      guestBanner() +
      '<section class="dash-block" id="dash-overview">' +
      '<div class="dash-block__head"><div><h2>Overview</h2><p>Your at-a-glance demo learning snapshot.</p></div></div>' +
      stats(items, totalCompleted, overall) +
      '<div class="dash-block__head dash-block__head--sub"><div><h2>Pick up where you left off</h2></div></div>' +
      continuePanel(items) +
      "</section>" +
      '<section class="dash-block" id="dash-courses">' +
      '<div class="dash-block__head"><div><h2>My courses</h2><p>Progress is saved automatically in this browser.</p></div>' +
      '<a class="text-link" href="' + util.page("pages/courses.html") + '">Find another course ' + icon("arrow-right", "icon--arrow") + "</a></div>" +
      courseCards(items) +
      "</section>" +
      '<section class="dash-block" id="dash-saved">' +
      '<div class="dash-block__head"><div><h2>Saved &amp; favourite</h2><p>Two separate demo lists for courses you want to revisit.</p></div></div>' +
      '<div class="dash-split">' +
      '<div class="dash-panel"><h3>' + icon("bookmark") + " Saved courses <span>" + savedCourses.length + "</span></h3>" +
      savedRows(savedCourses, "saved") + "</div>" +
      '<div class="dash-panel"><h3>' + icon("heart") + " Favourites <span>" + favoriteCourses.length + "</span></h3>" +
      savedRows(favoriteCourses, "favorite") + "</div>" +
      "</div></section>" +
      '<section class="dash-block" id="dash-activity">' +
      '<div class="dash-block__head"><div><h2>Recent activity</h2><p>The last dozen demo actions in this browser.</p></div></div>' +
      activityList() +
      "</section>" +
      '<section class="dash-block" id="dash-profile">' +
      '<div class="dash-block__head"><div><h2>Profile &amp; demo data</h2><p>Edit a local display name, sign out, or reset the demo.</p></div></div>' +
      profileSection() +
      '<div class="notice notice--warning" style="margin-top:1rem">' + icon("shield") +
      "<span><strong>Privacy reminder:</strong> this site has no backend. Demo accounts, enrollments, reviews and messages are stored in your browser and can be removed by clearing site data. Never enter a real password.</span></div>" +
      "</section>" +
      "</div></div>";

    if (window.LS.animations) window.LS.animations.refresh();
  }

  function rerender() {
    var y = window.scrollY;
    render();
    window.scrollTo({ top: y, behavior: "auto" });
  }

  function markNext(slug) {
    var course = data.bySlug(slug);
    if (!course) return;
    var enrollment = store.enrollment(slug);
    if (!enrollment) {
      store.enroll(slug, course.lessons);
      enrollment = store.enrollment(slug);
    }
    var lesson = nextLessonFor(course, enrollment);
    if (!lesson) {
      LS.toast("Every sample lesson in this course is already complete.", "info", "Nothing left to mark");
      return;
    }
    store.toggleLesson(slug, lesson.index, course.lessons);
    store.logActivity("lesson", "Completed “" + lesson.title + "” in " + course.title, slug);
    var progress = store.progress(slug);
    if (progress.percent >= 100) {
      LS.toast(
        "All sample lessons complete. This demo does not issue a real certificate.",
        "accent",
        "Course completed"
      );
    } else {
      LS.toast("Lesson marked complete. " + progress.percent + "% of this demo is done.", "success", "Progress updated");
    }
    rerender();
  }

  /* ---------- Actions ---------- */
  app.addEventListener("click", function (event) {
    var navLink = event.target.closest("[data-dash-nav]");
    if (navLink) {
      Array.prototype.forEach.call(app.querySelectorAll("[data-dash-nav]"), function (link) {
        link.classList.toggle("is-active", link === navLink);
      });
    }

    var nextButton = event.target.closest("[data-dash-next]");
    if (nextButton) {
      event.preventDefault();
      markNext(nextButton.getAttribute("data-dash-next"));
      return;
    }

    var unsaveButton = event.target.closest("[data-dash-unsave]");
    if (unsaveButton) {
      event.preventDefault();
      var unsaveSlug = unsaveButton.getAttribute("data-dash-unsave");
      if (store.isSaved(unsaveSlug)) store.toggleSaved(unsaveSlug);
      LS.toast("Removed from saved courses.", "info", "Saved list updated");
      rerender();
      return;
    }

    var unfavoriteButton = event.target.closest("[data-dash-unfavorite]");
    if (unfavoriteButton) {
      event.preventDefault();
      var favSlug = unfavoriteButton.getAttribute("data-dash-unfavorite");
      if (store.isFavorite(favSlug)) store.toggleFavorite(favSlug);
      LS.toast("Removed from favourites.", "info", "Favourites updated");
      rerender();
      return;
    }

    var actionButton = event.target.closest("[data-dash-action]");
    if (!actionButton) return;
    var action = actionButton.getAttribute("data-dash-action");

    if (action === "edit-profile") {
      profileEditing = true;
      rerender();
      var profileForm = document.getElementById("profile-form");
      if (profileForm) {
        var firstInput = profileForm.querySelector("input");
        if (firstInput) firstInput.focus();
      }
      return;
    }

    if (action === "cancel-profile") {
      profileEditing = false;
      rerender();
      return;
    }

    if (action === "logout") {
      store.clearSession();
      store.flash("success", "You have been signed out of the demo account.");
      window.location.href = util.page("pages/login.html");
      return;
    }

    if (action === "reset") {
      var confirmed = window.confirm(
        "Reset demo learning data? This clears saved courses, favourites, reviews, messages, activity and your own progress, then restores the three sample enrollments. It does not delete local demo accounts or your theme choice."
      );
      if (!confirmed) return;
      ["enrollments", "saved", "favorites", "activity", "reviews", "messages"].forEach(function (key) {
        store.remove(key);
      });
      store.set("demoSeeded", false);
      store.flash("success", "Demo learning data was reset. Sample enrollments were restored; accounts and theme were kept.");
      window.location.reload();
    }
  });

  app.addEventListener("submit", function (event) {
    var form = event.target.closest("#profile-form");
    if (!form) return;
    event.preventDefault();
    var current = store.session();
    if (!current) {
      LS.toast("Create a local demo account to edit a profile.", "info", "Guest session");
      return;
    }
    var nameInput = form.querySelector("#profile-name");
    var emailInput = form.querySelector("#profile-email");
    var name = nameInput ? nameInput.value.trim() : "";
    var email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (name.length < 2) {
      LS.toast("Use a display name with at least two characters.", "error", "Check your name");
      if (nameInput) nameInput.focus();
      return;
    }
    if (!emailPattern.test(email)) {
      LS.toast("Enter a valid email address.", "error", "Check your email");
      if (emailInput) emailInput.focus();
      return;
    }

    var users = store.users();
    var duplicate = users.some(function (user) {
      return user.id !== current.id && String(user.email || "").toLowerCase() === email;
    });
    if (duplicate) {
      LS.toast("Another local demo account already uses that email.", "error", "Email already used");
      if (emailInput) emailInput.focus();
      return;
    }

    users.forEach(function (user) {
      if (user.id === current.id) {
        user.name = name;
        user.email = email;
      }
    });
    store.set("users", users);
    var remember = false;
    try {
      remember = !!window.localStorage.getItem("learnsphere.session");
    } catch (error) {
      remember = false;
    }
    session = store.setSession(
      {
        id: current.id,
        name: name,
        email: email,
        createdAt: current.createdAt,
        demo: true
      },
      remember
    );
    store.logActivity("profile", "Updated the local demo profile");
    store.flash("success", "Demo profile updated in this browser.");
    profileEditing = false;
    render();
    LS.toast("Profile updated. This is local demo data only.", "success", "Profile saved");
  });

  render();
})();
