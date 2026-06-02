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

    function shouldApplyLink(el) {
      const href = el.getAttribute("href") || "";
      return el.classList.contains("link-disabled") || href === "" || href === "#";
    }

    document.querySelectorAll("[data-demo]").forEach((el) => {
      const key = el.getAttribute("data-demo");
      const url = demos[key];
      if (!url) return;
      if (shouldApplyLink(el)) {
        el.href = url;
        el.classList.remove("link-disabled");
      }
    });
    document.querySelectorAll("[data-repo]").forEach((el) => {
      const key = el.getAttribute("data-repo");
      const url = repos[key];
      if (!url) return;
      if (shouldApplyLink(el)) {
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

  const DIAGNOSIS_ADVICE = {
    cut: {
      title: "減量フェーズ",
      text:
        "カロリーはゆっくりマイナス（週0.5kg前後が目安）。タンパク質は体重×2g前後を意識し、筋トレは週2〜3回維持。睡眠7時間・水分2Lを優先すると脂肪落ちが安定しやすくなります。",
    },
    bulk: {
      title: "筋肥大フェーズ",
      text:
        "漸進的オーバーロードと十分なタンパク質（1.6〜2g/kg）が基本。週4〜5回の分割か、全身を週3回。カロリーは維持〜+200kcalから様子を見て調整しましょう。",
    },
    health: {
      title: "健康維持フェーズ",
      text:
        "週150分以上の有酸素＋週2回の筋トレが目安。加工食品は減らし、野菜・良質な脂質・睡眠を整えると、無理なく続けやすくなります。",
    },
  };

  function setupDiagnosis() {
    const buttons = document.querySelectorAll(".diagnosis-btn");
    const resultBox = document.getElementById("diagnosis-result");
    const titleEl = document.getElementById("diagnosis-result-title");
    const textEl = document.getElementById("diagnosis-result-text");
    if (!buttons.length || !resultBox || !titleEl || !textEl) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const goal = btn.getAttribute("data-goal");
        const advice = DIAGNOSIS_ADVICE[goal];
        if (!advice) return;

        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        titleEl.textContent = advice.title;
        textEl.textContent = advice.text;
        resultBox.hidden = false;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLineLinks();
    applyOptionalLinks();
    applyWorkLinks();
    setupHeader();
    setupSmoothScroll();
    setupReveal();
    setupDiagnosis();
  });
})();
