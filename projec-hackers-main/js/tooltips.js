/* =====================================================
   tooltips.js — автоматические подсказки к терминам
   Находит в тексте сложные слова и показывает их
   определения при наведении. Источник — мини-глоссарий.
   ===================================================== */

(function() {
  // =================================================
  // БАЗА ТЕРМИНОВ (сокращённая версия глоссария)
  // Ключ — варианты написания через |
  // =================================================
  const GLOSSARY = {
    "APT|APT-группировка|APT-группировки": {
      title: "APT (Advanced Persistent Threat)",
      def: "Продвинутая постоянная угроза. Элитные хакерские группировки, годами незаметно присутствующие в сети жертвы. Обычно связаны со спецслужбами государств."
    },
    "DDoS|DDoS-атака|DDoS-атаки|DDoS-атак": {
      title: "DDoS-атака",
      def: "Распределённая атака на отказ в обслуживании. Тысячи устройств одновременно бомбардируют сайт запросами, из-за чего он перестаёт отвечать обычным пользователям."
    },
    "Ransomware": {
      title: "Ransomware",
      def: "Вымогательское ПО. Шифрует файлы жертвы и требует выкуп за расшифровку. WannaCry в 2017 заразил 200 000 компьютеров в 150 странах."
    },
    "SWIFT": {
      title: "SWIFT",
      def: "Международная сеть межбанковских переводов. Излюбленная цель продвинутых хакерских групп — через неё украли 81 млн долларов у ЦБ Бангладеш в 2016."
    },
    "Darknet|Даркнет": {
      title: "Darknet",
      def: "Скрытая часть интернета, доступная только через специальные программы (Tor). Там работают теневые площадки с украденными данными и вредоносным ПО."
    },
    "Bug Bounty": {
      title: "Bug Bounty",
      def: "Программы вознаграждений от компаний за найденные уязвимости. Google платит до $1,5 млн, Apple — до $2 млн за критические находки."
    },
    "Пентест|пентест|Пентесте|Пентеста": {
      title: "Пентест",
      def: "Тестирование на проникновение. Легальная имитация атаки: специалист пробует взломать сеть компании, чтобы заранее найти слабые места."
    },
    "Script Kiddies|Script Kiddie|скрипт-кидди|Скрипт-кидди": {
      title: "Script Kiddie",
      def: "Скрипт-кидди. Новички без глубоких знаний, запускающие чужие готовые утилиты для взлома ради самоутверждения."
    },
    "Red Teaming": {
      title: "Red Teaming",
      def: "«Красная команда». Комплексная имитация атаки: проверяются не только техника, но и сотрудники и физическая охрана."
    },
    "NDA": {
      title: "NDA",
      def: "Соглашение о неразглашении. Юридический документ, обязывающий этичного хакера не передавать данные об уязвимостях третьим лицам."
    },
    "Scope|скоуп": {
      title: "Scope",
      def: "Границы проверки при пентесте: список IP и доменов, которые разрешено атаковать. Выход за рамки — уже преступление."
    },
    "Zero Trust": {
      title: "Zero Trust",
      def: "«Нулевое доверие». Подход к защите, при котором ни один пользователь и ни одно устройство внутри сети не считаются доверенными по умолчанию."
    },
    "Zero-day|zero-day|уязвимости нулевого дня|уязвимость нулевого дня": {
      title: "Zero-day",
      def: "Уязвимость нулевого дня — неизвестная разработчику ошибка, для которой ещё нет исправления. Zero-day для iOS стоит до $2,5 млн."
    },
    "Stuxnet": {
      title: "Stuxnet (2010)",
      def: "Компьютерный червь, созданный для саботажа иранской ядерной программы. Первый случай, когда код физически разрушал промышленное оборудование."
    },
    "АСУ ТП": {
      title: "АСУ ТП",
      def: "Автоматизированная система управления технологическим процессом — комплекс, управляющий электростанциями, заводами, водоснабжением."
    },
    "ПЛК": {
      title: "ПЛК",
      def: "Программируемый логический контроллер. Устройство, управляющее промышленным оборудованием. Именно ПЛК атаковал Stuxnet."
    },
    "CaaS|Cybercrime-as-a-Service": {
      title: "CaaS",
      def: "Cybercrime-as-a-Service. Теневая модель: ботнеты и ransomware сдают в аренду тем, у кого нет технических навыков."
    },
    "CFAA": {
      title: "CFAA",
      def: "Computer Fraud and Abuse Act — основной закон США о компьютерных преступлениях. По нему судили Кевина Митника и Аарона Шварца."
    },
    "CEH": {
      title: "CEH",
      def: "Certified Ethical Hacker — международный сертификат этичного хакера. Подтверждает владение хакерскими инструментами для легальной работы."
    },
    "OSCP": {
      title: "OSCP",
      def: "Offensive Security Certified Professional. Практический сертификат: за 24 часа надо реально взломать несколько учебных машин."
    },
    "CISSP": {
      title: "CISSP",
      def: "Престижный сертификат для архитекторов и руководителей отделов ИБ. Требует 5 лет опыта."
    },
    "CompTIA Security\\+|Security\\+": {
      title: "CompTIA Security+",
      def: "Начальный международный сертификат по ИБ. Первый шаг в профессию — его ценят работодатели в США."
    },
    "BlackEnergy": {
      title: "BlackEnergy",
      def: "Вредоносное ПО, использованное в атаке на энергосистему Украины в 2015 году. Оставило 230 000 человек без света."
    },
    "Cozy Bear|Fancy Bear|Lazarus|Lazarus Group": {
      title: "APT-группы",
      def: "Кодовые имена элитных хакерских групп: Cozy Bear и Fancy Bear связывают с РФ, Lazarus Group — с КНДР (атаки на SWIFT, WannaCry)."
    },
    "бэкдор|Бэкдор": {
      title: "Бэкдор",
      def: "Скрытый способ доступа в систему, который злоумышленник оставляет для повторных посещений. Может быть программным или аппаратным."
    },
    "ботнет|Ботнет|ботнета|ботнетов|ботнеты": {
      title: "Ботнет",
      def: "Сеть заражённых компьютеров под удалённым управлением. Используется для DDoS, спама и брутфорса паролей."
    },
    "фишинг|Фишинг|фишинговые|фишингом": {
      title: "Фишинг",
      def: "Мошенничество: письмо от «банка» или «коллеги» обманом выманивает пароли или данные карт."
    },
    "кардинг|Кардинг": {
      title: "Кардинг",
      def: "Мошенничество с чужими банковскими картами: кража реквизитов и их продажа на теневых площадках."
    },
    "шифрование|Шифрование": {
      title: "Шифрование",
      def: "Преобразование данных так, что без ключа их нельзя прочитать. Основа защиты информации."
    },
    "Кэти Муссурис": {
      title: "Кэти Муссурис",
      def: "Пионер движения Bug Bounty. Запустила программы вознаграждений в Microsoft и Пентагоне."
    },
    "Чарли Миллер": {
      title: "Чарли Миллер",
      def: "Исследователь, публично продемонстрировавший удалённый взлом движущегося Jeep Cherokee. Производитель отозвал более миллиона машин."
    },
    "Трой Хант": {
      title: "Трой Хант",
      def: "Австралийский эксперт по ИБ, создатель сервиса Have I Been Pwned для проверки утечек email и паролей."
    },
    "Брюс Шнайер": {
      title: "Брюс Шнайер",
      def: "Американский криптограф и автор книг по ИБ. Известен фразой: «Любители взламывают системы, профессионалы взламывают людей»."
    },
    "Юджин Касперский|Касперский": {
      title: "Юджин Касперский",
      def: "Основатель «Лаборатории Касперского». Его специалисты первыми детально проанализировали червь Stuxnet."
    }
  };

  // =================================================
  // ПОДГОТОВКА РЕГУЛЯРКИ
  // =================================================
  // Собираем все ключи в один большой regex
  const allVariants = [];
  const variantToKey = {};

  Object.keys(GLOSSARY).forEach(key => {
    const variants = key.split("|");
    variants.forEach(v => {
      allVariants.push(v);
      variantToKey[v.toLowerCase()] = key;
    });
  });

  // Сортируем по длине (длинные первыми), чтобы "Script Kiddies" матчился раньше "Script"
  allVariants.sort((a, b) => b.length - a.length);

  // Экранируем спец-символы regex, кроме уже эскейпнутых \+
  const escaped = allVariants.map(v =>
    v.replace(/([.*+?^${}()|[\]\\])/g, (match, p1) => {
      // уже эскейпленные оставляем как есть
      return "\\" + p1;
    }).replace(/\\\\/g, "\\")
  );

  const pattern = new RegExp(
    "(?<![\\wа-яА-ЯёЁ])(" + escaped.join("|") + ")(?![\\wа-яА-ЯёЁ])",
    "g"
  );

  // =================================================
  // ОБХОД DOM И ПОДМЕНА ТЕКСТА
  // =================================================
  // Не трогаем: скрипты, стили, уже размеченные тултипы, код
  const SKIP_TAGS = new Set([
    "SCRIPT", "STYLE", "CODE", "PRE", "TEXTAREA", "INPUT",
    "A", "NAV", "HEADER", "FOOTER"
  ]);
  const SKIP_CLASSES = new Set([
    "tooltip", "tooltip-text", "auto-term", "auto-tooltip",
    "warning-block", "card", "step-card"
  ]);

  // Счётчик замен на страницу, чтобы не обрабатывать термин более одного раза
  const matchedKeys = new Set();
  const MAX_PER_KEY = 1; // подсвечиваем только первое вхождение каждого термина

  function shouldSkip(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      for (const cls of SKIP_CLASSES) {
        if (el.classList && el.classList.contains(cls)) return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  function processTextNode(textNode) {
    const text = textNode.nodeValue;
    if (!text || !text.trim()) return;

    pattern.lastIndex = 0;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;
    let replaced = false;

    while ((match = pattern.exec(text)) !== null) {
      const matched = match[1];
      const key = variantToKey[matched.toLowerCase()];

      if (matchedKeys.has(key)) continue;
      matchedKeys.add(key);

      // Текст до совпадения
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      // Сам термин — оборачиваем
      const span = document.createElement("span");
      span.className = "auto-term";
      span.textContent = matched;
      span.dataset.termKey = key;
      frag.appendChild(span);

      lastIndex = match.index + matched.length;
      replaced = true;
    }

    if (!replaced) return;

    // Хвост
    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!shouldSkip(node)) processTextNode(node);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (SKIP_TAGS.has(node.tagName)) return;
    if (node.classList) {
      for (const cls of SKIP_CLASSES) {
        if (node.classList.contains(cls)) return;
      }
    }
    // Копия children — чтобы не ломать обход при замене
    const children = Array.from(node.childNodes);
    children.forEach(walk);
  }

  // =================================================
  // ТУЛТИП
  // =================================================
  let tooltip = null;
  let hideTimer = null;

  function createTooltip() {
    const el = document.createElement("div");
    el.className = "auto-tooltip";
    document.body.appendChild(el);
    return el;
  }

  function showTooltip(termEl) {
    clearTimeout(hideTimer);
    const key = termEl.dataset.termKey;
    const entry = GLOSSARY[key];
    if (!entry) return;

    if (!tooltip) tooltip = createTooltip();

    tooltip.innerHTML = `
      <div class="auto-tooltip-title">${entry.title}</div>
      <div class="auto-tooltip-def">${entry.def}</div>
      <a href="${getGlossaryPath()}" class="auto-tooltip-link">📖 Открыть глоссарий →</a>
    `;

    // Позиционирование
    const rect = termEl.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = rect.top + scrollY - ttRect.height - 10;
    let left = rect.left + scrollX + (rect.width / 2) - (ttRect.width / 2);

    // Не вылезать за края
    const pad = 10;
    if (left < pad) left = pad;
    if (left + ttRect.width > window.innerWidth - pad) {
      left = window.innerWidth - ttRect.width - pad;
    }
    // Если сверху нет места — показать снизу
    if (top < scrollY + pad) {
      top = rect.bottom + scrollY + 10;
    }

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
    tooltip.classList.add("visible");
  }

  function hideTooltip() {
    hideTimer = setTimeout(() => {
      if (tooltip) tooltip.classList.remove("visible");
    }, 150);
  }

  // Определяем путь к глоссарию относительно текущей страницы
  function getGlossaryPath() {
    const path = window.location.pathname;
    if (path.includes("/pages/")) {
      return "glossary.html";
    }
    return "pages/glossary.html";
  }

  // =================================================
  // СТАРТ
  // =================================================
  function init() {
    const main = document.querySelector("main") || document.body;
    walk(main);

    // Делегирование
    document.addEventListener("mouseover", e => {
      if (e.target.classList && e.target.classList.contains("auto-term")) {
        showTooltip(e.target);
      }
    });

    document.addEventListener("mouseout", e => {
      if (e.target.classList && e.target.classList.contains("auto-term")) {
        hideTooltip();
      }
    });

    // На мобильных — клик для показа
    document.addEventListener("click", e => {
      if (e.target.classList && e.target.classList.contains("auto-term")) {
        e.preventDefault();
        showTooltip(e.target);
        setTimeout(hideTooltip, 4000);
      } else if (tooltip && !tooltip.contains(e.target)) {
        hideTooltip();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
