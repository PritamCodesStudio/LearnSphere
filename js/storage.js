/* =========================================================
   LearnSphere Academy — Utilities & local demo storage
   NOTE: localStorage is used only to demonstrate frontend
   behaviour. It is NOT secure production storage.
   ========================================================= */
(function () {
  "use strict";

  var PREFIX = "learnsphere.";
  var body = document.body;
  var root = (body && body.getAttribute("data-root")) || "./";

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function remove(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch (error) {
      /* storage may be unavailable */
    }
  }

  function readSession(key, fallback) {
    try {
      var raw = window.sessionStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  var util = {
    base: root,

    page: function (path) {
      return root + path;
    },

    courseUrl: function (slug) {
      return root + "pages/course-details.html?slug=" + encodeURIComponent(slug);
    },

    image: function (file) {
      return root + "assets/images/" + file;
    },

    /* Course thumbnail: returns an <img> when the course has one,
       or "" so the tone gradient + icon fallback stays in place. */
    coursePhoto: function (course, className, width, height) {
      if (!course || !course.image) return "";
      return (
        '<img class="' + className + '" src="' + util.image(course.image) +
        '" alt="" width="' + (width || 800) + '" height="' + (height || 450) +
        '" loading="lazy" decoding="async">'
      );
    },

    qs: function (selector, scope) {
      return (scope || document).querySelector(selector);
    },

    qsa: function (selector, scope) {
      return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    },

    formatPrice: function (value) {
      var number = Number(value) || 0;
      return "\u20B9" + number.toLocaleString("en-IN");
    },

    formatNumber: function (value) {
      return Number(value || 0).toLocaleString("en-IN");
    },

    compact: function (value) {
      var number = Number(value) || 0;
      if (number >= 1000000) return (number / 1000000).toFixed(number % 1000000 === 0 ? 0 : 1) + "m";
      if (number >= 1000) return (number / 1000).toFixed(number % 1000 === 0 ? 0 : 1) + "k";
      return String(number);
    },

    initials: function (name) {
      var parts = String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      if (!parts.length) return "LS";
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    escapeHTML: function (value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    debounce: function (fn, wait) {
      var timer;
      return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, wait || 160);
      };
    },

    param: function (name) {
      try {
        return new URLSearchParams(window.location.search).get(name);
      } catch (error) {
        return null;
      }
    },

    uid: function () {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }
      return "ls-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    },

    timeAgo: function (iso) {
      var date = new Date(iso);
      if (isNaN(date.getTime())) return "Just now";
      var seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
      if (seconds < 60) return "Just now";
      var minutes = Math.floor(seconds / 60);
      if (minutes < 60) return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
      var hours = Math.floor(minutes / 60);
      if (hours < 24) return hours + (hours === 1 ? " hour ago" : " hours ago");
      var days = Math.floor(hours / 24);
      if (days < 30) return days + (days === 1 ? " day ago" : " days ago");
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    },

    dateLong: function (iso) {
      var date = iso ? new Date(iso) : new Date();
      return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    },

    /* Demo-only password digest. Prefer Web Crypto SHA-256 when available.
       This is NOT a substitute for server-side authentication. */
    hashPassword: function (password) {
      var source = "learnsphere-demo::" + String(password);
      if (window.crypto && window.crypto.subtle && window.isSecureContext) {
        return window.crypto.subtle
          .digest("SHA-256", new TextEncoder().encode(source))
          .then(function (buffer) {
            return Array.prototype.map
              .call(new Uint8Array(buffer), function (byte) {
                return ("0" + byte.toString(16)).slice(-2);
              })
              .join("");
          })
          .catch(function () {
            return util.fallbackHash(source);
          });
      }
      return Promise.resolve(util.fallbackHash(source));
    },

    fallbackHash: function (source) {
      /* Non-cryptographic fallback for file:// contexts. Demo only. */
      var hashA = 2166136261;
      var hashB = 5381;
      for (var i = 0; i < source.length; i++) {
        hashA ^= source.charCodeAt(i);
        hashA = Math.imul(hashA, 16777619);
        hashB = (Math.imul(hashB, 33) + source.charCodeAt(i)) | 0;
      }
      return "demo-" + (hashA >>> 0).toString(16) + (hashB >>> 0).toString(16);
    }
  };

  /* ---------- Favourites & saved courses ---------- */
  var savedList = function () {
    var value = read("saved", []);
    return Array.isArray(value) ? value : [];
  };

  var favoriteList = function () {
    var value = read("favorites", []);
    return Array.isArray(value) ? value : [];
  };

  var toggleInList = function (listName, slug) {
    var list = listName === "favorites" ? favoriteList() : savedList();
    var index = list.indexOf(slug);
    var active;
    if (index > -1) {
      list.splice(index, 1);
      active = false;
    } else {
      list.unshift(slug);
      active = true;
    }
    write(listName, list);
    return { active: active, list: list };
  };

  /* ---------- Enrollments & progress ---------- */
  var allEnrollments = function () {
    var value = read("enrollments", {});
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  };

  var enroll = function (slug, totalLessons) {
    var enrollments = allEnrollments();
    var existing = enrollments[slug];
    if (existing) {
      if (totalLessons) existing.total = Number(totalLessons) || existing.total;
      write("enrollments", enrollments);
      return { enrollment: existing, created: false };
    }
    var enrollment = {
      slug: slug,
      completed: [],
      total: Number(totalLessons) || 0,
      enrolledAt: new Date().toISOString()
    };
    enrollments[slug] = enrollment;
    write("enrollments", enrollments);
    return { enrollment: enrollment, created: true };
  };

  var enrollmentFor = function (slug) {
    return allEnrollments()[slug] || null;
  };

  var toggleLesson = function (slug, index, totalLessons) {
    var enrollments = allEnrollments();
    var enrollment = enrollments[slug];
    if (!enrollment) {
      enrollment = {
        slug: slug,
        completed: [],
        total: Number(totalLessons) || 0,
        enrolledAt: new Date().toISOString()
      };
      enrollments[slug] = enrollment;
    }
    if (totalLessons) enrollment.total = Number(totalLessons) || enrollment.total;
    var position = enrollment.completed.indexOf(index);
    var complete;
    if (position > -1) {
      enrollment.completed.splice(position, 1);
      complete = false;
    } else {
      enrollment.completed.push(index);
      complete = true;
    }
    enrollment.completed.sort(function (a, b) {
      return a - b;
    });
    write("enrollments", enrollments);
    return { enrollment: enrollment, complete: complete };
  };

  var progressFor = function (slug) {
    var enrollment = enrollmentFor(slug);
    if (!enrollment) return { completed: 0, total: 0, percent: 0, enrollment: null };
    var total = Number(enrollment.total) || 0;
    var completed = Array.isArray(enrollment.completed) ? enrollment.completed.length : 0;
    var percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
    return { completed: completed, total: total, percent: percent, enrollment: enrollment };
  };

  /* ---------- Session & demo accounts ---------- */
  var session = function () {
    return read("session", null) || readSession("session", null);
  };

  var setSession = function (user, remember) {
    var safe = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt || new Date().toISOString(),
      demo: !!user.demo
    };
    try {
      if (remember) {
        window.localStorage.setItem(PREFIX + "session", JSON.stringify(safe));
        window.sessionStorage.removeItem(PREFIX + "session");
      } else {
        window.sessionStorage.setItem(PREFIX + "session", JSON.stringify(safe));
        window.localStorage.removeItem(PREFIX + "session");
      }
    } catch (error) {
      /* session may be unavailable */
    }
    return safe;
  };

  var clearSession = function () {
    try {
      window.localStorage.removeItem(PREFIX + "session");
      window.sessionStorage.removeItem(PREFIX + "session");
    } catch (error) {
      /* no-op */
    }
  };

  var users = function () {
    var value = read("users", []);
    return Array.isArray(value) ? value : [];
  };

  var addUser = function (user) {
    var list = users();
    list.push(user);
    write("users", list);
    return user;
  };

  /* ---------- Activity ---------- */
  var activity = function () {
    var value = read("activity", []);
    return Array.isArray(value) ? value : [];
  };

  var logActivity = function (type, text, slug) {
    var list = activity();
    list.unshift({
      id: util.uid(),
      type: type || "activity",
      text: text || "",
      slug: slug || "",
      at: new Date().toISOString()
    });
    write("activity", list.slice(0, 12));
  };

  /* ---------- Flash messages between pages ---------- */
  var flash = function (type, message) {
    try {
      window.sessionStorage.setItem(PREFIX + "flash", JSON.stringify({ type: type, message: message }));
    } catch (error) {
      /* no-op */
    }
  };

  var consumeFlash = function () {
    try {
      var raw = window.sessionStorage.getItem(PREFIX + "flash");
      if (!raw) return null;
      window.sessionStorage.removeItem(PREFIX + "flash");
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  };

  window.LS = window.LS || {};
  window.LS.util = util;
  window.LS.store = {
    get: read,
    set: write,
    remove: remove,
    saved: savedList,
    isSaved: function (slug) {
      return savedList().indexOf(slug) > -1;
    },
    toggleSaved: function (slug) {
      return toggleInList("saved", slug);
    },
    favorites: favoriteList,
    isFavorite: function (slug) {
      return favoriteList().indexOf(slug) > -1;
    },
    toggleFavorite: function (slug) {
      return toggleInList("favorites", slug);
    },
    enrollments: allEnrollments,
    enrollment: enrollmentFor,
    enroll: enroll,
    toggleLesson: toggleLesson,
    progress: progressFor,
    session: session,
    setSession: setSession,
    clearSession: clearSession,
    users: users,
    addUser: addUser,
    activity: activity,
    logActivity: logActivity,
    messages: function () {
      var value = read("messages", []);
      return Array.isArray(value) ? value : [];
    },
    addMessage: function (message) {
      var list = window.LS.store.messages();
      list.unshift(message);
      write("messages", list.slice(0, 20));
      return message;
    },
    reviews: function () {
      var value = read("reviews", []);
      return Array.isArray(value) ? value : [];
    },
    addReview: function (review) {
      var list = window.LS.store.reviews();
      list.unshift(review);
      write("reviews", list.slice(0, 50));
      return review;
    },
    newsletter: function (email) {
      var list = read("newsletter", []);
      if (!Array.isArray(list)) list = [];
      if (list.indexOf(email) === -1) list.push(email);
      write("newsletter", list);
    },
    flash: flash,
    consumeFlash: consumeFlash
  };
})();
