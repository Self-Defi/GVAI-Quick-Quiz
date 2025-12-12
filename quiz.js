// quiz.js
// GVAI Quick Quiz — fully client-side, no external dependencies.

// ---------------- Question bank ----------------
// Keep your existing questions array EXACTLY as you already have it.
const questions = [
  // ... KEEP YOUR CURRENT 40+ QUESTION POOL HERE ...
];

// ---------------- State ----------------
let activeQuiz = [];
let quizLoaded = false;

const STORAGE_KEY = "gvai_quiz_state_v1";

// ---------------- Helpers ----------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampQuizSize(n) {
  const max = Math.max(1, questions.length);
  return Math.min(Math.max(1, n), max);
}

function getSelectedAnswers() {
  const answers = {};
  activeQuiz.forEach((q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (selected) answers[q.id] = selected.value;
  });
  return answers;
}

function setProgress() {
  const answered = activeQuiz.reduce((acc, q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    return acc + (selected ? 1 : 0);
  }, 0);

  const total = activeQuiz.length || 0;
  const pct = total ? Math.round((answered / total) * 100) : 0;

  const progressText = document.getElementById("progress-text");
  const progressPercent = document.getElementById("progress-percent");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.querySelector(".progress-bar");

  if (progressText) progressText.textContent = `Progress: ${answered} / ${total}`;
  if (progressPercent) progressPercent.textContent = `${pct}%`;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressBar) progressBar.setAttribute("aria-valuenow", String(pct));
}

function saveState() {
  const sizeEl = document.getElementById("quiz-size");
  const payload = {
    size: sizeEl ? Number(sizeEl.value) : 20,
    activeIds: activeQuiz.map((q) => q.id),
    answers: getSelectedAnswers(),
    theme: document.documentElement.getAttribute("data-theme") || "light",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------- Render ----------------
function renderQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  form.innerHTML = "";

  activeQuiz.forEach((q, index) => {
    const questionNumber = index + 1;

    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";
    questionDiv.dataset.questionId = q.id;

    const heading = document.createElement("h3");
    heading.textContent = `${questionNumber}. ${q.question}`;
    questionDiv.appendChild(heading);

    const optionsList = document.createElement("ul");
    optionsList.className = "quiz-options";

    Object.entries(q.options).forEach(([key, text]) => {
      const li = document.createElement("li");

      const label = document.createElement("label");
      label.className = "quiz-option-label";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${q.id}`;
      input.value = key;

      input.addEventListener("change", () => {
        setProgress();
        saveState();
      });

      const span = document.createElement("span");
      span.textContent = `${key}) ${text}`;

      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);
      optionsList.appendChild(li);
    });

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.id = `feedback-q${q.id}`;
    feedback.setAttribute("aria-live", "polite");

    questionDiv.appendChild(optionsList);
    questionDiv.appendChild(feedback);

    form.appendChild(questionDiv);
  });

  setProgress();
}

function hydrateAnswers(savedAnswers = {}) {
  Object.entries(savedAnswers).forEach(([qid, val]) => {
    const el = document.querySelector(`input[name="q${qid}"][value="${val}"]`);
    if (el) el.checked = true;
  });
  setProgress();
}

function buildNewQuiz(size) {
  const n = clampQuizSize(size);
  activeQuiz = shuffle(questions).slice(0, n);
  renderQuiz();
  saveState();
}

function gradeQuiz() {
  let correctCount = 0;

  activeQuiz.forEach((q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    const feedbackEl = document.getElementById(`feedback-q${q.id}`);
    if (!feedbackEl) return;

    if (!selected) {
      feedbackEl.textContent = "No answer selected yet.";
      feedbackEl.className = "quiz-feedback neutral";
      return;
    }

    if (selected.value === q.correct) {
      correctCount++;
      feedbackEl.textContent = `✅ Correct. ${q.explanation}`;
      feedbackEl.className = "quiz-feedback correct";
    } else {
      feedbackEl.textContent = `❌ Not quite. Correct answer: ${q.correct}). ${q.explanation}`;
      feedbackEl.className = "quiz-feedback incorrect";
    }
  });

  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = false;
    summary.textContent = `You answered ${correctCount} out of ${activeQuiz.length} correctly.`;
  }

  saveState();
}

function resetQuiz() {
  const form = document.getElementById("quiz-form");
  if (form) form.reset();

  document.querySelectorAll(".quiz-feedback").forEach((el) => {
    el.textContent = "";
    el.className = "quiz-feedback";
  });

  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }

  setProgress();
  saveState();
}

function downloadPDF() {
  // Reliable “download” via print-to-PDF (client-side, no libs)
  window.print();
}

// ---------------- UI: open/close sections ----------------
function showSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.hidden = false;

  // Update hash without jumping weirdly
  history.replaceState(null, "", selector);

  // Smooth scroll into view
  setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function hideSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.hidden = true;
  if (location.hash === selector) history.replaceState(null, "", "#resources");
}

// ---------------- Theme ----------------
function applyTheme(theme) {
  const t = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  // save theme only if state exists or quiz loaded
  const saved = loadState();
  if (saved || quizLoaded) saveState();
}

// ---------------- Init (ONLY called when quiz opened) ----------------
function initQuizOnce() {
  if (quizLoaded) return;
  quizLoaded = true;

  const sizeEl = document.getElementById("quiz-size");
  const newBtn = document.getElementById("new-quiz");
  const checkBtn = document.getElementById("check-answers");
  const resetBtn = document.getElementById("reset-quiz");
  const dlBtn = document.getElementById("download-results");

  // Restore theme if present
  const saved = loadState();
  if (saved?.theme) applyTheme(saved.theme);

  // Restore quiz state if present
  if (saved && Array.isArray(saved.activeIds) && saved.activeIds.length) {
    const map = new Map(questions.map((q) => [q.id, q]));
    activeQuiz = saved.activeIds.map((id) => map.get(id)).filter(Boolean);
    if (sizeEl) sizeEl.value = String(clampQuizSize(saved.size || activeQuiz.length));
    renderQuiz();
    hydrateAnswers(saved.answers || {});
  } else {
    // Build initial quiz from dropdown default
    const size = sizeEl ? Number(sizeEl.value) : 20;
    buildNewQuiz(size);
  }

  // Events
  if (sizeEl) {
    sizeEl.addEventListener("change", () => {
      buildNewQuiz(Number(sizeEl.value));
    });
  }

  if (newBtn) newBtn.addEventListener("click", () => {
    const size = sizeEl ? Number(sizeEl.value) : 20;
    buildNewQuiz(size);
  });

  if (checkBtn) checkBtn.addEventListener("click", gradeQuiz);
  if (resetBtn) resetBtn.addEventListener("click", resetQuiz);
  if (dlBtn) dlBtn.addEventListener("click", downloadPDF);
}

// ---------------- Global wiring (runs on load, but does NOT render quiz) ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle always available
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Open Tools
  const openTools = document.getElementById("open-tools");
  if (openTools) {
    openTools.addEventListener("click", () => {
      showSection("#tools");
    });
  }

  // Open Quiz (only now do we init)
  const openQuiz = document.getElementById("open-quiz");
  if (openQuiz) {
    openQuiz.addEventListener("click", () => {
      showSection("#quiz");
      initQuizOnce();
    });
  }

  // Close buttons
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-close");
      if (sel) hideSection(sel);
    });
  });

  // Deep link support
  if (location.hash === "#tools") {
    showSection("#tools");
  }
  if (location.hash === "#quiz") {
    showSection("#quiz");
    initQuizOnce();
  }

  // Default theme
  applyTheme("light");
});


