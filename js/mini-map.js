/* =====================================================
   mini-map.js — упрощённая карта атак для главной страницы
   Полная версия — в pages/cyber_map.html
   ===================================================== */

(function() {
  const countries = [
    { code: "US", x: 180, y: 150, flag: "🇺🇸" },
    { code: "CN", x: 780, y: 170, flag: "🇨🇳" },
    { code: "RU", x: 650, y: 110, flag: "🇷🇺" },
    { code: "DE", x: 500, y: 130, flag: "🇩🇪" },
    { code: "GB", x: 455, y: 138, flag: "🇬🇧" },
    { code: "KR", x: 830, y: 180, flag: "🇰🇷" },
    { code: "JP", x: 878, y: 192, flag: "🇯🇵" },
    { code: "IN", x: 720, y: 255, flag: "🇮🇳" },
    { code: "BR", x: 270, y: 340, flag: "🇧🇷" },
    { code: "AU", x: 840, y: 370, flag: "🇦🇺" },
    { code: "IR", x: 620, y: 200, flag: "🇮🇷" },
    { code: "UA", x: 560, y: 135, flag: "🇺🇦" },
    { code: "KP", x: 820, y: 170, flag: "🇰🇵" },
    { code: "FR", x: 480, y: 150, flag: "🇫🇷" },
    { code: "CA", x: 160, y: 100, flag: "🇨🇦" }
  ];

  const attackTypes = [
    { code: "ddos",     name: "DDoS",       color: "#ff4466" },
    { code: "malware",  name: "MALWARE",    color: "#ffaa00" },
    { code: "phishing", name: "PHISH",      color: "#00d4ff" },
    { code: "ransom",   name: "RANSOM",     color: "#ff00ff" }
  ];

  const attackerWeights = {
    "CN": 25, "RU": 22, "US": 18, "KP": 12, "IR": 10,
    "UA": 6, "IN": 6, "BR": 5, "DE": 4, "FR": 3, "GB": 3, "KR": 3
  };
  const targetWeights = {
    "US": 30, "DE": 12, "GB": 10, "FR": 8, "JP": 8, "KR": 7,
    "CA": 6, "AU": 5, "IN": 5, "BR": 4, "CN": 8, "RU": 5, "UA": 10
  };

  const citiesLayer = document.getElementById("mini-cities");
  if (!citiesLayer) return; // Скрипт подключен не на главной

  countries.forEach(c => {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", c.x);
    dot.setAttribute("cy", c.y);
    dot.setAttribute("r", 2.5);
    dot.setAttribute("fill", "#00d4ff");
    dot.setAttribute("opacity", "0.8");
    citiesLayer.appendChild(dot);
  });

  let totalAttacks = 0;
  let activeAttacks = 0;
  let blockedAttacks = 0;

  function weightedRandom(weights) {
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (const [code, w] of Object.entries(weights)) {
      r -= w;
      if (r <= 0) return code;
    }
    return Object.keys(weights)[0];
  }

  const getCountry = code => countries.find(c => c.code === code);

  function createAttack() {
    const fromCode = weightedRandom(attackerWeights);
    let toCode = weightedRandom(targetWeights);
    while (toCode === fromCode) toCode = weightedRandom(targetWeights);

    const from = getCountry(fromCode);
    const to = getCountry(toCode);
    if (!from || !to) return;
    const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];

    drawAttack(from, to, type);
    logAttack(from, to, type);
    updateStats(type);
  }

  function drawAttack(from, to, type) {
    const linesLayer = document.getElementById("mini-attack-lines");
    const explosionsLayer = document.getElementById("mini-explosions");

    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2 - Math.abs(from.x - to.x) * 0.25;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`);
    path.setAttribute("stroke", type.color);
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("fill", "none");
    path.setAttribute("opacity", "0.9");
    path.style.strokeDasharray = 600;
    path.style.strokeDashoffset = 600;
    path.style.transition = "stroke-dashoffset 1.5s linear, opacity 0.4s";
    linesLayer.appendChild(path);

    requestAnimationFrame(() => { path.style.strokeDashoffset = 0; });

    const projectile = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    projectile.setAttribute("r", 2.5);
    projectile.setAttribute("fill", type.color);
    linesLayer.appendChild(projectile);

    const start = performance.now();
    (function step(now) {
      const t = Math.min((now - start) / 1500, 1);
      const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*mx + t*t*to.x;
      const y = (1-t)*(1-t)*from.y + 2*(1-t)*t*my + t*t*to.y;
      projectile.setAttribute("cx", x);
      projectile.setAttribute("cy", y);
      if (t < 1) requestAnimationFrame(step);
      else {
        projectile.remove();
        explode(to.x, to.y, type.color, explosionsLayer);
      }
    })(performance.now());

    setTimeout(() => {
      path.style.opacity = 0;
      setTimeout(() => path.remove(), 500);
    }, 2000);
  }

  function explode(x, y, color, layer) {
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", x); ring.setAttribute("cy", y);
    ring.setAttribute("r", 3);
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", color);
    ring.setAttribute("stroke-width", "1.5");
    layer.appendChild(ring);
    const start = performance.now();
    (function step(now) {
      const t = Math.min((now - start) / 800, 1);
      ring.setAttribute("r", 3 + t * 15);
      ring.setAttribute("opacity", 1 - t);
      if (t < 1) requestAnimationFrame(step);
      else ring.remove();
    })(performance.now());
  }

  const logContainer = document.getElementById("mini-log-container");
  const MAX_LOG = 4;

  function logAttack(from, to, type) {
    const entry = document.createElement("div");
    entry.className = "mini-log-entry " + type.code;
    const t = new Date().toLocaleTimeString("ru-RU");
    entry.innerHTML = `[${t.slice(0,5)}] <strong>${type.name}</strong> ${from.flag}→${to.flag}`;
    logContainer.prepend(entry);
    while (logContainer.children.length > MAX_LOG) {
      logContainer.removeChild(logContainer.lastChild);
    }
  }

  function updateStats(type) {
    totalAttacks++;
    activeAttacks++;
    if (Math.random() < 0.7) blockedAttacks++;
    setTimeout(() => { activeAttacks = Math.max(0, activeAttacks - 1); render(); }, 2000);
    render();
  }

  function render() {
    document.getElementById("mini-total").textContent = totalAttacks.toLocaleString("ru-RU");
    document.getElementById("mini-active").textContent = activeAttacks;
    document.getElementById("mini-blocked").textContent = blockedAttacks.toLocaleString("ru-RU");
  }

  // Запуск: первая волна сразу
  for (let i = 0; i < 2; i++) setTimeout(createAttack, i * 400);

  // Постоянная генерация
  function scheduleNext() {
    setTimeout(() => { createAttack(); scheduleNext(); }, 1000 + Math.random() * 900);
  }
  scheduleNext();
})();
