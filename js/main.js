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

  const ACTIVITY_MULTIPLIER = {
    low: 1.2,
    moderate: 1.55,
    high: 1.725,
  };

  const GOAL_CONFIG = {
    cut: {
      title: "減量フェーズ",
      proteinPerKg: 2.0,
      deficit: (bmi) => (bmi >= 25 ? 500 : bmi >= 22 ? 400 : 300),
    },
    bulk: {
      title: "筋肥大フェーズ",
      proteinPerKg: 1.8,
      surplus: 250,
    },
    health: {
      title: "健康維持フェーズ",
      proteinPerKg: 1.6,
    },
  };

  function calcBmi(weightKg, heightCm) {
    const h = heightCm / 100;
    return weightKg / (h * h);
  }

  function bmiCategory(bmi) {
    if (bmi < 18.5) return "低体重";
    if (bmi < 25) return "普通";
    if (bmi < 30) return "やや肥満";
    return "肥満";
  }

  function calcBmr(gender, weightKg, heightCm, age) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return gender === "male" ? base + 5 : base - 161;
  }

  function buildAdvice(goal, data) {
    const { gender, age, height, weight, activity, bmi, bmiLabel, tdee, targetCal, proteinG, training } = data;
    const genderNote = gender === "male" ? "男性" : "女性";
    const activityNote =
      activity === "low"
        ? "デスクワーク中心"
        : activity === "moderate"
          ? "週2〜3回の運動"
          : "週4回以上の運動";

    if (goal === "cut") {
      const weeklyLoss = Math.round((data.deficit * 7) / 7200 * 10) / 10;
      let extra = "";
      if (bmi >= 25) {
        extra = "BMIがやや高めなので、まずは食事の記録と歩数を増やすところから始めると続きやすいです。";
      } else if (bmi < 20) {
        extra = "BMIが低めのため、急激な減量は避け、筋トレを維持しながらゆっくり落とすのがおすすめです。";
      } else {
        extra = "無理な断食より、PFCバランスを整えた食事で進めると筋肉を落としにくくなります。";
      }
      return `${genderNote}・${age}歳・${height}cm/${weight}kg（BMI ${bmi.toFixed(1)}・${bmiLabel}）の方へ。活動レベルは「${activityNote}」として、1日の目標カロリーは約${targetCal}kcal（維持${tdee}kcal − ${data.deficit}kcal）。タンパク質は${proteinG}g/日（体重×2g前後）を意識し、${training}。睡眠7時間・水分2Lを優先すると、週${weeklyLoss}kg前後のペースで脂肪落ちが安定しやすくなります。${extra}`;
    }

    if (goal === "bulk") {
      let extra = "";
      if (bmi >= 25) {
        extra = "BMIが高めの場合は、先に減量フェーズで体脂肪を整えてから増量に移ると見た目の変化が出やすいです。";
      } else if (age >= 40) {
        extra = "40代以降は回復に時間がかかるため、週4回より「質の高い週3回」を優先するのも有効です。";
      } else {
        extra = "漸進的オーバーロード（前回より少し重く／回数を増やす）を意識すると、効率よく筋量を伸ばせます。";
      }
      return `${genderNote}・${age}歳・${height}cm/${weight}kg（BMI ${bmi.toFixed(1)}）の方へ。維持カロリー${tdee}kcalに+${data.surplus}kcal、目標は約${targetCal}kcal/日。タンパク質${proteinG}g/日（1.8g/kg前後）を確保し、${training}。${extra}`;
    }

    let extra = "";
    if (age >= 50) {
      extra = "50代以降は筋量維持が重要なので、週2回の筋トレは継続したまま、有酸素を少しずつ増やしていくのがおすすめです。";
    } else if (activity === "low") {
      extra = "デスクワーク中心の方は、1日8000歩や階段の利用など、日常の活動量を少しずつ上げるだけでも効果があります。";
    } else {
      extra = "加工食品を減らし、野菜・良質な脂質・睡眠を整えると、無理なく続けやすくなります。";
    }
    return `${genderNote}・${age}歳・${height}cm/${weight}kg（BMI ${bmi.toFixed(1)}・${bmiLabel}）の方へ。維持カロリーは約${tdee}kcal、タンパク質${proteinG}g/日を目安に。${training}に加え、週150分以上の有酸素運動が健康維持の目安です。${extra}`;
  }

  function renderStats(container, stats) {
    container.innerHTML = stats
      .map(
        ({ label, value }) =>
          `<div class="diagnosis-stat"><span class="diagnosis-stat-label">${label}</span><span class="diagnosis-stat-value">${value}</span></div>`
      )
      .join("");
  }

  function setupDiagnosis() {
    const form = document.getElementById("diagnosis-form");
    const buttons = document.querySelectorAll(".diagnosis-btn");
    const resultBox = document.getElementById("diagnosis-result");
    const titleEl = document.getElementById("diagnosis-result-title");
    const statsEl = document.getElementById("diagnosis-stats");
    const textEl = document.getElementById("diagnosis-result-text");
    const errorEl = document.getElementById("diagnosis-form-error");
    if (!form || !buttons.length || !resultBox || !titleEl || !statsEl || !textEl) return;

    let selectedGoal = null;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedGoal = btn.getAttribute("data-goal");
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        if (errorEl) errorEl.hidden = true;
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;

      const fd = new FormData(form);
      const gender = fd.get("gender");
      const age = Number(fd.get("age"));
      const height = Number(fd.get("height"));
      const weight = Number(fd.get("weight"));
      const activity = fd.get("activity");

      if (!gender || !activity || !selectedGoal) {
        if (errorEl) {
          errorEl.textContent = !selectedGoal
            ? "目標（減量・筋肥大・健康維持）を選んでから診断してください。"
            : "すべての項目を入力してください。";
          errorEl.hidden = false;
        }
        return;
      }

      if (age < 15 || age > 80 || height < 130 || height > 220 || weight < 30 || weight > 200) {
        if (errorEl) {
          errorEl.textContent = "入力値が範囲外です。年齢15〜80、身長130〜220cm、体重30〜200kgで入力してください。";
          errorEl.hidden = false;
        }
        return;
      }

      const bmi = calcBmi(weight, height);
      const bmiLabel = bmiCategory(bmi);
      const bmr = Math.round(calcBmr(gender, weight, height, age));
      const tdee = Math.round(bmr * ACTIVITY_MULTIPLIER[activity]);
      const config = GOAL_CONFIG[selectedGoal];

      let targetCal = tdee;
      let deficit = 0;
      let surplus = 0;
      let training = "";

      if (selectedGoal === "cut") {
        deficit = config.deficit(bmi);
        targetCal = Math.max(tdee - deficit, Math.round(bmr * 1.1));
        training = "筋トレは週2〜3回を維持";
      } else if (selectedGoal === "bulk") {
        surplus = config.surplus;
        targetCal = tdee + surplus;
        training = activity === "high" ? "週4〜5回の分割トレーニング" : "週3〜4回の筋トレ";
      } else {
        training = "週2回の筋トレ";
      }

      const proteinG = Math.round(weight * config.proteinPerKg);

      const adviceData = {
        gender,
        age,
        height,
        weight,
        activity,
        bmi,
        bmiLabel,
        tdee,
        targetCal,
        proteinG,
        training,
        deficit,
        surplus,
      };

      titleEl.textContent = config.title;
      renderStats(statsEl, [
        { label: "BMI", value: `${bmi.toFixed(1)}（${bmiLabel}）` },
        { label: "推定維持カロリー", value: `${tdee} kcal/日` },
        { label: "目標カロリー", value: `${targetCal} kcal/日` },
        { label: "タンパク質目安", value: `${proteinG} g/日` },
      ]);
      textEl.textContent = buildAdvice(selectedGoal, adviceData);
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
