/* =========================================================
   LearnSphere Academy — Instructor directory & previews
   ========================================================= */
(function () {
  "use strict";

  var util = LS.util;
  var data = window.LS_DATA;
  if (!data) return;

  var groups = {
    "ananya-rao": "Web Development",
    "rohan-mehta": "Python",
    "meera-iyer": "Data Structures",
    "arjun-nair": "Systems Programming",
    "sana-kapoor": "Data & Databases",
    "vikram-shah": "AI & Machine Learning",
    "nisha-verma": "Design & Motion",
    "kabir-bose": "Foundations"
  };

  function groupFor(instructor) {
    return groups[instructor.id] || "General";
  }

  function instructorCard(instructor, index) {
    var courseLinks = instructor.courses
      .map(function (slug) {
        var course = data.bySlug(slug);
        return course
          ? '<a href="' + util.courseUrl(slug) + '">' + util.escapeHTML(course.title) + "</a>"
          : "";
      })
      .join('<span aria-hidden="true"> · </span>');

    var socials = "";
    if (instructor.socials) {
      socials =
        (instructor.socials.linkedin
          ? '<a href="' +
            instructor.socials.linkedin +
            '" target="_blank" rel="noopener noreferrer" aria-label="' +
            util.escapeHTML(instructor.name) +
            ' on LinkedIn (placeholder link)">' +
            LS.icons.svg("linkedin") +
            "</a>"
          : "") +
        (instructor.socials.twitter
          ? '<a href="' +
            instructor.socials.twitter +
            '" target="_blank" rel="noopener noreferrer" aria-label="' +
            util.escapeHTML(instructor.name) +
            ' on X (placeholder link)">' +
            LS.icons.svg("twitter") +
            "</a>"
          : "") +
        (instructor.socials.github
          ? '<a href="' +
            instructor.socials.github +
            '" target="_blank" rel="noopener noreferrer" aria-label="' +
            util.escapeHTML(instructor.name) +
            ' on GitHub (placeholder link)">' +
            LS.icons.svg("github") +
            "</a>"
          : "");
    }

    return (
      '<article class="instructor-card reveal" data-specialization="' +
      util.escapeHTML(groupFor(instructor)) +
      '" data-delay="' +
      Math.min(3, index % 4) +
      '">' +
      '<div class="instructor-card__media">' +
      '<img src="' +
      util.image(instructor.image) +
      '" alt="Portrait placeholder for ' +
      util.escapeHTML(instructor.name) +
      '" loading="lazy" width="640" height="640">' +
      '<span class="badge badge--outline instructor-card__badge">' +
      LS.icons.svg("info") +
      " Demo profile</span>" +
      '<div class="instructor-card__socials">' +
      socials +
      "</div></div>" +
      '<div class="instructor-card__body">' +
      "<h3>" +
      util.escapeHTML(instructor.name) +
      "</h3>" +
      '<p class="instructor-card__role">' +
      util.escapeHTML(instructor.role) +
      "</p>" +
      '<p class="instructor-card__bio">' +
      util.escapeHTML(instructor.bio) +
      "</p>" +
      '<div class="instructor-card__facts">' +
      "<span>" +
      LS.icons.svg("briefcase") +
      util.escapeHTML(instructor.experience) +
      " experience</span>" +
      "<span>" +
      LS.icons.svg("graduation") +
      util.escapeHTML(instructor.qualification) +
      "</span></div>" +
      '<div class="chip-row" style="margin-top:.8rem">' +
      instructor.expertise
        .slice(0, 3)
        .map(function (item) {
          return '<span class="chip">' + util.escapeHTML(item) + "</span>";
        })
        .join("") +
      "</div>" +
      '<div class="instructor-card__foot"><span class="instructor-card__courses">Teaches ' +
      courseLinks +
      "</span></div></div></article>"
    );
  }

  function renderInstructorGrid(container, list) {
    if (!container) return;
    container.innerHTML = list
      .map(function (instructor, index) {
        return instructorCard(instructor, index);
      })
      .join("");
    if (window.LS.animations) window.LS.animations.refresh();
  }

  function initFeatured() {
    var container = document.getElementById("featured-instructors");
    if (!container) return;
    renderInstructorGrid(container, data.instructors.slice(0, 3));
  }

  function initDirectory() {
    var grid = document.getElementById("instructor-grid");
    if (!grid) return;

    var searchInput = document.getElementById("instructor-search");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-specialization-filter]"));
    var countEl = document.getElementById("instructor-count");
    var emptyEl = document.getElementById("instructor-empty");
    var activeGroup = "all";

    var unique = [];
    data.instructors.forEach(function (instructor) {
      var group = groupFor(instructor);
      if (unique.indexOf(group) === -1) unique.push(group);
    });

    function render() {
      var query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      var list = data.instructors.filter(function (instructor) {
        var matchesGroup = activeGroup === "all" || groupFor(instructor) === activeGroup;
        var haystack = (
          instructor.name +
          " " +
          instructor.role +
          " " +
          instructor.bio +
          " " +
          instructor.expertise.join(" ") +
          " " +
          groupFor(instructor)
        ).toLowerCase();
        return matchesGroup && (!query || haystack.indexOf(query) > -1);
      });

      renderInstructorGrid(grid, list);
      grid.hidden = list.length === 0;
      if (emptyEl) emptyEl.hidden = list.length !== 0;
      if (countEl) {
        countEl.innerHTML =
          "Showing <strong>" +
          list.length +
          "</strong> of " +
          data.instructors.length +
          " instructors";
      }
    }

    if (searchInput) searchInput.addEventListener("input", util.debounce(render, 140));

    chips.forEach(function (chip) {
      if (chip.getAttribute("data-specialization-filter") === "all") chip.classList.add("is-active");
      chip.addEventListener("click", function () {
        activeGroup = chip.getAttribute("data-specialization-filter");
        chips.forEach(function (other) {
          other.classList.toggle("is-active", other === chip);
        });
        render();
      });
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFeatured();
    initDirectory();
  });

  window.LS.instructors = {
    card: instructorCard,
    render: renderInstructorGrid,
    groups: groups
  };
})();
