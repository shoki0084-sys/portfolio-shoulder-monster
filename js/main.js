(function () {
  "use strict";

  const cfg = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};

  function applyLineLinks() {
    const url = cfg.lineUrl;
    if (!url || url.includes("YOUR_LINE")) return;
    document.querySelectorAll("[data-line-url]").forEach((el) => {
      el.href = url;
      el.removeAttribute("aria-disabled");
    });
  }

  function applyOptionalLinks() {
    const map = [
      ["data-github-main", cfg.github],
      ["data-crowdworks", cfg.crowdworks],
      ["data-coconala", cfg.coconala],
    ];
    map.forEach(([attr, url]) => {
      if (!url) return;
      document.querySelectorAll(`[${attr}]`).forEach((el) => {
        el.href = url;
        el.hidden = false;
      });
    });
  }

  function applyWorkLinks() {
    const demos = cfg.demos || {};
    const repos = cfg.githubRepos || {};
    document.querySelectorAll("[data-demo]").forEach((el) => {
      const key = el.getAttribute("data-demo");
      const url = demos[key];
      if (url) {
        el.href = url;
        el.classList.remove("link-disabled");
      }
    });
    document.querySelectorAll("[data-repo]").forEach((el) => {
      const key = el.getAttribute("data-repo");
      const url = repos[key];
      if (url) {
        el.href = url;
        el.classList.remove("link-disabled");
      }
    });
  }

  function setupHeader() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");

    if (!header) return;

    window.addEventListener(
      "scroll",
      () => header.classList.toggle("is-scrolled", window.scrollY > 8),
      { passive: true }
    );

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("nav-open", open);
      });

      nav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.classList.remove("nav-open");
        });
      });
    }
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 72;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  function setupReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLineLinks();
    applyOptionalLinks();
    applyWorkLinks();
    setupHeader();
    setupSmoothScroll();
    setupReveal();
  });
})();
