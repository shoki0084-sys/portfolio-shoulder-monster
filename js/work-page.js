/** 作品ごとのスクリーンショット（images/works/capture/ 内のファイル名・拡張子 .png） */
const WORK_SCREENSHOTS = {
  bodymake: ["bodymake", "bodymake2", "bodymake3", "bodymake4"],
  quiz: ["quiz", "quiz2", "quiz3", "quiz4"],
  difyLine: ["dify-line"],
  meal: ["meal", "meal2", "meal3"],
  meetMinutes: ["meet-minutes", "meet-minutes2"],
  touring: ["touring", "touring2", "touring3", "touring4", "touring5"],
};

function setupWorkGallery() {
  const page = document.body.dataset.workPage;
  const stems = WORK_SCREENSHOTS[page];
  const container = document.querySelector("[data-work-gallery]");
  if (!stems?.length || !container) return;

  const workTitle =
    document.querySelector(".page-hero h1")?.textContent?.trim() || "作品";
  const section = container.closest(".work-gallery-section");

  if (stems.length === 1) {
    if (section) section.hidden = true;
    return;
  }

  if (section) section.hidden = false;
  const heroThumb = document.querySelector(".page-hero-thumb");
  if (heroThumb) heroThumb.hidden = true;

  container.classList.add("work-gallery--multi");
  container.innerHTML = "";

  stems.forEach((stem, i) => {
    const fig = document.createElement("figure");
    fig.className = "work-gallery-item";

    const img = document.createElement("img");
    img.src = `images/works/capture/${stem}.png`;
    img.alt = `${workTitle}の画面 ${i + 1}`;
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    img.width = 1280;
    img.height = 800;

    const cap = document.createElement("figcaption");
    cap.textContent = `画面 ${i + 1}`;

    fig.append(img, cap);
    container.appendChild(fig);
  });
}

/** Work detail pages: same header behavior + link config */
document.addEventListener("DOMContentLoaded", () => {
  setupWorkGallery();

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
