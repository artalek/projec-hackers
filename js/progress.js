/* =====================================================
   progress.js — учебная траектория
   Отмечает посещённые разделы через localStorage
   ===================================================== */

(function() {
  const STORAGE_KEY = "hacker_site_progress";
  const TOTAL_STEPS = 10; // всего разделов в траектории

  // Мэппинг каждого «шага» к его уровню
  const stepLevels = {
    "white_hat": 1, "neophytes": 1, "script_kiddies": 1,
    "black_hat": 2, "grey_hat": 2, "hacktivists": 2,
    "state_sponsored": 3, "insider_threats": 3, "cyber_terrorists": 3, "suicide_hackers": 3
  };

  const levelSizes = { 1: 3, 2: 3, 3: 4 };

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function markVisited(step) {
    const p = getProgress();
    p[step] = true;
    saveProgress(p);
  }

  function render() {
    const progress = getProgress();

    // Отметить пройденные шаги
    const stepCards = document.querySelectorAll(".step-card[data-step]");
    const levelCounts = { 1: 0, 2: 0, 3: 0 };

    stepCards.forEach(card => {
      const step = card.dataset.step;
      if (progress[step]) {
        card.classList.add("completed");
        const lvl = stepLevels[step];
        if (lvl) levelCounts[lvl]++;
      }
    });

    // Прогресс по уровням
    [1, 2, 3].forEach(lvl => {
      const size = levelSizes[lvl];
      const done = levelCounts[lvl];
      const pct = Math.round((done / size) * 100);

      const fill = document.querySelector(`.level-progress-fill[data-level="${lvl}"]`);
      if (fill) fill.style.width = pct + "%";

      const text = document.querySelector(`[data-level-text="${lvl}"]`);
      if (text) text.textContent = `${done} / ${size}`;
    });

    // Общий прогресс
    const totalDone = levelCounts[1] + levelCounts[2] + levelCounts[3];
    const totalPct = Math.round((totalDone / TOTAL_STEPS) * 100);
    const overallFill = document.getElementById("overall-fill");
    const overallText = document.getElementById("overall-percent");
    if (overallFill) overallFill.style.width = totalPct + "%";
    if (overallText) overallText.textContent = totalPct + "%";
  }

  // При клике на шаг — отмечаем и даём перейти
  document.querySelectorAll(".step-card[data-step]").forEach(card => {
    card.addEventListener("click", () => {
      markVisited(card.dataset.step);
      // Переход происходит через href — не предотвращаем
    });
  });

  // Кнопка сброса
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Сбросить весь прогресс обучения?")) {
        localStorage.removeItem(STORAGE_KEY);
        render();
      }
    });
  }

  // Первый рендер
  render();

  // ====== ОТМЕТКА ПОСЕЩЕНИЯ ИЗНУТРИ РАЗДЕЛА ======
  // Если страница — один из разделов классификации, определяем step
  // по имени файла и отмечаем в прогрессе
  const path = window.location.pathname;
  const match = path.match(/\/([\w_]+)\.html/);
  if (match && stepLevels[match[1]] !== undefined) {
    markVisited(match[1]);
  }
})();
