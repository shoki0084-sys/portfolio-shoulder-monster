/** Work detail pages: same header behavior + link config */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE_CONFIG === "undefined") return;
  const cfg = SITE_CONFIG;
  const page = document.body.dataset.workPage;
  if (cfg.lineUrl && !cfg.lineUrl.includes("YOUR_LINE")) {
    document.querySelectorAll("[data-line-url]").forEach((el) => {
      el.href = cfg.lineUrl;
    });
  }
  if (page && cfg.demos && cfg.demos[page]) {
    const d = document.querySelector("[data-demo-page]");
    if (d) {
      d.href = cfg.demos[page];
      d.classList.remove("link-disabled");
    }
  }
  if (page && cfg.githubRepos && cfg.githubRepos[page]) {
    const g = document.querySelector("[data-repo-page]");
    if (g) {
      g.href = cfg.githubRepos[page];
      g.classList.remove("link-disabled");
    }
  }
});
