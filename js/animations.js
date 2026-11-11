/* =========================================================
   LearnSphere Academy — Scroll reveals, counters,
   FAQ accordions and the testimonial slider
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reveal on scroll ---------- */
  var revealObserver = null;

  function observeReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal:not(.is-visible)"));
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
    }

    items.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  /* ---------- Animated counters ---------- */
  function animateCounter(el) {
    var target = Number(el.getAttribute("data-count")) || 0;
    if (reduceMotion) {
      el.textContent = LS.util.formatNumber(target);
      return;
    }
    var duration = 1600;
    var start = null;
    function frame(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min(1, (timestamp - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = LS.util.formatNumber(value);
      if (progress < 1) window.requestAnimationFrame(frame);
      else el.textContent = LS.util.formatNumber(target);
    }
    window.requestAnimationFrame(frame);
  }

  function initCounters() {
    var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    if (!counters.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      counters.forEach(animateCounter);
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ---------- Accordions ---------- */
  function initAccordions() {
    var roots = Array.prototype.slice.call(document.querySelectorAll("[data-accordion]"));
    roots.forEach(function (root) {
      var items = Array.prototype.slice.call(root.querySelectorAll(".accordion-item"));
      items.forEach(function (item) {
        var trigger = item.querySelector(".accordion-trigger");
        var panel = item.querySelector(".accordion-panel");
        if (!trigger || !panel) return;

        /* Bind each trigger exactly once. initAccordions() runs at
           DOMContentLoaded and again from LS.animations.refresh() when
           rendered content (featured courses, instructor grids) is
           injected; a second listener would make every click toggle
           twice and the accordion would appear unresponsive. */
        if (trigger.getAttribute("data-accordion-bound") === "true") return;
        trigger.setAttribute("data-accordion-bound", "true");

        if (!panel.id) panel.id = "accordion-panel-" + Math.random().toString(36).slice(2, 8);
        trigger.setAttribute("aria-controls", panel.id);
        trigger.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
        panel.setAttribute("aria-hidden", item.classList.contains("is-open") ? "false" : "true");

        function setState(open) {
          item.classList.toggle("is-open", open);
          trigger.setAttribute("aria-expanded", open ? "true" : "false");
          panel.setAttribute("aria-hidden", open ? "false" : "true");
          if ("inert" in panel) panel.inert = !open;
        }

        if (!item.classList.contains("is-open")) setState(false);

        trigger.addEventListener("click", function () {
          var willOpen = !item.classList.contains("is-open");
          if (willOpen && root.hasAttribute("data-accordion-single")) {
            items.forEach(function (other) {
              if (other !== item) {
                other.classList.remove("is-open");
                var otherTrigger = other.querySelector(".accordion-trigger");
                var otherPanel = other.querySelector(".accordion-panel");
                if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
                if (otherPanel) {
                  otherPanel.setAttribute("aria-hidden", "true");
                  if ("inert" in otherPanel) otherPanel.inert = true;
                }
              }
            });
          }
          setState(willOpen);
        });
      });
    });
  }

  /* ---------- Testimonial slider ---------- */
  function initTestimonials() {
    var roots = Array.prototype.slice.call(document.querySelectorAll("[data-testimonial]"));
    roots.forEach(function (root) {
      var track = root.querySelector(".testimonial-track");
      var slides = Array.prototype.slice.call(root.querySelectorAll(".testimonial-slide"));
      var dotsWrap = root.querySelector("[data-slider-dots]");
      var prev = root.querySelector("[data-slider-prev]");
      var next = root.querySelector("[data-slider-next]");
      if (!track || slides.length < 2) return;

      var index = 0;
      var timer = null;
      var autoplay = root.getAttribute("data-autoplay") !== "false" && !reduceMotion;
      var interval = Number(root.getAttribute("data-interval")) || 6500;

      if (dotsWrap) {
        slides.forEach(function (slide, position) {
          var dot = document.createElement("button");
          dot.type = "button";
          dot.className = "testimonial-dot" + (position === 0 ? " is-active" : "");
          dot.setAttribute("aria-label", "Go to testimonial " + (position + 1));
          dot.setAttribute("aria-current", position === 0 ? "true" : "false");
          dot.addEventListener("click", function () {
            go(position);
            restart();
          });
          dotsWrap.appendChild(dot);
        });
      }

      function go(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        track.style.transform = "translateX(" + index * -100 + "%)";
        slides.forEach(function (slide, position) {
          var active = position === index;
          slide.setAttribute("aria-hidden", active ? "false" : "true");
          if ("inert" in slide) slide.inert = !active;
        });
        if (dotsWrap) {
          Array.prototype.forEach.call(dotsWrap.children, function (dot, position) {
            dot.classList.toggle("is-active", position === index);
            dot.setAttribute("aria-current", position === index ? "true" : "false");
          });
        }
      }

      function start() {
        if (!autoplay) return;
        stop();
        timer = window.setInterval(function () {
          go(index + 1);
        }, interval);
      }

      function stop() {
        if (timer) window.clearInterval(timer);
        timer = null;
      }

      function restart() {
        stop();
        start();
      }

      if (prev)
        prev.addEventListener("click", function () {
          go(index - 1);
          restart();
        });
      if (next)
        next.addEventListener("click", function () {
          go(index + 1);
          restart();
        });

      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", function (event) {
        if (!root.contains(event.relatedTarget)) start();
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) stop();
        else start();
      });

      var touchStart = 0;
      track.addEventListener(
        "touchstart",
        function (event) {
          touchStart = event.changedTouches[0].clientX;
          stop();
        },
        { passive: true }
      );
      track.addEventListener(
        "touchend",
        function (event) {
          var delta = event.changedTouches[0].clientX - touchStart;
          if (Math.abs(delta) > 45) go(index + (delta < 0 ? 1 : -1));
          start();
        },
        { passive: true }
      );

      go(0);
      start();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    observeReveals();
    initCounters();
    initAccordions();
    initTestimonials();
    window.setTimeout(observeReveals, 900);
  });

  window.LS = window.LS || {};
  window.LS.animations = {
    refresh: function () {
      observeReveals();
      initAccordions();
    },
    initTestimonials: initTestimonials
  };
})();
