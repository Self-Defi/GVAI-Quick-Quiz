// quiz.js
// GVAI Quick Quiz — fully client-side, no external dependencies.
// Features:
// - Randomized question order (persisted per session)
// - Progress tracker (answered/total + % + bar)
// - Dark mode toggle (saved)
// - Save/resume via LocalStorage (answers + quiz config + order)
// - 45-question pool, session uses 20/30/40
// - "Download PDF Results" = generates a results view + triggers browser Print-to-PDF

const STORAGE_KEY = "gvai_quiz_state_v2";
const THEME_KEY = "gvai_theme_v1";

// -------------------- Question Pool (45) --------------------
const QUESTION_POOL = [
  // Existing 20
  {
    id: 1,
    question: "What is the core purpose of GVAI (GraduationVaultsAI)?",
    options: {
      A: "To speculate on AI-related tokens and chase short-term yield.",
      B: "To give school-age students a guided way to learn how AI and digital infrastructure work together.",
      C: "To replace teachers with fully automated AI agents.",
      D: "To run high-frequency trading strategies for the school."
    },
    correct: "B",
    explanation:
      "GVAI is framed as an educational bridge — helping students understand how AI and digital infrastructure work together, not as a trading or speculation product."
  },
  {
    id: 2,
    question: "How is AI framed in the GVAI materials?",
    options: {
      A: "As a full replacement for human decision-making in all areas.",
      B: "As a tool that can assist, explain, and organize information — with humans still in control.",
      C: "As a way to automatically move funds between student vaults.",
      D: "As something students should never use in school."
    },
    correct: "B",
    explanation:
      "AI is consistently framed as an assistant and explainer. Humans — students, staff, and families — stay in control of decisions."
  },
  {
    id: 3,
    question: "Why is transparency important in systems like Graduation Vaults and GVAI?",
    options: {
      A: "So only the school can see what’s happening.",
      B: "To make it easier to hide how decisions are made.",
      C: "So students, families, and partners can see how things work and build trust over time.",
      D: "It’s not important as long as the tech is new and exciting."
    },
    correct: "C",
    explanation:
      "The vault model leans on transparency so everyone can see how things work, which builds long-term trust."
  },
  {
    id: 4,
    question: "When students use AI tools in this context, which behavior is most aligned with the program?",
    options: {
      A: "Copying full answers without reading or understanding them.",
      B: "Using AI to help summarize, plan, or break down complex ideas — then deciding what to keep.",
      C: "Letting AI make all personal, financial, and academic decisions.",
      D: "Sharing private passwords with AI apps to make things easier."
    },
    correct: "B",
    explanation:
      "Students are encouraged to use AI as a thinking aid — to clarify and structure ideas — not as a shortcut that replaces understanding."
  },
  {
    id: 5,
    question: "In the GVAI framing, what is the relationship between AI and human signers on a vault?",
    options: {
      A: "AI is one of the formal signers that approves on-chain transactions.",
      B: "AI can override human signers if it detects a better decision.",
      C: "AI can suggest, explain, or model options, but human signers still approve decisions.",
      D: "There are no human signers once AI is turned on."
    },
    correct: "C",
    explanation:
      "Vault signers remain human. AI can prepare information or options, but multi-sig approvals stay in human hands."
  },
  {
    id: 6,
    question: "Why does the program emphasize local, school-aligned AI guidance instead of random online advice?",
    options: {
      A: "Because online AI tools never work.",
      B: "To keep explanations consistent with the school’s policies, values, and safety expectations.",
      C: "To prevent students from using any outside resources.",
      D: "Because local tools are always smarter than global ones."
    },
    correct: "B",
    explanation:
      "Curated guidance keeps explanations aligned with school safety and expectations while staying useful."
  },
  {
    id: 7,
    question: "Which best describes how students should handle personal or sensitive information when using AI?",
    options: {
      A: "Type in full names, passwords, and account details so AI can personalize advice.",
      B: "Share screenshots of all financial and family documents.",
      C: "Avoid sharing private details and focus on general questions or examples.",
      D: "Let AI decide what is safe to share."
    },
    correct: "C",
    explanation:
      "Students should avoid sensitive data in AI tools; use generalized examples or non-identifying details."
  },
  {
    id: 8,
    question: "What is one educational goal of combining Graduation Vaults with AI explainers?",
    options: {
      A: "To teach students how to bypass school rules.",
      B: "To help students connect technical tools (vaults, multi-sig, records) with real-life financial and career planning.",
      C: "To keep families out of the loop.",
      D: "To automate grades and attendance."
    },
    correct: "B",
    explanation:
      "Students connect technical tools to real-world planning and long-term thinking."
  },
  {
    id: 9,
    question: "If a student is unsure whether an AI-generated answer is correct, what is the recommended next step?",
    options: {
      A: "Accept it anyway — AI is always right.",
      B: "Ignore it and never use AI again.",
      C: "Cross-check with trusted sources such as teachers, official materials, or multiple references.",
      D: "Ask a friend to copy their answer."
    },
    correct: "C",
    explanation:
      "AI responses should be checked against trusted humans and official resources."
  },
  {
    id: 10,
    question: "Why does the program highlight the difference between 'crypto speculation' and 'infrastructure building'?",
    options: {
      A: "Because speculation is the main focus.",
      B: "To make it clear that the work is about long-term systems, not gambling on price swings.",
      C: "To discourage any financial learning.",
      D: "To promote meme tokens."
    },
    correct: "B",
    explanation:
      "The emphasis is durable systems — dashboards, vault workflows, and governance — not trading."
  },
  {
    id: 11,
    question: "When experimenting with AI tools, what kind of questions are most encouraged for students?",
    options: {
      A: "Questions that help them understand concepts, processes, and options.",
      B: "Questions that trick AI or try to bypass filters.",
      C: "Questions asking AI to do their homework word-for-word.",
      D: "Questions about other students’ private information."
    },
    correct: "A",
    explanation:
      "Use AI to deepen understanding — 'how' and 'why' — not to bypass learning."
  },
  {
    id: 12,
    question: "How does AI support staff and leadership in the Graduation Vaults / GVAI ecosystem?",
    options: {
      A: "By secretly changing vault balances.",
      B: "By generating clear summaries, drafts, and checklists based on the school’s own materials.",
      C: "By replacing all staff meetings.",
      D: "By controlling which families are allowed to participate."
    },
    correct: "B",
    explanation:
      "AI can speed up clarity and communication — summaries, drafts, checklists — without replacing people."
  },
  {
    id: 13,
    question: "What is one benefit of keeping the quiz 100% client-side (local in the browser)?",
    options: {
      A: "It makes the quiz slower.",
      B: "It sends results to a central AI model for grading.",
      C: "It keeps responses private; nothing is uploaded or stored on a server.",
      D: "It prevents the quiz from working offline."
    },
    correct: "C",
    explanation:
      "Client-side means answers stay in the browser session/device — no backend, no telemetry."
  },
  {
    id: 14,
    question: "In the GVAI framing, what is a healthy mindset toward AI mistakes or hallucinations?",
    options: {
      A: "Assume they never happen.",
      B: "Use mistakes as a chance to double-check sources and improve questions.",
      C: "Blame the nearest person.",
      D: "Ignore them and keep copying outputs."
    },
    correct: "B",
    explanation:
      "Mistakes happen. Verify, refine prompts, and treat AI as a fallible assistant."
  },
  {
    id: 15,
    question: "Why is it useful to have a mind map alongside slides and video in the GVAI hub?",
    options: {
      A: "Mind maps look impressive but don’t help learning.",
      B: "They give a visual overview of how topics connect, which helps students see the bigger picture.",
      C: "They replace the need for any other resources.",
      D: "They are required to unlock the quiz."
    },
    correct: "B",
    explanation:
      "Mind maps show relationships between ideas so students see the system — not isolated facts."
  },
  {
    id: 16,
    question: "What’s the recommended way for students to use AI when planning long-term goals?",
    options: {
      A: "Ask AI to predict their entire future.",
      B: "Use AI to outline options, timelines, and questions to discuss with trusted adults.",
      C: "Let AI choose schools and jobs without human input.",
      D: "Avoid any planning; just focus on short-term tasks."
    },
    correct: "B",
    explanation:
      "AI can help outline options and questions; decisions are reviewed with trusted adults."
  },
  {
    id: 17,
    question: "How does 'Unlock Tomorrow. Today.' connect to GVAI?",
    options: {
      A: "It promises instant wealth.",
      B: "It means students skip learning and jump straight to results.",
      C: "It reflects using today’s tools (vaults + AI) to prepare for long-term opportunities.",
      D: "It only refers to graduation day itself."
    },
    correct: "C",
    explanation:
      "It’s about building future options by using current tools responsibly."
  },
  {
    id: 18,
    question: "Which best reflects responsible AI collaboration in the GVAI context?",
    options: {
      A: "Treating AI as a teammate that offers drafts and ideas, while humans make the final call.",
      B: "Treating AI as the boss that decides everything.",
      C: "Never questioning anything AI outputs.",
      D: "Using AI only for entertainment."
    },
    correct: "A",
    explanation:
      "AI supports; humans stay accountable."
  },
  {
    id: 19,
    question: "Why might schools prefer a curated AI experience instead of sending students directly to random public chatbots?",
    options: {
      A: "To completely block AI access.",
      B: "To align prompts, guardrails, and examples with school safety and learning goals.",
      C: "Because public tools cannot answer any questions.",
      D: "So students cannot learn how to prompt on their own."
    },
    correct: "B",
    explanation:
      "Curated experiences reduce risk and align with policies while teaching good prompting habits."
  },
  {
    id: 20,
    question: "After finishing the GVAI Quick Quiz, what is a powerful next step for a student?",
    options: {
      A: "Forget everything and move on.",
      B: "Share their score on social media with personal details.",
      C: "Note confusing topics and bring them to a teacher, mentor, or family conversation.",
      D: "Keep retaking the quiz until they memorize the letters."
    },
    correct: "C",
    explanation:
      "The quiz is a checkpoint; turn confusion into real questions with trusted humans."
  },

  // New 25 (21–45) — same tone, same mission
  {
    id: 21,
    question: "What is a core security rule in Self-Defi style systems?",
    options: {
      A: "Store seed phrases in shared group chats.",
      B: "Use multi-sig or clear custody controls for shared funds; never rely on blind trust.",
      C: "Give one person full control for speed.",
      D: "Use only closed-source wallets for convenience."
    },
    correct: "B",
    explanation:
      "Shared systems need shared control. Multi-sig and clear processes reduce single-point failure."
  },
  {
    id: 22,
    question: "Why do governance policies matter even for 'small' school systems?",
    options: {
      A: "They only matter at national scale.",
      B: "Policies define who can do what, when, and why — preventing chaos when people change roles.",
      C: "They slow things down and should be avoided.",
      D: "They are only legal paperwork."
    },
    correct: "B",
    explanation:
      "Governance is operational clarity: permissions, accountability, and continuity."
  },
  {
    id: 23,
    question: "Which action best fits 'verify, then trust' when using AI?",
    options: {
      A: "Use AI output as-is in official school docs.",
      B: "Cross-check claims against official school materials and revise before using.",
      C: "Assume AI is always accurate if it sounds confident.",
      D: "Avoid AI completely."
    },
    correct: "B",
    explanation:
      "AI drafts; humans verify and finalize."
  },
  {
    id: 24,
    question: "What is the best reason to keep this hub lightweight?",
    options: {
      A: "So it can’t be audited.",
      B: "So it loads fast, works on school devices, and reduces failure points.",
      C: "So it can hide features.",
      D: "So it requires a paid login."
    },
    correct: "B",
    explanation:
      "Lightweight = reliable deployment and fewer moving parts."
  },
  {
    id: 25,
    question: "What does 'client-side only' imply for data handling?",
    options: {
      A: "Answers are uploaded to a server automatically.",
      B: "The site tracks users with cookies.",
      C: "Logic runs in the browser; no backend is required to grade answers.",
      D: "The quiz cannot be used on phones."
    },
    correct: "C",
    explanation:
      "Everything runs locally in the browser; no server is needed for grading."
  },
  {
    id: 26,
    question: "What is a safe approach when an AI tool asks for account credentials?",
    options: {
      A: "Provide them if the tool has a nice UI.",
      B: "Provide them if the tool is popular.",
      C: "Never provide credentials; use non-sensitive examples and official login flows only.",
      D: "Provide them once, then change later."
    },
    correct: "C",
    explanation:
      "Credentials don’t belong in AI prompts. Use official login paths and minimal exposure."
  },
  {
    id: 27,
    question: "In infrastructure building, what’s more important than a flashy demo?",
    options: {
      A: "Buzzwords.",
      B: "Repeatable processes and clear ownership.",
      C: "Being first to market.",
      D: "Maximizing risk."
    },
    correct: "B",
    explanation:
      "Operational repeatability is what makes systems survive reality."
  },
  {
    id: 28,
    question: "Why would a school want dashboards for vault activity?",
    options: {
      A: "To create confusion.",
      B: "To improve transparency and reporting for stakeholders.",
      C: "To replace education with finance.",
      D: "To hide outcomes."
    },
    correct: "B",
    explanation:
      "Dashboards make activity understandable and auditable for families and staff."
  },
  {
    id: 29,
    question: "What is a responsible way to handle student privacy in public-facing tools?",
    options: {
      A: "Show full names and balances publicly.",
      B: "Hide or aggregate sensitive data and explain why.",
      C: "Let students decide individually without policy.",
      D: "Share everything for transparency."
    },
    correct: "B",
    explanation:
      "Privacy is a policy choice: protect students while still showing meaningful transparency."
  },
  {
    id: 30,
    question: "What does multi-sig mainly protect against?",
    options: {
      A: "Bad weather.",
      B: "One person making unilateral moves or losing access.",
      C: "All market volatility.",
      D: "Homework."
    },
    correct: "B",
    explanation:
      "Multi-sig reduces single-point failure and requires shared approvals."
  },
  {
    id: 31,
    question: "In a learning hub, why use a quiz instead of only a video?",
    options: {
      A: "Quizzes are only for grades.",
      B: "A quiz helps learners confirm understanding and identify gaps.",
      C: "Quizzes always prove someone is smart.",
      D: "Quizzes replace mentorship."
    },
    correct: "B",
    explanation:
      "Quizzes create feedback loops: what you know and what you need to revisit."
  },
  {
    id: 32,
    question: "Which is a safe 'next step' after learning a new tool?",
    options: {
      A: "Use it on real funds immediately.",
      B: "Practice with low-stakes examples and follow written procedures.",
      C: "Share access widely.",
      D: "Skip documentation."
    },
    correct: "B",
    explanation:
      "Practice first. Build confidence through repeatable procedures."
  },
  {
    id: 33,
    question: "What is the best definition of 'infrastructure' in this context?",
    options: {
      A: "A meme coin.",
      B: "The underlying tools, processes, and accountability that make systems work reliably.",
      C: "A marketing strategy.",
      D: "A one-time event."
    },
    correct: "B",
    explanation:
      "Infrastructure is how the system actually operates day-to-day."
  },
  {
    id: 34,
    question: "Why store quiz state locally?",
    options: {
      A: "To sell user data.",
      B: "To allow resume later without servers or accounts.",
      C: "To centralize analytics.",
      D: "To force logins."
    },
    correct: "B",
    explanation:
      "LocalStorage enables save/resume without any backend."
  },
  {
    id: 35,
    question: "What should a student do if they feel pressured to share private details online?",
    options: {
      A: "Share anyway to be helpful.",
      B: "Pause and consult a trusted adult/teacher and follow school policy.",
      C: "Post anonymously with details.",
      D: "Ask AI what to do and follow it."
    },
    correct: "B",
    explanation:
      "Pressure is a signal to stop and escalate to trusted humans under policy."
  },
  {
    id: 36,
    question: "What is a realistic role of AI in documentation?",
    options: {
      A: "Drafting outlines and clarifying language based on provided materials.",
      B: "Signing transactions.",
      C: "Making legal decisions alone.",
      D: "Replacing policy."
    },
    correct: "A",
    explanation:
      "AI can draft and clarify; humans approve and ensure correctness."
  },
  {
    id: 37,
    question: "What’s the biggest risk of 'one person controls everything' systems?",
    options: {
      A: "Too much transparency.",
      B: "Single point of failure (loss, misuse, or absence).",
      C: "Too many backups.",
      D: "Too much documentation."
    },
    correct: "B",
    explanation:
      "Single control fails when that one person fails. Shared control reduces this risk."
  },
  {
    id: 38,
    question: "Why do schools benefit from simple, clear UI?",
    options: {
      A: "So it looks less professional.",
      B: "So students and staff can use it quickly with fewer mistakes.",
      C: "So it hides features.",
      D: "So it blocks mobile devices."
    },
    correct: "B",
    explanation:
      "Simple UI reduces errors and increases adoption."
  },
  {
    id: 39,
    question: "What’s a best practice for learning from mistakes in tech systems?",
    options: {
      A: "Hide them.",
      B: "Blame the tool.",
      C: "Document what happened and improve the process.",
      D: "Ignore them."
    },
    correct: "C",
    explanation:
      "Process improvement is how systems mature."
  },
  {
    id: 40,
    question: "What is a healthy approach to 'security vs convenience'?",
    options: {
      A: "Always choose convenience.",
      B: "Always choose security even if it stops operations.",
      C: "Balance: prioritize security for critical actions; use convenience where risk is low.",
      D: "Let AI decide."
    },
    correct: "C",
    explanation:
      "Risk-based decisions: tighten controls for high-stakes actions."
  },
  {
    id: 41,
    question: "Why include a progress tracker?",
    options: {
      A: "To shame students.",
      B: "To help learners stay oriented and finish with confidence.",
      C: "To track identity.",
      D: "To increase ads."
    },
    correct: "B",
    explanation:
      "Progress improves completion and reduces overwhelm."
  },
  {
    id: 42,
    question: "What is the best reason to randomize question order?",
    options: {
      A: "To make the quiz unfair.",
      B: "To reduce memorization and encourage real understanding.",
      C: "To hide the correct answers.",
      D: "To increase loading times."
    },
    correct: "B",
    explanation:
      "Randomization reduces rote memorization and strengthens understanding."
  },
  {
    id: 43,
    question: "What is a responsible way to use AI for brainstorming?",
    options: {
      A: "Generate ideas, then evaluate them against goals, constraints, and policies.",
      B: "Take the first idea and ship it.",
      C: "Avoid evaluation.",
      D: "Ask AI to decide your values."
    },
    correct: "A",
    explanation:
      "AI can expand options; humans filter and decide using real constraints."
  },
  {
    id: 44,
    question: "When should a student involve a teacher or mentor?",
    options: {
      A: "Only when they get 100%.",
      B: "When they’re stuck, confused, or dealing with sensitive decisions.",
      C: "Never.",
      D: "Only after posting online."
    },
    correct: "B",
    explanation:
      "Mentorship matters most when decisions are sensitive or confusing."
  },
  {
    id: 45,
    question: "What is the best 'final takeaway' from the GVAI hub?",
    options: {
      A: "AI replaces learning.",
      B: "Infrastructure beats hype: build clear, secure, repeatable systems and verify what you use.",
      C: "Speculation is the goal.",
      D: "Privacy doesn’t matter."
    },
    correct: "B",
    explanation:
      "The core message is operational reality: clarity, security, repeatability, and verification."
  }
];

// -------------------- Utilities --------------------
function shuffleArray(arr, seed = null) {
  // Fisher-Yates; if seed provided, do deterministic shuffle.
  const a = arr.slice();
  let random = Math.random;

  if (seed !== null) {
    // Simple seeded PRNG (Mulberry32)
    let t = seed >>> 0;
    random = function () {
      t += 0x6D2B79F5;
      let x = t;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function nowISO() {
  return new Date().toISOString();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // If storage is blocked, app still works without persistence.
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

// -------------------- App State --------------------
let state = {
  version: 2,
  createdAt: nowISO(),
  updatedAt: nowISO(),
  quizSize: 20,
  seed: null,
  questionIds: [],
  answers: {},      // { [questionId]: "A" | "B" | "C" | "D" }
  graded: false,
  grade: null       // { correctCount, total, perQuestion: {id: {isCorrect, selected}} }
};

// -------------------- Quiz Building --------------------
function buildNewQuiz(quizSize) {
  const size = Math.max(1, Math.min(quizSize, QUESTION_POOL.length));
  const seed = (Date.now() >>> 0);

  // shuffle pool deterministically for this session, then take N
  const poolIds = QUESTION_POOL.map(q => q.id);
  const shuffledIds = shuffleArray(poolIds, seed);
  const selectedIds = shuffledIds.slice(0, size);

  state = {
    version: 2,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    quizSize: size,
    seed,
    questionIds: selectedIds,
    answers: {},
    graded: false,
    grade: null
  };

  saveState(state);
}

function getSessionQuestions() {
  const map = new Map(QUESTION_POOL.map(q => [q.id, q]));
  return state.questionIds.map(id => map.get(id)).filter(Boolean);
}

// -------------------- Render --------------------
function renderQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  const questions = getSessionQuestions();
  form.innerHTML = "";

  questions.forEach((q, index) => {
    const questionNumber = index + 1;

    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";
    questionDiv.dataset.questionId = String(q.id);

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

      // restore checked state
      if (state.answers[String(q.id)] === key) {
        input.checked = true;
      }

      input.addEventListener("change", () => {
        state.answers[String(q.id)] = key;
        state.updatedAt = nowISO();
        // if previously graded, un-grade until re-check
        state.graded = false;
        state.grade = null;
        saveState(state);
        updateProgress();
        // clear feedback for this question (so it doesn’t lie after changes)
        const feedbackEl = document.getElementById(`feedback-q${q.id}`);
        if (feedbackEl) {
          feedbackEl.textContent = "";
          feedbackEl.className = "quiz-feedback";
        }
        const summary = document.getElementById("quiz-summary");
        if (summary) {
          summary.hidden = true;
          summary.textContent = "";
        }
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

  updateProgress();
}

function updateProgress() {
  const questions = getSessionQuestions();
  const total = questions.length;
  let answered = 0;

  questions.forEach(q => {
    if (state.answers[String(q.id)]) answered++;
  });

  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);

  const textEl = document.getElementById("progress-text");
  const pctEl = document.getElementById("progress-percent");
  const fillEl = document.getElementById("progress-fill");
  const barEl = document.querySelector(".progress-bar");

  if (textEl) textEl.textContent = `Progress: ${answered} / ${total}`;
  if (pctEl) pctEl.textContent = `${percent}%`;
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (barEl) barEl.setAttribute("aria-valuenow", String(percent));
}

// -------------------- Grading --------------------
function gradeQuiz() {
  const questions = getSessionQuestions();
  let correctCount = 0;

  const perQuestion = {};

  questions.forEach((q) => {
    const selectedValue = state.answers[String(q.id)] || null;
    const feedbackEl = document.getElementById(`feedback-q${q.id}`);
    if (!feedbackEl) return;

    if (!selectedValue) {
      feedbackEl.textContent = "No answer selected yet.";
      feedbackEl.className = "quiz-feedback neutral";
      perQuestion[String(q.id)] = { isCorrect: false, selected: null };
      return;
    }

    const isCorrect = selectedValue === q.correct;
    if (isCorrect) {
      correctCount++;
      feedbackEl.textContent = `✅ Correct. ${q.explanation}`;
      feedbackEl.className = "quiz-feedback correct";
    } else {
      feedbackEl.textContent = `❌ Not quite. Correct answer: ${q.correct}). ${q.explanation}`;
      feedbackEl.className = "quiz-feedback incorrect";
    }

    perQuestion[String(q.id)] = { isCorrect, selected: selectedValue };
  });

  state.graded = true;
  state.grade = {
    correctCount,
    total: questions.length,
    perQuestion
  };
  state.updatedAt = nowISO();
  saveState(state);

  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = false;
    summary.textContent = `You answered ${correctCount} out of ${questions.length} correctly.`;
  }
}

function resetQuiz() {
  // keep same question order/seed; clear answers + grading
  state.answers = {};
  state.graded = false;
  state.grade = null;
  state.updatedAt = nowISO();
  saveState(state);

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

  updateProgress();
}

function startNewRandomQuiz() {
  const sizeSelect = document.getElementById("quiz-size");
  const size = sizeSelect ? parseInt(sizeSelect.value, 10) : 20;
  buildNewQuiz(size);
  if (sizeSelect) sizeSelect.value = String(state.quizSize);
  renderQuiz();
  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }
}

// -------------------- PDF (Print-to-PDF) --------------------
function downloadPdfResults() {
  // If not graded yet, grade first so results are meaningful.
  if (!state.graded) gradeQuiz();

  const questions = getSessionQuestions();
  const grade = state.grade || { correctCount: 0, total: questions.length, perQuestion: {} };
  const percent = grade.total ? Math.round((grade.correctCount / grade.total) * 100) : 0;

  const htmlTheme = document.documentElement.getAttribute("data-theme") || "light";

  // Create a temporary results window for printing
  const w = window.open("", "_blank");
  if (!w) {
    alert("Pop-up blocked. Please allow pop-ups to download the PDF results.");
    return;
  }

  const resultsRows = questions.map((q, idx) => {
    const key = String(q.id);
    const selected = (state.answers[key] || "—");
    const correct = q.correct;
    const isCorrect = selected !== "—" && selected === correct;

    return `
      <div class="row">
        <div class="q">
          <div class="qtitle">${idx + 1}. ${escapeHtml(q.question)}</div>
          <div class="meta">
            <span><strong>Your answer:</strong> ${escapeHtml(selected)}</span>
            <span><strong>Correct:</strong> ${escapeHtml(correct)}</span>
            <span class="${isCorrect ? "ok" : "bad"}">${isCorrect ? "Correct" : "Incorrect"}</span>
          </div>
          <div class="exp"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>
        </div>
      </div>
    `;
  }).join("");

  w.document.open();
  w.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>GVAI Quick Quiz Results</title>
        <style>
          :root{
            --bg:#ffffff; --text:#000; --muted:#333; --border:#ddd;
            --ok:#166534; --bad:#b91c1c; --nav:#0f304d;
          }
          body{ margin:0; font-family: system-ui, -apple-system, Segoe UI, sans-serif; background:var(--bg); color:var(--text); }
          .wrap{ max-width: 900px; margin: 0 auto; padding: 24px; }
          .head{ display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom: 2px solid var(--border); padding-bottom: 14px; }
          .brand{ display:flex; align-items:center; gap:10px; }
          .logo{ width:40px; height:40px; object-fit:contain; }
          h1{ margin:0; font-size: 18px; color: var(--nav); }
          .sub{ margin: 4px 0 0; color: var(--muted); font-size: 13px; }
          .score{ text-align:right; }
          .score .big{ font-size: 18px; font-weight: 900; color: var(--nav); }
          .score .small{ font-size: 12px; color: var(--muted); margin-top: 4px; }

          .row{ border:1px solid var(--border); border-radius: 12px; padding: 12px 14px; margin-top: 12px; }
          .qtitle{ font-weight: 800; margin-bottom: 8px; }
          .meta{ display:flex; flex-wrap:wrap; gap:10px; font-size: 12px; color: var(--muted); margin-bottom: 8px; }
          .ok{ color: var(--ok); font-weight: 900; }
          .bad{ color: var(--bad); font-weight: 900; }
          .exp{ font-size: 12px; color: var(--muted); line-height: 1.35; }

          .footer{ margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); color: var(--muted); font-size: 12px; }
          @media print { .printnote{display:none;} }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="head">
            <div class="brand">
              <img class="logo" src="/GVAI-Quick-Quiz/assets/self-defi-logo.png" alt="Self-Defi logo"/>
              <div>
                <h1>GVAI Quick Quiz — Results</h1>
                <div class="sub">Self-Defi • Digital Infrastructure Architect</div>
              </div>
            </div>
            <div class="score">
              <div class="big">${grade.correctCount}/${grade.total} (${percent}%)</div>
              <div class="small">Generated: ${escapeHtml(new Date().toLocaleString())}</div>
            </div>
          </div>

          <p class="printnote" style="margin:12px 0 0; color:#333; font-size:12px;">
            When the print dialog opens, choose <strong>Save as PDF</strong>.
          </p>

          ${resultsRows}

          <div class="footer">
            Powered by Self-Defi • This report is generated locally in your browser. No data is sent anywhere.
          </div>
        </div>

        <script>
          // Trigger print as "Download PDF" flow
          window.onload = () => window.print();
        </script>
      </body>
    </html>
  `);
  w.document.close();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// -------------------- Theme --------------------
function applyTheme(theme) {
  const t = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch {}
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
    return;
  }
  // default to system preference if available
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

// -------------------- Boot --------------------
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Load or initialize quiz state
  const saved = loadState();

  // Validate saved state
  if (saved && saved.version === 2 && Array.isArray(saved.questionIds) && typeof saved.answers === "object") {
    state = saved;

    // Ensure quizSize matches questionIds length (defensive)
    state.quizSize = state.questionIds.length || state.quizSize || 20;

    // Restore select value
    const sizeSelect = document.getElementById("quiz-size");
    if (sizeSelect) sizeSelect.value = String(state.quizSize);
  } else {
    // First run: build new quiz
    const sizeSelect = document.getElementById("quiz-size");
    const size = sizeSelect ? parseInt(sizeSelect.value, 10) : 20;
    buildNewQuiz(size);
    if (sizeSelect) sizeSelect.value = String(state.quizSize);
  }

  // Render
  renderQuiz();

  // Wire buttons
  const checkBtn = document.getElementById("check-answers");
  const resetBtn = document.getElementById("reset-quiz");
  const newBtn = document.getElementById("new-quiz");
  const dlBtn = document.getElementById("download-results");
  const themeBtn = document.getElementById("theme-toggle");
  const sizeSelect = document.getElementById("quiz-size");

  if (checkBtn) checkBtn.addEventListener("click", gradeQuiz);
  if (resetBtn) resetBtn.addEventListener("click", resetQuiz);
  if (newBtn) newBtn.addEventListener("click", startNewRandomQuiz);
  if (dlBtn) dlBtn.addEventListener("click", downloadPdfResults);

  if (sizeSelect) {
    sizeSelect.addEventListener("change", () => {
      // changing size creates a new quiz, by design (clean + consistent)
      startNewRandomQuiz();
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
});

