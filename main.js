(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav__toggle");
  var navMenu = document.getElementById("nav-menu");
  var navLinks = document.querySelectorAll(".nav__link");

  function closeNav() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = !navMenu.classList.contains("is-open");
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  var revealEls = document.querySelectorAll(".reveal");
  var revealGroups = document.querySelectorAll(".reveal-group");

  var motionOk =
    typeof window.matchMedia === "function" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function observeReveal() {
    if (!motionOk || typeof IntersectionObserver === "undefined") {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
      revealGroups.forEach(function (g) {
        g.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    revealEls.forEach(function (el) {
      if (el.closest(".reveal-group")) return;
      io.observe(el);
    });

    revealGroups.forEach(function (group) {
      io.observe(group);
    });
  }

  observeReveal();

  var skillFills = document.querySelectorAll(".skill-bar__fill");

  function animateSkillBars() {
    if (!motionOk || typeof IntersectionObserver === "undefined") {
      skillFills.forEach(function (fill) {
        var t = fill.getAttribute("data-target");
        if (t) fill.style.width = t + "%";
        fill.classList.add("is-animated");
      });
      return;
    }

    var skillIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var fill = entry.target;
          var target = fill.getAttribute("data-target");
          if (target) {
            requestAnimationFrame(function () {
              fill.style.width = target + "%";
            });
          }
          fill.classList.add("is-animated");
          skillIo.unobserve(fill);
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.2 }
    );

    skillFills.forEach(function (fill) {
      skillIo.observe(fill);
    });
  }

  animateSkillBars();

  var sectionIds = ["inicio", "sobre-mi", "proyectos", "habilidades", "contacto"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function updateActiveNav() {
    if (sections.length === 0) return;
    var scrollPos = window.scrollY + (header ? header.offsetHeight + 24 : 80);
    var current = sections[0].id;

    for (var i = sections.length - 1; i >= 0; i--) {
      var sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        current = sec.id;
        break;
      }
    }

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === "#" + current) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  updateActiveNav();

})();
