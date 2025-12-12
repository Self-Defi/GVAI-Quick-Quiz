/* =========================================================
   GVAI Quick Quiz — Learning Hub Runtime
   - Theme toggle (persisted)
   - Tools + Quiz gated (open on button)
   - 45-question responsible AI bank
   - Randomized order
   - Progress tracker
   - Save & resume (LocalStorage)
   - Printable results -> Save as PDF
   ========================================================= */

const STORAGE_KEYS = {
  theme: "gvai_theme_v1",
  quiz: "gvai_quiz_state_v1",
};

function $(sel) {
  return document.querySelector(sel);
}
function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

function safeParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function shuffle(arr) {
  return arr
    .map((v) => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v);
}

/* -----------------------------
   Question Bank (45)
   Responsible Academic AI Use
------------------------------ */
const QUESTION_BANK = [
  {
    id: 1,
    question:
      "What is the primary goal of using AI tools in the GraduationVaultsAI program?",
    options: [
      "To replace student thinking with automated answers",
      "To speed through assignments with minimal effort",
      "To use AI as a lever to strengthen understanding and reasoning",
      "To generate content without review",
    ],
    correct: 2,
    explanation:
      "AI is positioned as a thinking aid — not a replacement — to build understanding and literacy.",
  },
  {
    id: 2,
    question:
      "Which AI tool is best suited for asking questions directly against your own class notes or PDFs?",
    options: ["ChatGPT", "NotebookLM", "Canva AI", "Photomath"],
    correct: 1,
    explanation:
      "NotebookLM is designed to answer questions using your uploaded source documents.",
  },
  {
    id: 3,
    question: "Why is Perplexity recommended for research tasks?",
    options: [
      "It generates longer essays automatically",
      "It hides its sources to reduce bias",
      "It answers questions with cited sources",
      "It works offline",
    ],
    correct: 2,
    explanation:
      "Perplexity emphasizes citation discipline, reinforcing evidence-based research.",
  },
  {
    id: 4,
    question: "Which behavior best reflects responsible AI use in academics?",
    options: [
      "Copying AI answers directly into assignments",
      "Using AI to clarify concepts, then writing in your own words",
      "Letting AI complete graded work without review",
      "Sharing login credentials with AI tools",
    ],
    correct: 1,
    explanation:
      "Responsible use means understanding and synthesizing, not copying.",
  },
  {
    id: 5,
    question:
      "What does the phrase 'AI gives you the level of thinking you ask for' mean?",
    options: [
      "AI always produces expert-level results",
      "AI limits how deeply students can think",
      "Prompt quality directly affects output quality",
      "AI decides what level of detail is appropriate",
    ],
    correct: 2,
    explanation:
      "Clear roles, goals, and context in prompts produce better reasoning.",
  },
  {
    id: 6,
    question: "Which is an example of a strong prompt?",
    options: [
      "Explain savings",
      "Help me",
      "Act as a tutor helping me understand this chapter step-by-step",
      "Give me answers fast",
    ],
    correct: 2,
    explanation:
      "Strong prompts assign a role, audience, and objective.",
  },
  {
    id: 7,
    question:
      "Which tool is most appropriate for creating presentations or visual projects?",
    options: ["NotebookLM", "Canva AI", "Perplexity", "QANDA"],
    correct: 1,
    explanation:
      "Canva AI is optimized for presentations and visual communication.",
  },
  {
    id: 8,
    question: "Why should students avoid entering personal information into AI tools?",
    options: [
      "AI tools delete data instantly",
      "Schools track all AI usage",
      "Privacy and safety risks exist",
      "AI cannot process personal data",
    ],
    correct: 2,
    explanation:
      "Responsible use includes protecting personal and sensitive information.",
  },
  {
    id: 9,
    question:
      "Which tool is best for math problem-solving that emphasizes learning steps?",
    options: ["ChatGPT", "Perplexity", "Photomath", "Canva AI"],
    correct: 2,
    explanation:
      "Photomath provides guided steps to support learning rather than answer dumping.",
  },
  {
    id: 10,
    question: "What is the best use of ChatGPT in an academic setting?",
    options: [
      "Submitting its output as final work",
      "Clarifying concepts and brainstorming ideas",
      "Replacing textbooks",
      "Completing exams automatically",
    ],
    correct: 1,
    explanation:
      "ChatGPT works best as a universal thinking assistant: explain, outline, brainstorm, refine.",
  },

  // ---- 11–45: tool categories + prompt discipline + integrity ----
  {
    id: 11,
    question: "Which tool helps turn academic papers into structured study cards?",
    options: ["Perplexity", "Scholarcy", "NotebookLM", "Gamma"],
    correct: 1,
    explanation: "Scholarcy specializes in converting academic texts into study cards/summaries.",
  },
  {
    id: 12,
    question: "Why is citation discipline important when using AI?",
    options: [
      "It improves grammar automatically",
      "It avoids accountability for claims",
      "It reinforces evidence-based learning",
      "It makes answers shorter",
    ],
    correct: 2,
    explanation: "Citations help verify accuracy and build research literacy.",
  },
  {
    id: 13,
    question: "Which behavior shows misuse of AI in school?",
    options: [
      "Asking AI to explain a concept",
      "Using AI to generate practice questions",
      "Submitting AI output without understanding or verifying",
      "Checking AI output against trusted sources",
    ],
    correct: 2,
    explanation: "Submitting without understanding undermines learning and integrity.",
  },
  {
    id: 14,
    question: "What does 'prompt discipline' encourage?",
    options: [
      "Only using one-sentence prompts",
      "Role clarity and outcome focus",
      "Avoiding AI altogether",
      "Letting AI guess what you mean",
    ],
    correct: 1,
    explanation: "Good prompts define role, goal, constraints, and format.",
  },
  {
    id: 15,
    question: "Which tool provides lightweight coding exposure directly in the browser?",
    options: ["CodeHS", "Replit AI", "Canva AI", "NotebookLM"],
    correct: 1,
    explanation: "Replit AI enables quick in-browser coding with low setup friction.",
  },
  {
    id: 16,
    question: "Why should AI outputs be cross-checked?",
    options: [
      "AI never makes mistakes",
      "Teachers require it in all cases",
      "AI can hallucinate or oversimplify",
      "Cross-checking slows learning too much",
    ],
    correct: 2,
    explanation: "Verification is core to responsible AI use because AI can be wrong or misleading.",
  },
  {
    id: 17,
    question: "Which mindset is safest for using AI in school?",
    options: [
      "AI decides correctness",
      "AI assists, humans decide",
      "AI replaces teachers",
      "AI grades and finalizes assignments",
    ],
    correct: 1,
    explanation: "Humans remain accountable for decisions and accuracy.",
  },
  {
    id: 18,
    question: "Which tool is best suited for organizing notes, tasks, and planning academically?",
    options: ["Notion AI", "Photomath", "QANDA", "Scholarcy"],
    correct: 0,
    explanation: "Notion AI supports structured planning, templates, and study organization.",
  },
  {
    id: 19,
    question: "After using AI to study a topic, what is a strong next step?",
    options: [
      "Submit work immediately without review",
      "Discuss confusing parts with a teacher/mentor",
      "Delete all notes to avoid bias",
      "Rely only on AI memory next time",
    ],
    correct: 1,
    explanation: "Human feedback + discussion reinforces learning and catches misunderstandings.",
  },
  {
    id: 20,
    question: "Which prompt is most likely to produce a high-quality study explanation?",
    options: [
      "Summarize this",
      "Teach me this like I'm 12 with examples and a short quiz at the end",
      "Do my homework",
      "Give me the final answers only",
    ],
    correct: 1,
    explanation: "Clear audience + structure + deliverables improves output quality.",
  },
  {
    id: 21,
    question: "What should you do if an AI answer sounds confident but conflicts with your textbook?",
    options: [
      "Trust AI because it sounds confident",
      "Ignore the textbook",
      "Cross-check with trusted sources and ask clarifying questions",
      "Stop using AI permanently",
    ],
    correct: 2,
    explanation: "Cross-checking and refining questions is the responsible move.",
  },
  {
    id: 22,
    question: "Which is a good use of AI for writing support?",
    options: [
      "Copying the entire essay from AI",
      "Having AI outline and then rewriting in your own voice",
      "Asking AI to fake citations",
      "Submitting AI output without editing",
    ],
    correct: 1,
    explanation: "AI can help outline and improve clarity, but you must author the final work.",
  },
  {
    id: 23,
    question: "What is a privacy-safe way to ask AI for help?",
    options: [
      "Share passwords so the tool can access accounts",
      "Upload private IDs and documents",
      "Use generic examples and remove identifying details",
      "Share a friend’s personal info for context",
    ],
    correct: 2,
    explanation: "Keep requests non-identifying and avoid sensitive info.",
  },
  {
    id: 24,
    question: "Which tool is best when you need a quick explanation across many topics?",
    options: ["ChatGPT", "Scholarcy", "Photomath", "Canva AI"],
    correct: 0,
    explanation: "ChatGPT is the universal thinking assistant for broad concept clarification.",
  },
  {
    id: 25,
    question: "Which output format request improves AI usefulness most?",
    options: [
      "No format—just answer",
      "Write something",
      "Give me a step-by-step checklist with short examples",
      "Be vague and short",
    ],
    correct: 2,
    explanation: "Asking for structure (checklist, steps, examples) increases clarity and usability.",
  },
  {
    id: 26,
    question: "Why is 'research accuracy' tied to tool choice?",
    options: [
      "All tools provide identical evidence",
      "Some tools emphasize citations and sources more than others",
      "Research accuracy is purely based on speed",
      "Accuracy doesn’t matter if it sounds good",
    ],
    correct: 1,
    explanation: "Tools like Perplexity and source-grounded workflows help verification.",
  },
  {
    id: 27,
    question: "What should a student do before using AI on a graded assignment?",
    options: [
      "Nothing—AI use is always allowed",
      "Check class policy and teacher expectations",
      "Hide AI use from everyone",
      "Use AI only for final answers",
    ],
    correct: 1,
    explanation: "Policy alignment is part of responsible academic use.",
  },
  {
    id: 28,
    question: "Which behavior supports independent learning instead of dependence?",
    options: [
      "Ask AI to explain, then practice without AI",
      "Only use AI and never attempt problems yourself",
      "Avoid practice and rely on AI summaries",
      "Use AI to finish work quickly and move on",
    ],
    correct: 0,
    explanation: "Use AI for understanding, then practice independently to build skill.",
  },
  {
    id: 29,
    question: "Which is a responsible use of image-based math helpers?",
    options: [
      "Use them to understand steps, then redo the problem yourself",
      "Use them to get answers for tests",
      "Use them to skip learning",
      "Use them to share classmates’ work",
    ],
    correct: 0,
    explanation: "The purpose is scaffolding and understanding, not cheating.",
  },
  {
    id: 30,
    question: "Which prompt is 'weak' because it lacks a specific role or outcome?",
    options: [
      "Act as a study coach and quiz me on Chapter 3",
      "Help me understand the causes of WWI in 5 bullet points",
      "Explain this like I'm a beginner and include examples",
      "Help me",
    ],
    correct: 3,
    explanation: "Weak prompts are vague and don’t define the objective or format.",
  },
  {
    id: 31,
    question: "What does 'toolkit literacy' mean in this context?",
    options: [
      "Memorizing every AI app name",
      "Knowing which tool to use for which academic task",
      "Using AI for everything",
      "Avoiding AI permanently",
    ],
    correct: 1,
    explanation: "Literacy means selecting tools strategically for learning goals.",
  },
  {
    id: 32,
    question: "Which is the best use of Canva AI for students?",
    options: [
      "Writing full essays",
      "Building slides and visuals for presentations",
      "Citing academic sources",
      "Solving algebra proofs step-by-step",
    ],
    correct: 1,
    explanation: "Canva AI is best for visual communication and presentation assets.",
  },
  {
    id: 33,
    question: "If AI gives an incorrect answer, what’s a productive response?",
    options: [
      "Assume AI is broken and stop learning",
      "Treat it as a cue to verify and refine the question",
      "Blame classmates",
      "Share the incorrect answer as fact",
    ],
    correct: 1,
    explanation: "Verification + prompt refinement improves outcomes and builds critical thinking.",
  },
  {
    id: 34,
    question: "Which is a good research workflow for a student?",
    options: [
      "Ask AI once and submit",
      "Ask AI, collect sources, verify key claims, then write",
      "Copy AI output with no citations",
      "Use only one website and never compare",
    ],
    correct: 1,
    explanation: "Responsible workflows include evidence and verification.",
  },
  {
    id: 35,
    question: "What is a safe rule when using AI tools at school?",
    options: [
      "Never check your work",
      "Never share passwords or personal identifiers",
      "Always submit AI output",
      "Always ask AI for test answers",
    ],
    correct: 1,
    explanation: "Privacy and safety are non-negotiable in responsible use.",
  },
  {
    id: 36,
    question: "Which tool is best for deep comprehension using your own notes?",
    options: ["NotebookLM", "Canva AI", "Photomath", "Gamma"],
    correct: 0,
    explanation: "NotebookLM is designed around your documents for grounded comprehension.",
  },
  {
    id: 37,
    question: "What’s the main reason to limit AI resources to academic scope?",
    options: [
      "To prevent learning",
      "To keep tool use aligned with school goals and safety expectations",
      "Because AI is only for adults",
      "Because research is unnecessary",
    ],
    correct: 1,
    explanation: "Scope-limiting keeps usage aligned with learning objectives and safety.",
  },
  {
    id: 38,
    question: "Which is a good prompt constraint to reduce mistakes?",
    options: [
      "Make it dramatic",
      "Include sources and show your reasoning steps briefly",
      "Ignore my instructions",
      "Be as vague as possible",
    ],
    correct: 1,
    explanation: "Asking for sources and steps improves transparency and reduces errors.",
  },
  {
    id: 39,
    question: "What does 'critical thinking' look like with AI support?",
    options: [
      "Believing outputs immediately",
      "Evaluating claims, asking follow-ups, and verifying sources",
      "Avoiding questions",
      "Only using AI for grades",
    ],
    correct: 1,
    explanation: "Critical thinking means evaluating and verifying, not accepting blindly.",
  },
  {
    id: 40,
    question: "Which is most appropriate if you need a concept explained in multiple ways?",
    options: [
      "Ask once and accept",
      "Ask for analogies, examples, and a short quiz",
      "Ask AI to do your work",
      "Ask for the answer only",
    ],
    correct: 1,
    explanation: "Multiple explanations build understanding and reveal gaps.",
  },
  {
    id: 41,
    question: "Why is 'writing improvement' a valid academic AI use case?",
    options: [
      "Because AI can replace your voice",
      "Because AI can help clarify structure while you stay the author",
      "Because citations don’t matter",
      "Because editing is cheating",
    ],
    correct: 1,
    explanation: "AI can support clarity and structure while you keep authorship and accountability.",
  },
  {
    id: 42,
    question: "Which is a responsible way to use AI for studying before a test?",
    options: [
      "Generate practice questions and explain wrong answers",
      "Ask for leaked answers",
      "Avoid practice and rely on AI summaries",
      "Copy someone else’s notes into AI with names included",
    ],
    correct: 0,
    explanation: "Practice questions + explanations supports learning and retention.",
  },
  {
    id: 43,
    question: "What is the best response if an AI tool provides sources that look suspicious?",
    options: [
      "Use them anyway",
      "Ignore sources completely",
      "Open and verify the sources or find better ones",
      "Assume sources are always real",
    ],
    correct: 2,
    explanation: "Source verification is required; AI can generate incorrect or low-quality citations.",
  },
  {
    id: 44,
    question: "Which option best describes 'research literacy'?",
    options: [
      "Knowing how to use emojis in prompts",
      "Knowing how to find, evaluate, and cite trustworthy sources",
      "Only using one search result",
      "Avoiding evidence to save time",
    ],
    correct: 1,
    explanation: "Research literacy is evidence, evaluation, and citation — not speed.",
  },
  {
    id: 45,
    question: "What is a strong next step after finishing the quiz?",
    options: [
      "Memorize answer letters only",
      "Ignore confusing topics",
      "Write down questions and bring them to a teacher/mentor",
      "Share personal details online with your score",
    ],
    correct: 2,
    explanation: "The quiz is a checkpoint; turning confusion into questions builds real literacy.",
  },
];

/* -----------------------------
   Theme Toggle
------------------------------ */
function applyTheme(theme) {
  const html = document.documentElement;
  html.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch {}
}

function initTheme() {
  const saved = safeParse(localStorage.getItem(STORAGE_KEYS.theme), null);
  // saved might be a string if previously stored directly
  const theme =
    saved === "dark" || saved === "light"
      ? saved
      : localStorage.getItem(STORAGE_KEYS.theme) || document.documentElement.getAttribute("data-theme") || "light";

  applyTheme(theme);

  const toggleBtn = $("#theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
}

/* -----------------------------
   Collapsibles (Tools / Quiz)
------------------------------ */
function openSection(id) {
  const el = $(id);
  if (!el) return;
  el.hidden = false;

  // Hide the other section if both exist
  if (id === "#quiz") {
    const tools = $("#tools");
    if (tools) tools.hidden = true;
  }
  if (id === "#tools") {
    const quiz = $("#quiz");
    if (quiz) quiz.hidden = true;
  }

  // Scroll into view for mobile
  setTimeout(() => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function closeSection(id) {
  const el = $(id);
  if (!el) return;
  el.hidden = true;
}

function initCollapsibles() {
  $("#open-tools")?.addEventListener("click", () => openSection("#tools"));
  $("#open-quiz")?.addEventListener("click", () => {
    openSection("#quiz");
    ensureQuizInitialized();
  });

  // close buttons with data-close="#quiz" or "#tools"
  $all("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-close");
      if (target) closeSection(target);
    });
  });
}

/* -----------------------------
   Quiz State + Persistence
------------------------------ */
let quizInitialized = false;
let activeQuestionIds = [];
let answers = {}; // { [qid]: selectedIndex }
let lastGraded = null; // { score, total, timeISO }

function saveQuizState() {
  const state = {
    version: 1,
    activeQuestionIds,
    answers,
    quizSize: parseInt($("#quiz-size")?.value || "20", 10),
    lastGraded,
  };
  try {
    localStorage.setItem(STORAGE_KEYS.quiz, JSON.stringify(state));
  } catch {}
}

function loadQuizState() {
  const raw = localStorage.getItem(STORAGE_KEYS.quiz);
  if (!raw) return null;
  return safeParse(raw, null);
}

function clearQuizState() {
  try {
    localStorage.removeItem(STORAGE_KEYS.quiz);
  } catch {}
}

/* -----------------------------
   Quiz Engine
------------------------------ */
function pickQuizIds(size) {
  const ids = QUESTION_BANK.map((q) => q.id);
  return shuffle(ids).slice(0, size);
}

function getQuestionById(id) {
  return QUESTION_BANK.find((q) => q.id === id);
}

function renderQuiz() {
  const form = $("#quiz-form");
  if (!form) return;

  form.innerHTML = "";
  const questions = activeQuestionIds.map(getQuestionById).filter(Boolean);

  questions.forEach((q, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "quiz-question";
    wrap.dataset.qid = String(q.id);

    const h3 = document.createElement("h3");
    h3.textContent = `${idx + 1}. ${q.question}`;
    wrap.appendChild(h3);

    const ul = document.createElement("ul");
    ul.className = "quiz-options";

    q.options.forEach((opt, optIdx) => {
      const li = document.createElement("li");

      const label = document.createElement("label");
      label.className = "quiz-option-label";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `qid-${q.id}`;
      input.value = String(optIdx);

      // restore selection
      if (answers[q.id] === optIdx) input.checked = true;

      input.addEventListener("change", () => {
        answers[q.id] = optIdx;
        saveQuizState();
        updateProgress();
      });

      const span = document.createElement("span");
      // Show letter + option text
      const letter = ["A", "B", "C", "D"][optIdx] || "";
      span.textContent = `${letter}) ${opt}`;

      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);
      ul.appendChild(li);
    });

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.id = `feedback-${q.id}`;
    feedback.setAttribute("aria-live", "polite");

    wrap.appendChild(ul);
    wrap.appendChild(feedback);

    form.appendChild(wrap);
  });

  updateProgress();
}

function updateProgress() {
  const total = activeQuestionIds.length;
  const answered = Object.keys(answers).filter((qid) => activeQuestionIds.includes(parseInt(qid, 10))).length;

  const pct = total ? Math.round((answered / total) * 100) : 0;

  $("#progress-text") && ($("#progress-text").textContent = `Progress: ${answered} / ${total}`);
  $("#progress-percent") && ($("#progress-percent").textContent = `${pct}%`);
  $("#progress-fill") && ($("#progress-fill").style.width = `${pct}%`);

  const bar = $(".progress-bar");
  if (bar) bar.setAttribute("aria-valuenow", String(pct));
}

function newQuizFromSize() {
  const size = parseInt($("#quiz-size")?.value || "20", 10);
  activeQuestionIds = pickQuizIds(size);
  answers = {};
  lastGraded = null;
  saveQuizState();
  renderQuiz();

  const summary = $("#quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }
}

function resetQuiz() {
  // keep same active question order but clear answers
  answers = {};
  lastGraded = null;

  $all(".quiz-feedback").forEach((el) => {
    el.textContent = "";
    el.className = "quiz-feedback";
  });

  const summary = $("#quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }

  saveQuizState();
  renderQuiz();
}

function gradeQuiz() {
  const questions = activeQuestionIds.map(getQuestionById).filter(Boolean);
  let correctCount = 0;

  questions.forEach((q) => {
    const feedbackEl = $(`#feedback-${q.id}`);
    if (!feedbackEl) return;

    const selected = answers[q.id];

    if (selected === undefined) {
      feedbackEl.textContent = "No answer selected yet.";
      feedbackEl.className = "quiz-feedback neutral";
      return;
    }

    const correctIdx = q.correct;
    const correctLetter = ["A", "B", "C", "D"][correctIdx] || "";

    if (selected === correctIdx) {
      correctCount++;
      feedbackEl.textContent = `✅ Correct. ${q.explanation}`;
      feedbackEl.className = "quiz-feedback correct";
    } else {
      feedbackEl.textContent = `❌ Not quite. Correct answer: ${correctLetter}). ${q.explanation}`;
      feedbackEl.className = "quiz-feedback incorrect";
    }
  });

  const summary = $("#quiz-summary");
  if (summary) {
    summary.hidden = false;
    summary.textContent = `You answered ${correctCount} out of ${questions.length} correctly.`;
  }

  lastGraded = {
    score: correctCount,
    total: questions.length,
    timeISO: new Date().toISOString(),
  };
  saveQuizState();
}

function downloadResultsAsPDF() {
  // Simple, reliable approach: open printable page, user saves as PDF.
  const questions = activeQuestionIds.map(getQuestionById).filter(Boolean);

  const answered = questions.map((q, idx) => {
    const selected = answers[q.id];
    const correctIdx = q.correct;

    const selectedLetter =
      selected === undefined ? "—" : ["A", "B", "C", "D"][selected] || "—";
    const correctLetter = ["A", "B", "C", "D"][correctIdx] || "—";

    const isCorrect = selected === correctIdx;

    return {
      number: idx + 1,
      question: q.question,
      selectedLetter,
      correctLetter,
      status: selected === undefined ? "Unanswered" : isCorrect ? "Correct" : "Incorrect",
      explanation: q.explanation,
    };
  });

  const scoreText = lastGraded
    ? `Score: ${lastGraded.score} / ${lastGraded.total}`
    : "Score: (Run 'Check Answers' first for a score)";

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return;

  win.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>GVAI Quick Quiz — Results</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; color: #111; }
    h1 { margin: 0 0 6px; }
    .meta { color: #444; margin-bottom: 18px; }
    .card { border: 1px solid #ddd; border-radius: 12px; padding: 14px; margin: 12px 0; }
    .row { display:flex; gap:12px; flex-wrap:wrap; margin: 8px 0; }
    .pill { display:inline-block; padding: 4px 10px; border-radius: 999px; border: 1px solid #ccc; font-size: 12px; }
    .ok { border-color:#15803d; }
    .bad { border-color:#b91c1c; }
    .na { border-color:#92400e; }
    .q { font-weight:700; }
    .small { font-size: 13px; color:#333; }
    @media print { button { display:none; } }
  </style>
</head>
<body>
  <h1>GVAI Quick Quiz — Results</h1>
  <div class="meta">
    <div>${scoreText}</div>
    <div>Generated: ${new Date().toLocaleString()}</div>
    <div class="small">Academic use only. Do not include personal identifiers. Follow school policy.</div>
  </div>

  <button onclick="window.print()" style="padding:10px 14px;border-radius:10px;border:1px solid #ccc;background:#fff;cursor:pointer;">
    Print / Save as PDF
  </button>

  ${answered
    .map((r) => {
      const cls = r.status === "Correct" ? "ok" : r.status === "Incorrect" ? "bad" : "na";
      return `
        <div class="card">
          <div class="q">${r.number}. ${r.question}</div>
          <div class="row">
            <span class="pill ${cls}">Status: ${r.status}</span>
            <span class="pill">Selected: ${r.selectedLetter}</span>
            <span class="pill">Correct: ${r.correctLetter}</span>
          </div>
          <div class="small"><strong>Explanation:</strong> ${r.explanation}</div>
        </div>
      `;
    })
    .join("")}
</body>
</html>`);

  win.document.close();
  win.focus();
}

function ensureQuizInitialized() {
  if (quizInitialized) return;

  // Try to restore state
  const state = loadQuizState();
  const sizeEl = $("#quiz-size");

  if (state && Array.isArray(state.activeQuestionIds) && state.activeQuestionIds.length) {
    activeQuestionIds = state.activeQuestionIds;
    answers = state.answers || {};
    lastGraded = state.lastGraded || null;

    if (sizeEl && state.quizSize) {
      sizeEl.value = String(state.quizSize);
    }

    renderQuiz();
  } else {
    // Fresh
    if (!sizeEl) {
      activeQuestionIds = pickQuizIds(20);
    } else {
      activeQuestionIds = pickQuizIds(parseInt(sizeEl.value, 10));
    }
    answers = {};
    lastGraded = null;
    saveQuizState();
    renderQuiz();
  }

  // Wire quiz controls
  $("#new-quiz")?.addEventListener("click", () => {
    newQuizFromSize();
  });

  $("#check-answers")?.addEventListener("click", () => {
    gradeQuiz();
  });

  $("#reset-quiz")?.addEventListener("click", () => {
    resetQuiz();
  });

  $("#download-results")?.addEventListener("click", () => {
    downloadResultsAsPDF();
  });

  // If user changes size selector, don’t auto-rebuild (avoid data loss)
  // They click "New Quiz" to apply.
  quizInitialized = true;
}

/* -----------------------------
   Boot
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCollapsibles();

  // Keep tools + quiz hidden on load (your HTML already sets hidden)
  // Do not render quiz until button press -> ensureQuizInitialized() is called from open-quiz
});


