(function () {
  const TextNormalizer = (() => {
    const ACCENT_MAP = {
      á: "a",
      à: "a",
      ã: "a",
      â: "a",
      ä: "a",
      é: "e",
      è: "e",
      ê: "e",
      ë: "e",
      í: "i",
      ì: "i",
      î: "i",
      ï: "i",
      ó: "o",
      ò: "o",
      õ: "o",
      ô: "o",
      ö: "o",
      ú: "u",
      ù: "u",
      û: "u",
      ü: "u",
      ç: "c",
      ñ: "n",
      Á: "a",
      À: "a",
      Ã: "a",
      Â: "a",
      Ä: "a",
      É: "e",
      È: "e",
      Ê: "e",
      Ë: "e",
      Í: "i",
      Ì: "i",
      Î: "i",
      Ï: "i",
      Ó: "o",
      Ò: "o",
      Õ: "o",
      Ô: "o",
      Ö: "o",
      Ú: "u",
      Ù: "u",
      Û: "u",
      Ü: "u",
      Ç: "c",
      Ñ: "n",
    };

    function removeAccents(str) {
      return str.replace(/[^\u0000-\u007E]/g, (c) => ACCENT_MAP[c] || c);
    }

    function sanitize(str) {
      return removeAccents(str)
        .toLowerCase()
        .replace(/[^a-z0-9\s_-]/g, "")
        .trim();
    }

    return { removeAccents, sanitize };
  })();

  const STOP_WORDS_SETS = {
    en: new Set([
      "a",
      "an",
      "the",
      "of",
      "in",
      "on",
      "at",
      "to",
      "for",
      "with",
      "by",
      "from",
      "into",
      "through",
      "during",
      "and",
      "or",
      "but",
      "nor",
      "so",
      "yet",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "it",
      "its",
      "as",
      "if",
      "up",
      "out",
      "about",
    ]),
    pt: new Set([
      "a",
      "o",
      "as",
      "os",
      "um",
      "uma",
      "uns",
      "umas",
      "de",
      "do",
      "da",
      "dos",
      "das",
      "em",
      "no",
      "na",
      "nos",
      "nas",
      "por",
      "para",
      "com",
      "sem",
      "sob",
      "sobre",
      "entre",
      "até",
      "após",
      "e",
      "ou",
      "mas",
      "porém",
      "contudo",
      "todavia",
      "entretanto",
      "que",
      "se",
      "como",
      "quando",
      "onde",
      "por",
      "pois",
      "porque",
      "ao",
      "aos",
      "à",
      "às",
    ]),
  };

  const MODE_LABELS = {
    en: {
      completa: "Full",
      resumida: "Shortened",
      compacta: "Compact",
      abreviada: "Abbreviated",
    },

    pt: {
      completa: "Completa",
      resumida: "Resumida",
      compacta: "Compacta",
      abreviada: "Abreviada",
    },
  };

  const STATS_LABELS = {
    en: { chars: "chars", terms: "terms", mode: "mode:" },
    pt: { chars: "caracteres", terms: "termos", mode: "modo:" },
  };

  function getCurrentLanguage() {
    const htmlLang = document.documentElement.lang || "en";
    return htmlLang.startsWith("pt") ? "pt" : "en";
  }

  let activeLanguage = getCurrentLanguage();
  let activeStopWordsFilter = (words) =>
    words.filter((w) => !STOP_WORDS_SETS[activeLanguage].has(w.toLowerCase()));
  let activeModeLabels = MODE_LABELS[activeLanguage];
  let activeStatsLabels = STATS_LABELS[activeLanguage];
  let historyStorageKey = activeLanguage === "pt" ? "pn_history" : "fn_history";

  function updateLanguageSettings() {
    activeLanguage = getCurrentLanguage();

    activeStopWordsFilter = (words) =>
      words.filter(
        (w) => !STOP_WORDS_SETS[activeLanguage].has(w.toLowerCase()),
      );

    activeModeLabels = MODE_LABELS[activeLanguage];
    activeStatsLabels = STATS_LABELS[activeLanguage];

    historyStorageKey = activeLanguage === "pt" ? "pn_history" : "fn_history";
  }

  const ConversionStrategies = {
    completa: (words) => words,

    resumida: (words) => activeStopWordsFilter(words),

    compacta: (words) => {
      const filtered = activeStopWordsFilter(words);
      return filtered.slice(0, 5);
    },

    abreviada: (words) => {
      const filtered = activeStopWordsFilter(words);

      return filtered.map((word) =>
        word.length <= 4 ? word : word.slice(0, 4),
      );
    },
  };

  const OutputFormatter = (() => {
    function toFilename(words, { separator = "_", uppercase = false } = {}) {
      let result = words.join(separator);
      return uppercase ? result.toUpperCase() : result.toLowerCase();
    }

    function applyTimestamp(name, sep) {
      const now = new Date();

      const ts = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("");

      return `${ts}${sep}${name}`;
    }

    return { toFilename, applyTimestamp };
  })();

  function convert(title, mode, opts = {}) {
    const { timestamp = false, uppercase = false, useHyphen = false } = opts;

    const separator = useHyphen ? "-" : "_";
    const sanitized = TextNormalizer.sanitize(title);
    const rawWords = sanitized.split(/\s+/).filter(Boolean);
    const strategy =
      ConversionStrategies[mode] || ConversionStrategies.completa;
    const processed = strategy(rawWords);

    let result = OutputFormatter.toFilename(processed, {
      separator,
      uppercase,
    });

    if (timestamp) result = OutputFormatter.applyTimestamp(result, separator);

    return result;
  }

  function convertAll(title, opts = {}) {
    return Object.keys(ConversionStrategies).map((mode) => ({
      mode,
      result: convert(title, mode, opts),
    }));
  }

  let currentMode = "completa";
  let currentResult = "";
  let history = JSON.parse(localStorage.getItem(historyStorageKey) || "[]");
  let activeTab = "current";

  const inputEl = document.getElementById("inputTitle");
  const charEl = document.getElementById("charCount");
  const errorEl = document.getElementById("errorMsg");
  const convertEl = document.getElementById("convertBtn");
  const outputSec = document.getElementById("outputSection");
  const resultEl = document.getElementById("resultText");
  const copyEl = document.getElementById("copyBtn");
  const statsEl = document.getElementById("statsBar");
  const modeGrid = document.getElementById("modeGrid");
  const histList = document.getElementById("historyList");
  const emptyHist = document.getElementById("emptyHistory");
  const clearBtn = document.getElementById("clearHistory");
  const optTimestamp = document.getElementById("optTimestamp");
  const optUppercase = document.getElementById("optUppercase");
  const optHyphen = document.getElementById("optHyphen");
  const outputTabs = document.getElementById("outputTabs");
  const tabCurrentEl = document.getElementById("tabCurrent");
  const tabAllEl = document.getElementById("tabAll");

  inputEl.addEventListener("input", () => {
    charEl.textContent = inputEl.value.length;
    if (inputEl.value.trim()) errorEl.classList.remove("visible");
  });

  modeGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");

    if (!btn) return;
    document
      .querySelectorAll(".mode-btn")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
    currentMode = btn.dataset.mode;
  });

  convertEl.addEventListener("click", () => {
    const title = inputEl.value.trim();

    if (!title) {
      errorEl.classList.add("visible");
      return;
    }

    const opts = {
      timestamp: optTimestamp.checked,
      uppercase: optUppercase.checked,
      useHyphen: optHyphen.checked,
    };

    currentResult = convert(title, currentMode, opts);

    renderOutput(title, opts);
    addToHistory(title, currentMode, currentResult);
  });

  copyEl.addEventListener("click", () =>
    copyToClipboard(currentResult, copyEl),
  );

  clearBtn.addEventListener("click", () => {
    history = [];
    localStorage.removeItem(historyStorageKey);
    renderHistory();
  });

  outputTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".output-tab");

    if (!tab) return;
    document
      .querySelectorAll(".output-tab")
      .forEach((t) => t.classList.remove("active"));

    tab.classList.add("active");
    activeTab = tab.dataset.tab;
    tabCurrentEl.style.display = activeTab === "current" ? "block" : "none";
    tabAllEl.style.display = activeTab === "all" ? "flex" : "none";
  });

  function renderOutput(title, opts) {
    outputSec.classList.add("visible");
    resultEl.textContent = currentResult;

    const words = currentResult.split(/[_-]/).length;
    const chars = currentResult.length;

    statsEl.innerHTML = `
      <span class="stat"><span class="stat-val">${chars}</span> ${activeStatsLabels.chars}</span>
      <span class="stat"><span class="stat-val">${words}</span> ${activeStatsLabels.terms}</span>
      <span class="stat">${activeStatsLabels.mode} <span class="stat-val">${currentMode}</span></span>
    `;

    const allVersions = convertAll(title, opts);

    tabAllEl.innerHTML = "";

    allVersions.forEach(({ mode, result }) => {
      const row = document.createElement("div");

      row.style.cssText =
        "display:flex;align-items:stretch;gap:0;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;";

      row.innerHTML = `
        <div style="background:var(--surface2);border-right:1px solid var(--border);padding:10px 12px;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center;flex-shrink:0;min-width:80px;">${activeModeLabels[mode]}</div>
        <div style="flex:1;font-family:var(--mono);font-size:12px;color:var(--text-primary);padding:10px 14px;word-break:break-all;line-height:1.5;">${result}</div>
        <button onclick="copyToClipboard('${result.replace(/'/g, "\\'")}', this)" style="background:var(--surface);border:none;border-left:1px solid var(--border);padding:0 14px;cursor:pointer;color:var(--text-secondary);font-size:14px;transition:all .15s;" title="Copy">⧉</button>
      `;

      tabAllEl.appendChild(row);
    });
  }

  function renderHistory() {
    histList.innerHTML = "";

    if (history.length === 0) {
      emptyHist.style.display = "block";
      return;
    }

    emptyHist.style.display = "none";

    history
      .slice()
      .reverse()
      .forEach((entry) => {
        const item = document.createElement("div");
        item.className = "history-item";
        item.innerHTML = `
        <span class="history-mode-badge">${activeModeLabels[entry.mode] || entry.mode}</span>
        <span class="history-text">${entry.result}</span>
        <button class="history-copy" title="Copy" onclick="copyToClipboard('${entry.result.replace(/'/g, "\\'")}', this)">⧉</button>
      `;
        item.addEventListener("click", (e) => {
          if (e.target.closest(".history-copy")) return;

          inputEl.value = entry.title;
          charEl.textContent = entry.title.length;

          document.querySelectorAll(".mode-btn").forEach((b) => {
            b.classList.toggle("active", b.dataset.mode === entry.mode);
          });

          currentMode = entry.mode;
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        histList.appendChild(item);
      });
  }

  function addToHistory(title, mode, result) {
    history.push({ title, mode, result, ts: Date.now() });

    if (history.length > 30) history.shift();

    localStorage.setItem(historyStorageKey, JSON.stringify(history));

    renderHistory();
  }

  window.copyToClipboard = function (text, btn) {
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;

      btn.textContent = "✓";
      btn.classList.add("copied");

      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1500);
    });
  };

  const themeToggleBtn = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");
  let isDark = localStorage.getItem("std_theme") !== "light";

  function applyTheme() {
    if (isDark) {
      document.documentElement.classList.remove("light");
      themeIcon.textContent = "☀️";
      themeLabel.textContent = activeLanguage === "pt" ? "Claro" : "Light";
    } else {
      document.documentElement.classList.add("light");
      themeIcon.textContent = "🌙";
      themeLabel.textContent = activeLanguage === "pt" ? "Escuro" : "Dark";
    }

    localStorage.setItem("std_theme", isDark ? "dark" : "light");
  }
  themeToggleBtn.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme();
  });

  applyTheme();

  updateLanguageSettings();
  renderHistory();
})();
