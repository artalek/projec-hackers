/* =====================================================
   progress.js — учебная траектория
   Линейный порядок: каждый шаг открывается только
   после завершения предыдущего. Блокирует и nav-ссылки.
   ===================================================== */

(function() {
  const STORAGE_KEY = "hacker_site_progress";

  const ORDER = [
    "white_hat", "neophytes", "script_kiddies",
    "black_hat", "grey_hat", "hacktivists",
    "state_sponsored", "insider_threats", "cyber_terrorists", "suicide_hackers"
  ];

  const STEP_NAMES = {
    white_hat:        "White Hat · Этичные хакеры",
    neophytes:        "Neophytes · Новички",
    script_kiddies:   "Script Kiddies",
    black_hat:        "Black Hat · Киберпреступники",
    grey_hat:         "Grey Hat · Серая зона",
    hacktivists:      "Hacktivists · Хактивисты",
    state_sponsored:  "State-Sponsored · Госхакеры",
    insider_threats:  "Insider Threats · Инсайдеры",
    cyber_terrorists: "Cyber-terrorists · Кибертеррористы",
    suicide_hackers:  "Suicide Hackers · Открытые взломщики"
  };

  const stepLevels = {
    white_hat: 1, neophytes: 1, script_kiddies: 1,
    black_hat: 2, grey_hat: 2, hacktivists: 2,
    state_sponsored: 3, insider_threats: 3, cyber_terrorists: 3, suicide_hackers: 3
  };
  const levelSizes = { 1: 3, 2: 3, 3: 4 };

  // ── Хранилище ──────────────────────────────────────
  function getProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }
  function saveProgress(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function markVisited(step)  { const p = getProgress(); p[step] = true; saveProgress(p); }

  function getNextIdx(progress) {
    for (let i = 0; i < ORDER.length; i++) {
      if (!progress[ORDER[i]]) return i;
    }
    return ORDER.length;
  }

  // ── Toast ──────────────────────────────────────────
  function showToast(msg) {
    let t = document.getElementById("progress-toast");
    if (!t) { t = document.createElement("div"); t.id = "progress-toast"; document.body.appendChild(t); }
    t.textContent = "🔒 " + msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(() => t.classList.remove("show"), 2800);
  }

  // ── Рендер ─────────────────────────────────────────
  function render() {
    const progress = getProgress();
    const nextIdx  = getNextIdx(progress);
    const levelCounts = { 1: 0, 2: 0, 3: 0 };

    // Шаги в учебной траектории
    document.querySelectorAll(".step-card[data-step]").forEach(card => {
      const step    = card.dataset.step;
      const stepIdx = ORDER.indexOf(step);
      const done    = !!progress[step];
      const locked  = stepIdx > nextIdx;
      card.classList.toggle("completed", done);
      card.classList.toggle("locked",    locked);
      if (done && stepLevels[step]) levelCounts[stepLevels[step]]++;
    });

    // Навигационные ссылки — открыты только пройденные
    document.querySelectorAll(".nav-links a[href]").forEach(link => {
      const m = link.getAttribute("href").match(/([\w_]+)\.html/);
      if (!m) return;
      const step    = m[1];
      const stepIdx = ORDER.indexOf(step);
      if (stepIdx === -1) return;
      const visited   = !!progress[step];
      const isCurrent = link.classList.contains("active");
      link.classList.toggle("nav-link-done",   visited);
      link.classList.toggle("nav-link-locked", !visited && !isCurrent);
    });

    // Прогресс-бары уровней
    [1, 2, 3].forEach(lvl => {
      const done = levelCounts[lvl];
      const pct  = Math.round((done / levelSizes[lvl]) * 100);
      const fill = document.querySelector(`.level-progress-fill[data-level="${lvl}"]`);
      const text = document.querySelector(`[data-level-text="${lvl}"]`);
      if (fill) fill.style.width  = pct + "%";
      if (text) text.textContent = `${done} / ${levelSizes[lvl]}`;
    });

    // Общий прогресс
    const totalDone = levelCounts[1] + levelCounts[2] + levelCounts[3];
    const totalPct  = Math.round((totalDone / ORDER.length) * 100);
    const oFill  = document.getElementById("overall-fill");
    const oLabel = document.getElementById("overall-percent");
    if (oFill)  oFill.style.width  = totalPct + "%";
    if (oLabel) oLabel.textContent = totalPct + "%";
  }

  // ── Клики по шагам траектории ─────────────────────
  document.querySelectorAll(".step-card[data-step]").forEach(card => {
    card.addEventListener("click", e => {
      const step    = card.dataset.step;
      const stepIdx = ORDER.indexOf(step);
      const nextIdx = getNextIdx(getProgress());
      if (stepIdx > nextIdx) {
        e.preventDefault();
        const prev = ORDER[stepIdx - 1];
        showToast("Сначала завершите: " + (STEP_NAMES[prev] || prev));
      } else {
        markVisited(step);
      }
    });
  });


  // ── Клики по навигационным ссылкам ────────────────
  document.querySelectorAll(".nav-links a[href]").forEach(link => {
    link.addEventListener("click", e => {
      if (!link.classList.contains("nav-link-locked")) return;
      e.preventDefault();
      showToast("Сначала изучите этот раздел через учебную траекторию на главной");
    });
  });

  // ── Кнопка сброса ─────────────────────────────────
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Сбросить весь прогресс обучения?")) {
        localStorage.removeItem(STORAGE_KEY);
        render();
      }
    });
  }

  render();

  // ── Отметка при посещении страницы раздела ────────
  // Любой визит засчитывается — порядок соблюдают только
  // карточки учебной траектории на главной странице.
  const path  = window.location.pathname;
  const match = path.match(/\/([\w_]+)\.html/);
  if (match && ORDER.indexOf(match[1]) !== -1) {
    markVisited(match[1]);
    render();
  }
})();
